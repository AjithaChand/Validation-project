const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../db");

app.get("/get-single-crm-task",(req,res)=>{

    const { email } = req.query;
    console.log("Reeee Email", email);
    
    const selectIdQuery = "SELECT emp_id FROM payslip WHERE emp_email = ?";

    db.query(selectIdQuery,[email],(err, empId)=>{

        if(err){
            return res.status(400).send({message : "Database Error"})
        }

        if(empId.length === 0 ){
            return res.status(404).send({ message : "No User Found In This Email"})
        }

        const emp_Id = empId[0]?.emp_id;
        console.log("Epppp IDDD", emp_Id);
        
   const selectQuery = "SELECT * FROM crm_tasks WHERE emp_id  = ?";

   db.query(selectQuery,[emp_Id],(err, results)=>{

    if(err){
        console.log("Error is",err);
        return res.status(400).send({ message : "Database Error"})
    }

    console.log("REeeeeeeeeee", results);
    
    return res.status(200).send(results)
   })
})
})

app.post('/update-in-process',(req,res)=>{

    const {taskid,status} = req.body;

    const dayjs = require('dayjs');

    const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const selectQuery = "SELECT status FROM crm_tasks WHERE id  = ?";

    db.query(selectQuery,[taskid],(err, info)=>{

        if(err){
            return res.status(400).send({ message : "Database Error" })
        }
        
        const getStatus = info[0];

    if(status === "In Progress" && getStatus !== "Completed"){

        const updateQuery = "UPDATE crm_tasks SET status =  ?, updated_at = ? WHERE id = ?";

        db.query(updateQuery,[status,updatedAt,taskid],(err, info)=>{

            if(err){
                return res.status(400).send({ message : "Database Error"})
            }

            return res.send({message : "Let's Start"})
        })
    }

    else if (status === "On Hold"){

        if(getStatus === "Completed"){
            return res.status(404).send({ messgae : "Task Already Completed"})
        }

        const updateQuery = "UPDATE crm_tasks SET status =  ?, updated_at = ? WHERE id = ?";

        db.query(updateQuery,[status,updatedAt,taskid],(err, info)=>{

            if(err){
                return res.status(400).send({ message : "Database Error"})
            }

            return res.send({message : "ON-HOLD Task"})
        })        
    }
    else if (status === "Completed"){

        if(getStatus === "On Hold"){
            return res.status(400).send({ message : "Task Being ON-HOLD Enable In-Process"})
        }

        const updateQuery = "UPDATE crm_tasks SET status =  ?, updated_at = ? WHERE id = ?";

        db.query(updateQuery,[status,updatedAt,taskid],(err, info)=>{

            if(err){
                return res.status(400).send({ message : "Database Error"})
            }

            return res.send({message : "Task Completed"})
        })           
     }
    })
})
module.exports=app;