const pool = require('../db');

const User = {
  // Register a new user
  register: (username, password, full_name, role, phone, gender, expertise, address, position, description, plain_password, image) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users (username, password, full_name, role, phone, gender, expertise, address, position, description, plain_password, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
      pool.query(sql, [username, password, full_name, role, phone, gender, expertise, address, position, description, plain_password, image], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  // Find user by username
  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE username = ?';
      pool.query(sql, [username], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  },

  // Find user by ID
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      pool.query(sql, [id], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }

        // Return the first user if found, otherwise return null
        resolve(results.length > 0 ? results[0] : null);
      });
    });
  },


  // Get all users
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users';
      pool.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Update user
// Delete user
delete: (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    pool.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        return reject(new Error('User not found'));
      }
      resolve(result);
    });
  });
},

// Update user
update: (id, username, full_name, role, phone, gender, expertise, address, position, description, plain_password, image) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET username = ?, full_name = ?, role = ?, phone = ?, gender = ?, expertise = ?, address = ?, position = ?, description = ?, plain_password = ?, image = ?, updated_at = NOW() WHERE id = ?';
    pool.query(sql, [username, full_name, role, phone, gender, expertise, address, position, description, plain_password, image, id], (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        return reject(new Error('User not found'));
      }
      resolve(result);
    });
  });
},

};

module.exports = User;
