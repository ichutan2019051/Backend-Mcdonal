'use strict'

var User = require('../models/user.models')
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt.services');


function adminMain(req, res) {  
    let user = new User();
    User.findOne({ name: 'AdminMc' }, (err, userFind) => {
        if (err) {
            console.log('Error al cargar el administrador');
        } else if (userFind) {
            console.log('Administrador creado.')
        } else {
            user.password = "123456";
            bcrypt.hash(user.password, null, null, (err, passwordHash) => {
                if (err) {
                    res.status(500).send({ message: 'ERROR, contraseña no encriptada.' })
                } else if (passwordHash) {
                    user.name = "AdminMc";
                    user.password = passwordHash;
                    user.rol = "ADMIN"
                    user.save((err, userSave) => {
                        if (err) {
                            console.log('Error al crear al administrador')
                        } else if (userSave) {
                            console.log('Administador creado')
                        } else {
                            console.log('Administrador no creado')
                        }
                    })
                }
            })
        }
    })
}



function removeEmpresa(req, res) {
  let userId = req.params.id;
  let params = req.body;

  if ('ADMIN' != req.user.rol && userId != req.user.sub) {
      return res.status(403).send({ message: 'No tienes permiso para eliminar esta empresa' });
  } else {
      User.findOne({ _id: userId }, (err, userFind) => {
          if (err) {
              return res.status(500).send({ message: 'Error general al eliminar' });
          } else if (userFind) {
              bcrypt.compare(params.password, userFind.password, (err, checkPassword) => {
                  if (err) {
                      return res.status(500).send({ message: 'Error general al intentar eliminar' })
                  } else if (checkPassword) {
                      User.findByIdAndRemove(userId, (err, userRemoved) => {
                          if (err) {
                              return res.status(500).send({ message: 'Error general al eliminar' });
                          } else if (userRemoved) {
                              return res.send({ message: 'Empresa eliminada', userRemoved });
                          } else {
                              return res.status(403).send({ message: 'Empresa no eliminada' });
                          }
                      })
                  } else {
                      return res.status(403).send({ message: 'Contraseña incorrecta.' });
                  }
              })
          } else {
              return res.status(403).send({ message: 'Usuario no eliminado' });
          }
      })
  }
}



function saveEmpresa(req, res) {
    var user = new User();
    var params = req.body;

    if (params.name  && params.password ) {
        User.findOne({ name: params.name }, (err, userFind) => {
            if (err) {
                return res.send({ message: 'Error general en el servidor' })
            } else if (userFind) {
                return res.send({ message: 'Nombre de usuario ya en uso' })
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error general en la encriptación' });
                    } else if (passwordHash) {
                        user.password = passwordHash;
                        user.name = params.name.toLowerCase();
                        user.rol = "EMPRESA";

                        user.save((err, empresaSaved) => {
                            if (err) {
                                return res.status(500).send({ message: 'Error general al guardar' });
                            } else if (empresaSaved) {
                                return res.send({ message: 'Empresa guardada', empresaSaved })
                            } else {
                                return res.send(500).send({ message: 'No se guardó la empresa' })
                            }
                        })
                    } else {
                        return res.status(401).send({ message: 'Contraseña no encriptada' })
                    }
                })
            }
        })
    } else {
        return res.send({ message: 'Porfavor ingresa todos los datos' });
    }
}


/*
function updateEmpresa(req, res) {
    let userId = req.params.id;
    let update = req.body;

    if ('ADMIN' != req.user.rol ) {
        return res.status(500).send({ message: 'No tienes permiso para realizar esta acción' })
    }
         else {
            if (update.name) {
                User.findOne({ name: update.name.toLowerCase() }, (err, userFind) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error general' });
                    } else if (userFind) {
                        return res.send({ message: 'No se puede actualizar, nombre de usuario ya en uso' });
                    } else {
                        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
                            if (err) {
                                return res.status(500).send({ message: 'Error general al actualizar' });
                            } else if (userUpdated) {
                                return res.send({ message: 'Empresa actualizada', userUpdated });
                            } else {
                                return res.send({ message: 'No se pudo actualizar la empresa' });
                            }
                        })
                    }
                })
            } else {
                User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error general al actualizar' });
                    } else if (userUpdated) {
                        return res.send({ message: 'Empresa actualizada', userUpdated });
                    } else {
                        return res.send({ message: 'No se pudo actualizar la empresa' });
                    }
                })
            }
        }
    }


*/


function getEmpresas(req, res) {
    User.find({ rol: 'EMPRESA' }).exec((err, empresas) => {
        if (err) {
            return res.status(500).send({ message: 'Error general en el servidor' })
        } else if (empresas) {
            return res.send({ message: 'Empresas:', empresas })
        } else {
            return res.status(404).send({ message: 'No hay registros' })
        }
    })
}




function login(req, res) {
  var params = req.body;

  if(params.name && params.password){
      User.findOne({name: params.name}, (err, userFind)=>{
          if(err){
              return res.status(500).send({message: 'Error general'});
          }else if(userFind){
              bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                  if(err){
                      return res.status(500).send({message: 'Error general en la verificación de la contraseña'});
                  }else if(checkPassword){
                      return res.send({message: 'Usuario logeado', token: jwt.createToken(userFind), user: userFind })
                  }else{
                      return res.status(404).send({message: 'Contraseña incorrecta'});
                  }
              })
          } else {
              return res.status(404).send({ message: 'usuario no encontrado' })
          }
      })
  } else {
      return res.status(401).send({ message: 'Porfavor ingresa todos los datos' });
  }
}

/*
function search(req, res) {
    var params = req.body;

    if (params.search)
    { User.find({
        $or: [{name: params.search}]
    }, (err, resultSearch) => {
        if (err) {
            return res.status(500).send({ message: 'Error general' });
        } else if (resultSearch) {
            return res.send({ message: 'Se encontraron coincidencias ', resultSearch });
        } else {
            return res.status(403).send({ message: 'Busqueda sin exito.' });
        }
    })
} else {
    return res.status(403).sebd({ message: 'Error, ingresa los datos' });
}

}

*/



module.exports = {
    adminMain,
    removeEmpresa,
    saveEmpresa,
    getEmpresas,
    login,
    
}