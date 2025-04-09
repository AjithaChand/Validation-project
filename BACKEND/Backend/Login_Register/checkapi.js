const express = require('express');
const verifyToken = require('../Login_Register/auth');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors())
app.get('/check', verifyToken, (req, res) => {
    
  res.json({ message: `Hello ${req.user.email} you have access` });
});

module.exports = app;
