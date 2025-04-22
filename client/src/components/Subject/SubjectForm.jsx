// src/components/Subject/SubjectForm.jsx
import React, { useState, useContext, useEffect } from 'react';
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
  FaRegClock,
  FaClipboardCheck,
  FaCalculator,
  FaGraduationCap as FaGradCap
} from 'react-icons/fa';

const SubjectForm = () => {
  const { createSubject, updateSubject, deleteSubject, subjects } = useContext(SubjectContext);
  const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'evaluations', 'advanced'
  const [formProgress, setFormProgress] = useState(0);
  const [hasExam, setHasExam] = useState(true);
  const [examThreshold, setExamThreshold] = useState(5.0);
  const [examInfo, setExamInfo] = useState(null);
  const [examWeight, setExamWeight] = useState(25); // Peso del examen adicional (25%)
  const navigate = useNavigate();
  const { id } = useParams();

  // Estado para manejar evaluaciones (formas de evaluación) - ahora sin incluir el examen
  const [evaluations, setEvaluations] = useState([
    { name: 'Prueba 1', weight: 50 },
    { name: 'Prueba 2', weight: 50 }
  ]);

  // Observar los campos del formulario para calcular progreso
  const watchedFields = watch(['name', 'teacher', 'description', 'semester', 'code', 'credits']);

  // Cargar datos de la asignatura si estamos en modo edición
  useEffect(() => {
    if (id && id !== 'new') {
      setIsEditing(true);
      const subject = subjects.find(s => s._id === id);
      
      if (subject) {
        // Cargar datos básicos
        setValue('name', subject.name);
        setValue('teacher', subject.teacher);
        setValue('description', subject.description);
        
        // Cargar datos adicionales si existen
        if (subject.semester) setValue('semester', subject.semester);
        if (subject.code) setValue('code', subject.code);
        if (subject.credits) setValue('credits', subject.credits);
        if (subject.passingGrade) setValue('passingGrade', subject.passingGrade);
        if (subject.examThreshold) {
          setExamThreshold(subject.examThreshold);
          setValue('examThreshold', subject.examThreshold);
        }
        
        // Cargar peso del examen si existe
        if (subject.examWeight) {
          setExamWeight(subject.examWeight);
          setValue('examWeight', subject.examWeight);
        }
        
        // Cargar evaluaciones si existen, excluyendo el examen
        if (subject.evaluations && subject.evaluations.length > 0) {
          // Filtrar evaluaciones que no son examen
          const courseEvaluations = subject.evaluations.filter(evalu => 
            !evalu.isExam && !evalu.name.toLowerCase().includes('examen') && !evalu.name.toLowerCase().includes('final')
          );
          setEvaluations(courseEvaluations);
          
          // Verificar si hay examen configurado
          setHasExam(subject.hasExam || false);
        }
      } else {
        toast.error('Asignatura no encontrada');
        navigate('/subjects');
      }
    }
  }, [id, subjects, setValue, navigate]);

  // Calcular progreso del formulario
  useEffect(() => {
    let progress = 0;
    
    // Verificar campos básicos
    if (watchedFields[0]) progress += 30; // Nombre (obligatorio)
    if (watchedFields[1]) progress += 10; // Profesor
    if (watchedFields[2]) progress += 10; // Descripción
    if (watchedFields[3]) progress += 10; // Semestre
    if (watchedFields[4]) progress += 5; // Código
    if (watchedFields[5]) progress += 5; // Créditos
    
    // Verificar evaluaciones
    if (evaluations.length > 0 && validateWeights()) {
      progress += 30;
    } else if (evaluations.length > 0) {
      progress += 15;
    }
    
    setFormProgress(progress > 100 ? 100 : progress);
  }, [watchedFields, evaluations]);

  // Verificar que las ponderaciones sumen 100%
  const validateWeights = () => {
    const totalWeight = evaluations.reduce((sum, evaluation) => sum + Number(evaluation.weight), 0);
    return Math.abs(totalWeight - 100) < 0.001; // Accounting for floating point precision
  };

  // Agregar una nueva evaluación
  const addEvaluation = () => {
    setEvaluations([...evaluations, { name: `Evaluación ${evaluations.length + 1}`, weight: 0 }]);
  };

  // Eliminar una evaluación
  const removeEvaluation = (index) => {
    if (evaluations.length <= 1) {
      toast.error('Debe haber al menos una evaluación');
      return;
    }
    
    const newEvaluations = [...evaluations];
    newEvaluations.splice(index, 1);
    setEvaluations(newEvaluations);
  };

  // Actualizar una evaluación
  const updateEvaluation = (index, field, value) => {
    const newEvaluations = [...evaluations];
    newEvaluations[index][field] = field === 'weight' ? Number(value) : value;
    setEvaluations(newEvaluations);
  };

  // Distribuir peso equitativamente
  const distributeWeightsEvenly = () => {
    const weight = Math.floor(100 / evaluations.length);
    const remainder = 100 - (weight * evaluations.length);
    
    const newEvaluations = evaluations.map((evalu, index) => ({
      ...evalu,
      weight: index === 0 ? weight + remainder : weight
    }));
    
    setEvaluations(newEvaluations);
  };

  // Calcular nota para eximirse del examen
  const calculateExamExemption = () => {
    if (!hasExam) {
      setExamInfo({
        status: 'no-exam',
        message: 'Esta asignatura no tiene examen configurado.'
      });
      return;
    }
    
    // En este sistema, el examen es adicional al 100% del curso
    // Por lo tanto, la nota para eximirse se aplica directamente al promedio final del curso
    const requiredGradeForExamExemption = examThreshold || 5.0; // Nota para eximirse
    
    setExamInfo({
      status: 'has-exam',
      examWeight: examWeight,
      exemptionThreshold: requiredGradeForExamExemption,
      requiredAverage: requiredGradeForExamExemption.toFixed(1),
      message: `Para eximirse del examen (${examWeight}% adicional) se necesita un promedio final de ${requiredGradeForExamExemption.toFixed(1)} en las evaluaciones del curso.`
    });
  };

  // Actualizar cuando cambian las evaluaciones o el umbral
  useEffect(() => {
    if (hasExam) {
      calculateExamExemption();
    } else {
      setExamInfo({
        status: 'no-exam',
        message: 'Esta asignatura no tiene examen configurado.'
      });
    }
  }, [evaluations, examThreshold, hasExam, examWeight]);

  const onSubmit = async (data) => {
    // Validar que las ponderaciones sumen 100%
    if (!validateWeights()) {
      toast.error('Las ponderaciones deben sumar exactamente 100%');
      setActiveTab('evaluations');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Agregar las evaluaciones, datos del examen y umbral de examen al formulario
      const subjectData = {
        ...data,
        evaluations,
        hasExam,
        examWeight: hasExam ? Number(examWeight) : null,
        examThreshold: hasExam ? Number(examThreshold) : null
      };
      
      // Crear o actualizar la asignatura
      let result;
      
      if (isEditing) {
        result = await updateSubject(id, subjectData);
      } else {
        result = await createSubject(subjectData);
      }
      
      if (result) {
        toast.success(`Asignatura ${isEditing ? 'actualizada' : 'creada'} con éxito`);
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
        toast.success('Asignatura eliminada con éxito');
        navigate('/subjects');
      }
    } catch (error) {
      console.error('Error al eliminar asignatura', error);
      toast.error('Error al eliminar la asignatura');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'evaluations':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-2 sm:mb-0">
                <FaBalanceScale className="mr-2 text-indigo-600" /> Plan de evaluación
              </h2>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={distributeWeightsEvenly}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
                >
                  <FaBalanceScale className="mr-1" /> Distribuir pesos equitativamente
                </button>
                
                <button
                  type="button"
                  onClick={addEvaluation}
                  className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 flex items-center transition-colors"
                >
                  <FaPlus className="mr-1" /> Agregar
                </button>
              </div>
            </div>

            <div className={`rounded-lg p-4 flex items-start ${validateWeights() 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-amber-50 border border-amber-200 text-amber-700'}`}
            >
              <div className="rounded-full p-2 bg-white mr-3 flex-shrink-0">
                {validateWeights() 
                  ? <FaCheckCircle className="text-green-500" /> 
                  : <FaExclamationTriangle className="text-amber-500" />
                }
              </div>
              <div>
                <p className="font-medium">{validateWeights() ? 'Plan de evaluación válido' : 'Atención'}</p>
                <p className="text-sm mt-1">
                  {validateWeights() 
                    ? 'Las ponderaciones suman exactamente 100%. Puedes guardar el formulario.'
                    : 'Las ponderaciones deben sumar exactamente 100%. Ajusta los valores antes de guardar.'}
                </p>
              </div>
            </div>

            {/* Panel de configuración de examen */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-start">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="hasExam"
                      className="form-check-input h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
                      checked={hasExam}
                      onChange={(e) => setHasExam(e.target.checked)}
                    />
                    <label htmlFor="hasExam" className="form-check-label ml-2 text-indigo-800 font-medium">
                      Esta asignatura tiene examen final adicional
                    </label>
                  </div>
                </div>
                
                {hasExam && (
                  <div className="mt-3 sm:mt-0 sm:ml-6 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
                      <label htmlFor="examWeight" className="text-sm text-indigo-800 mr-2 whitespace-nowrap">
                        Peso del examen:
                      </label>
                      <input
                        id="examWeight"
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        className="w-20 px-2 py-1 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={examWeight}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setExamWeight(val);
                          setValue('examWeight', val);
                        }}
                      />
                      <span className="ml-1 text-indigo-800">%</span>
                    </div>
                    
                    <div className="flex items-center">
                      <label htmlFor="examThreshold" className="text-sm text-indigo-800 mr-2 whitespace-nowrap">
                        Nota para eximirse:
                      </label>
                      <input
                        id="examThreshold"
                        type="number"
                        min="1"
                        max="7"
                        step="0.1"
                        className="w-20 px-2 py-1 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={examThreshold}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setExamThreshold(val);
                          setValue('examThreshold', val);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {hasExam && (
                <div className="mt-3">
                  <p className="text-sm text-indigo-700">
                    <FaInfoCircle className="inline mr-1" /> 
                    El examen es adicional al 100% del promedio del curso. Los estudiantes podrán eximirse con un promedio de {examThreshold} o superior.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-10 gap-4 bg-gray-50 px-4 py-3 border-b border-gray-200 font-medium text-gray-700">
                <div className="col-span-5 sm:col-span-6">Nombre de evaluación</div>
                <div className="col-span-3 sm:col-span-3">Ponderación (%)</div>
                <div className="col-span-2 text-center">Acción</div>
              </div>

              <div className="px-4 py-2 space-y-2 max-h-64 overflow-y-auto">
                {evaluations.map((evaluation, index) => (
                  <div key={index} className="grid grid-cols-10 gap-4 items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="col-span-5 sm:col-span-6">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={evaluation.name}
                        onChange={(e) => updateEvaluation(index, 'name', e.target.value)}
                        placeholder="Nombre"
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={evaluation.weight}
                          onChange={(e) => updateEvaluation(index, 'weight', e.target.value)}
                        />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 pointer-events-none">
                          %
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeEvaluation(index)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                        title="Eliminar evaluación"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {evaluations.length} {evaluations.length === 1 ? 'evaluación' : 'evaluaciones'} del curso (100%)
                </span>
                <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-gray-700 mr-2">Total:</span>
                  <span className={`font-bold text-lg ${validateWeights() ? 'text-green-600' : 'text-red-600'}`}>
                    {evaluations.reduce((sum, evaluationItem) => sum + Number(evaluationItem.weight), 0)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Información sobre eximición del examen */}
            {hasExam && examInfo && examInfo.status === 'has-exam' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-indigo-100 shadow-sm">
                <h3 className="text-indigo-800 font-semibold flex items-center mb-3">
                  <FaCalculator className="mr-2 text-indigo-600" /> Información sobre el examen
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-medium">Nota para eximirse</p>
                    <p className="text-2xl font-bold text-indigo-700">{examInfo.exemptionThreshold}</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-medium">Promedio necesario</p>
                    <p className="text-2xl font-bold text-indigo-700">{examInfo.requiredAverage}</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-medium">Peso del examen</p>
                    <p className="text-2xl font-bold text-indigo-700">{examInfo.examWeight}%</p>
                  </div>
                </div>
                
                <p className="text-indigo-700 text-sm">
                  <FaInfoCircle className="inline mr-1" /> {examInfo.message}
                </p>
              </div>
            )}
          </div>
        );
      
      case 'advanced':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <FaCog className="mr-2 text-indigo-600" /> Configuración avanzada
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="semester">
                  Semestre académico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    id="semester"
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: 2025-1"
                    {...register('semester')}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Formato recomendado: Año-Periodo (Ej: 2025-1, 2024-2)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                  Código de asignatura
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCode className="text-gray-400" />
                  </div>
                  <input
                    id="code"
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: MAT2001"
                    {...register('code')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="credits">
                  Créditos académicos
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUniversity className="text-gray-400" />
                  </div>
                  <input
                    id="credits"
                    type="number"
                    min="1"
                    max="20"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: 6"
                    {...register('credits')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="passingGrade">
                  Nota mínima de aprobación
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCheckCircle className="text-gray-400" />
                  </div>
                  <input
                    id="passingGrade"
                    type="number"
                    min="1"
                    max="7"
                    step="0.1"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: 4.0"
                    defaultValue="4.0"
                    {...register('passingGrade')}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Valor predeterminado: 4.0 (según sistema chileno)
                </p>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 mt-4">
              <div className="flex items-start">
                <FaInfoCircle className="text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-indigo-800 font-medium">Información avanzada</p>
                  <p className="text-indigo-600 text-sm mt-1">
                    Estos campos son opcionales pero te ayudarán a tener un seguimiento más detallado de tu rendimiento académico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default: // 'basic'
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <FaInfoCircle className="mr-2 text-indigo-600" /> Información básica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Nombre de la asignatura*
                </label>
                <input
                  id="name"
                  type="text"
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Ej: Matemáticas Aplicadas"
                  {...register('name', { required: 'El nombre es obligatorio' })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="mr-1" /> {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teacher">
                  Profesor
                  </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-gray-400" />
                  </div>
                  <input
                    id="teacher"
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: Juan Pérez"
                    {...register('teacher')}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Descripción
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
                placeholder="Describe brevemente el contenido o propósito de esta asignatura..."
                {...register('description')}
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Una breve descripción te ayudará a recordar el enfoque y contenido de la asignatura
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-start">
              <div className="bg-white rounded-full p-2 mr-3 text-blue-500 flex-shrink-0">
                <FaQuestion />
              </div>
              <div>
                <p className="text-blue-800 font-medium">Recomendaciones</p>
                <p className="text-blue-600 text-sm mt-1">
                  Completa toda la información que puedas para tener un mejor control de tus asignaturas. El nombre es el único campo obligatorio, pero te recomendamos completar también el profesor y la descripción.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/subjects" className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm font-medium">
            <FaArrowLeft className="mr-2" /> Volver a la lista de asignaturas
          </Link>
          
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-sm flex items-center ${
                confirmDelete 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <FaTrash className="mr-2" />
              {confirmDelete ? '¿Estás seguro?' : 'Eliminar asignatura'}
            </button>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Encabezado con progreso */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-8 py-6 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <FaBook className="mr-3" />
                  {isEditing ? 'Editar Asignatura' : 'Nueva Asignatura'}
                </h1>
                <p className="text-indigo-200 mt-1">
                  {isEditing 
                    ? 'Actualiza la información y el plan de evaluación' 
                    : 'Completa los datos para crear tu nueva asignatura'}
                </p>
              </div>
              
              {/* Indicador de progreso */}
              <div className="mt-4 md:mt-0 bg-white bg-opacity-20 rounded-lg py-2 px-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-full md:w-36 h-3 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <div 
                      className="h-3 bg-white transition-all duration-500" 
                      style={{ width: `${formProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm font-medium">{formProgress}%</span>
                </div>
                <p className="text-indigo-200 text-xs mt-1">Progreso del formulario</p>
              </div>
            </div>
            
            {/* Navegación por pestañas */}
            <div className="pt-6 mt-6 border-t border-white border-opacity-20">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                    activeTab === 'basic'
                      ? 'bg-white text-indigo-700'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <FaInfoCircle className="inline mr-2" /> Información Básica
                </button>
                <button
                  onClick={() => setActiveTab('evaluations')}
                  className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                    activeTab === 'evaluations'
                      ? 'bg-white text-indigo-700'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <FaBalanceScale className="inline mr-2" /> Plan de Evaluación
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                    activeTab === 'advanced'
                      ? 'bg-white text-indigo-700'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <FaCog className="inline mr-2" /> Configuración Avanzada
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            {renderTabContent()}
            
            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
              {activeTab !== 'basic' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'evaluations' ? 'basic' : 'evaluations')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Anterior
                </button>
              ) : (
                <div></div> 
              )}
              
              {activeTab !== 'advanced' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'basic' ? 'evaluations' : 'advanced')}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center"
                >
                  Siguiente <FaArrowLeft className="ml-2 transform rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center transition-colors shadow-md ${isSubmitting ? 'opacity-70' : ''}`}
                >
                  {isSubmitting ? <FaSyncAlt className="mr-2 animate-spin" /> : <FaSave className="mr-2" />}
                  {isSubmitting ? 'Guardando...' : 'Guardar asignatura'}
                </button>
              )}
            </div>
          </form>
        </div>
        
        {hasExam && examInfo && examInfo.status === 'has-exam' && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaGradCap className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Información de eximición</h3>
                <p className="mt-1 text-gray-600">
                  Para esta asignatura, los estudiantes necesitan un promedio de <span className="font-semibold text-indigo-700">{examInfo.requiredAverage}</span> antes 
                  del examen para eximirse. Si no alcanzan esta nota, deberán rendir el examen que vale {examInfo.examWeight}% adicional a la nota final.
                </p>
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-indigo-600 font-medium flex items-center">
                    <FaClipboardCheck className="mr-1" /> 
                    Nota de eximición configurada: {examThreshold}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaRegClock className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Consejo de tiempo</h3>
              <p className="mt-1 text-gray-600">
                Recuerda que puedes completar este formulario por etapas. El sistema guardará tu progreso cuando hagas clic en "Guardar asignatura".
              </p>
              <div className="mt-3 flex items-center">
                <span className="text-sm text-indigo-600 font-medium flex items-center">
                  <FaClipboardList className="mr-1" /> 
                  {formProgress < 50 
                    ? 'Te falta completar información importante' 
                    : formProgress < 100 
                      ? 'Vas por buen camino, completa los detalles restantes' 
                      : '¡Excelente! Has completado toda la información necesaria'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
      `}</style>
    </div>
  );
};

export default SubjectForm;