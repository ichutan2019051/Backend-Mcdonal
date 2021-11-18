'use strict'

var express = require('express');
var productoController = require('../controllers/productos.controllers');
var mdAuth = require('../services/middelwere.services')

var api = express.Router();

api.post('/setProducto', mdAuth.ensureAuth ,productoController.setProducto);
api.put('/sendProductos', mdAuth.ensureAuth, productoController.sendProductos);
api.put('/setAsignarProducto/:idE', mdAuth.ensureAuth, productoController.setAsignarProducto)
api.put('/store/:idP', mdAuth.ensureAuth ,productoController.store);
api.post('/searchP', mdAuth.ensureAuth ,productoController.searchP);
api.post('/searchPS', mdAuth.ensureAuth ,productoController.searchPS);


module.exports = api;