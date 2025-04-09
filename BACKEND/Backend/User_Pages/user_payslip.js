const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../db");


app.get("/get-user-payslip", (req, res) => {
    const {email,name} = req.query;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
  
    const selectQuery = "SELECT * FROM users WHERE email = ?";

    db.query(selectQuery,[email],(err,info)=>{

      if (err) {
        console.error("Error fetching payslip:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (info.length === 0) {
        console.log("Invalid Employee");
        return res.status(404).json({ message: "Invalid Employee" });
      }
      
      if (info[0].email !== email) {
        console.log("Invalid Employee Email");
        return res.status(404).json({ message: "Invalid Employee Email" });
      }
      
    const query = "SELECT * FROM payslip WHERE emp_email = ?";
  
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error fetching payslip:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      if (results.length === 0) {
        console.log("No payslip found for this email");
        return res.status(404).json({ message: "No payslip found for this email" });
      }
      
      if (results[0].emp_email !== email) {
        console.log("Invalid Employee Email");
        return res.status(404).json({ message: "Invalid Employee Email" });
      }
      
      if (results[0].emp_name !== name) {
        console.log( "Invalid Employee Name" );
        return res.status(404).json({ message: "Invalid Employee Name" });
      }
      
      res.json({ 
        results: results[0]
          })
       });
    });
});

  
  
  module.exports=app;