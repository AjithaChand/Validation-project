const express = require("express");
const cors = require("cors");

const{verifyToken,isUser}=require("../Login_Register/auth")
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../db");


app.get("/get-user-payslip", verifyToken, isUser, (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    const query = "SELECT * FROM payslip WHERE emp_email = ?";
  
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error fetching payslip:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "No payslip found for this email" });
      }
      console.log('reslutsssssssssss',results[0])
      res.json({ 
        results: results[0] 
      });
      
    });
});

  
  
  module.exports=app;