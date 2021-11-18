'use strict'

var mongoose = require('mongoose')
var app = require('./app')
var userInit = require('./src/controllers/user.controllers');

mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://admin:admin@cluster0.czexi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useFindAndModify: true})
    .then(()=>{
        console.log('Estas conectado a la base de datos')
        userInit.adminMain();
        app.listen(process.env.PORT || 3000, ()=>{
            console.log('El Servidor esta corriendo')
        })
    })
    .catch(err=>console.log(err))
    

