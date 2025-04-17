const StudentResults = require('../models/StudentResults');
const xlsx = require('xlsx'); // Add this package for Excel processing

const StudentResultsController = {
  // Get all results
  getAll: async (req, res) => {
    try {
      const results = await StudentResults.getAllResults();
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch results', details: err });
    }
  },

  // Get result by unique identifier
  getByIdentifier: async (req, res) => {
    const { roll, class: className, section, year } = req.query;
    try {
      const result = await StudentResults.getResultByIdentifier({ roll, className, section, year });
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ message: 'Result not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error fetching result', details: err });
    }
  },

  // Strict search (all fields must match)
  strictSearch: async (req, res) => {
    const { student_name, roll, class: className, section, year, publish_date } = req.body;
    try {
      const result = await StudentResults.searchStudentResult({ student_name, roll, className, section, year, publish_date });
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ message: 'Result not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error searching result', details: err });
    }
  },

  // Flexible search (name, roll, year)
  searchFlexible: async (req, res) => {
    const { student_name, roll, year } = req.query;
    try {
      const result = await StudentResults.searchStudentResultFlexible({ student_name, roll, year });
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ message: 'Result not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error in flexible search', details: err });
    }
  },

  // Get result by class and year
  getByClassAndYear: async (req, res) => {
    const { class: className, year } = req.query;
    try {
      const results = await StudentResults.getResultsByClassAndYear(className, year);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch results', details: err });
    }
  },

  getGroupedSummary: async (req, res) => {
    try {
      const query = `
        SELECT 
          student_name, roll, class, section, year, publish_date,
          Bangla, English, Mathematics, Science, BGS, ICT, Religion,
          ArtsAndCrafts, PhysicalEdu, HomeScience, AgriculturalStudies,
          HigherMath, Physics, Chemistry, Biology,
          Accounting, FinanceBanking, BusinessStudies,
          Civics, History, Geography, Economics,
          total_marks, merit_position, failed_subjects
        FROM student_results
      `;
  
      const results = await StudentResults.executeQuery(query);
  
      const grouped = {};
  
      results.forEach((student) => {
        const { class: className, section, year } = student;
  
        if (!grouped[className]) grouped[className] = {};
        if (!grouped[className][section]) grouped[className][section] = {};
        if (!grouped[className][section][year]) grouped[className][section][year] = [];
  
        grouped[className][section][year].push(student);
      });
  
      res.json(grouped);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch grouped summary', details: err });
    }
  },
  
  // Insert new student result
  insertResult: async (req, res) => {
    try {
      const inserted = await StudentResults.insertStudentResult(req.body);
      res.status(201).json({ message: 'Result inserted successfully', inserted });
    } catch (err) {
      res.status(500).json({ error: 'Failed to insert result', details: err });
    }
  },
  
  // Update student result
  updateResult: async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await StudentResults.updateStudentResult(id, req.body);
      res.json({ message: 'Result updated successfully', updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update result', details: err });
    }
  },

  // Delete student result
  deleteResult: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await StudentResults.deleteStudentResult(id);
      res.json({ message: 'Result deleted successfully', deleted });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete result', details: err });
    }
  },

  // Bulk insert student results (Excel)
  bulkInsertResults: async (req, res) => {
    const results = req.body; // Expecting an array of student result objects
    try {
      const inserted = await StudentResults.bulkInsert(results);
      res.status(201).json({ message: 'Bulk insert successful', insertedCount: inserted.length });
    } catch (err) {
      res.status(500).json({ error: 'Bulk insert failed', details: err });
    }
  },

  // Process Excel file upload
  processExcelUpload: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Read the Excel file
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      if (data.length === 0) {
        return res.status(400).json({ error: 'Excel file has no data' });
      }
      
      // Validate and normalize data
      const studentResults = data.map(row => {
        // Calculate total marks if not provided
        if (!row.total_marks && typeof row.total_marks !== 'number') {
          const subjectFields = [
            'Bangla', 'English', 'Mathematics', 'Science', 'BGS', 'ICT', 'Religion',
            'ArtsAndCrafts', 'PhysicalEdu', 'HomeScience', 'AgriculturalStudies',
            'HigherMath', 'Physics', 'Chemistry', 'Biology',
            'Accounting', 'FinanceBanking', 'BusinessStudies',
            'Civics', 'History', 'Geography', 'Economics'
          ];
          
          let total = 0;
          let failedSubjects = [];
          
          subjectFields.forEach(subject => {
            if (row[subject] && typeof row[subject] === 'number') {
              total += row[subject];
              
              // Assuming below 33 is a failing grade
              if (row[subject] < 33) {
                failedSubjects.push(subject);
              }
            }
          });
          
          row.total_marks = total;
          row.failed_subjects = failedSubjects.join(',');
        }
        
        // Set publish date if not provided
        if (!row.publish_date) {
          row.publish_date = new Date().toISOString().split('T')[0];
        }
        
        return row;
      });
      
      // Use the existing bulk insert method
      const inserted = await StudentResults.bulkInsert(studentResults);
      
      res.status(201).json({ 
        message: 'File uploaded and results saved successfully',
        insertedCount: inserted.length 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process Excel file', details: err.message });
    }
  }
};

module.exports = StudentResultsController;