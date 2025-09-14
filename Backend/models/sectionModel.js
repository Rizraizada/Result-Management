const pool = require('../db');

const Section = {
  // Create a new section
  create: (sectionName, classId, total_male, total_female, total_students) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO sections 
        (sectionName, classId, total_male, total_female, total_students, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      pool.query(sql, [sectionName, classId, total_male, total_female, total_students], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Get all sections with class information
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          sections.id, 
          sections.sectionName, 
          sections.classId, 
          sections.total_male, 
          sections.total_female, 
          sections.total_students, 
          classes.className
        FROM sections 
        JOIN classes ON sections.classId = classes.id
      `;
      pool.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Update a section
  update: (id, sectionName, classId, total_male, total_female, total_students) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE sections 
        SET sectionName = ?, classId = ?, total_male = ?, total_female = ?, total_students = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      pool.query(sql, [sectionName, classId, total_male, total_female, total_students, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Delete a section
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM sections WHERE id = ?';
      pool.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Get sections by class
  getSectionsByClass: (classId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM sections WHERE classId = ?';
      pool.query(sql, [classId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};

module.exports = Section;
