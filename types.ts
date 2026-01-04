
export type UserRole = 'user' | 'admin' | 'super_admin';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Complex {
  id: number;
  admin_id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string;
  email: string;
  logo_url: string;
  cover_url: string;
  amenities: string[];
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  rating?: number;
}

export interface Court {
  id: number;
  complex_id: number;
  name: string;
  surface_type: 'cristal' | 'cemento' | 'sintético';
  is_covered: boolean;
  is_illuminated: boolean;
  photos: string[];
  status: 'active' | 'maintenance' | 'inactive';
}

export interface Booking {
  id: number;
  user_id: number;
  court_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_amount: number;
  deposit_amount: number;
  status: 'pending' | 'deposit_paid' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  notes?: string;
}

export interface Review {
  id: number;
  user_id: number;
  complex_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  created_at: string;
  userName?: string;
}
