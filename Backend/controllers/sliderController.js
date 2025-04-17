const pool = require('../db'); // Import the pool from db.js
const Slider = require('../models/sliderModel');
const upload = require('../multerConfig');  // Import Multer configuration

// Get all slider images
const getSliderImages = (req, res) => {
  const query = 'SELECT id, image FROM slider';
  pool.query(query, (err, images) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch images from database' });
    }

    // Prepend /uploads/ to the image filename for the relative URL
    const formattedImages = images.map(row => ({
      id: row.id,
      image: `/uploads/${row.image.trim()}`  // Ensure no double /uploads/
    }));

    res.json(formattedImages);
  });
};

// Add a new slider image
const addSlider = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const imagePath = `${req.file.filename}`;  // Store relative path in DB

  const query = 'INSERT INTO slider (image) VALUES (?)';
  pool.query(query, [imagePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding slider', error: err });
    }
    res.status(201).json({ message: 'Slider added successfully', data: result });
  });
};

// Edit an existing slider image
const editSlider = (req, res) => {
  const { id } = req.body;  // Get the slider ID from the request body
  let imagePath;

  // Check if a new image file is uploaded
  if (req.file) {
    imagePath = req.file.filename;  // Store only the filename in DB
  } else if (req.body.imagePath) {
    imagePath = req.body.imagePath;  // If no file uploaded, use the provided image path
  }

  // If no image is provided, return an error
  if (!imagePath) {
    return res.status(400).json({ message: 'No image file or image path provided' });
  }

  // Update the slider with the new image path (filename)
  const query = 'UPDATE slider SET image = ? WHERE id = ?';
  pool.query(query, [imagePath, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating slider', error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Slider updated successfully' });
    } else {
      res.status(404).json({ message: 'Slider not found' });
    }
  });
};

// Delete a slider image
const deleteSlider = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM slider WHERE id = ?';
  pool.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting slider', error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Slider deleted successfully' });
    } else {
      res.status(404).json({ message: 'Slider not found' });
    }
  });
};

module.exports = { getSliderImages, addSlider, editSlider, deleteSlider, upload };
