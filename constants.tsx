
import React from 'react';
import { 
  Wifi, 
  Coffee, 
  Car, 
  ShowerHead, 
  GlassWater, 
  User, 
  Calendar, 
  MapPin, 
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Complex, Court } from './types';

export const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'estacionamiento': <Car size={16} />,
  'vestuarios': <ShowerHead size={16} />,
  'cantina': <Coffee size={16} />,
  'wifi': <Wifi size={16} />,
  'bar': <GlassWater size={16} />
};

export const MOCK_COMPLEXES: Complex[] = [
  {
    id: 1,
    admin_id: 101,
    name: "El Galpón Club De Padel",
    slug: "el-galpon-padel",
    description: "Espacio techado de alto rendimiento con excelente ambiente social.",
    address: "Av. Libertad 2797",
    neighborhood: "Barrio Mosconi",
    latitude: -27.7801,
    longitude: -64.2700,
    phone: "385-4000000",
    whatsapp: "5493854000000",
    email: "contacto@elgalpon.com",
    logo_url: "https://picsum.photos/seed/galponlogo/200/200",
    cover_url: "https://images.unsplash.com/photo-1592910129844-97103835848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["estacionamiento", "vestuarios", "cantina", "wifi"],
    opening_time: "08:00",
    closing_time: "00:00",
    is_active: true,
    rating: 4.5
  },
  {
    id: 2,
    admin_id: 102,
    name: "Club Master Pádel",
    slug: "master-padel",
    description: "Complejo céntrico con canchas profesionales y atención personalizada.",
    address: "Hipólito Yrigoyen 663",
    neighborhood: "Centro",
    latitude: -27.7850,
    longitude: -64.2600,
    phone: "385 689-1198",
    whatsapp: "5493856891198",
    email: "info@masterpadel.com",
    logo_url: "https://picsum.photos/seed/masterlogo/200/200",
    cover_url: "https://images.unsplash.com/photo-1626242342617-0cb613f39965?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["vestuarios", "bar", "wifi"],
    opening_time: "15:00",
    closing_time: "01:00",
    is_active: true,
    rating: 4.5
  },
  {
    id: 3,
    admin_id: 103,
    name: "SANTIAGO PADEL CLUB",
    slug: "santiago-padel-club",
    description: "El club histórico de la capital. Variedad de pistas y torneos constantes.",
    address: "Avenida Libertador y Lavalle",
    neighborhood: "Barrio Santa Lucía",
    latitude: -27.7900,
    longitude: -64.2800,
    phone: "385 486-1436",
    whatsapp: "5493854861436",
    email: "club@santiagopadel.com",
    logo_url: "https://picsum.photos/seed/spclogo/200/200",
    cover_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["estacionamiento", "vestuarios", "cantina"],
    opening_time: "14:00",
    closing_time: "00:00",
    is_active: true,
    rating: 4.5
  },
  {
    id: 4,
    admin_id: 104,
    name: "Padel Zone",
    slug: "padel-zone",
    description: "Moderna infraestructura con canchas de blindex y excelente iluminación LED.",
    address: "Neuquen 1450",
    neighborhood: "Barrio Alberdi",
    latitude: -27.7750,
    longitude: -64.2550,
    phone: "385 473-8502",
    whatsapp: "5493854738502",
    email: "ventas@padelzone.com",
    logo_url: "https://picsum.photos/seed/zonelogo/200/200",
    cover_url: "https://images.unsplash.com/photo-1530549387631-f535c18b1742?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["estacionamiento", "wifi", "bar"],
    opening_time: "08:00",
    closing_time: "23:30",
    is_active: true,
    rating: 4.6
  },
  {
    id: 5,
    admin_id: 105,
    name: "Pádelmania",
    slug: "padelmania-sgo",
    description: "Pasión por el padel. Las mejores clases y canchas del norte de la ciudad.",
    address: "Andrés Rojas s/n",
    neighborhood: "Barrio Aeropuerto",
    latitude: -27.7600,
    longitude: -64.2500,
    phone: "385 402-0264",
    whatsapp: "5493854020264",
    email: "info@padelmania.com",
    logo_url: "https://picsum.photos/seed/manialogo/200/200",
    cover_url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["vestuarios", "wifi", "cantina"],
    opening_time: "14:00",
    closing_time: "00:00",
    is_active: true,
    rating: 4.8
  },
  {
    id: 6,
    admin_id: 106,
    name: "Padel Belgrano Sur",
    slug: "padel-belgrano",
    description: "Canchas clásicas en una ubicación privilegiada sobre la avenida principal.",
    address: "Av. Belgrano Sur 1540",
    neighborhood: "Barrio Belgrano",
    latitude: -27.8000,
    longitude: -64.2650,
    phone: "385 585-5048",
    whatsapp: "5493855855048",
    email: "admin@padelbelgrano.com",
    logo_url: "https://picsum.photos/seed/belgranologo/200/200",
    cover_url: "https://images.unsplash.com/photo-1626242342617-0cb613f39965?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["estacionamiento", "bar"],
    opening_time: "09:00",
    closing_time: "23:00",
    is_active: true,
    rating: 3.7
  },
  {
    id: 7,
    admin_id: 107,
    name: "Unity Club",
    slug: "unity-club",
    description: "Donde el deporte y la comunidad se unen. Ambiente familiar y competitivo.",
    address: "Agustin Carabajal y Patrocinia Díaz",
    neighborhood: "Barrio Tradición",
    latitude: -27.8100,
    longitude: -64.2600,
    phone: "385 472-3508",
    whatsapp: "5493854723508",
    email: "unity@club.com",
    logo_url: "https://picsum.photos/seed/unitylogo/200/200",
    cover_url: "https://images.unsplash.com/photo-1599423300746-b62502895724?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["vestuarios", "bar", "wifi", "estacionamiento"],
    opening_time: "08:00",
    closing_time: "00:00",
    is_active: true,
    rating: 4.5
  },
  {
    id: 8,
    admin_id: 108,
    name: "Padel Blindex",
    slug: "padel-blindex",
    description: "Canchas de cristal de primer nivel en el corazón del centro.",
    address: "Garibaldi s/n",
    neighborhood: "Centro",
    latitude: -27.7870,
    longitude: -64.2620,
    phone: "385 593-5253",
    whatsapp: "5493855935253",
    email: "blindex@padel.com",
    logo_url: "https://picsum.photos/seed/blindexlogo/200/200",
    cover_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["wifi", "vestuarios", "bar"],
    opening_time: "14:00",
    closing_time: "01:00",
    is_active: true,
    rating: 4.4
  },
  {
    id: 9,
    admin_id: 109,
    name: "Autopista Padel",
    slug: "autopista-padel",
    description: "Fácil acceso y canchas impecables. Ideal para jugadores de Capital y La Banda.",
    address: "Autopista Santiago - La Banda",
    neighborhood: "La Banda / Acceso",
    latitude: -27.7650,
    longitude: -64.2400,
    phone: "385 438-1217",
    whatsapp: "5493854381217",
    email: "autopista@padel.com",
    logo_url: "https://picsum.photos/seed/autologo/200/200",
    cover_url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    amenities: ["estacionamiento", "bar", "wifi"],
    opening_time: "08:00",
    closing_time: "23:00",
    is_active: true,
    rating: 4.1
  }
];

export const MOCK_COURTS: Court[] = [
  // Canchas para El Galpón
  { id: 101, complex_id: 1, name: "Pista Central (Techada)", surface_type: "cristal", is_covered: true, is_illuminated: true, photos: ["https://picsum.photos/seed/c1/800/600"], status: "active" },
  { id: 102, complex_id: 1, name: "Pista 2", surface_type: "cristal", is_covered: true, is_illuminated: true, photos: ["https://picsum.photos/seed/c2/800/600"], status: "active" },
  
  // Canchas para Club Master
  { id: 201, complex_id: 2, name: "Master 1", surface_type: "cristal", is_covered: false, is_illuminated: true, photos: ["https://picsum.photos/seed/c3/800/600"], status: "active" },
  { id: 202, complex_id: 2, name: "Master 2", surface_type: "sintético", is_covered: false, is_illuminated: true, photos: ["https://picsum.photos/seed/c4/800/600"], status: "active" },

  // Canchas para Santiago Padel Club
  { id: 301, complex_id: 3, name: "La Catedral", surface_type: "cristal", is_covered: true, is_illuminated: true, photos: ["https://picsum.photos/seed/c5/800/600"], status: "active" },
  { id: 302, complex_id: 3, name: "Pista 2 (Cemento)", surface_type: "cemento", is_covered: false, is_illuminated: true, photos: ["https://picsum.photos/seed/c6/800/600"], status: "active" },

  // Canchas para Padel Zone
  { id: 401, complex_id: 4, name: "Zone Alpha", surface_type: "cristal", is_covered: true, is_illuminated: true, photos: ["https://picsum.photos/seed/c7/800/600"], status: "active" },

  // Canchas para Pádelmania
  { id: 501, complex_id: 5, name: "Mania 1", surface_type: "cristal", is_covered: true, is_illuminated: true, photos: ["https://picsum.photos/seed/c8/800/600"], status: "active" },

  // Canchas para Belgrano Sur
  { id: 601, complex_id: 6, name: "Pista 1", surface_type: "cemento", is_covered: false, is_illuminated: true, photos: ["https://picsum.photos/seed/c9/800/600"], status: "active" },

  // Canchas para Unity Club
  { id: 701, complex_id: 7, name: "Unity Center", surface_type: "cristal", is_covered: true, is_illuminated: true, photos: ["https://picsum.photos/seed/c10/800/600"], status: "active" },

  // Canchas para Blindex
  { id: 801, complex_id: 8, name: "Blindex Pro", surface_type: "cristal", is_covered: false, is_illuminated: true, photos: ["https://picsum.photos/seed/c11/800/600"], status: "active" },

  // Canchas para Autopista
  { id: 901, complex_id: 9, name: "Pista Autopista", surface_type: "cristal", is_covered: false, is_illuminated: true, photos: ["https://picsum.photos/seed/c12/800/600"], status: "active" }
];
