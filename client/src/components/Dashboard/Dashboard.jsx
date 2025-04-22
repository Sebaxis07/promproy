import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SubjectContext } from '../../context/SubjectContext';
import { 
  FaPlus, 
  FaChartLine, 
  FaBook, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSearch, 
  FaFilter, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaCalendarAlt,
  FaDownload,
  FaChartBar,
  FaSync,
  FaGraduationCap,
  FaClipboardList,
  FaEye,
  FaPencilAlt,
  FaExclamationTriangle,
  FaTrash,
  FaCog
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { subjects, loading, fetchSubjects, calculateWeightedAverage } = useContext(SubjectContext);
  
  const [refreshing, setRefreshing] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('Todos');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [semesters, setSemesters] = useState(['Todos']);
  
  useEffect(() => {
    if (Array.isArray(subjects) && subjects.length > 0) {
      const uniqueSemesters = ['Todos'];
      subjects.forEach(subject => {
        if (subject && subject.semester && !uniqueSemesters.includes(subject.semester)) {
          uniqueSemesters.push(subject.semester);
        }
      });
      setSemesters(uniqueSemesters.sort((a, b) => {
        if (a === 'Todos') return -1;
        if (b === 'Todos') return 1;
        return b.localeCompare(a); 
      }));
    }
  }, [subjects]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setErrorMessage('');
    
    try {
      await fetchSubjects();
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      setErrorMessage('No se pudieron cargar las asignaturas. Por favor, intenta nuevamente.');
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  }, [fetchSubjects]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (subjects === null || subjects === undefined) {
      console.error("subjects es null o undefined:", subjects);
      setErrorMessage('Los datos de asignaturas no están disponibles');
    } else if (!Array.isArray(subjects)) {
      console.error("subjects no es un array:", typeof subjects, subjects);
      setErrorMessage('Formato de datos incorrecto');
    } else {
      setErrorMessage('');
    }
  }, [subjects]);

  const calculateStats = () => {
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return {
        totalSubjects: 0,
        passingSubjects: 0,
        failingSubjects: 0,
        overallAverage: '0.0',
        pendingAssignments: 0,
        recentlyUpdated: 0,
        averageProgress: 0
      };
    }

    let totalAverage = 0;
    let validSubjects = 0;
    let passingSubjects = 0;
    let failingSubjects = 0;
    let pendingAssignments = 0;
    let recentlyUpdated = 0;
    let totalCredits = 0;
    let earnedCredits = 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    subjects.forEach(subject => {
      if (subject && subject._id) {
        try {
          const { average, passing } = calculateWeightedAverage(subject._id);
          if (typeof average === 'number' && !isNaN(average)) {
            totalAverage += average;
            validSubjects++;
            
            if (passing) {
              passingSubjects++;
              if (subject.credits) {
                earnedCredits += parseInt(subject.credits, 10) || 0;
              }
            } else {
              failingSubjects++;
            }
          }
          
          if (subject.credits) {
            totalCredits += parseInt(subject.credits, 10) || 0;
          }
          
          if (subject.grades) {
            const pendingGrades = subject.grades.filter(grade => 
              grade.dueDate && new Date(grade.dueDate) >= new Date() && !grade.score
            );
            pendingAssignments += pendingGrades.length;
          }
          
          // Verificar si se actualizó recientemente con datos reales
          const updatedAt = subject.updatedAt ? new Date(subject.updatedAt) : null;
          if (updatedAt && updatedAt > oneWeekAgo) {
            recentlyUpdated++;
          }
        } catch (error) {
          console.error(`Error calculando promedio para asignatura ${subject._id}:`, error);
        }
      }
    });

    const averageProgress = totalCredits > 0 ? Math.round((earnedCredits / totalCredits) * 100) : 0;

    return {
      totalSubjects: subjects.length,
      passingSubjects,
      failingSubjects,
      overallAverage: validSubjects > 0 ? (totalAverage / validSubjects).toFixed(1) : '0.0',
      pendingAssignments,
      recentlyUpdated,
      averageProgress
    };
  };

  let stats;
  try {
    stats = calculateStats();
  } catch (error) {
    console.error("Error al calcular estadísticas:", error);
    stats = {
      totalSubjects: 0,
      passingSubjects: 0,
      failingSubjects: 0,
      overallAverage: '0.0',
      pendingAssignments: 0,
      recentlyUpdated: 0,
      averageProgress: 0
    };
  }

  const filteredSubjects = useMemo(() => {
    if (!Array.isArray(subjects)) return [];
    
    return subjects.filter(subject => {
      if (!subject || !subject._id) return false;
      
      // Filtro por búsqueda
      const matchesSearch = !searchTerm || 
        (subject.name && subject.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subject.teacher && subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subject.code && subject.code.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesStatus = true;
      if (filterStatus !== 'all') {
        try {
          const { passing } = calculateWeightedAverage(subject._id);
          matchesStatus = filterStatus === 'passing' ? passing : !passing;
        } catch (error) {
          console.error(`Error al filtrar por estado para ${subject._id}:`, error);
          matchesStatus = false;
        }
      }
      
      const matchesSemester = selectedSemester === 'Todos' || subject.semester === selectedSemester;
      
      return matchesSearch && matchesStatus && matchesSemester;
    });
  }, [subjects, searchTerm, filterStatus, selectedSemester, calculateWeightedAverage]);

  const sortedSubjects = useMemo(() => {
    if (!filteredSubjects || filteredSubjects.length === 0) return [];
    
    return [...filteredSubjects].sort((a, b) => {
      if (!a || !b || !a._id || !b._id) return 0;
      
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'teacher':
          aValue = a.teacher || '';
          bValue = b.teacher || '';
          break;
        case 'semester':
          aValue = a.semester || '';
          bValue = b.semester || '';
          break;
        case 'grades':
          aValue = a.grades ? a.grades.length : 0;
          bValue = b.grades ? b.grades.length : 0;
          break;
        case 'average':
          try {
            aValue = calculateWeightedAverage(a._id).average || 0;
            bValue = calculateWeightedAverage(b._id).average || 0;
          } catch (error) {
            console.error(`Error al ordenar por promedio para ${a._id} o ${b._id}:`, error);
            aValue = 0;
            bValue = 0;
          }
          break;
        default:
          aValue = a.name || '';
          bValue = b.name || '';
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue > bValue ? 1 : -1) 
          : (aValue < bValue ? 1 : -1);
      }
    });
  }, [filteredSubjects, sortField, sortDirection, calculateWeightedAverage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSelectedSemester('Todos');
    setSortField('name');
    setSortDirection('asc');
  };
  
  const exportData = () => {
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return;
    }
    
    const csvData = subjects.map(subject => {
      let average = 0;
      let passing = false;
      
      try {
        if (subject && subject._id) {
          const result = calculateWeightedAverage(subject._id);
          average = result.average || 0;
          passing = result.passing || false;
        }
      } catch (error) {
        console.error(`Error calculando promedio para ${subject?.name || 'asignatura'}:`, error);
      }
      
      return {
        asignatura: subject.name || '',
        codigo: subject.code || '',
        profesor: subject.teacher || '',
        semestre: subject.semester || '',
        creditos: subject.credits || '',
        calificaciones: subject.grades ? subject.grades.length : 0,
        promedio: average.toFixed(1),
        estado: passing ? 'Aprobado' : 'En riesgo'
      };
    });
    
    const headers = ['Asignatura', 'Código', 'Profesor', 'Semestre', 'Créditos', 'Calificaciones', 'Promedio', 'Estado'];
    let csvContent = headers.join(',') + '\n';
    
    csvData.forEach(row => {
      const values = [
        `"${row.asignatura}"`,
        `"${row.codigo}"`,
        `"${row.profesor}"`,
        `"${row.semestre}"`,
        row.creditos,
        row.calificaciones,
        row.promedio,
        `"${row.estado}"`
      ];
      csvContent += values.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `asignaturas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getRecommendations = () => {
    const recommendations = [];
    
    if (stats.failingSubjects > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Asignaturas en riesgo',
        message: `Tienes ${stats.failingSubjects} asignatura${stats.failingSubjects > 1 ? 's' : ''} en riesgo de reprobación. Revisa tus estrategias de estudio y considera buscar ayuda académica.`,
        icon: <FaExclamationTriangle />,
        color: 'red'
      });
    }
    
    if (stats.pendingAssignments > 0) {
      recommendations.push({
        type: 'pending',
        title: 'Evaluaciones pendientes',
        message: `Tienes ${stats.pendingAssignments} evaluación${stats.pendingAssignments > 1 ? 'es' : ''} pendiente${stats.pendingAssignments > 1 ? 's' : ''}. Planifica tu tiempo para completarlas a tiempo y mejorar tus notas.`,
        icon: <FaCalendarAlt />,
        color: 'yellow'
      });
    }
    
    if (parseFloat(stats.overallAverage) >= 5.5) {
      recommendations.push({
        type: 'success',
        title: 'Excelente promedio',
        message: 'Mantén tu desempeño académico. Considera investigar oportunidades de becas o programas de excelencia académica.',
        icon: <FaGraduationCap />,
        color: 'green'
      });
    } else if (parseFloat(stats.overallAverage) >= 4.0 && parseFloat(stats.overallAverage) < 5.5) {
      recommendations.push({
        type: 'info',
        title: 'Buen rendimiento',
        message: 'Tu promedio es satisfactorio. Continúa con tu estrategia de estudio actual y considera mejorar en asignaturas específicas.',
        icon: <FaChartLine />,
        color: 'blue'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'info',
        title: 'Mejora tu rendimiento',
        message: 'Usa la sección de análisis para identificar patrones y mejorar tus estrategias de estudio.',
        icon: <FaChartBar />,
        color: 'indigo'
      });
    }
    
    return recommendations;
  };
  
  const recommendations = getRecommendations();

  return (
    <div className="bg-gray-100 min-h-screen">
      

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl shadow-2xl text-white p-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <div className="flex items-center">
                <div className="mr-6 bg-white bg-opacity-20 p-4 rounded-lg">
                  <FaGraduationCap className="h-10 w-10 text-indigo-200" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    Bienvenido, {user?.name || 'Usuario'}
                  </h1>
                  <p className="mt-2 text-indigo-200">
                    Sistema de gestión académica | Promedios según normativa chilena
                  </p>
                </div>
              </div>
              
              <div className="mt-6 bg-indigo-900 bg-opacity-40 rounded-full h-4 w-full max-w-md">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-4 rounded-full relative transition-all duration-500"
                  style={{ width: `${stats.averageProgress}%` }}
                >
                  <span className="absolute -right-4 -top-6 bg-white text-indigo-800 px-2 py-0.5 rounded-md text-xs font-bold">
                    {stats.averageProgress}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-indigo-200 mt-2">
                Progreso académico: {stats.averageProgress}% completado
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
              <Link to="/analytics" className="btn bg-white text-indigo-700 hover:bg-indigo-50 flex items-center px-5 py-2.5 rounded-lg shadow-lg transition-all font-medium">
                <FaChartBar className="mr-2" />
                Análisis Avanzado
              </Link>
              <Link to="/calendar" className="btn bg-indigo-600 hover:bg-indigo-500 text-white flex items-center px-5 py-2.5 rounded-lg shadow-lg transition-all font-medium border border-indigo-400">
                <FaCalendarAlt className="mr-2" />
                Calendario
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-b-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-700">
                <FaBook className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Asignaturas</p>
                <p className="text-2xl font-bold">{stats.totalSubjects}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs">Total de cursos registrados</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-b-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaCheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Aprobadas</p>
                <p className="text-2xl font-bold">{stats.passingSubjects}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs">Asignaturas con nota ≥ 4.0</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-b-4 border-red-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FaTimesCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">En Riesgo</p>
                <p className="text-2xl font-bold">{stats.failingSubjects}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs">Asignaturas con nota menor que 4.0</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-b-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaChartLine className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Promedio</p>
                <p className={`text-2xl font-bold ${parseFloat(stats.overallAverage) >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.overallAverage}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs">Promedio general acumulado</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-b-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaCalendarAlt className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Pendientes</p>
                <p className="text-2xl font-bold">{stats.pendingAssignments}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs">Evaluaciones por completar</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-b-4 border-indigo-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <FaClipboardList className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Recientes</p>
                <p className="text-2xl font-bold">{stats.recentlyUpdated}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-xs">Actualizadas últimos 7 días</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <FaBook className="text-indigo-600 h-6 w-6 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Tus Asignaturas</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar asignatura..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center px-4 py-2 rounded-lg border border-gray-300 transition-all"
              >
                <FaFilter className="mr-2" />
                Filtros {showFilters ? '▲' : '▼'}
              </button>
              
              <Link
                to="/subjects/new"
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white flex items-center px-4 py-2 rounded-lg shadow-sm transition-all"
              >
                <FaPlus className="mr-2" />
                Nueva
              </Link>
            </div>
          </div>
          
          {showFilters && (
            <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="passing">Aprobados</option>
                    <option value="failing">En riesgo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.value)}
                    >
                      {semesters.map(semester => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
                    <div className="flex space-x-2">
                      <select 
                        className="flex-grow border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                      >
                        <option value="name">Nombre</option>
                        <option value="teacher">Profesor</option>
                        <option value="semester">Semestre</option>
                        <option value="grades">Calificaciones</option>
                        <option value="average">Promedio</option>
                      </select>
                      <button
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-white transition-all"
                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        aria-label={sortDirection === 'asc' ? "Ordenar descendente" : "Ordenar ascendente"}
                      >
                        {sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={clearFilters}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
  
            {loading || refreshing ? (
              <div className="py-32 flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 text-lg">Cargando asignaturas...</p>
              </div>
            ) : errorMessage ? (
              <div className="py-20 text-center bg-red-50 rounded-lg border-2 border-dashed border-red-300">
                <div className="flex justify-center items-center text-red-500 mb-4">
                  <FaExclamationTriangle className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-red-800">{errorMessage}</h3>
                <p className="mt-2 text-red-600">No se pudo acceder a los datos de las asignaturas. Por favor, intenta nuevamente.</p>
                <button
                  onClick={refreshData}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all inline-flex items-center"
                >
                  <FaSync className="mr-2" />
                  Reintentar
                </button>
              </div>
            ) : !Array.isArray(subjects) ? (
              <div className="py-20 text-center bg-red-50 rounded-lg border-2 border-dashed border-red-300">
                <div className="flex justify-center items-center text-red-500 mb-4">
                  <FaTimesCircle className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-red-800">Error al cargar las asignaturas</h3>
                <p className="mt-2 text-red-600">El formato de datos es incorrecto. Por favor, contacta al administrador.</p>
                <button
                  onClick={refreshData}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all inline-flex items-center"
                >
                  <FaSync className="mr-2" />
                  Reintentar
                </button>
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FaBook className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes asignaturas registradas</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Comienza agregando tu primera asignatura para llevar un control detallado de tus calificaciones y promedios.
                </p>
                <Link
                  to="/subjects/new"
                  className="btn btn-primary inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
                >
                  <FaPlus className="mr-2" />
                  Crear tu primera asignatura
                </Link>
              </div>
            ) : sortedSubjects.length === 0 ? (
              <div className="text-center py-16 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                <FaSearch className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-medium text-yellow-800 mb-2">No se encontraron resultados</h3>
                <p className="text-yellow-700 mb-4">No hay asignaturas que coincidan con los criterios de búsqueda.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-500 mb-4 flex justify-between items-center">
                  <span>Mostrando {sortedSubjects.length} de {subjects.length} asignaturas</span>
                  {semesters.length > 1 && (
                    <span className="text-indigo-600 text-xs bg-indigo-50 px-2 py-1 rounded-md">
                      Último periodo académico: {semesters[1] || 'No disponible'}
                    </span>
                  )}
                </div>
                
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-all"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Asignatura
                            {sortField === 'name' && (
                              <span className="ml-1">
                                {sortDirection === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-all"
                          onClick={() => handleSort('teacher')}
                        >
                          <div className="flex items-center">
                            Profesor
                            {sortField === 'teacher' && (
                              <span className="ml-1">
                                {sortDirection === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-all"
                          onClick={() => handleSort('semester')}
                        >
                          <div className="flex items-center">
                            Semestre
                            {sortField === 'semester' && (
                              <span className="ml-1">
                                {sortDirection === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-all"
                          onClick={() => handleSort('grades')}
                        >
                          <div className="flex items-center">
                            Calificaciones
                            {sortField === 'grades' && (
                              <span className="ml-1">
                                {sortDirection === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-all"
                          onClick={() => handleSort('average')}
                        >
                          <div className="flex items-center">
                            Promedio
                            {sortField === 'average' && (
                              <span className="ml-1">
                                {sortDirection === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedSubjects.map((subject) => {
                        if (!subject || !subject._id) return null;
                        
                        let average = 0;
                        let passing = false;
                        
                        try {
                          const result = calculateWeightedAverage(subject._id);
                          average = result.average || 0;
                          passing = result.passing || false;
                        } catch (error) {
                          console.error(`Error calculando promedio para ${subject?.name || 'asignatura'}:`, error);
                        }
  
                        // Calcular las evaluaciones pendientes para esta asignatura
                        const pendingAssignments = subject.grades ? 
                          subject.grades.filter(grade => 
                            grade.dueDate && new Date(grade.dueDate) >= new Date() && !grade.score
                          ).length : 0;
  
                        return (
                          <tr key={subject._id} className="hover:bg-indigo-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link to={`/subjects/${subject._id}`} className="flex items-center group">
                                <div 
                                  className={`w-2 h-16 mr-3 rounded ${passing ? 'bg-green-500' : 'bg-red-500'} transition-all group-hover:w-3`}
                                ></div>
                                <div>
                                  <div className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                    {subject.name}
                                  </div>
                                  {subject.code && (
                                    <div className="text-xs text-gray-500 mt-1">Código: {subject.code}</div>
                                  )}
                                  {subject.description && (
                                    <div className="text-sm text-gray-600 truncate max-w-xs mt-1 italic">
                                      {subject.description.length > 60 
                                        ? `${subject.description.substring(0, 60)}...` 
                                        : subject.description}
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-gray-900 font-medium">{subject.teacher || 'No especificado'}</div>
                              {subject.department && (
                                <div className="text-xs text-gray-500 mt-1">{subject.department}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-md">
                                {subject.semester || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-gray-900 font-medium mr-2">
                                  {subject.grades ? subject.grades.length : 0}
                                </span>
                                {pendingAssignments > 0 && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                    +{pendingAssignments} pendientes
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span 
                                  className={`font-bold text-lg ${passing ? 'text-green-600' : 'text-red-600'}`}
                                >
                                  {average.toFixed(1)}
                                </span>
                                <div className="ml-3 w-20 bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${passing ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(average / 7 * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Nota mínima: {subject.passingGrade || 4.0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {passing ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                  <FaCheckCircle className="mr-1" />
                                  Aprobado
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                                  <FaTimesCircle className="mr-1" />
                                  En riesgo
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link 
                                  to={`/subjects/${subject._id}`} 
                                  className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors flex items-center"
                                  aria-label="Ver detalles"
                                >
                                  <FaEye className="mr-1" /> Ver
                                </Link>
                                <Link 
                                  to={`/subjects/${subject._id}/edit`} 
                                  className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded transition-colors flex items-center"
                                  aria-label="Editar asignatura"
                                >
                                  <FaPencilAlt className="mr-1" /> Editar
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {sortedSubjects.length > 10 && (
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-500">
                      Mostrando {sortedSubjects.length} {sortedSubjects.length === 1 ? 'resultado' : 'resultados'}
                    </div>
                    <div className="flex space-x-1">
                      <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all">
                        Anterior
                      </button>
                      <button className="px-3 py-1 border border-indigo-500 rounded-lg bg-indigo-600 text-white">
                        1
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all">
                        2
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all">
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {!loading && Array.isArray(subjects) && subjects.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-xl border border-indigo-100 p-6 mb-8 shadow-lg">
              <div className="flex items-center mb-4">
                <FaGraduationCap className="h-6 w-6 text-indigo-700 mr-3" />
                <h3 className="text-xl font-bold text-indigo-900">Recomendaciones Personalizadas</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={`bg-white rounded-lg p-4 shadow-md border-l-4 border-${rec.color}-500 hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-md bg-${rec.color}-100 text-${rec.color}-600 mr-3`}>
                        {rec.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{rec.title}</h4>
                        <p className="text-gray-600 text-sm">{rec.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
         
        </div>
      </div>
    );
  };
  
  export default Dashboard;