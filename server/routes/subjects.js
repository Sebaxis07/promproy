import { Router } from 'express';
import { getSubjects, getSubject, createSubject, updateSubject, deleteSubject, addGrade, deleteGrade } from '../controllers/subjectController.js';

const router = Router();

import { protect } from '../middleware/auth.js';

// Proteger todas las rutas
router.use(protect);

router
  .route('/')
  .get(getSubjects)
  .post(createSubject);

router
  .route('/:id')
  .get(getSubject)
  .put(updateSubject)
  .delete(deleteSubject);

router
  .route('/:id/grades')
  .post(addGrade);

router
  .route('/:id/grades/:gradeId')
  .delete(deleteGrade);

export default router;