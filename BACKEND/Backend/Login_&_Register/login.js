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

const SECRET_KEY = "its_wonderful_day";


const db = require("../db");


// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    console.log("For Checking Login", email, password);
  
    db.query("SELECT * FROM users WHERE email = ?", [email],async(err, result) => {
      
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = result[0];

        console.log("For Checking Get Login Password", user.password);

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ error: "Invalid password" });
        // }
        if(password !== user.password){
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "10h" });

        if (user.role === "admin") {
            return res.status(200).json({ message: "Admin Login Successful", token, role: "admin", result});
        } else {
            console.log(user.username);
            
            return res.status(200).json({ message: "Login Successful", token, role: "user",username: user.username, email: user.email});

        }
    });
});



module.exports = app;