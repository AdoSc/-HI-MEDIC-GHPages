const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Conectado a la base de datos MySQL");
});

module.exports = connection;
