
require('dotenv').config()


const express = require("express");
const excelServer = require("./Admin_apis/excel_server");
const emailReminder = require("./Admin_apis/email_reminder");
const admin_dashboard = require("./Admin_apis/Admin_Dashborad/admin_dashboard_api");
const admin_users= require("./Admin_apis/Admin_user/Admin_user_api");
const login = require("./Login_&_Register/login")
const register = require("./Login_&_Register/register")
const userpage = require("./User_Pages/user_dashboard_apis")

// const server = require("./import_server");

const db = require('./db')
const app = express();


app.use("/", excelServer);

app.use("/", emailReminder);

// app.use("/", server);

app.use("/",admin_dashboard)

app.use("/",admin_users);

app.use("/",login)

app.use("/", register)

app.use("/", userpage)

const port = process.env.PORT||7009

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




