// routes/grades.js
import { Router } from 'express';
const router = Router();
import { protect } from '../middleware/auth.js';

import { getGrades, getGrade, updateGrade, deleteGrade, getGradesBySubject } from '../controllers/gradeController.js';

// Proteger todas las rutas
router.use(protect);

// Obtener todas las calificaciones (de todas las asignaturas del usuario)
router.route('/').get(getGrades);

// Filtrar calificaciones por asignatura
router.route('/subject/:subjectId').get(getGradesBySubject);

// Operaciones sobre una calificación específica
router.route('/:id')
  .get(getGrade)
  .put(updateGrade)
  .delete(deleteGrade);

export default router;