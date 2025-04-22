// controllers/gradeController.js
import Subject from '../models/Subject.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getGrades = asyncHandler(async (req, res, next) => {
  // Buscar todas las asignaturas del usuario
  const subjects = await Subject.find({ user: req.user.id });
  
  // Extraer todas las calificaciones de todas las asignaturas
  let allGrades = [];
  subjects.forEach(subject => {
    // Agregar información de la asignatura a cada calificación
    const gradesWithSubject = subject.grades.map(grade => ({
      ...grade.toObject(),
      subjectId: subject._id,
      subjectName: subject.name
    }));
    
    allGrades = [...allGrades, ...gradesWithSubject];
  });
  
  res.status(200).json({
    success: true,
    count: allGrades.length,
    data: allGrades
  });
});

export const getGradesBySubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.subjectId);
  
  if (!subject) {
    return next(
      new ErrorResponse(`Asignatura no encontrada con id de ${req.params.subjectId}`, 404)
    );
  }
  
  // Verificar que el usuario es propietario de la asignatura
  if (subject.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Usuario no autorizado para acceder a esta asignatura`, 401)
    );
  }
  
  res.status(200).json({
    success: true,
    count: subject.grades.length,
    data: subject.grades
  });
});

export const getGrade = asyncHandler(async (req, res, next) => {
  // Buscar en todas las asignaturas del usuario
  const subjects = await Subject.find({ user: req.user.id });
  
  // Buscar la calificación en todas las asignaturas
  let foundGrade = null;
  let subjectInfo = null;
  
  for (const subject of subjects) {
    const grade = subject.grades.id(req.params.id);
    if (grade) {
      foundGrade = grade;
      subjectInfo = {
        id: subject._id,
        name: subject.name
      };
      break;
    }
  }
  
  if (!foundGrade) {
    return next(
      new ErrorResponse(`Calificación no encontrada con id de ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: {
      ...foundGrade.toObject(),
      subject: subjectInfo
    }
  });
});

export const updateGrade = asyncHandler(async (req, res, next) => {
  // Buscar en todas las asignaturas del usuario
  const subjects = await Subject.find({ user: req.user.id });
  
  // Buscar la asignatura que contiene la calificación
  let foundSubject = null;
  let gradeIndex = -1;
  
  for (const subject of subjects) {
    const grade = subject.grades.id(req.params.id);
    if (grade) {
      foundSubject = subject;
      gradeIndex = subject.grades.findIndex(g => g._id.toString() === req.params.id);
      break;
    }
  }
  
  if (!foundSubject || gradeIndex === -1) {
    return next(
      new ErrorResponse(`Calificación no encontrada con id de ${req.params.id}`, 404)
    );
  }
  
  // Actualizar la calificación
  foundSubject.grades[gradeIndex].set(req.body);
  await foundSubject.save();
  
  res.status(200).json({
    success: true,
    data: foundSubject.grades[gradeIndex]
  });
});

export const deleteGrade = asyncHandler(async (req, res, next) => {
  // Buscar en todas las asignaturas del usuario
  const subjects = await Subject.find({ user: req.user.id });
  
  // Buscar la asignatura que contiene la calificación
  let foundSubject = null;
  let gradeIndex = -1;
  
  for (const subject of subjects) {
    const grade = subject.grades.id(req.params.id);
    if (grade) {
      foundSubject = subject;
      gradeIndex = subject.grades.findIndex(g => g._id.toString() === req.params.id);
      break;
    }
  }
  
  if (!foundSubject || gradeIndex === -1) {
    return next(
      new ErrorResponse(`Calificación no encontrada con id de ${req.params.id}`, 404)
    );
  }
  
  // Eliminar la calificación
  foundSubject.grades.splice(gradeIndex, 1);
  await foundSubject.save();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});