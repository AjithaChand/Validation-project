const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path")
const fs = require("fs")

// const verifyToken=require('../../Login_Register/auth')

const { verifyToken, verifyAdmin } = require('../../Login_Register/auth')

const app = express();
app.use(cors());
app.use(express.json());

const db = require('../../db');

//Admin registraion from admin page


app.post("/admin/register", verifyToken, verifyAdmin, (req, res) => {
    const { username, email, password, role, create, read, update, remove } = req.body;

    console.log("For checking in back-end",username,email,password,role,create,read,update,remove);
    
    console.log(`FOr Checking to Login`, username, email, password, role);

    db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
        if (err)
            return res.status(500).json({ error: err.message })
        if (result.length > 0) {
            return res.status(400).json({ error: "Email already exists" })
        }
        // const hashedPassword = await bcrypt.hash(password, 10)
        const sql = "INSERT INTO users (username,email,password,role)VALUES(?,?,?,?)";

        const values = [username, email, password, role]

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(400).json({ error: "Can not register" })
            }

            const selectSql = "SELECT person_code FROM users WHERE email = ?";

            db.query(selectSql, [email], (selectErr, selectResult) => {

                if (selectErr) return res.status(500).json({ error: selectErr.message });

                const person_code = selectResult[0]?.person_code;

                if (!person_code) return res.status(500).json({ error: "Person code not found" });

                const pages = ["dashboard", "payslip"];

                const permissionSql = `
                    INSERT INTO permissions (person_code, page_name, can_create, can_read, can_update, can_delete)
                    VALUES ?
                `;
                const permissionValues = pages.map(page => [
                    person_code,
                    page,
                    create,
                    read,
                    update,
                    remove
                ]);

                console.log("permissionValues",permissionValues);
                
                
                db.query(permissionSql, [permissionValues], (permErr) => {
                    console.log(permErr);
                    
                    if (permErr) return res.status(500).json({ error: "Failed to insert permissions" });

                    const msg = role === "admin" ? "Admin Registered Successfully" : "User Registered with Permissions";
                    return res.status(200).json({ message: msg });
                });
            });
        });
    });
});



// Get all users


app.get('/getuser', verifyToken, verifyAdmin, (req, res) => {
    const sql = "SELECT u.*, p.total_salary FROM users u LEFT JOIN payslip p ON u.email = p.emp_email";
    db.query(sql, (err, result) => {
        if (err)
            return res.status(500).json({ error: err.message })
        return res.json(result)
    })
})



//Edit data for single user

app.get('/getuser/:id', verifyToken, verifyAdmin, (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM users WHERE id = ?";

    console.log("Checking ID:", id);


    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        if (data.length === 0) return res.status(404).json({ error: "User not found" });

        console.log(data);

        return res.json(data[0]);
    });
});



//Edit user

app.put('/edituser/:id', verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const { username, email, password } = req.body;


    const sql = "UPDATE users SET username=?,email =?,password=? WHERE id=?"
    const values = [username, email, password, id]

    db.query(sql, values, (err, data) => {
        if (err)
            return res.status(500).json({ error: err.message })
        return res.status(200).json({ message: "Changes Submitted successfully" })
    })
})






app.delete('/delete/:id', verifyToken, verifyAdmin, (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM users WHERE id=?"

    db.query(sql, [id], (err, data) => {
        if (err)
            return res.status(500).json({ error: err.message })
        return res.status(200).json({ message: "Deleted" })
    })
})


module.exports = app;