const pool = require('../db'); // Import database pool

const Gallery = {
  // Fetch all gallery items
  getAll: (callback) => {
    const query = 'SELECT id, image, title, description, category FROM gallery';
    pool.query(query, callback);
  },

  // Fetch a single gallery item by ID
  getById: (id, callback) => {
    const query = 'SELECT id, image, title, description, category FROM gallery WHERE id = ?';
    pool.query(query, [id], callback);
  },

  // Add a new gallery item
  create: (data, callback) => {
    const { image, title, description, category } = data;
    const query = 'INSERT INTO gallery (image, title, description, category) VALUES (?, ?, ?, ?)';
    pool.query(query, [image, title, description, category], callback);
  },

  // Update an existing gallery item
  update: (id, data, callback) => {
    const { image, title, description, category } = data;
    const query = 'UPDATE gallery SET image = ?, title = ?, description = ?, category = ? WHERE id = ?';
    pool.query(query, [image, title, description, category, id], callback);
  },

  // Delete a gallery item
  delete: (id, callback) => {
    const query = 'DELETE FROM gallery WHERE id = ?';
    pool.query(query, [id], callback);
  },
};

module.exports = Gallery;
