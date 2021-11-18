'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema({
    name: String,
    proveedor: String,
    stock: Number,
    cantidad: Number,
    empresa: String
});

module.exports = mongoose.model('producto', productoSchema);