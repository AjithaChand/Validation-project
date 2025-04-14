require('dotenv').config()

const mysql = require('mysql2')


const db = mysql.createPool({
    host:process.env.DB_HOST,

    user:process.env.DB_USER,

    password:process.env.DB_PASSWORD,

    database:process.env.DB_DATABASENAME,

    port: process.env.PORT_NAME,

    waitForConnections:true,

    connectionLimit: 10,

    queueLimit: 0
})

db.getConnection((err, connection) => {
    if (err) {
        console.log("DB connection failed", err.message);
        return;
    }

    console.log("DB connected successfully");
    connection.release();
});

module.exports=db;