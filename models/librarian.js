const fs = require('fs')

module.exports = class Librarian {
    constructor(booksStorage) {
        this.booksStorage = booksStorage
    }

    save(book) {
        const promise = new Promise((resolve, reject) => {
            fs.readFile(this.booksStorage, (err, data) => {
                let books = []

                if(!err) {
                    books = JSON.parse(data)
                }

                books.push(book)

                fs.writeFile(this.booksStorage, JSON.stringify(books), err => {
                    if(err) {
                        return reject("Can not write book");
                    }
                    resolve()
                })
            })
        })
        return promise
    }

    fetchAll() {
        const promise = new Promise((resolve, reject) => {
            fs.readFile(this.booksStorage, (err, data) => {
                if(err) {
                    return reject("Error in Show Books")
                }
                resolve(JSON.parse(data))
            })
        })
        return promise
    }
}