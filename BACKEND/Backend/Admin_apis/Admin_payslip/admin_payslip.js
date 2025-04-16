const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../../db");

app.post("/admin-post-salary",(req, res) => {
    const { name, email, total_salary, pf_number, esi_amount, pf_amount, gross_salary, net_amount } = req.body;

    console.log("admin salary post",name,email,total_salary,pf_amount);
    
    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }

    const selectQuery = "SELECT * FROM users WHERE email = ? AND username = ?";

    db.query(selectQuery,[email,name],(err,info)=>{
     
        if (err) {
            console.log("Database Error:", err);
            return res.status(500).send({ message: "Database Error" });
        } 

        if (info.length === 0) {
            console.log("Invalid Employee");
            return res.status(404).json({ message: "Invalid Employee" });
          }
          
          if (info[0].email !== email) {
            console.log("Invalid Employee Email");
            return res.status(404).json({ message: "Invalid Employee Email" });
          }

          if (info[0].username !== name) {
            console.log("Invalid Employee Name");
            return res.status(404).json({ message: "Invalid Employee Name" });
          }
          

          
    const query = "SELECT * FROM payslip WHERE emp_email = ? AND emp_name = ?";
    
    db.query(query, [email,name], (err, info) => { 
      
        if (err) {
            console.log("Database Error:", err);
            return res.status(500).send({ message: "Database Error" });
        } 

        if (info.length > 0) {
            console.log("Already salary uploaded");
            return res.status(409).send({ message: "Already salary uploaded" });
        } 

        const new_total_salary = Number(parseFloat(total_salary).toFixed(2));
        const new_esi_amount = Number(parseFloat(esi_amount).toFixed(2));
        const new_pf_amount = Number(parseFloat(pf_amount).toFixed(2));
        const new_gross_salary = Number(parseFloat(gross_salary).toFixed(2));
        const new_net_amount = Number(parseFloat(net_amount).toFixed(2));

        const values = [name, email, new_total_salary, pf_number, new_esi_amount, new_pf_amount, new_gross_salary, new_net_amount];

        const insertQuery = `INSERT INTO payslip (emp_name, emp_email, total_salary, pf_number, esi_amount, pf_amount, gross_salary, net_amount) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.log(`Admin salary upload failed for ${email}:`, err);
                return res.status(500).send({ message: "Salary Add Failed! Try Again." });
            } 
            console.log(`Admin salary added for ${email}`);
            return res.status(201).send({ message: "Salary Added Successfully" });
            })
        });
    });
});


app.put('/admin-edit-salary',(req, res) => {
    const { total_salary, esi_amount, pf_amount, gross_salary, net_amount, email, name } = req.body;

    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }

    const FirstQuery = "SELECT * FROM users WHERE email = ? AND username = ?";

    db.query(FirstQuery,[email,name],(err,info)=>{
        if (err) {
            console.log("Database Error", err);
            return res.status(500).send({ message: "Database Error" });
        }

        if (info.length === 0) {
            console.log("Unknown Employee For Update");
            return res.status(409).send({ message: "Unknown Employee For Update" });
        }

        console.log("All data", info);
        

        if (info[0].email !== email) {     
            // console.log("Received Email For Update",email)
            // console.log("Get Email For Update",info[0].email)
            // // console.log("Invalid Employee Email For Salary Update");
            return res.status(409).send({ message: "Invalid Employee Email" });
        }

        if (info[0].username !== name) {
            // console.log("Received Name For Update",name)
            // console.log("Get Name For Update",info[0].username)
            // console.log("Invalid Employee Name");
            return res.status(409).json({ message: "Invalid Employee Name" });
          }
          
    const selectQuery = "SELECT * FROM payslip WHERE emp_email = ? AND emp_name = ?";

    db.query(selectQuery, [email,name], (err, info) => {
        if (err) {
            console.log("Database Error", err);
            return res.status(500).send({ message: "Database Error" });
        }

        if (info.length === 0) {
            console.log("Unknown Email For Update");
            return res.status(409).send({ message: "Unknown Employee For Update" });
        }

        if (info[0].emp_name !== name) {

            console.log("Received Name For Update",name)
            console.log("Get Name For Update",info[0].emp_name)

            return res.status(409).send({ message: "Invalid Employee Name For Salary Update" });
        }

        if (info[0].emp_email !== email) {
            // console.log("Invalid Email");

             console.log("Received Email For Update",email)
            console.log("Get Email For Update",info[0].email)

            return res.status(409).send({ message: "Invalid Employee Email For Salary Update" });
        }


        const pf_number = info[0].pf_number; 

        const new_total_salary = Number(parseFloat(total_salary).toFixed(2));
        const new_esi_amount = Number(parseFloat(esi_amount).toFixed(2));
        const new_pf_amount = Number(parseFloat(pf_amount).toFixed(2));
        const new_gross_salary = Number(parseFloat(gross_salary).toFixed(2));
        const new_net_amount = Number(parseFloat(net_amount).toFixed(2));

        const values = [new_total_salary, new_esi_amount, new_pf_amount, new_gross_salary, new_net_amount, email];

        const updateQuery = "UPDATE payslip SET total_salary= ?, esi_amount= ?, pf_amount= ?, gross_salary= ?, net_amount= ? WHERE emp_email= ?";

        db.query(updateQuery, values, (err, result) => {
            if (err) {
                console.log("Admin salary update error", err);
                return res.status(500).send({ message: "Admin salary update error" });
            }

            console.log("Admin updated the salary, PF Number:", pf_number);

            return res.status(201).send({ message: "Admin updated the salary",pf_number: pf_number });
            })
        });
    });
});



// All Employee Names Send To Frontend;

app.get("/get-all-employee-names", (req, res) => {
    const selectQuery = "SELECT username FROM users WHERE username IS NOT  NULL";
  
    db.query(selectQuery, (err, results) => {
      if (err) {
        console.log("Database Error:", err);
        return res.status(500).json({ message: "Database Error" });
      }
      
      console.log("Successfully sent all usernames");
      return res.status(200).json({ results });
    });
  });
  
  app.get("/get-single-employee-data", (req, res) => {
    const { name } = req.query;
  
    if (!name) {
      return res.status(400).json({ message: "Name query parameter is required" });
    }
  
    const selectQuery = "SELECT emp_id, emp_email, total_salary, pf_amount, esi_amount, net_amount FROM payslip WHERE emp_name = ?";
    
    db.query(selectQuery, [name], (err, info) => {
      if (err) {
        console.log("Database Error:", err);
        return res.status(500).json({ message: "Database Error" });
      }
  
      if (info.length === 0) {
        return res.status(404).json({ message: "No employee found with this name" });
      }
  
      console.log("Fetched Employee Data:", info[0]); 
      return res.status(200).json({ results: info[0] });
    });
  });
  


    // date wise send all data;
  
    app.get("/get-all-employee-datas", (req, res) => {
    
        const { month, year, monthTo, yearTo } = req.query;
   
        if ( month && year && monthTo && yearTo){

          const startDate = `${year}-${month.padStart(2, '0')}-01`;
          const endDateObj = new Date(yearTo, monthTo, 0);
          const endDate = endDateObj.toISOString().split('T')[0];

          // if (!month) {
          //   return res.status(400).json({ message: "Month query parameter is required" });
          // }
        
          const selectQuery = "SELECT * FROM payslip WHERE dates BETWEEN ? AND ?";
          
          db.query(selectQuery, [startDate,endDate], (err, info) => {
            if (err) {
              console.log("Database Error:", err);
              return res.status(500).json({ message: "Database Error" });
            }
        
            if (info.length === 0) {
              return res.status(404).json({ message: "No employee found with this Month" });
            }
        
            console.log("Fetched Employee Data:",info); 
            return res.status(200).json({ results: info });
          });
    
        }  else if( month && year ){

          const selectQuery = "SELECT * FROM payslip WHERE MONTH(dates)= ? AND YEAR(dates) = ?";
          
          db.query(selectQuery, [month,year], (err, info) => {
            if (err) {
              console.log("Database Error:", err);
              return res.status(500).json({ message: "Database Error" });
            }
        
            if (info.length === 0) {
              return res.status(404).json({ message: "No employee found with this Month" });
            }
        
            console.log("Fetched Employee Data:",info); 
            return res.status(200).json({ results: info });
          });
        }
        
        else {
          return res.status(400).json({ message: "Month and Year query parameters are required" });
        }
        
      });
    
module.exports=app;