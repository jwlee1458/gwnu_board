const express = require('express');
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
// function getReadPost(req, res) {
//   const postId = req.query.idx;
//   boardModel.getPostById(postId, (err, results) => {
//     if (err) {
//       console.error('쿼리 오류:', err);
//       return res.status(500).send('서버 오류');
//     }

//     if (results.length === 0) {
//       return res.status(404).send('게시물을 찾을 수 없습니다');
//     }

//     const row = results[0];
//     const email = row.email;
//     const title = row.title;
//     const content = row.content;
//     const file = row.file;
//     const date = new Date(row.date);
//     const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//     const formattedDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
//     //res.render('boards/read', { idx: postId, post: row, email: email, title: title, content: content, date: formattedDate, file: file });
//   });
  
// };

// comment
function addComment(req, res) {
  const postId = req.body.idx;
  const comment = req.body.comment;
  const email = 'test@test.com';
  const currentDate = new Date().toISOString().split('T')[0];
  boardModel.addComment(comment, postId, email, currentDate, (err, results) => {
    if (err) {
      console.error('DB 삽입 오류:', err);
      res.status(500).send('DB 삽입 오류');
    } else {
      console.log('DB 삽입 성공');
      const popupMessage = '댓글이 성공적으로 작성되었습니다!';
      res.send(`
        <script>
          alert("${popupMessage}");
          window.location.href = "/main_board";
        </script>
      `);
    }
  });
}

// function readComment(req, res) {
//   const postId = req.query.idx;
//   boardModel.readComment(postId, (err, results) => {
//     if (err) {
//       console.error('쿼리 오류:', err);
//       return res.status(500).send('서버 오류');
//     }

//     // const row = results[0];
//     // const comment = row.comment;
//     // const email = row.email;
//     // const date = new Date(row.date);

//     const comment_row = results[0];
//     const comment = comment_row.comment;
//     const comment_email = comment_row.email;
//     const comment_date = new Date(comment_row.date);
//     console.log(comment_row, comment, comment_email, comment_date);
//     //res.render('boards/read', { idx: postId, postcomment: comment_row, comment : comment, comment_email: email, comment_date: date });
// })
// }

// read 페이지 불러오기
function readForm(req, res) {
  const postId = req.query.idx;
  boardModel.readForm(postId, (err, results) => {
    if (err) {
      console.error('쿼리 오류:', err);
      return res.status(500).send('서버 오류');
    }
    if (results.length === 0) {
      return res.status(404).send('게시물을 찾을 수 없습니다');
    }
    // post(게시글) data
    const postResults = results.map(row => {
      const email = row.email;
      const title = row.title;
      const content = row.content;
      const file = row.file;
      const date = new Date(row.date);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const formattedDate = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

      return {
        idx: postId,
        email: email,
        title: title,
        content: content,
        date: formattedDate,
        file: file
      }
    });
    // comment(댓글) data
    const commentResults = results.map(row => {
      const comment = row.comment;
      const comment_email = row.comment_email;
      const comment_date = new Date(row.comment_date);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const formattedCommentDate = monthNames[comment_date.getMonth()] + " " + comment_date.getDate() + ", " + comment_date.getFullYear();

      return {
        comment: comment,
        comment_email: comment_email,
        comment_date: formattedCommentDate
      }
   });

    res.render('boards/read', { post: postResults, comment : commentResults});
  })
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
  // getReadPost,
  addComment,
  // readComment,
  readForm,
  getModifyForm,
  updatePost,
  deletePost,
  getSearchResult,
  searchPosts
};
