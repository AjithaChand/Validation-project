require('dotenv').config()

const express = require("express");
const cors = require("cors");

const excelServer = require("./Admin_apis/excel_server");
const emailReminder = require("./Admin_apis/email_reminder");
const admin_dashboard = require("./Admin_apis/Admin_Dashborad/admin_dashboard_api");
const admin_users = require("./Admin_apis/Admin_user/Admin_user_api");
const login = require("./Login_Register/login");
const register = require("./Login_Register/register");
const userpage = require("./User_Pages/user_dashboard_apis");

const { verifyToken, isAdmin, isUser } = require("../Backend/Login_Register/auth")

const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", login);
app.use("/", register);


app.use("/", verifyToken, isAdmin, admin_dashboard);
app.use("/", verifyToken, isAdmin, admin_users);
app.use("/",verifyToken,isAdmin,excelServer);
app.use("/",verifyToken,isAdmin,emailReminder);
app.use("/",verifyToken,isUser,userpage);

const port = process.env.PORT || 7009;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
