const express= require('express');
const nodemailer= require('nodemailer');
const mysql=require('mysql2');
const cors=require('cors');
const {verifyToken,isAdmin}=require("../Login_Register/auth")
const app= express();
app.use(cors());
app.use(express.json());

const db = require('../db'); 





const transPorter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'ananthliterature@gmail.com',
        pass:'smwa gqfy bodl zhcb',
    }
})

const sendReminderEmails = () => {
    console.log("Checking for users who need email reminders...");

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; 

    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1); 
    const nextMonthStr = nextMonth.toISOString().split("T")[0];

    const query = `
        SELECT id, email, subject, content, last_email_sent 
        FROM customer_details
        WHERE enddate BETWEEN ? AND ? 
        AND (last_email_sent IS NULL OR last_email_sent < ?)
    `;                                    
                                    //  2025-03-25 < 2025-03-26

    db.query(query, [todayStr, nextMonthStr, todayStr], (err, users) => {

        console.log("Today date",todayStr);
        console.log("Next date", nextMonthStr);
        
        
        if (err) {
            console.log("Database Query Error:", err);
            return;
        }
        if (users.length === 0) {
            console.log("No users found for email reminders.");
            return;
        }

        console.log("user data", users);
        

        users.forEach((user) => {
            const mailOptions = {
                from: "ananthliterature@gmail.com",
                to: user.email,
                subject: user.subject,
                text: user.content,
            };

            transPorter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(`Error sending email to ${user.email}:`, err);
                } else {
                    console.log(`Email sent to ${user.email}`);

                    const updateQuery = `UPDATE customer_details SET last_email_sent = ? WHERE id = ?`;
                    db.query(updateQuery, [todayStr, user.id], (err, result) => {
                        if (err) {
                            console.log(`Error updating last_email_sent for ${user.email}:`, err);
                        } else {
                            console.log(`Updated last_email_sent for ${user.email}`);
                        }
                    });
                }
            });
        });
    });
};


sendReminderEmails()
setInterval(sendReminderEmails, 24 * 60 * 60 * 1000);



app.post("/password_changed",verifyToken,isAdmin,(req,res)=>{

    const {email, password} = req.body;
    

    console.log(email);
    console.log(password);

    mailOptions = {
        from:'ananthliterature@gmail.com',
        to:email,
        subject:'Your Password Changed',
        text: `Your New Password  ${password}`
    }

    transPorter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(`Failed to send email ${email}`);
            return res.status(400).json({success: false, message: `Failed to send email ${email}`})
        }   
           console.log(`Send email to ${email}`);
           return  res.status(200).send({success:true, message: `Send email to ${email}`})
    })
})

app.post("/email_for_register",(req,res)=>{
    const {username,email} = req.body;
    console.log(`Received Email${email} For This ${username}`);
    
    const mailOptions ={
        from: "ananthliterature@gmail.com",
        to:email,
        subject:`Hello${username}`,
        content:`Thank YOu Register In Our Web. I Belive Your'e Doing Wells`,
    }

    transPorter.sendMail(mailOptions,(err)=>{
        if(err){
            console.log(`Resister Email Send Failed TO ${email}`);
            return res.status(400).send({message : `Resister Email Send Fialed To ${email}`})
        }
        console.log(`Register Email Send To ${email}`);
        
        return res.status(200).send({message: `Register Email Send To ${email}`})
    })
})

module.exports=app



