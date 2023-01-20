const mysql = require('mysql');


const con = mysql.createConnection({
    host: "database-1.ccmdzhfdnifr.ap-south-1.rds.amazonaws.com",
    user: "admin",
    password: "cloud9db",
    port: 3306,
    database:"firstdb"
  })
  

  module.exports=con;