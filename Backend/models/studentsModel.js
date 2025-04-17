// models/Student.js
const pool = require('../db');  

const Student = {
  tableName: 'students',
  
  // Get all students
  getAllStudents: (callback) => {
    const query = 'SELECT id, user_id, section_id, name, phone, address, position, image, email, gender, expertise FROM students';
    pool.query(query, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        const formattedResults = results.map(row => ({
          ...row,
          image: row.image ? `/uploads/${row.image.trim()}` : null
        }));
        callback(null, formattedResults);
      }
    });
  },
  
  // Get student by ID
  getStudentById: (id, callback) => {
    const query = 'SELECT id, name, user_id, section_id, phone, address, position, image, email, gender, expertise, created_at, updated_at FROM students WHERE id = ?';
    pool.query(query, [id], (err, results) => {
      if (err) {
        callback(err, null);
      } else if (results.length === 0) {
        callback(null, null); 
      } else {
        const student = { 
          ...results[0], 
          image: results[0].image ? `/uploads/${results[0].image.trim()}` : null 
        };
        callback(null, student);
      }
    });
  },
  
  // Add student
  addStudent: (data, callback) => {
    const { 
      user_id, 
      section_id, 
      name, 
      phone, 
      address, 
      position, 
      image, 
      email, 
      gender, 
      expertise 
    } = data;
    
    const query = `
      INSERT INTO students 
      (user_id, section_id, name, phone, address, position, image, email, gender, expertise) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    pool.query(
      query, 
      [user_id, section_id, name, phone, address, position, image, email, gender, expertise], 
      (err, result) => {
        callback(err, result);
      }
    );
  },
  
  // Update student by ID
  updateStudentById: (id, data, callback) => {
    const { 
      user_id, 
      section_id, 
      name, 
      phone, 
      address, 
      position, 
      image, 
      email, 
      gender, 
      expertise 
    } = data;
    
    const query = `
      UPDATE students 
      SET user_id = ?, section_id = ?, name = ?, phone = ?, 
      address = ?, position = ?, image = ?, email = ?, 
      gender = ?, expertise = ? 
      WHERE id = ?
    `;
    
    pool.query(
      query, 
      [user_id, section_id, name, phone, address, position, image, email, gender, expertise, id], 
      (err, result) => {
        callback(err, result);
      }
    );
  },
  
  // Delete student by ID
  deleteStudentById: (id, callback) => {
    const query = 'DELETE FROM students WHERE id = ?';
    pool.query(query, [id], (err, result) => {
      callback(err, result);
    });
  },

  // Get students by section ID
  getStudentsBySectionId: (sectionId, callback) => {
    const query = 'SELECT id, user_id, section_id, name, phone, address, position, image, email, gender, expertise FROM students WHERE section_id = ?';
    pool.query(query, [sectionId], (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        const formattedResults = results.map(row => ({
          ...row,
          image: row.image ? `/uploads/${row.image.trim()}` : null
        }));
        callback(null, formattedResults);
      }
    });
  }
};

module.exports = Student;
