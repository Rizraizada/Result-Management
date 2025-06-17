const express = require('express');
const router = express.Router();
const { assignSection, getTeacherSections, updateSection, deleteSection, getSectionById } = require('../controllers/TeacherSectionController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Route to assign a section to a teacher (only for headmaster)
router.post('/', authenticateToken, authorizeRole(['headmaster']), assignSection);

// Route to get all sections assigned to a teacher (can be accessed by authenticated users)
router.get('/:teacherId/sections', authenticateToken, getTeacherSections);

// Route to update a section assignment (only for headmaster)
router.put('/:id', authenticateToken, authorizeRole(['headmaster']), updateSection);

// Route to delete a section assignment (only for headmaster)
router.delete('/:id', authenticateToken, authorizeRole(['headmaster']), deleteSection);

// Route to get a specific section by ID (can be accessed by authenticated users)
router.get('/:id', authenticateToken, getSectionById);

module.exports = router;
