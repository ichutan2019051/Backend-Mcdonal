/*

import { decode } from 'jwt-simple';
import moment from 'moment';
var SECRET = 'IN6BM';
import { error as _error } from './response';

export function verifyAuth (req, res, next) {
  if (!req.headers.authorization) {
    return _error(req, res, 'No tiene el TOKEN.', 404);
   
  }

  let token = req.headers.authorization.replace(/['"]+/g, '');
  let payload;
  try {
    payload = decode(token, SECRET);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        mensaje: 'El token ha expirado.',
      });
    }
  } catch (error) {
    console.error(error);
    return _error(req, res, 'El token no es valido', 404);
  }

  req.user = payload;
  next();
}


*/