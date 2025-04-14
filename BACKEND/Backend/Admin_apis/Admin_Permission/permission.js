
const express = require('express')

const cors = require('cors')

const mysql = require('mysql2')

const {verifyToken,verifyAdmin} = require('../../Login_Register/auth')

const db = require('../../db')


const app = express();

app.use(cors())

app.use(express.json)


