

const pool = require('../db');  // Import database connection pool

const Attendance = {

  // Bulk record attendance for multiple students
  bulkRecordAttendance: (attendanceData) => {
    const query = `
      INSERT INTO attendance (student_id, attendance_date, status, recorded_by, remarks) 
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        status = VALUES(status), 
        recorded_by = VALUES(recorded_by),
        remarks = VALUES(remarks);
    `;
    
    // Prepare the values for bulk insertion
    const values = attendanceData.map(item => [
      item.studentId, 
      item.attendanceDate || new Date(),  // Use provided date or default to the current date
      item.status, 
      item.recordedBy, 
      item.remarks || null
    ]);

    return new Promise((resolve, reject) => {
      pool.query(query, [values], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Other functions for attendance retrieval and management
  getStudentAttendance: (studentId, startDate = null, endDate = null) => {
    let query = `
      SELECT a.*, u.full_name as student_name, s.sectionName 
      FROM attendance a
      JOIN students st ON a.student_id = st.id
      JOIN users u ON st.user_id = u.id
      JOIN sections s ON st.section_id = s.id
      WHERE a.student_id = ?
    `;
    const params = [studentId];

    if (startDate) {
      query += ' AND a.attendance_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND a.attendance_date <= ?';
      params.push(endDate);
    }

    return new Promise((resolve, reject) => {
      pool.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  getSectionAttendance: (sectionId, date = null) => {
    let query = `
      SELECT a.*, u.full_name AS student_name, s.sectionName
      FROM attendance a
      JOIN students st ON a.student_id = st.id
      JOIN users u ON st.user_id = u.id
      JOIN sections s ON st.section_id = s.id  
      WHERE s.id = ?
    `;
    const params = [sectionId];
  
    if (date) {
      query += ' AND a.attendance_date = ?';
      params.push(date);
    }

    return new Promise((resolve, reject) => {
      pool.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results || []);  // Return an empty array if no records found
      });
    });
  },

  // Update an attendance record by ID
  update: (id, updateData) => {
    const query = 'UPDATE attendance SET ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      pool.query(query, [updateData, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Delete an attendance record by ID
  delete: (id) => {
    const query = 'DELETE FROM attendance WHERE id = ?';
    return new Promise((resolve, reject) => {
      pool.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Get a specific attendance record by ID
  getById: (id) => {
    const query = `
      SELECT a.*, 
             u.full_name as student_name, 
             s.sectionName,
             rec_user.full_name as recorded_by_name
      FROM attendance a
      JOIN students st ON a.student_id = st.id
      JOIN users u ON st.user_id = u.id
      JOIN sections s ON st.section_id = s.id
      JOIN users rec_user ON a.recorded_by = rec_user.id
      WHERE a.id = ?
    `;
    return new Promise((resolve, reject) => {
      pool.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });
  },

  // Generate attendance report for a specific section (with optional date range)
  generateAttendanceReport: (sectionId, startDate, endDate) => {
    const query = `
      SELECT 
        u.full_name, 
        s.student_id,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as total_present,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as total_absent,
        COUNT(CASE WHEN a.status = 'late' THEN 1 END) as total_late,
        COUNT(CASE WHEN a.status = 'excused' THEN 1 END) as total_excused,
        COUNT(*) as total_days
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN attendance a ON s.id = a.student_id
      WHERE s.section_id = ? 
        AND a.attendance_date BETWEEN ? AND ?
      GROUP BY s.id, u.full_name
    `;
    return new Promise((resolve, reject) => {
      pool.query(query, [sectionId, startDate, endDate], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
};

// Export the model so it can be imported elsewhere
module.exports = Attendance;
