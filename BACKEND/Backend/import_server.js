require('dotenv').config()

const express = require("express");
const cors = require("cors");
const path =require("path")

const excelServer = require("./Admin_apis/excel_server");
const emailReminder = require("./Admin_apis/email_reminder");
const admin_dashboard = require("./Admin_apis/Admin_Dashborad/admin_dashboard_api");
const admin_users = require("./Admin_apis/Admin_user/Admin_user_api");
const login = require("./Login_Register/login");
const register = require("./Login_Register/register");
const userpage = require("./User_Pages/user_dashboard_apis");
const admin_payslip= require("../Backend/Admin_apis/Admin_payslip/admin_payslip");
const user_payslip= require("../Backend/User_Pages/user_payslip");

//this code for checking admin registration
const admin_register = require('./Admin_apis/Admin_user/Admin_Register_api')

const checkApi = require('./Login_Register/checkapi')


//this code for admin attendance page
const admin_attendance = require("./Admin_apis/Admin_Attendance/admin_attendance")


const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", login);
app.use("/", register);

app.use("/",checkApi)
app.use("/", admin_dashboard);
app.use("/",  admin_users);
app.use("/",excelServer);
app.use("/",emailReminder);
app.use("/",userpage);
app.use("/",admin_payslip)
app.use("/",user_payslip);
app.use("/",admin_attendance)


//new file for checking admin registration

app.use("/",admin_register)



const image = path.join(__dirname,'uploads')
console.log(image,"gfgbhjiuygvbhygv bnjuhgv ")
app.use('/imageuser',express.static(image))

const port = process.env.PORT || 7009;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
