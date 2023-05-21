const express = require('express')
const librarianController = require('../controllers/library')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('library/index')
})

router.get('/register-book', (req, res) => {
    res.render('library/register-book')
})

router.post('/register-book', librarianController.registerBook)

router.get('/show-books', librarianController.showBooks)

module.exports = router


