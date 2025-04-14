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
    const { username, email, password} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')";
      
        db.query(sql, [username, email, password], (err, result) => {
          
            if (err) return res.status(500).json({ error: "Error inserting into the database" });

            const selectSql = "SELECT person_code FROM users WHERE email = ?";

            db.query(selectSql, [email], (selectErr, selectResult) => {

                if (selectErr) return res.status(500).json({ error: selectErr.message });

                return res.status(200).json({ message: "User Registered successfully" });

    //             const person_code = selectResult[0]?.person_code;

    //             if (!person_code) return res.status(500).json({ error: "Person code not found" });

    //             const pages = ["dashboard", "payslip"];

    //             const permissionSql = `
    //                 INSERT INTO permissions (person_code, page_name, can_create, can_read, can_update, can_delete)
    //                 VALUES ?
    //             `;
    //             const permissionValues = pages.map(page => [
    //                 person_code,
    //                 page,
    //                 create,
    //                 read,
    //                 update,
    //                 remove
    //             ]);

    //             console.log("permissionValues",permissionValues);
                
                
    //             db.query(permissionSql, [permissionValues], (permErr) => {
    //                 console.log(permErr);
                    
    //                 if (permErr) return res.status(500).json({ error: "Failed to insert permissions" });

    //              
    //     })
      });
    });
  });
})

module.exports = app;