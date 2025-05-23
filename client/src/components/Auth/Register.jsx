// src/components/Auth/Register.jsx
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaEye, FaEyeSlash, FaCheckCircle, FaGraduationCap } from 'react-icons/fa';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const success = await registerUser(data);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: 'Débil', color: 'bg-red-500' },
      { strength: 2, label: 'Regular', color: 'bg-yellow-500' },
      { strength: 3, label: 'Buena', color: 'bg-blue-500' },
      { strength: 4, label: 'Excelente', color: 'bg-green-500' }
    ];

    return levels[strength - 1] || { strength: 0, label: '', color: '' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <FaGraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Crear Cuenta
              </h2>
              <p className="text-blue-200/80 text-sm">
                Únete y comienza a gestionar tus promedios académicos
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaUser className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:bg-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    placeholder="Tu nombre completo"
                    {...register('name', { 
                      required: 'El nombre es requerido',
                      minLength: {
                        value: 3,
                        message: 'El nombre debe tener al menos 3 caracteres'
                      }
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaEnvelope className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:bg-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    placeholder="tu@email.com"
                    {...register('email', { 
                      required: 'El correo es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Correo electrónico inválido'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaLock className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:bg-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    placeholder="••••••••"
                    {...register('password', { 
                      required: 'La contraseña es requerida',
                      minLength: {
                        value: 6,
                        message: 'La contraseña debe tener al menos 6 caracteres'
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-blue-300/70 hover:text-blue-400 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-blue-300/70 hover:text-blue-400 transition-colors" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-blue-200/70">Fortaleza de contraseña</span>
                      <span className="text-xs text-blue-300">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaLock className="h-5 w-5 text-blue-300/70 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/50 focus:bg-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    placeholder="••••••••"
                    {...register('confirmPassword', { 
                      required: 'Confirme su contraseña',
                      validate: value => value === password || 'Las contraseñas no coinciden'
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-blue-300/70 hover:text-blue-400 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-blue-300/70 hover:text-blue-400 transition-colors" />
                    )}
                  </button>
                </div>
                
                {/* Password match indicator */}
                {watch('confirmPassword') && password && (
                  <div className="mt-2 flex items-center">
                    {watch('confirmPassword') === password ? (
                      <div className="flex items-center text-green-400 text-sm">
                        <FaCheckCircle className="mr-2 h-4 w-4" />
                        Las contraseñas coinciden
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400 text-sm">
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        Las contraseñas no coinciden
                      </div>
                    )}
                  </div>
                )}
                
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4 text-white font-semibold shadow-lg hover:from-green-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="mr-2 h-5 w-5" />
                      Crear Cuenta
                    </>
                  )}
                </span>
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-blue-200/80 text-sm">
                  ¿Ya tienes una cuenta?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-blue-300 hover:text-blue-200 transition-colors duration-200 underline decoration-blue-300/50 hover:decoration-blue-200 underline-offset-4"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-blue-200/60 text-xs">
              Al registrarte, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;