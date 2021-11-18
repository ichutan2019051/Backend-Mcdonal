'use strict'

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')


var User = require('./src/routs/user.routs')


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use(cors())

app.use('/api', User)

module.exports = app;