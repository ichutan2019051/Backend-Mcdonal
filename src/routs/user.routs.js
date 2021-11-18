'use strict'

var express = require('express')
var userController = require('../controllers/user.controllers')
var mdAuth = require('../services/middelwere.services')

var api = express.Router();

api.put('/removeEmpresa/:id',mdAuth.ensureAuth, userController.removeEmpresa);
api.get('/getEmpresas', mdAuth.ensureAuth, userController.getEmpresas);
api.post('/saveEmpresa', mdAuth.ensureAuth ,userController.saveEmpresa);
api.post('/login', userController.login);
module.exports = api;