const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const nodeMailer = require("nodemailer");

const db = require("../db");

const app = express();

app.use(express.json());
app.use(cors());

cron.schedule("0 0 1 * * ",()=>{

    const today = new Date();
    const monthName = today.toLocaleString(' default', { month : "long"}).toLocaleLowerCase();
    const year = today.getFullYear();

    const columnName = `present_days_${monthName}_${year}`;

    const selectQuery = "SHOW COLUMNS FROM payslip";

    db.query(selectQuery,(err,columns)=>{

        if(err){

            console.log("Database Error");
        }
    
        const exists = columns.some(col => col.Field === columnName);

       if (!exists) {

            const alterQuery = `ALTER TABLE payslip ADD ${columnName} INT DEFAULT 0`;

            db.query(alterQuery,(err,result)=>{

                if(err){
                          console.log("Database Error");
                }

                        console.log("Next Month Field Added");
            })

        } 

    })

})
app.post('/mark-attendance',(req,res)=>{

    const { email, date, status }= req.body;

    console.log(email, date, status);
    
    const today = new Date();
    const monthName =  today.toLocaleString('default', { month : "long"}).toLowerCase();
    const year = today.getFullYear();

    const columnName = `present_days_${monthName}_${year}`;

    const selectQuery = `SELECT ${columnName} from payslip WHERE emp_email = ?`;

    db.query(selectQuery,[email],(err, info)=>{
        
        if(err){
            return res.status(400).send({ message : "Database Error"})
        }
        
        if(info.length === 0 ){

            return res.status(404).json({ message: "Employee not found" });
        }
    
        const currentCount = info[0][columnName];

    const selectQuery = "SELECT present_time FROM payslip WHERE emp_email = ?";

    db.query(selectQuery,[email],(err,response)=>{
         
        if(err){
            return res.status(400).send({ message : "Database Error"})
        }

        const getPresentTime = response[0]?.present_time;

        const storedDateOnly = new Date(getPresentTime).toISOString().split('T')[0];
        const currentDateOnly = new Date(date).toISOString().split('T')[0];

        console.log("Stored Date:", storedDateOnly, "Current Date:", currentDateOnly);
        
        if(currentDateOnly === storedDateOnly){
            return res.status(404).send({ message: "Already Present Today" });
        }


      if(status === 1){

            const updateQuery = `UPDATE payslip SET ${columnName} = ?, present_time = ? WHERE emp_email = ?`;

            db.query(updateQuery,[currentCount + 1, date, email],(err, result)=>{
                
                if(err){
                    return res.status(400).send({ message : "Database Error"})
                }

                return res.status(200).send({ message : "Present Added"})
            })
        }   
    })
  })
})



app.get("/get-user-for-attendance/:email",(req,res)=>{

    const { email } = req.params;

    console.log("Email for get data", email);
    
    const selectQuery = "SELECT emp_id, emp_name FROM payslip WHERE emp_email = ?";

    db.query(selectQuery,[email],(err,info)=>{

        if(err){
            return res.status(400).send({ message : "Database "})
        }

        return res.status(200).send(info)
    })
})


// user attendance absent email remainder

app.post("/attendance-absent",(req,res)=>{

    const { email, content, name } = req.body;

    const today = new Date().toISOString().split('T')[0];

    const transPorter = nodeMailer.createTransport({
        service : "gmail",
        auth:{
            user: "shuruthimanoharan8@gmail.com",
            pass : "okai atbb begm evnz"
        }
    })

    const mailOptions = {
        from : email,
        to : "shuruthimanoharan8@gmail.com",
        subject: `Leave of Absence Request – ${name} (${today})`,
        text: content
    }

    transPorter.sendMail(mailOptions,(err)=>{
      
        if(err){
                return res.status(400).send({ message : "Database Error"})
        }
                return res.status(200).send({ message : "Leave Applied"})
    })

})

module.exports = app;
