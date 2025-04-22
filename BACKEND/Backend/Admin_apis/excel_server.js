const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());


const db = require('../db')


// dashboard page 

app.get("/download-excel",(req, res) => {
   
    const query = "SELECT email, startdate, enddate, policy, subject, content FROM customer_details";

    db.query(query,(err, results) => {

        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database Query Failed" });
        }

        const worksheet = xlsx.utils.json_to_sheet(results);

        const range = xlsx.utils.decode_range(worksheet["!ref"]);
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const cellRefStart = xlsx.utils.encode_cell({ r: row, c: 1 }); 
            const cellRefEnd = xlsx.utils.encode_cell({ r: row, c: 2 });   

            if (worksheet[cellRefStart] && worksheet[cellRefStart].v) {
                worksheet[cellRefStart].z = "yyyy-mm-dd"; 
            }
            if (worksheet[cellRefEnd] && worksheet[cellRefEnd].v) {
                worksheet[cellRefEnd].z = "yyyy-mm-dd"; 
            }
        }

              worksheet['!cols'] = [
                { wpx: 150 }, 
                { wpx: 100 }, 
                { wpx: 100 }, 
                { wpx: 150 }, 
                { wpx: 150 }, 
                { wpx: 200 } 
            ];

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Policy");

        const dir = "./downloads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = `${dir}/policy.xlsx`;
        xlsx.writeFile(workbook, filePath);
        
        res.download(filePath, "policy.xlsx", (err) => {
            if (err) console.error("File Download Error:", err);
            fs.unlinkSync(filePath);
        });
    });
});

// user page

app.get("/download-excel-for-user-data", (req, res) => {
   
    const query = `SELECT 
  u.username, 
  u.email, 
  u.password, 
  p.joining_date, 
  p.bank_details, 
  p.pf_number, 
  p.esi_number, 
  p.total_salary 
FROM 
  users u 
LEFT JOIN 
  payslip p 
ON 
  u.email = p.emp_email;
    `;

    db.query(query,(err, results) => {

        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database Query Failed" });
        }

        const worksheet = xlsx.utils.json_to_sheet(results);

        const range = xlsx.utils.decode_range(worksheet["!ref"]);
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
            const cellRef = xlsx.utils.encode_cell({ r: row, c: 3 }); 
            if (worksheet[cellRef] && worksheet[cellRef].v) {
                const dateVal = new Date(worksheet[cellRef].v);
                if (!isNaN(dateVal)) {
                    worksheet[cellRef].v = dateVal;
                    worksheet[cellRef].t = 'd'; 
                    worksheet[cellRef].z = "yyyy-mm-dd"; 
                }
            }
        }
        

              worksheet['!cols'] = [
                { wpx: 150 }, 
                { wpx: 150 }, 
                { wpx: 150 },
                { wpx: 180 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 },
            ];

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

        const dir = "./downloads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = `${dir}/user_data.xlsx`;
        xlsx.writeFile(workbook, filePath);
        
        res.download(filePath, "user_data.xlsx", (err) => {
            if (err) console.error("File Download Error:", err);

            fs.unlinkSync(filePath);
        });
    });
});

// attendance page

app.get("/download-excel-for-attendance-data", (req, res) => {
   
    const query = "SELECT emp_name, emp_email, office_name, total_salary, pf_number, esi_number, pf_amount, esi_amount, net_amount, leave_days, revised_salary FROM payslip";

    db.query(query,(err, results) => {

        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database Query Failed" });
        }

        const worksheet = xlsx.utils.json_to_sheet(results);

              worksheet['!cols'] = [
                { wpx: 150 }, 
                { wpx: 150 }, 
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 },
                { wpx: 150 }
            ];

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Payslip");

        const dir = "./downloads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = `${dir}/payslip_data.xlsx`;
        xlsx.writeFile(workbook, filePath);
        
        res.download(filePath, "payslip_data.xlsx", (err) => {
            if (err) console.error("File Download Error:", err);

            fs.unlinkSync(filePath);
        });
    });
});


// app.get("/download-excel", (req, res) => {
//     const query = "SELECT id, email, startdate, enddate, policy, subject, content FROM customer_details";
//     generateExcel(query, [], res); 
// });

// app.get("/download-excel-for-user/:id", (req, res) => {
//     const userId = req.params.id;
//     const query = "SELECT email, startdate, enddate, policy, subject, content FROM customer_details WHERE id = ?";
//     generateExcel(query, [userId], res);
// });



//Upload the excel sheet in dashboard page

const upload = multer({ dest: "uploads/" });

app.post("/upload-excel", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const parseExcelDate = (excelDate) => {
        if (!excelDate) return null; 
        if (typeof excelDate === "number") {
            return new Date((excelDate - 25569) * 86400000).toISOString().split("T")[0];
        }
        return new Date(excelDate).toISOString().split("T")[0];
    };

    const values = sheetData.map((row) => [
        row.email,                       
        parseExcelDate(row.startdate),  
        parseExcelDate(row.enddate),    
        row.policy                       
    ]);
    
    if (values.length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "No valid data in the file" });
    }

    console.log("Parsed values before DB insert:", values); 

    const query = `
        INSERT INTO customer_details (email, startdate, enddate, policy)
        VALUES ? 
        ON DUPLICATE KEY UPDATE 
        startdate = VALUES(startdate), 
        enddate = VALUES(enddate), 
        policy = VALUES(policy)`;

    db.query(query, [values], (err) => {
        fs.unlinkSync(filePath); 
        if (err) {
            console.error("Database Insert/Update Error:", err);
            return res.status(500).json({ error: "Database Operation Failed" });
        }
        res.json({ success: true, message: "Data Inserted/Updated Successfully" });
    });
});
  

//Upload the excel sheet in user page

app.post("/upload-excel-for-userdata", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const userValues = sheetData.map((row) => [
        row.username,
        row.email,
        row.password
    ]);

    const userQuery = `
        INSERT INTO users (username, email, password)
        VALUES ? 
        ON DUPLICATE KEY UPDATE 
            username = VALUES(username),
            email = VALUES(email), 
            password = VALUES(password)
    `;

    db.query(userQuery, [userValues], (userErr, userResult) => {
        if (userErr) {
            fs.unlinkSync(filePath);
            console.error("User Insert Error:", userErr);
            return res.status(500).json({ error: "User Insert/Update Failed" });
        }

        const payslipValues = sheetData.map((row) => [
            row.email,              // emp_email
            row.joining_date,
            row.bank_details,
            row.pf_number,
            row.esi_number,
            row.total_salary
        ]);

        const payslipQuery = `
            INSERT INTO payslip (
                emp_email, joining_date, bank_details, pf_number, esi_number, total_salary
            )
            VALUES ?
            ON DUPLICATE KEY UPDATE 
                joining_date = VALUES(joining_date),
                bank_details = VALUES(bank_details),
                pf_number = VALUES(pf_number),
                esi_number = VALUES(esi_number),
                total_salary = VALUES(total_salary)
        `;

        db.query(payslipQuery, [payslipValues], (payErr, payResult) => {
            fs.unlinkSync(filePath);
            if (payErr) {
                console.error("Payslip Insert Error:", payErr);
                return res.status(500).json({ error: "Payslip Insert/Update Failed" });
            }

            return res.json({ 
                success: true, 
                message: "User and Payslip Data Inserted/Updated Successfully" 
            });
        });
    });
});


// upload in attendance page 


app.post("/upload-excel-for-attendancedata", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const values = sheetData.map((row) => [
        row.emp_name,
        row.emp_email,
        row.office_name,
        row.total_salary,
        row.pf_number,
        row.esi_number,
        row.pf_amount,
        row.esi_amount,
        row.net_amount,
        row.leave_days,
        row.revised_salary
    ]);

    if (values.length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "No valid data in the file" });
    }

    const query = `
        INSERT INTO payslip (
            emp_name, emp_email, office_name, total_salary, pf_number,
            esi_number, pf_amount, esi_amount, net_amount, leave_days, revised_salary
        ) VALUES ?
        ON DUPLICATE KEY UPDATE 
            emp_name = VALUES(emp_name),
            office_name = VALUES(office_name),
            total_salary = VALUES(total_salary),
            pf_number = VALUES(pf_number),
            esi_number = VALUES(esi_number),
            pf_amount = VALUES(pf_amount),
            esi_amount = VALUES(esi_amount),
            net_amount = VALUES(net_amount),
            leave_days = VALUES(leave_days),
            revised_salary = VALUES(revised_salary)
    `;

    db.query(query, [values], (err, result) => {
        fs.unlinkSync(filePath);
        if (err) {
            console.error("Database Insert/Update Error:", err);
            return res.status(500).json({ error: "Database Operation Failed" });
        }
        console.log("Rows affected from Excel:", result.affectedRows);
        return res.json({ success: true, message: "Data Inserted/Updated Successfully" });
    });
});

 

// app.post("/upload-excel/:id", upload.single("file"), (req, res) => {
//     const id = req.params.id;
  
//     console.log("Id for update excel");
  
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
  
//     const filePath = req.file.path;
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
//     const parseExcelDate = (excelDate) => {
//       if (!excelDate) return null;
//       if (typeof excelDate === "number") {
//         return new Date((excelDate - 25569) * 86400000).toISOString().split("T")[0];
//       }
//       return new Date(excelDate).toISOString().split("T")[0];
//     };
  
//     const values = sheetData.map((row) => [
//       row.email,
//       parseExcelDate(row.startdate),
//       parseExcelDate(row.enddate),
//       row.policy,
//     ]);
  
//     if (values.length === 0) {
//       fs.unlinkSync(filePath);
//       return res.status(400).json({ error: "No valid data in the file" });
//     }
  
//     console.log("Parsed values before DB insert:", values);
  
//     const query = `
//       UPDATE customer_details
//       SET
//         email = ?,  
//         startdate = ?,
//         enddate = ?,
//         policy = ?
//       WHERE id = ?`;
  
//     values.forEach((row) => {
//       db.query(query, [...row, id], (err, result) => {
//         if (err) {
//           console.error("Database Insert/Update Error:", err);
//           return res.status(500).json({ error: "Database Operation Failed" });
//         }
//       });
//     });
  
//     fs.unlinkSync(filePath);
  
//     res.json({ success: true, message: "Data Inserted/Updated Successfully" });
//   });
  
module.exports = app;
