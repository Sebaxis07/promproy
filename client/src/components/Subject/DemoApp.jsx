import React, { useMemo } from 'react';
import { 
  FaCrown, 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaFire, 
  FaBan,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaBullseye,
  FaRocket,
  FaCalculator,
  FaLightbulb,
  FaTrophy,
  FaHeart,
  FaChartLine
} from 'react-icons/fa';

// Hook para calcular predicciones de notas
const useGradePrediction = (subject, targetGrade = 4.0) => {
  return useMemo(() => {
    if (!subject || !subject.evaluations || subject.evaluations.length === 0) {
      return null;
    }

    // Calcular peso total y peso completado
    const totalWeight = subject.evaluations.reduce((sum, eval) => sum + parseFloat(eval.weight), 0);
    const completedEvaluations = subject.grades || [];
    
    let completedWeight = 0;
    let weightedSum = 0;
    
    completedEvaluations.forEach(grade => {
      const weight = parseFloat(grade.weight);
      completedWeight += weight;
      weightedSum += parseFloat(grade.value) * weight;
    });

    const currentAverage = completedWeight > 0 ? weightedSum / completedWeight : 0;
    const remainingWeight = totalWeight - completedWeight;
    const progressPercentage = (completedWeight / totalWeight) * 100;

    // Calcular qué se necesita en el peso restante para alcanzar el objetivo
    const neededWeightedSum = (targetGrade * totalWeight) - weightedSum;
    const requiredAverageInRemaining = remainingWeight > 0 ? neededWeightedSum / remainingWeight : 0;

    // Evaluar las próximas evaluaciones específicamente
    const remainingEvaluations = subject.evaluations.filter(
      evaluation => !completedEvaluations.some(grade => grade.evaluationName === evaluation.name)
    );

    // Calcular escenarios específicos para las próximas evaluaciones
    const scenarios = [];
    
    if (remainingEvaluations.length > 0) {
      // Escenario optimista (todas 7.0)
      const optimisticSum = weightedSum + (remainingEvaluations.reduce((sum, evaluation) => sum + parseFloat(evaluation.weight) * 7.0, 0));
      const optimisticAverage = optimisticSum / totalWeight;
      
      // Escenario pesimista (todas 4.0)
      const pessimisticSum = weightedSum + (remainingEvaluations.reduce((sum, evaluation) => sum + parseFloat(evaluation.weight) * 4.0, 0));
      const pessimisticAverage = pessimisticSum / totalWeight;
      
      scenarios.push({
        name: 'Optimista (todas 7.0)',
        finalAverage: optimisticAverage,
        passes: optimisticAverage >= targetGrade
      });
      
      scenarios.push({
        name: 'Conservador (todas 4.0)',
        finalAverage: pessimisticAverage,
        passes: pessimisticAverage >= targetGrade
      });
    }

    // Determinar el caso según la situación
    let caseType, status, message, recommendations, nextEvaluations;

    if (progressPercentage === 100) {
      // Caso: Ya terminó todas las evaluaciones
      if (currentAverage >= targetGrade) {
        caseType = 'completed_passed';
        status = 'success';
        message = `¡Felicidades! Ya completaste todas las evaluaciones con un promedio de ${currentAverage.toFixed(2)}`;
      } else {
        caseType = 'completed_failed';
        status = 'danger';
        message = `Has completado todas las evaluaciones con promedio ${currentAverage.toFixed(2)}. No alcanzaste el ${targetGrade}`;
      }
    } else if (requiredAverageInRemaining <= 4.0) {
      // Caso 1: Ya aprobó o necesita muy poco
      caseType = 'already_passing';
      status = 'success';
      message = progressPercentage > 50 
        ? `¡Excelente! Ya tienes el curso prácticamente aprobado con ${currentAverage.toFixed(2)}`
        : `¡Buen inicio! Con ${currentAverage.toFixed(2)}, solo necesitas promedio ${Math.max(4.0, requiredAverageInRemaining).toFixed(1)} en lo que resta`;
      
      nextEvaluations = remainingEvaluations.slice(0, 3).map(eval => ({
        name: eval.name,
        weight: eval.weight,
        recommendedGrade: Math.max(4.0, requiredAverageInRemaining),
        description: 'Mantén este nivel'
      }));
      
    } else if (requiredAverageInRemaining <= 5.5) {
      // Caso 2: En buen camino
      caseType = 'good_track';
      status = 'good';
      message = `Vas por buen camino con ${currentAverage.toFixed(2)}. Necesitas promedio ${requiredAverageInRemaining.toFixed(1)} en las evaluaciones restantes`;
      
      nextEvaluations = remainingEvaluations.slice(0, 3).map(eval => ({
        name: eval.name,
        weight: eval.weight,
        recommendedGrade: Math.min(7.0, requiredAverageInRemaining + 0.3),
        description: 'Objetivo recomendado'
      }));
      
    } else if (requiredAverageInRemaining <= 6.5) {
      // Caso 3: Necesita mejorar
      caseType = 'needs_improvement';
      status = 'warning';
      message = `Debes esforzarte más. Con ${currentAverage.toFixed(2)} actual, necesitas promedio ${requiredAverageInRemaining.toFixed(1)} en lo que resta`;
      
      nextEvaluations = remainingEvaluations.slice(0, 3).map(eval => ({
        name: eval.name,
        weight: eval.weight,
        recommendedGrade: Math.min(7.0, requiredAverageInRemaining),
        description: 'Esfuerzo necesario'
      }));
      
    } else if (requiredAverageInRemaining <= 7.0) {
      // Caso 4: Situación crítica
      caseType = 'critical';
      status = 'danger';
      message = `¡Situación crítica! Necesitas promedio ${requiredAverageInRemaining.toFixed(1)} en todas las evaluaciones restantes`;
      
      nextEvaluations = remainingEvaluations.slice(0, 3).map(eval => ({
        name: eval.name,
        weight: eval.weight,
        recommendedGrade: 7.0,
        description: '¡Máxima nota!'
      }));
      
    } else {
      // Caso 5: Imposible aprobar
      caseType = 'impossible';
      status = 'danger';
      message = `Matemáticamente imposible aprobar. Necesitarías promedio ${requiredAverageInRemaining.toFixed(1)} (sobre 7.0)`;
      
      nextEvaluations = remainingEvaluations.slice(0, 3).map(eval => ({
        name: eval.name,
        weight: eval.weight,
        recommendedGrade: 7.0,
        description: 'Minimizar pérdidas'
      }));
    }

    return {
      caseType,
      status,
      message,
      currentAverage,
      requiredAverageInRemaining,
      progressPercentage,
      remainingWeight,
      nextEvaluations: nextEvaluations || [],
      scenarios,
      canPass: requiredAverageInRemaining <= 7.0,
      recommendations: getRecommendations(caseType, requiredAverageInRemaining, progressPercentage)
    };
  }, [subject, targetGrade]);
};

// Función para obtener recomendaciones específicas
const getRecommendations = (caseType, requiredAverage, progress) => {
  switch(caseType) {
    case 'already_passing':
      return [
        'Mantén tu nivel actual de estudio',
        'Enfócate en entender bien los conceptos',
        'Ayuda a tus compañeros si puedes'
      ];
    case 'good_track':
      return [
        'Sigue con tu rutina de estudio',
        'Repasa los temas más difíciles',
        'Participa activamente en clases'
      ];
    case 'needs_improvement':
      return [
        'Aumenta tus horas de estudio semanales',
        'Busca ayuda del profesor o tutorías',
        'Forma grupos de estudio con compañeros'
      ];
    case 'critical':
      return [
        '¡Dedica todo tu tiempo libre a estudiar!',
        'Solicita ayuda urgente del profesor',
        'Considera tutoría intensiva privada',
        'Revisa todos los apuntes y materiales'
      ];
    case 'impossible':
      return [
        'Habla con tu profesor sobre opciones',
        'Considera retirar la asignatura si es posible',
        'Enfócate en aprender para el futuro',
        'Evalúa repetir el curso'
      ];
    default:
      return [];
  }
};

// Componente principal de predicción
const GradePredictionWidget = ({ subject, targetGrade = 4.0 }) => {
  const prediction = useGradePrediction(subject, targetGrade);

  if (!prediction) {
    return (
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-slate-500/30 rounded-2xl p-6">
        <div className="text-center py-8">
          <FaCalculator className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No hay suficiente información para hacer predicciones</p>
        </div>
      </div>
    );
  }

  // Configuración visual según el estado
  const statusConfig = {
    success: {
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/10 to-emerald-600/10',
      borderColor: 'border-emerald-400/30',
      icon: FaTrophy,
      glowColor: 'shadow-emerald-500/20'
    },
    good: {
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-400/30',
      icon: FaRocket,
      glowColor: 'shadow-blue-500/20'
    },
    warning: {
      gradient: 'from-yellow-400 via-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10',
      borderColor: 'border-yellow-400/30',
      icon: FaExclamationTriangle,
      glowColor: 'shadow-yellow-500/20'
    },
    danger: {
      gradient: 'from-red-400 via-red-500 to-red-600',
      bgGradient: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-400/30',
      icon: FaFire,
      glowColor: 'shadow-red-500/20'
    }
  };

  const config = statusConfig[prediction.status] || statusConfig.good;
  const IconComponent = config.icon;

  return (
    <div className={`bg-gradient-to-br ${config.bgGradient} backdrop-blur-xl border ${config.borderColor} rounded-2xl p-8 shadow-2xl ${config.glowColor}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-r ${config.gradient} shadow-lg ${config.glowColor} transform hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-wide">PREDICCIÓN DE NOTAS</h3>
            <p className="text-slate-300 font-medium">Análisis de tu progreso académico</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-black text-white mb-1">{prediction.progressPercentage.toFixed(0)}%</div>
          <div className="text-sm text-slate-400 font-bold">COMPLETADO</div>
        </div>
      </div>

      {/* Mensaje principal */}
      <div className="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
        <p className="text-lg text-white font-bold leading-relaxed">{prediction.message}</p>
      </div>

      {/* Estadísticas clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-slate-700/30 rounded-xl">
          <div className="text-2xl font-black text-white mb-1">{prediction.currentAverage.toFixed(2)}</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Promedio Actual</div>
        </div>
        
        <div className="text-center p-4 bg-slate-700/30 rounded-xl">
          <div className="text-2xl font-black text-white mb-1">
            {prediction.requiredAverageInRemaining > 7.0 ? '∞' : prediction.requiredAverageInRemaining.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Necesitas Promedio</div>
        </div>
        
        <div className="text-center p-4 bg-slate-700/30 rounded-xl">
          <div className="text-2xl font-black text-white mb-1">{prediction.remainingWeight.toFixed(0)}%</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Peso Restante</div>
        </div>
      </div>

      {/* Próximas evaluaciones con recomendaciones */}
      {prediction.nextEvaluations.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-black text-white mb-6 flex items-center tracking-wide">
            <FaBullseye className="w-5 h-5 mr-3 text-blue-400" />
            PRÓXIMAS EVALUACIONES
          </h4>
          
          <div className="space-y-4">
            {prediction.nextEvaluations.map((evaluation, index) => (
              <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-700/50 to-slate-600/50 backdrop-blur-sm rounded-xl border border-slate-500/20 hover:border-blue-400/30 transition-all duration-300 group">
                <div className="flex-1">
                  <h5 className="font-bold text-white text-lg mb-1">{evaluation.name}</h5>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-slate-300 flex items-center">
                      <FaChartLine className="w-3 h-3 mr-1" />
                      {evaluation.weight}% del total
                    </span>
                    <span className="text-blue-400 font-medium">{evaluation.description}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-black text-white mb-1">
                    {evaluation.recommendedGrade.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Recomendado</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escenarios de predicción */}
      {prediction.scenarios.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-black text-white mb-6 flex items-center tracking-wide">
            <FaLightbulb className="w-5 h-5 mr-3 text-yellow-400" />
            ESCENARIOS POSIBLES
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prediction.scenarios.map((scenario, index) => (
              <div key={index} className={`p-5 rounded-xl border backdrop-blur-sm ${
                scenario.passes 
                  ? 'bg-emerald-500/10 border-emerald-400/30' 
                  : 'bg-red-500/10 border-red-400/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{scenario.name}</span>
                  {scenario.passes ? (
                    <FaCheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <FaBan className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="text-2xl font-black text-white">
                  {scenario.finalAverage.toFixed(2)}
                </div>
                <div className={`text-sm font-bold ${scenario.passes ? 'text-emerald-400' : 'text-red-400'}`}>
                  {scenario.passes ? '✅ Apruebas' : '❌ No apruebas'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {prediction.recommendations.length > 0 && (
        <div>
          <h4 className="text-xl font-black text-white mb-6 flex items-center tracking-wide">
            <FaHeart className="w-5 h-5 mr-3 text-pink-400" />
            RECOMENDACIONES
          </h4>
          
          <div className="space-y-3">
            {prediction.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center p-4 bg-gradient-to-r from-slate-700/30 to-slate-600/30 backdrop-blur-sm rounded-xl border border-slate-500/20">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mr-4 flex-shrink-0"></div>
                <span className="text-slate-200 font-medium">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barra de progreso visual */}
      <div className="mt-8 pt-6 border-t border-slate-500/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Progreso del curso</span>
          <span className="text-sm font-bold text-white">{prediction.progressPercentage.toFixed(0)}%</span>
        </div>
        <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden relative">
          <div 
            className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 relative overflow-hidden`}
            style={{ width: `${Math.min(prediction.progressPercentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Estado final */}
      <div className="mt-6 text-center">
        <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r ${config.gradient} text-white shadow-lg ${config.glowColor} transform hover:scale-105 transition-all duration-200`}>
          <IconComponent className="w-4 h-4 mr-2" />
          {prediction.canPass ? '¡Puedes aprobar!' : 'Situación complicada'}
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

// Componente de demostración
const DemoApp = () => {
  // Datos de ejemplo
  const sampleSubject = {
    name: "Cálculo I",
    evaluations: [
      { name: "Prueba 1", weight: 25, description: "Límites y continuidad" },
      { name: "Prueba 2", weight: 25, description: "Derivadas" },
      { name: "Trabajo Final", weight: 20, description: "Proyecto de aplicación" },
      { name: "Examen Final", weight: 30, description: "Contenido completo" }
    ],
    grades: [
      { 
        evaluationName: "Prueba 1", 
        value: 5.2, 
        weight: 25, 
        createdAt: "2024-03-15",
        note: "Buen desempeño en límites"
      },
      { 
        evaluationName: "Prueba 2", 
        value: 4.8, 
        weight: 25, 
        createdAt: "2024-04-20",
        note: "Algunas dificultades con regla de la cadena"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-4 tracking-wide">PREDICTOR DE NOTAS</h1>
          <p className="text-slate-400 text-lg font-medium">Analiza tu progreso y descubre qué necesitas para aprobar</p>
        </div>
        
        <GradePredictionWidget subject={sampleSubject} targetGrade={4.0} />
      </div>
    </div>
  );
};

export default DemoApp;