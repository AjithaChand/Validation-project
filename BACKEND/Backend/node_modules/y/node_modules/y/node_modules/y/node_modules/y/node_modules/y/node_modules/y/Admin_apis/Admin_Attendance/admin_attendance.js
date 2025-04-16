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


app.get('/get_attendance_datas', (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).send({ message: "Employee name is required" });
    }

    const selectQuery = "SELECT * FROM payslip WHERE emp_name = ?";

    db.query(selectQuery, [name], (err, results) => {
        if (err) {
            console.log("Database Error", err);
            return res.status(500).send({ message: "Database Error" });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: "Employee not found" });
        }

        return res.status(200).send(results[0]); 
    });
});


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