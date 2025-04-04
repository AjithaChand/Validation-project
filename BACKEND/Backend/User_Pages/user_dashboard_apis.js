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



if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
}

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });


// Create customer table in  user

app.post('/create-for-user', upload.single('file'), (req, res) => {
    const { email, startdate, enddate, policy } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!filePath) {
        return res.status(400).json({ error: "File is required." });
    }

    const sql = "INSERT INTO customer_details (email, startdate, enddate, policy, file_path) VALUES (?, ?, ?, ?, ?)";
    const values = [email, startdate, enddate, policy, filePath];

    db.query(sql, values, (err, result) => {

        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Details submitted successfully" });
    });
});


app.get('/data-for-user-edit-by-email/:email', (req, res) => {
    const email = req.params.email;

    const query = "SELECT * FROM customer_details WHERE email = ?";
    db.query(query, [email], (err, result) => {
        if (err) return res.status(400).send({ message: "Database Error" });

        if (result && result.length > 0) {
            return res.status(200).json({ result: result });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    });
});

//updation in details
app.put('/edit-user-data-by-email/:email', (req, res) => {
    const email = req.params.email;
    let { startdate, enddate, policy } = req.body;

    console.log('Received data:', { email, startdate, enddate, policy });

    if (!email || !startdate || !enddate || !policy) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const values = [startdate, enddate, policy, email];

    const sql = "UPDATE customer_details SET startdate=?, enddate=?, policy=? WHERE email=?";

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: err.message });
        }

        return res.status(200).json({ message: "Your details have been updated successfully!" });
    });
});


  module.exports=app;