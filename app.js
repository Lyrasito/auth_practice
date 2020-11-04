const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const { NotFound } = require('http-errors');
require('dotenv').config();
const authRoute = require('./Routes/auth.route')
require('./helpers/init_mongodb')
const {verifyAccessToken} = require('./helpers/jwt_helper')

const app = express();
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/auth', authRoute)



app.get('/', verifyAccessToken, async(req, res, next) => {
    
    res.send('Hello from express')
})

app.use(async(req, res, next) => {
    /*
    const error = new Error("not found")
    error.status = 404;
    next(error); */
    next(createError.NotFound('This route does not exist'))
});

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})