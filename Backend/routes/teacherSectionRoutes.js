const express = require('express');
const router = express.Router();
const {
  assignSection,
  getTeacherSections,
  updateSection,
  deleteSection,
  getSectionById
} = require('../controllers/TeacherSectionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Route to assign a section to a teacher
router.post('/', authenticateToken, assignSection);

// Route to get all sections assigned to a teacher
router.get('/:teacherId/sections', authenticateToken, getTeacherSections);

// Route to update a section assignment
router.put('/:id', authenticateToken, updateSection);

// Route to delete a section assignment
router.delete('/:id', authenticateToken, deleteSection);

// Route to get a specific section by ID
router.get('/:id', authenticateToken, getSectionById);

module.exports = router;
