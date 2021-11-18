'use strict'

var express = require('express');
var empleadoController = require('../controllers/empleado.controllers');
var mdAuth = require('../services/middelwere.services')

var api = express.Router();

api.put('/setEmpleado', mdAuth.ensureAuth, empleadoController.setEmpleado);
api.put('/updateEmpleado/:idE', mdAuth.ensureAuth, empleadoController.updateEmpleado);
api.delete('/removeEmpleado/:idE', mdAuth.ensureAuth, empleadoController.removeEmpleado);
api.post('/search', mdAuth.ensureAuth , empleadoController.search);
api.get('/getEmpleados', mdAuth.ensureAuth, empleadoController.getEmpleados);


module.exports = api;