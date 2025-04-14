const express = require('express');

const cors = require('cors')

const mysql = require('mysql2')

const db = require('../../db')


const { verifyToken, verifyAdmin } = require('../../Login_Register/auth')


const app = express();

app.use(cors())

app.use(express.json());


app.post('/admin/register',verifyToken, verifyAdmin, (req, res) => {

    const { username, email, password, role } = req.body;

    const selectSql = "SELECT * FROM users WHERE email=?"

    db.query(selectSql, [email], (err, result) => {

        if (err) return res.status(500).json({ error: "Database error" })

        if (result.length >0)
            return res.status(401).json({ error: "Email already exists" })

        const insertQuery = "INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)"

        const values = [username, email, password, role]

        db.query(insertQuery, values, (err, info) => {

            if (err) return res.status(500).json({ error: "Database error" })

            const msg = role === "admin" ? "Admin Registered Successfully" : "User Registered with Permissions";
            return res.status(200).json({ message: msg });
        });
    });

});


app.get('/get-all-username', (req, res)=>{

    const sql = "SELECT username FROM users"

    db.query(sql, (err, result )=>{

        if(err) return res.status(500).json({error:"Database"})

            console.log(result)

            return res.status(200).json(result)
         
    })
})












module.exports = app;