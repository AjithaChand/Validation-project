const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const db = {
    host: 'localhost',
    user: 'root',
    password: 'Aji@1020',
    database: 'task',      
};

const conn = mysql.createConnection(db);

conn.connect((err) => {
    if (err) {
        console.log("Mysql connection failed");
        return;
    } 
    console.log("MySql Connection success");  
});

app.get("/download-excel", (req, res) => {
    const query = "SELECT email, startdate, enddate, policy FROM customer_details";

    conn.query(query, (err, results) => {
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

    conn.query(query, [values], (err) => {
        fs.unlinkSync(filePath); 
        if (err) {
            console.error("Database Insert/Update Error:", err);
            return res.status(500).json({ error: "Database Operation Failed" });
        }
        res.json({ success: true, message: "Data Inserted/Updated Successfully" });
    });
});

<<<<<<< HEAD
module.exports=app
// app.listen(8000, () => {
//     console.log("Server running on port 3001");
// });
=======
<<<<<<< HEAD
// app.listen(8000, () => {
//     console.log("Server running on port 3001");
// });


module.exports = app;
=======
app.listen(8000, () => {
    console.log("Server running on port 3001");
});
>>>>>>> e0d0be3006ae95e850145dcfc72c5d35a3d2a788
>>>>>>> defcd722ab01b93c63ec4d46af621b6de1dd9d70
