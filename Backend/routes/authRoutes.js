const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  editUser, 
  deleteUser, 
  getAllUsers, 
  getUserById 
} = require('../controllers/authController'); 
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const upload = require('../multerConfig'); // Multer configuration for file uploads

// Register route with image upload handling
router.post('/register', upload.single('image'), registerUser);

// Login route
router.post('/login', loginUser);

// Logout route
router.post('/logout', authenticateToken, (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});

// Verify token route
router.get('/verifyToken', authenticateToken, (req, res) => {
  res.json(req.user);
});

router.put('/edit/:id', authenticateToken, authorizeRole(['admin', 'headmaster']), upload.single('image'), editUser);
router.delete('/delete/:id', authenticateToken, authorizeRole(['admin', 'headmaster']), deleteUser);
router.get('/users', getAllUsers);
router.get('/user/:id', authenticateToken, getUserById);

module.exports = router;
