const ClassModel = require('../models/classModel');

// Create a new class
const createClass = async (req, res) => {
  const { className } = req.body;

  // Validate input
  if (!className || className.trim() === '') {
    return res.status(400).json({
      message: 'Class name is required',
      error: 'Please provide a valid class name'
    });
  }

  try {
    const result = await ClassModel.create(className.trim());
    res.status(201).json({
      message: 'Class created successfully',
      newClass: { 
        id: result.insertId, 
        className: className.trim() 
      }
    });
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(500).json({
      message: 'Error creating class',
      error: err.message || 'Internal server error'
    });
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.getAll();
    res.status(200).json(classes);
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({
      message: 'Error fetching classes',
      error: err.message || 'Internal server error'
    });
  }
};

// Edit a class by ID
const editClassById = async (req, res) => {
  const { id } = req.params;
  const { className } = req.body;

  // Validate input
  if (!className || className.trim() === '') {
    return res.status(400).json({
      message: 'Class name is required',
      error: 'Please provide a valid class name'
    });
  }

  try {
    const result = await ClassModel.update(id, className.trim());

    // Check if any rows were actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Class not found',
        error: `No class found with the ID: ${id}`
      });
    }

    // If update was successful, return the updated class
    res.status(200).json({
      message: 'Class updated successfully',
      updatedClass: { id, className: className.trim() }
    });
  } catch (err) {
    console.error('Error editing class by ID:', err);
    res.status(500).json({
      message: 'Error editing class',
      error: err.message || 'Internal server error'
    });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await ClassModel.delete(id);

    // Check if any rows were actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Class not found',
        error: `No class found with ID: ${id}`
      });
    }

    res.status(200).json({
      message: 'Class deleted successfully',
      deletedClassId: id
    });
  } catch (err) {
    console.error('Error deleting class:', err);
    res.status(500).json({
      message: 'Error deleting class',
      error: err.message || 'Internal server error'
    });
  }
};

module.exports = {
  createClass,
  getAllClasses,
  editClassById,
  deleteClass
};