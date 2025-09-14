// activitiesController.js
const pool = require('../db');
const Activities = require('../models/Activities');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const getActivities = (req, res) => {
  Activities.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch activities from database' });
    }
    res.json(results);
  });
};

const addActivities = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const imagePath = `/uploads/${req.file.filename}`;
  const { title, date, author } = req.body;

  Activities.add(imagePath, title, date, author, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding activity', error: err });
    }
    return res.status(201).json({ message: 'Activity added successfully', data: result });
  });
};

module.exports = {
  getActivities,
  addActivities,
  upload,
};
