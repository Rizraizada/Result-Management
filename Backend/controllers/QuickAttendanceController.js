const QuickAttendance = require('../models/QuickAttendance');

// Mark Quick Attendance
const markQuickAttendance = async (req, res) => {
  const { sectionId, maleCount, femaleCount, recordedBy, attendanceDate } = req.body;

  // Validate sectionId and attendance counts
  if (!sectionId || sectionId === "") {
    return res.status(400).json({
      message: "Section ID is required.",
    });
  }

  if (maleCount === undefined || femaleCount === undefined) {
    return res.status(400).json({
      message: "Both male count and female count are required.",
    });
  }

  // Normalize the date (remove time part)
  const normalizedDate = new Date(attendanceDate).toISOString().split('T')[0]; // 'YYYY-MM-DD'

  try {
    // Check if attendance for the same section and date already exists
    const existingAttendance = await QuickAttendance.getAttendanceBySectionAndDate(sectionId, normalizedDate);

    if (existingAttendance) {
      return res.status(400).json({
        message: 'Attendance already recorded for this section and date.',
      });
    }

    // Record the attendance
    const result = await QuickAttendance.recordQuickAttendance({
      section_id: sectionId,
      attendance_date: normalizedDate,
      male_count: maleCount,
      female_count: femaleCount,
      recorded_by: recordedBy,
    });

    res.status(201).json({
      message: 'Quick attendance recorded successfully',
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error marking quick attendance',
      error: err.message,
    });
  }
};

// Get all quick attendance records
const getAllQuickAttendance = async (req, res) => {
  try {
    // Fetch all quick attendance records
    const attendanceRecords = await QuickAttendance.getAllQuickAttendance();

    // If no records found, return a 404 error
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({
        message: 'No quick attendance records found.',
      });
    }

    // Return the attendance records
    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error('Error fetching quick attendance records:', err);
    res.status(500).json({
      message: 'Error fetching quick attendance records.',
      error: err.message,
    });
  }
};

const generateQuickAttendanceReport = async (req, res) => {
  const { date, startDate, endDate, sectionId, classId, teacherId } = req.query;

  try {
    let query = `
      SELECT qa.id, qa.section_id, qa.attendance_date, qa.male_count, qa.female_count, qa.recorded_by,
             u.full_name AS teacher_name, s.sectionName, c.className
      FROM quick_attendance qa
      JOIN users u ON qa.recorded_by = u.id
      JOIN sections s ON qa.section_id = s.id
      JOIN classes c ON s.classId = c.id
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      query += ` AND DATE(qa.attendance_date) = ?`;
      params.push(date);
    }
    if (startDate && endDate) {
      query += ` AND DATE(qa.attendance_date) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
    if (sectionId) {
      query += ` AND qa.section_id = ?`;
      params.push(sectionId);
    }
    if (classId) {
      query += ` AND c.id = ?`;
      params.push(classId);
    }
    if (teacherId) {
      query += ` AND qa.recorded_by = ?`;
      params.push(teacherId);
    }

    query += ` ORDER BY qa.attendance_date DESC`;

    const attendanceReport = await QuickAttendance.executeQuery(query, params);

    if (!attendanceReport || attendanceReport.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for the given filters.' });
    }

    res.status(200).json({ message: 'Quick attendance report generated successfully.', data: attendanceReport });
  } catch (err) {
    console.error('Error generating quick attendance report:', err);
    res.status(500).json({ message: 'Error generating quick attendance report.', error: err.message });
  }
};





module.exports = {
  generateQuickAttendanceReport,
  markQuickAttendance,
  getAllQuickAttendance,
};
