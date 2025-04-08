const express = require("express");
const cors = require("cors");

const{verifyToken,isAdmin}=require("../../Login_Register/auth")
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("../../db");

app.post("/admin-post-salary",verifyToken,isAdmin, (req, res) => {
    const { name, email, total_salary, pf_number, esi_amount, pf_amount, gross_salary, net_amount } = req.body;

    console.log("admin salary post",name,email,total_salary,pf_amount);
    
    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }

    const query = "SELECT * FROM payslip WHERE emp_email = ?";
    
    db.query(query, [email], (err, info) => { 
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
        });
    });
});

app.put('/admin-edit-salary',verifyToken,isAdmin, (req, res) => {
    const { total_salary, esi_amount, pf_amount, gross_salary, net_amount, email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }

    const selectQuery = "SELECT * FROM payslip WHERE emp_email = ?";

    db.query(selectQuery, [email], (err, info) => {
        if (err) {
            console.log("Database Error", err);
            return res.status(500).send({ message: "Database Error" });
        }

        if (info.length === 0) {
            console.log("Unknown Email For Update");
            return res.status(409).send({ message: "Unknown Email For Update" });
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
        });
    });
});



// app.get("/get-user-payslip", (req, res) => {
//   const email = req.query.email;

//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }

//   const query = "SELECT total_salary, pf_amount, esi_amount, gross_salary, net_amount FROM payslip WHERE emp_email = ?";

//   db.query(query, [email], (err, results) => {
//     if (err) {
//       console.error("Error fetching payslip:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "No payslip found for this email" });
//     }
	
// 	res.send({results:results[0]});
//   });
// });



module.exports=app;