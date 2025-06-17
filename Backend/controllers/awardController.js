const pool = require('../db'); // Import the database pool
const upload = require('../multerConfig'); // Import Multer for file uploads

// Get all awards
const getAwards = (req, res) => {
  const query = 'SELECT id, title, subtitle, image FROM awards';
  pool.query(query, (err, awards) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch awards from database' });
    }

    // Format the image paths to include the /uploads prefix
    const formattedAwards = awards.map(row => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      image: `/uploads/${row.image.trim()}` // Trim to avoid double /uploads/
    }));

    res.json(formattedAwards);
  });
};

// Add a new award
const addAward = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const { title, subtitle } = req.body;
  const imagePath = req.file.filename; // Only store the filename in the DB

  const query = 'INSERT INTO awards (title, subtitle, image) VALUES (?, ?, ?)';
  pool.query(query, [title, subtitle, imagePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding award', error: err });
    }
    res.status(201).json({ message: 'Award added successfully', data: result });
  });
};

// Edit an existing award
const editAward = (req, res) => {
  const { id, title, subtitle } = req.body;
  let imagePath;

  // If a new image is uploaded, use that; otherwise, use the provided image path
  if (req.file) {
    imagePath = req.file.filename; // Store only the filename
  } else if (req.body.imagePath) {
    imagePath = req.body.imagePath;
  }

  // If no image file or path is provided, return an error
  if (!imagePath) {
    return res.status(400).json({ message: 'No image file or image path provided' });
  }

  const query = 'UPDATE awards SET title = ?, subtitle = ?, image = ? WHERE id = ?';
  pool.query(query, [title, subtitle, imagePath, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating award', error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Award updated successfully' });
    } else {
      res.status(404).json({ message: 'Award not found' });
    }
  });
};

// Delete an award
const deleteAward = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM awards WHERE id = ?';
  pool.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting award', error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Award deleted successfully' });
    } else {
      res.status(404).json({ message: 'Award not found' });
    }
  });
};

module.exports = { getAwards, addAward, editAward, deleteAward, upload };
