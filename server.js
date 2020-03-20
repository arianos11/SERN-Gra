const express = require("express");
const db = require("./config/db");
const mysql = require('mysql');

db.connect(err => err ? console.log(err) : console.log("mysql connected"));

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API RUNNING"));

// Define routes
app.use("/api/users", require("./routes/users"));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));