   'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    password: String,
    rol: String,
    empleados: [{type: Schema.ObjectId, ref: 'empleado'}]
});

module.exports = mongoose.model('user', userSchema);