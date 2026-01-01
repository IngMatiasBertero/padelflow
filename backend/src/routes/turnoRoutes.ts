import { Router } from 'express';
import { getTurnos, createReserva, getMyReservas, cancelReserva } from '../controllers/turnoController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', getTurnos);
router.post('/', authMiddleware, createReserva);
router.get('/my', authMiddleware, getMyReservas);
router.patch('/:id/cancel', authMiddleware, cancelReserva);

export default router;
