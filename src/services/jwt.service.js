'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'IN6BM'

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        rol: user.rol,
        iat: moment().unix(),
        expo: moment().add(4, 'hours').unix()
    }
    return jwt.encode(payload, secretKey)
}