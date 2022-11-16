const mysql = require('mysql2');


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    port: 3306,
    database:"firstdb"
  })
  

  module.exports=con;