const mysql = require("mysql");
const config = require("config");

const db = mysql.createConnection({
  host: config.get("dbHost"),
  user: config.get("dbUser"),
  password: config.get("dbPassword"),
  database: config.get('dbDatabase')
});

module.exports = db;
