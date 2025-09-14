const pool = require('../db');

const QuickAttendance = {
  getAttendanceBySectionAndDate: (sectionId, date) => {
    const query = `
      SELECT * FROM quick_attendance
      WHERE section_id = ? AND DATE(attendance_date) = ?;
    `;
    return QuickAttendance.executeQuery(query, [sectionId, date])
      .then(results => (results.length > 0 ? results[0] : null));
  },

  recordQuickAttendance: (attendanceData) => {
    const query = `
      INSERT INTO quick_attendance (
        section_id, 
        attendance_date, 
        male_count, 
        female_count, 
        recorded_by, 
        total_male, 
        total_female, 
        total_students,
        absent_student_ids
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      attendanceData.section_id,
      attendanceData.attendance_date,
      attendanceData.male_count,
      attendanceData.female_count,
      attendanceData.recorded_by,
      attendanceData.total_male,
      attendanceData.total_female,
      attendanceData.total_students,
      attendanceData.absent_student_ids || null
    ];

    return QuickAttendance.executeQuery(query, params);
  },

  recordQuickAttendanceFieldWise: (attendanceData) => {
    const fields = [];
    const placeholders = [];
    const values = [];

    const fieldMapping = {
      section_id: attendanceData.section_id,
      attendance_date: attendanceData.attendance_date,
      male_count: attendanceData.male_count,
      female_count: attendanceData.female_count,
      recorded_by: attendanceData.recorded_by,
      total_male: attendanceData.total_male,
      total_female: attendanceData.total_female,
      total_students: attendanceData.total_students,
      absent_student_ids: attendanceData.absent_student_ids
    };

    Object.keys(fieldMapping).forEach(field => {
      if (fieldMapping[field] !== undefined && fieldMapping[field] !== null) {
        fields.push(field);
        placeholders.push('?');
        values.push(fieldMapping[field]);
      }
    });

    const query = `
      INSERT INTO quick_attendance (${fields.join(', ')}) 
      VALUES (${placeholders.join(', ')})
    `;

    return QuickAttendance.executeQuery(query, values);
  },

  getAllQuickAttendance: () => {
    const query = `
      SELECT 
        qa.id, 
        qa.section_id, 
        qa.attendance_date, 
        qa.male_count, 
        qa.female_count,
        qa.total_male, 
        qa.total_female, 
        qa.total_students, 
        qa.absent_student_ids,
        qa.recorded_by,
        u.full_name AS teacher_name, 
        s.sectionName
      FROM quick_attendance qa
      JOIN users u ON qa.recorded_by = u.id
      JOIN sections s ON qa.section_id = s.id
      ORDER BY qa.attendance_date DESC
    `;
    return QuickAttendance.executeQuery(query);
  },

  executeQuery: (query, params = []) => {
    return new Promise((resolve, reject) => {
      pool.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  getAttendanceReport: ({ date, startDate, endDate, sectionId, classId, teacherId }) => {
    let query = `
      SELECT 
        qa.id, 
        qa.section_id, 
        qa.attendance_date, 
        qa.male_count, 
        qa.female_count, 
        qa.total_male, 
        qa.total_female, 
        qa.total_students, 
        qa.absent_student_ids,
        qa.recorded_by,
        u.full_name AS teacher_name, 
        s.sectionName, 
        c.className
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

    return QuickAttendance.executeQuery(query, params);
  },

  updateQuickAttendance: (id, attendanceData) => {
    const fields = [];
    const values = [];

    const fieldMapping = {
      section_id: attendanceData.section_id,
      attendance_date: attendanceData.attendance_date,
      male_count: attendanceData.male_count,
      female_count: attendanceData.female_count,
      recorded_by: attendanceData.recorded_by,
      total_male: attendanceData.total_male,
      total_female: attendanceData.total_female,
      total_students: attendanceData.total_students,
      absent_student_ids: attendanceData.absent_student_ids
    };

    Object.keys(fieldMapping).forEach(field => {
      if (fieldMapping[field] !== undefined && fieldMapping[field] !== null) {
        fields.push(`${field} = ?`);
        values.push(fieldMapping[field]);
      }
    });

    values.push(id);

    const query = `
      UPDATE quick_attendance 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `;

    return QuickAttendance.executeQuery(query, values);
  }
};

module.exports = QuickAttendance;
