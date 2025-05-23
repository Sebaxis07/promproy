import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaExclamationTriangle, 
  FaSearch, 
  FaArrowLeft, 
  FaGraduationCap,
  FaChartLine,
  FaBookOpen,
  FaRocket,
  FaCompass,
  FaLightbulb
} from 'react-icons/fa';

const NotFound = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const suggestions = [
    {
      icon: FaHome,
      title: "Página Principal",
      description: "Explora todas las funciones desde el inicio",
      link: "/",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaGraduationCap,
      title: "Dashboard Académico",
      description: "Accede a tu panel de control personal",
      link: "/dashboard",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaBookOpen,
      title: "Gestión de Asignaturas",
      description: "Organiza tus materias y calificaciones",
      link: "/subjects",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaChartLine,
      title: "Análisis de Rendimiento",
      description: "Visualiza tu progreso académico",
      link: "/analytics",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-red-600/20 rounded-full border border-red-500/30 backdrop-blur-sm mb-8">
              <FaExclamationTriangle className="mr-2 text-red-400" />
              <span className="text-red-200 text-sm font-medium">Página No Encontrada</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                4
              </span>
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                0
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                4
              </span>
            </h1>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Oops! Página no encontrada
            </h2>

            <p className="text-xl sm:text-2xl text-blue-200/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              La página que buscas no existe o ha sido movida. Pero no te preocupes, 
              podemos ayudarte a encontrar exactamente lo que necesitas.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Link
                to="/"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  <FaHome className="mr-2" />
                  Volver al Inicio
                  <FaRocket className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
              >
                <span className="flex items-center">
                  <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  Página Anterior
                </span>
              </button>
            </div>
          </div>

          {/* Suggestions Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
                <FaCompass className="mr-3 text-blue-400" />
                ¿Qué estás buscando?
              </h3>
              <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
                Explora estas secciones populares para encontrar lo que necesitas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  to={suggestion.link}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105"
                >
                  <div className="relative z-10">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${suggestion.color} mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <suggestion.icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{suggestion.title}</h4>
                    <p className="text-blue-200/80 leading-relaxed">{suggestion.description}</p>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 mb-12">
            <div className="text-center mb-8">
              <FaLightbulb className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">¿Necesitas ayuda?</h3>
              <p className="text-blue-200/80 max-w-2xl mx-auto">
                Si no encuentras lo que buscas, aquí tienes algunas opciones para continuar
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600/20 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="h-8 w-8 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Buscar Contenido</h4>
                <p className="text-blue-200/70 text-sm">Utiliza el buscador para encontrar contenido específico</p>
              </div>

              <div className="text-center">
                <div className="bg-green-600/20 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaBookOpen className="h-8 w-8 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Documentación</h4>
                <p className="text-blue-200/70 text-sm">Consulta nuestra guía de usuario completa</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-600/20 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaGraduationCap className="h-8 w-8 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Soporte Técnico</h4>
                <p className="text-blue-200/70 text-sm">Contacta a nuestro equipo de soporte especializado</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-blue-200/60 text-lg mb-4">
              ¿Crees que esto es un error?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:soporte@calcunotas.com" 
                className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 font-medium"
              >
                Contactar Soporte
              </a>
              <a 
                href="https://github.com/calcunotas/issues" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 hover:text-white rounded-xl border border-gray-500/30 hover:border-gray-400/50 transition-all duration-300 font-medium"
              >
                Reportar Problema
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-500"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-cyan-400/30 rounded-full animate-bounce delay-1500"></div>
    </div>
  );
};

export default NotFound;