const pool = require('../db');

const Branch = {
  getAll: (branch_name, callback) => {
    let sql = 'SELECT * FROM branch';
    const params = [];

    if (branch_name) {
      sql += ' WHERE branch_name LIKE ?';
      params.push(`%${branch_name}%`);
    }

    pool.query(sql, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  add: (imagePath, branch_name, branch_address, branch_email, branch_incharge, branch_phone, callback) => {
    const sql = 'INSERT INTO branch (image_url, branch_name, branch_address, branch_email, branch_incharge, branch_phone) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(sql, [imagePath, branch_name, branch_address, branch_email, branch_incharge, branch_phone], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },
};


module.exports = Branch;
