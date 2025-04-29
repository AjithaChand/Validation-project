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



console.log(uploadDir, "from admin api")

if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(uploadDir, { recursive: true });
}

// if(!fs.existsSync(profileDir)){

//     fs.mkdirSync(profileDir, {recursive:true})
// }

// const storage =multer.diskStorage({

//     destination : (req, file, cb)=>{

//         if(file.fieldname ==='file'){
//             cb (null, uploadDir)

//         } else if (file.fieldname ==='profile'){

//             cb(null, profileDir)
//         }else{

//             cb(new Error ('Invalid field name'), null)
//         }

//     },

//     filename: (req, file, cb)=>{

//         const extension = path.extname(file.originalname)

//         const uniqueName = crypto.randomUUID() +extension;

//         cb(null, uniqueName)

//     }
// })

// const upload = multer({storage:storage})






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






app.post('/create', verifyToken, upload.single('file') ,(req, res) => {

    const { email, startdate, enddate, policy } = req.body;

    console.log(email, email, startdate, enddate, policy, "igfdhjklgfdcvbhjkl")

 

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

     //file and profile codes  
    // const filePath = req.files['file'] ? `/uploads/${req.files['file'][0].filename }` : null ;

    // const profilePath = req.files['profile'] ? `/uploads/profile/${req.files['profile'][0].filename}` : null;



    if (!filePath ) {
        return res.status(400).json({ error: "  Files  is required." });
    }

    const sql = "INSERT INTO customer_details (email, startdate, enddate, policy, file_path) VALUES (?, ?, ?, ?, ?)";

    const values = [email, startdate, enddate, policy, filePath];

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
app.put('/update-data-in-admin/:id', verifyToken, upload.single('file'), (req, res) => {

    const { email, startdate, enddate, policy } = req.body;

    const { id } = req.params;

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

   
    console.log(filePath, "file url")

    

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

// newwwwwwwwwwwwwwwww start



app.get("/total-information", (req, res) => {

    const { date } = req.query;

    const dateObj = new Date(date); 
    const monthName = dateObj.toLocaleString('default', { month: "long" }).toLowerCase();

    const year = dateObj.getFullYear();
    
    const presentColumn = `present_days_${monthName}_${year}`;
    const absentColumn = `absent_days_${monthName}_${year}`;
    
    const query = `
        SELECT 
            COUNT(CASE WHEN DATE(present_time) = ? THEN 1 END) AS present_count,
            COUNT(CASE WHEN DATE(absent_time) = ? THEN 1 END) AS absent_count,
            COUNT(CASE 
                WHEN (DATE(present_time) != ? OR present_time IS NULL) 
                 AND (DATE(absent_time) != ? OR absent_time IS NULL) 
                THEN 1 
            END) AS no_record_count,
            SUM(${presentColumn}) AS total_present_days,
            SUM(${absentColumn}) AS total_absent_days
        FROM payslip;
    `;
    
    db.query(query, [date, date, date, date], (err, result) => {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send({ message: "Database error" });
        }
        return res.status(200).send(result[0]);
    });
});


app.get("/get-present-user",(req,res)=>{

    const {date} = req.body;

    const selectQuery = `SELECT emp_name FROM payslip WHERE DATE(present_time) = ?`;

    db.query(selectQuery, [date], (err, result) => {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send({ message: "Database error" });
        }
        return res.status(200).send(result);
    });
})

app.get("/get-absent-user",(req,res)=>{

    const {date} = req.body;

    const selectQuery = `SELECT emp_name FROM payslip WHERE DATE(absent_time) = ?`;

    db.query(selectQuery, [date], (err, result) => {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send({ message: "Database error" });
        }
        return res.status(200).send(result);
    });
})


app.get("/get-leave-user",(req,res)=>{

    const selectQuery = `SELECT emp_name FROM payslip WHERE absent_time IS NULL AND present_time IS NULL`;

    db.query(selectQuery, (err, result) => {
        if (err) {
            console.error("Query Error:", err);
            return res.status(500).send({ message: "Database error" });
        }
        return res.status(200).send(result);
    });
})


module.exports = app;
