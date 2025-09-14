// const pool = require('../config');

// class SubjectModel {
//   static async createSubject(subjectName, classId, sectionId) {
//     const [rows] = await pool.execute(
//       'INSERT INTO subjects (subject_name, class_id, section_id) VALUES (?, ?, ?)',
//       [subjectName, classId, sectionId]
//     );
//     return rows;
//   }

//   static async getAllSubjects() {
//     const [rows] = await pool.execute('SELECT * FROM subjects');
//     return rows;
//   }

//   static async getSubjectsBySectionId(sectionId) {
//     const [rows] = await pool.execute('SELECT * FROM subjects WHERE section_id = ?', [sectionId]);
//     return rows;
//   }

//   static async updateSubject(id, subjectName) {
//     const [rows] = await pool.execute(
//       'UPDATE subjects SET subject_name = ? WHERE id = ?',
//       [subjectName, id]
//     );
//     return rows;
//   }

//   static async deleteSubject(id) {
//     const [rows] = await pool.execute('DELETE FROM subjects WHERE id = ?', [id]);
//     return rows;
//   }
// }

// module.exports = SubjectModel;
