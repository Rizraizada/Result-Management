


// const mysql = require('mysql');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'bharasarhighschool.edu.bd',
//   user: process.env.DB_USER || 'bharasar_bhs',
//   password: process.env.DB_PASSWORD || ')~jsHF7gdOs*',
//   database: process.env.DB_NAME || 'bharasar_bhs',
//   connectionLimit: 10,
// });

// module.exports = pool;




const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'zahid/quantum',
  database: process.env.DB_NAME || 'bharasar_bhs',
  connectionLimit: 10,
});

module.exports = pool;
