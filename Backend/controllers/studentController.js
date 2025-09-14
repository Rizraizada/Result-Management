const Student = require("../models/studentsModel");
const upload = require("../multerConfig"); // Multer config for file upload
const xlsx = require('xlsx');  // To handle Excel file parsing
const path = require('path');


const addStudentsFromExcel = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No Excel file provided" });
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
  
  // Read the uploaded Excel file
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];  // Use the first sheet
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert the worksheet to JSON
  const data = xlsx.utils.sheet_to_json(worksheet);
  
  // Validate data
  if (data.length === 0) {
    return res.status(400).json({ message: "No data found in the Excel file" });
  }

  // Map the Excel data to match your student model fields
  const studentsData = data.map(student => ({
    user_id: student.user_id,
    section_id: student.section_id,
    name: student.name,
    phone: student.phone,
    address: student.address,
    position: student.position,
    email: student.email,
    gender: student.gender,
    expertise: student.expertise,
    image: student.image || null,  // Optional image column in Excel
  }));

  // Insert each student data into the database
  let successCount = 0;
  let errors = [];

  studentsData.forEach((student, index) => {
    Student.addStudent(student, (err, result) => {
      if (err) {
        errors.push({ index, error: err });
      } else {
        successCount++;
      }

      // After processing all students, send the response
      if (index === studentsData.length - 1) {
        if (errors.length > 0) {
          return res.status(500).json({
            message: `${successCount} students added successfully, but there were some errors`,
            errors,
          });
        }
        res.status(201).json({ message: `${successCount} students added successfully` });
      }
    });
  });
};

// Get all students
const getStudents = (req, res) => {
  Student.getAllStudents((err, students) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch students from database" });
    }
    res.json(students);
  });
};

// Get a single student by ID
const getStudent = (req, res) => {
  const { id } = req.params;
  Student.getStudentById(id, (err, student) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching student" });
    }
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  });
};

// Add a new student
const addStudent = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const {
    user_id,
    section_id,
    name,
    phone,
    address,
    position,
    email,
    gender,
    expertise,
  } = req.body;
  const imagePath = req.file.filename;

  const studentData = {
    user_id,
    section_id,
    name,
    phone,
    address,
    position,
    image: imagePath,
    email,
    gender,
    expertise,
  };

  Student.addStudent(studentData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding student", error: err });
    }
    res
      .status(201)
      .json({ message: "Student added successfully", data: result });
  });
};

// Edit student by ID
const editStudent = (req, res) => {
  const { id } = req.params;
  const {
    user_id,
    section_id,
    name,
    phone,
    address,
    position,
    email,
    gender,
    expertise,
  } = req.body;
  let updatedData = {
    user_id,
    section_id,
    name,
    phone,
    address,
    position,
    email,
    gender,
    expertise,
  };

  if (req.file) {
    updatedData.image = req.file.filename;
  }

  Student.updateStudentById(id, updatedData, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating student", error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Student updated successfully" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  });
};

// Delete student by ID
const deleteStudent = (req, res) => {
  const { id } = req.params;

  Student.deleteStudentById(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting student", error: err });
    }
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Student deleted successfully" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  });
};
const getStudentsBySectionId = (req, res) => {
  const { sectionId } = req.params;

  Student.getStudentsBySectionId(sectionId, (err, students) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching students" });
    }
    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for this section" });
    }
    res.status(200).json(students);
  });
};

module.exports = {
  getStudents,
  getStudent,
  addStudent,
  editStudent,
  deleteStudent,
  getStudentsBySectionId,
  addStudentsFromExcel,
  upload,
};
