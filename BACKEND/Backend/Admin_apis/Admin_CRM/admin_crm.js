const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../../db");

app.get("/get-all-employeenames",(req,res)=>{

    const selectQuery = "SELECT emp_id, emp_name FROM payslip WHERE emp_name IS NOT NULL";

    db.query(selectQuery,(err,result)=>{
      
        if(err){
                return res.status(400).send({ message : "Database Error"})
        }

        return res.status(200).send(result)
    })
})

app.post("/add-crm",(req,res)=>{
    
    const {empId, empName, project, task, startDate, endDate, description } = req.body;

    const insertQuery = `INSERT INTO crm_tasks (emp_id, emp_name, project_name, task, start_date, end_date, description) 
                            VALUES 
                            (?, ?, ?, ?, ?, ?, ?)`;
    db.query(empId,empName,project,task,startDate,endDate,description,(err)=>{
        
        if(err){
            console.log("Error is", err);
            return res.status(400).send({ message : "Database Error"})
        }

        return res.status(200).send({ message : "CRM Added"})
    })
})

module.exports = app;