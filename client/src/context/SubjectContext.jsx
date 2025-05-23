// src/context/SubjectContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axiosClient from '../config/axios';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const SubjectContext = createContext();

const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchSubjects = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await axiosClient.get('/subjects');
      
      let subjectsData;
      if (response.data && response.data.data) {
        subjectsData = Array.isArray(response.data.data) ? response.data.data : [];
      } else {
        subjectsData = Array.isArray(response.data) ? response.data : [];
      }
      
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error al obtener asignaturas:', error);
      if (isAuthenticated) {
        toast.error('No se pudieron cargar las asignaturas');
      }
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [isAuthenticated, fetchSubjects]);

  const createSubject = async (subjectData) => {
    try {
      setLoading(true);
      const response = await axiosClient.post('/subjects', subjectData);
      const newSubject = response.data.data || response.data;
      
      setSubjects(prevSubjects => [...prevSubjects, newSubject]);
      toast.success('Asignatura creada con éxito');
      return newSubject;
    } catch (error) {
      console.error('Error al crear asignatura:', error);
      toast.error(error.response?.data?.message || 'Error al crear la asignatura');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id, subjectData) => {
    try {
      setLoading(true);
      const response = await axiosClient.put(`/subjects/${id}`, subjectData);
      const updatedSubject = response.data.data || response.data;
      
      setSubjects(prevSubjects => 
        prevSubjects.map(subject => subject._id === id ? updatedSubject : subject)
      );
      
      if (selectedSubject && selectedSubject._id === id) {
        setSelectedSubject(updatedSubject);
      }
      
      toast.success('Asignatura actualizada con éxito');
      return updatedSubject;
    } catch (error) {
      console.error('Error al actualizar asignatura:', error);
      toast.error('Error al actualizar la asignatura');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    try {
      setLoading(true);
      await axiosClient.delete(`/subjects/${id}`);
      
      setSubjects(prevSubjects => prevSubjects.filter(subject => subject._id !== id));
      
      if (selectedSubject && selectedSubject._id === id) {
        setSelectedSubject(null);
      }
      
      toast.success('Asignatura eliminada con éxito');
      return true;
    } catch (error) {
      console.error('Error al eliminar asignatura:', error);
      toast.error('Error al eliminar la asignatura');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addGrade = async (subjectId, gradeData) => {
    try {
      setLoading(true);
      const response = await axiosClient.post(`/subjects/${subjectId}/grades`, gradeData);
      const newGrade = response.data.data || response.data;
      
      setSubjects(prevSubjects => prevSubjects.map(subject => {
        if (subject._id === subjectId) {
          const currentGrades = Array.isArray(subject.grades) ? subject.grades : [];
          return {
            ...subject,
            grades: [...currentGrades, newGrade]
          };
        }
        return subject;
      }));
      
      if (selectedSubject && selectedSubject._id === subjectId) {
        const currentGrades = Array.isArray(selectedSubject.grades) ? selectedSubject.grades : [];
        setSelectedSubject({
          ...selectedSubject,
          grades: [...currentGrades, newGrade]
        });
      }
      
      toast.success('Calificación agregada con éxito');
      return newGrade;
    } catch (error) {
      console.error('Error al agregar calificación:', error);
      toast.error('Error al agregar la calificación');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteGrade = async (subjectId, gradeId) => {
    try {
      await axios.delete(`/api/subjects/${subjectId}/grades/${gradeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setSubjects(subjects.map(subject => {
        if (subject._id === subjectId) {
          return {
            ...subject,
            grades: subject.grades.filter(grade => grade._id !== gradeId)
          };
        }
        return subject;
      }));

      toast.success('Calificación eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar calificación:', error);
      const errorMessage = error.response?.data?.error || 'Error al eliminar la calificación';
      toast.error(errorMessage);
      throw error;
    }
  };

  const calculateWeightedAverage = useCallback((subjectId) => {
    try {
      if (!Array.isArray(subjects) || subjects.length === 0) {
        return { average: 0, passing: false };
      }

      const subject = subjects.find(s => s && s._id === subjectId);
      
      if (!subject || !Array.isArray(subject.grades) || subject.grades.length === 0) {
        return { average: 0, passing: false };
      }

      let totalWeight = 0;
      let weightedSum = 0;

      subject.grades.forEach(grade => {
        if (!grade) return;
        
        const gradeValue = parseFloat(grade.value);
        const weight = parseFloat(grade.weight) / 100;
        
        if (!isNaN(gradeValue) && !isNaN(weight)) {
          weightedSum += gradeValue * weight;
          totalWeight += weight;
        }
      });

      if (totalWeight === 0) {
        return { average: 0, passing: false };
      }

      const average = weightedSum / totalWeight;
      const roundedAverage = Math.round(average * 10) / 10;
      
      return {
        average: roundedAverage,
        passing: roundedAverage >= 4.0
      };
    } catch (error) {
      console.error(`Error al calcular promedio para asignatura ${subjectId}:`, error);
      return { average: 0, passing: false };
    }
  }, [subjects]);

  const calculateRequiredGradeInfo = useCallback((subjectId, passingGrade = 4.0) => {
    try {
      if (!Array.isArray(subjects) || subjects.length === 0) {
        return { status: 'error', message: 'No hay asignaturas disponibles.' };
      }
  
      const subject = subjects.find(s => s && s._id === subjectId);
      
      if (!subject) {
        return { status: 'error', message: 'Asignatura no encontrada.' };
      }
  
      // Validar que haya evaluaciones
      if (!Array.isArray(subject.evaluations) || subject.evaluations.length === 0) {
        return { status: 'error', message: 'No hay un plan de evaluación definido.' };
      }
  
      // Verificar peso total
      const totalWeight = subject.evaluations.reduce((sum, evaluation) => sum + parseFloat(evaluation.weight || 0), 0);
      if (Math.abs(totalWeight - 100) > 0.1) {
        return { 
          status: 'warning', 
          message: `Advertencia: El peso total de las evaluaciones es ${totalWeight.toFixed(1)}% en lugar de 100%.` 
        };
      }
  
      // Si no hay calificaciones registradas
      if (!Array.isArray(subject.grades) || subject.grades.length === 0) {
        return { 
          status: 'info', 
          message: 'Aún no has registrado calificaciones. Registra tus notas para ver lo que necesitas para aprobar.' 
        };
      }
  
      // Obtener evaluaciones pendientes (sin calificación)
      const completedEvaluations = subject.grades.map(grade => grade.evaluationName);
      const pendingEvaluations = subject.evaluations.filter(
        evaluation => !completedEvaluations.includes(evaluation.name)
      );
  
      // Si ya se completaron todas las evaluaciones
      if (pendingEvaluations.length === 0) {
        const { average, passing } = calculateWeightedAverage(subjectId);
        if (passing) {
          return { 
            status: 'passed', 
            message: `¡Felicitaciones! Has aprobado la asignatura con un promedio de ${average.toFixed(1)}.` 
          };
        } else {
          return { 
            status: 'failed_impossible', 
            message: `Has completado todas las evaluaciones con un promedio de ${average.toFixed(1)}. Lamentablemente, no has alcanzado la nota mínima de aprobación.` 
          };
        }
      }
  
      // Calcular puntaje actual acumulado
      let currentWeightedSum = 0;
      let completedWeight = 0;
  
      subject.grades.forEach(grade => {
        const evaluationItem = subject.evaluations.find(e => e.name === grade.evaluationName);
        if (evaluationItem) {
          const weight = parseFloat(evaluationItem.weight) / 100;
          const value = parseFloat(grade.value);
          if (!isNaN(weight) && !isNaN(value)) {
            currentWeightedSum += value * weight;
            completedWeight += weight;
          }
        }
      });
  
      // Calcular peso restante
      const remainingWeight = 1 - completedWeight;
      if (remainingWeight <= 0) {
        return { 
          status: 'error', 
          message: 'Error en los pesos de las evaluaciones. Verifica la configuración.' 
        };
      }
  
      // Verificar si ya es imposible aprobar
      const maxPossibleFinalGrade = currentWeightedSum + (7.0 * remainingWeight);
      if (maxPossibleFinalGrade < passingGrade) {
        return { 
          status: 'failed_impossible', 
          message: `Lo sentimos, ya no es matemáticamente posible aprobar esta asignatura, incluso con 7.0 en las evaluaciones restantes.` 
        };
      }
  
      // Verificar si ya ha aprobado según las notas actuales
      if (currentWeightedSum >= passingGrade) {
        return { 
          status: 'passed_pending', 
          message: `¡Buenas noticias! Ya has asegurado la aprobación de la asignatura, incluso si obtuvieras 1.0 en las evaluaciones restantes.` 
        };
      }
  
      // Calcular la nota mínima necesaria en todas las evaluaciones restantes
      const requiredGrade = (passingGrade - currentWeightedSum) / remainingWeight;
      
      // Verificar si la nota requerida es posible
      if (requiredGrade > 7.0) {
        return { 
          status: 'difficult', 
          message: `Necesitas obtener más de 7.0 (imposible) en las evaluaciones restantes para aprobar. Considera reforzar tu estudio.` 
        };
      } else if (requiredGrade <= 1.0) {
        return { 
          status: 'easy_pass', 
          message: `¡Excelente! Solo necesitas la nota mínima (1.0) en las evaluaciones restantes para aprobar.` 
        };
      } else {
        // Generar 5 escenarios para aprobar
        const scenarios = generateApprovalScenarios(
          currentWeightedSum,
          pendingEvaluations,
          passingGrade
        );
        
        // Formatear mensaje principal
        const mainMessage = `Necesitas un promedio de ${requiredGrade.toFixed(1)} en las evaluaciones restantes para aprobar.`;
        
        return { 
          status: 'possible', 
          message: mainMessage,
          requiredGrade: requiredGrade.toFixed(1),
          pendingEvaluations: pendingEvaluations,
          scenarios: scenarios
        };
      }
    } catch (error) {
      console.error(`Error al calcular nota requerida para asignatura ${subjectId}:`, error);
      return { status: 'error', message: 'Error en el cálculo. Verifica la configuración de evaluaciones.' };
    }
  }, [subjects, calculateWeightedAverage]);
  
  // Función auxiliar para generar escenarios de aprobación
  // Función auxiliar para generar escenarios de aprobación (COMPLETA)
const generateApprovalScenarios = (currentWeightedSum, pendingEvaluations, passingGrade) => {
    if (pendingEvaluations.length === 0) {
      return [];
    }
    
    const totalPendingWeight = pendingEvaluations.reduce(
      (sum, evaluation) => sum + (parseFloat(evaluation.weight) / 100), 
      0
    );
    
    const pointsNeeded = passingGrade - currentWeightedSum;
    const scenarios = [];
    
    // Escenario 1: Notas uniformes
    const uniformGrade = Math.min(7.0, Math.max(1.0, pointsNeeded / totalPendingWeight));
    scenarios.push({
      name: "Notas uniformes",
      description: `Obtener ${uniformGrade.toFixed(1)} en todas las evaluaciones restantes.`,
      grades: pendingEvaluations.map(evaluation => ({
        name: evaluation.name,
        weight: evaluation.weight,
        grade: uniformGrade.toFixed(1)
      }))
    });
    
    // Escenario 2: Enfoque en evaluación más importante
    if (pendingEvaluations.length > 1) {
      const sortedEvals = [...pendingEvaluations].sort((a, b) => 
        parseFloat(b.weight) - parseFloat(a.weight)
      );
      
      const highestWeightEval = sortedEvals[0];
      const highestWeight = parseFloat(highestWeightEval.weight) / 100;
      const otherWeight = totalPendingWeight - highestWeight;
      
      const otherPoints = otherWeight * 1.0;
      const highGrade = Math.min(7.0, Math.max(1.0, (pointsNeeded - otherPoints) / highestWeight));
      
      scenarios.push({
        name: "Enfoque en la más importante",
        description: `Sacar ${highGrade.toFixed(1)} en ${highestWeightEval.name} (${highestWeightEval.weight}%) y 1.0 en el resto`,
        grades: pendingEvaluations.map(evaluation => ({
          name: evaluation.name,
          weight: evaluation.weight,
          grade: evaluation.name === highestWeightEval.name ? highGrade.toFixed(1) : "1.0"
        }))
      });
    }
    
    // Escenario 3: Distribución proporcional al peso
    if (pendingEvaluations.length >= 2) {
      const proportionalGrades = [];
      let remainingPoints = pointsNeeded;
      let remainingWeight = totalPendingWeight;
      
      pendingEvaluations.forEach((evaluation, index) => {
        const weight = parseFloat(evaluation.weight) / 100;
        let grade;
        
        if (index === pendingEvaluations.length - 1) {
          grade = Math.min(7.0, Math.max(1.0, remainingPoints / weight));
        } else {
          grade = Math.min(7.0, Math.max(1.0, (pointsNeeded * (weight / totalPendingWeight)) / weight));
          remainingPoints -= grade * weight;
          remainingWeight -= weight;
        }
        
        proportionalGrades.push({
          name: evaluation.name,
          weight: evaluation.weight,
          grade: grade.toFixed(1)
        });
      });
      
      scenarios.push({
        name: "Distribución proporcional",
        description: "Notas calculadas según el peso de cada evaluación",
        grades: proportionalGrades
      });
    }
    
    // Escenario 4: Buen inicio (primeras evaluaciones altas)
    if (pendingEvaluations.length >= 3) {
      const firstHalf = Math.floor(pendingEvaluations.length / 2);
      const firstHalfWeight = pendingEvaluations.slice(0, firstHalf).reduce(
        (sum, evaluation) => sum + (parseFloat(evaluation.weight) / 100), 0);
      
      const firstHalfGrade = 6.5;
      const remainingPointsNeeded = pointsNeeded - (firstHalfGrade * firstHalfWeight);
      const remainingWeight = totalPendingWeight - firstHalfWeight;
      const remainingGrade = Math.min(7.0, Math.max(1.0, remainingPointsNeeded / remainingWeight));
      
      scenarios.push({
        name: "Buen inicio",
        description: `Sacar ${firstHalfGrade} en las primeras ${firstHalf} evaluaciones`,
        grades: pendingEvaluations.map((evaluation, index) => ({
          name: evaluation.name,
          weight: evaluation.weight,
          grade: index < firstHalf ? firstHalfGrade.toFixed(1) : remainingGrade.toFixed(1)
        }))
      });
    }
    
    // Escenario 5: Final fuerte (últimas evaluaciones altas)
    if (pendingEvaluations.length >= 3) {
      const lastHalf = Math.floor(pendingEvaluations.length / 2);
      const firstHalfWeight = pendingEvaluations.slice(0, -lastHalf).reduce(
        (sum, evaluation) => sum + (parseFloat(evaluation.weight) / 100), 0);
      
      const firstHalfGrade = 3.5;
      const remainingPointsNeeded = pointsNeeded - (firstHalfGrade * firstHalfWeight);
      const remainingWeight = totalPendingWeight - firstHalfWeight;
      const remainingGrade = Math.min(7.0, Math.max(1.0, remainingPointsNeeded / remainingWeight));
      
      scenarios.push({
        name: "Final fuerte",
        description: `Enfocarse en las últimas ${lastHalf} evaluaciones`,
        grades: pendingEvaluations.map((evaluation, index) => ({
          name: evaluation.name,
          weight: evaluation.weight,
          grade: index >= pendingEvaluations.length - lastHalf ? remainingGrade.toFixed(1) : firstHalfGrade.toFixed(1)
        }))
      });
    }
    
    return scenarios;
};

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        selectedSubject,
        setSelectedSubject,
        loading,
        fetchSubjects,
        createSubject,
        updateSubject,
        deleteSubject,
        addGrade,
        deleteGrade,
        calculateWeightedAverage,
        calculateRequiredGradeInfo 
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export default SubjectProvider;