// src/components/Home/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCalculator, FaUserGraduate, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              Calculadora de Promedios Académicos
            </h1>
            <p className="text-xl mb-8">
              Sistema especializado para calcular tus promedios según el sistema chileno del 1.0 al 7.0
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  Ir a mi Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn btn-primary text-lg px-8 py-3"
                  >
                    Registrarse Gratis
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-primary hover:bg-gray-100 btn text-lg px-8 py-3"
                  >
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Características Principales
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-primary">
                <FaCalculator className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cálculo Preciso</h3>
            <p className="text-gray-600">
              Calcula tus promedios exactos según el sistema chileno (1.0 - 7.0)
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaCheckCircle className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ponderaciones</h3>
            <p className="text-gray-600">
              Define las ponderaciones específicas para cada evaluación
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaUserGraduate className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Asignaturas Organizadas</h3>
            <p className="text-gray-600">
              Organiza todas tus asignaturas y calificaciones en un solo lugar
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaChartLine className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Estadísticas</h3>
            <p className="text-gray-600">
              Visualiza tu rendimiento académico con estadísticas claras
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Cómo Funciona?
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 text-center mb-6 md:mb-0">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold">
                    1
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Crea tu cuenta</h3>
                  <p className="text-gray-600">
                    Regístrate en menos de un minuto con tu correo electrónico para comenzar a utilizar la aplicación.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 text-center mb-6 md:mb-0">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold">
                    2
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Agrega tus asignaturas</h3>
                  <p className="text-gray-600">
                    Define las asignaturas que estás cursando y configura las evaluaciones con sus respectivas ponderaciones.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 text-center mb-6 md:mb-0">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold">
                    3
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Registra tus calificaciones</h3>
                  <p className="text-gray-600">
                    Ingresa tus calificaciones a medida que las obtengas y visualiza automáticamente tu promedio actualizado.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 text-center mb-6 md:mb-0">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold">
                    4
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Visualiza tus promedios</h3>
                  <p className="text-gray-600">
                    Consulta tu rendimiento en tiempo real, identificando fácilmente qué asignaturas necesitan más atención.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  Ir a mi Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  ¡Comenzar Ahora!
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Lo que dicen nuestros usuarios
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xl">
                MP
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800">María Pérez</h4>
                <p className="text-gray-500 text-sm">Estudiante de Medicina</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Esta aplicación ha sido mi salvación. Con tantas asignaturas complejas, poder calcular exactamente mis promedios me ha ayudado a enfocarme en las materias que necesitan más atención."
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xl">
                JR
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800">Juan Rodríguez</h4>
                <p className="text-gray-500 text-sm">Estudiante de Ingeniería</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Las ponderaciones personalizadas son lo mejor. Mis profesores tienen sistemas de evaluación muy específicos y esta aplicación me permite configurar todo exactamente como necesito."
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xl">
                CS
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-800">Carla Soto</h4>
                <p className="text-gray-500 text-sm">Estudiante de Derecho</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Interfaz súper intuitiva y fácil de usar. Me encanta poder ver de un vistazo cómo voy en todas mis asignaturas y saber exactamente qué notas necesito para aprobar."
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar a calcular tus promedios?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a miles de estudiantes que ya organizan sus calificaciones y mejoran su rendimiento académico.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-white text-primary hover:bg-gray-100 btn text-lg px-8 py-3"
            >
              Ir a mi Dashboard
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-primary hover:bg-gray-100 btn text-lg px-8 py-3"
            >
              Registrarse Gratis
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;