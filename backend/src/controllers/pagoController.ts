import { Response } from 'express';
import { PrismaClient, TurnoEstado } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';
import { createPreference, getPaymentInfo } from '../services/mercadopagoService.js';

const prisma = new PrismaClient();

// Crear preferencia de pago para una reserva
export const createPaymentPreference = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { turnoId } = req.params;
    const userId = req.user!.userId;

    // Buscar el turno
    const turno = await prisma.turno.findUnique({
      where: { id: turnoId },
      include: {
        cancha: {
          include: {
            complejo: true
          }
        },
        cliente: true
      }
    });

    if (!turno) {
      res.status(404).json({ error: 'Reserva no encontrada' });
      return;
    }

    // Verificar que el turno pertenece al usuario
    if (turno.cliente_id !== userId) {
      res.status(403).json({ error: 'No autorizado' });
      return;
    }

    // Verificar que el turno está pendiente
    if (turno.estado !== TurnoEstado.PENDIENTE) {
      res.status(400).json({ error: 'Esta reserva no está disponible para pago' });
      return;
    }

    // Crear preferencia de Mercado Pago
    const preference = await createPreference({
      title: `Reserva - ${turno.cancha.complejo.nombre}`,
      description: `${turno.cancha.nombre} - ${turno.fecha.toLocaleDateString()} ${turno.hora_inicio}`,
      price: turno.sena_monto || 0,
      quantity: 1,
      turnoId: turno.id,
      clienteEmail: turno.cliente!.email,
      clienteNombre: turno.cliente!.nombre
    });

    // Guardar el preference_id en el turno
    await prisma.turno.update({
      where: { id: turnoId },
      data: {
        mp_preference_id: preference.id,
        mp_external_reference: turno.id
      }
    });

    res.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point
    });
  } catch (error) {
    console.error('Create payment preference error:', error);
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
};

// Webhook de Mercado Pago
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      // Obtener información del pago
      const payment = await getPaymentInfo(paymentId);

      if (payment.status === 'approved') {
        const turnoId = payment.external_reference;

        // Actualizar el turno
        await prisma.turno.update({
          where: { id: turnoId },
          data: {
            estado: TurnoEstado.RESERVADO,
            sena_pagada: true,
            mp_payment_id: paymentId.toString()
          }
        });

        console.log(`✅ Pago aprobado para turno ${turnoId}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
};

// Verificar estado de pago
export const checkPaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { turnoId } = req.params;
    const userId = req.user!.userId;

    const turno = await prisma.turno.findUnique({
      where: { id: turnoId }
    });

    if (!turno) {
      res.status(404).json({ error: 'Reserva no encontrada' });
      return;
    }

    if (turno.cliente_id !== userId) {
      res.status(403).json({ error: 'No autorizado' });
      return;
    }

    res.json({
      estado: turno.estado,
      sena_pagada: turno.sena_pagada,
      pago_completo: turno.pago_completo
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({ error: 'Error al verificar estado de pago' });
  }
};
