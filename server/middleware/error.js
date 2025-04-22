// middleware/error.js
import ErrorResponse from '../utils/errorResponse.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error completo:', err);

  // Mongoose error de ID inválido
  if (err.name === 'CastError') {
    const message = `Recurso no encontrado`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose error de duplicidad
  if (err.code === 11000) {
    const message = 'Valor duplicado ingresado';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose error de validación
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error del servidor'
  });
};

export default errorHandler;