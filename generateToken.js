const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const user = {
  id: 1,
  username: 'admin',
  role: 'Headmaster'
};

const token = jwt.sign(
  { id: user.id, username: user.username, role: user.role },
  process.env.JWT_SECRET, // Make sure this is being properly read
  { expiresIn: '24h' }
);

console.log(`Generated JWT Token: ${token}`);
