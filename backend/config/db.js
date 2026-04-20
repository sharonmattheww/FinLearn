const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a pool of connections instead of a single connection.
// A pool automatically manages multiple DB connections for us.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection when this file is first loaded
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ MySQL connected successfully");
    connection.release(); // Always release the connection back to the pool
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1); // Stop the server if DB fails — nothing works without it
  });

module.exports = pool;
