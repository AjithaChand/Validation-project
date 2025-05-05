


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
console.log("File path", logoUploadPath);

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


app.post("/api/company-details", upload.fields([{ name: "logo", maxCount: 1 },{ name: "sign", maxCount: 1 }]), (req, res) => {

  const { companyName, phone, email, address } = req.body;

  const logoPath = req.files?.logo?.[0]?.filename;
  const signaturePath = req.files?.sign?.[0]?.filename;

  console.log("logo path", logoPath);
  console.log("sign path", signaturePath);
  
  if (!companyName || !phone || !email || !address || !logoPath) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO company_details (company_name, phone, email, address, logo_path, sign_path) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [companyName, phone, email, address, logoPath, signaturePath], (err, result) => {
    if (err) {
      console.error("Error inserting company details:", err);
      return res.status(500).send("Database error");
    }
    res.status(200).send("Company details saved successfully");
  });
});

app.get("/api/company-details", (req, res) => {
  console.log("yyyyyyyyyyyyyyyyyyyyyy");
  
  const sql = "SELECT * FROM company_details ORDER BY id DESC LIMIT 1";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching company details:", err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No company details found" });
    }
    console.log("Company details in backend", results[0]);
    
    const company = results[0];
    company.logo_url = `http://localhost:7009/uploads/logos/${company.logo_path}`;
    console.log("Company logo url", company.logo_url);
    
    res.json(company);
  });
});

app.post("/post-leave", (req, res) => {
  const { date, type } = req.body;

  console.log("Received Date and Type", date, type);

  const insertQuery = "INSERT INTO `leave` (date, leave_type) VALUES (?, ?)";

  db.query(insertQuery, [date, type], (err) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).send({ message: "Database Error" });
    }
    return res.status(200).send({ message: "Leave Updated" });
  });
});


app.get("/get-leave",(req,res)=>{

  const selectQuery = "SELECT * FROM `leave`";

  db.query(selectQuery,(err, info)=>{

    if(err){
      return res.status(400).send({ message :" Database Error"})
    }
     return res.send(info)
  })
})
module.exports = app;
