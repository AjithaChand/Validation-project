require('dotenv').config()

const mysql = require('mysql2')


const db = mysql.createConnection({
    host:process.env.DB_HOST,

    user:process.env.DB_USER,

    // password:process.env.DB_PASSWORD,

    database:process.env.DB_DATABASENAME,

    port:process.env.PORT_NAME,
})

db.connect(err=>{
    if(err)
        console.log("Db coneection failed")
    else 
    console.log("Db connected Successfully")
})

module.exports=db