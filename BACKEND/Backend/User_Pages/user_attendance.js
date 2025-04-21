const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const nodeMailer = require("nodemailer");

const db = require("../db");

const app = express();

app.use(express.json());
app.use(cors());

cron.schedule("0 0 1 * *", () => {
    const today = new Date();
    const monthName = today.toLocaleString('default', { month: "long" }).toLowerCase();
    const year = today.getFullYear();
  
    const presentColumn = `present_days_${monthName}_${year}`;
    const absentColumn = `absent_days_${monthName}_${year}`;
  
    const selectQuery = "SHOW COLUMNS FROM payslip";
  
    db.query(selectQuery, (err, columns) => {
      if (err) {
        return console.error("Database Error on SHOW COLUMNS:", err);
      }
  
      const presentExists = columns.some(col => col.Field === presentColumn);
      const absentExists = columns.some(col => col.Field === absentColumn);
  
      if (!presentExists) {
        const alterQuery = `ALTER TABLE payslip ADD ${presentColumn} INT DEFAULT 0`;
        db.query(alterQuery, (err, result) => {
          if (err) {
            return console.error("Error adding present column:", err);
          }
          console.log(`Column ${presentColumn} added.`);
        });
      }
  
      if (!absentExists) {
        const alterQuery = `ALTER TABLE payslip ADD ${absentColumn} INT DEFAULT 0`;
        db.query(alterQuery, (err, result) => {
          if (err) {
            return console.error("Error adding absent column:", err);
          }
          console.log(`Column ${absentColumn} added.`);
        });
      }
    });
  });
  
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




// user attendance absent email remainder

app.post("/attendance-absent",(req,res)=>{

    const { email, content, name, date, status } = req.body;

    console.log("For leave", email, content, name, date, status);
    
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

        const today = new Date();
        const monthName =  today.toLocaleString('default', { month : "long"}).toLowerCase();
        const year = today.getFullYear();
    
        const columnName = `absent_days_${monthName}_${year}`;

        console.log(columnName,"Colunmname");
        
    
        const selectQuery = `SELECT ${columnName} from payslip WHERE emp_email = ?`;
    
        db.query(selectQuery,[email],(err, info)=>{
            
            console.log(info);
            
            if(err){
                return res.status(400).send({ message : "Database Error"})
            }
            
            if(info.length === 0 ){
                
                console.log("Employee Not FOund");
                return res.status(404).json({ message: "Employee not found" });
            }
        
            const currentCount = info[0][columnName];
    
        const selectQuery = "SELECT absent_time FROM payslip WHERE emp_email = ?";
    
        db.query(selectQuery,[email],(err,response)=>{
             
            if(err){
                return res.status(400).send({ message : "Database Error"})
            }
    
            const getPresentTime = response[0]?.absent_time;
    
            const storedDateOnly = new Date(getPresentTime).toISOString().split('T')[0];
            const currentDateOnly = new Date(date).toISOString().split('T')[0];
    
            console.log("Stored Date:", storedDateOnly, "Current Date:", currentDateOnly);
            
            if(currentDateOnly === storedDateOnly){
                return res.status(404).send({ message: "Already Applied Leave" });
            }
    
    
          if(status === 1){
    
                const updateQuery = `UPDATE payslip SET ${columnName} = ?, absent_time = ? WHERE emp_email = ?`;
    
                db.query(updateQuery,[currentCount + 1, date, email],(err, result)=>{
                    
                    if(err){
                        return res.status(400).send({ message : "Database Error"})
                    }
    
                    return res.status(200).send({ message : "Leave Applied"})
                })
            }   
        })
      })
    })

})


app.get('/get-user-is/:email', (req, res) => {
  const email = req.params.email;
  console.log("Backend received email:", email);
  
  const query = `
      SELECT 
          emp_id, 
          emp_name, 
          DATE_FORMAT(present_time, '%Y-%m-%d') AS present_time,
          DATE_FORMAT(absent_time, '%Y-%m-%d') AS absent_time
      FROM payslip 
      WHERE emp_email = ?
  `;

  db.query(query, [email], (err, result) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      console.log("Formatted results:", result);
      res.status(200).json(result);
  });
});  

app.get("/get-user-for-attendance/:email",(req,res)=>{

    const { email } = req.params;
    
    const selectQuery = "SELECT emp_id, emp_name FROM payslip WHERE emp_email = ?";

    db.query(selectQuery,[email],(err,info)=>{

        if(err){
            return res.status(400).send({ message : "Database "})
        }

        return res.status(200).send(info)
    })
})


module.exports = app;
