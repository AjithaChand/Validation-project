const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../db");

app.get("/get-single-crm-task",(req,res)=>{

    const { email } = req.query;

   const selectQuery = "SELECT * FROM crm_tasks WHERE emp_id  = ?";

   db.query(selectQuery,(err, results)=>{

    if(err){
        console.log("Error is",err);
        return res.status(400).send({ message : "Database Error"})
    }

    return res.status(200).send(results)
   })
})

module.exports=app;