const QuickAttendance = require('../models/QuickAttendance');

const markQuickAttendance = async (req, res) => {
  const { 
    sectionId, 
    maleCount, 
    femaleCount, 
    totalfemale, 
    totalmale, 
    totalstudents, 
    recordedBy, 
    attendanceDate,
    absentStudentIds  // Add this to destructure from req.body
  } = req.body;
  
  // Validation
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

  if (!recordedBy) {
    return res.status(400).json({
      message: "Recorded by (user ID) is required.",
    });
  }

  const normalizedDate = new Date(attendanceDate).toISOString().split('T')[0];

  try {
    // Check if attendance already exists
    const existingAttendance = await QuickAttendance.getAttendanceBySectionAndDate(sectionId, normalizedDate);

    if (existingAttendance) {
      return res.status(400).json({
        message: 'Attendance already recorded for this section and date.',
      });
    }

    // Prepare attendance data with proper field mapping
    const attendanceData = {
      section_id: parseInt(sectionId),
      attendance_date: normalizedDate,
      male_count: parseInt(maleCount) || 0,
      female_count: parseInt(femaleCount) || 0,
      total_male: parseInt(totalmale) || 0,
      total_female: parseInt(totalfemale) || 0,
      total_students: parseInt(totalstudents) || 0,
      recorded_by: parseInt(recordedBy),
      absent_student_ids: absentStudentIds || null  // Add this field
    };

    // Validate calculated totals
    const calculatedTotal = attendanceData.total_male + attendanceData.total_female;
    if (attendanceData.total_students !== calculatedTotal) {
      console.warn(`Total students mismatch: provided ${attendanceData.total_students}, calculated ${calculatedTotal}`);
      // Auto-correct the total
      attendanceData.total_students = calculatedTotal;
    }

    // Record attendance using the field-wise method for better reliability
    const result = await QuickAttendance.recordQuickAttendanceFieldWise(attendanceData);

    res.status(201).json({
      message: 'Quick attendance recorded successfully',
      data: {
        id: result.insertId,
        ...attendanceData
      }
    });
  } catch (err) {
    console.error('Error marking quick attendance:', err);
    res.status(500).json({
      message: 'Error marking quick attendance',
      error: err.message,
    });
  }
};

const getAllQuickAttendance = async (req, res) => {
  try {
    const attendanceRecords = await QuickAttendance.getAllQuickAttendance();
    
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({
        message: 'No quick attendance records found.',
      });
    }

    // Add calculated fields for frontend
    const enrichedRecords = attendanceRecords.map(record => ({
      ...record,
      total_present: (record.male_count || 0) + (record.female_count || 0),
      total_absent: (record.total_students || 0) - ((record.male_count || 0) + (record.female_count || 0)),
      attendance_percentage: record.total_students > 0 
        ? (((record.male_count || 0) + (record.female_count || 0)) / record.total_students * 100).toFixed(2)
        : '0.00'
    }));

    res.status(200).json({
      message: 'Quick attendance records retrieved successfully',
      data: enrichedRecords
    });
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
    // Build filter object
    const filters = {};
    if (date) filters.date = date;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }
    if (sectionId) filters.sectionId = parseInt(sectionId);
    if (classId) filters.classId = parseInt(classId);
    if (teacherId) filters.teacherId = parseInt(teacherId);

    const attendanceReport = await QuickAttendance.getAttendanceReport(filters);

    if (!attendanceReport || attendanceReport.length === 0) {
      return res.status(404).json({ 
        message: 'No attendance records found for the given filters.',
        filters: filters
      });
    }

    // Calculate summary statistics
    const summary = attendanceReport.reduce((acc, record) => {
      const maleCount = record.male_count || 0;
      const femaleCount = record.female_count || 0;
      const totalStudents = record.total_students || 0;
      const totalPresent = maleCount + femaleCount;
      
      return {
        totalRecords: acc.totalRecords + 1,
        totalMaleStudents: acc.totalMaleStudents + (record.total_male || 0),
        totalFemaleStudents: acc.totalFemaleStudents + (record.total_female || 0),
        totalStudentsOverall: acc.totalStudentsOverall + totalStudents,
        totalMalePresent: acc.totalMalePresent + maleCount,
        totalFemalePresent: acc.totalFemalePresent + femaleCount,
        totalPresentOverall: acc.totalPresentOverall + totalPresent,
        totalAbsentOverall: acc.totalAbsentOverall + (totalStudents - totalPresent)
      };
    }, {
      totalRecords: 0,
      totalMaleStudents: 0,
      totalFemaleStudents: 0,
      totalStudentsOverall: 0,
      totalMalePresent: 0,
      totalFemalePresent: 0,
      totalPresentOverall: 0,
      totalAbsentOverall: 0
    });

    // Calculate overall attendance percentage
    summary.overallAttendancePercentage = summary.totalStudentsOverall > 0 
      ? (summary.totalPresentOverall / summary.totalStudentsOverall * 100).toFixed(2)
      : '0.00';

    // Enrich records with calculated fields
    const enrichedReport = attendanceReport.map(record => ({
      ...record,
      total_present: (record.male_count || 0) + (record.female_count || 0),
      total_absent: (record.total_students || 0) - ((record.male_count || 0) + (record.female_count || 0)),
      attendance_percentage: record.total_students > 0 
        ? (((record.male_count || 0) + (record.female_count || 0)) / record.total_students * 100).toFixed(2)
        : '0.00'
    }));

    res.status(200).json({ 
      message: 'Quick attendance report generated successfully.',
      filters: filters,
      summary: summary,
      data: enrichedReport
    });
  } catch (err) {
    console.error('Error generating quick attendance report:', err);
    res.status(500).json({ 
      message: 'Error generating quick attendance report.', 
      error: err.message 
    });
  }
};

const updateQuickAttendance = async (req, res) => {
  const { id } = req.params;
  const { 
    sectionId, 
    maleCount, 
    femaleCount, 
    totalfemale, 
    totalmale, 
    totalstudents, 
    recordedBy, 
    attendanceDate,
    absentStudentIds  // Add this to destructure from req.body
  } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Attendance ID is required.",
    });
  }

  try {
    // Prepare update data
    const attendanceData = {};
    
    if (sectionId !== undefined) attendanceData.section_id = parseInt(sectionId);
    if (attendanceDate !== undefined) attendanceData.attendance_date = new Date(attendanceDate).toISOString().split('T')[0];
    if (maleCount !== undefined) attendanceData.male_count = parseInt(maleCount) || 0;
    if (femaleCount !== undefined) attendanceData.female_count = parseInt(femaleCount) || 0;
    if (totalmale !== undefined) attendanceData.total_male = parseInt(totalmale) || 0;
    if (totalfemale !== undefined) attendanceData.total_female = parseInt(totalfemale) || 0;
    if (totalstudents !== undefined) attendanceData.total_students = parseInt(totalstudents) || 0;
    if (recordedBy !== undefined) attendanceData.recorded_by = parseInt(recordedBy);
    if (absentStudentIds !== undefined) attendanceData.absent_student_ids = absentStudentIds;  // Add this field

    const result = await QuickAttendance.updateQuickAttendance(id, attendanceData);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Attendance record not found.',
      });
    }

    res.status(200).json({
      message: 'Quick attendance updated successfully',
      data: {
        id: id,
        ...attendanceData
      }
    });
  } catch (err) {
    console.error('Error updating quick attendance:', err);
    res.status(500).json({
      message: 'Error updating quick attendance',
      error: err.message,
    });
  }
};

module.exports = {
  markQuickAttendance,
  getAllQuickAttendance,
  generateQuickAttendanceReport,
  updateQuickAttendance
};