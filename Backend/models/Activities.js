const pool = require('../db'); // Import the database pool

const Activities = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM activities'; // SQL query to fetch all awards
    pool.query(sql, (err, results) => {
      if (err) return callback(err); // Handle error
      callback(null, results); // Return results
    });
  },
  
  add: (imagePath, title, subtitle, callback) => {
    const sql = 'INSERT INTO activities (image, title, date, author) VALUES (?, ?, ? ,?)';
    pool.query(sql, [imagePath, title, subtitle], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },
};

module.exports = Activities;
