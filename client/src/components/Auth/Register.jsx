// src/components/Auth/Register.jsx
import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate para comenzar a calcular tus promedios
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="form-input pl-10"
                placeholder="Nombre completo"
                {...register('name', { 
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 3,
                    message: 'El nombre debe tener al menos 3 caracteres'
                  }
                })}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="form-input pl-10"
                placeholder="Correo electrónico"
                {...register('email', { 
                  required: 'El correo es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="form-input pl-10"
                placeholder="Contraseña"
                {...register('password', { 
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="form-input pl-10"
                placeholder="Confirmar contraseña"
                {...register('confirmPassword', { 
                  required: 'Confirme su contraseña',
                  validate: value => value === password || 'Las contraseñas no coinciden'
                })}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{ errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FaUserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-blue-500">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;