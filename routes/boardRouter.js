const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../db/connection');

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
    res.render('boards/read', {posts: posts});
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
    res.render('boards/search_result', {posts: posts});
});

module.exports = router;
