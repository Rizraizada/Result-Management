const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudent,
  addStudent,
  editStudent,
  deleteStudent,
  getStudentsBySectionId,
  upload,
  addStudentsFromExcel,
} = require("../controllers/studentController");

// Get all students
router.get("/students", getStudents);
router.get("/sections/:sectionId/students", getStudentsBySectionId);
router.get("/students/:id", getStudent);

// Add/edit student with image upload
router.post("/students", upload.single("image"), addStudent);
router.put("/students/:id", upload.single("image"), editStudent);
router.delete("/students/:id", deleteStudent);

// Excel upload
router.post(
  "/students/excel",
  upload.single("excelFile"),
  addStudentsFromExcel
); // New route for Excel upload

module.exports = router;
