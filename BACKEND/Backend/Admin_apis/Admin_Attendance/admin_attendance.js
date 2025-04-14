const expres= require("express");
const cors=require("cors");

const app= express();

const db= require("../../db");

app.use(expres.json());
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

module.exports = app;