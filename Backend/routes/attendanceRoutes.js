const express = require('express');
const router = express.Router();
const {
  markAttendance,
  bulkRecordAttendance,
  getStudentAttendance,
  getSectionAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceById,
  generateAttendanceReport
} = require('../controllers/AttendanceController');

// Routes for attendance management
router.post('/record', markAttendance);
router.post('/bulk-record', bulkRecordAttendance);
router.get('/student/:studentId', getStudentAttendance);
router.get('/sections/:sectionId/attendance', getSectionAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);
router.get('/:id', getAttendanceById);
router.get('/report/:sectionId', generateAttendanceReport);

module.exports = router;
