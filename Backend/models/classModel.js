const pool = require('../db');

const Class = {
  // Create a new class
  create: (className) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO classes (className, created_at, updated_at) VALUES (?, NOW(), NOW())';
      pool.query(sql, [className], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Get all classes
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM classes';
      pool.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Edit (update) a class by ID
  update: (id, className) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE classes SET className = ?, updated_at = NOW() WHERE id = ?';
      pool.query(sql, [className, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Delete a class
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM classes WHERE id = ?';
      pool.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};

module.exports = Class;