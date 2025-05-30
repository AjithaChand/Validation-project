const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path")
const fs = require("fs")

// const verifyToken=require('../../Login_Register/auth')

const { verifyToken } = require('../../Login_Register/auth')

const app = express();
app.use(cors());
app.use(express.json());

const db = require('../../db');

//Admin registraion from admin page

app.post("/admin/register", verifyToken, (req, res) => {
    console.log(req.body, "checking");
    const {
        username,
        email,
        password,
        role,
        total_salary,
        pf_number,
        esi_amount,
        esi_number,
        pf_amount,
        gross_salary,
        net_amount,
        permissions,
        date,
        joining_date,
        revised_salary,
        bank_details,
        address,
        phone_number,
        payload,
    } = req.body;

    console.log("Payload received", payload);
    console.log("User table received",username, email, password, role );
    console.log("PAyslipppp table received", username,
        email,
        total_salary,
        pf_number,
        esi_amount,
        esi_number,
        pf_amount,
        gross_salary,
        net_amount,
        date,
        joining_date,
        revised_salary,
        bank_details,
        address,
        phone_number, );
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (!permissions || typeof permissions !== 'object') {
        return res.status(400).json({ error: "Permissions are required and must be an object" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
        const values = [username, email, password, role];

        db.query(sql, values, (err, result) => {

            if (err) {

                console.log("Error is user insert table", err)
                return res.status(400).json({ error: "Cannot register user" })
            };

            const getCodeQuery = "SELECT person_code FROM users WHERE email = ?";
          
            db.query(getCodeQuery, [email], (err, codeResult) => {
              
                if (err || codeResult.length === 0) {

                    console.log("Error is user table to get person_code", err)

                    return res.status(500).json({ error: "Failed to fetch person details" });
                }

                const person_code = codeResult[0].person_code;


                const permissionRows = [];

                for (const [page, perm] of Object.entries(permissions)) {
                    permissionRows.push([
                        person_code,
                        page,
                        perm.read ? 1 : 0,
                        perm.create ? 1 : 0,
                        perm.update ? 1 : 0,
                        perm.delete ? 1 : 0
                    ]);
                }

                const permQuery = "INSERT INTO permissions (person_code, page_name, can_read, can_create, can_update, can_delete) VALUES ?";
                db.query(permQuery, [permissionRows], (err, permResult) => {
                  
                    if (err) {
                        console.log("Permission insert error:", err);
                        return res.status(500).json({ error: "Can't add permissions" });
                    }

                    const query = "SELECT * FROM payslip WHERE emp_email = ?";
                    db.query(query, [email], (err, info) => {
                        if (err) {
                            console.log("Error is payslip table to get all", err)
                            return res.status(500).send({ message: "Database Error" });
                        }

                        if (info.length > 0) {
                            console.log("Salary already uploaded");
                            return res.status(409).send({ message: "Salary already uploaded" });
                        }

                        const insertQuery = "INSERT INTO branches (branch_name, station_name, latitude, longitude) VALUES (?, ?, ?, ?)";
                        db.query(insertQuery, [payload.branch, payload.station, payload.latitude, payload.longitude], (err, data) => {
                            if (err) {
                                console.log("Error is branches table to insert", err)

                                return res.status(400).send({ message: "Database Error" });
                            }

                            const branch_id = data.insertId;

                            const new_total_salary = Number(parseFloat(total_salary).toFixed(2));
                            const new_esi_amount = Number(parseFloat(esi_amount).toFixed(2));
                            const new_pf_amount = Number(parseFloat(pf_amount).toFixed(2));
                            const new_gross_salary = Number(parseFloat(gross_salary).toFixed(2));
                            const new_net_amount = Number(parseFloat(net_amount).toFixed(2));

                            const values = [
                                username,
                                email,
                                new_total_salary,
                                pf_number,
                                new_esi_amount,
                                esi_number,
                                new_pf_amount,
                                new_gross_salary,
                                new_net_amount,
                                date,
                                joining_date,
                                revised_salary,
                                bank_details,
                                address,
                                phone_number,
                                branch_id,
                            ];

                            const insertPayslip = `
                                INSERT INTO payslip 
                                (emp_name, emp_email, total_salary, pf_number, esi_amount, esi_number, pf_amount, gross_salary, net_amount, dates, joining_date, revised_salary, bank_details, address, phone_number, branch_id)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `;

                            db.query(insertPayslip, values, (err, result) => {
                                if (err) {
                                    console.log(`Payslip insert failed for ${email}:`, err);
                                    return res.status(500).send({ message: "Salary Add Failed! Try Again." });
                                }

                                const msg = role === "admin" ? "Admin Registered Successfully" : "User Registered with Permissions";
                                return res.status(200).json({ message: msg });
                            });
                        });
                    });
                });
            });
        });
    });
});



/// Get all users


app.get('/getuser', verifyToken, (req, res) => {
    const sql = "SELECT u.*, p.*, b.branch_name, b.station_name, b.latitude, b.longitude FROM users u LEFT JOIN payslip p ON u.email = p.emp_email LEFT JOIN branches b ON p.branch_id = b.id";

    db.query(sql, (err, result) => {
        if (err)
            return res.status(500).json({ error: err.message })
        // console.log("JJJJJJJJJJJJJJJ",result);

        return res.json(result)
    })
})



//Edit data for single user

app.get('/getuser/single', verifyToken, (req, res) => {

    const { email } = req.query;

    console.log(email, "For Filled in backend");

    const sql = "SELECT u.*, p.total_salary, p.bank_details, p.pf_number, p.esi_number,p.address, p.phone_number, b.branch_name, b.station_name, b.latitude, b.longitude FROM users u LEFT JOIN payslip p ON u.email = p.emp_email LEFT JOIN branches b ON p.branch_id = b.id WHERE u.email = ?  ";

    db.query(sql, [email], (err, data) => {

        if (err) return res.status(500).json({ error: err.message });

        if (data.length === 0) return res.status(404).json({ error: "User not found" });

        console.log(data,"gfdfgiuygfg");

        return res.json(data[0]);
    });
});



//Edit user

app.put('/edituser/:id', verifyToken, async (req, res) => {

    const id = req.params.id;

    const { username, email, password, total_salary,address, phone_number, esi_amount, pf_amount, gross_salary, net_amount, revised_salary, bank_details, esi_number, pf_number, is_active, branch_name, station_name, latitude, longitude } = req.body;

    console.log(username, email, password, total_salary,address,phone_number, esi_amount, pf_amount, gross_salary, net_amount, revised_salary, bank_details, esi_number, pf_number, is_active,branch_name, station_name, latitude, longitude, id, "In backend");


    const sql = "UPDATE users SET username=?,email =?,password=? , is_active = ? WHERE id=?"

    const values = [username, email, password, is_active, id]

    db.query(sql, values, (err, data) => {

        if (err){ 

            console.log("Error in update users table", err);
               
            return res.status(500).json({ message :"Databse Error" })
        }
        const updateQuery = "UPDATE payslip SET total_salary= ?, esi_amount= ?, pf_amount= ?, gross_salary= ?, net_amount= ?, revised_salary= ?, bank_details= ?, esi_number= ?, pf_number= ?, address=?, phone_number=? WHERE emp_email = (SELECT email FROM users WHERE id = ?)"

        db.query(updateQuery, [total_salary, esi_amount, pf_amount, gross_salary, net_amount, revised_salary, bank_details, esi_number, pf_number,address, phone_number, id], (err, result) => {


            if (err){ 

                console.log("Error in update payslip 1 table", err);
                   
                return res.status(500).json({ message :"Databse Error" })
            }

            const selectQuery = "SELECT branch_id FROM payslip WHERE emp_email = (SELECT email FROM users WHERE id = ?)";

            db.query(selectQuery,[id],(err,branch_id)=>{

                if (err){ 

                    console.log("Error in select payslip for get branch ID table", err);
                       
                    return res.status(500).json({ message :"Databse Error" })
                }

                const branchId = branch_id[0]?.branch_id;

                console.log("Get Branch ID", branch_id);

            const updateQuery = "UPDATE branches SET branch_name = ?, station_name = ?, latitude = ?, longitude = ? WHERE id = ?";

            db.query(updateQuery,[branch_name,station_name,latitude,longitude,branchId],(er,info)=>{

                if (err){ 

                    console.log("Error in update branches table", err);
                       
                    return res.status(500).json({ message :"Databse Error" })
                }
            
            return res.status(200).json({ message: "Changes Submitted successfully" })
        })
    })
})
})
})

app.delete('/delete/:id', verifyToken, (req, res) => {
    const userId = req.params.id;
  
    const getEmailQuery = "SELECT email FROM users WHERE id = ?";
    db.query(getEmailQuery, [userId], (err, result) => {
      if (err) {
        console.error("Error fetching user email:", err);
        return res.status(500).json({ message: "Database error" });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const userEmail = result[0].email;
  
      const selectQuery = "SELECT branch_id FROM payslip WHERE emp_email = ?";
      db.query(selectQuery, [userEmail], (err, info) => {
        if (err) {
          return res.status(500).send({ message: "Error fetching branch ID" });
        }
  
        const branchId = info[0]?.branch_id;
  
        const deletePayslip = "DELETE FROM payslip WHERE emp_email = ?";
        db.query(deletePayslip, [userEmail], (err) => {
          if (err) {
            console.error("Error deleting payslip:", err);
            return res.status(500).json({ message: "Error deleting payslip" });
          }
  
          const deleteUser = "DELETE FROM users WHERE id = ?";
          db.query(deleteUser, [userId], (err) => {
            if (err) {
              console.error("Error deleting user:", err);
              return res.status(500).json({ message: "Error deleting user" });
            }
  
            const deleteBranch = "DELETE FROM branches WHERE id = ?";
            db.query(deleteBranch, [branchId], (err) => {
              if (err) {
                return res.status(500).send({ message: "Error deleting branch" });
              }
  
              res.json({ message: "User, payslip, and branch deleted successfully" });
            });
          });
        });
      });
    });
  });

  
  app.delete('/delete-multiple', verifyToken, (req, res) => {
    const userIds = req.body.userIds;
  
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "No user IDs provided" });
    }
  
    const getEmailsQuery = "SELECT id, email FROM users WHERE id IN (?)";
    db.query(getEmailsQuery, [userIds], (err, userResults) => {
      if (err) {
        console.error("Error fetching emails:", err);
        return res.status(500).json({ message: "Error fetching user emails" });
      }
  
      const emails = userResults.map(user => user.email);
  
      if (emails.length === 0) {
        return res.status(404).json({ message: "No matching users found" });
      }
  
      const getBranchIdsQuery = "SELECT DISTINCT branch_id FROM payslip WHERE emp_email IN (?)";
      db.query(getBranchIdsQuery, [emails], (err, branchResults) => {
        if (err) {
          console.error("Error fetching branch IDs:", err);
          return res.status(500).json({ message: "Error fetching branch IDs" });
        }
  
        const branchIds = branchResults.map(row => row.branch_id);
  
        const deletePayslipsQuery = "DELETE FROM payslip WHERE emp_email IN (?)";
        db.query(deletePayslipsQuery, [emails], (err) => {
          if (err) {
            console.error("Error deleting payslips:", err);
            return res.status(500).json({ message: "Error deleting payslips" });
          }
  
          const deleteUsersQuery = "DELETE FROM users WHERE id IN (?)";
          db.query(deleteUsersQuery, [userIds], (err) => {
            if (err) {
              console.error("Error deleting users:", err);
              return res.status(500).json({ message: "Error deleting users" });
            }
  
            if (branchIds.length > 0) {
              const deleteBranchesQuery = "DELETE FROM branches WHERE id IN (?)";
              db.query(deleteBranchesQuery, [branchIds], (err) => {
                if (err) {
                  return res.status(500).json({ message: "Error deleting branches" });
                }
  
                return res.json({ message: "Users, payslips, and branches deleted successfully" });
              });
            } else {
              return res.json({ message: "Users and payslips deleted successfully" });
            }
          });
        });
      });
    });
  });
  
  
// permission update code

app.get("/get-person_code", (req, res) => {

    const { email } = req.query;

    if (!email) {

        return res.status(400).json({ message: "No user Found" })
    }

    console.log("Emailll", email)

    const emailSql = "SELECT person_code FROM users WHERE email = ? ";

    db.query(emailSql, [email], (err, result) => {

        if (err) {
            return res.status(500).json({ error: "DB error" })
        }

        if (result.length > 0) {

            const person_code = result[0].person_code;


            const getSql = "SELECT * FROM permissions WHERE person_code =?"

            db.query(getSql, [person_code], (err, permissionResult) => {
                if (err) {

                    return res.status(500).json({ error: "Database Error" })
                }
                else {
                    return res.json({
                        person_code,
                        permissions: permissionResult
                    });
                }

            })

        } else {
            return res.status(404).json({ message: "User not found" });
        }

    })
})


//Updating permissions
app.put("/update-permissions", async (req, res) => {
    const { person_code } = req.query;
    const { permissions } = req.body;

    console.log("Permissions received:", permissions);
    console.log("Person code received:", person_code);

    const permissionsRows = [];

    for (const [page, perm] of Object.entries(permissions)) {
        permissionsRows.push([
            person_code,
            page,
            perm.create ? 1 : 0,
            perm.read ? 1 : 0,
            perm.update ? 1 : 0,
            perm.delete ? 1 : 0,
        ]);
    }

    const placeholders = permissionsRows.map(() => `(?, ?, ?, ?, ?, ?)`).join(", ");
    const flatValues = permissionsRows.flat();

    try {   
        const updateSql = `
            INSERT INTO permissions
            (person_code, page_name, can_create, can_read, can_update, can_delete)
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE
                can_create = VALUES(can_create),
                can_read = VALUES(can_read),
                can_update = VALUES(can_update),
                can_delete = VALUES(can_delete)
        `;

        db.query(updateSql, flatValues, (err, updResult) => {
            if (err) {
                console.log("SQL error:", err);
                return res.status(500).json({ error: "Database ERROR" });
            }
            return res.status(200).json({ message: "Permissions Updated Successfully" });
        });

    } catch (err) {
        console.error("Unexpected error in update-permissions:", err);
        return res.status(500).json({ error: "Unexpected Server Error" });
    }
});


module.exports = app;