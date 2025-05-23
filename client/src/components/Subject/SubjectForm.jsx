// src/components/Subject/SubjectForm.jsx
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SubjectContext } from '../../context/SubjectContext';
import { 
  FaSave, 
  FaArrowLeft, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaBook, 
  FaGraduationCap, 
  FaInfoCircle, 
  FaBalanceScale, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
  FaUniversity,
  FaCode,
  FaSyncAlt,
  FaClipboardList,
  FaCog,
  FaQuestion,
  FaClock,
  FaClipboardCheck,
  FaCalculator,
  FaUserGraduate,
  FaChevronRight,
  FaRocket,
  FaTrophy,
  FaLightbulb,
  FaEye,
  FaChartPie,
  FaGem,
  FaCrown,
  FaStar,
  FaBolt,
  FaFire,
  FaMagic,
  FaAtom,
  FaCubes,
  FaDraftingCompass,
  FaEdit,
  FaLayerGroup
} from 'react-icons/fa';

// Custom Hooks
const useFormValidation = (watch, evaluations) => {
  const watchedFields = watch(['name', 'teacher', 'description', 'semester', 'code', 'credits']);
  
  return useMemo(() => {
    let progress = 0;
    let validations = {
      basic: { score: 0, max: 100, issues: [] },
      evaluations: { score: 0, max: 100, issues: [] },
      advanced: { score: 0, max: 100, issues: [] }
    };

    // Basic validation
    if (watchedFields[0]) {
      validations.basic.score += 60;
    } else {
      validations.basic.issues.push('Nombre requerido');
    }
    
    if (watchedFields[1]) validations.basic.score += 20;
    if (watchedFields[2]) validations.basic.score += 20;

    // Evaluations validation
    if (evaluations.length > 0) {
      validations.evaluations.score += 50;
      const totalWeight = evaluations.reduce((sum, e) => sum + Number(e.weight), 0);
      if (Math.abs(totalWeight - 100) < 0.001) {
        validations.evaluations.score += 50;
      } else {
        validations.evaluations.issues.push(`Ponderaciones suman ${totalWeight}%, debe ser 100%`);
      }
    } else {
      validations.evaluations.issues.push('Debe tener al menos una evaluación');
    }

    // Advanced validation
    if (watchedFields[3]) validations.advanced.score += 30;
    if (watchedFields[4]) validations.advanced.score += 30;
    if (watchedFields[5]) validations.advanced.score += 40;

    const totalScore = (validations.basic.score + validations.evaluations.score + validations.advanced.score) / 3;
    
    return { progress: totalScore, validations };
  }, [watchedFields, evaluations]);
};

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Floating orbs */}
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className={`absolute rounded-full bg-gradient-to-r ${
          i % 3 === 0 ? 'from-blue-500/10 to-cyan-500/10' :
          i % 3 === 1 ? 'from-purple-500/10 to-pink-500/10' :
          'from-indigo-500/10 to-blue-500/10'
        } blur-xl animate-pulse`}
        style={{
          width: `${200 + Math.random() * 200}px`,
          height: `${200 + Math.random() * 200}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${4 + Math.random() * 2}s`
        }}
      />
    ))}
    
    {/* Particle system */}
    {[...Array(30)].map((_, i) => (
      <div
        key={`particle-${i}`}
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
);

// Progress Ring Component
const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500 transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

// Smart Input Component
const SmartInput = ({ 
  icon: Icon, 
  label, 
  error, 
  description, 
  className = "", 
  ...props 
}) => (
  <div className="space-y-3">
    <label className="block text-sm font-bold text-slate-300 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
        </div>
      )}
      <input
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:bg-slate-700/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm ${
          error ? 'border-red-400/50 bg-red-500/10' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <FaExclamationTriangle className="h-4 w-4 text-red-400" />
        </div>
      )}
    </div>
    {description && (
      <p className="text-xs text-slate-500 flex items-center">
        <FaInfoCircle className="w-3 h-3 mr-1" />
        {description}
      </p>
    )}
    {error && (
      <p className="text-sm text-red-400 flex items-center">
        <FaExclamationTriangle className="w-3 h-3 mr-2" />
        {error}
      </p>
    )}
  </div>
);

// Evaluation Builder Component
const EvaluationBuilder = ({ evaluations, setEvaluations, hasExam, examWeight }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const addEvaluation = () => {
    const remainingWeight = 100 - evaluations.reduce((sum, e) => sum + Number(e.weight), 0);
    setEvaluations([
      ...evaluations, 
      { 
        name: `Evaluación ${evaluations.length + 1}`, 
        weight: Math.max(0, remainingWeight),
        description: ''
      }
    ]);
  };

  const removeEvaluation = (index) => {
    if (evaluations.length <= 1) {
      toast.warning('Debe mantener al menos una evaluación');
      return;
    }
    setEvaluations(evaluations.filter((_, i) => i !== index));
  };

  const updateEvaluation = (index, field, value) => {
    const newEvaluations = [...evaluations];
    newEvaluations[index][field] = field === 'weight' ? Number(value) : value;
    setEvaluations(newEvaluations);
  };

  const distributeEvenly = () => {
    const weight = Math.floor(100 / evaluations.length);
    const remainder = 100 - (weight * evaluations.length);
    
    setEvaluations(evaluations.map((evalu, index) => ({
      ...evalu,
      weight: index === 0 ? weight + remainder : weight
    })));
  };

  const totalWeight = evaluations.reduce((sum, e) => sum + Number(e.weight), 0);
  const isValid = Math.abs(totalWeight - 100) < 0.001;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center mb-2">
            <FaLayerGroup className="mr-3 text-blue-400" />
            Constructor de Evaluaciones
          </h3>
          <p className="text-slate-400">Diseña tu sistema de evaluación perfecto</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={distributeEvenly}
            className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-all duration-300 flex items-center backdrop-blur-sm"
          >
            <FaBalanceScale className="mr-2 h-4 w-4" />
            Equilibrar
          </button>
          
          <button
            type="button"
            onClick={addEvaluation}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Agregar Evaluación
          </button>
        </div>
      </div>

      {/* Weight Distribution Visualization */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-white">Distribución de Ponderaciones</h4>
          <div className={`px-4 py-2 rounded-xl font-bold ${
            isValid 
              ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300' 
              : 'bg-red-500/20 border border-red-400/30 text-red-300'
          }`}>
            {totalWeight}% / 100%
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                isValid ? 'bg-gradient-to-r from-emerald-500 to-blue-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
              }`}
              style={{ width: `${Math.min(totalWeight, 100)}%` }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {evaluations.map((evalu, index) => (
              <div 
                key={index}
                className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 text-sm"
              >
                {evalu.name}: {evalu.weight}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation Cards */}
      <div className="grid gap-4">
        {evaluations.map((evaluation, index) => (
          <div 
            key={index}
            className="group bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl border border-slate-600/30 hover:border-blue-400/50 transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Drag Handle */}
                <div className="lg:col-span-1 flex justify-center">
                  <div className="w-6 h-6 flex flex-col justify-center space-y-0.5 cursor-move opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="w-full h-0.5 bg-slate-500 rounded"></div>
                    <div className="w-full h-0.5 bg-slate-500 rounded"></div>
                    <div className="w-full h-0.5 bg-slate-500 rounded"></div>
                  </div>
                </div>
                
                {/* Name Input */}
                <div className="lg:col-span-6">
                  <input
                    type="text"
                    value={evaluation.name}
                    onChange={(e) => updateEvaluation(index, 'name', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all backdrop-blur-sm"
                    placeholder="Nombre de la evaluación"
                  />
                </div>
                
                {/* Weight Input */}
                <div className="lg:col-span-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={evaluation.weight}
                      onChange={(e) => updateEvaluation(index, 'weight', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all backdrop-blur-sm pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                      %
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="lg:col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeEvaluation(index)}
                    className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/30 text-red-400 hover:bg-red-500/30 hover:border-red-400/50 transition-all duration-300 flex items-center justify-center"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-4">
                <textarea
                  value={evaluation.description || ''}
                  onChange={(e) => updateEvaluation(index, 'description', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all backdrop-blur-sm resize-none"
                  rows="2"
                  placeholder="Descripción opcional de la evaluación..."
                />
              </div>
            </div>
            
            {/* Weight Bar */}
            <div className="h-2 bg-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${evaluation.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subject Preview Component
const SubjectPreview = ({ formData, evaluations, hasExam, examWeight, examThreshold }) => {
  const totalWeight = evaluations.reduce((sum, e) => sum + Number(e.weight), 0);
  const isValid = Math.abs(totalWeight - 100) < 0.001;

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl border border-slate-600/30 p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-white flex items-center">
          <FaEye className="mr-3 text-purple-400" />
          Vista Previa
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          isValid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
        }`}>
          {isValid ? 'Válido' : 'Revisar'}
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Subject Info */}
        <div className="space-y-3">
          <h4 className="text-xl font-bold text-white">
            {formData.name || 'Sin nombre'}
          </h4>
          {formData.teacher && (
            <p className="text-slate-300 flex items-center">
              <FaUserGraduate className="w-4 h-4 mr-2 text-blue-400" />
              {formData.teacher}
            </p>
          )}
          {formData.description && (
            <p className="text-slate-400 text-sm">{formData.description}</p>
          )}
        </div>
        
        {/* Additional Info */}
        {(formData.code || formData.semester || formData.credits) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {formData.code && (
              <div className="bg-slate-700/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Código</p>
                <p className="font-bold text-white">{formData.code}</p>
              </div>
            )}
            {formData.semester && (
              <div className="bg-slate-700/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Semestre</p>
                <p className="font-bold text-white">{formData.semester}</p>
              </div>
            )}
            {formData.credits && (
              <div className="bg-slate-700/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Créditos</p>
                <p className="font-bold text-white">{formData.credits}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Evaluations Preview */}
        <div>
          <h5 className="font-bold text-white mb-3 flex items-center">
            <FaChartPie className="w-4 h-4 mr-2 text-blue-400" />
            Evaluaciones ({evaluations.length})
          </h5>
          <div className="space-y-2">
            {evaluations.map((evalu, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <span className="text-slate-300 text-sm">{evalu.name}</span>
                <span className="font-bold text-white">{evalu.weight}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Exam Info */}
        {hasExam && (
          <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-4">
            <h5 className="font-bold text-purple-300 mb-2 flex items-center">
              <FaGraduationCap className="w-4 h-4 mr-2" />
              Examen Final
            </h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Peso adicional</p>
                <p className="font-bold text-white">{examWeight}%</p>
              </div>
              <div>
                <p className="text-slate-400">Nota para eximirse</p>
                <p className="font-bold text-white">{examThreshold}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const SubjectForm = () => {
  const { createSubject, updateSubject, deleteSubject, subjects } = useContext(SubjectContext);
  const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasExam, setHasExam] = useState(false);
  const [examThreshold, setExamThreshold] = useState(5.0);
  const [examWeight, setExamWeight] = useState(25);
  const navigate = useNavigate();
  const { id } = useParams();

  const [evaluations, setEvaluations] = useState([
    { name: 'Prueba 1', weight: 50, description: '' },
    { name: 'Prueba 2', weight: 50, description: '' }
  ]);

  const formData = watch();
  const { progress, validations } = useFormValidation(watch, evaluations);

  const steps = [
    {
      id: 'basic',
      title: 'Información Básica',
      icon: FaBook,
      description: 'Datos fundamentales de la asignatura'
    },
    {
      id: 'evaluations',
      title: 'Sistema de Evaluación',
      icon: FaLayerGroup,
      description: 'Configura evaluaciones y ponderaciones'
    },
    {
      id: 'exam',
      title: 'Configuración de Examen',
      icon: FaGraduationCap,
      description: 'Establece parámetros del examen final'
    },
    {
      id: 'advanced',
      title: 'Configuración Avanzada',
      icon: FaCog,
      description: 'Detalles adicionales y metadatos'
    }
  ];

  useEffect(() => {
    if (id && id !== 'new') {
      setIsEditing(true);
      const subject = subjects.find(s => s._id === id);
      
      if (subject) {
        // Populate form fields
        Object.keys(subject).forEach(key => {
          if (key !== 'evaluations' && key !== 'hasExam' && key !== 'examWeight' && key !== 'examThreshold') {
            setValue(key, subject[key]);
          }
        });
        
        // Set exam configuration
        setHasExam(subject.hasExam || false);
        setExamWeight(subject.examWeight || 25);
        setExamThreshold(subject.examThreshold || 5.0);
        
        // Set evaluations
        if (subject.evaluations && subject.evaluations.length > 0) {
          const courseEvaluations = subject.evaluations.filter(evalu => 
            !evalu.isExam && !evalu.name.toLowerCase().includes('examen') && !evalu.name.toLowerCase().includes('final')
          );
          setEvaluations(courseEvaluations.length > 0 ? courseEvaluations : [
            { name: 'Evaluación 1', weight: 100, description: '' }
          ]);
        }
      } else {
        toast.error('Asignatura no encontrada');
        navigate('/subjects');
      }
    }
  }, [id, subjects, setValue, navigate]);

  const validateWeights = () => {
    const totalWeight = evaluations.reduce((sum, evaluation) => sum + Number(evaluation.weight), 0);
    return Math.abs(totalWeight - 100) < 0.001;
  };

  const onSubmit = async (data) => {
    if (!validateWeights()) {
      toast.error('Las ponderaciones deben sumar exactamente 100%');
      setCurrentStep(1); // Go to evaluations step
      return;
    }

    setIsSubmitting(true);
    
    try {
      const subjectData = {
        ...data,
        evaluations,
        hasExam,
        examWeight: hasExam ? Number(examWeight) : null,
        examThreshold: hasExam ? Number(examThreshold) : null
      };
      
      let result;
      
      if (isEditing) {
        result = await updateSubject(id, subjectData);
      } else {
        result = await createSubject(subjectData);
      }
      
      if (result) {
        toast.success(`Asignatura ${isEditing ? 'actualizada' : 'creada'} exitosamente`);
        navigate('/subjects');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(`Error al ${isEditing ? 'actualizar' : 'crear'} la asignatura`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    
    try {
      setIsSubmitting(true);
      const success = await deleteSubject(id);
      if (success) {
        toast.success('Asignatura eliminada exitosamente');
        navigate('/subjects');
      }
    } catch (error) {
      console.error('Error al eliminar asignatura', error);
      toast.error('Error al eliminar la asignatura');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SmartInput
                icon={FaBook}
                label="Nombre de la asignatura"
                placeholder="Ej: Matemáticas Aplicadas"
                error={errors.name?.message}
                description="Nombre principal que aparecerá en tu dashboard"
                {...register('name', { required: 'El nombre es obligatorio' })}
              />
              
              <SmartInput
                icon={FaUserGraduate}
                label="Profesor"
                placeholder="Ej: Dr. Juan Pérez"
                description="Nombre del profesor a cargo de la asignatura"
                {...register('teacher')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wide mb-3">
                Descripción
              </label>
              <textarea
                className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:bg-slate-700/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm resize-none"
                rows="4"
                placeholder="Describe el contenido y objetivos de esta asignatura..."
                {...register('description')}
              />
              <p className="text-xs text-slate-500 flex items-center mt-2">
                <FaInfoCircle className="w-3 h-3 mr-1" />
                Una descripción clara te ayudará a contextualizar mejor la asignatura
              </p>
            </div>
          </div>
        );
        
      case 'evaluations':
        return (
          <EvaluationBuilder
            evaluations={evaluations}
            setEvaluations={setEvaluations}
            hasExam={hasExam}
            examWeight={examWeight}
          />
        );
        
      case 'exam':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center mb-4">
                <FaGraduationCap className="mr-3 text-purple-400" />
                Configuración de Examen Final
              </h3>
              <p className="text-slate-400">Define si la asignatura incluye un examen final adicional</p>
            </div>
            
            {/* Exam Toggle */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="hasExam"
                      className="sr-only"
                      checked={hasExam}
                      onChange={(e) => setHasExam(e.target.checked)}
                    />
                    <label
                      htmlFor="hasExam"
                      className="relative flex items-center cursor-pointer select-none"
                    >
                      <div className={`w-14 h-8 rounded-full border-2 transition-all duration-300 ${
                        hasExam 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400' 
                          : 'bg-slate-700 border-slate-600'
                      }`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                          hasExam ? 'translate-x-6' : 'translate-x-1'
                        } mt-0.5`} />
                      </div>
                      <span className="ml-4 text-white font-bold text-lg">
                        Incluir Examen Final
                      </span>
                    </label>
                  </div>
                </div>
                
                {hasExam && (
                  <div className="flex items-center space-x-2">
                    <FaCheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Activado</span>
                  </div>
                )}
              </div>
              
              {hasExam && (
                <div className="mt-8 pt-8 border-t border-slate-600/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 uppercase tracking-wide mb-3">
                        Peso del Examen (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          step="1"
                          value={examWeight}
                          onChange={(e) => setExamWeight(Number(e.target.value))}
                          className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all backdrop-blur-sm text-center text-2xl font-bold"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                          %
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Porcentaje adicional al 100% del curso
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-300 uppercase tracking-wide mb-3">
                        Nota para Eximirse
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="7"
                        step="0.1"
                        value={examThreshold}
                        onChange={(e) => setExamThreshold(Number(e.target.value))}
                        className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/30 rounded-xl text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all backdrop-blur-sm text-center text-2xl font-bold"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Promedio mínimo para eximirse del examen
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <FaCalculator className="w-6 h-6 text-blue-400 mt-1" />
                      <div>
                        <h4 className="font-bold text-blue-300 mb-2">Cómo Funciona el Sistema</h4>
                        <p className="text-blue-200/80 text-sm leading-relaxed">
                          Los estudiantes que obtengan un promedio de <strong>{examThreshold}</strong> o superior 
                          en las evaluaciones del curso se eximen del examen. Quienes no alcancen esta nota 
                          deberán rendir el examen final que representa un <strong>{examWeight}%</strong> adicional 
                          de la nota final.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'advanced':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center mb-4">
                <FaCog className="mr-3 text-blue-400" />
                Configuración Avanzada
              </h3>
              <p className="text-slate-400">Información adicional para un seguimiento profesional</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SmartInput
                icon={FaCalendarAlt}
                label="Semestre Académico"
                placeholder="Ej: 2025-1"
                description="Formato: Año-Periodo (Ej: 2025-1, 2024-2)"
                {...register('semester')}
              />
              
              <SmartInput
                icon={FaCode}
                label="Código de Asignatura"
                placeholder="Ej: MAT2001"
                description="Código oficial de la asignatura"
                {...register('code')}
              />
              
              <SmartInput
                icon={FaUniversity}
                label="Créditos Académicos"
                type="number"
                min="1"
                max="20"
                placeholder="Ej: 6"
                description="Número de créditos que otorga la asignatura"
                {...register('credits')}
              />
              
              <SmartInput
                icon={FaCheckCircle}
                label="Nota Mínima de Aprobación"
                type="number"
                min="1"
                max="7"
                step="0.1"
                placeholder="4.0"
                description="Nota mínima requerida para aprobar"
                {...register('passingGrade')}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/subjects" 
            className="flex items-center px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-xl border border-slate-600/30 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <FaArrowLeft className="mr-3 h-5 w-5" />
            <span className="font-bold">Volver a Asignaturas</span>
          </Link>
          
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 flex items-center transform hover:scale-105 ${
                confirmDelete 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg' 
                  : 'bg-red-500/20 border border-red-400/30 hover:bg-red-500/30'
              }`}
            >
              <FaTrash className="mr-2 h-4 w-4" />
              {confirmDelete ? '¿Confirmar eliminación?' : 'Eliminar Asignatura'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            {/* Progress Card */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl border border-slate-600/30 p-8 text-center shadow-2xl">
              <ProgressRing progress={progress} />
              <h3 className="text-lg font-black text-white mt-6 mb-2">Progreso General</h3>
              <p className="text-slate-400 text-sm">
                {progress < 30 ? 'Recién comenzando' :
                 progress < 60 ? 'Avanzando bien' :
                 progress < 90 ? 'Casi completo' :
                 '¡Excelente trabajo!'}
              </p>
            </div>

            {/* Steps Navigation */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl border border-slate-600/30 p-6 shadow-2xl">
              <h3 className="text-lg font-black text-white mb-6">Pasos de Configuración</h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = validations[step.id]?.score >= 50;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 shadow-lg'
                          : isCompleted
                            ? 'bg-emerald-500/10 border border-emerald-400/20 hover:bg-emerald-500/20'
                            : 'bg-slate-700/30 border border-slate-600/20 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-blue-500' :
                          isCompleted ? 'bg-emerald-500' :
                          'bg-slate-600'
                        }`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-sm ${
                            isActive ? 'text-blue-300' :
                            isCompleted ? 'text-emerald-300' :
                            'text-slate-300'
                          }`}>
                            {step.title}
                          </h4>
                          <p className="text-xs text-slate-400">{step.description}</p>
                        </div>
                        {isCompleted && !isActive && (
                          <FaCheckCircle className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Preview */}
            <div className="xl:block hidden">
              <SubjectPreview
                formData={formData}
                evaluations={evaluations}
                hasExam={hasExam}
                examWeight={examWeight}
                examThreshold={examThreshold}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-9">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-3xl border border-slate-600/30 shadow-2xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 border-b border-slate-600/30 p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent mb-2">
                        {isEditing ? 'Editar Asignatura' : 'Nueva Asignatura'}
                      </h1>
                      <p className="text-slate-400 text-lg">
                        {steps[currentStep].description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Paso</p>
                        <p className="text-2xl font-black text-white">
                          {currentStep + 1} / {steps.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  {renderStepContent()}
                </div>

                {/* Form Footer */}
                <div className="bg-slate-800/50 border-t border-slate-600/30 p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="px-6 py-3 bg-slate-700/50 border border-slate-600/30 text-slate-300 hover:text-white hover:bg-slate-600/50 rounded-xl transition-all duration-300 flex items-center"
                        >
                          <FaArrowLeft className="mr-2 h-4 w-4" />
                          Anterior
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {currentStep < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(currentStep + 1)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
                        >
                          Siguiente
                          <FaChevronRight className="ml-2 h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-black shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <FaSyncAlt className="mr-3 h-5 w-5 animate-spin" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <FaSave className="mr-3 h-5 w-5" />
                              {isEditing ? 'Actualizar Asignatura' : 'Crear Asignatura'}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectForm;