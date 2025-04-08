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

const db = require("../db"); 




// Registration 
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')";
        db.query(sql, [username, email, password], (err, result) => {
            if (err) return res.status(500).json({ error: "Error inserting into the database" });

            return res.status(200).json({ message: "User Registered successfully" });
        });
    });
});

module.exports = app;