const mysql = require("mysql2/promise");
require("dotenv").config();

// createPool manages multiple DB connections automatically.
// Much better than a single connection which can time out.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true, // queue requests when all connections are busy
  connectionLimit: 10, // maximum 10 simultaneous connections
  queueLimit: 0, // 0 = unlimited queue
});

// Test the connection immediately when this file loads.
// If it fails, the process exits so you know right away.
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      "✅ MySQL connected successfully to database:",
      process.env.DB_NAME,
    );
    connection.release(); // return connection back to the pool
  } catch (err) {
    console.error("❌ MySQL connection failed!");
    console.error("   Reason:", err.message);
    console.error(
      "   Check your .env file: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME",
    );
    process.exit(1); // kill the server — nothing works without a DB
  }
};

testConnection();

module.exports = pool;
