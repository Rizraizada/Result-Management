const express = require('express');
const cors = require('cors');
const next = require('next');
const path = require('path');
const db = require('./Backend/db');

// Route imports
const sliderRoutes = require('./Backend/routes/sliderRoutes');
const awardRoutes = require('./Backend/routes/awardRoutes');
const activitiesRoutes = require('./Backend/routes/activitiesRoutes');
const galleryRoutes = require('./Backend/routes/galleryRoutes');
const directorRoutes = require('./Backend/routes/directorRoutes');
const authRoutes = require('./Backend/routes/authRoutes');
const studentRoutes = require('./Backend/routes/studentRoutes');
const teacherSectionRoutes = require('./Backend/routes/teacherSectionRoutes');
const classRoutes = require('./Backend/routes/classRoutes');
const sectionRoutes = require('./Backend/routes/sectionRoutes');
const attendanceRoutes = require('./Backend/routes/attendanceRoutes');
const noticeRoutes = require('./Backend/routes/noticeRoutes');
const quickattendanceRoutes = require('./Backend/routes/quickAttendanceRoutes');
const studentResultsRoutes = require('./Backend/routes/studentResults');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Next.js setup
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Express app setup
const server = express();
const PORT = process.env.PORT || 3000;
// const HOST = process.env.HOST || 'https://bharasarhighschool.edu.bd/result/';

server.use(cors());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());

// Static file serving
server.use('/uploads', express.static(path.join(__dirname, 'Backend', 'uploads')));

// API routes
server.use('/api/slider', sliderRoutes);
server.use('/api/award', awardRoutes);
server.use('/api/activities', activitiesRoutes);
server.use('/api/gallery', galleryRoutes);
server.use('/api/director', directorRoutes);
server.use('/api/auth', authRoutes);
server.use('/api/classes', classRoutes);
server.use('/api/sections', sectionRoutes);
server.use('/api/students', studentRoutes);
server.use('/api/teacher-sections', teacherSectionRoutes);
server.use('/api/attendance', attendanceRoutes);
server.use('/api/notices', noticeRoutes);
server.use('/api/quickattendance', quickattendanceRoutes);
server.use('/api/student-results', studentResultsRoutes);

// Connect to MySQL
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

// Start server after Next.js is ready
nextApp.prepare()
  .then(() => {
    server.all('*', (req, res) => handle(req, res));
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} in ${dev ? 'development' : 'production'} mode`);
    });
  })
  .catch(err => {
    console.error('Error starting server:', err.stack);
    process.exit(1);
  });
