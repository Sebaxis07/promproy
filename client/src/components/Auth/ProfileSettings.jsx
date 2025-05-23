import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import axiosClient from '../../config/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      // Update to match backend route
      const response = await axiosClient.post('/auth/forgot-password', data);
      setEmailSent(true);
      toast.success('Se ha enviado un correo con las instrucciones');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al procesar la solicitud';
      toast.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <FaEnvelope className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Recuperar Contraseña
            </h2>
            <p className="text-blue-200/80 text-sm">
              Ingresa tu correo electrónico para recibir instrucciones
            </p>
          </div>

          {emailSent ? (
            <div className="text-center">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <p className="text-green-400">
                  Revisa tu correo electrónico para continuar con el proceso de recuperación.
                </p>
              </div>
              <Link 
                to="/login"
                className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    type="email"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
              </button>

              <div className="text-center">
                <Link 
                  to="/login"
                  className="text-blue-300 hover:text-blue-200 transition-colors duration-200 text-sm"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;