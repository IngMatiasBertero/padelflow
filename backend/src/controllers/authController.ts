import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';
import { generateToken } from '../utils/jwt.js';
import { z } from 'zod';

const prisma = new PrismaClient();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(2),
  telefono: z.string().optional(),
  rol: z.nativeEnum(UserRole).default(UserRole.CLIENTE),
  activationCode: z.string().optional(),
  nombreComplejo: z.string().optional()
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = RegisterSchema.parse(req.body);

    // Si el usuario se registra como dueño, verificar código de activación
    if (data.rol === UserRole.DUENO) {
      const validCode = process.env.OWNER_ACTIVATION_CODE || 'PADELFLOW2024';

      if (!data.activationCode || data.activationCode !== validCode) {
        res.status(403).json({
          error: 'Código de activación inválido',
          message: 'Para registrarte como dueño necesitas un código de activación válido'
        });
        return;
      }
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        nombre: data.nombre,
        telefono: data.telefono || '',
        rol: data.rol,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.nombre}`
      }
    });

    // Si es dueño, crear el complejo automáticamente
    if (data.rol === UserRole.DUENO && data.nombreComplejo) {
      await prisma.complejo.create({
        data: {
          nombre: data.nombreComplejo,
          direccion: 'Por configurar',
          ciudad: 'Santiago del Estero',
          owner_id: user.id,
          telefono: data.telefono || '',
          imagen: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop',
          horario_apertura: '08:00',
          horario_cierre: '23:00'
        }
      });
    }

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      rol: user.rol
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono,
        rol: user.rol,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = LoginSchema.parse(req.body);

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (!user.activo) {
      res.status(403).json({ error: 'Account is disabled' });
      return;
    }

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      rol: user.rol
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono,
        rol: user.rol,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.errors });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        rol: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
