require("dotenv").config()

const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path =require ("path")
const fs = require("fs")


const app= express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;


const db = require("../db");


// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {

        if (err) return res.status(500).json({ error: "Database error" });

        if (result.length === 0) return res.status(400).json({ error: "User not found" });

        const selectQuery = "SELECT person_code FROM users WHERE email = ?";

        db.query(selectQuery,[email],(err,info)=>{

            if(err) return res.status(400).send({message : "Database Error"});


        const user = result[0];

     
        if (password !== user.password) {
            return res.status(400).json({ error: "Invalid password" });
        }


        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "10h" });

        return res.status(200).json({
            message: user.role === "admin" ? "Admin Login Successful" : "Login Successful",
            token,
            role: user.role,
            username: user.username,
            email: user.email,
            person_code : info[0].person_code
        });
    });
})
});


app.get('/person-code-details',(req,res)=>{

    const {person_code} = req.query;

    console.log(person_code,"I am from backend");
    
    const selectQuery = "SELECT * FROM permissions WHERE person_code = ? ";

    db.query(selectQuery,[person_code],(err,info)=>{

        if(err) return res.status(400).send({ message : "Database Error"})
        
        console.log("All information from backend",info[0]);
            
        return res.status(200).send({ info : info })
    })
})




module.exports = app;