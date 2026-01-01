
import { Complejo, Cancha, User, UserRole } from './types';

// Seteamos el usuario como CLIENTE para ver el panel de reservas directamente
export const MOCK_USER: User = {
  id: 'u_client_1',
  email: 'usuario@santiago.com',
  nombre: 'Gabi Jugador',
  telefono: '3856000111',
  rol: UserRole.CLIENT,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
};

export const MOCK_COMPLEJOS: Complejo[] = [
  {
    id: 'spc',
    nombre: 'SANTIAGO PADEL CLUB',
    ciudad: 'Santiago del Estero',
    direccion: 'Avenida Libertador y Lavalle',
    telefono: '+54 385 486-1436',
    owner_id: 'o1',
    horario_apertura: '08:00',
    horario_cierre: '02:00',
    imagen: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    reviewsCount: 94
  },
  {
    id: 'pm',
    nombre: 'Pádelmania',
    ciudad: 'Santiago del Estero',
    direccion: 'Andrés Rojas',
    telefono: '+54 385 402-0264',
    owner_id: 'o2',
    horario_apertura: '09:00',
    horario_cierre: '00:00',
    imagen: 'https://images.unsplash.com/photo-1592910129881-892bbe239cc6?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 84
  },
  {
    id: 'lcp',
    nombre: 'La Costa Padel',
    ciudad: 'Santiago del Estero',
    direccion: 'Av. Victor Alcorta 3414',
    telefono: '+54 385 516-3779',
    owner_id: 'o3',
    horario_apertura: '08:00',
    horario_cierre: '00:00',
    imagen: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 73
  },
  {
    id: 'cmp',
    nombre: 'Club Master Pádel',
    ciudad: 'Santiago del Estero',
    direccion: 'Hipólito Yrigoyen 663',
    telefono: '+54 385 689-1198',
    owner_id: 'o4',
    horario_apertura: '08:00',
    horario_cierre: '00:00',
    imagen: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    reviewsCount: 66
  },
  {
    id: 'pb',
    nombre: 'Padel Blindex',
    ciudad: 'Santiago del Estero',
    direccion: 'Garibaldi',
    telefono: '+54 385 593-5253',
    owner_id: 'o5',
    horario_apertura: '09:00',
    horario_cierre: '02:30',
    imagen: 'https://images.unsplash.com/photo-1541534741688-6078c64b5ca5?q=80&w=800&auto=format&fit=crop',
    rating: 4.4,
    reviewsCount: 101
  },
  {
    id: 'egp',
    nombre: 'El Galpón Club De Padel',
    ciudad: 'Santiago del Estero',
    direccion: 'Av. Libertad 2797',
    telefono: 'S/N',
    owner_id: 'o6',
    horario_apertura: '08:00',
    horario_cierre: '23:59',
    imagen: 'https://images.unsplash.com/photo-1530549387631-afb16851216d?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    reviewsCount: 32
  },
  {
    id: 'pz',
    nombre: 'Padel Zone',
    ciudad: 'Santiago del Estero',
    direccion: 'Neuquen 1450',
    telefono: '+54 385 473-8502',
    owner_id: 'o7',
    horario_apertura: '08:00',
    horario_cierre: '23:30',
    imagen: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    reviewsCount: 72
  },
  {
    id: 'cds',
    nombre: 'Complejo deportivo Salto',
    ciudad: 'Santiago del Estero',
    direccion: 'El Jacaranda Barrio',
    telefono: '+54 385 590-3685',
    owner_id: 'o8',
    horario_apertura: '09:00',
    horario_cierre: '00:00',
    imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    reviewsCount: 115
  },
  {
    id: 'sp',
    nombre: 'Sombra Padel',
    ciudad: 'La Banda',
    direccion: 'La Banda, Santiago del Estero',
    telefono: '+54 385 520-2647',
    owner_id: 'o9',
    horario_apertura: '00:00',
    horario_cierre: '23:59',
    imagen: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviewsCount: 15
  },
  {
    id: 'uc',
    nombre: 'Unity Club',
    ciudad: 'Santiago del Estero',
    direccion: 'Santiago del Estero',
    telefono: 'S/N',
    owner_id: 'o10',
    horario_apertura: '08:00',
    horario_cierre: '23:00',
    imagen: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    reviewsCount: 93
  }
];

// Generar algunas canchas para cada complejo
export const MOCK_CANCHAS: Cancha[] = MOCK_COMPLEJOS.flatMap(comp => [
  { id: `cancha_${comp.id}_1`, complejo_id: comp.id, nombre: 'Cancha 1 (Blindex)', tipo: 'blindex', precio_hora: 4800, activa: true },
  { id: `cancha_${comp.id}_2`, complejo_id: comp.id, nombre: 'Cancha 2 (Techada)', tipo: 'techada', precio_hora: 4200, activa: true }
]);

export const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '16:00', '17:00', '18:00', '19:00', '20:00', 
  '21:00', '22:00', '23:00', '00:00'
];
