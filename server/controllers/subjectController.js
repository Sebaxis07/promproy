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
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(
      new ErrorResponse(`Asignatura no encontrada con id de ${req.params.id}`, 404)
    );
  }

  // Asegurarse de que el usuario es dueño de la asignatura
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
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return next(
      new ErrorResponse(`Asignatura no encontrada con id de ${req.params.id}`, 404)
    );
  }

  // Asegurarse de que el usuario es dueño de la asignatura
  if (subject.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Usuario no autorizado para eliminar calificaciones de esta asignatura`, 401)
    );
  }

  // Encontrar el índice de la calificación
  const gradeIndex = subject.grades.findIndex(
    grade => grade._id.toString() === req.params.gradeId
  );

  if (gradeIndex === -1) {
    return next(
      new ErrorResponse(`Calificación no encontrada con id de ${req.params.gradeId}`, 404)
    );
  }

  // Eliminar la calificación
  subject.grades.splice(gradeIndex, 1);
  await subject.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});