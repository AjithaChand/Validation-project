const express= require("express");
const cors=require("cors");

const app=express();

const db= require("../../db");

app.use(express.json());
app.use(cors());

app.get('/get_attendance_datas', (req, res) => {
    const { date } = req.query;

    console.log("Received Date", date);

    const now = new Date();
    const today = new Date(now).toISOString("").split("T")[0];

    if(date !== today){

        const selectQuery = `
        SELECT p.emp_id, p.emp_name, p.emp_email, a.present, a.absent, a.date 
        FROM payslip p 
        LEFT JOIN attendance a ON p.emp_id = a.emp_id AND a.date = ?
        ORDER BY 
            CASE 
                WHEN a.present = 1 THEN 1
                WHEN a.absent = 1 THEN 2
                ELSE 3
            END,
            p.emp_name ASC
    `;

        db.query(selectQuery,[date],(err,info)=>{

            if(err){
                console.log("Select Query Error is");
                return res.status(400).send({ message : "Select Query Error"})
            }

            return res.status(200).send(info);

        })

        return;
    }
    const selectQuery = `
    SELECT * FROM payslip 
    WHERE 
        (present_time IS NOT NULL AND DATE(present_time) = ?) 
        OR 
        (absent_time IS NOT NULL AND DATE(absent_time) = ?)
        OR
        (absent_time IS NULL AND present_time IS NULL)
    ORDER BY
        CASE 
            WHEN present_time IS NOT NULL AND DATE(present_time) = ? THEN 1
            WHEN absent_time IS NOT NULL AND DATE(absent_time) = ? THEN 2
            ELSE 3
        END,
        emp_name ASC;
    `;

        db.query(selectQuery, [date, date, date, date], (err, info) => {
        if (err) {
            console.log("Database Error", err);
            return res.status(500).send({ message: "Database Error", error: err.message });
        }

        if (info.length === 0) {
            return res.status(200).send([]);
        }

        return res.status(200).send(info);

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