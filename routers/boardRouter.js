const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.get('/', boardController.getMainBoard);

router.get('/write', boardController.getWriteForm);
router.post('/write', boardController.createPost);

//router.get('/read', boardController.getReadPost);
//router.get('/read', boardController.readComment);
router.get('/read', boardController.readForm);
router.post('/read', boardController.addComment);

router.get('/modify', boardController.getModifyForm);
router.post('/modify', boardController.updatePost);

router.get('/delete', boardController.deletePost);

router.get('/search_result', boardController.getSearchResult);
router.post('/search_result', boardController.searchPosts);

module.exports = router;