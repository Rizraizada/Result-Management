const pool = require('../db');
const { tableName } = require('./awardModel');

const Award = {
  tableName: 'awards'
};

module.exports = Award;

