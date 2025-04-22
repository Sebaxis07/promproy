// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor proporcione un nombre']
  },
  email: {
    type: String,
    required: [true, 'Por favor proporcione un correo electrónico'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor proporcione un correo electrónico válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor proporcione una contraseña'],
    minlength: 6,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Asegurarse de que el hook pre-save funcione correctamente
UserSchema.pre('save', async function(next) {
  // Solo hacer hash de la contraseña si ha sido modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Asegúrate de pasar cualquier error a next()
  }
});

// Método para verificar contraseña
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para generar JWT
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export default mongoose.model('User', UserSchema);