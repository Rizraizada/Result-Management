const Director = require('../models/director');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for file uploads (keep this one)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ------------------- CONTROLLERS -------------------

// Get all directors
const getAllDirectors = (req, res) => {
  const committee = req.query.committee;
  Director.getAll(committee, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch directors' });
    res.json({ message: 'Directors retrieved successfully', data: results });
  });
};

// Get director by ID
const getDirectorById = (req, res) => {
  const { id } = req.params;
  Director.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch director' });
    if (!result) return res.status(404).json({ error: 'Director not found' });
    res.json({ message: 'Director retrieved successfully', data: result });
  });
};

// Add a new director
const addDirector = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: 'Image upload failed: ' + err.message });
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const imagePath = `/uploads/${req.file.filename}`;
    const { name, position, details, description, committee } = req.body;

    if (!name || !position || !details || !committee) {
      return res.status(400).json({ message: 'Name, position, details, and committee are required' });
    }

    Director.add(imagePath, name, position, details, description || '', committee, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to add director' });
      res.status(201).json({ message: 'Director added successfully', data: { insertId: result.insertId } });
    });
  });
};

// Update director
const updateDirector = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: 'Image upload failed: ' + err.message });

    const { id } = req.params;
    const { name, position, details, description, committee } = req.body;

    if (!name || !position || !details || !committee) {
      return res.status(400).json({ message: 'Name, position, details, and committee are required' });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      // delete old image
      Director.getById(id, (err, oldDirector) => {
        if (!err && oldDirector && oldDirector.image_url) {
          const oldImagePath = path.join(__dirname, '..', oldDirector.image_url);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
      });
    }

    Director.update(id, imagePath, name, position, details, description || '', committee, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update director' });
      res.json({ message: 'Director updated successfully' });
    });
  });
};

// Delete director
const deleteDirector = (req, res) => {
  const { id } = req.params;
  Director.getById(id, (err, director) => {
    if (err) return res.status(500).json({ error: 'Failed to delete director' });
    if (!director) return res.status(404).json({ error: 'Director not found' });

    Director.delete(id, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete director' });

      if (director.image_url) {
        const imagePath = path.join(__dirname, '..', director.image_url);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      res.json({ message: 'Director deleted successfully' });
    });
  });
};

module.exports = {
  getAllDirectors,
  getDirectorById,
  addDirector,
  updateDirector,
  deleteDirector,
  upload
};
