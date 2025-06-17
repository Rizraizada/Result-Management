// Backend/controllers/directorController.js
const Director = require('../models/director');
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads')); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Get all directors, with optional committee filter
const getAllDirectors = (req, res) => {
  const committee = req.query.committee;

  Director.getAll(committee, (err, results) => {
    if (err) {
      console.error('Error fetching directors:', err);
      return res.status(500).json({ error: 'Failed to fetch directors' });
    }
    res.json(results);
  });
};

// Add a new director
const addDirector = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Image upload error:', err);
      return res.status(400).json({ message: 'Image upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const { name, position, details, committee } = req.body;

    if (!name || !position || !details || !committee) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    Director.add(imagePath, name, position, details, committee, (err, result) => {
      if (err) {
        console.error('Error adding director:', err);
        return res.status(500).json({ error: 'Failed to add director' });
      }
      res.status(201).json({ message: 'Director added successfully', data: { insertId: result.insertId } });
    });
  });
};

module.exports = { getAllDirectors, addDirector, upload };
