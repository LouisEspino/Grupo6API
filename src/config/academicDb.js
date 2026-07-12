const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.ACADEMIC_DB_HOST,
  port: parseInt(process.env.ACADEMIC_DB_PORT),
  user: process.env.ACADEMIC_DB_USER,
  password: process.env.ACADEMIC_DB_PASSWORD,
  database: process.env.ACADEMIC_DB_NAME,
  connectionLimit: 5,
});

module.exports = pool;
