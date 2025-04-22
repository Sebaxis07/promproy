import jwt from 'jsonwebtoken';
import asyncHandler from './async.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('No autorizado - Token no proporcionado', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new ErrorResponse('No se encontró ningún usuario con este token', 401));
    }

    // Verificar si el token ha expirado
    if (decoded.exp < Date.now() / 1000) {
      return next(new ErrorResponse('Token expirado', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Token inválido', 401));
    }
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expirado', 401));
    }
    return next(new ErrorResponse('Error en la autenticación', 401));
  }
});