const express = require("express");
const excelServer = require("./excel_server");
const emailReminder = require("./email_remainder");
const server = require("./server");

const app = express();
const PORT = 8000;

app.use("/excel", excelServer);

app.use("/email", emailReminder);

app.use("/auth", server);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
