require("dotenv").config()

const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path")
const fs = require("fs")


const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;


const db = require("../db");
// const { error } = require("console");
// const { permission } = require("process");



//Updated Login Code for permission
app.post('/login', (req, res) => {

    const { email, password } = req.body;

    const selectSql = "SELECT * FROM users WHERE email = ?"

    db.query(selectSql, [email], (err, result) => {

        if (err) return res.status(500).json({ error: "Database Error" })

        if (result.length === 0) return res.status(401).json({ error: "User not found" })

        const user = result[0];

        if (password !== user.password) {

            return res.status(400).json({ error: "Invalid password" })
        }

        const selectQuery = "SELECT person_code FROM users WHERE email =?"

        db.query(selectQuery, [email], (err, info) => {

            if (err) return res.status(500).json({ error: "Database error" })

            const person_code = info[0]?.person_code;

            console.log("im from backend PErson_Code", person_code);
            
            if (!person_code) return res.status(400).json({ error: "Person code not found" })
                console.log(person_code ,"Person_Code in backend")

                
            const permissionQuery = "SELECT * FROM permissions WHERE person_code= ?";

            db.query(permissionQuery, [person_code], (perErr, perResult) => {

                if (perErr) return res.status(500).json({ error: "Failed to fetch permission" })

                const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" })

                console.log("All result in backend",perResult);
                
                return res.status(200).json({
                    message: user.role == "admin" ? "Admin Login Successfull" : "Login Successfull",
                    token,
                    role: user.role,
                    username: user.username,
                    email: user.email,
                    person_code,
                    permission: perResult
                });

            });
        });
    });

});



// Login
// app.post("/login", (req, res) => {
//     const { email, password } = req.body;

//     db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {

//         if (err) return res.status(500).json({ error: "Database error" });

//         if (result.length === 0) return res.status(400).json({ error: "User not found" });

//         const selectQuery = "SELECT person_code FROM users WHERE email = ?";

//         db.query(selectQuery,[email],(err,info)=>{

//             if(err) return res.status(400).send({message : "Database Error"});


//         const user = result[0];

//             console.log(info,"Its contain Person_Code");

//         if (password !== user.password) {
//             return res.status(400).json({ error: "Invalid password" });
//         }


//         const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "10h" });

//         return res.status(200).json({
//             message: user.role === "admin" ? "Admin Login Successful" : "Login Successful",
//             token,
//             role: user.role,
//             username: user.username,
//             email: user.email,
//             person_code : info[0].person_code
//         });
//     });
// })
// });


// app.get('/person-code-details', (req, res) => {

//     const { person_code } = req.query;

//     console.log(person_code, "I am from backend");

//     const selectQuery = "SELECT * FROM permissions WHERE person_code = ? ";

//     db.query(selectQuery, [person_code], (err, info) => {

//         if (err) return res.status(400).send({ message: "Database Error" })

//         console.log("All information from backend", info[0]);

//         return res.status(200).send({ info: info })
//     })
// })




module.exports = app;