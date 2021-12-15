const dotenv = require('dotenv')
dotenv.config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const mainRouter = require('./routes/')

const app = express()
const port = process.env.PORT || '3006'

// view engine setup
app.set('views', path.join(process.cwd(),'./build'))
app.set('view engine', 'html')

process.env.NODE_ENV === 'development'
  ? app.use(logger('dev'))
  : app.use(logger('short'))

app.use(express.json())
app.use(express.urlencoded( { extended: false } ))

app.use(express.static(path.join(process.cwd(),'build')))
app.use('/', mainRouter)

app.use((req, __, next) => {
    next(
        createError(404, `Sorry, nothing is found at ${req.url}`)
    )
})

app.use((err,req,res) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

app.listen(port, () => {console.log('here we go again', process.cwd())})
