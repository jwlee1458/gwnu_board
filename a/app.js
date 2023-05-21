require('dotenv').config();

const express = require('express');
const app = express();
const router = express.Router();
const http = require('http');
const path = require('path');
const ejs = require('ejs');
const connection = require('./db/connection');

const HTTP_PORT = 18080;

const boardRouter = require('./routes/boardRouter');

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

app.use('/main_board', boardRouter);

// HTTP
http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP 서버가 ${HTTP_PORT} 포트에서 실행 중입니다.`);
});