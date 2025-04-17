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
    return StudentResults.executeQuery(query, [
      roll,
      className,
      section,
      year,
    ]).then((results) => (results.length > 0 ? results[0] : null));
  },

  searchStudentResult: ({
    student_name,
    roll,
    className,
    section,
    year,
    publish_date,
  }) => {
    const query = `
      SELECT * FROM student_results
      WHERE student_name = ? AND roll = ? AND class = ? AND section = ? AND year = ? AND publish_date = ?
    `;
    const params = [student_name, roll, className, section, year, publish_date];
    return StudentResults.executeQuery(query, params).then((results) =>
      results.length > 0 ? results[0] : null
    );
  },

  insertStudentResult: (data) => {
    const query = `
      INSERT INTO student_results (
        student_name, roll, class, section, year, publish_date,
        Bangla, English, Mathematics, Science, BGS, ICT, Religion,
        ArtsAndCrafts, PhysicalEdu, HomeScience, AgriculturalStudies,
        HigherMath, Physics, Chemistry, Biology,
        Accounting, FinanceBanking, BusinessStudies,
        Civics, History, Geography, Economics,
        total_marks, merit_position, failed_subjects
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const params = [
      data.student_name,
      data.roll,
      data.class,
      data.section,
      data.year,
      data.publish_date,
      data.Bangla,
      data.English,
      data.Mathematics,
      data.Science,
      data.BGS,
      data.ICT,
      data.Religion,
      data.ArtsAndCrafts,
      data.PhysicalEdu,
      data.HomeScience,
      data.AgriculturalStudies,
      data.HigherMath,
      data.Physics,
      data.Chemistry,
      data.Biology,
      data.Accounting,
      data.FinanceBanking,
      data.BusinessStudies,
      data.Civics,
      data.History,
      data.Geography,
      data.Economics,
      data.total_marks,
      data.merit_position,
      data.failed_subjects,
    ];
    return StudentResults.executeQuery(query, params);
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

    query += ` ORDER BY publish_date DESC LIMIT 1`; // Shows latest result if multiple

    return StudentResults.executeQuery(query, params).then((results) =>
      results.length > 0 ? results[0] : null
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

  bulkInsert: async (dataArray) => {
    const promises = dataArray.map((data) =>
      StudentResults.insertStudentResult(data)
    );
    return Promise.all(promises); // returns all inserted results
  },

  executeQuery: (query, params = []) => {
    return new Promise((resolve, reject) => {
      pool.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },
};

module.exports = StudentResults;