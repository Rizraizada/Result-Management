const SectionModel = require('../models/sectionModel');
const ClassModel = require('../models/classModel');

// Create a new section
const createSection = async (req, res) => {
  const { sectionName, classId } = req.body;

  // Validate input
  if (!sectionName || !classId) {
    return res.status(400).json({
      message: 'Section name and Class ID are required',
      error: 'Please provide valid section name and class'
    });
  }

  try {
    // Verify class exists
    const classes = await ClassModel.getAll();
    const classExists = classes.some(c => c.id === parseInt(classId));
    
    if (!classExists) {
      return res.status(404).json({
        message: 'Class not found',
        error: `No class found with ID: ${classId}`
      });
    }

    const result = await SectionModel.create(sectionName.trim(), classId);
    res.status(201).json({
      message: 'Section created successfully',
      newSection: { 
        id: result.insertId, 
        sectionName: sectionName.trim(),
        classId 
      }
    });
  } catch (err) {
    console.error('Error creating section:', err);
    res.status(500).json({
      message: 'Error creating section',
      error: err.message || 'Internal server error'
    });
  }
};

// Get all sections
const getAllSections = async (req, res) => {
  try {
    const sections = await SectionModel.getAll();
    res.status(200).json(sections);
  } catch (err) {
    console.error('Error fetching sections:', err);
    res.status(500).json({
      message: 'Error fetching sections',
      error: err.message || 'Internal server error'
    });
  }
};

// Edit a section by ID
const editSectionById = async (req, res) => {
  const { id } = req.params;
  const { sectionName, classId } = req.body;

  // Validate input
  if (!sectionName || !classId) {
    return res.status(400).json({
      message: 'Section name and Class ID are required',
      error: 'Please provide valid section name and class'
    });
  }

  try {
    // Verify class exists
    const classes = await ClassModel.getAll();
    const classExists = classes.some(c => c.id === parseInt(classId));
    
    if (!classExists) {
      return res.status(404).json({
        message: 'Class not found',
        error: `No class found with ID: ${classId}`
      });
    }

    const result = await SectionModel.update(id, sectionName.trim(), classId);

    // Check if any rows were actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Section not found',
        error: `No section found with the ID: ${id}`
      });
    }

    // If update was successful, return the updated section
    res.status(200).json({
      message: 'Section updated successfully',
      updatedSection: { 
        id, 
        sectionName: sectionName.trim(), 
        classId 
      }
    });
  } catch (err) {
    console.error('Error editing section by ID:', err);
    res.status(500).json({
      message: 'Error editing section',
      error: err.message || 'Internal server error'
    });
  }
};



// Delete a section
const deleteSection = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await SectionModel.delete(id);

    // Check if any rows were actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Section not found',
        error: `No section found with ID: ${id}`
      });
    }

    res.status(200).json({
      message: 'Section deleted successfully',
      deletedSectionId: id
    });
  } catch (err) {
    console.error('Error deleting section:', err);
    res.status(500).json({
      message: 'Error deleting section',
      error: err.message || 'Internal server error'
    });
  }
};

module.exports = {
  createSection,
  getAllSections,
  editSectionById,
  deleteSection
};