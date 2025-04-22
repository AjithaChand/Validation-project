const express= require("express");
const cors=require("cors");

const app=express();

const db= require("../../db");

app.use(express.json());
app.use(cors());

app.get('/get_attendance_datas',(req,res)=>{

    const selectQuery = "SELECT * FROM payslip";

    db.query(selectQuery,(err, info)=>{
      
        if(err){
            console.log("Database Error");
            return res.status(400).send({ message : "Database Error"})            
        }

        return res.status(200).send(info)
    })
})


app.put('/put_attendance_datas',(req,res)=>{

    const {email, revised_salary} = req.body;

    const updateQuery = "UPDATE payslip SET revised_salary = ?  WHERE emp_email = ?"; 

    db.query(updateQuery,[revised_salary,email],(err, info)=>{
        
        if(err){
            console.log("Dataabse Error",err);
            return res.status(400).send({ message : "Dataabse Error"})
        }
        
        return res.status(200).send({ message : "Revised Salary Updated"})
        
    })

})
module.exports = app;