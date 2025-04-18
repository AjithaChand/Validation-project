const exprss = require("express");
const cors = require=require("cors");
const cron = require("node-cron");

const db = require("../db");

const app = express();

app.use(exprss.json());
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

    const { email, status }= req.body;

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

      if(status === 1){

            const updateQuery = `UPDATE payslip SET ${columnName} = ? WHERE emp_email = ?`;

            db.query(updateQuery,[currentCount + 1, email],(err, result)=>{
                
                if(err){
                    return res.status(400).send({ message : "Database Error"})
                }

                return res.status(200).send({ message : "Present Added"})
            })

        }   
    })
})


app.get("/get-user-for-attendance",(req,res)=>{

    const { email } = req.query;

    const selectQuery = "SELECT * FROM payslip WHERE emp_email = ?";

    db.query(selectQuery,[email],(err,info)=>{

        if(err){
            return res.status(400).send({ message : "Database "})
        }

        return res.status(200).send(info)
    })
})