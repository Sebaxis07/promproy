import Subject from '../models/Subject.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getSubjects = asyncHandler(async (req, res, next) => {
  const subjects = await Subject.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects
  });
});

export const getSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(
      new ErrorResponse(`Asignatura no encontrada con id de ${req.params.id}`, 404)
    );
  }

  // Asegurarse de que el usuario es dueño de la asignatura
  if (subject.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Usuario no autorizado para acceder a esta asignatura`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: subject
  });
});

export const createSubject = asyncHandler(async (req, res, next) => {
  // Agregar usuario al cuerpo de la solicitud
  req.body.user = req.user.id;

  const subject = await Subject.create(req.body);

  res.status(201).json({
    success: true,
    data: subject
  });
});

export const updateSubject = asyncHandler(async (req, res, next) => {
  let subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(
      new ErrorResponse(`Asignatura no encontrada con id de ${req.params.id}`, 404)
    );
  }

  // Asegurarse de que el usuario es dueño de la asignatura
  if (subject.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Usuario no autorizado para actualizar esta asignatura`, 401)
    );
  }

  subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: subject
  });
});

export const deleteSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(
      new ErrorResponse(`Asignatura no encontrada con id de ${req.params.id}`, 404)
    );
  }

  // Asegurarse de que el usuario es dueño de la asignatura
  if (subject.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Usuario no autorizado para eliminar esta asignatura`, 401)
    );
  }

  // Cambiar subject.remove() por findByIdAndDelete
  await Subject.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

export const addGrade = asyncHandler(async (req, res, next) => {
  console.log('Datos recibidos:', req.body); // Para debugging

  // Validar los datos requeridos
  const { evaluationName, value, weight } = req.body;
  if (!evaluationName || !value || !weight) {
    return next(
      new ErrorResponse('Por favor proporcione todos los campos requeridos', 400)
    );
  }

  // Validar el rango de los valores
  if (value < 1.0 || value > 7.0) {
    return next(
      new ErrorResponse('La calificación debe estar entre 1.0 y 7.0', 400)
    );
  }

  if (weight < 0 || weight > 100) {
    return next(
      new ErrorResponse('La ponderación debe estar entre 0 y 100', 400)
    );
  }

  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(
      new ErrorResponse(`Asignatura no encontrada con id de ${req.params.id}`, 404)
    );
  }

  if (subject.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Usuario no autorizado para agregar calificaciones a esta asignatura`, 401)
    );
  }

  // Agregar la calificación
  subject.grades.push(req.body);
  await subject.save();

  res.status(201).json({
    success: true,
    data: subject.grades[subject.grades.length - 1]
  });
});

export const deleteGrade = asyncHandler(async (req, res, next) => {
  // Find subject first
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(
      new ErrorResponse(`Asignatura no encontrada con id de ${req.params.id}`, 404)
    );
  }

  // Check ownership
  if (subject.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Usuario no autorizado para eliminar calificaciones`, 401)
    );
  }

  // Find grade index
  const gradeIndex = subject.grades.findIndex(
    grade => grade._id.toString() === req.params.gradeId
  );

  if (gradeIndex === -1) {
    return next(
      new ErrorResponse(`Calificación no encontrada con id de ${req.params.gradeId}`, 404)
    );
  }

  try {
    // Remove grade from array
    subject.grades.splice(gradeIndex, 1);
    
    // Save updated subject
    await subject.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return next(
      new ErrorResponse('Error al eliminar la calificación', 500)
    );
  }
});