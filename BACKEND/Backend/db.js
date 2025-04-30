require('dotenv').config();
const mysql = require('mysql2'); 

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASENAME,
  port: process.env.DB_PORT,
  // connectionLimit: 50, 
  // waitForConnections: true, // Default is true, so this can be omitted unless changed
});

async function testConnection() {
  try {
    const connection = await db.promise().getConnection();
    console.log("DB connected successfully");
    connection.release(); 
  } catch (err) {
    console.error("DB connection failed", err.message);
  }
}

testConnection(); 

module.exports = db;
