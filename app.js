require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const http = require('http');
const path = require('path');
const ejs = require('ejs');
const connection = require('./db/connection');

const HTTP_PORT = 8080;

const boardRouter = require('./routes/boardRouter');

const hbs = require('hbs');
hbs.registerHelper('ifEqual', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.none());

let options = {
    extensions: ['hbs'],
}

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
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
