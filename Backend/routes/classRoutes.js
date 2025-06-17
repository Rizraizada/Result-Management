const express = require('express');
const router = express.Router();
const { 
  createClass, 
  getAllClasses, 
  editClassById, 
  deleteClass 
} = require('../controllers/classController');

// Route to create a class
router.post('/', createClass);

// Route to get all classes
router.get('/', getAllClasses);

// Route to update a class
router.put('/:id', editClassById);

// Route to delete a class by ID
router.delete('/:id', deleteClass);

module.exports = router;
