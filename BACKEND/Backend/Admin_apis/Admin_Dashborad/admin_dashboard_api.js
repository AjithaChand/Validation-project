const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const crypto = require("crypto")

const { verifyToken } = require("../../Login_Register/auth")

const app = express();
app.use(cors());
app.use(express.json());

const db = require('../../db');

const uploadDir = path.join(__dirname, '../../uploads');

const profileDir = path.join(__dirname, "..", "uploads", "profile")

console.log(uploadDir, "from admin api")

if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(uploadDir, { recursive: true });
}

if(!fs.existsSync(profileDir)){

    fs.mkdirSync(profileDir, {recursive:true})
}

const storage =multer.diskStorage({

    destination : (req, file, cb)=>{

        if(file.fieldname ==='file'){
            cb (null, uploadDir)

        } else if (file.fieldname ==='profile'){

            cb(null, profileDir)
        }else{

            cb(new Error ('Invalid field name'), null)
        }

    },

    filename: (req, file, cb)=>{

        const extension = path.extname(file.originalname)

        const uniqueName = crypto.randomUUID() +extension;

        cb(null, uniqueName)

    }
})

const upload = multer({storage:storage})






app.use('/uploads', express.static(uploadDir));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {

//         cb(null, uploadDir);

//     },
//     filename: (req, file, cb) => {

//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

//         cb(null, uniqueSuffix + path.extname(file.originalname));

//     }
// });

// const upload = multer({ storage: storage });


//profile photo updation





// const profileStore = multer.diskStorage({

//     destination: (req, file, cb) => {

//         cb(null, profileDir)
//     },

//     filename: (req, file, cb) => {

//         const fileName= path.extname(file.originalname)

//         const uniqueName = crypto.randomUUID();

//         const profileName = `${fileName},${uniqueName}`

//         cb(null, profileName)
   

//     }
// })

// const uploadProfile = multer({storage:profileStore})




app.post('/create', verifyToken, upload.fields([{name: 'file', maxCount: 1}, {name: 'profile', maxCount :1}]), (req, res) => {

    const { email, startdate, enddate, policy } = req.body;

    console.log(email, email, startdate, enddate, policy, "igfdhjklgfdcvbhjkl")

  //file and profile codes  

    // const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const filePath = req.files['file'] ? `/uploads/${req.files['file'][0].filename }` : null ;

    const profilePath = req.files['profile'] ? `/uploads/profile/${req.files['profile'][0].filename}` : null;



    if (!filePath || !profilePath) {
        return res.status(400).json({ error: " Both Files and profiles is required." });
    }

    const sql = "INSERT INTO customer_details (email, startdate, enddate, policy, file_path, profile_path) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [email, startdate, enddate, policy, filePath, profilePath];

    db.query(sql, values, (err, result) => {

        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ message: "Details submitted successfully" });
    });
});

// Get all customer records
app.get('/read', verifyToken, (req, res) => {

    const sql = "SELECT * FROM customer_details";


    db.query(sql, (err, data) => {

        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json(data);

    });
});

// Get a specific customer record by ID
app.get('/read-data-by-id/:id', verifyToken, (req, res) => {

    const id = req.params.id;

    console.log("Fetching record for ID:", id);

    const sql = "SELECT * FROM customer_details WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(400).send({ message: "SQL Query Error" });
        return res.status(200).send({ result });
    });
});

// Update customer record, with optional file upload
app.put('/update-data-in-admin/:id', verifyToken, upload.fields([{name: 'file', maxCount:1}, {name: 'profile', maxCount:1}]), (req, res) => {

    const { email, startdate, enddate, policy } = req.body;

    const { id } = req.params;

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    console.log(filePath, "file url")

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
app.delete('/delete/customer_details/:id', verifyToken, (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM customer_details WHERE id=?";

    db.query(sql, [id], (err, data) => {

        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({ message: "Deleted" });
    });
});

module.exports = app;
