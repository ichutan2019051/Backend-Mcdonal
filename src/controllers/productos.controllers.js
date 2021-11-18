'use strict'

var User = require('../models/user.models');
var Producto = require('../models/productos.models');

function setProducto(req, res) {
    var userId = req.user.sub;
    var params = req.body;
    var producto = new Producto();

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para realizar esta acción' })
    } else {
        if (params.name && params.proveedor && params.stock) {
            Producto.findOne({name: params.name, empresa: userId}, (err, ProductoFind) => {
                if(err) return res.status(500).send({ message:  "Error general"})
                if(ProductoFind) return res.status(500).send({ message: "El producto ya existe"})
                    producto.name =  producto.name
                    producto.proveedor =  producto.proveedor
                    producto.stock = params.stock
                    producto.cantidad = params.cantidad
                    producto.empresa = userId

                    producto.save((err, productosave) => {
                        if(err) return res.status(500).send({ message:  "Error general"})
                        if(!productosave) return re.status(500).send({ message: "No se a podido guardar el producto maestro"})
                        return res.status(200).send({ message: "Producto Guardado, "},productossave)
                    })
            })
        } else {
            return res.send({ message: 'Por favor ingresa los datos obligatorios' });
        }
    }
}

function setAsignarProducto(req, res){
    var userId = req.user.sub;
    var empleadoid = req.params.IdE;
    var params = req.body;
    var producto = new Producto();

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para realizar esta acción' })
    } else {
        Producto.findOne({name: params.name, empresa: userId},(err, ProductoMFind) => {
            if(err) return res.status(500).send({ message: "Error general"})
            if(!ProductoMFind) return res.status(500).send({message: "No existe ningun producto"})
            
            Producto.findOne({name: params.name, empresa: empleadoid}, (err, ProductoEFind) => {
                if(err) return res.status(500).send({ message: "Error general"})
                if(!ProductoEFind){
                    producto.name =  ProductoMFind.name
                    producto.proveedor =  ProductoMFind.proveedor
                    producto.stock = params.stock
                    producto.cantidad = params.cantidad
                    producto.empresa = empleadoid

                    Producto.findByIdAndUpdate(ProductoMFind._id, {stock: ProductoMFind.stock - params.stock,
                                                                    cantidad: ProductoMFind.cantidad - params.cantidad},
                         { new: true }, (err, ProductoUpdate)=>{
                        if(err) return res.status(500).send({ message: 'Error en la peticion' });
                        if(!usuarioActualizado) return res.status(404).send({ message: 'No se ha podido actualizar el producto' });
                        
                        producto.save((err, productosave) => {
                            if(err) return res.status(500).send({ message:  "Error general"})
                            if(!productosave) return re.status(500).send({ message: "No se a podido guardar el producto maestro"})
                            return res.status(200).send({ message: "Producto Guardado, "},productossave)
                        })
                    })
                        
                }else{

                    Producto.findByIdAndUpdate(ProductoMFind._id, {stock: ProductoMFind.stock - params.stock,
                        cantidad: ProductoMFind.cantidad - params.cantidad},
                        { new: true }, (err, ProductoUpdate)=>{
                        if(err) return res.status(500).send({ message: 'Error en la peticion' });
                        if(!ProductoUpdate) return res.status(404).send({ message: 'No se ha podido actualizar el producto' });

                        Producto.findByIdAndUpdate(ProductoEFind._id, {stock: ProductoEFind.stock + params.stock,
                            cantidad: ProductoEFind.cantidad + params.cantidad},
                            { new: true }, (err, ProductoUpdate2)=>{
                            if(err) return res.status(500).send({ message: 'Error en la peticion' });
                            if(!ProductoUpdate2) return res.status(404).send({ message: 'No se ha podido actualizar el producto' });
    
                            return res.status(200).send({ message: "Producto Actualizado, "},ProductoUpdate2)
                        })
                    })

                }
            })
        })
    }
}

function store(req, res) {
    var userId = req.user.sub;
    var productoId = req.params.IdP;
    var params = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para realizar esta acción' })
    } else {
        Producto.findOne( productoId, (err, productoFind) => {
            if (err) {
                return res.status(500).send({ message: 'Error general'})
            }else if (productoFind.stock < params.cant){
                return res.send({ message: 'Producto insuficiente.' })
            }else{
                Producto.findByIdAndUpdate(productoFind, { $inc: { cantidad: params.cant } }, { new: true }, (err, aumento) => {
                })
                Producto.findByIdAndUpdate(productoFind, { $inc: { stock: -params.cant } }, { new: true }, (err, aumento) => {
                })
                return res.status(200).send({message: 'La compra se realizo con exito'})
            }
        })
    }
}

function sendProductos(req, res) {
    var userId = req.user.sub;
    var params = req.body;

    if(params.orden == "SotckAsc"){
        Producto.find({ empresa: userId }, (err, productos) => {
            if (err) {
                return res.status(500).send({ message: 'Error general' })
            } else if (productos) {
                return res.status(200).send({ message: 'Productos Encontrados: ', productos: productos })
            } else {
                return res.status(500).send({ message: 'no se encontraron productos' })
            }
        }).sort({stock:1});
    }

    if(params.orden == "SotckDesc"){
        Producto.find({ empresa: userId }, (err, productos) => {
            if (err) {
                return res.status(500).send({ message: 'Error general' })
            } else if (productos) {
                return res.status(200).send({ message: 'Productos Encontrados: ', productos: productos })
            } else {
                return res.status(500).send({ message: 'no se encontraron productos' })
            }
        }).sort({stock:-1});
    }
    
    if(params.orden == "CanVenDesc"){
        Producto.find({ empresa: userId }, (err, productos) => {
            if (err) {
                return res.status(500).send({ message: 'Error general' })
            } else if (productos) {
                return res.status(200).send({ message: 'Productos Encontrados: ', productos: productos })
            } else {
                return res.status(500).send({ message: 'no se encontraron productos' })
            }
        }).sort({cantidad:-1});
    }

    if(params.orden == "CanVenAsc"){
        Producto.find({ empresa: userId }, (err, productos) => {
            if (err) {
                return res.status(500).send({ message: 'Error general' })
            } else if (productos) {
                return res.status(200).send({ message: 'Productos Encontrados: ', productos: productos })
            } else {
                return res.status(500).send({ message: 'no se encontraron productos' })
            }
        }).sort({cantidad:1});
    }
}

function searchP(req, res) {
    var params = req.body;

    if (params.search) {
        Producto.find({
            $or: [{ name: params.search },
            { proveedor: params.search }]
        }, (err, resultSearch) => {
            if (err) {
                console.log(resultSearch);
                return res.status(500).send({ message: 'Error general' });
            } else if (resultSearch) {
                console.log(resultSearch);
                return res.send({ message: 'Coincidencias encontradas: ', resultSearch });
            } else {
                console.log(resultSearch);
                return res.status(403).send({ message: 'Búsqueda sin coincidencias' });
            }
        })
    } else {
        console.log(params.search);
        return res.status(403).send({ message: 'Ingresa datos en el campo de búsqueda' });
    }
}

function searchPS(req, res) {
    var params = req.body;

    if (params.search2) {
        Producto.find({
            $or: [{ stock: params.search2 }]
        }, (err, resultSearch) => {
            if (err) {
                console.log(resultSearch);
                return res.status(500).send({ message: 'Error general' });
            } else if (resultSearch) {
                console.log(resultSearch);
                return res.send({ message: 'Coincidencias encontradas: ', resultSearch });
            } else {
                console.log(resultSearch);
                return res.status(403).send({ message: 'Búsqueda sin coincidencias' });
            }
        })
    } else {
        console.log(params.search);
        return res.status(403).send({ message: 'Ingresa datos en el campo de búsqueda' });
    }
}
/*
function removeProductos(req, res) {
    let userId = req.user.sub;
    let productosId = req.params.idP;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permisos para realizar esta acción' });
    } else {
        User.findOneAndUpdate({ _id: userId, productos: productosId },
            { $pull: { productos: productosId } }, { new: true }, (err, productoPull) => {
                if (err) {
                    return res.status(500).send({ message: 'Error general' });
                } else if (productoPull) {
                    Producto.findByIdAndRemove(productosId, (err, productoRemoved) => {
                        if (err) {
                            return res.status(500).send({ message: 'Error general al eliminar el producto' })
                        } else if (productoRemoved) {
                            User.findByIdAndUpdate(userId, { $inc: { cant: -1 } }, { new: true }, (err, empresaInc) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error al desincrementar el producto' })
                                } else if (empresaInc) {
                                    res.status(200).send({ message: 'Actualización de empresa', empresaInc })
                                }
                            })
                        } else {
                            return res.status(403).send({ message: 'Producto no encontrado, o ya eliminado' })
                        }
                    })
                } else {
                    return res.status(500).send({ message: 'No se pudo eliminar el empleado de la Empresa' });
                }
            }).populate('productos')
    }
}  */

module.exports = {
    setProducto,
    setAsignarProducto,
    sendProductos,
    store,
    searchP,
    searchPS,
}