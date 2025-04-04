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

const db = require('../../db'); 
const { error } = require("console");
const { json } = require("stream/consumers");


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


// Create customer table In admin 

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
        res.status(200).json({ message: "Details submitted successfully",});
    });
});


// Get all data for admin

app.get('/read', (req, res) => {
    const sql = "SELECT * FROM customer_details";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
});


app.get('/read-data-by-id/:id',(req,res)=>{

    const id=req.params.id;

    const sql = "SELECT * FROM customer_details WHERE id=?"

    console.log("Backend Id",id)

    db.query(sql,[id],(err,result)=>{
        if(err){
      return  res.status(400).send({message:"SQL Query Error"})
        }
        console.log(result);
        return res.status(200).send({result:result})
    })
})


app.put('/update-data-in-admin/:id',upload.single('file'),(req,res)=>{

    const {email,startdate,enddate,policy}=req.body;

    const {id}=req.params;

    const filePath = req.file?`/uploads/${req.file.filename}`:null;

    const sql = "UPDATE customer_details SET email=?,startdate=?,enddate=?,policy=?,file_path=? WHERE id =?"
    
    const values=[email,startdate,enddate,policy,filePath,id]

    if(!email||!startdate||!enddate||!policy||!filePath)

        return res.json({message:"All fields are required"})

        db.query(sql,values,(err,result)=>{

            if(err) return res.status(500).json({error:err.message})
                
            return res.status(200).json({message:"Your details have been updated successfully"})

        })

    })



//Delete
app.delete('/delete/customer_details/:id',(req,res)=>{
 
    const id = req.params.id;

    console.log(id);
    
    const sql ="DELETE FROM customer_details WHERE id=?"
    
    db.query(sql,[id],(err,data)=>{
        if(err)
            return res.status(500).json({error:err.message})
        return res.status(200).json({message:"Deleted"})
    })
})


module.exports = app;
