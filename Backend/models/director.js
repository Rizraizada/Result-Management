// Backend/models/Director.js
const pool = require('../db'); // Database connection

const Director = {
  // Get all directors
  getAll: (committee, callback) => {
    let sql = 'SELECT * FROM board_of_directors';
    const params = [];

    if (committee) {
      sql += ' WHERE committee = ?';
      params.push(committee);
    }

    pool.query(sql, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // Get director by ID
  getById: (id, callback) => {
    const sql = 'SELECT * FROM board_of_directors WHERE id = ?';
    pool.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0 ? results[0] : null);
    });
  },

  // Add a new director
  add: (imagePath, name, position, details, description, committee, callback) => {
    const sql = 'INSERT INTO board_of_directors (image_url, name, position, details, description, committee, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())';
    pool.query(sql, [imagePath, name, position, details, description, committee], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  // Update director
  update: (id, imagePath, name, position, details, description, committee, callback) => {
    let sql = 'UPDATE board_of_directors SET name = ?, position = ?, details = ?, description = ?, committee = ?, updated_at = NOW()';
    let params = [name, position, details, description, committee];

    // Only update image if new one is provided
    if (imagePath) {
      sql += ', image_url = ?';
      params.push(imagePath);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    pool.query(sql, params, (err, result) => {
      if (err) return callback(err);
      if (result.affectedRows === 0) {
        return callback(new Error('Director not found'));
      }
      callback(null, result);
    });
  },

  // Delete director
  delete: (id, callback) => {
    const sql = 'DELETE FROM board_of_directors WHERE id = ?';
    pool.query(sql, [id], (err, result) => {
      if (err) return callback(err);
      if (result.affectedRows === 0) {
        return callback(new Error('Director not found'));
      }
      callback(null, result);
    });
  }
};

module.exports = Director;