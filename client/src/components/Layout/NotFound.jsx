import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <FaExclamationTriangle className="h-16 w-16 text-warning mx-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Página no encontrada
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>
        
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/"
              className="btn btn-primary flex items-center justify-center"
            >
              <FaHome className="mr-2" />
              Volver al inicio
            </Link>
            <Link
              to="/dashboard"
              className="text-primary hover:text-blue-700 font-medium"
            >
              Ir al panel principal
            </Link>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Si crees que esto es un error, por favor contacta al soporte.
        </p>
      </div>
    </div>
  );
};

export default NotFound;