// Backend/routes/directorRoutes.js
const express = require('express');
const router = express.Router();
const { getAllDirectors, addDirector, upload } = require('../controllers/directorController');

// GET all directors
router.get('/', getAllDirectors);

// POST a new director with an image upload
router.post('/', upload.single('image'), addDirector);

module.exports = router;
