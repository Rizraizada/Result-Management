const pool = require("../db");

const SubjectConfig = {
  // Get all subjects
  getAll: () => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM subject_config", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Get subjects by class
  getByClass: (classLevel) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM subject_config WHERE class_level = ?",
        [classLevel],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  // Get subjects by class + group (optional)
  getByClassAndGroup: (classLevel, groupName) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM subject_config WHERE class_level = ? AND (group_name = ? OR group_name IS NULL)",
        [classLevel, groupName],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  // Create subject
  create: (data) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO subject_config SET ?", data, (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, ...data });
      });
    });
  },

  // Update subject
  update: (id, data) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE subject_config SET ? WHERE id = ?", [data, id], (err) => {
        if (err) return reject(err);
        resolve({ id, ...data });
      });
    });
  },

  // Delete subject
  delete: (id) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM subject_config WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};

module.exports = SubjectConfig;
