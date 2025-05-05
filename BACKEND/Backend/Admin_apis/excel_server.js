const express = require("express");
const cors = require("cors");
const multer = require("multer");
const ExcelJS = require('exceljs'); 
const fs = require("fs");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = require('../db');

const upload = multer({ dest: "uploads/" });
require('dotenv').config()

const mysql2 = require('mysql2/promise')


const db1 = mysql2.createPool({
    host:process.env.DB_HOST,

    user:process.env.DB_USER,

    password:process.env.DB_PASSWORD,

    database:process.env.DB_DATABASENAME,

    port: process.env.PORT_NAME,

    
})

db1.getConnection((err, connection) => {
    if (err) {
        console.log("DB connection failed234567", err.message);
        return;
    }

    console.log("DB connected successfully");
    connection.release();
});


app.get("/download-excel", async (req, res) => {
    const query = "SELECT email, startdate, enddate, policy, subject, content FROM customer_details";

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Policy");

        worksheet.columns = [
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Start Date', key: 'startdate', width: 10 },
            { header: 'End Date', key: 'enddate', width: 10 },
            { header: 'Policy', key: 'policy', width: 25 },
            { header: 'Subject', key: 'subject', width: 25 },
            { header: 'Content', key: 'content', width: 40 }
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' } 
            };
            cell.font = { bold: true };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        results.forEach(row => {
            worksheet.addRow(row);
        });

    
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { 
                ['startdate', 'enddate'].forEach(col => {
                    const cell = row.getCell(col);
                    if (cell.value instanceof Date) {
                        cell.numFmt = 'yyyy-mm-dd';
                    }
                });
            }
        });

        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellLength = cell.value ? cell.value.toString().length : 0;
                if (cellLength > maxLength) maxLength = cellLength;
            });
            column.width = Math.max(column.width || 0, maxLength + 2);
        });

        const dir = "./downloads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, "policy.xlsx");
        await workbook.xlsx.writeFile(filePath);

        res.download(filePath, "policy.xlsx", (err) => {
            if (err) console.error("Download Error:", err);
            try { fs.unlinkSync(filePath); } 
            catch (err) { console.error("File Deletion Error:", err); }
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to generate Excel file" });
    }
});


//Above upload . 
app.post("/upload-excel", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const filePath = req.file.path;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        
        const worksheet = workbook.worksheets[0];
        const values = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) {
                values.push([
                    row.getCell(1).value?.toString() || null,
                    row.getCell(2).value instanceof Date 
                        ? row.getCell(2).value.toISOString().split('T')[0]
                        : (row.getCell(2).value?.toString() || null),
                    row.getCell(3).value instanceof Date 
                        ? row.getCell(3).value.toISOString().split('T')[0]
                        : (row.getCell(3).value?.toString() || null),
                    row.getCell(4).value?.toString() || null,
                    row.getCell(5).value?.toString() || null,
                    row.getCell(6).value?.toString() || null
                ]);
            }
        });

        if (values.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "No valid data in the file" });
        }

        console.log("Uploading rows:", values.length);

        const query = `
            INSERT INTO customer_details (email, startdate, enddate, policy, subject, content)
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
                startdate = VALUES(startdate), 
                enddate = VALUES(enddate), 
                policy = VALUES(policy),
                subject = VALUES(subject),
                content = VALUES(content)`;

        await db.promise().query(query, [values]);

        fs.unlinkSync(filePath);
        res.json({ success: true, message: "Data Inserted/Updated Successfully" });

    } catch (err) {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Database Operation Failed" });
    }
});

// Admin Leave Days get 


app.get("/download-excel-for-leave", async (req, res) => {
    const query = "SELECT date, leave_type FROM leave";

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Leave");

        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Holidays', key: 'leave_type', width: 15 },
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' } 
            };
            cell.font = { bold: true };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        results.forEach(row => {
            worksheet.addRow(row);
        });

    
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { 
                ['date'].forEach(col => {
                    const cell = row.getCell(col);
                    if (cell.value instanceof Date) {
                        cell.numFmt = 'yyyy-mm-dd';
                    }
                });
            }
        });

        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellLength = cell.value ? cell.value.toString().length : 0;
                if (cellLength > maxLength) maxLength = cellLength;
            });
            column.width = Math.max(column.width || 0, maxLength + 2);
        });

        const dir = "./downloads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, "leave.xlsx");
        await workbook.xlsx.writeFile(filePath);

        res.download(filePath, "leave.xlsx", (err) => {
            if (err) console.error("Download Error:", err);
            try { fs.unlinkSync(filePath); } 
            catch (err) { console.error("File Deletion Error:", err); }
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to generate Excel file" });
    }
});


//Above upload . 
app.post("/upload-excel-for-leave", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const filePath = req.file.path;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        
        const worksheet = workbook.worksheets[0];
        const values = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) {
                const dateCell = row.getCell(1).value;
                const leaveTypeCell = row.getCell(2).value;

                const dateValue = (dateCell instanceof Date) 
                    ? dateCell.toISOString().split('T')[0] 
                    : (dateCell?.toString().trim() || null);

                const leaveTypeValue = leaveTypeCell?.toString().trim() || null;

                if (dateValue && leaveTypeValue) {
                    values.push([dateValue, leaveTypeValue]);
                }
            }
        });

        if (values.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "No valid data in the file" });
        }

        const query = `
            INSERT INTO leave (date, leave_type)
            VALUES ?
        `;

        await db.promise().query(query, [values]);

        fs.unlinkSync(filePath);
        res.json({ success: true, message: "Leave data uploaded successfully" });

    } catch (err) {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Database Operation Failed" });
    }
});

// user page get

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

    db.query(query, async (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database Query Failed" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users");

        worksheet.columns = [
            { header: 'Username', key: 'username', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Password', key: 'password', width: 20 },
            { header: 'Joining Date', key: 'joining_date', width: 25 }, 
            { header: 'Bank Details', key: 'bank_details', width: 20 },
            { header: 'PF Number', key: 'pf_number', width: 15 },
            { header: 'ESI Number', key: 'esi_number', width: 15 },
            { header: 'Total Salary', key: 'total_salary', width: 15 }
        ];
        
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
            let bgColor = 'FFADD8E6'; 
            if (colNumber === 1) bgColor = 'FFADD8E6'; 
            if (colNumber === 2) bgColor = 'FFADD8E6';
            if (colNumber === 3) bgColor = 'FFADD8E6'; 
            
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: bgColor }
            };
            cell.font = {
                bold: true
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        results.forEach(row => {
            if (row.joining_date) {
                row.joining_date = new Date(row.joining_date).toLocaleDateString('en-GB'); 
            }
            worksheet.addRow(row);
        });
        
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { 
                const dateCell = row.getCell('joining_date');
                if (dateCell.value) {
                    dateCell.numFmt = 'yyyy-mm-dd';
                }
            }
        });
        const dir = "./downloads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = `${dir}/user_data.xlsx`;
        await workbook.xlsx.writeFile(filePath);
        
        res.download(filePath, "user_data.xlsx", (err) => {
            if (err) console.error("File Download Error:", err);
            fs.unlinkSync(filePath);
        });
    });
});



//Above upload method
app.post("/upload-excel-for-userdata", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const filePath = req.file.path;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        
        const worksheet = workbook.worksheets[0];
        const userValues = [];
        const payslipValues = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) {
                userValues.push([
                    row.getCell(1).value?.toString() || null, 
                    row.getCell(2).value?.toString() || null, 
                    row.getCell(3).value?.toString() || null 
                ]);

                payslipValues.push([
                    row.getCell(2).value?.toString() || null, // email
                    row.getCell(4).value instanceof Date 
                        ? row.getCell(4).value.toISOString().split('T')[0]
                        : (row.getCell(4).value?.toString() || null), // joining_date
                    row.getCell(5).value?.toString() || null, // bank_details
                    row.getCell(6).value?.toString() || null, // pf_number
                    row.getCell(7).value?.toString() || null, // esi_number
                    row.getCell(8).value ? Number(row.getCell(8).value) : null // total_salary
                ]);
            }
        });

        const userQuery = `
            INSERT INTO users (username, email, password)
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
                username = VALUES(username),
                password = VALUES(password)
        `;
        await db.promise().query(userQuery, [userValues]);

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
        await db.promise().query(payslipQuery, [payslipValues]);

        fs.unlinkSync(filePath);
        res.json({ success: true, message: "User and Payslip Data Inserted/Updated Successfully" });

    } catch (err) {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Database Operation Failed" });
    }
});


app.get("/download-excel-for-attendance-data", async (req, res) => {
    const monthNames = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
      ];
      
      const now = new Date();
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      const absentColumn = `absent_days_${month}_${year}`;
      const presentColumn = `present_days_${month}_${year}`;
      
      console.log("Absent Column", absentColumn);
      
    const query = `SELECT emp_name, emp_email, office_name, total_salary, pf_number, esi_number, pf_amount, esi_amount, net_amount,${presentColumn} ,${absentColumn}, revised_salary FROM payslip`;

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Payslip");

        worksheet.columns = [
            { header: 'Employee Name', key: 'emp_name', width: 20 },
            { header: 'Employee Email', key: 'emp_email', width: 25 },
            { header: 'Office Name', key: 'office_name', width: 20 },
            { header: 'Total Salary', key: 'total_salary', width: 15, style: { numFmt: '#,##0.00' } },
            { header: 'PF Number', key: 'pf_number', width: 15 },
            { header: 'ESI Number', key: 'esi_number', width: 15 },
            { header: 'PF Amount', key: 'pf_amount', width: 15, style: { numFmt: '#,##0.00' } },
            { header: 'ESI Amount', key: 'esi_amount', width: 15, style: { numFmt: '#,##0.00' } },
            { header: 'Net Amount', key: 'net_amount', width: 15, style: { numFmt: '#,##0.00' } },
            { header: 'Present Days', key: `${presentColumn}`, width: 15, style: { numFmt: '0' } },
            { header: 'Absent Days', key: `${absentColumn}`, width: 15, style: { numFmt: '0' } },
            { header: 'Revised Salary', key: 'revised_salary', width: 15, style: { numFmt: '#,##0.00' } }
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' } 
            };
            cell.font = { bold: true };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        results.forEach(row => {
            const newRow = worksheet.addRow(row);
            
            [4, 7, 8, 9, 10, 11].forEach(colNumber => {
                const cell = newRow.getCell(colNumber);
                if (cell.value !== null && cell.value !== undefined) {
                    cell.value = Number(cell.value);
                }
            });
        });

        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellLength = cell.value ? cell.value.toString().length : 0;
                if (cellLength > maxLength) maxLength = cellLength;
            });
            column.width = Math.max(column.width || 0, maxLength + 2);
        });

        const dir = "./downloads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = `${dir}/payslip_data.xlsx`;
        await workbook.xlsx.writeFile(filePath);
        
        res.download(filePath, "payslip_data.xlsx", (err) => {
            if (err) console.error("File Download Error:", err);
            try { fs.unlinkSync(filePath); } 
            catch (err) { console.error("File Deletion Error:", err); }
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Failed to generate Excel file" });
    }
});

// upload in attendance page 

app.post("/upload-excel-for-attendancedata", upload.single("file"), async(req, res) => {
    const monthNames = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
    ];

    const now = new Date();
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const absentColumn = `absent_days_${month}_${year}`;
    const presentColumn = `present_days_${month}_${year}`;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const filePath = req.file.path;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.worksheets[0];
        const values = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) { 
                values.push([
                    row.getCell(1).value?.toString() || null, 
                    row.getCell(2).value?.toString() || null, 
                    row.getCell(3).value?.toString() || null, 
                    row.getCell(4).value ? Number(row.getCell(4).value) : null, 
                    row.getCell(5).value?.toString() || null, 
                    row.getCell(6).value?.toString() || null, 
                    row.getCell(7).value ? Number(row.getCell(7).value) : null, // 
                    row.getCell(8).value ? Number(row.getCell(8).value) : null, // 
                    row.getCell(9).value ? Number(row.getCell(9).value) : null, // 
                    row.getCell(10).value ? Number(row.getCell(10).value) : null, // 
                    row.getCell(11).value ? Number(row.getCell(11).value) : null, 
                    row.getCell(12).value ? Number(row.getCell(12).value) : null,
                ]);
            }
        });

        if (values.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "No valid data in the file" });
        }

        const query = `
            INSERT INTO payslip (
                emp_name, emp_email, office_name, total_salary, pf_number,
                esi_number, pf_amount, esi_amount, net_amount, ${presentColumn}, ${absentColumn}, revised_salary
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
                ${presentColumn} = VALUES(${presentColumn}),
                ${absentColumn} = VALUES(${absentColumn}),
                revised_salary = VALUES(revised_salary)`;
            console.log("ffffffffffffff", values);
            
        const [result] = await db1.query(query, [values]);
        console.log("Rows affected from Excel:", result.affectedRows);

        fs.unlinkSync(filePath);
      return  res.json({ success: true, message: "Data Inserted/Updated Successfully" });
    
    } catch (err) {
        // if (req.file?.path) fs.unlinkSync(req.file.path);
        console.log("Erroreeeeeeeeeeeeeeeeeeeee11:", err);
        res.status(500).json({ error: "Database Operation Failed" });
    }
});
 
 
module.exports = app;
