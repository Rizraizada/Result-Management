const pool = require("../db");

const StudentResults = {
  getAllResults: () => {
    const query = `
      SELECT * FROM student_results
      ORDER BY year DESC, class, section, roll;
    `;
    return StudentResults.executeQuery(query);
  },

  getResultByIdentifier: ({ roll, className, section, year }) => {
    const query = `
      SELECT * FROM student_results
      WHERE roll = ? AND class = ? AND section = ? AND year = ?;
    `;
    return StudentResults.executeQuery(query, [roll, className, section, year]).then(
      (results) => (results.length > 0 ? results[0] : null)
    );
  },

  searchStudentResult: ({ student_name, roll, className, section, year, publish_date }) => {
    const query = `
      SELECT * FROM student_results
      WHERE student_name = ? AND roll = ? AND class = ? AND section = ? AND year = ? AND publish_date = ?
    `;
    const params = [student_name, roll, className, section, year, publish_date];
    return StudentResults.executeQuery(query, params).then((results) =>
      results.length > 0 ? results[0] : null
    );
  },

  insertStudentResult: async (data) => {
    const validColumns = [
      'student_name', 'father_name', 'mother_name', 'guardian_phone',
      'roll', 'class', 'section', 'group_name',
      'exam_name', 'year', 'session', 'publish_date',

      'merit_position', 'gpa', 'failed_subjects', 'remarks', 'total_marks',

      'Bangla_1st_CQ', 'Bangla_1st_MCQ', 'Bangla_2nd_CQ', 'Bangla_2nd_MCQ',
      'English_1st_CQ', 'English_2nd_CQ',

      'Mathematics_CQ', 'Mathematics_MCQ',
      'Science_CQ', 'Science_MCQ',

      'Physics_CQ', 'Physics_MCQ', 'Physics_Practical',
      'Chemistry_CQ', 'Chemistry_MCQ', 'Chemistry_Practical',
      'Biology_CQ', 'Biology_MCQ', 'Biology_Practical',
      'HigherMath_CQ', 'HigherMath_MCQ', 'HigherMath_Practical',

      'Accounting_CQ', 'Accounting_MCQ',
      'BusinessEnt_CQ', 'BusinessEnt_MCQ',
      'Finance_CQ', 'Finance_MCQ',

      'History_CQ', 'History_MCQ',
      'Civics_CQ', 'Civics_MCQ',
      'Geography_CQ', 'Geography_MCQ', 'Geography_Practical',
      'Economics_CQ', 'Economics_MCQ',

      'BGS_CQ', 'BGS_MCQ',
      'ICT_CQ', 'ICT_MCQ', 'ICT_Practical',

      'Religion_Name', 'Religion_CQ', 'Religion_MCQ',

      'Optional_Subject_Name', 'Optional_CQ', 'Optional_MCQ', 'Optional_Practical',
      'continuous_assessment', 'is_passed',

      // ✅ Added new subjects
      'ArtsCrafts_Assessment',
      'PhysicalEd_Practical',
      'PhysicalEd_Assessment'
    ];

    const fields = Object.keys(data).filter((key) => validColumns.includes(key));
    const values = fields.map((field) => data[field]);

    if (fields.length === 0) {
      throw new Error("No valid fields provided for insertion");
    }

    const placeholders = fields.map(() => "?").join(", ");
    const query = `INSERT INTO student_results (${fields.join(", ")}) VALUES (${placeholders})`;

    return StudentResults.executeQuery(query, values);
  },

  updateStudentResult: (id, data) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const query = `UPDATE student_results SET ${setClause} WHERE id = ?`;
    return StudentResults.executeQuery(query, [...values, id]);
  },

  deleteStudentResult: (id) => {
    const query = `DELETE FROM student_results WHERE id = ?`;
    return StudentResults.executeQuery(query, [id]);
  },

  getResultsByClassAndYear: (className, year) => {
    const query = `
      SELECT * FROM student_results
      WHERE class = ? AND year = ?
      ORDER BY section, roll;
    `;
    return StudentResults.executeQuery(query, [className, year]);
  },

  searchStudentResultFlexible: ({ student_name, roll, year }) => {
    let query = `SELECT * FROM student_results WHERE 1=1`;
    const params = [];

    if (student_name) {
      query += ` AND student_name LIKE ?`;
      params.push(`%${student_name}%`);
    }

    if (roll) {
      query += ` AND roll = ?`;
      params.push(roll);
    }

    if (year) {
      query += ` AND year = ?`;
      params.push(year);
    }

    query += ` ORDER BY publish_date DESC LIMIT 1`;

    return StudentResults.executeQuery(query, params).then(
      (results) => (results.length > 0 ? results[0] : null)
    );
  },

  getGroupedClassSectionYear: async () => {
    const query = `
      SELECT DISTINCT class, section, year
      FROM student_results
      ORDER BY class, section, year DESC;
    `;
    return StudentResults.executeQuery(query);
  },

  bulkDeleteResults: (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("No IDs provided for bulk deletion.");
    }
    const placeholders = ids.map(() => '?').join(',');
    const query = `DELETE FROM student_results WHERE id IN (${placeholders})`;
    return StudentResults.executeQuery(query, ids);
  },

  bulkInsert: async (dataArray) => {
    const results = [];
    const errors = [];

    for (let i = 0; i < dataArray.length; i++) {
      try {
        const res = await StudentResults.insertStudentResult(dataArray[i]);
        results.push(res);
      } catch (error) {
        errors.push({ index: i, error: error.message, data: dataArray[i] });
      }
    }

    return { results, errors };
  },

  executeQuery: (query, params = []) => {
    return new Promise((resolve, reject) => {
      pool.query(query, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
};

module.exports = StudentResults;
