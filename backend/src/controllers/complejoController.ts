import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateComplejoSchema = z.object({
  nombre: z.string().min(2),
  ciudad: z.string(),
  direccion: z.string(),
  telefono: z.string(),
  horario_apertura: z.string().regex(/^\d{2}:\d{2}$/),
  horario_cierre: z.string().regex(/^\d{2}:\d{2}$/),
  imagen: z.string().url().optional()
});

export const getComplejos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ciudad } = req.query;

    const complejos = await prisma.complejo.findMany({
      where: {
        activo: true,
        ...(ciudad ? { ciudad: ciudad as string } : {})
      },
      include: {
        canchas: {
          where: { activa: true }
        },
        owner: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    res.json(complejos);
  } catch (error) {
    console.error('Get complejos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getComplejoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const complejo = await prisma.complejo.findUnique({
      where: { id },
      include: {
        canchas: {
          where: { activa: true }
        },
        owner: {
          select: {
            id: true,
            nombre: true,
            telefono: true
          }
        }
      }
    });

    if (!complejo) {
      res.status(404).json({ error: 'Complejo not found' });
      return;
    }

    res.json(complejo);
  } catch (error) {
    console.error('Get complejo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createComplejo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = CreateComplejoSchema.parse(req.body);
    const userId = req.user!.userId;

    const complejo = await prisma.complejo.create({
      data: {
        ...data,
        owner_id: userId
      }
    });

    res.status(201).json(complejo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Create complejo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyComplejos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const complejos = await prisma.complejo.findMany({
      where: { owner_id: userId },
      include: {
        canchas: true
      }
    });

    res.json(complejos);
  } catch (error) {
    console.error('Get my complejos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
