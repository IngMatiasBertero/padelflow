import { Response } from 'express';
import { PrismaClient, TurnoEstado } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateReservaSchema = z.object({
  cancha_id: z.string(),
  fecha: z.string().transform(str => new Date(str)),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}$/),
  hora_fin: z.string().regex(/^\d{2}:\d{2}$/)
});

export const getTurnos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cancha_id, fecha, estado } = req.query;

    const turnos = await prisma.turno.findMany({
      where: {
        ...(cancha_id ? { cancha_id: cancha_id as string } : {}),
        ...(fecha ? { fecha: new Date(fecha as string) } : {}),
        ...(estado ? { estado: estado as TurnoEstado } : {})
      },
      include: {
        cancha: {
          include: {
            complejo: true
          }
        },
        cliente: {
          select: {
            id: true,
            nombre: true,
            telefono: true
          }
        }
      },
      orderBy: [
        { fecha: 'asc' },
        { hora_inicio: 'asc' }
      ]
    });

    res.json(turnos);
  } catch (error) {
    console.error('Get turnos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createReserva = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = CreateReservaSchema.parse(req.body);
    const userId = req.user!.userId;

    // Obtener información de la cancha
    const cancha = await prisma.cancha.findUnique({
      where: { id: data.cancha_id }
    });

    if (!cancha || !cancha.activa) {
      res.status(404).json({ error: 'Court not found or inactive' });
      return;
    }

    // Verificar disponibilidad
    const existingTurno = await prisma.turno.findFirst({
      where: {
        cancha_id: data.cancha_id,
        fecha: data.fecha,
        hora_inicio: data.hora_inicio,
        estado: {
          in: [TurnoEstado.RESERVADO, TurnoEstado.PENDIENTE]
        }
      }
    });

    if (existingTurno) {
      res.status(409).json({ error: 'Time slot already booked' });
      return;
    }

    // Crear reserva
    const precio = cancha.precio_hora;
    const senaMonto = Math.round(precio * 0.25); // 25% de seña

    const turno = await prisma.turno.create({
      data: {
        cancha_id: data.cancha_id,
        cliente_id: userId,
        fecha: data.fecha,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        precio,
        sena_monto: senaMonto,
        estado: TurnoEstado.PENDIENTE
      },
      include: {
        cancha: {
          include: {
            complejo: true
          }
        }
      }
    });

    res.status(201).json(turno);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Create reserva error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyReservas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const reservas = await prisma.turno.findMany({
      where: { cliente_id: userId },
      include: {
        cancha: {
          include: {
            complejo: true
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    res.json(reservas);
  } catch (error) {
    console.error('Get my reservas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelReserva = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const turno = await prisma.turno.findUnique({
      where: { id }
    });

    if (!turno) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }

    if (turno.cliente_id !== userId) {
      res.status(403).json({ error: 'Not authorized to cancel this reservation' });
      return;
    }

    const updatedTurno = await prisma.turno.update({
      where: { id },
      data: { estado: TurnoEstado.CANCELADO }
    });

    res.json(updatedTurno);
  } catch (error) {
    console.error('Cancel reserva error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
