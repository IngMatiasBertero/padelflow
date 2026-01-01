import { Router } from 'express';
import { getComplejos, getComplejoById, createComplejo, getMyComplejos } from '../controllers/complejoController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getComplejos);
router.get('/my', authMiddleware, requireRole(['DUENO']), getMyComplejos);
router.get('/:id', getComplejoById);
router.post('/', authMiddleware, requireRole(['DUENO']), createComplejo);

export default router;
