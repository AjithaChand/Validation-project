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
            email: user.email
        });
    });
});




module.exports = app;