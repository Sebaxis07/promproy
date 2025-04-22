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
  FaChevronDown,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const SubjectList = () => {
  const { subjects, loading, fetchSubjects, calculateWeightedAverage } = useContext(SubjectContext);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'passing', 'failing'
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [semesterFilter, setSemesterFilter] = useState('all');
  
  // Extraer los semestres disponibles de las asignaturas
  const availableSemesters = useMemo(() => {
    if (!subjects || !subjects.length) return ['all'];
    
    const semesters = new Set(['all']);
    subjects.forEach(subject => {
      if (subject.semester) {
        semesters.add(subject.semester);
      }
    });
    
    return Array.from(semesters);
  }, [subjects]);

  // Cargar asignaturas al inicio
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Función para actualizar datos manualmente
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubjects();
    setTimeout(() => setRefreshing(false), 800); // Dar tiempo visual para la animación
  };

  // Filtrar y ordenar asignaturas
  useEffect(() => {
    if (!Array.isArray(subjects)) return;
    
    let result = [...subjects];
    
    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter(subject => 
        (subject.name && subject.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subject.teacher && subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subject.code && subject.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrar por estado (aprobando/reprobando)
    if (filterStatus !== 'all') {
      result = result.filter(subject => {
        try {
          const { passing } = calculateWeightedAverage(subject._id);
          return filterStatus === 'passing' ? passing : !passing;
        } catch (error) {
          console.error(`Error al calcular promedio para ${subject._id}:`, error);
          return false;
        }
      });
    }
    
    // Filtrar por semestre
    if (semesterFilter !== 'all') {
      result = result.filter(subject => subject.semester === semesterFilter);
    }
    
    // Ordenar
    result.sort((a, b) => {
      if (sortConfig.key === 'average') {
        const avgA = calculateWeightedAverage(a._id).average || 0;
        const avgB = calculateWeightedAverage(b._id).average || 0;
        return sortConfig.direction === 'asc' ? avgA - avgB : avgB - avgA;
      } else if (sortConfig.key === 'completion') {
        const completionA = (a.grades?.length || 0) / (a.evaluations?.length || 1);
        const completionB = (b.grades?.length || 0) / (b.evaluations?.length || 1);
        return sortConfig.direction === 'asc' ? completionA - completionB : completionB - completionA;
      } else if (sortConfig.key === 'date') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
        if (!a[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (!b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        
        if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
          return sortConfig.direction === 'asc' 
            ? a[sortConfig.key].localeCompare(b[sortConfig.key]) 
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        }
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
    
    setFilteredSubjects(result);
  }, [subjects, searchTerm, sortConfig, calculateWeightedAverage, filterStatus, semesterFilter]);

  // Manejar cambio de ordenamiento
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calcular estadísticas globales
  const stats = useMemo(() => {
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return { total: 0, passing: 0, failing: 0, averageGrade: 0 };
    }

    let passingCount = 0;
    let totalAverage = 0;
    let validSubjects = 0;

    subjects.forEach(subject => {
      try {
        const { average, passing } = calculateWeightedAverage(subject._id);
        if (!isNaN(average)) {
          totalAverage += average;
          validSubjects++;
          if (passing) passingCount++;
        }
      } catch (error) {
        console.error(`Error calculando estadísticas para ${subject._id}:`, error);
      }
    });

    return {
      total: subjects.length,
      passing: passingCount,
      failing: subjects.length - passingCount,
      averageGrade: validSubjects > 0 ? (totalAverage / validSubjects).toFixed(1) : '0.0'
    };
  }, [subjects, calculateWeightedAverage]);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera con estadísticas */}
        <div className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl shadow-xl mb-8 overflow-hidden">
          <div className="px-6 py-6 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <FaBook className="mr-3" />
                  Panel de Asignaturas
                </h1>
                <p className="text-indigo-200 mt-1">Gestiona tus cursos y calificaciones según normativa chilena</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2 bg-indigo-600 bg-opacity-70 hover:bg-opacity-100 text-white rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors"
                >
                  <FaSyncAlt className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Actualizando...' : 'Actualizar'}
                </button>
                
                <Link 
                  to="/subjects/new" 
                  className="px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50 flex items-center shadow-sm transition-colors"
                >
                  <FaPlus className="mr-2" /> Nueva Asignatura
                </Link>
              </div>
            </div>
            
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-200 text-sm font-medium">Total Asignaturas</p>
                    <p className="text-white text-2xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <FaBook className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-200 text-sm font-medium">Aprobando</p>
                    <p className="text-white text-2xl font-bold mt-1">{stats.passing}</p>
                  </div>
                  <div className="p-2 bg-green-400 bg-opacity-20 rounded-lg">
                    <FaCheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-200 text-sm font-medium">En Riesgo</p>
                    <p className="text-white text-2xl font-bold mt-1">{stats.failing}</p>
                  </div>
                  <div className="p-2 bg-red-400 bg-opacity-20 rounded-lg">
                    <FaTimesCircle className="h-5 w-5 text-red-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-200 text-sm font-medium">Promedio General</p>
                    <p className="text-white text-2xl font-bold mt-1">{stats.averageGrade}</p>
                  </div>
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <FaChartBar className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel principal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Buscar asignatura, profesor o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium flex items-center hover:bg-gray-50 transition-colors"
                >
                  <FaFilter className="mr-2" />
                  Filtros {showFilters ? <FaChevronDown className="ml-1" /> : <FaChevronDown className="ml-1" />}
                </button>
                
                <button 
                  onClick={() => handleSort('name')}
                  className={`px-3 py-2 border ${sortConfig.key === 'name' ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-gray-300 text-gray-700'} rounded-lg text-sm font-medium flex items-center hover:bg-gray-50 transition-colors`}
                >
                  Nombre
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' 
                      ? <FaSortAmountUp className="ml-1" /> 
                      : <FaSortAmountDown className="ml-1" />
                  )}
                </button>
                
                <button 
                  onClick={() => handleSort('average')}
                  className={`px-3 py-2 border ${sortConfig.key === 'average' ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-gray-300 text-gray-700'} rounded-lg text-sm font-medium flex items-center hover:bg-gray-50 transition-colors`}
                >
                  Promedio
                  {sortConfig.key === 'average' && (
                    sortConfig.direction === 'asc' 
                      ? <FaSortAmountUp className="ml-1" /> 
                      : <FaSortAmountDown className="ml-1" />
                  )}
                </button>
                
                <Link 
                  to="/subjects/new" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm transition-colors"
                >
                  <FaPlus className="mr-2" /> Nueva Asignatura
                </Link>
              </div>
            </div>
            
            {/* Panel de filtros expandible */}
            {showFilters && (
              <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Todos</option>
                      <option value="passing">Aprobando</option>
                      <option value="failing">En riesgo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                      value={semesterFilter}
                      onChange={(e) => setSemesterFilter(e.target.value)}
                    >
                      {availableSemesters.map(semester => (
                        <option key={semester} value={semester}>
                          {semester === 'all' ? 'Todos' : semester}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                    <div className="flex space-x-2">
                      <select 
                        className="flex-grow border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                        value={sortConfig.key}
                        onChange={(e) => setSortConfig({key: e.target.value, direction: 'desc'})}
                      >
                        <option value="name">Nombre</option>
                        <option value="average">Promedio</option>
                        <option value="completion">Completitud</option>
                        <option value="date">Fecha de creación</option>
                      </select>
                      <button
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-white transition-all"
                        onClick={() => setSortConfig(prev => ({...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc'}))}
                        aria-label={sortConfig.direction === 'asc' ? "Ordenar descendente" : "Ordenar ascendente"}
                      >
                        {sortConfig.direction === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => {
                      setFilterStatus('all');
                      setSemesterFilter('all');
                      setSortConfig({ key: 'name', direction: 'asc' });
                      setSearchTerm('');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
            
            {/* Resultados - Estados de carga y filtros */}
            {loading || refreshing ? (
              <div className="text-center py-20">
                <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600 font-medium">{refreshing ? 'Actualizando asignaturas...' : 'Cargando asignaturas...'}</p>
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
                {searchTerm || filterStatus !== 'all' || semesterFilter !== 'all' ? (
                  <>
                    <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                      <FaSearch className="h-10 w-10 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">No se encontraron resultados</h3>
                    <p className="text-gray-600 mb-4">No hay asignaturas que coincidan con los criterios de búsqueda</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                        setSemesterFilter('all');
                      }}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition"
                    >
                      Limpiar filtros
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <FaBook className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">No tienes asignaturas registradas</h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">Comienza tu gestión académica creando tu primera asignatura para llevar un control de tus calificaciones</p>
                    <Link 
                      to="/subjects/new" 
                      className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
                    >
                      <FaPlus className="mr-2" /> Crear Asignatura
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Contador de resultados */}
                <div className="text-sm text-gray-500 mb-4">
                  Mostrando <span className="font-medium">{filteredSubjects.length}</span> de <span className="font-medium">{subjects.length}</span> asignaturas
                </div>
                
                {/* Cuadrícula de asignaturas */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSubjects.map((subject) => {
                    const { average, passing } = calculateWeightedAverage(subject._id);
                    const totalGrades = subject.grades?.length || 0;
                    const totalEvaluations = subject.evaluations?.length || 0;
                    const completionPercentage = totalEvaluations > 0 
                      ? Math.round((totalGrades / totalEvaluations) * 100) 
                      : 0;
                    
                    // Determinar el color de fondo según el estado
                    const cardGradient = passing 
                      ? 'from-green-500 to-green-700'
                      : 'from-red-500 to-red-700';
                    
                    return (
                      <div 
                        key={subject._id} 
                        className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden group"
                      >
                        {/* Cabecera con promedio */}
                        <div className={`bg-gradient-to-r ${cardGradient} px-5 py-4 relative`}>
                          <div className="absolute top-0 right-0 mt-4 mr-4">
                            <div className={`w-16 h-16 rounded-full backdrop-blur-lg bg-white bg-opacity-20 flex items-center justify-center border-2 border-white border-opacity-30`}>
                              <span className="text-white font-bold text-2xl">{average.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <div className="text-white pr-16">
                            <h2 className="text-xl font-bold mb-1 truncate">{subject.name}</h2>
                            
                            {subject.code && (
                              <p className="text-white text-opacity-80 text-sm mb-1">
                                Código: {subject.code}
                              </p>
                            )}
                            
                            {subject.semester && (
                              <div className="inline-block bg-white bg-opacity-20 rounded-full px-2.5 py-0.5 text-xs font-medium text-white mt-1">
                                {subject.semester}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-5">
                          {subject.teacher && (
                            <div className="flex items-center mb-4">
                              <div className="p-2 rounded-full bg-indigo-50 mr-3">
                                <FaGraduationCap className="text-indigo-500" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Profesor</p>
                                <p className="text-gray-800 font-medium">{subject.teacher}</p>
                              </div>
                            </div>
                          )}
                          
                          {subject.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{subject.description}</p>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center mb-1">
                                <FaClipboardList className="text-indigo-500 mr-2" />
                                <p className="text-xs text-gray-500 font-medium">Evaluaciones</p>
                              </div>
                              <p className="text-gray-700">
                                <span className="font-bold">{totalGrades}</span>/<span className="text-gray-500">{totalEvaluations}</span>
                              </p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center mb-1">
                                <FaCalendarAlt className="text-indigo-500 mr-2" />
                                <p className="text-xs text-gray-500 font-medium">Creado</p>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {new Date(subject.createdAt).toLocaleDateString('es-CL', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {/* Barra de progreso */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progreso</span>
                              <span>{completionPercentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  completionPercentage >= 80 ? 'bg-green-500' :
                                  completionPercentage >= 50 ? 'bg-blue-500' :
                                  completionPercentage > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                                }`}
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Alerta si no hay evaluaciones configuradas */}
                          {totalEvaluations === 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4 flex items-start">
                              <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                              <p className="text-amber-700 text-xs">Esta asignatura no tiene evaluaciones configuradas</p>
                            </div>
                          )}
                          
                          {/* Botones de acción */}
                          <div className="flex justify-between pt-4 border-t border-gray-100">
                            <Link 
                              to={`/subjects/${subject._id}`} 
                              className="flex-1 mr-2 py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                              <FaEye className="mr-2" /> Ver Detalle
                            </Link>
                            <Link 
                              to={`/subjects/edit/${subject._id}`} 
                              className="flex-1 ml-2 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                              <FaEdit className="mr-2" /> Editar
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          {/* Footer */}
          
        </div>
        
        {/* Botón flotante para móviles */}
        <div className="md:hidden fixed bottom-6 right-6">
          <Link 
            to="/subjects/new"
            className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all"
            aria-label="Nueva asignatura"
          >
            <FaPlus size="1.5em" />
          </Link>
        </div>
      </div>
      
      {/* Estilos globales */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SubjectList;