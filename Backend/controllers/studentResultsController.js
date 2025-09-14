const StudentResults = require("../models/StudentResults");
const xlsx = require("xlsx");
const excelDateToJSDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400 * 1000;
  const date_info = new Date(utc_value);
  return date_info.toISOString().slice(0, 10);
};

const preprocessDateFields = (data) => {
  const newData = { ...data };

  ['publish_date', 'created_at', 'updated_at'].forEach(field => {
    const value = newData[field];

    if (value == null || value === '') {
      newData[field] = null;
      return;
    }

    if (typeof value === 'number') {
      try {
        newData[field] = excelDateToJSDate(value);
      } catch {
        newData[field] = null;
      }
    } else if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        newData[field] = date.toISOString().slice(0, 10);
      } else {
        newData[field] = null;
      }
    } else {
      newData[field] = null;
    }
  });

  return newData;
};

const StudentResultsController = {
  getAll: async (req, res) => {
    try {
      const results = await StudentResults.getAllResults();
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch results", details: err.message });
    }
  },

  getByIdentifier: async (req, res) => {
    const { roll, class: className, section, year } = req.query;
    try {
      const result = await StudentResults.getResultByIdentifier({ roll, className, section, year });
      result ? res.json(result) : res.status(404).json({ message: "Result not found" });
    } catch (err) {
      res.status(500).json({ error: "Error fetching result", details: err.message });
    }
  },

  strictSearch: async (req, res) => {
    const { student_name, roll, class: className, section, year, publish_date } = req.body;
    try {
      const result = await StudentResults.searchStudentResult({ student_name, roll, className, section, year, publish_date });
      result ? res.json(result) : res.status(404).json({ message: "Result not found" });
    } catch (err) {
      res.status(500).json({ error: "Error searching result", details: err.message });
    }
  },

  searchFlexible: async (req, res) => {
    const { student_name, roll, year } = req.query;
    try {
      const result = await StudentResults.searchStudentResultFlexible({ student_name, roll, year });
      result ? res.json(result) : res.status(404).json({ message: "Result not found" });
    } catch (err) {
      res.status(500).json({ error: "Error in flexible search", details: err.message });
    }
  },

  getByClassAndYear: async (req, res) => {
    const { class: className, year } = req.query;
    try {
      const results = await StudentResults.getResultsByClassAndYear(className, year);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch results", details: err.message });
    }
  },

  getGroupedSummary: async (req, res) => {
    try {
      const results = await StudentResults.getAllResults();
      const grouped = {};
      results.forEach(({ class: className, section, year, ...rest }) => {
        grouped[className] = grouped[className] || {};
        grouped[className][section] = grouped[className][section] || {};
        grouped[className][section][year] = grouped[className][section][year] || [];
        grouped[className][section][year].push({ class: className, section, year, ...rest });
      });
      res.json(grouped);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch grouped summary", details: err.message });
    }
  },

  insertResult: async (req, res) => {
    try {
      const dataToInsert = preprocessDateFields(req.body);
      const inserted = await StudentResults.insertStudentResult(dataToInsert);
      res.status(201).json({ message: "Result inserted successfully", inserted });
    } catch (err) {
      res.status(500).json({ error: "Failed to insert result", details: err.message });
    }
  },

  updateResult: async (req, res) => {
    const { id } = req.params;
    try {
      const dataToUpdate = preprocessDateFields(req.body);
      const updated = await StudentResults.updateStudentResult(id, dataToUpdate);
      updated.affectedRows === 0
        ? res.status(404).json({ message: "Result not found or no changes applied" })
        : res.json({ message: "Result updated successfully", updated });
    } catch (err) {
      res.status(500).json({ error: "Failed to update result", details: err.message });
    }
  },

  deleteResult: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await StudentResults.deleteStudentResult(id);
      deleted.affectedRows === 0
        ? res.status(404).json({ message: "Result not found" })
        : res.json({ message: "Result deleted successfully", deleted });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete result", details: err.message });
    }
  },

  bulkInsertResults: async (req, res) => {
    try {
      const processedResults = req.body.map(preprocessDateFields);
      const { results: successResults, errors } = await StudentResults.bulkInsert(processedResults);
      errors.length > 0
        ? res.status(207).json({ message: "Bulk insert completed with some errors", successful: successResults.length, failed: errors.length, errors })
        : res.status(201).json({ message: "Bulk insert successful", insertedCount: successResults.length });
    } catch (err) {
      res.status(500).json({ error: "Bulk insert failed", details: err.message });
    }
  },

  bulkDelete: async (req, res) => {
    const { ids } = req.body; // Expect an array of IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid or empty array of IDs provided for bulk deletion." });
    }
    try {
      const deleted = await StudentResults.bulkDeleteResults(ids);
      deleted.affectedRows === 0
        ? res.status(404).json({ message: "No results found with the provided IDs or no changes applied" })
        : res.json({ message: `${deleted.affectedRows} results deleted successfully.`, deleted });
    } catch (err) {
      res.status(500).json({ error: "Failed to perform bulk deletion", details: err.message });
    }
  },

  processExcelUpload: async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let data = xlsx.utils.sheet_to_json(worksheet);
      if (data.length === 0) return res.status(400).json({ error: "Excel file has no data" });
      data = data.map(preprocessDateFields);
      const { results: successResults, errors } = await StudentResults.bulkInsert(data);
      errors.length > 0
        ? res.status(207).json({ message: "File processed with some errors", successful: successResults.length, failed: errors.length, errors })
        : res.status(201).json({ message: "File uploaded and all results saved successfully", insertedCount: successResults.length });
    } catch (err) {
      res.status(500).json({ error: "Failed to process Excel file", details: err.message });
    }
  }
};

module.exports = StudentResultsController;
