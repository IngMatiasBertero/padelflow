import { Router } from 'express';
import { createPaymentPreference, handleWebhook, checkPaymentStatus } from '../controllers/pagoController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Crear preferencia de pago para un turno
router.post('/turnos/:turnoId/preference', authMiddleware, createPaymentPreference);

// Verificar estado de pago
router.get('/turnos/:turnoId/status', authMiddleware, checkPaymentStatus);

// Webhook de Mercado Pago (no requiere auth)
router.post('/webhooks/mercadopago', handleWebhook);

export default router;
