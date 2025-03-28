const express= require('express');
const nodemailer= require('nodemailer');
const mysql=require('mysql2');
const cors=require('cors');

const app= express();
app.use(cors());
app.use(express.json());


const db={
    host:'localhost',
    user:'root',
    password:'Aji@1020',
    database:'task',
}

const conn= mysql.createConnection(db);

conn.connect((err)=>{
    if(err){
        console.log("Mysql connection failed");
        return
    } 
    console.log("MySql Connection success");  
})


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

    conn.query(query, [todayStr, nextMonthStr, todayStr], (err, users) => {

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
                    conn.query(updateQuery, [todayStr, user.id], (err, result) => {
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


module.exports=app
// app.post('/email',(req,res)=>{
//    const {email,startDate,endDate,policy} = req.body;

//    console.log(email,startDate,endDate,policy);
   
//    const query = "INSERT INTO policy (email,start_date,end_date,policy) VALUES (?, ?, ?, ?)";
   
//    conn.query(query,[email,startDate,endDate,policy],(err,info)=>{
//     if(err){
//             console.log("Can't insert the data");
//     return  res.status(400).json({success:false, message: "Server Error"});
//     } 
//     if(info.email === email){
//         res.status(404).json({status:404, message:"Already Exist Email"})
//     }
//             console.log("Successfully insert the data");
//     return res.status(200).json({success:true, message:"Success"})
//    })
// })


// app.get("/email/get",(req,res)=>{
//     const query = "SELECT * FROM policy";
//     conn.query(query,(err,result)=>{
//         if(err) throw err;
//         res.json(result);
//         return console.log("Successfullly fetch data");
        
//     })
// })


// app.listen(8000,(err)=>{
//     if(err) throw err;
//     console.log('Post Listening on 3001');
// })
