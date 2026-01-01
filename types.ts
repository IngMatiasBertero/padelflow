
export enum UserRole {
  CLIENT = 'cliente',
  OWNER = 'dueño',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  telefono: string;
  rol: UserRole;
  avatar?: string;
}

export interface Complejo {
  id: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  owner_id: string;
  horario_apertura: string; 
  horario_cierre: string;   
  imagen: string;
  rating: number;
  reviewsCount: number;
}

export interface Cancha {
  id: string;
  complejo_id: string;
  nombre: string;
  tipo: 'techada' | 'descubierta' | 'blindex';
  precio_hora: number;
  activa: boolean;
}

export interface Turno {
  id: string;
  cancha_id: string;
  fecha: string; 
  hora_inicio: string; 
  hora_fin: string;
  cliente_id?: string;
  cliente_nombre?: string;
  estado: 'disponible' | 'reservado' | 'pendiente' | 'bloqueado';
  precio: number;
  seña_pagada: boolean;
}

export type ViewType = 'client' | 'owner' | 'admin';
