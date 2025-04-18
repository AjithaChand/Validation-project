// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const fs = require("fs");
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const db = require("../db")

// const logoUploadPath = path.join(__dirname, "uploads/logos");
// console.log(logoUploadPath);

// if (!fs.existsSync(logoUploadPath)) {
//   fs.mkdirSync(logoUploadPath, { recursive: true });
// }

// app.use("/uploads/logos", express.static(logoUploadPath));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, logoUploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// app.post("/api/company-details", upload.single("logo"), (req, res) => {
//   const { companyName, phone, email, address } = req.body;
//   const logoPath = req.file?.filename;

//   console.log("For Setting", companyName, phone, email, address, logoPath);

//   if (!companyName || !phone || !email || !address || !logoPath) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   const sql = `INSERT INTO company_details (company_name, phone, email, address, logo_path) VALUES (?, ?, ?, ?, ?)`;

//   db.query(sql, [companyName, phone, email, address, logoPath], (err, result) => {
//     if (err) {
//       console.error("Error inserting company details:", err);
//       return res.status(500).send("Database error");
//     }
//     res.status(200).send("Company details saved successfully");
//   });
// });

// app.get("/api/company-details", (req, res) => {
//   const sql = "SELECT * FROM company_details ORDER BY id DESC LIMIT 1";;

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error fetching company details:", err);
//       return res.status(500).send("Database error");
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "No company details found" });
//     }

//     const company = results[0];
//     company.logo_url = `http://localhost:5000/uploads/logos/${company.logo_path}`; // Serve full image URL

//     res.json(company);
//   });
// });


//  module.exports = app;


const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../db");

const logoUploadPath = path.join(__dirname, "..", "uploads", "logos");

if (!fs.existsSync(logoUploadPath)) {
  fs.mkdirSync(logoUploadPath, { recursive: true });
}

app.use("/uploads/logos", express.static(logoUploadPath));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoUploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
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
      console.error("Error inserting company details:", err);
      return res.status(500).send("Database error");
    }
    res.status(200).send("Company details saved successfully");
  });
});

app.get("/api/company-details", (req, res) => {
  const sql = "SELECT * FROM company_details ORDER BY id DESC LIMIT 1";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching company details:", err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No company details found" });
    }

    const company = results[0];
    company.logo_url = `http://localhost:7009/uploads/logos/${company.logo_path}`;

    res.json(company);
  });
});

module.exports = app;
