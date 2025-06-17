const pool = require('../db');

const TeacherSection = {
  // Assign a section to a teacher
  create: (teacherId, sectionId, isPrimary = false) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO teacher_sections (user_id, section_id, is_primary) VALUES (?, ?, ?)';
      pool.query(sql, [teacherId, sectionId, isPrimary], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Get all sections assigned to a specific teacher
  getAssignedSections: (teacherId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT ts.*, s.sectionName, c.className 
        FROM teacher_sections ts
        JOIN sections s ON ts.section_id = s.id
        JOIN classes c ON s.classId = c.id
        WHERE ts.user_id = ?
      `;
      pool.query(sql, [teacherId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Update an assigned section (for example, to change the primary status or section details)
  update: (id, updateData) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE teacher_sections SET ? WHERE id = ?';
      pool.query(sql, [updateData, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Delete a section assignment for a teacher
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM teacher_sections WHERE id = ?';
      pool.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Get a specific section assignment by ID (including section and class information)
  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT ts.*, s.sectionName, c.className, u.username as teacherName
        FROM teacher_sections ts
        JOIN sections s ON ts.section_id = s.id
        JOIN classes c ON s.classId = c.id
        JOIN users u ON ts.user_id = u.id
        WHERE ts.id = ?
      `;
      pool.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
};

module.exports = TeacherSection;
