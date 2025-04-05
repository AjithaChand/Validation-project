const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const db = require('../../db'); 

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

app.post('/create', upload.single('file'), (req, res) => {
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

// Get all customer records
app.get('/read', (req, res) => {
    const sql = "SELECT * FROM customer_details";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
});

// Get a specific customer record by ID
app.get('/read-data-by-id/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM customer_details WHERE id=?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(400).send({ message: "SQL Query Error" });
        return res.status(200).send({ result });
    });
});

// Update customer record, with optional file upload
app.put('/update-data-in-admin/:id', upload.single('file'), (req, res) => {
    const { email, startdate, enddate, policy } = req.body;
    const { id } = req.params;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Fetch the existing file path to retain it if no new file is uploaded
    const fetchSql = "SELECT file_path FROM customer_details WHERE id = ?";
    db.query(fetchSql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const existingFilePath = results.length > 0 ? results[0].file_path : null;
        const finalFilePath = filePath || existingFilePath;

        if (!email || !startdate || !enddate || !policy) {
            return res.json({ message: "All fields are required" });
        }

        const sql = "UPDATE customer_details SET email=?, startdate=?, enddate=?, policy=?, file_path=? WHERE id = ?";
        const values = [email, startdate, enddate, policy, finalFilePath, id];

        db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json({ message: "Your details have been updated successfully" });
        });
    });
});

// Delete customer record
app.delete('/delete/customer_details/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM customer_details WHERE id=?";
    
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({ message: "Deleted" });
    });
});

module.exports = app;
