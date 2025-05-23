// src/components/Home/Home.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalculator, 
  FaUserGraduate, 
  FaChartLine, 
  FaCheckCircle,
  FaBookOpen,
  FaAward,
  FaTrophy,
  FaGraduationCap,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaUsers,
  FaClipboardCheck
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: FaCalculator,
      title: "Cálculo Automático",
      description: "Sistema automático de cálculo de promedios según normativa chilena (escala 1.0 - 7.0)",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaBookOpen,
      title: "Gestión de Asignaturas",
      description: "Organiza todas tus materias con evaluaciones ponderadas y seguimiento detallado",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaChartLine,
      title: "Análisis de Rendimiento",
      description: "Visualiza tu progreso académico con gráficos y estadísticas en tiempo real",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaAward,
      title: "Metas Académicas",
      description: "Establece objetivos de notas y recibe alertas para mantener tu rendimiento",
      color: "from-orange-500 to-red-500"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Registro Rápido",
      description: "Crea tu cuenta en menos de 30 segundos con tu email estudiantil",
      icon: FaUserGraduate
    },
    {
      number: "02", 
      title: "Configura Asignaturas",
      description: "Agrega tus ramos con sus respectivas ponderaciones de evaluación",
      icon: FaBookOpen
    },
    {
      number: "03",
      title: "Registra Calificaciones",
      description: "Ingresa tus notas y observa cómo se actualiza tu promedio automáticamente",
      icon: FaClipboardCheck
    },
    {
      number: "04",
      title: "Monitorea Progreso",
      description: "Analiza tu rendimiento y toma decisiones informadas sobre tu estudio",
      icon: FaChartLine
    }
  ];

  const stats = [
    { number: "7.0", label: "Nota Máxima", subtitle: "Sistema Chileno" },
    { number: "4.0", label: "Nota Mínima", subtitle: "Para Aprobar" },
    { number: "60%", label: "Ponderación", subtitle: "Promedio Exámenes" },
    { number: "40%", label: "Evaluación", subtitle: "Continua Típica" }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
            {[...Array(20)].map((_, i) => (
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 rounded-full border border-blue-500/30 backdrop-blur-sm mb-6">
              <FaTrophy className="mr-2 text-yellow-400" />
              <span className="text-blue-200 text-sm font-medium">Sistema de Cálculo Académico Profesional</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              Calcula tus
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Promedios Académicos
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-blue-200/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Sistema especializado en el cálculo preciso de promedios académicos chilenos. 
            Gestiona tus asignaturas, ponderaciones y visualiza tu rendimiento en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  <FaChartLine className="mr-2" />
                  Ir a mi Dashboard
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center">
                    <FaGraduationCap className="mr-2" />
                    Comenzar Gratis
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
                >
                  <span className="flex items-center">
                    <FaPlay className="mr-2" />
                    Iniciar Sesión
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-blue-300 font-medium">{stat.label}</div>
                <div className="text-blue-200/60 text-sm">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Herramientas Académicas Profesionales
            </h2>
            <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
              Diseñado específicamente para el sistema educativo chileno con funcionalidades
              que se adaptan a las necesidades reales de estudiantes universitarios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 shadow-xl`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-blue-200/80 leading-relaxed">{feature.description}</p>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Proceso Simple y Efectivo
            </h2>
            <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
              En cuatro pasos simples tendrás el control total de tu rendimiento académico
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-bold w-16 h-16 rounded-2xl flex items-center justify-center mr-4">
                        {step.number}
                      </div>
                      <step.icon className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-blue-200/80 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-6xl text-white/20">
                      <step.icon />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Adaptado al Sistema Educativo Chileno
            </h2>
            <p className="text-xl text-blue-200/80 max-w-3xl mx-auto">
              Nuestro sistema entiende las particularidades del sistema de calificación chileno
              y las necesidades específicas de estudiantes universitarios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 p-2 rounded-lg mt-1">
                  <FaCheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Escala 1.0 - 7.0</h3>
                  <p className="text-blue-200/80">Sistema de calificación estándar chileno con precisión decimal</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 p-2 rounded-lg mt-1">
                  <FaCheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ponderaciones Personalizadas</h3>
                  <p className="text-blue-200/80">Configura evaluaciones con porcentajes específicos según cada cátedra</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-500 p-2 rounded-lg mt-1">
                  <FaCheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Cálculo Automático</h3>
                  <p className="text-blue-200/80">Algoritmos precisos que consideran todas las variables académicas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-500 p-2 rounded-lg mt-1">
                  <FaCheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Proyección de Notas</h3>
                  <p className="text-blue-200/80">Calcula qué nota necesitas en próximas evaluaciones para cumplir objetivos</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Datos del Sistema Educativo</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Nota mínima de aprobación</span>
                  <span className="text-white font-bold">4.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Excelencia académica</span>
                  <span className="text-white font-bold">6.0+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Promedio típico universitario</span>
                  <span className="text-white font-bold">5.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Graduación con distinción</span>
                  <span className="text-white font-bold">6.5+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <FaGraduationCap className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Optimiza tu Rendimiento Académico
            </h2>
            <p className="text-xl text-blue-200/80 mb-8 max-w-2xl mx-auto">
              Únete a estudiantes que ya han mejorado su organización académica 
              y control de calificaciones con nuestro sistema profesional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="group px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  <FaChartLine className="mr-2" />
                  Acceder a Dashboard
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="group px-8 py-4 bg-white text-blue-900 hover:bg-gray-100 font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  <FaUsers className="mr-2" />
                  Crear Cuenta Gratuita
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )}
          </div>

          <p className="text-blue-200/60 text-sm mt-6">
            Comienza en menos de 30 segundos • Sin costo • Cancela cuando quieras
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;