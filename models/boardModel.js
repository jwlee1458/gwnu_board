const connection = require('../db/connection');

// main_board
function getMainBoard(callback) {
  connection.query("SELECT *, DATE_FORMAT(date, '%Y-%m-%d') AS formattedDate FROM article WHERE board = 'main' ORDER BY idx DESC", callback);
}

// write
function createPost(title, content, email, board, article_pw, date, file, callback) {
  const query = `INSERT INTO article (board, title, content, article_pw, date, email) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(query, [board, title, content, article_pw, date, email], callback);
}

// read
function getPostById(postId, callback) {
  const query = "SELECT * FROM article WHERE idx = ?";
  connection.query(query, [postId], callback);
}

// modify
function updatePost(values, callback) {
  const query = 'UPDATE article SET title = ?, board = ?, article_pw = ?, content = ?, file = ? WHERE idx = ?';
  connection.query(query, values, callback);
}

// delete
function deletePost(postId, callback) {
  const query = 'DELETE FROM article WHERE idx = ?';
  connection.query(query, [postId], callback);
}

// search_result
function searchPosts(category, search, callback) {
  let query = "SELECT idx, title, email, DATE_FORMAT(date, '%Y-%m-%d') AS formattedDate, hit, article_pw, likes FROM article";
  const conditions = [];

  if (category === 'all') {
    // 모든 카테고리에서 검색
    conditions.push(`title LIKE '%${search}%' OR content LIKE '%${search}%'`);
  } else if (category === 'Title') {
    // 제목에서 검색
    conditions.push(`title LIKE '%${search}%'`);
  } else if (category === 'Content') {
    // 내용에서 검색
    conditions.push(`content LIKE '%${search}%'`);
  } else {
    return callback(new Error('Invalid input.'), null); // 유효하지 않은 입력일 경우
  }

  if (conditions.length > 0) {
    const whereClause = conditions.join(' OR ');
    query += ` WHERE ${whereClause}`;
  }

  connection.query(query, callback);
}

module.exports = {
  getMainBoard,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
};
