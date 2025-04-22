import { Router } from 'express';
import { register, login, getMe, verifyToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/verify', protect, verifyToken);  // Añadir protect middleware

export default router;