const express = require("express");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads/logos", express.static(path.join(__dirname, "uploads/logos")));

const db = require("../db");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/logos/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/api/company-details", upload.single("logo"), (req, res) => {
  const { companyName, phone, email, address } = req.body;
  const logoPath = req.file?.filename;

  if (!companyName || !phone || !email || !address || !logoPath) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO company_details (company_name, phone, email, address, logo_path) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [companyName, phone, email, address, logoPath], (err, result) => {
    if (err) {
      console.error(" Error inserting company details:", err);
      return res.status(500).send("Database error");
    }
    res.status(200).send(" Company details saved successfully");
  });
});

module.exports = app;