// src/components/Subject/SubjectDetail.jsx
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
  FaExclamationTriangle, 
  FaGraduationCap, 
  FaBook, 
  FaCalendarAlt, 
  FaChalkboardTeacher,
  FaFileAlt,
  FaClock,
  FaLightbulb,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaPencilAlt,
  FaHistory,
  FaRegClock,
  FaSyncAlt,
  FaUniversity,
  FaCalculator,
  FaClipboardCheck,
  FaMedal,
  FaExclamation,
  FaBan
} from 'react-icons/fa';

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subjects, selectedSubject, setSelectedSubject, addGrade, deleteGrade, calculateWeightedAverage, calculateRequiredGradeInfo } = useContext(SubjectContext);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [gradeToDelete, setGradeToDelete] = useState(null);
  const [requiredGradeInfo, setRequiredGradeInfo] = useState(null);
  const [examExemptionInfo, setExamExemptionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedScenarios, setExpandedScenarios] = useState(false);
  const [activeTab, setActiveTab] = useState('grades');
  const [chartData, setChartData] = useState([]);
  const [gradeFormStep, setGradeFormStep] = useState(1);
  const selectedEvaluationName = watch('evaluationName');

  const PASSING_GRADE = 4.0;

  useEffect(() => {
    setLoading(true);
    const subject = subjects.find(s => s._id === id);
    if (subject) {
      setSelectedSubject(subject);
      if (calculateRequiredGradeInfo) {
        const reqInfo = calculateRequiredGradeInfo(id, PASSING_GRADE);
        setRequiredGradeInfo(reqInfo);
      } else {
        console.warn("calculateRequiredGradeInfo function not found in context.");
        setRequiredGradeInfo({ status: 'error', message: 'Función de cálculo no disponible.' });
      }
      
      if (subject.grades && subject.grades.length > 0) {
        const chartDataArray = subject.grades.map(grade => ({
          name: grade.evaluationName,
          nota: parseFloat(grade.value),
          promedio: parseFloat(PASSING_GRADE),
          peso: parseFloat(grade.weight)
        }));
        setChartData(chartDataArray);
      }
      
      if (subject.hasExam) {
        calculateExamExemption(subject);
      }
      
      setLoading(false);
    } else {
      navigate('/subjects');
      toast.error('Asignatura no encontrada');
    }

    return () => {
      setSelectedSubject(null);
      setRequiredGradeInfo(null);
      setExamExemptionInfo(null);
      setLoading(true);
    }
  }, [id, subjects, setSelectedSubject, navigate, calculateRequiredGradeInfo]);

  useEffect(() => {
    if (selectedSubject) {
      if (calculateRequiredGradeInfo) {
        const reqInfo = calculateRequiredGradeInfo(id, PASSING_GRADE);
        setRequiredGradeInfo(reqInfo);
      }
      
      if (selectedSubject.grades && selectedSubject.grades.length > 0) {
        const chartDataArray = selectedSubject.grades.map(grade => ({
          name: grade.evaluationName,
          nota: parseFloat(grade.value),
          promedio: parseFloat(PASSING_GRADE),
          peso: parseFloat(grade.weight)
        }));
        setChartData(chartDataArray);
      } else {
        setChartData([]);
      }
      
      if (selectedSubject.hasExam) {
        calculateExamExemption(selectedSubject);
      }
    }
  }, [selectedSubject?.grades, selectedSubject?.evaluations, calculateRequiredGradeInfo, id]);

  const calculateExamExemption = (subject) => {
    if (!subject.hasExam) {
      setExamExemptionInfo({
        status: 'no-exam',
        message: 'Esta asignatura no tiene examen configurado.'
      });
      return;
    }
    
    const examWeight = subject.examWeight || 25;
    
    const examGrade = subject.grades?.find(g => 
      g.evaluationName.toLowerCase().includes('examen') || 
      g.evaluationName.toLowerCase().includes('final')
    );
    
    if (examGrade) {
      setExamExemptionInfo({
        status: 'exam-taken',
        examName: examGrade.evaluationName,
        grade: parseFloat(examGrade.value).toFixed(1),
        passing: parseFloat(examGrade.value) >= PASSING_GRADE,
        message: `Ya has rendido el examen con nota ${parseFloat(examGrade.value).toFixed(1)}.`
      });
      return;
    }
    
    const examThreshold = subject.examThreshold || 5.0;
    
    const courseGrades = subject.grades || [];
    
    if (courseGrades.length === 0) {
      setExamExemptionInfo({
        status: 'no-grades',
        examWeight,
        threshold: examThreshold,
        message: `No hay calificaciones registradas aún. Se necesita un promedio de ${examThreshold.toFixed(1)} para eximirse del examen.`
      });
      return;
    }
    
    const allEvaluationsTaken = subject.evaluations?.every(evalu => 
      subject.grades?.some(g => g.evaluationName === evalu.name)
    ) || false;
    
    let totalWeightedGrade = 0;
    let totalWeight = 0;
    
    courseGrades.forEach(grade => {
      const weight = parseFloat(grade.weight);
      if (!isNaN(weight) && weight > 0) {
        totalWeightedGrade += parseFloat(grade.value) * weight;
        totalWeight += weight;
      }
    });
    
    if (totalWeight === 0) {
      setExamExemptionInfo({
        status: 'error',
        message: 'Error al calcular el promedio ponderado de las evaluaciones.'
      });
      return;
    }
    
    const currentAverage = totalWeightedGrade / totalWeight;
    
    const canExempt = currentAverage >= examThreshold;
    
    let remainingGrades = [];
    if (!canExempt && !allEvaluationsTaken) {
      const pendingEvaluations = subject.evaluations?.filter(evalu => 
        !subject.grades?.some(g => g.evaluationName === evalu.name)
      ) || [];
      
      if (pendingEvaluations.length > 0) {
        const pendingWeight = pendingEvaluations.reduce((sum, evalu) => sum + parseFloat(evalu.weight), 0);
        
        if (pendingWeight > 0) {
          const neededGrade = ((examThreshold * (totalWeight + pendingWeight)) - totalWeightedGrade) / pendingWeight;
          
          if (neededGrade <= 7.0) {
            remainingGrades = pendingEvaluations.map(evalu => ({
              name: evalu.name,
              weight: evalu.weight,
              neededGrade: neededGrade.toFixed(1)
            }));
          }
        }
      }
    }
    
    setExamExemptionInfo({
      status: canExempt ? 'can-exempt' : (allEvaluationsTaken ? 'must-take-exam' : 'pending'),
      examWeight,
      threshold: examThreshold,
      currentAverage: currentAverage.toFixed(1),
      canExempt,
      allEvaluationsTaken,
      remainingGrades,
      message: canExempt 
        ? `¡Felicidades! Con un promedio de ${currentAverage.toFixed(1)}, puedes eximirte del examen (${examWeight}% adicional).`
        : allEvaluationsTaken
          ? `Con un promedio de ${currentAverage.toFixed(1)}, debes rendir el examen (${examWeight}% adicional). Necesitabas un ${examThreshold.toFixed(1)} para eximirte.`
          : `Tu promedio actual es ${currentAverage.toFixed(1)}. Necesitas un promedio de ${examThreshold.toFixed(1)} para eximirte del examen (${examWeight}% adicional).`
    });
  };

  useEffect(() => {
    if (selectedEvaluationName && gradeFormStep === 1) {
      const selectedEval = selectedSubject?.evaluations?.find(e => e.name === selectedEvaluationName);
      if (selectedEval) {
        setValue('weight', selectedEval.weight);
        setTimeout(() => setGradeFormStep(2), 100);
      }
    }
  }, [selectedEvaluationName, gradeFormStep, selectedSubject, setValue]);

  const { average, passing, gradeTotal } = useMemo(() => {
    if (!selectedSubject) return { average: 0, passing: false, gradeTotal: 0 };
    const result = calculateWeightedAverage(id, PASSING_GRADE);
    const total = selectedSubject.grades?.reduce((sum, grade) => {
      return sum + (parseFloat(grade.value) * parseFloat(grade.weight) / 100);
    }, 0) || 0;
    return { ...result, gradeTotal: parseFloat(total.toFixed(2)) };
  }, [selectedSubject, id, calculateWeightedAverage]);

  const evaluationProgress = useMemo(() => {
    if (!selectedSubject || !selectedSubject.evaluations || !selectedSubject.grades) return 0;
    if (selectedSubject.evaluations.length === 0) return 0;
    return Math.round((selectedSubject.grades.length / selectedSubject.evaluations.length) * 100);
  }, [selectedSubject]);

  const weightProgress = useMemo(() => {
    if (!selectedSubject || !selectedSubject.grades) return 0;
    return selectedSubject.grades.reduce((sum, grade) => {
      return sum + parseFloat(grade.weight || 0);
    }, 0);
  }, [selectedSubject]);

  const onSubmitGrade = async (data) => {
    const evaluation = selectedSubject.evaluations.find(e => e.name === data.evaluationName);
    if (!evaluation) {
      toast.error('La evaluación seleccionada no existe en la configuración de la asignatura.');
      return;
    }

    const existingGrade = selectedSubject.grades?.find(g => g.evaluationName === data.evaluationName);
    if (existingGrade) {
      toast.warn(`Ya existe una calificación para ${data.evaluationName}. Edítala o elimínala primero.`);
      return;
    }

    const gradeData = {
      ...data,
      value: parseFloat(data.value),
      weight: parseFloat(evaluation.weight)
    };

    if (isNaN(gradeData.weight)) {
      toast.error(`La ponderación para ${evaluation.name} no es válida. Revisa la configuración de la asignatura.`);
      return;
    }

    try {
      const result = await addGrade(id, gradeData);

      if (result) {
        setShowGradeForm(false);
        setGradeFormStep(1);
        reset();
        toast.success('Calificación agregada con éxito');
      }
    } catch (error) {
      toast.error('Error al agregar la calificación');
      console.error('Error al agregar calificación:', error);
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (gradeToDelete === gradeId) {
      try {
        const success = await deleteGrade(id, gradeId);
        if (success) {
          setGradeToDelete(null);
          toast.success('Calificación eliminada con éxito');
        } else {
          setGradeToDelete(null);
          toast.error('Error al eliminar la calificación');
        }
      } catch (error) {
        console.error('Error al eliminar calificación:', error);
        toast.error('Error al eliminar la calificación');
        setGradeToDelete(null);
      }
    } else {
      setGradeToDelete(gradeId);
      setTimeout(() => setGradeToDelete(null), 3000);
    }
  };

  const getRequiredGradeStatusVisuals = (status) => {
    switch (status) {
      case 'passed':
      case 'passed_pending':
      case 'easy_pass':
      case 'can-exempt':
        return { icon: FaCheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      case 'possible':
      case 'pending':
        return { icon: FaInfoCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
      case 'difficult':
        return { icon: FaExclamationTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      case 'failed_impossible':
      case 'must-take-exam':
        return { icon: FaTimesCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      case 'warning':
        return { icon: FaExclamationTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      case 'info':
      case 'no-grades':
        return { icon: FaInfoCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
      case 'error':
        return { icon: FaExclamation, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      case 'no-exam':
        return { icon: FaBan, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
      default:
        return { icon: FaExclamationTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    }
  };

  const requiredVisuals = requiredGradeInfo ? getRequiredGradeStatusVisuals(requiredGradeInfo.status) : getRequiredGradeStatusVisuals('error');
  const RequiredIcon = requiredVisuals.icon;
  
  const examVisuals = examExemptionInfo ? getRequiredGradeStatusVisuals(examExemptionInfo.status) : getRequiredGradeStatusVisuals('no-exam');
  const ExamIcon = examVisuals.icon;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center max-w-md w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cargando asignatura</h2>
          <p className="text-gray-600 text-center">Estamos obteniendo todos los detalles de tu asignatura...</p>
        </div>
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md w-full">
          <FaExclamationTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Asignatura no encontrada</h2>
          <p className="text-gray-600 mb-6">No pudimos encontrar los detalles de esta asignatura.</p>
          <button 
            onClick={() => navigate('/subjects')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Volver a asignaturas
          </button>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'exam':
        return (
          <div className="mt-6 animate-fade-in space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <FaGraduationCap className="mr-3 text-indigo-600" /> 
              Información sobre Examen
            </h3>
            
            {!selectedSubject.hasExam ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-700 shadow-sm">
                <div className="flex items-center mb-3">
                  <FaBan className="mr-3 h-8 w-8 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Esta asignatura no tiene examen configurado</h3>
                </div>
                <p className="mb-4">De acuerdo a la configuración, esta asignatura no tiene un examen final del cual eximirse.</p>
                <Link
                  to={`/subjects/edit/${id}`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                >
                  <FaEdit className="mr-2" /> Configurar asignatura
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`bg-white rounded-xl p-6 border ${examVisuals.borderColor} shadow-md`}>
                  <div className="flex items-start">
                    <div className={`p-4 rounded-full ${examVisuals.bgColor} mr-4`}>
                      <ExamIcon className={`h-8 w-8 ${examVisuals.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {examExemptionInfo?.status === 'can-exempt' ? '¡Puedes eximirte del examen!' :
                         examExemptionInfo?.status === 'must-take-exam' ? 'Debes rendir el examen' :
                         examExemptionInfo?.status === 'exam-taken' ? 'Ya rendiste el examen' :
                         examExemptionInfo?.status === 'pending' ? 'Aún puedes eximirte' :
                         'Estado del examen'}
                      </h3>
                      <p className="text-gray-600">
                        {examExemptionInfo?.message || 'No hay información disponible sobre el estado del examen.'}
                      </p>
                    </div>
                  </div>
                  
                  {examExemptionInfo && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-xs text-gray-500 font-medium mb-1">Umbral de eximición</p>
                          <p className="text-xl font-bold text-indigo-700">{examExemptionInfo.threshold?.toFixed(1) || '5.0'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-xs text-gray-500 font-medium mb-1">Promedio actual</p>
                          <p className={`text-xl font-bold ${
                            examExemptionInfo.status === 'can-exempt' ? 'text-green-600' :
                            examExemptionInfo.status === 'must-take-exam' ? 'text-red-600' :
                            'text-gray-700'
                          }`}>
                            {examExemptionInfo.currentAverage || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-xs text-gray-500 font-medium mb-1">Peso del examen</p>
                          <p className="text-xl font-bold text-gray-700">{examExemptionInfo.examWeight || 0}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {examExemptionInfo?.status === 'pending' && examExemptionInfo.remainingGrades && examExemptionInfo.remainingGrades.length > 0 && (
                  <div className="bg-white rounded-xl border border-indigo-100 shadow-md overflow-hidden">
                    <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                      <h4 className="font-semibold text-indigo-800 flex items-center">
                        <FaCalculator className="mr-2" /> Notas necesarias para eximirse
                      </h4>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">
                        Para alcanzar el promedio necesario de <strong>{examExemptionInfo.threshold.toFixed(1)}</strong> y eximirte 
                        del examen, necesitas obtener estas calificaciones en las evaluaciones pendientes:
                      </p>
                      
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {examExemptionInfo.remainingGrades.map((grade, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b border-indigo-100 last:border-0">
                              <div>
                                <span className="font-medium text-gray-900">{grade.name}</span>
                                <span className="text-gray-500 text-sm ml-2">({grade.weight}%)</span>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                parseFloat(grade.neededGrade) <= 7.0 
                                  ? parseFloat(grade.neededGrade) <= 4.0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {parseFloat(grade.neededGrade) <= 7.0 
                                  ? grade.neededGrade
                                  : 'Imposible'}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {parseFloat(examExemptionInfo.remainingGrades[0].neededGrade) > 7.0 && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                          <FaExclamationTriangle className="inline mr-2" /> 
                          Ya no es matemáticamente posible eximirse del examen, pues necesitarías una nota superior a 7.0.
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {examExemptionInfo?.status === 'exam-taken' && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-full ${parseFloat(examExemptionInfo.grade) >= PASSING_GRADE ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
                        {parseFloat(examExemptionInfo.grade) >= PASSING_GRADE 
                          ? <FaCheckCircle className="h-6 w-6 text-green-600" />
                          : <FaTimesCircle className="h-6 w-6 text-red-600" />
                        }
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Resultado del examen</h4>
                        <p className="text-gray-600">
                          Has obtenido un <span className={`font-bold ${parseFloat(examExemptionInfo.grade) >= PASSING_GRADE ? 'text-green-600' : 'text-red-600'}`}>
                            {examExemptionInfo.grade}
                          </span> en el examen.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {examExemptionInfo?.status === 'must-take-exam' && (
                  <div className="bg-white rounded-xl border border-indigo-100 shadow-md p-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FaCalculator className="mr-2 text-indigo-600" /> Simulador de nota final
                    </h4>
                    
                    <p className="text-gray-600 mb-4">
                      Ya has rendido todas las evaluaciones previas y tu promedio actual es <strong>{examExemptionInfo.currentAverage}</strong>, 
                      por lo que debes rendir el examen. Aquí puedes simular cómo afectaría tu promedio final la nota que obtengas en el examen.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                      <div className="col-span-3 bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-2">Simulador: ¿Qué nota necesitas en el examen?</p>
                        <div className="flex items-center">
                          <div className="flex-1">
                            <input
                              type="range"
                              min="1.0"
                              max="7.0"
                              step="0.1"
                              defaultValue="4.0"
                              className="w-full"
                              onChange={(e) => {
                                const examGrade = parseFloat(e.target.value);
                                const currentAvg = parseFloat(examExemptionInfo.currentAverage);
                                const examWeight = parseFloat(examExemptionInfo.examWeight);
                                
                                const finalAvg = (currentAvg * 100 + examGrade * examWeight) / (100 + examWeight);
                                
                                document.getElementById('exam-grade-display').textContent = examGrade.toFixed(1);
                                document.getElementById('final-avg-display').textContent = finalAvg.toFixed(1);
                                
                                const finalAvgElement = document.getElementById('final-avg-display');
                                if (finalAvg >= PASSING_GRADE) {
                                  finalAvgElement.className = 'text-2xl font-bold text-green-600';
                                } else {
                                  finalAvgElement.className = 'text-2xl font-bold text-red-600';
                                }
                              }}
                            />
                          </div>
                          <div className="ml-4 bg-white px-3 py-2 rounded-lg border border-gray-200 min-w-[60px] text-center">
                            <span id="exam-grade-display" className="text-lg font-bold text-indigo-600">4.0</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-2 bg-indigo-50 rounded-lg p-4 flex flex-col items-center justify-center">
                        <p className="text-sm text-indigo-700 mb-1">Promedio final estimado</p>
                        <span id="final-avg-display" className="text-2xl font-bold text-red-600">
                          {((parseFloat(examExemptionInfo.currentAverage) * 100 + 
                             (4.0 * examExemptionInfo.examWeight)) / (100 + examExemptionInfo.examWeight)).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm">
                      <FaInfoCircle className="inline mr-2" /> 
                      Para aprobar la asignatura con un {PASSING_GRADE.toFixed(1)}, necesitas obtener al menos un 
                      <strong> {Math.max(1.0, ((PASSING_GRADE * (100 + examExemptionInfo.examWeight)) - (parseFloat(examExemptionInfo.currentAverage) * 100)) / examExemptionInfo.examWeight).toFixed(1)}</strong> en el examen.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'evaluations':
        return (
          <div className="mt-6 animate-fade-in">
            {selectedSubject.evaluations && selectedSubject.evaluations.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Evaluación</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ponderación</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Calificación</th>
                      {selectedSubject.hasExam && (
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedSubject.evaluations.map((evaluation) => {
                      const grade = selectedSubject.grades?.find(g => g.evaluationName === evaluation.name);
                      const weight = parseFloat(evaluation.weight);
                      const hasGrade = !!grade;
                      const isExam = evaluation.isExam;
                      return (
                        <tr key={evaluation.name} className={`hover:bg-gray-50 transition duration-150 ${isExam ? 'bg-indigo-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-10 rounded mr-3 ${hasGrade ? (parseFloat(grade.value) >= PASSING_GRADE ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300'}`}></div>
                              <div>
                                <div className="font-medium text-gray-900 flex items-center">
                                  {evaluation.name}
                                  {isExam && <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Examen</span>}
                                </div>
                                {evaluation.description && (
                                  <div className="text-xs text-gray-500">{evaluation.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                            <div className="flex items-center justify-center">
                              <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div className="bg-indigo-600 h-1.5 rounded-full" style={{width: `${weight}%`}}></div>
                              </div>
                              <span className="font-medium">{!isNaN(weight) ? `${weight}%` : 'Inválida'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {hasGrade ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaCheckCircle className="mr-1" /> Completada
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <FaRegClock className="mr-1" /> Pendiente
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {hasGrade ? (
                              <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium ${parseFloat(grade.value) >= PASSING_GRADE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {parseFloat(grade.value).toFixed(1)}
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowGradeForm(true);
                                  setGradeFormStep(1);
                                  setValue('evaluationName', evaluation.name);
                                  setActiveTab('grades');
                                }}
                                className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs hover:bg-indigo-100 transition"
                              >
                                <FaPlus className="inline mr-1" /> Agregar
                              </button>
                            )}
                          </td>
                          {selectedSubject.hasExam && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              {isExam ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  <FaGraduationCap className="mr-1" /> Examen Final
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Parcial
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-6 py-3 text-right text-xs text-gray-600 uppercase">Total Ponderación:</td>
                      <td className="px-6 py-3 text-center text-xs text-gray-800">
                        {selectedSubject.evaluations.reduce((sum, e) => sum + (parseFloat(e.weight) || 0), 0)}%
                      </td>
                      <td colSpan={selectedSubject.hasExam ? 3 : 2} className="px-6 py-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-700 shadow-sm">
                <div className="flex items-center mb-3">
                  <FaExclamationTriangle className="mr-3 h-8 w-8 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-yellow-800">No hay un plan de evaluación definido</h3>
                </div>
                <p className="mb-4">Esta asignatura no tiene un esquema de evaluación configurado. Edítala para agregar evaluaciones y poder registrar calificaciones.</p>
                <Link
                  to={`/subjects/edit/${id}`}
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition shadow-sm"
                >
                  <FaEdit className="mr-2" /> Configurar evaluaciones
                </Link>
              </div>
            )}
            
            {selectedSubject.hasExam && (
              <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-indigo-800">
                <div className="flex items-start">
                  <FaInfoCircle className="mt-1 mr-3 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-indigo-800 mb-1">Información de examen</h3>
                    <p className="text-indigo-700 text-sm mb-2">
                      Esta asignatura tiene un examen final adicional con peso de {selectedSubject.examWeight || 25}%. Los estudiantes pueden eximirse con un promedio igual o superior a {selectedSubject.examThreshold || 5.0}.
                    </p>
                    <button
                      onClick={() => setActiveTab('exam')}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center"
                    >
                      <FaGraduationCap className="mr-1" /> Ver detalles del examen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'analytics':
        return (
          <div className="mt-6 animate-fade-in space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-indigo-600" /> Rendimiento por Evaluación
                </h3>
                
                {chartData.length > 0 ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full h-full flex items-end justify-around space-x-2 pb-6 relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gray-300"></div>
                      <div className="absolute left-0 bottom-4 border-t border-dashed border-red-300 w-full"></div>
                      <div className="absolute left-0 bottom-4 text-xs text-red-500">4.0</div>
                      
                      {selectedSubject.hasExam && (
                        <div className="absolute left-0 bottom-[72px] border-t border-dashed border-blue-300 w-full"></div>
                      )}
                      {selectedSubject.hasExam && (
                        <div className="absolute left-0 bottom-[72px] text-xs text-blue-500">{selectedSubject.examThreshold || 5.0}</div>
                      )}
                      
                      {chartData.map((item, index) => (
                        <div key={index} className="flex flex-col items-center" style={{width: `${100 / chartData.length}%`}}>
                          <div className="text-xs font-medium text-indigo-600 mb-1">{item.nota.toFixed(1)}</div>
                          <div 
                            className={`w-12 ${
                              selectedSubject.hasExam && item.nota >= (selectedSubject.examThreshold || 5.0) 
                                ? 'bg-blue-400' 
                                : item.nota >= PASSING_GRADE 
                                  ? 'bg-green-400' 
                                  : 'bg-red-400'
                            } rounded-t`}
                            style={{height: `${(item.nota / 7) * 100}%`}}
                          ></div>
                          <div className="text-xs text-gray-600 mt-2 truncate w-16 text-center" title={item.name}>
                            {item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center text-gray-500">
                      <FaChartLine className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                      <p>No hay calificaciones registradas para visualizar</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaLightbulb className="mr-2 text-indigo-600" /> Análisis y Recomendaciones
                </h3>
                
                {requiredGradeInfo && (
                  <div className={`p-4 rounded-lg border ${requiredVisuals.borderColor} ${requiredVisuals.bgColor} mb-4`}>
                    <div className="flex items-start">
                      <RequiredIcon className={`mr-3 mt-1 flex-shrink-0 ${requiredVisuals.color}`} size="1.2em" />
                      <p className={`text-sm ${requiredVisuals.color.replace('-600', '-800')}`}>
                        {requiredGradeInfo.message}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedSubject.hasExam && examExemptionInfo && examExemptionInfo.status !== 'no-exam' && (
                  <div className={`p-4 rounded-lg border ${examVisuals.borderColor} ${examVisuals.bgColor} mb-4`}>
                    <div className="flex items-start">
                      <ExamIcon className={`mr-3 mt-1 flex-shrink-0 ${examVisuals.color}`} size="1.2em" />
                      <div>
                        <p className={`text-sm font-medium ${examVisuals.color.replace('-600', '-800')}`}>
                          {examExemptionInfo.status === 'can-exempt' ? '¡Puedes eximirte del examen!' :
                           examExemptionInfo.status === 'must-take-exam' ? 'Debes rendir el examen' :
                           examExemptionInfo.status === 'exam-taken' ? 'Ya rendiste el examen' :
                           examExemptionInfo.status === 'pending' ? 'Aún puedes eximirte del examen' :
                           'Estado del examen'}
                        </p>
                        <p className={`text-xs mt-1 ${examVisuals.color.replace('-600', '-700')}`}>
                          {examExemptionInfo.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-indigo-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-indigo-100 text-indigo-600 mr-3">
                        <FaTrophy />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600 font-medium">Rendimiento</p>
                        <p className="text-gray-800 font-semibold text-sm">
                          {passing ? 'Aprobando actualmente' : 'En riesgo de reprobación'}
                        </p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${passing ? 'text-green-600' : 'text-red-600'}`}>
                      {average.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-700 text-sm">Progreso en evaluaciones</div>
                    <div className="text-gray-700 text-sm font-medium">{evaluationProgress}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${evaluationProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-700 text-sm">Ponderación evaluada</div>
                    <div className="text-gray-700 text-sm font-medium">{weightProgress}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${weightProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-700 text-sm">Puntos acumulados</div>
                    <div className="text-gray-700 text-sm font-medium">{gradeTotal} pts</div>
                  </div>
                </div>
              </div>
            </div>
            
            {requiredGradeInfo && requiredGradeInfo.scenarios && requiredGradeInfo.scenarios.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaLightbulb className="mr-2 text-yellow-500" /> Escenarios para Aprobar
                  </h3>
                  <button 
                    onClick={() => setExpandedScenarios(!expandedScenarios)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                  >
                    {expandedScenarios ? (
                      <>Ocultar detalles <FaChevronUp className="ml-1" /></>
                    ) : (
                      <>Ver detalles <FaChevronDown className="ml-1" /></>
                    )}
                  </button>
                </div>
                
                {expandedScenarios ? (
                  <div className="space-y-4 animate-fade-in">
                    {requiredGradeInfo.scenarios.map((scenario, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h4 className="font-medium text-gray-800">{scenario.name}</h4>
                          <p className="text-xs text-gray-600">{scenario.description}</p>
                        </div>
                        <div className="p-4">
                          <ul className="space-y-2">
                            {scenario.grades.map((gradeItem, gradeIndex) => {
                              const existingGrade = selectedSubject.grades?.find(g => g.evaluationName === gradeItem.name);
                              const evaluation = selectedSubject.evaluations?.find(e => e.name === gradeItem.name);
                              const isExam = evaluation?.isExam;
                              
                              return (
                                <li key={gradeIndex} className={`flex justify-between items-center text-sm ${isExam ? 'bg-indigo-50' : 'bg-gray-50'} p-2 rounded`}>
                                  <div className="flex items-center">
                                    {existingGrade ? (
                                      <FaCheckCircle className="text-green-500 mr-2" />
                                    ) : (
                                      <FaRegClock className="text-gray-400 mr-2" />
                                    )}
                                    <span className="text-gray-700">
                                      {gradeItem.name} <span className="text-gray-500 text-xs">({gradeItem.weight}%)</span>
                                      {isExam && <span className="ml-1 text-xs bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded-full">Examen</span>}
                                    </span>
                                  </div>
                                  <span className={`font-medium px-2 py-0.5 rounded ${parseFloat(gradeItem.grade) >= PASSING_GRADE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {existingGrade ? parseFloat(existingGrade.value).toFixed(1) + ' → ' : ''}
                                    {gradeItem.grade}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600 text-sm italic">
                    Hay {requiredGradeInfo.scenarios.length} escenarios posibles para aprobar. Haz clic en "Ver detalles" para visualizarlos.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="mt-6 animate-fade-in">
            {showGradeForm && (
              <div className="bg-white border border-indigo-200 rounded-xl p-6 mb-8 animate-fade-in shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                    <FaPlus className="mr-2 text-indigo-600" /> 
                    {gradeFormStep === 1? 'Agregar Nueva Calificación' 
                   : `Nueva Calificación: ${selectedEvaluationName}`}
                  </h3>
                  <button
                    onClick={() => {
                      setShowGradeForm(false);
                      setGradeFormStep(1);
                      reset();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Cerrar formulario"
                  >
                    <FaTimesCircle size="1.2em" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${gradeFormStep === 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-800'}`}>
                      1
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${gradeFormStep === 2 ? 'bg-indigo-600' : 'bg-indigo-200'}`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${gradeFormStep === 2 ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-800'}`}>
                      2
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-600">Selección</span>
                    <span className="text-xs text-gray-600">Calificación</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmitGrade)} className="space-y-5">
                  {gradeFormStep === 1 ? (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="evaluationName">
                        Seleccione la evaluación a calificar*
                      </label>
                      <select
                        id="evaluationName"
                        className={`w-full px-3 py-2 rounded-lg border ${errors.evaluationName ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150`}
                        {...register('evaluationName', { required: 'Seleccione una evaluación' })}
                      >
                        <option value="">-- Seleccionar evaluación --</option>
                        {selectedSubject.evaluations
                          .filter(evaluation => !selectedSubject.grades?.some(g => g.evaluationName === evaluation.name))
                          .map((evaluation) => (
                            <option key={evaluation.name} value={evaluation.name}>
                              {evaluation.name} ({evaluation.weight}%) {evaluation.isExam ? '(Examen)' : ''}
                            </option>
                          ))}
                        {selectedSubject.evaluations.length > 0 && selectedSubject.evaluations.every(evaluation => selectedSubject.grades?.some(g => g.evaluationName === evaluation.name)) && (
                          <option value="" disabled>Todas las evaluaciones ya tienen nota</option>
                        )}
                      </select>
                      {errors.evaluationName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaExclamationTriangle className="mr-1" /> {errors.evaluationName.message}
                        </p>
                      )}
                      
                      {!selectedSubject.evaluations || selectedSubject.evaluations.length === 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border-yellow-200 rounded-lg text-sm text-yellow-800">
                          <FaExclamationTriangle className="inline mr-1" /> 
                          No hay evaluaciones configuradas. Por favor, edite la asignatura para agregar el plan de evaluación.
                        </div>
                      )}
                      
                      <div className="text-right mt-4">
                        <button
                          type="button"
                          onClick={() => setGradeFormStep(2)}
                          disabled={!selectedEvaluationName}
                          className={`px-5 py-2 rounded-lg inline-flex items-center font-medium text-sm transition ${
                            selectedEvaluationName 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Continuar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-in space-y-5">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-sm font-medium text-gray-700" htmlFor="value">
                            Calificación (1.0 - 7.0)*
                          </label>
                          <span className="text-xs text-gray-500">
                            Nota mínima aprobación: {PASSING_GRADE.toFixed(1)}
                          </span>
                        </div>
                        
                        <div className="relative">
                          <input
                            id="value"
                            type="number"
                            step="0.1"
                            min="1.0"
                            max="7.0"
                            className={`w-full px-3 py-2 rounded-lg border ${errors.value ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150`}
                            placeholder="Ej: 5.5"
                            {...register('value', {
                              required: 'La calificación es obligatoria',
                              min: { value: 1.0, message: 'La nota mínima es 1.0' },
                              max: { value: 7.0, message: 'La nota máxima es 7.0' },
                              valueAsNumber: true,
                              validate: value => !isNaN(value) || "Ingrese un número válido"
                            })}
                          />
                          <div className="absolute right-0 inset-y-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500">/ 7.0</span>
                          </div>
                        </div>
                        
                        {errors.value && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <FaExclamationTriangle className="mr-1" /> {errors.value.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="note">
                          Comentario (opcional)
                        </label>
                        <textarea id="note"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                          rows="2"
                          placeholder="Anotación sobre esta calificación..."
                          {...register('note')}
                        ></textarea>
                      </div>
                      
                      <div className="pt-2 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setGradeFormStep(1)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition inline-flex items-center text-sm"
                        >
                          <FaArrowLeft className="mr-1" /> Volver
                        </button>
                        
                        <button
                          type="submit"
                          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition inline-flex items-center font-medium text-sm"
                        >
                          <FaCheckCircle className="mr-2" /> Guardar Calificación
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}

            {selectedSubject.grades && selectedSubject.grades.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Evaluación / Comentario</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Calificación</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ponderación</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Registro</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedSubject.grades.map((grade) => {
                      const evaluation = selectedSubject.evaluations?.find(e => e.name === grade.evaluationName);
                      const isExam = evaluation?.isExam;
                      
                      return (
                        <tr key={grade._id} className={`hover:bg-gray-50 transition duration-150 ${isExam ? 'bg-indigo-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-normal">
                            <div className="flex items-start">
                              <span className="font-medium text-gray-900">{grade.evaluationName}</span>
                              {isExam && <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Examen</span>}
                            </div>
                            {grade.note && (
                              <p className="text-sm text-gray-500 mt-1 italic">{grade.note}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                parseFloat(grade.value) >= (isExam ? PASSING_GRADE : (selectedSubject.examThreshold || 5.0))
                                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' 
                                  : 'bg-gradient-to-br from-red-400 to-red-600 text-white'
                              } text-lg font-bold shadow-md`}
                              >
                                {parseFloat(grade.value).toFixed(1)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-medium text-gray-900">{!isNaN(parseFloat(grade.weight)) ? `${parseFloat(grade.weight)}%` : 'N/A'}</span>
                              <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1.5">
                                <div 
                                  className="bg-indigo-600 h-1.5 rounded-full" 
                                  style={{width: `${parseFloat(grade.weight)}%`}}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center text-gray-600">
                              <FaHistory className="mr-2 text-gray-400" />
                              <span>{new Date(grade.createdAt).toLocaleDateString('es-CL')}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleDeleteGrade(grade._id)}
                              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                gradeToDelete === grade._id
                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              <FaTrash className={`inline mr-1 ${gradeToDelete === grade._id ? 'animate-pulse' : ''}`} />
                              {gradeToDelete === grade._id ? 'Confirmar' : 'Eliminar'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              !showGradeForm && (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-lg">
                  <div className="flex flex-col items-center max-w-md mx-auto">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                      <FaFileAlt className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Sin calificaciones registradas</h3>
                    <p className="text-gray-600 mb-6">Aún no has registrado ninguna calificación para esta asignatura. Comienza agregando tu primera nota.</p>
                    
                    {selectedSubject.evaluations && selectedSubject.evaluations.length > 0 ? (
                      <button
                        onClick={() => setShowGradeForm(true)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md inline-flex items-center"
                      >
                        <FaPlus className="mr-2" /> Agregar Primera Calificación
                      </button>
                    ) : (
                      <Link
                        to={`/subjects/edit/${id}`}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md inline-flex items-center"
                      >
                        <FaEdit className="mr-2" /> Configurar Evaluaciones
                      </Link>
                    )}
                  </div>
                </div>
              )
            )}
            
            {selectedSubject.grades && selectedSubject.grades.length > 0 && !showGradeForm && (
              <div className="mt-4 text-right">
                <button
                  onClick={() => setShowGradeForm(true)}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md inline-flex items-center"
                >
                  <FaPlus className="mr-2" /> Agregar Nueva Calificación
                </button>
              </div>
            )}
            
            {selectedSubject.hasExam && !showGradeForm && (
              <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-start">
                <FaGraduationCap className="text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-indigo-800 font-medium">Esta asignatura tiene examen final adicional ({selectedSubject.examWeight || 25}%)</p>
                  <p className="text-indigo-700 text-sm">
                    {examExemptionInfo?.status === 'can-exempt'
                      ? `¡Felicidades! Con tu promedio actual puedes eximirte del examen.`
                      : examExemptionInfo?.status === 'must-take-exam'
                      ? `Con tu promedio actual debes rendir el examen. Necesitabas un ${selectedSubject.examThreshold || 5.0} para eximirte.`
                      : examExemptionInfo?.status === 'exam-taken'
                      ? `Ya has rendido el examen con nota ${examExemptionInfo.grade}.`
                      : `Los estudiantes se pueden eximir con un promedio igual o superior a ${selectedSubject.examThreshold || 5.0}.`}
                  </p>
                  <button
                    onClick={() => setActiveTab('exam')}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-1 inline-flex items-center"
                  >
                    Ver detalles del examen
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/subjects')}
              className="mr-4 text-gray-500 hover:text-indigo-600 transition"
              aria-label="Volver a asignaturas"
            >
              <FaArrowLeft size="1.2em" />
            </button>
            <div className="flex-1 truncate">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                {selectedSubject.name}
              </h1>
            </div>
            <div className="flex space-x-3">
              <Link 
                to={`/subjects/edit/${id}`} 
                className="inline-flex items-center px-3 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition text-sm font-medium"
              >
                <FaEdit className="md:mr-2" />
                <span className="hidden md:inline">Editar Asignatura</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <FaInfoCircle className="mr-2 text-indigo-600" /> Información
              </h2>
              
              <div className="space-y-4">
                {selectedSubject.teacher && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <FaChalkboardTeacher className="text-indigo-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500">Profesor</p>
                      <p className="text-gray-800 font-medium">{selectedSubject.teacher}</p>
                    </div>
                  </div>
                )}
                
                {selectedSubject.semester && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <FaCalendarAlt className="text-indigo-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500">Semestre</p>
                      <p className="text-gray-800 font-medium">{selectedSubject.semester}</p>
                    </div>
                  </div>
                )}
                
                {selectedSubject.code && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <FaFileAlt className="text-indigo-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500">Código</p>
                      <p className="text-gray-800 font-medium">{selectedSubject.code}</p>
                    </div>
                  </div>
                )}
                
                {selectedSubject.credits && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <FaUniversity className="text-indigo-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500">Créditos</p>
                      <p className="text-gray-800 font-medium">{selectedSubject.credits}</p>
                    </div>
                  </div>
                )}
                
                {selectedSubject.hasExam && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <FaGraduationCap className="text-indigo-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500">Examen</p>
                      <p className="text-gray-800 font-medium">
                        Peso adicional: {selectedSubject.examWeight || 25}%<br/>
                        Nota para eximirse: {selectedSubject.examThreshold || 5.0}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedSubject.description && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Descripción</p>
                    <p className="text-gray-700 text-sm">{selectedSubject.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <FaChartLine className="mr-2 text-indigo-600" /> Promedio Actual
              </h2>
              
              <div className="flex flex-col items-center">
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${passing ? 'bg-green-50' : 'bg-red-50'} mb-4 shadow-inner`}>
                  <svg className="absolute inset-0" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke={passing ? '#10B981' : '#EF4444'}
                      strokeWidth="8"
                      strokeDasharray={`${(average / 7) * 289} 289`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className={`relative text-4xl font-bold ${passing ? 'text-green-600' : 'text-red-600'}`}>
                    {average.toFixed(1)}
                  </span>
                </div>
                
                <p className={`text-sm font-medium ${passing ? 'text-green-600' : 'text-red-600'} flex items-center mb-1`}>
                  {passing ? (
                    <>
                      <FaCheckCircle className="mr-1" /> Aprobando actualmente
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="mr-1" /> En riesgo de reprobación
                    </>
                  )}
                </p>
                <p className="text-gray-500 text-xs">Nota mínima de aprobación: {PASSING_GRADE.toFixed(1)}</p>
                
                <div className="grid grid-cols-2 gap-3 w-full mt-6">
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-indigo-600 font-medium">Evaluaciones</p>
                    <p className="text-xl font-bold text-indigo-800">{selectedSubject.evaluations?.length || 0}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-indigo-600 font-medium">Calificaciones</p>
                    <p className="text-xl font-bold text-indigo-800">{selectedSubject.grades?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <FaLightbulb className="mr-2 text-indigo-600" /> Situación Académica
              </h2>
              
              {selectedSubject.hasExam && examExemptionInfo && examExemptionInfo.status !== 'no-exam' && (
                <div className={`mb-4 p-4 rounded-lg border ${examVisuals.borderColor} ${examVisuals.bgColor}`}>
                  <div className="flex items-start">
                    <ExamIcon className={`mr-3 mt-1 flex-shrink-0 ${examVisuals.color}`} size="1.2em" />
                    <div>
                      <p className={`text-sm font-medium ${examVisuals.color.replace('-600', '-800')}`}>
                        {examExemptionInfo.status === 'can-exempt' 
                          ? '¡Puedes eximirte del examen!' 
                          : examExemptionInfo.status === 'must-take-exam' 
                          ? 'Debes rendir el examen'
                          : examExemptionInfo.status === 'exam-taken'
                          ? 'Ya rendiste el examen'
                          : 'Estado del examen'}
                      </p>
                      <p className={`text-xs mt-1 ${examVisuals.color.replace('-600', '-700')}`}>
                        {examExemptionInfo.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {requiredGradeInfo && (
                <div className={`p-4 rounded-lg border ${requiredVisuals.borderColor} ${requiredVisuals.bgColor}`}>
                  <div className="flex items-start">
                    <RequiredIcon className={`mr-3 mt-1 flex-shrink-0 ${requiredVisuals.color}`} size="1.2em" />
                    <p className={`text-sm ${requiredVisuals.color.replace('-600', '-800')}`}>
                      {requiredGradeInfo.message}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-600">Progreso de evaluaciones</p>
                    <p className="text-sm font-medium text-gray-800">{selectedSubject.grades?.length || 0}/{selectedSubject.evaluations?.length || 0}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${evaluationProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-600">Ponderación evaluada</p>
                    <p className="text-sm font-medium text-gray-800">{weightProgress}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${weightProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Evaluaciones pendientes</div>
                  {selectedSubject.evaluations && selectedSubject.evaluations
                    .filter(evalu => !selectedSubject.grades?.some(g => g.evaluationName === evalu.name))
                    .slice(0, 2)
                    .map((evalu, idx) => (
                      <div key={idx} className={`rounded p-2 mb-2 text-sm flex justify-between items-center ${evalu.isExam ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                        <span className="text-gray-700 flex items-center">
                          {evalu.name}
                          {evalu.isExam && <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded-full">Examen</span>}
                        </span>
                        <span className="text-gray-500 text-xs">{evalu.weight}%</span>
                      </div>
                    ))
                  }
                  
                  {selectedSubject.evaluations && selectedSubject.evaluations.filter(evalu => !selectedSubject.grades?.some(g => g.evaluationName === evalu.name)).length > 2 && (
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Y {selectedSubject.evaluations.filter(evalu => !selectedSubject.grades?.some(g => g.evaluationName === evalu.name)).length - 2} más...
                    </p>
                  )}
                  
                  {selectedSubject.evaluations && selectedSubject.evaluations.filter(evalu => !selectedSubject.grades?.some(g => g.evaluationName === evalu.name)).length === 0 && (
                    <p className="text-xs text-center text-gray-500 italic">No hay evaluaciones pendientes</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap">
                <button
                  onClick={() => setActiveTab('grades')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'grades'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
                >
                  <FaFileAlt className="inline mr-2" /> Calificaciones
                </button>
                <button
                  onClick={() => setActiveTab('evaluations')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'evaluations'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
                >
                  <FaBook className="inline mr-2" /> Plan de Evaluación
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'analytics'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                  }`}
                >
                  <FaChartLine className="inline mr-2" /> Análisis
                </button>
                {selectedSubject.hasExam && (
                  <button
                    onClick={() => setActiveTab('exam')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'exam'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                    }`}
                  >
                    <FaGraduationCap className="inline mr-2" /> Examen
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:hidden fixed bottom-6 right-6">
        <button
          onClick={() => {
            setShowGradeForm(true);
            setGradeFormStep(1);
            setActiveTab('grades');
          }}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all"
          aria-label="Agregar calificación"
        >
          <FaPlus size="1.5em" />
        </button>
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

export default SubjectDetail;