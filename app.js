require('dotenv').config();

const express = require('express');
const app = express();
const router = express.Router();
const http = require('http');
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');

const HTTP_PORT = 8080;

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
  port : process.env.DB_PORT
});

connection.connect(function(err) {
    if(err) throw err;
    console.log('DB 연결');
});

let options = {
    extensions: ['ejs'],
  }
  
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/static', express.static('static'));

app.get('/', function(req, res) {
  res.render('index');
});

// HTTP
http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP 서버가 ${HTTP_PORT} 포트에서 실행 중입니다.`);
});

app.use('/', router);
