// Backend/models/Director.js
const pool = require('../db'); // Database connection

const Director = {
  // Get all directors, with optional filtering by committee
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

  // Add a new director
  add: (imagePath, name, position, details, committee, callback) => {
    const sql = 'INSERT INTO board_of_directors (image_url, name, position, details, committee) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [imagePath, name, position, details, committee], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },
};

module.exports = Director;
