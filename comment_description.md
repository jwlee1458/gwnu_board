
# comment 기능 추가

## 기존 작성 파일 기반으로 한 comment.ver

### model 부분(boardModel.js)
```
// comment
function addComment(comment, postId, email, currentDate, callback) {
  const query = `INSERT INTO comments(comment, post_id, comment_email, comment_date) VALUES (?, ?, ?, ?)`;
  connection.query(query, [comment, postId, email, currentDate], callback);
}
// post(게시글)와 comment(댓글) data 한번에 가져옴
function readForm(postId, callback) {
  const query = `SELECT * FROM article JOIN comments ON article.idx = comments.post_id WHERE article.idx = ? ORDER BY comments.comment_idx DESC`;
  connection.query(query, [postId], (error, results)  => {
    if (error) {
      console.error(error);
      if (callback) {
        callback(error, null);
      }
    } else {
      if (callback) {
        callback(null, results);
      }
    }
  })
}
```

### view 부분(read.hbs)

```
<div class="container">
        <br>
        {{#each post}}
        {{#if @first}}
        <div class="post">
            <div class="post-header">
            <img src="../images/logo.png" alt="Profile Picture">
            <h2>{{title}}</h2>
            </div>
            <p class="blog-post-meta" style="text-align:left;">
            {{date}} by {{email}}
            </p>
            <hr>
            <div class="post-body">
            <p style="text-align:left;">{{content}}{{article_pw}}</p>
            <p style="text-align:right;"><a style="text-align:right;" href="{{file}}" download>Download File</a></p>
            </div>
            <hr>
        {{/if}}
        {{/each}}
        
        // recommend 부분 코드 ...
        
<!-- 댓글 작성 -->
      <form action="/main_board/read?=idx" style="margin:0%; float:left; width:85%; display:inline-block;" method="POST" enctype="multipart/form-data">
        <div class="input-group mb-3">
            <input type="textarea" class="form-control" name="comment" placeholder="Write comment" aria-describedby="basic-addon2">
            {{#each post}}{{#if @first}}
            <input type="hidden" name="idx" value="{{idx}}">
            {{/if}}{{/each}}
            <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="submit">Post</button>
            </div>
        </div>
        </form>
    <div class="post-footer">
    </div>
</div>
```

### controller 부분(boardController.js)

```
// comment 작성
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

// read 페이지 불러오기, 게시글과 댓글 내용을 한번에 render
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
```

### 예시 이미지
![image](https://github.com/00ovo00/test0528/assets/96408296/bfcc8007-3216-4abd-b0d3-a25bcaa9cbdb)

## 익명 comment.ver

위 코드와 동일하나 이메일 없이 익명으로 댓글을 작성하고 이메일 대신 작성자가 user.idx 형태로 출력됨
comments table의 comment_email column이 nullable 하거나 존재하지 않을 때 정상적으로 작동
(현재는 실행하면 sql null error 발생)

### 예시 이미지
![anno ver](https://github.com/00ovo00/test0528/assets/96408296/a204d58b-b61b-4edf-b6bf-193712418b15)

## 추가 변경 사항
#### 1. 기존 작성 코드와 통일성 유지를 위해 read.hbs에서 게시글과 댓글이 한번에 render 되도록 설계<br>
 그 결과 controller에서 function getReadPost와 fuction readComment 기능을 합쳐 function readForm으로 구성하게 됨
 router 부분도 router.get('/read', boardController.readForm); 로 수정

#### 2. comments table의 email, date column name을 comment_email, comment_date로 변경<br>
 sql join으로 article과 comments table data 얻어오려했으나 article의 email, date column과 comments의 email, data column 이름이 동일해 data가 제대로 join 되지 않는 문제 발생,
 1개 게시글에 댓글이 1개일 때는 정상 작동하나 댓글이 없거나 2개 이상일 때 null이 들어가 실행자체가 되지 않는 문제를 해결하기 위해 컬럼명 변경<br><br>
 <b>commnets table</b><br>
 email -> comment_email<br>
 date -> comment_date
 
