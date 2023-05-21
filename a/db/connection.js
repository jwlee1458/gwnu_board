require('dotenv').config();

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    multipleStatements: true
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('DB 연결');
});

module.exports = connection;