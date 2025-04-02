
require('dotenv').config()


const express = require("express");
const excelServer = require("./excel_server");
const emailReminder = require("./email_reminder");
const server = require("./server");

const db = require('./db')
const app = express();


app.use("/", excelServer);

app.use("/", emailReminder);

app.use("/", server);

const port = process.env.PORT||7009

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




