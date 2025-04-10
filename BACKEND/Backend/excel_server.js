const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());


const db = require('./db')



// app.get("/download-excel", (req, res) => {
//     const query = "SELECT email, startdate, enddate, policy, subject, content FROM customer_details";

const generateExcel =(query, params, res) => {


    console.log("This the number", params);
    
    db.query(query, params, (err, results) => {
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
};

app.get("/download-excel", (req, res) => {
    const query = "SELECT id, email, startdate, enddate, policy, subject, content FROM customer_details";
    generateExcel(query, [], res); 
});

app.get("/download-excel-for-user/:id", (req, res) => {
    const userId = req.params.id;
    const query = "SELECT email, startdate, enddate, policy, subject, content FROM customer_details WHERE id = ?";
    generateExcel(query, [userId], res);
});



//Upload the excel sheet

const processExcelUpload = (filePath, res, userId = null) => {
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

    const query = userId
        ? `
            INSERT INTO customer_details (email, startdate, enddate, policy)
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
            startdate = VALUES(startdate), 
            enddate = VALUES(enddate), 
            policy = VALUES(policy)
            WHERE id = ?`
        : `
            INSERT INTO customer_details (email, startdate, enddate, policy)
            VALUES ? 
            ON DUPLICATE KEY UPDATE 
            startdate = VALUES(startdate), 
            enddate = VALUES(enddate), 
            policy = VALUES(policy)`;

    db.query(query, [values, userId], (err) => {
        fs.unlinkSync(filePath); 
        if (err) {
            console.error("Database Insert/Update Error:", err);
            return res.status(500).json({ error: "Database Operation Failed" });
        }
        res.json({ success: true, message: "Data Inserted/Updated Successfully" });
    });
};

const upload = multer({ dest: "uploads/" });

app.post("/upload-excel", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;  
    processExcelUpload(filePath, res);  
});

app.post("/upload-excel-for-user/:id", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;  
    const userId = req.params.id;  
    processExcelUpload(filePath, res, userId);  
});




module.exports = app;
