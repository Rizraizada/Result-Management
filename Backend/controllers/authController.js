const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const upload = require('../multerConfig');

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, password, full_name, role, phone, gender, expertise, address, position, description, plain_password } = req.body;

    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');
    if (!full_name) missingFields.push('full_name');
    if (!role) missingFields.push('role');
    if (!phone) missingFields.push('phone');
    if (!gender) missingFields.push('gender');
    if (!expertise) missingFields.push('expertise');
    if (!address) missingFields.push('address');
    if (!position) missingFields.push('position');
    if (!description) missingFields.push('description');
    if (!plain_password) missingFields.push('plain_password');

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const image = req.file ? req.file.filename : null;

    // Ensure register method is returning a promise or callback
    const result = await User.register(
      username,
      hashedPassword, 
      full_name,
      role,
      phone,
      gender,
      expertise,
      address,
      position,
      description,
      plain_password,  
      image
    );

    return res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

// Edit user information
const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, full_name, role, phone, gender, expertise, address, position, description, plain_password } = req.body;
    const image = req.file ? req.file.filename : null;

    // Ensure only the user or an admin can edit
    if (!req.user || (req.user.id !== parseInt(id) && req.user.role !== 'headmaster')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await User.update(id, username, full_name, role, phone, gender, expertise, address, position, description, plain_password, image);
    return res.json({ message: 'User updated successfully' });

  } catch (err) {
    console.error('Edit user error:', err);
    res.status(500).json({ message: 'Error during edit' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure only the user or an admin can delete
    if (!req.user || (req.user.id !== parseInt(id) && req.user.role !== 'headmaster')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await User.delete(id);
    return res.json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Error during delete' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ message: 'Users retrieved successfully', users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Use the `findById` method from the User model
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user details
    res.json({ message: 'User retrieved successfully', user });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  editUser,
  deleteUser,
  getAllUsers,
  getUserById,
};
