// src/components/Subject/SubjectList.jsx
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SubjectContext } from '../../context/SubjectContext';
import { 
  FaPlus, 
  FaEdit, 
  FaChartBar, 
  FaBook, 
  FaGraduationCap, 
  FaSearch, 
  FaSortAmountDown, 
  FaSortAmountUp, 
  FaFilter, 
  FaEye,
  FaCalendarAlt,
  FaClipboardList,
  FaExclamationTriangle,
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaFire,
  FaChevronDown,
  FaChevronUp,
  FaBookOpen,
  FaClock,
  FaPercentage,
  FaStar,
  FaAward
} from 'react-icons/fa';

const SubjectList = () => {
  const { subjects, loading, fetchSubjects, calculateWeightedAverage } = useContext(SubjectContext);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Extraer los semestres disponibles
  const availableSemesters = useMemo(() => {
    if (!subjects || !subjects.length) return ['all'];
    const semesters = new Set(['all']);
    subjects.forEach(subject => {
      if (subject.semester) semesters.add(subject.semester);
    });
    return Array.from(semesters);
  }, [subjects]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubjects();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filtrar y ordenar asignaturas
  useEffect(() => {
    if (!Array.isArray(subjects)) return;
    
    let result = [...subjects];
    
    if (searchTerm) {
      result = result.filter(subject => 
        (subject.name && subject.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subject.teacher && subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subject.code && subject.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(subject => {
        try {
          const { passing } = calculateWeightedAverage(subject._id);
          return filterStatus === 'passing' ? passing : !passing;
        } catch (error) {
          return false;
        }
      });
    }
    
    if (semesterFilter !== 'all') {
      result = result.filter(subject => subject.semester === semesterFilter);
    }
    
    result.sort((a, b) => {
      if (sortConfig.key === 'average') {
        const avgA = calculateWeightedAverage(a._id).average || 0;
        const avgB = calculateWeightedAverage(b._id).average || 0;
        return sortConfig.direction === 'asc' ? avgA - avgB : avgB - avgA;
      } else if (sortConfig.key === 'completion') {
        const completionA = (a.grades?.length || 0) / (a.evaluations?.length || 1);
        const completionB = (b.grades?.length || 0) / (b.evaluations?.length || 1);
        return sortConfig.direction === 'asc' ? completionA - completionB : completionB - completionA;
      } else {
        if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
          return sortConfig.direction === 'asc' 
            ? a[sortConfig.key].localeCompare(b[sortConfig.key]) 
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        }
        return 0;
      }
    });
    
    setFilteredSubjects(result);
  }, [subjects, searchTerm, sortConfig, calculateWeightedAverage, filterStatus, semesterFilter]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calcular estadísticas avanzadas
  const stats = useMemo(() => {
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return { total: 0, passing: 0, failing: 0, averageGrade: 0, excellence: 0, completion: 0 };
    }

    let passingCount = 0;
    let excellenceCount = 0; // >= 6.0
    let totalAverage = 0;
    let totalCompletion = 0;
    let validSubjects = 0;

    subjects.forEach(subject => {
      try {
        const { average, passing } = calculateWeightedAverage(subject._id);
        const completion = (subject.grades?.length || 0) / (subject.evaluations?.length || 1);
        
        if (!isNaN(average)) {
          totalAverage += average;
          totalCompletion += completion;
          validSubjects++;
          if (passing) passingCount++;
          if (average >= 6.0) excellenceCount++;
        }
      } catch (error) {
        console.error(`Error calculando estadísticas:`, error);
      }
    });

    return {
      total: subjects.length,
      passing: passingCount,
      failing: subjects.length - passingCount,
      excellence: excellenceCount,
      averageGrade: validSubjects > 0 ? (totalAverage / validSubjects).toFixed(1) : '0.0',
      completion: validSubjects > 0 ? Math.round((totalCompletion / validSubjects) * 100) : 0
    };
  }, [subjects, calculateWeightedAverage]);

  const getGradeColor = (average) => {
    if (average >= 6.5) return 'from-blue-500 to-blue-700';
    if (average >= 5.5) return 'from-blue-600 to-slate-700';
    if (average >= 4.0) return 'from-slate-600 to-slate-800';
    return 'from-slate-700 to-slate-900';
  };

  const getGradeIcon = (average) => {
    if (average >= 6.5) return <FaTrophy className="h-4 w-4" />;
    if (average >= 5.5) return <FaStar className="h-4 w-4" />;
    if (average >= 4.0) return <FaCheckCircle className="h-4 w-4" />;
    return <FaExclamationTriangle className="h-4 w-4" />;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Hero Section con Partículas */}
        <div className="relative overflow-hidden">
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
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Mejorado */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
              <div className="mb-8 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-2xl">
                    <FaBookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      Panel Académico
                    </h1>
                    <p className="text-blue-200/80 text-xl">Gestión profesional de asignaturas</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="group px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-xl transition-all duration-300 flex items-center shadow-lg"
                >
                  <FaSyncAlt className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                  {refreshing ? 'Actualizando' : 'Actualizar'}
                </button>
                
                <Link 
                  to="/subjects/new" 
                  className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <FaPlus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  Nueva Asignatura
                </Link>
              </div>
            </div>

            {/* Estadísticas Elegantes */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              {[
                { label: 'Total', value: stats.total, icon: FaBook, gradient: 'from-blue-500 to-blue-600' },
                { label: 'Aprobando', value: stats.passing, icon: FaCheckCircle, gradient: 'from-blue-600 to-slate-700' },
                { label: 'En Riesgo', value: stats.failing, icon: FaTimesCircle, gradient: 'from-slate-600 to-slate-800' },
                { label: 'Excelencia', value: stats.excellence, icon: FaTrophy, gradient: 'from-blue-400 to-blue-500' },
                { label: 'Promedio', value: stats.averageGrade, icon: FaChartBar, gradient: 'from-slate-500 to-blue-600' },
                { label: 'Progreso', value: `${stats.completion}%`, icon: FaPercentage, gradient: 'from-blue-500 to-slate-600' }
              ].map((stat, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-blue-200/70 text-sm font-medium">{stat.label}</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Barra de Herramientas */}
            <div className="p-6 border-b border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Búsqueda Profesional */}
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-blue-300/70" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:bg-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    placeholder="Buscar asignatura, profesor o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Controles */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-xl backdrop-blur-sm border transition-all duration-300 flex items-center ${
                      showFilters 
                        ? 'bg-blue-500/20 border-blue-400/50 text-blue-300' 
                        : 'bg-white/5 border-white/20 text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    <FaFilter className="mr-2 h-4 w-4" />
                    Filtros
                    {showFilters ? <FaChevronUp className="ml-2 h-3 w-3" /> : <FaChevronDown className="ml-2 h-3 w-3" />}
                  </button>
                  
                  <button 
                    onClick={() => handleSort('name')}
                    className={`px-4 py-3 rounded-xl backdrop-blur-sm border transition-all duration-300 flex items-center ${
                      sortConfig.key === 'name' 
                        ? 'bg-blue-500/20 border-blue-400/50 text-blue-300' 
                        : 'bg-white/5 border-white/20 text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    Nombre
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' 
                        ? <FaSortAmountUp className="ml-2 h-3 w-3" /> 
                        : <FaSortAmountDown className="ml-2 h-3 w-3" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleSort('average')}
                    className={`px-4 py-3 rounded-xl backdrop-blur-sm border transition-all duration-300 flex items-center ${
                      sortConfig.key === 'average' 
                        ? 'bg-blue-500/20 border-blue-400/50 text-blue-300' 
                        : 'bg-white/5 border-white/20 text-blue-200 hover:bg-white/10'
                    }`}
                  >
                    Promedio
                    {sortConfig.key === 'average' && (
                      sortConfig.direction === 'asc' 
                        ? <FaSortAmountUp className="ml-2 h-3 w-3" /> 
                        : <FaSortAmountDown className="ml-2 h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Panel de Filtros */}
              {showFilters && (
                <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Estado</label>
                      <select 
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all backdrop-blur-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all" className="bg-slate-800">Todos</option>
                        <option value="passing" className="bg-slate-800">Aprobando</option>
                        <option value="failing" className="bg-slate-800">En riesgo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Semestre</label>
                      <select 
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all backdrop-blur-sm"
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                      >
                        {availableSemesters.map(semester => (
                          <option key={semester} value={semester} className="bg-slate-800">
                            {semester === 'all' ? 'Todos' : semester}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">Ordenar por</label>
                      <select 
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all backdrop-blur-sm"
                        value={sortConfig.key}
                        onChange={(e) => setSortConfig({key: e.target.value, direction: 'desc'})}
                      >
                        <option value="name" className="bg-slate-800">Nombre</option>
                        <option value="average" className="bg-slate-800">Promedio</option>
                        <option value="completion" className="bg-slate-800">Completitud</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setFilterStatus('all');
                          setSemesterFilter('all');
                          setSortConfig({ key: 'name', direction: 'asc' });
                          setSearchTerm('');
                        }}
                        className="w-full px-4 py-3 bg-slate-600/20 border border-slate-400/50 text-slate-300 rounded-lg hover:bg-slate-500/30 transition-all duration-200"
                      >
                        Limpiar Filtros
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contenido Principal */}
            <div className="p-6">
              {loading || refreshing ? (
                <div className="text-center py-20">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-slate-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                  </div>
                  <p className="text-blue-200 font-medium text-lg">{refreshing ? 'Actualizando datos...' : 'Cargando asignaturas...'}</p>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-20">
                  {searchTerm || filterStatus !== 'all' || semesterFilter !== 'all' ? (
                    <div>
                      <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaSearch className="h-12 w-12 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Sin resultados</h3>
                      <p className="text-blue-200/80 mb-6 max-w-md mx-auto">No encontramos asignaturas que coincidan con tus criterios</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilterStatus('all');
                          setSemesterFilter('all');
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Limpiar Filtros
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <FaBookOpen className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">¡Comienza tu gestión académica!</h3>
                      <p className="text-blue-200/80 mb-6 max-w-md mx-auto">Crea tu primera asignatura y empieza a organizar tus calificaciones profesionalmente</p>
                      <Link 
                        to="/subjects/new" 
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                      >
                        <FaPlus className="mr-2 h-5 w-5" />
                        Crear Primera Asignatura
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Contador de Resultados */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-blue-200/80">
                      Mostrando <span className="font-bold text-white">{filteredSubjects.length}</span> de <span className="font-bold text-white">{subjects.length}</span> asignaturas
                    </p>
                  </div>
                  
                  {/* Grid de Asignaturas */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSubjects.map((subject) => {
                      const { average, passing } = calculateWeightedAverage(subject._id);
                      const totalGrades = subject.grades?.length || 0;
                      const totalEvaluations = subject.evaluations?.length || 0;
                      const completionPercentage = totalEvaluations > 0 ? Math.round((totalGrades / totalEvaluations) * 100) : 0;
                      const isHovered = hoveredCard === subject._id;
                      
                      return (
                        <div 
                          key={subject._id}
                          className={`group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden shadow-xl ${
                            isHovered ? 'transform scale-105 shadow-2xl' : 'hover:transform hover:scale-102'
                          }`}
                          onMouseEnter={() => setHoveredCard(subject._id)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          {/* Header con Gradiente Según Nota */}
                          <div className={`relative p-6 bg-gradient-to-r ${getGradeColor(average)} overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            
                            <div className="relative z-10 flex items-start justify-between">
                              <div className="flex-1 mr-4">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{subject.name}</h3>
                                {subject.code && (
                                  <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-white mb-2">
                                    {subject.code}
                                  </div>
                                )}
                                {subject.semester && (
                                  <div className="inline-block bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-white/90">
                                    {subject.semester}
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-white/30 shadow-xl">
                                  <div className="text-white text-2xl font-bold">{average.toFixed(1)}</div>
                                  <div className="text-white/80 text-xs flex items-center justify-center mt-1">
                                    {getGradeIcon(average)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contenido */}
                          <div className="p-6 space-y-6">
                            {/* Información del Profesor */}
                            {subject.teacher && (
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                  <FaGraduationCap className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-xs text-blue-300 font-medium">Profesor</p>
                                  <p className="text-white font-medium">{subject.teacher}</p>
                                </div>
                              </div>
                            )}

                            {/* Descripción */}
                            {subject.description && (
                              <p className="text-blue-200/80 text-sm line-clamp-2">{subject.description}</p>
                            )}

                            {/* Métricas */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <FaClipboardList className="h-4 w-4 text-blue-400" />
                                  <span className="text-xs text-blue-300 font-medium">Evaluaciones</span>
                                </div>
                                <p className="text-white font-bold">{totalGrades}/{totalEvaluations}</p>
                              </div>
                              
                              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                  <FaClock className="h-4 w-4 text-blue-400" />
                                  <span className="text-xs text-blue-300 font-medium">Progreso</span>
                                </div>
                                <p className="text-white font-bold">{completionPercentage}%</p>
                              </div>
                            </div>

                            {/* Barra de Progreso */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-blue-300">Completitud</span>
                                <span className="text-white font-medium">{completionPercentage}%</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${
                                    completionPercentage >= 80 ? 'from-blue-400 to-blue-500' :
                                    completionPercentage >= 50 ? 'from-blue-500 to-blue-600' :
                                    completionPercentage > 0 ? 'from-slate-400 to-slate-500' : 'from-slate-600 to-slate-700'
                                  } transition-all duration-1000 ease-out`}
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                            </div>

                            {/* Alertas */}
                            {totalEvaluations === 0 && (
                              <div className="bg-slate-500/10 border border-slate-400/30 rounded-xl p-3 flex items-center space-x-3">
                                <FaExclamationTriangle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                <p className="text-slate-300 text-sm">Sin evaluaciones configuradas</p>
                              </div>
                            )}

                            {/* Botones de Acción */}
                            <div className="flex space-x-3 pt-4 border-t border-white/10">
                              <Link 
                                to={`/subjects/${subject._id}`} 
                                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                              >
                                <FaEye className="h-4 w-4" />
                                <span>Ver Detalle</span>
                              </Link>
                              <Link 
                                to={`/subjects/edit/${subject._id}`} 
                                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl font-medium border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center space-x-2"
                              >
                                <FaEdit className="h-4 w-4" />
                                <span>Editar</span>
                              </Link>
                            </div>
                          </div>

                          {/* Efectos de Hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Botón Flotante */}
        <div className="fixed bottom-8 right-8 z-50">
          <Link 
            to="/subjects/new"
            className="group w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:rotate-90"
          >
            <FaPlus className="h-6 w-6 transition-transform duration-300" />
          </Link>
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

export default SubjectList;