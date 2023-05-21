const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const libraryRouter = require('./routers/library')

const app = express()
app.use('/static', express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.urlencoded({extended: false}))

app.set('view engine', 'hbs')

app.use('/library', libraryRouter)

app.get('/', (req, res) => {
    res.render('index')
})

app.use((req, res, next) => {
    console.log(req.url)
    res.status(404).render('404', {
        url: req.url
    })
})

app.listen(3000)



