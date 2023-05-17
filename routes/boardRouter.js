const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('../db/connection');

router.use(bodyParser.urlencoded({ extended: true }));

const posts = [];

// main_board
router.get('/', function(req, res) {
    connection.query("SELECT *, DATE_FORMAT(date, '%Y-%m-%d') AS formattedDate FROM article WHERE board = 'main' ORDER BY idx DESC", function(err, results) {
      if (err) {
        console.error('쿼리 오류:', err);
        return res.status(500).send('서버 오류');
      }
      results.forEach(post => {
        const formattedDate = post.formattedDate;
      });
      res.render('boards/main_board', { posts: results });
    });
  });

// write
router.get('/write', (req, res) => {
    res.render('boards/write', { posts: posts });
});

// secret_board
router.get('/secret_board', (req, res) => {
    const secretPosts = [];
    res.render('boards/secret_board', { secretPosts });
});

// test_board
router.get('/test_board', (req, res) => {
    const testPosts = [];
    res.render('boards/test_board', { testPosts });
});

// read
router.get('/read', (req, res) => {
  const idx = req.query.idx;
  const query = "SELECT * FROM article WHERE idx = ?";
  connection.query(query, [idx], (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).send('서버 오류');
    }

    if (results.length === 0) {
      return res.status(404).send('게시물을 찾을 수 없습니다');
    }

    const row = results[0];
    const email = row.email;
    const title = row.title;
    const content = row.content;
    const file = row.file;
    const date = new Date(row.date);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formattedDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    res.render('boards/read', { row: row, email: email, title: title, content: content, date: formattedDate, file: file });
  });
});

// modify
router.get('/modify', (req, res) => {
    res.render('boards/modify', {posts: posts});
});

// delete
router.get('/delete', (req, res) => {
    res.render('boards/delete', {posts: posts});
});

// search_result
router.get('/search_result', (req, res) => {
  res.render('boards/search_result', { posts: [] });
});

router.post('/search_result', (req, res) => {
  const category = req.body.category;
  const search = req.body.search;
  let query = "SELECT idx, title, email, DATE_FORMAT(date, '%Y-%m-%d') AS formattedDate, hit, likes FROM article";
  const conditions = [];

  if (category === 'all') {
    // 모든 카테고리에서 검색
    conditions.push(`title LIKE '%${search}%' OR content LIKE '%${search}%'`);
  } else if (category === 'main' || category === 'secret' || category === 'test') {
    // 특정 카테고리에서 검색
    conditions.push(`board = '${category}' AND (title LIKE '%${search}%' OR content LIKE '%${search}%')`);
  } else if (category === 'Title') {
    // 제목에서 검색
    conditions.push(`title LIKE '%${search}%'`);
  } else if (category === 'Content') {
    // 내용에서 검색
    conditions.push(`content LIKE '%${search}%'`);
  } else {
    return res.status(400).send('Invalid input.'); // 유효하지 않은 입력일 경우
  }

  // 쿼리 조건이 존재할 경우 WHERE 절 추가
  if (conditions.length > 0) {
    const whereClause = conditions.join(' OR ');
    query += ` WHERE ${whereClause}`;
  }

  // 쿼리 실행 및 결과 가져오기
  connection.query(query, function(err, results) {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).send('서버 오류');
    }
    res.render('boards/search_result', { results: results });
  });
});

module.exports = router;