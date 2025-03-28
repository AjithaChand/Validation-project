const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path =require ("path")
const fs = require("fs")


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
const defaultAdmin =[ {   
    username: "Admin",
    email: "ajithachandran1020@gmail.com",
    password: "Aji@2810",
    role: "admin" 
},
]
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
//Admin registraion from admin page
app.post("/admin/register", (req, res) => {
    const { username, email, password, role } = req.body;
    db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
        if (err)
            return res.status(500).json({ error: err.message })
        if (result.length > 0) {
            return res.status(400).json({ error: "Email already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const sql = "INSERT INTO users (username,email,password,role)VALUES(?,?,?,?)"
        const values = [username, email, hashedPassword, role]
        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(400).json({ error: "Can not register" })
            }
            if(role==="admin")
                return res.status(200).json({ message: "Admin Registered Successfully" })
            else {
                return res.status(200).json({message:"User Registered Successfully"})
            }
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

<<<<<<< HEAD
=======
//Total user 

app.get('/getuser', (req, res) => {
    const values = [req.body.id,req.body.username, req.body.email]
    const sql = "SELECT * FROM users"
    db.query(sql, values, (err, result) => {
        if (err)
            return res.status(500).json({ error: err.message })
        return res.json(result)
    })
})

//Create folder

app.use('/uploads',express.static(path.join(__dirname,'uploads')))


if(!fs.existsSync('uploads')){
    fs.mkdirSync('upload',{recursive:true});
}



//File storage using multer

 const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname));
    }
 }) 
 
 const upload =multer({storage:storage})



//Create tabel for customers
app.post('/create', upload.single('file'), (req, res) => {
    const { email, startdate, enddate, policy } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!filePath) {
        return res.status(400).json({ error: "File is required." });
    }

    const sql = "INSERT INTO customer_details (email, startdate, enddate, policy, file_path) VALUES (?, ?, ?, ?, ?)";
    const values = [email, startdate, enddate, policy, filePath];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Details submitted successfully" });
    });
});


//Get customer details 

app.get('/read', (req, res) => {
    const sql = "SELECT * FROM customer_details"
    const values = [req.body.id,
    req.body.email,
    req.body.startdate,
    req.body.enddate,
    req.body.policy,
    req.body.file]
    db.query(sql,values,(err,data)=>{
        if(err)
            return res.status(500).json({error:err.message})
        return res.status(200).json(data)
    })
});

//updation in details

app.put('/edit:id',(req,res)=>{
    const id=req.params.id
    const values=[req.body.email,req.body.startdate,req.body.enddate,req.body.policy,req.body.file_path]


    const sql="UPDATE customer_details SET email=?,startdate=?,enddate=?,policy=?,file_path=? WHERE id=?"
    db.query(sql,values,[id],(err,data)=>{
        if(err) return res.status(500).json({error:err.message})
        return res.status(200).json({message:"Your details is corrected"})
    })
})


//Delete
app.delete('/delete:id',(req,res)=>{
 
    const id = req.params.id;

    const sql ="DELETE FROM customer_details WHERE id=?"
    
    db.query(sql,[id],(err,data)=>{
        if(err)
            return res.status(500).json({error:err.message})
        return res.status(200).json({message:"Deleted"})
    })
})




>>>>>>> e0d0be3006ae95e850145dcfc72c5d35a3d2a788
// Port

// app.listen(8000, () => {
//     console.log("Listening on port 8000");
// });


module.exports = app;