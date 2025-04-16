// const express = require("express");
// const jwt = require("jsonwebtoken");
// const mysql = require("mysql2");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const {verifyToken,verifyUser} = require('../Login_Register/auth')

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = require("../db");

// const uploadDir = path.join(__dirname, "../uploads");
// console.log(uploadDir,"from user apis");

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//     console.log("Uploads directory created:", uploadDir);
// }

// // Serve static files from the uploads folder
// app.use("/uploads", express.static(uploadDir));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// // Create customer table in user
// app.post("/create-for-user",verifyToken,verifyUser, upload.single("file"), (req, res) => {
//     const { email, startdate, enddate, policy } = req.body;
//     const filePath = req.file ? `/uploads/${req.file.filename}` : null;

//     if (!req.file) {
//         return res.status(400).json({ error: "File is required." });
//     }

//     console.log("File uploaded successfully:", filePath);

//     const sql = "INSERT INTO customer_details (email, startdate, enddate, policy, file_path) VALUES (?, ?, ?, ?, ?)";
//     const values = [email, startdate, enddate, policy, filePath];

//     db.query(sql, values, (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(200).json({ message: "Details submitted successfully", filePath });
//     });
// });

// // Get user data by email    

// //     app.get("/data-for-user-edit-by-email/:email", verifyToken, isUser, (req, res) => {
// //         console.log("FULL URL:", req.originalUrl);
// //         console.log("PARAMS:", req.params);
// //         console.log("EMAIL from params:", req.params.email);
    
    
// //     const email = req.params.email;
    
// //     console.log("Backend email",email)


// //     const query = "SELECT * FROM customer_details WHERE email = ?";


// //     db.query(query, [email], (err, result) => {
// //         if (err) return res.status(400).send({ message: "Database Error" });
// //         if (result.length > 0) {
// //             return res.status(200).json({ result: result });
// //         } else {
// //             return res.status(404).json({ message: "User not found" });
// //         }
// //     });
// // });

// app.get("/data-for-user-edit-by-email/:email",verifyToken,verifyUser,(req, res) => {
//     console.log("FULL URL:", req.originalUrl);
//     console.log("PARAMS:", req.params);
//     console.log("EMAIL from params:", req.params.email);
  


// const email = req.params.email;

// console.log("Backend email",email)


// const query = "SELECT * FROM customer_details WHERE email = ?";


// db.query(query, [email], (err, result) => {
//     if (err) return res.status(400).send({ message: "Database Error" });
//     console.log(result,"Checking get result")

//     if (result.length > 0) {
//         return res.status(200).json({ result: result });
//     } else {
//         return res.status(404).json({ message: "User not found" });
//     }
// });
// });

// // Update user details
// app.put("/edit-user-data-by-email/:email",verifyToken,verifyUser, upload.single("file"), (req, res) => {
//     const email = req.params.email;
//     let { startdate, enddate, policy } = req.body;
//     const filePath = req.file ? `/uploads/${req.file.filename}` : req.body.file_path;

//     console.log("Updating user data:", { email, startdate, enddate, policy, filePath });

//     if (!email || !startdate || !enddate || !policy || !filePath) {
//         return res.status(400).json({ error: "All fields are required." });
//     }
      
//     const values = [startdate, enddate, policy, filePath, email];
//     console.log("Checking customer details",enddate,policy)
//     const sql = "UPDATE customer_details SET startdate=?, enddate=?, policy=?, file_path=? WHERE email=?";

//     db.query(sql, values, (err, data) => {
//         if (err) {
//             console.error("Error:", err);
//             return res.status(500).json({ error: err.message });
//         }
//         return res.status(200).json({ message: "Your details have been updated successfully!" });
//     });
// });

// module.exports = app;
