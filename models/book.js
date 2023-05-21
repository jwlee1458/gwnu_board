module.exports = class Book {
    constructor(id, place, isbn, title, author, publisher, price) {
        this.id = id
        this.place = place
        this.isbn = isbn
        this.title = title
        this.author = author
        this.publisher = publisher
        this.price = price
    }
}