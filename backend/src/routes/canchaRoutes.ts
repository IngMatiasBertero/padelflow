import { Router } from 'express';
import { getCanchas, createCancha } from '../controllers/canchaController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getCanchas);
router.post('/', authMiddleware, requireRole(['DUENO']), createCancha);

export default router;
