const boardModel = require('../models/boardModel');

// main_board
function getMainBoard(req, res) {
  boardModel.getMainBoard((err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).send('서버 오류');
    }
    res.render('boards/main_board', { posts: results });
  });
}

// write
function getWriteForm(req, res) {
  res.render('boards/write');
}

function createPost(req, res) {
  const { title, board, article_pw, content, file } = req.body;
  const currentDate = new Date().toISOString().split('T')[0]; // 현재 날짜
  const email = 'test@test.com'; // 임시 사용자 이메일 설정
  boardModel.createPost(title, content, email, board, article_pw, currentDate, file, (err, result) => {
    if (err) {
      console.error('DB 삽입 오류:', err);
      res.status(500).send('DB 삽입 오류');
    } else {
      console.log('DB 삽입 성공');
      const popupMessage = '게시물이 성공적으로 작성되었습니다!';
      res.send(`
        <script>
          alert("${popupMessage}");
          window.location.href = "/main_board";
        </script>
      `);
    }
  });
}

// read
function getReadPost(req, res) {
  const postId = req.query.idx;
  boardModel.getPostById(postId, (err, results) => {
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
    res.render('boards/read', { idx: postId, post: row, email: email, title: title, content: content, date: formattedDate, file: file });
  });
}

// modify
function getModifyForm(req, res) {
  const postId = req.query.idx;
  boardModel.getPostById(postId, (err, results) => {
    if (err) {
      console.error('DB 조회 오류:', err);
      res.status(500).send('DB 조회 오류');
    } else {
      if (results.length > 0) {
        const post = results[0];
        res.render('boards/modify', { post: post });
      } else {
        res.status(404).send('게시물을 찾을 수 없습니다.');
      }
    }
  });
}

function updatePost(req, res) {
  const postId = req.query.idx;
  const { title, board, article_pw, content, file } = req.body;
  const values = [title, board, article_pw, content, file, postId];
  boardModel.updatePost(values, (err, result) => {
    if (err) {
      console.error('DB 수정 오류:', err);
      res.status(500).send('DB 수정 오류');
    } else {
      console.log('DB 수정 성공');
      const popupMessage = '게시물이 성공적으로 수정되었습니다!';
      res.send(`
        <script>
          alert("${popupMessage}");
          window.location.href = "/main_board";
        </script>
      `);
    }
  });
}

// delete
function deletePost(req, res) {
  const postId = req.query.idx;
  boardModel.deletePost(postId, (err, result) => {
    if (err) {
      console.error('DB 삭제 오류:', err);
      res.status(500).send('DB 삭제 오류');
    } else {
      console.log('DB 삭제 성공');
      const popupMessage = '게시물이 성공적으로 삭제되었습니다!';
      res.send(`
        <script>
          alert("${popupMessage}");
          window.location.href = "/main_board";
        </script>
      `);
    }
  });
}

// search_result
function getSearchResult(req, res) {
  const search = req.query.search;
  const category = req.query.category;
  res.render('boards/search_result', { search: search, category: category });
}

function searchPosts(req, res) {
  const { search, category } = req.body;
  boardModel.searchPosts(category, search, (err, results) => {
    if (err) {
      console.error('DB 조회 오류:', err);
      return res.status(500).send('DB 조회 오류');
    }

    res.render('boards/search_result', { posts: results, search: search, category: category });
  });
}

module.exports = {
  getMainBoard,
  getWriteForm,
  createPost,
  getReadPost,
  getModifyForm,
  updatePost,
  deletePost,
  getSearchResult,
  searchPosts
};
