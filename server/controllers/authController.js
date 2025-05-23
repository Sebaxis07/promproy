import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// Mover esta función al inicio
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

export const register = asyncHandler(async (req, res, next) => {
    try {
      console.log('Datos recibidos:', req.body);
      
      const { name, email, password } = req.body;
  
      // Validar datos
      if (!name || !email || !password) {
        console.log('Datos incompletos');
        return next(new ErrorResponse('Por favor proporcione todos los campos requeridos', 400));
      }
  
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('Usuario ya existe');
        return next(new ErrorResponse('El correo electrónico ya está registrado', 400));
      }
  
      // Crear usuario
      const user = await User.create({
        name,
        email,
        password
      });
  
      console.log('Usuario creado exitosamente');
      sendTokenResponse(user, 201, res);
    } catch (error) {
      console.error('Error en registro:', error);
      next(error);
    }
  });

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validar email y password
  if (!email || !password) {
    return next(new ErrorResponse('Por favor proporcione email y contraseña', 400));
  }

  // Verificar usuario
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  // Verificar contraseña
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  sendTokenResponse(user, 200, res);
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

export const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('No autorizado', 401));
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('No autorizado', 401));
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    return next(new ErrorResponse('No autorizado', 401));
  }
});

// @desc    Olvidó contraseña
// @route   POST /api/auth/forgotpassword
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('No existe usuario con ese email', 404));
  }

  // Obtener token de reset
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Crear URL de reset
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

  const message = `Has recibido este email porque has solicitado restablecer tu contraseña. Por favor haz una petición PUT a: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Recuperación de contraseña',
      message
    });

    res.status(200).json({ success: true, data: 'Email enviado' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email no pudo ser enviado', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Obtener token hasheado
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Token inválido', 400));
  }

  // Establecer nueva contraseña
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});