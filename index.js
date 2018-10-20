const express = require('express');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/page');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise
//connecting to mongodb
mongoose.connect('mongodb://localhost:27017/ninjago', {useNewUrlParser: true})
mongoose.connection.once('open', () => {
    console.log('connected to database')
}).on('error', (err) => {
    console.log('Error : ', err)
})

//initializing express
var app = express()

app.use(express.static('public'))
app.use(pageRoutes)
app.use(bodyParser.json())
app.use('/api',apiRoutes)
app.use('/auth', authRoutes)
app.use((err, req, res, next) => {
    res.status(422).send({Error: err.message})
})

app.listen(process.env.port || 4000,() => {
    console.log('Server is running')
})
