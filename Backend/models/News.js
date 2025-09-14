const pool = require('../db');

const News = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM news';
    pool.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
  
  add: (imagePath, title, description, callback) => {
    const sql = 'INSERT INTO news (image, title, description) VALUES (?, ?, ?)';
    pool.query(sql, [imagePath, title, description], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },
};

module.exports = News;
