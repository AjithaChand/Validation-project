const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const ExcelJS = require('exceljs'); 
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const db = require('../db');

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
            { header: 'Start Date', key: 'startdate', width: 15 },
            { header: 'End Date', key: 'enddate', width: 15 },
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
            if (colNumber === 1) bgColor = 'FFFFA07A'; 
            if (colNumber === 2) bgColor = 'FF98FB98';
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

app.get("/download-excel-for-attendance-data", async (req, res) => {
    const query = "SELECT emp_name, emp_email, office_name, total_salary, pf_number, esi_number, pf_amount, esi_amount, net_amount, leave_days, revised_salary FROM payslip";

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
            { header: 'Leave Days', key: 'leave_days', width: 15, style: { numFmt: '0' } },
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

//Upload the excel sheet in dashboard page

const upload = multer({ dest: "uploads/" });

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
            if (rowNumber > 1) { // Skip header row
                values.push([
                    row.getCell(1).value?.toString() || null,
                    row.getCell(2).value instanceof Date ? 
                        row.getCell(2).value.toISOString().split('T')[0] : 
                        (row.getCell(2).value?.toString() || null), 
                    row.getCell(3).value instanceof Date ? 
                        row.getCell(3).value.toISOString().split('T')[0] : 
                        (row.getCell(3).value?.toString() || null), 
                    row.getCell(4).value?.toString() || null 
                ]);
            }
        });

        if (values.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: "No valid data in the file" });
        }

        const query = `
            INSERT INTO customer_details (email, startdate, enddate, policy)
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
            startdate = VALUES(startdate), 
            enddate = VALUES(enddate), 
            policy = VALUES(policy)`;

        await db.query(query, [values]);
        fs.unlinkSync(filePath);
        res.json({ success: true, message: "Data Inserted/Updated Successfully" });

    } catch (err) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        console.error("Error:", err);
        res.status(500).json({ error: "Database Operation Failed" });
    }
});  

//Upload the excel sheet in user page
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
                    row.getCell(2).value?.toString() || null, 
                    row.getCell(4).value instanceof Date ? 
                        row.getCell(4).value.toISOString().split('T')[0] : 
                        (row.getCell(4).value?.toString() || null), 
                    row.getCell(5).value?.toString() || null, 
                    row.getCell(6).value?.toString() || null, 
                    row.getCell(7).value?.toString() || null, 
                    row.getCell(8).value ? Number(row.getCell(8).value) : null 
                ]);
            }
        });

        // Insert user data
        const userQuery = `
            INSERT INTO users (username, email, password)
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
                username = VALUES(username),
                email = VALUES(email), 
                password = VALUES(password)`;
        
        await db.query(userQuery, [userValues]);

        // Insert payslip data
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
                total_salary = VALUES(total_salary)`;
        
        await db.query(payslipQuery, [payslipValues]);

        fs.unlinkSync(filePath);
        res.json({ 
            success: true, 
            message: "User and Payslip Data Inserted/Updated Successfully" 
        });

    } catch (err) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        console.error("Error:", err);
        res.status(500).json({ error: "Database Operation Failed" });
    }
});


// upload in attendance page 

app.post("/upload-excel-for-attendancedata", upload.single("file"), async (req, res) => {
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
            if (rowNumber > 1) { // Skip header row
                values.push([
                    row.getCell(1).value?.toString() || null,
                    row.getCell(2).value?.toString() || null, 
                    row.getCell(3).value?.toString() || null, 
                    row.getCell(4).value ? Number(row.getCell(4).value) : null,
                    row.getCell(5).value?.toString() || null, 
                    row.getCell(6).value?.toString() || null, 
                    row.getCell(7).value ? Number(row.getCell(7).value) : null, 
                    row.getCell(8).value ? Number(row.getCell(8).value) : null, 
                    row.getCell(9).value ? Number(row.getCell(9).value) : null, 
                    row.getCell(10).value ? Number(row.getCell(10).value) : null, 
                    row.getCell(11).value ? Number(row.getCell(11).value) : null
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
                revised_salary = VALUES(revised_salary)`;

        const result = await db.query(query, [values]);
        console.log("Rows affected from Excel:", result.affectedRows);
        
        fs.unlinkSync(filePath);
        res.json({ success: true, message: "Data Inserted/Updated Successfully" });

    } catch (err) {
        if (req.file?.path) fs.unlinkSync(req.file.path);
        console.error("Error:", err);
        res.status(500).json({ error: "Database Operation Failed" });
    }
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
