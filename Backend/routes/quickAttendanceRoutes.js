// Backend/routes/quickAttendanceRoutes.js
const express = require('express');
const router = express.Router();
const { markQuickAttendance, getAllQuickAttendance, generateQuickAttendanceReport } = require('../controllers/QuickAttendanceController');

router.post('/quick', markQuickAttendance);

router.get('/quick', getAllQuickAttendance);

router.get('/report', generateQuickAttendanceReport);


module.exports = router;
