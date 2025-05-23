import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { SubjectContext } from '../../context/SubjectContext';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaPlus, 
  FaTrash, 
  FaChartLine, 
  FaInfoCircle, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaShieldAlt,
  FaExclamationTriangle, 
  FaGraduationCap, 
  FaBook, 
  FaCalendarAlt, 
  FaUserTie,
  FaFileAlt,
  FaClock,
  FaLightbulb,
  FaTrophy,
  FaChevronRight,
  FaChevronDown,
  FaHistory,
  FaUniversity,
  FaCalculator,
  FaClipboardCheck,
  FaMedal,
  FaExclamation,
  FaBan,
  FaStar,
  FaAward,
  FaChartBar,
  FaPercentage,
  FaTasks,
  FaCode,
  FaEye,
  FaBookOpen,
  FaBullseye,
  FaRocket,
  FaFire,
  FaThumbsUp,
  FaThumbsDown,
  FaBolt,
  FaSearch,
  FaFilter,
  FaExpand,
  FaCompress,
  FaGem,
  FaCrown,
  FaHeart,
} from 'react-icons/fa';

const useSubjectDetail = (id) => {
  const { subjects, selectedSubject, setSelectedSubject, addGrade, deleteGrade, calculateWeightedAverage, calculateRequiredGradeInfo } = useContext(SubjectContext);
  const [loading, setLoading] = useState(true);
  const [requiredGradeInfo, setRequiredGradeInfo] = useState(null);
  const [examInfo, setExamInfo] = useState(null);

  useEffect(() => {
    const subject = subjects.find(s => s._id === id);
    if (subject) {
      setSelectedSubject(subject);
      
      if (calculateRequiredGradeInfo) {
        const reqInfo = calculateRequiredGradeInfo(id, 4.0);
        setRequiredGradeInfo(reqInfo);
      }
      
      if (subject.hasExam) {
        calculateExamStatus(subject);
      }
      
      setLoading(false);
    }
  }, [id, subjects]);

  const calculateExamStatus = (subject) => {
    const examThreshold = subject.examThreshold || 5.0;
    const currentAvg = calculateCurrentAverage(subject);
    
    setExamInfo({
      threshold: examThreshold,
      currentAverage: currentAvg,
      canExempt: currentAvg >= examThreshold,
      weight: subject.examWeight || 25
    });
  };

  const calculateCurrentAverage = (subject) => {
    if (!subject.grades || subject.grades.length === 0) return 0;
    
    let totalWeighted = 0;
    let totalWeight = 0;
    
    subject.grades.forEach(grade => {
      const weight = parseFloat(grade.weight);
      if (!isNaN(weight)) {
        totalWeighted += parseFloat(grade.value) * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? totalWeighted / totalWeight : 0;
  };

  return {
    subject: selectedSubject,
    loading,
    requiredGradeInfo,
    examInfo,
    addGrade,
    deleteGrade
  };
};

const GradeStatusBadge = ({ grade }) => {
  const getStatus = () => {
    if (grade >= 6.5) return { 
      gradient: 'from-yellow-400 via-yellow-500 to-amber-600', 
      label: 'Excelente', 
      icon: FaCrown,
      glow: 'shadow-yellow-500/20'
    };
    if (grade >= 5.5) return { 
      gradient: 'from-blue-400 via-blue-500 to-blue-600', 
      label: 'Muy Bueno', 
      icon: FaGem,
      glow: 'shadow-blue-500/20'
    };
    if (grade >= 4.0) return { 
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600', 
      label: 'Aprobado', 
      icon: FaShieldAlt,
      glow: 'shadow-emerald-500/20'
    };
    return { 
      gradient: 'from-red-400 via-red-500 to-red-600', 
      label: 'Reprobado', 
      icon: FaTimesCircle,
      glow: 'shadow-red-500/20'
    };
  };

  const status = getStatus();
  const IconComponent = status.icon;

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${status.gradient} text-white shadow-lg ${status.glow} transform hover:scale-105 transition-all duration-200`}>
      <IconComponent className="w-3 h-3 mr-1.5" />
      {status.label}
    </div>
  );
};

// Evaluation Card Component
const EvaluationCard = ({ evaluation, grade, onAddGrade, onDeleteGrade, subjectId, setShowAddModal }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasGrade = !!grade;

  return (
    <div 
      className={`group relative bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-600/90 backdrop-blur-xl border border-slate-500/30 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 ${
        isHovered ? 'border-blue-400/50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-4 h-4 rounded-full shadow-lg transition-all duration-300 ${
                hasGrade 
                  ? parseFloat(grade.value) >= 4.0 
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-emerald-500/50' 
                    : 'bg-gradient-to-r from-red-400 to-red-500 shadow-red-500/50'
                  : 'bg-gradient-to-r from-slate-400 to-slate-500'
              }`} />
              <h3 className="font-bold text-xl text-white tracking-wide">{evaluation.name}</h3>
              {evaluation.isExam && (
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs rounded-full font-bold shadow-lg transform hover:scale-105 transition-transform">
                  <FaGraduationCap className="w-3 h-3 mr-1 inline" />
                  EXAMEN
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-slate-300">
              <span className="flex items-center backdrop-blur-sm bg-white/5 px-3 py-1 rounded-lg">
                <FaPercentage className="w-3 h-3 mr-2 text-blue-400" />
                <span className="font-semibold">{evaluation.weight}%</span> del total
              </span>
              {evaluation.description && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                >
                  <FaInfoCircle className="w-3 h-3 mr-1" />
                  Detalles
                  <div className={`ml-1 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                    <FaChevronRight className="w-3 h-3" />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Grade Display */}
          <div className="text-right">
            {hasGrade ? (
              <div className="space-y-3">
                <div className="relative">
                  <div className="text-4xl font-black text-white mb-2 tracking-wider">
                    {parseFloat(grade.value).toFixed(1)}
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-pulse" />
                </div>
                <GradeStatusBadge grade={parseFloat(grade.value)} />
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 border-2 border-dashed border-slate-400/50 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-sm bg-white/5 group-hover:border-blue-400/50 transition-colors">
                  <FaClock className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <button 
                  onClick={() => {
                    setShowAddModal(true);
                    onAddGrade({
                      evaluationName: evaluation.name,
                      weight: evaluation.weight,
                      subjectId: subjectId
                    });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm rounded-xl font-bold shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200"
                >
                  <FaPlus className="w-3 h-3 mr-1 inline" />
                  Agregar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && evaluation.description && (
          <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 animate-slideDown">
            <p className="text-sm text-slate-300 leading-relaxed">{evaluation.description}</p>
          </div>
        )}

        {/* Grade Details */}
        {hasGrade && (
          <div className="mt-6 pt-4 border-t border-slate-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-xs text-slate-400">
                <span className="flex items-center backdrop-blur-sm bg-white/5 px-2 py-1 rounded-lg">
                  <FaCalendarAlt className="w-3 h-3 mr-1" />
                  {new Date(grade.createdAt).toLocaleDateString('es-CL')}
                </span>
                {grade.note && (
                  <span className="flex items-center backdrop-blur-sm bg-white/5 px-2 py-1 rounded-lg">
                    <FaFileAlt className="w-3 h-3 mr-1" />
                    {grade.note.length > 30 ? grade.note.substring(0, 30) + '...' : grade.note}
                  </span>
                )}
              </div>
              <button
                onClick={() => onDeleteGrade(grade._id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
              >
                <FaTrash className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animated Weight Progress Bar */}
      <div className="h-2 bg-slate-700/50 relative overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${
            hasGrade 
              ? 'bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400' 
              : 'bg-gradient-to-r from-slate-500 to-slate-400'
          }`}
          style={{ width: `${Math.min(evaluation.weight, 100)}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

// Quick Stats Widget
const QuickStatsWidget = ({ subject, average, examInfo }) => {
  const stats = [
    {
      label: 'Promedio Actual',
      value: average.toFixed(1),
      icon: FaChartLine,
      gradient: average >= 4.0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600',
      glow: average >= 4.0 ? 'shadow-emerald-500/20' : 'shadow-red-500/20',
      trend: '+0.2',
      description: average >= 4.0 ? 'Aprobando' : 'En riesgo'
    },
    {
      label: 'Progreso Total',
      value: `${Math.round((subject.grades?.length || 0) / (subject.evaluations?.length || 1) * 100)}%`,
      icon: FaTasks,
      gradient: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/20',
      description: 'Completado'
    },
    {
      label: 'Evaluaciones',
      value: `${subject.grades?.length || 0}/${subject.evaluations?.length || 0}`,
      icon: FaClipboardCheck,
      gradient: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/20',
      description: 'Calificadas'
    },
    {
      label: 'Estado Examen',
      value: examInfo?.canExempt ? 'Eximido' : subject.hasExam ? 'Debe rendir' : 'Sin examen',
      icon: FaGraduationCap,
      gradient: examInfo?.canExempt ? 'from-yellow-500 to-yellow-600' : 'from-orange-500 to-orange-600',
      glow: examInfo?.canExempt ? 'shadow-yellow-500/20' : 'shadow-orange-500/20',
      description: examInfo?.canExempt ? '¡Felicidades!' : 'Prepararse'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index} 
            className="group relative bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-600/90 backdrop-blur-xl border border-slate-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
          >
            {/* Background Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-500`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg ${stat.glow} transform group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                {stat.trend && (
                  <span className="text-emerald-400 text-sm font-bold flex items-center">
                    ↗ {stat.trend}
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-black text-white tracking-wide">{stat.value}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{stat.description}</p>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      })}
    </div>
  );
};

// Performance Timeline Component
const PerformanceTimeline = ({ grades }) => {
  if (!grades || grades.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaHistory className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-400 font-medium">No hay historial de calificaciones</p>
      </div>
    );
  }

  const sortedGrades = [...grades].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="space-y-6">
      {sortedGrades.map((grade, index) => {
        const gradeValue = parseFloat(grade.value);
        const isGood = gradeValue >= 4.0;
        const isExcellent = gradeValue >= 6.0;
        
        return (
          <div key={grade._id} className="group relative">
            {/* Timeline Line */}
            {index < sortedGrades.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-500/50 to-blue-500/20" />
            )}
            
            <div className="flex items-center space-x-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-500/20 hover:border-blue-400/30 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  isExcellent ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-yellow-500/30' :
                  isGood ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-emerald-500/30' : 
                  'bg-gradient-to-r from-red-400 to-red-500 shadow-red-500/30'
                } transform group-hover:scale-110 transition-transform duration-300`}>
                  {isExcellent ? <FaCrown className="w-5 h-5 text-white" /> :
                   isGood ? <FaThumbsUp className="w-5 h-5 text-white" /> : 
                   <FaThumbsDown className="w-5 h-5 text-white" />}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-lg truncate">{grade.evaluationName}</h4>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-black text-white tracking-wide">{gradeValue.toFixed(1)}</span>
                    <GradeStatusBadge grade={gradeValue} />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span className="flex items-center">
                    <FaCalendarAlt className="w-3 h-3 mr-1" />
                    {new Date(grade.createdAt).toLocaleDateString('es-CL')}
                  </span>
                  {grade.note && (
                    <span className="flex items-center">
                      <FaFileAlt className="w-3 h-3 mr-1" />
                      {grade.note}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Add Grade Modal Component
const AddGradeModal = ({ isOpen, onClose, evaluations, onSubmit, existingGrades, preSelectedEvaluation }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [selectedEvaluation, setSelectedEvaluation] = useState(preSelectedEvaluation || '');

  useEffect(() => {
    if (preSelectedEvaluation) {
      setValue('evaluationName', preSelectedEvaluation);
      setSelectedEvaluation(preSelectedEvaluation);
    }
  }, [preSelectedEvaluation, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedEvaluation('');
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data) => {
  try {
    const evaluation = evaluations.find(e => e.name === data.evaluationName);
    if (!evaluation) {
      toast.error('Evaluación no encontrada');
      return;
    }

    // Format data correctly
    const gradeData = {
      evaluationName: evaluation.name,
      value: parseFloat(data.value),
      weight: parseFloat(evaluation.weight),
      note: data.note || '',
      subjectId: evaluation.subjectId // Add this if needed by your API
    };

    // Validate data before sending
    if (!gradeData.evaluationName || !gradeData.value || !gradeData.weight) {
      toast.error('Faltan datos requeridos');
      return;
    }

    // Validate grade range
    if (gradeData.value < 1.0 || gradeData.value > 7.0) {
      toast.error('La nota debe estar entre 1.0 y 7.0');
      return;
    }

    console.log('Sending grade data:', gradeData); // Debug log
    await onSubmit(gradeData);
    onClose();
  } catch (error) {
    console.error('Error en el formulario:', error);
    toast.error('Error al guardar la calificación');
  }
};

  const availableEvaluations = evaluations?.filter(
    evalu => !existingGrades?.some(grade => grade.evaluationName === evalu.name)
  ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 border border-slate-500/30 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-1">Nueva Calificación</h2>
            <p className="text-slate-400">Agrega una nueva nota a tu asignatura</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-xl transition-all duration-200"
          >
            <FaTimesCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">
              Evaluación
            </label>
            <select
              {...register('evaluationName', { required: 'Seleccione una evaluación' })}
              className="w-full px-4 py-4 bg-slate-700/50 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 focus:outline-none transition-all backdrop-blur-sm"
              onChange={(e) => setSelectedEvaluation(e.target.value)}
            >
              <option value="">Seleccionar evaluación...</option>
              {availableEvaluations.map((evaluation) => (
                <option key={evaluation.name} value={evaluation.name} className="bg-slate-700">
                  {evaluation.name} ({evaluation.weight}%)
                </option>
              ))}
            </select>
            {errors.evaluationName && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <FaExclamationTriangle className="w-3 h-3 mr-1" />
                {errors.evaluationName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">
              Calificación
            </label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="7.0"
              {...register('value', {
                required: 'Ingrese la calificación',
                min: { value: 1.0, message: 'Mínimo 1.0' },
                max: { value: 7.0, message: 'Máximo 7.0' }
              })}
              className="w-full px-4 py-4 bg-slate-700/50 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 focus:outline-none transition-all backdrop-blur-sm text-2xl font-bold text-center"
              placeholder="5.5"
            />
            {errors.value && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <FaExclamationTriangle className="w-3 h-3 mr-1" />
                {errors.value.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">
              Comentario (opcional)
            </label>
            <textarea
              {...register('note')}
              rows="3"
              className="w-full px-4 py-4 bg-slate-700/50 border border-slate-500/30 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 focus:outline-none transition-all backdrop-blur-sm resize-none"
              placeholder="Observaciones sobre esta calificación..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-600/50 border border-slate-500/30 text-slate-300 rounded-xl hover:bg-slate-500/50 font-bold transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedEvaluation}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200"
            >
              <FaCheckCircle className="w-4 h-4 mr-2 inline" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const useGradePrediction = (subject, targetGrade = 4.0) => {
  return useMemo(() => {
    if (!subject || !subject.grades || subject.grades.length === 0) {
      return { requiredGrades: [], possible: false };
    }

    const currentAverage = subject.grades.reduce((sum, grade) => sum + parseFloat(grade.value), 0) / subject.grades.length;
    const remainingEvaluations = subject.evaluations.filter(evalu => !subject.grades.find(grade => grade.evaluationName === evalu.name));
    const requiredGrades = remainingEvaluations.map(evalu => {
      const weight = evalu.weight / 100;
      const requiredGrade = (targetGrade - (currentAverage * (1 - weight))) / weight;
      return {
        evaluationName: evalu.name,
        requiredGrade: Math.max(1.0, Math.min(7.0, requiredGrade)),
        weight: evalu.weight
      };
    });

    const possible = requiredGrades.every(grade => grade.requiredGrade <= 7.0);

    return { requiredGrades, possible };
  }, [subject, targetGrade]);
};

const getRecommendations = (caseType, requiredAverage, progress) => {
  const recommendations = {
    low: {
      message: 'Tu rendimiento actual es bajo. Se recomienda estudiar más y revisar los conceptos básicos.',
      actions: [
        'Dedica al menos 2 horas diarias al estudio.',
        'Utiliza recursos en línea como Khan Academy o Coursera.',
        'No dudes en pedir ayuda a tus profesores o compañeros.'
      ]
    },
    medium: {
      message: 'Tu rendimiento es promedio. Estás cerca de alcanzar tus metas, pero se necesita más esfuerzo.',
      actions: [
        'Estudia al menos 1 hora diaria de manera efectiva.',
        'Participa en grupos de estudio.',
        'Consulta a tus profesores sobre tus dudas.'
      ]
    },
    high: {
      message: 'Buen trabajo, tu rendimiento es alto. Sigue así para mantener y mejorar tus calificaciones.',
      actions: [
        'Continúa estudiando de manera constante.',
        'Ayuda a tus compañeros que tengan dificultades.',
        'Explora temas adicionales para profundizar tu conocimiento.'
      ]
    }
  };

  const progressPercentage = (progress.completed / progress.total) * 100;

  if (progressPercentage < 50) {
    return recommendations.low;
  } else if (progressPercentage < 75) {
    return recommendations.medium;
  } else {
    return recommendations.high;
  }
};
const GradePredictionWidget = ({ subject, targetGrade = 4.0 }) => {
  const { requiredGrades, possible } = useGradePrediction(subject, targetGrade);

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 border border-slate-500/30 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <h3 className="text-lg font-bold text-white mb-4">Predicción de Notas</h3>
      {requiredGrades.length === 0 ? (
        <p className="text-slate-400 text-sm">No hay evaluaciones restantes para predecir.</p>
      ) : (
        <div>
          {requiredGrades.map((grade, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-500/20 last:border-b-0">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-white truncate">{grade.evaluationName}</p>
                <p className="text-xs text-slate-400">{grade.weight}% del total</p>
              </div>
              <div className="w-16 text-right">
                <p className={`text-lg font-bold ${grade.requiredGrade <= 4.0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {grade.requiredGrade.toFixed(1)}
                </p>
              </div>
            </div>
          ))}
          
          <div className="mt-4">
            <p className="text-xs text-slate-500 mb-1">Estado de la predicción:</p>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${possible ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-semibold ${possible ? 'text-emerald-400' : 'text-red-400'}`}>
                {possible ? 'Posible alcanzar' : 'No es posible alcanzar'} el promedio deseado
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subject, loading, requiredGradeInfo, examInfo, addGrade, deleteGrade } = useSubjectDetail(id);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedView, setSelectedView] = useState('evaluations');
  const [gradeToDelete, setGradeToDelete] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const { average, passing } = useMemo(() => {
    if (!subject || !subject.grades || subject.grades.length === 0) {
      return { average: 0, passing: false };
    }

    let totalWeighted = 0;
    let totalWeight = 0;

    subject.grades.forEach(grade => {
      const weight = parseFloat(grade.weight);
      if (!isNaN(weight)) {
        totalWeighted += parseFloat(grade.value) * weight;
        totalWeight += weight;
      }
    });

    const avg = totalWeight > 0 ? totalWeighted / totalWeight : 0;
    return { average: avg, passing: avg >= 4.0 };
  }, [subject]);

  const { requiredGrades, possible: predictionPossible } = useGradePrediction(subject, 4.0);


const handleAddGrade = async (gradeData) => {
  try {
    console.log('Adding grade with data:', gradeData); // Debug log

    // Ensure all required fields are present
    const finalData = {
      subjectId: subject._id,
      evaluationName: gradeData.evaluationName,
      value: parseFloat(gradeData.value),
      weight: parseFloat(gradeData.weight),
      note: gradeData.note || ''
    };

    // Additional validations
    if (!finalData.evaluationName || !finalData.value || !finalData.weight) {
      toast.error('Faltan datos requeridos');
      return;
    }

    const result = await addGrade(subject._id, finalData);
    if (result) {
      toast.success('Calificación agregada exitosamente');
      setShowAddModal(false);
      // Optionally refresh the data
      // await refreshSubjectData();
    }
  } catch (error) {
    console.error('Error details:', error.response?.data); // Debug log
    toast.error(error.response?.data?.message || 'Error al agregar la calificación');
  }
};

  const handleDeleteGrade = async (gradeId) => {
    try {
      const result = await deleteGrade(gradeId);
      if (result) {
        toast.success('Calificación eliminada exitosamente');
      }
    } catch (error) {
      toast.error('Error al eliminar calificación');
    }
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-1">
                {subject.name}
              </h1>
              <p className="text-sm sm:text-base text-white/90">{subject.description}</p>
            </div>
            <Link to="/subjects" className="text-white/90 hover:text-white transition-colors">
              <FaArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {/* Quick Stats */}
          <QuickStatsWidget subject={subject} average={average} examInfo={examInfo} />

          {/* Tabs */}
          <div className="mt-8">
            <div className="flex space-x-4">
              <button
                onClick={() => handleViewChange('evaluations')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  selectedView === 'evaluations'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <FaBookOpen className="w-4 h-4 mr-2" />
                Evaluaciones
              </button>
              <button
                onClick={() => handleViewChange('grades')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  selectedView === 'grades'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <FaChartBar className="w-4 h-4 mr-2" />
                Calificaciones
              </button>
              <button
                onClick={() => handleViewChange('analytics')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  selectedView === 'analytics'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <FaChartLine className="w-4 h-4 mr-2" />
                Análisis
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            {selectedView === 'evaluations' && (
              <div>
                {subject.evaluations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-medium">No hay evaluaciones disponibles</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {subject.evaluations.map((evaluation) => (
                      <EvaluationCard 
                        key={evaluation.name}
                        evaluation={evaluation} 
                        grade={subject.grades.find(g => g.evaluationName === evaluation.name)} 
                        onAddGrade={handleAddGrade} 
                        onDeleteGrade={handleDeleteGrade} 
                        subjectId={subject._id} 
                        setShowAddModal={setShowAddModal}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {selectedView === 'grades' && (
              <div>
                {subject.grades.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-medium">No hay calificaciones disponibles</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subject.grades.map((grade) => (
                      <div key={grade._id} className="p-4 bg-slate-700 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-sm font-medium text-white truncate">{grade.evaluationName}</p>
                          <p className="text-xs text-slate-400">{new Date(grade.createdAt).toLocaleDateString('es-CL')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-white">
                            {parseFloat(grade.value).toFixed(1)}
                          </span>
                          <GradeStatusBadge grade={parseFloat(grade.value)} />
                          <button
                            onClick={() => {
                              setGradeToDelete(grade._id);
                              setShowAddModal(true);
                            }}
                            className="p-2 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200"
                            title="Eliminar calificación"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selectedView === 'analytics' && (
              <div className="space-y-8">
                <h2 className="text-4xl font-black text-white tracking-wide">ANÁLISIS</h2>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
                  <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <FaChartLine className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Análisis Predictivo
                    </h2>
                    <p className="text-blue-200/80 text-sm">
                      Resumen detallado de tu rendimiento académico
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Stats Section */}
                    <div className="space-y-6">
                      <div className="bg-slate-700/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Estadísticas Actuales</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Promedio actual:</span>
                            <span className="text-2xl font-bold text-white">{average.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Evaluaciones rendidas:</span>
                            <span className="text-2xl font-bold text-white">
                              {subject.grades?.length}/{subject.evaluations?.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300">Progreso del curso:</span>
                            <span className="text-2xl font-bold text-white">
                              {Math.round((subject.grades?.length || 0) / (subject.evaluations?.length || 1) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Estado Actual</h3>
                        <div className={`p-4 rounded-lg ${
                          average >= 4.0 
                            ? 'bg-emerald-500/20 border border-emerald-500/30' 
                            : 'bg-red-500/20 border border-red-500/30'
                        }`}>
                          <p className="text-lg font-medium text-white">
                            {average >= 4.0 
                              ? '¡Vas bien! Estás aprobando el curso.' 
                              : 'Necesitas mejorar para aprobar el curso.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Prediction Section */}
                    <div className="space-y-6">
                      <div className="bg-slate-700/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Predicciones</h3>
                        <div className="space-y-4">
                          {requiredGrades.map((grade, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg">
                              <span className="text-slate-300">{grade.evaluationName}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-slate-400">{grade.weight}%</span>
                                <span className={`text-lg font-bold ${
                                  grade.requiredGrade <= 7.0 ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                  {grade.requiredGrade <= 7.0 ? grade.requiredGrade.toFixed(1) : 'Imposible'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Recomendaciones</h3>
                        <ul className="space-y-2">
                          {average < 4.0 && (
                            <>
                              <li className="flex items-center text-slate-300">
                                <FaExclamationTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                                Necesitas mejorar tu rendimiento
                              </li>
                              <li className="flex items-center text-slate-300">
                                <FaLightbulb className="w-4 h-4 text-blue-400 mr-2" />
                                Considera buscar ayuda adicional
                              </li>
                            </>
                          )}
                          {average >= 4.0 && average < 5.5 && (
                            <>
                              <li className="flex items-center text-slate-300">
                                <FaThumbsUp className="w-4 h-4 text-emerald-400 mr-2" />
                                Mantén tu ritmo actual
                              </li>
                              <li className="flex items-center text-slate-300">
                                <FaRocket className="w-4 h-4 text-blue-400 mr-2" />
                                Puedes mejorar aún más
                              </li>
                            </>
                          )}
                          {average >= 5.5 && (
                            <>
                              <li className="flex items-center text-slate-300">
                                <FaTrophy className="w-4 h-4 text-yellow-400 mr-2" />
                                ¡Excelente rendimiento!
                              </li>
                              <li className="flex items-center text-slate-300">
                                <FaStar className="w-4 h-4 text-yellow-400 mr-2" />
                                Sigue así
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Grade Modal */}
      {showAddModal && (
        <AddGradeModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          evaluations={subject.evaluations} 
          onSubmit={handleAddGrade}
          existingGrades={subject.grades}
          preSelectedEvaluation={selectedEvaluation?.evaluationName} // Agregar esta prop
        />
      )}
    </div>
  );
};

export default SubjectDetail;
