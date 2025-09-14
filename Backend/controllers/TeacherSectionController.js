const TeacherSection = require('../models/TeacherSection');

// Assign a section to a teacher
exports.assignSection = async (req, res) => {
  try {
    const { teacherId, sectionId, isPrimary } = req.body;
    const result = await TeacherSection.create(teacherId, sectionId, isPrimary);
    res.status(200).json({ message: 'Section assigned successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign section', details: error });
  }
};

// Get all sections assigned to a teacher
exports.getTeacherSections = async (req, res) => {
  const { teacherId } = req.params;
  try {
    const sections = await TeacherSection.getAssignedSections(teacherId);
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher sections', details: error });
  }
};

// Update section assignment
exports.updateSection = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const result = await TeacherSection.update(id, updateData);
    res.status(200).json({ message: 'Section updated successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update section', details: error });
  }
};

// Delete a section assignment
exports.deleteSection = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await TeacherSection.delete(id);
    res.status(200).json({ message: 'Section deleted successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete section', details: error });
  }
};

// Get a section by ID
exports.getSectionById = async (req, res) => {
  const { id } = req.params;
  try {
    const section = await TeacherSection.getById(id);
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch section', details: error });
  }
};
