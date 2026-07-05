const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "kedarnathkumar@24256",
  database: "employee_management",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = db;
