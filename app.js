'use strict'

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')


var User = require('./src/routs/user.routs')
var Empleado = require('./src/routs/empleado.routs')
var Productos = require('./src/routs/productos.routs')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


app.use(cors())

app.use('/api', User)
app.use('/api/',Empleado)
app.use('/api/',Productos)


module.exports = app;