const Attendance = require('../models/Attendance');

// Mark attendance for a student
const markAttendance = async (req, res) => {
  try {
    const { studentId, status, recordedBy, remarks } = req.body;
    const result = await Attendance.recordAttendance(studentId, status, recordedBy, remarks);
    res.status(201).json({
      message: 'Attendance marked successfully',
      result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error marking attendance',
      error: err.message
    });
  }
};

const bulkRecordAttendance = (req, res) => {
  const attendanceData = req.body.attendanceData;  // Data from the request body
  
  Attendance.bulkRecordAttendance(attendanceData)
    .then(result => {
      res.status(200).json({
        message: 'Attendance records successfully updated',
        result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to update attendance records',
        error: error.message
      });
    });
};

const getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;
  const { startDate, endDate } = req.query; 
  try {
    const attendance = await Attendance.getStudentAttendance(studentId, startDate, endDate);
    res.status(200).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error fetching student attendance',
      error: err.message
    });
  }
};

const getSectionAttendance = async (req, res) => {
  const { sectionId } = req.params;
  const { date } = req.query; 
  try {
    const attendance = await Attendance.getSectionAttendance(sectionId, date);
    res.status(200).json(attendance || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error fetching section attendance',
      error: err.message
    });
  }
};

const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const result = await Attendance.update(id, updateData);
    res.status(200).json({
      message: 'Attendance updated successfully',
      result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error updating attendance',
      error: err.message
    });
  }
};

const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Attendance.delete(id);
    res.status(200).json({
      message: 'Attendance deleted successfully',
      result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error deleting attendance',
      error: err.message
    });
  }
};

const getAttendanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const attendance = await Attendance.getById(id);
    res.status(200).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error fetching attendance by ID',
      error: err.message
    });
  }
};

const generateAttendanceReport = async (req, res) => {
  const { sectionId } = req.params;
  const { startDate, endDate } = req.query;
  try {
    const report = await Attendance.generateAttendanceReport(sectionId, startDate, endDate);
    res.status(200).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error generating attendance report',
      error: err.message
    });
  }
};

module.exports = {
  markAttendance,
  bulkRecordAttendance,
  getStudentAttendance,
  getSectionAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceById,
  generateAttendanceReport
};
