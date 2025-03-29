const express = require("express");
const excelServer = require("./excel_server");
const emailReminder = require("./email_reminder");
const server = require("./server");

const app = express();
const PORT = 8000;

app.use("/", excelServer);

app.use("/", emailReminder);

app.use("/", server);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
