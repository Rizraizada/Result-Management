const express = require('express');
const router = express.Router();
const { getAllDirectors, addDirector, getDirectorById, updateDirector, deleteDirector } = require('../controllers/directorController');

// GET all directors
router.get('/', getAllDirectors);

// GET director by ID
router.get('/:id', getDirectorById);

// POST a new director (image handled in controller)
router.post('/', addDirector);

// PUT update director
router.put('/:id', updateDirector);

// DELETE director
router.delete('/:id', deleteDirector);

module.exports = router;
