const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.AUTH_DB_HOST,
  port: parseInt(process.env.AUTH_DB_PORT),
  user: process.env.AUTH_DB_USER,
  password: process.env.AUTH_DB_PASSWORD,
  database: process.env.AUTH_DB_NAME,
  connectionLimit: 5,
});

module.exports = pool;
