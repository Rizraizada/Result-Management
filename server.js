const express = require('express')
const cors = require('cors')
const next = require('next')
const path = require('path')
const db = require('./Backend/db')
const sliderRoutes = require('./Backend/routes/sliderRoutes')
const awardRoutes = require('./Backend/routes/awardRoutes')
const activitiesRoutes = require('./Backend/routes/activitiesRoutes')
const galleryRoutes = require('./Backend/routes/galleryRoutes')
const directorRoutes = require('./Backend/routes/directorRoutes')
const authRoutes = require('./Backend/routes/authRoutes')
const studentRoutes = require('./Backend/routes/studentRoutes')
const teacherSectionRoutes = require('./Backend/routes/teacherSectionRoutes')
const classRoutes = require('./Backend/routes/classRoutes')
const sectionRoutes = require('./Backend/routes/sectionRoutes')
const attendanceRoutes = require('./Backend/routes/attendanceRoutes')
const noticeRoutes = require('./Backend/routes/noticeRoutes')
const quickattendanceRoutes = require('./Backend/routes/quickAttendanceRoutes')
const studentResultsRoutes = require('./Backend/routes/studentResults')
const subjectConfigRoutes = require("./Backend/routes/subjectConfigRoutes"); // correct path

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const server = express()

// Define PORT using environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// HOST is primarily for logging/informational purposes, not directly used by server.listen in this common setup
const HOST = process.env.HOST || 'https://bharasarhighschool.edu.bd'

// CORS configuration - This is the primary fix for "Failed to fetch" on deployed login
server.use(cors({
  origin: ['https://bharasarhighschool.edu.bd', 'https://www.bharasarhighschool.edu.bd'], // <--- FIXED: Allow both origins
  credentials: true
}));

// Express middleware
server.use(express.json()); // Corrected: Added semicolon
server.use(bodyParser.urlencoded({ extended: true })); // Corrected: Added semicolon
server.use(cookieParser()); // Corrected: Added semicolon

// Static file serving for uploads
server.use(
  '/uploads',
  express.static(path.join(__dirname, 'Backend', 'uploads'))
)

// API routes
server.use('/api/slider', sliderRoutes)
server.use('/api/award', awardRoutes)
server.use('/api/activities', activitiesRoutes)
server.use('/api/gallery', galleryRoutes)
server.use('/api/director', directorRoutes)
server.use('/api/auth', authRoutes)
server.use('/api/classes', classRoutes)
server.use('/api/sections', sectionRoutes)
server.use('/api/students', studentRoutes)
server.use('/api/teacher-sections', teacherSectionRoutes)
server.use('/api/attendance', attendanceRoutes)
server.use('/api/notices', noticeRoutes)
server.use('/api/quickattendance', quickattendanceRoutes)
server.use('/api/student-results', studentResultsRoutes)
server.use('/api/subject-config', subjectConfigRoutes)


// Database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err)
    process.exit(1) // Exit if database connection fails
  } else {
    console.log('Connected to MySQL database')
    connection.release() // Release the connection back to the pool
  }
})

// Next.js preparation and server start
app
  .prepare()
  .then(() => {
    // Handle all Next.js requests
    server.all('*', (req, res) => handle(req, res))

    // Start the server, listening on the specified PORT
    server.listen(PORT, (err) => {
      if (err) {
          console.error('Error starting server:', err); // Log any error from server.listen
          throw err;
      }
      console.log(
        `Server running on ${dev ? 'http://localhost' : HOST}:${PORT} in ${
          dev ? 'development' : 'production'
        } mode`
      )
      if (!dev) {
          console.log(`Backend API base URL: ${HOST}/api/`); // Informative log for production
      }
    })
  })
  .catch(err => {
    console.error('Error preparing Next.js app or starting server:', err.stack) // More specific error message
    process.exit(1) // Exit on critical er
  })