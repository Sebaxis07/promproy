import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axiosClient from '../../config/axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { resettoken } = useParams(); // Cambiar token por resettoken
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      // Update to match backend route
      const response = await axiosClient.put(`/auth/reset-password/${resettoken}`, {
        password: data.password
      });
      toast.success('Contraseña actualizada correctamente');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al restablecer la contraseña';
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
              <FaLock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Restablecer Contraseña
            </h2>
            <p className="text-blue-200/80 text-sm">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campos de contraseña similar a Register.jsx */}
            {/* ... */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;