const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// DB Connection 
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Aji@1020",
    database: "task",
});

db.connect(err => {
    if (err) {
        console.log("Db connection failed");
    } else {
        console.log("Db connected successfully");
    }
});

const SECRET_KEY = "its_wonderful_day";

// DEFAULT ADMIN SETUP
const defaultAdmin = {
    username: "Admin",
    email: "ajithachandran1020@gmail.com",
    password: "Aji@2810",
    role: "admin"
};

const setupAdmin = async () => {
    db.query("SELECT * FROM users WHERE role='admin'", async (err, result) => {
        if (result.length === 0) {
            const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
            db.query(
                "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
                [defaultAdmin.username, defaultAdmin.email, hashedPassword, defaultAdmin.role],
                (err, res) => {
                    if (err) console.log(err);
                    else console.log("Admin created successfully");
                }
            );
        }
    });
};
setupAdmin();

// Registration 
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) {
            return res.status(400).json({ error: "Database error" });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Proceed with validation and registration
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')";
        const values = [username, email, hashedPassword];

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(400).json({ error: "Error inserting into the database" });
            }
            return res.status(200).json({ message: "User Registered successfully" });
        });
    });
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "10h" });

        if (user.role === "admin") {
            return res.status(200).json({ message: "Admin Login Successful", token, role: "admin" });
        } else {
            return res.status(200).json({ message: "Login Successful", token, role: "user" });
        }
    });
});

// Port

// app.listen(8000, () => {
//     console.log("Listening on port 8000");
// });


module.exports = app;