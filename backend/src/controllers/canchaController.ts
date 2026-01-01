import { Response } from 'express';
import { PrismaClient, TipoCancha } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateCanchaSchema = z.object({
  nombre: z.string().min(2),
  tipo: z.nativeEnum(TipoCancha),
  precio_hora: z.number().positive(),
  complejo_id: z.string()
});

export const getCanchas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { complejo_id } = req.query;

    const canchas = await prisma.cancha.findMany({
      where: {
        activa: true,
        ...(complejo_id ? { complejo_id: complejo_id as string } : {})
      },
      include: {
        complejo: {
          select: {
            id: true,
            nombre: true,
            ciudad: true
          }
        }
      }
    });

    res.json(canchas);
  } catch (error) {
    console.error('Get canchas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCancha = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = CreateCanchaSchema.parse(req.body);
    const userId = req.user!.userId;

    // Verificar que el complejo pertenece al usuario
    const complejo = await prisma.complejo.findFirst({
      where: {
        id: data.complejo_id,
        owner_id: userId
      }
    });

    if (!complejo) {
      res.status(403).json({ error: 'Not authorized to add courts to this complex' });
      return;
    }

    const cancha = await prisma.cancha.create({
      data
    });

    res.status(201).json(cancha);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Create cancha error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
