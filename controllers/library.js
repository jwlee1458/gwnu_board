const path = require('path')
const Book = require('../models/book')
const Librarian = require('../models/librarian')

const booksPath = path.join(process.cwd(), "data", "books.json")
const librarian = new Librarian(booksPath)

module.exports.registerBook = (req, res) => {
    let book = new Book(req.body["id"], req.body["place"], req.body.isbn, req.body.title,
        req.body.author, req.body.publisher, parseInt(req.body.price, 10))

    librarian.save(book)
        .then(() => res.redirect('/library'))
        .catch(errMsg => res.render('library/register-error', {"msg": errMsg}))
}

module.exports.showBooks = (req, res) => {
    librarian.fetchAll()
        .then(result => res.render('library/show-books', {"books": result}))
        .catch(errMsg => res.render('library/show-books-error', {"msg": errMsg}))
}