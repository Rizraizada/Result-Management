const pool = require('../db');

const Notice = {
  getAllNotices: (callback) => {
    pool.query('SELECT * FROM notices', (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  getNoticeById: (id, callback) => {
    pool.query('SELECT * FROM notices WHERE id = ?', [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length === 0) {
        return callback(new Error('Notice not found'));
      }
      callback(null, results[0]);
    });
  },
  

  getNoticesByPage: (page, limit, callback) => {
    const offset = (page - 1) * limit;
    pool.query('SELECT * FROM notices LIMIT ? OFFSET ?', [limit, offset], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },

  searchNotices: (searchTerm, callback) => {
    pool.query(
      'SELECT * FROM notices WHERE title LIKE ? OR content LIKE ?',
      [`%${searchTerm}%`, `%${searchTerm}%`],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  },

  addNotice: (notice, callback) => {
    const { title, date, content, badge } = notice;
    pool.query(
      'INSERT INTO notices (title, date, content, badge) VALUES (?, ?, ?, ?)',
      [title, date, content, badge],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  },

  updateNotice: (id, notice, callback) => {
    const { title, date, content, badge } = notice;
    pool.query(
      'UPDATE notices SET title = ?, date = ?, content = ?, badge = ? WHERE id = ?',
      [title, date, content, badge, id],
      (err, results) => {
        if (err) {
          return callback(err);
        }
        callback(null, results);
      }
    );
  },

  deleteNotice: (id, callback) => {
    pool.query('DELETE FROM notices WHERE id = ?', [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }
};

module.exports = Notice;
