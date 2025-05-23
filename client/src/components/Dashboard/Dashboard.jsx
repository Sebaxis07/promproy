import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SubjectContext } from '../../context/SubjectContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { 
  FaPlus, 
  FaChartLine, 
  FaBook, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCalendarAlt,
  FaChartBar,
  FaGraduationCap,
  FaClipboardList,
  FaExclamationTriangle,
  FaTrophy,
  FaFire,
  FaStar,
  FaBookOpen,
  FaAward,
  FaClock,
  FaBell,
  FaLightbulb,
  FaTasks,
  FaPlay,
  FaPause,
  FaEdit,
  FaEye,
  FaSync,
  FaCalendarPlus,
  FaChevronRight,
  FaBrain,
  FaRocket,
  FaThumbsUp,
  FaChevronDown,
  FaChevronUp,
  FaUserGraduate,
  FaBullseye
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { subjects, loading, fetchSubjects, calculateWeightedAverage } = useContext(SubjectContext);
  
  const [refreshing, setRefreshing] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(0);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Timer de estudio
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudyTimer(timer => timer + 1);
      }, 1000);
    } else if (!isTimerRunning && studyTimer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, studyTimer]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchSubjects();
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  // Calcular estadísticas avanzadas REALES
  const stats = useMemo(() => {
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return {
        totalSubjects: 0,
        passingSubjects: 0,
        failingSubjects: 0,
        excellence: 0,
        overallAverage: 0,
        riskSubjects: [],
        topPerformers: [],
        subjectPerformance: [],
        totalGrades: 0,
        averageGradesPerSubject: 0,
        recentActivity: []
      };
    }

    let totalAverage = 0;
    let validSubjects = 0;
    let passingSubjects = 0;
    let excellence = 0;
    let totalGrades = 0;
    const subjectPerformance = [];
    const recentActivity = [];

    subjects.forEach(subject => {
      if (subject && subject._id) {
        try {
          const { average, passing } = calculateWeightedAverage(subject._id);
          const gradesCount = subject.grades?.length || 0;
          totalGrades += gradesCount;
          
          if (typeof average === 'number' && !isNaN(average)) {
            totalAverage += average;
            validSubjects++;
            
            subjectPerformance.push({
              name: subject.name,
              average: average,
              passing: passing,
              grades: gradesCount,
              teacher: subject.teacher,
              semester: subject.semester,
              id: subject._id
            });
            
            if (passing) passingSubjects++;
            if (average >= 6.0) excellence++;
          }

          // Actividad reciente basada en fechas reales
          if (subject.updatedAt) {
            const updateDate = new Date(subject.updatedAt);
            const daysDiff = Math.floor((new Date() - updateDate) / (1000 * 60 * 60 * 24));
            if (daysDiff <= 7) {
              recentActivity.push({
                subject: subject.name,
                action: gradesCount > 0 ? 'Calificaciones actualizadas' : 'Asignatura creada',
                date: updateDate,
                daysAgo: daysDiff
              });
            }
          }
        } catch (error) {
          console.error(`Error calculando promedio:`, error);
        }
      }
    });

    const overallAverage = validSubjects > 0 ? totalAverage / validSubjects : 0;
    const riskSubjects = subjectPerformance.filter(s => !s.passing).sort((a, b) => a.average - b.average);
    const topPerformers = subjectPerformance.filter(s => s.average >= 6.0).sort((a, b) => b.average - a.average);
    const averageGradesPerSubject = validSubjects > 0 ? Math.round(totalGrades / validSubjects) : 0;

    return {
      totalSubjects: subjects.length,
      passingSubjects,
      failingSubjects: subjects.length - passingSubjects,
      excellence,
      overallAverage: overallAverage.toFixed(1),
      riskSubjects,
      topPerformers,
      subjectPerformance,
      totalGrades,
      averageGradesPerSubject,
      recentActivity: recentActivity.sort((a, b) => b.date - a.date)
    };
  }, [subjects, calculateWeightedAverage]);

  // Datos REALES para gráficos
  const radarData = stats.subjectPerformance.slice(0, 6).map(subject => ({
    subject: subject.name.length > 12 ? subject.name.substring(0, 12) + '...' : subject.name,
    nota: Number(subject.average.toFixed(1)),
    fullMark: 7
  }));

  const performanceData = [
    { name: 'Excelente (≥6.0)', value: stats.excellence, color: '#3B82F6' },
    { name: 'Aprobando (4.0-5.9)', value: stats.passingSubjects - stats.excellence, color: '#10B981' },
    { name: 'En Riesgo (<4.0)', value: stats.failingSubjects, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const gradeDistributionData = stats.subjectPerformance.map(subject => ({
    name: subject.name.length > 10 ? subject.name.substring(0, 10) + '...' : subject.name,
    promedio: Number(subject.average.toFixed(1)),
    evaluaciones: subject.grades
  }));

  // Insights inteligentes REALES
  const insights = useMemo(() => {
    const realInsights = [];

    if (stats.topPerformers.length > 0) {
      realInsights.push({
        icon: <FaTrophy />,
        title: "Tu Fortaleza Académica",
        message: `Excelente rendimiento en ${stats.topPerformers[0].name} con ${stats.topPerformers[0].average.toFixed(1)}. ${stats.topPerformers.length > 1 ? `Y ${stats.topPerformers.length - 1} materias más con excelencia.` : ''}`,
        type: "success"
      });
    }

    if (stats.riskSubjects.length > 0) {
      realInsights.push({
        icon: <FaExclamationTriangle />,
        title: "Área de Oportunidad",
        message: `${stats.riskSubjects[0].name} necesita atención (Promedio: ${stats.riskSubjects[0].average.toFixed(1)}). ${stats.riskSubjects.length > 1 ? `Y ${stats.riskSubjects.length - 1} materias más en riesgo.` : ''}`,
        type: "warning"
      });
    }

    if (stats.totalGrades > 0) {
      const neededForTarget = Math.max(0, (5.5 * stats.totalSubjects) - (parseFloat(stats.overallAverage) * stats.totalSubjects));
      realInsights.push({
        icon: <FaBullseye />,
        title: "Análisis Predictivo",
        message: `Con ${stats.totalGrades} evaluaciones registradas, tu promedio actual es ${stats.overallAverage}. ${neededForTarget > 0 ? `Necesitas ${neededForTarget.toFixed(1)} puntos adicionales para alcanzar 5.5.` : '¡Estás por encima del objetivo!'}`,
        type: "info"
      });
    }

    if (stats.recentActivity.length > 0) {
      realInsights.push({
        icon: <FaFire />,
        title: "Actividad Reciente",
        message: `${stats.recentActivity.length} actualizaciones en los últimos 7 días. Última actividad: ${stats.recentActivity[0].subject}.`,
        type: "info"
      });
    }

    if (realInsights.length === 0) {
      realInsights.push({
        icon: <FaRocket />,
        title: "¡Comienza tu Journey!",
        message: "Agrega asignaturas y calificaciones para ver insights personalizados sobre tu rendimiento académico.",
        type: "info"
      });
    }

    return realInsights;
  }, [stats]);

  // Próximas acciones basadas en datos reales
  const nextActions = useMemo(() => {
    const actions = [];

    if (stats.subjectPerformance.length === 0) {
      actions.push({
        title: "Crear primera asignatura",
        description: "Comienza tu gestión académica",
        link: "/subjects/new",
        priority: "high",
        icon: <FaPlus />
      });
    }

    stats.riskSubjects.slice(0, 2).forEach(subject => {
      actions.push({
        title: `Revisar ${subject.name}`,
        description: `Promedio actual: ${subject.average.toFixed(1)}`,
        link: `/subjects/${subject.id}`,
        priority: "high",
        icon: <FaExclamationTriangle />
      });
    });

    if (stats.subjectPerformance.some(s => s.grades === 0)) {
      const subjectWithoutGrades = stats.subjectPerformance.find(s => s.grades === 0);
      actions.push({
        title: `Agregar evaluaciones a ${subjectWithoutGrades.name}`,
        description: "Sin calificaciones registradas",
        link: `/subjects/${subjectWithoutGrades.id}`,
        priority: "medium",
        icon: <FaClipboardList />
      });
    }

    return actions.slice(0, 4);
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200 text-lg">Cargando Academic Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Partículas de Fondo */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header con Insights Inteligentes */}
          <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                      <FaBrain className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        Academic Command Center
                      </h1>
                      <p className="text-blue-200/80 text-lg">
                        ¡Hola {user?.name}! Analítica y productividad académica
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={refreshData}
                    disabled={refreshing}
                    className="group px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-xl transition-all duration-300 flex items-center"
                  >
                    <FaSync className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                    {refreshing ? 'Actualizando' : 'Refresh'}
                  </button>
                  
                  <Link 
                    to="/subjects/new" 
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Nueva Asignatura
                  </Link>
                </div>
              </div>

              {/* Insights Carousel */}
              {insights.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <FaLightbulb className="mr-2 text-yellow-400" />
                      Insights Inteligentes
                    </h3>
                    <div className="flex space-x-2">
                      {insights.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedInsight(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            selectedInsight === index ? 'bg-blue-400' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      insights[selectedInsight].type === 'success' ? 'bg-green-500/20 text-green-400' :
                      insights[selectedInsight].type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {insights[selectedInsight].icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{insights[selectedInsight].title}</h4>
                      <p className="text-blue-200/80">{insights[selectedInsight].message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas Principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Asignaturas', value: stats.totalSubjects, icon: FaBook, gradient: 'from-blue-500 to-blue-600' },
              { label: 'Aprobando', value: stats.passingSubjects, icon: FaCheckCircle, gradient: 'from-green-500 to-green-600' },
              { label: 'En Riesgo', value: stats.failingSubjects, icon: FaTimesCircle, gradient: 'from-red-500 to-red-600' },
              { label: 'Excelencia', value: stats.excellence, icon: FaTrophy, gradient: 'from-yellow-500 to-yellow-600' },
              { label: 'Promedio', value: stats.overallAverage, icon: FaChartLine, gradient: 'from-purple-500 to-purple-600' },
              { label: 'Evaluaciones', value: stats.totalGrades, icon: FaClipboardList, gradient: 'from-pink-500 to-pink-600' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-blue-200/70 text-sm font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Layout Principal: Analytics + Productividad */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LADO IZQUIERDO: ANALYTICS */}
            <div className="space-y-6">
              {/* Gráfico de Radar - Rendimiento por Materia */}
              {radarData.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FaChartBar className="mr-2 text-blue-400" />
                    Rendimiento por Asignatura
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#475569" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#CBD5E1', fontSize: 12 }} />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 7]} 
                          tick={{ fill: '#CBD5E1', fontSize: 10 }}
                          tickCount={4}
                        />
                        <Radar
                          name="Promedio"
                          dataKey="nota"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Distribución de Rendimiento */}
              {performanceData.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FaAward className="mr-2 text-blue-400" />
                    Distribución de Rendimiento
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#f1f5f9'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Promedios por Asignatura */}
              {gradeDistributionData.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FaChartLine className="mr-2 text-blue-400" />
                    Promedios Detallados
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#CBD5E1', fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          tick={{ fill: '#CBD5E1' }}
                          domain={[0, 7]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#f1f5f9'
                          }} 
                        />
                        <Bar dataKey="promedio" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* LADO DERECHO: PRODUCTIVIDAD */}
            <div className="space-y-6">
              {/* Timer de Estudio */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaClock className="mr-2 text-blue-400" />
                  Cronómetro de Estudio
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-white mb-4">
                    {formatTime(studyTimer)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                        isTimerRunning 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isTimerRunning ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
                      {isTimerRunning ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button
                      onClick={() => {
                        setStudyTimer(0);
                        setIsTimerRunning(false);
                      }}
                      className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      Reiniciar
                    </button>
                  </div>
                </div>
              </div>

              {/* Próximas Acciones */}
              {nextActions.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FaTasks className="mr-2 text-blue-400" />
                    Acciones Recomendadas
                  </h3>
                  <div className="space-y-3">
                    {nextActions.map((action, index) => (
                      <Link
                        key={index}
                        to={action.link}
                        className={`block p-4 rounded-xl border transition-all duration-300 hover:transform hover:scale-105 ${
                          action.priority === 'high' 
                            ? 'bg-red-500/10 border-red-400/30 hover:border-red-400/50' 
                            : 'bg-blue-500/10 border-blue-400/30 hover:border-blue-400/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            action.priority === 'high' ? 'text-red-400' : 'text-blue-400'
                          }`}>
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{action.title}</h4>
                            <p className="text-blue-200/70 text-sm">{action.description}</p>
                          </div>
                          <FaChevronRight className="text-blue-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Actividad Reciente */}
              {stats.recentActivity.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FaFire className="mr-2 text-orange-400" />
                    Actividad Reciente
                  </h3>
                  <div className="space-y-3">
                    {stats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <FaBookOpen className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{activity.subject}</p>
                          <p className="text-blue-200/70 text-sm">{activity.action}</p>
                        </div>
                        <div className="text-xs text-blue-300">
                          {activity.daysAgo === 0 ? 'Hoy' : `${activity.daysAgo}d ago`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acceso Rápido */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaRocket className="mr-2 text-blue-400" />
                  Acceso Rápido
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/subjects"
                    className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl hover:border-blue-400/50 transition-all duration-300 text-center group"
                  >
                    <FaBook className="h-6 w-6 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-white font-medium">Asignaturas</p>
                  </Link>
                  <Link
                    to="/subjects/new"
                    className="p-4 bg-green-500/10 border border-green-400/30 rounded-xl hover:border-green-400/50 transition-all duration-300 text-center group"
                  >
                    <FaPlus className="h-6 w-6 text-green-400 mx-auto mb-2 group-hover:rotate-90 transition-transform" />
                    <p className="text-white font-medium">Nueva</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Dashboard;