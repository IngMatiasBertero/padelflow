const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001';

interface ApiError {
  error: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Error de conexión',
      }));
      throw new Error(error.message || error.error);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    nombre: string;
    rol: string;
    activationCode?: string;
  }) {
    return this.request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Turnos endpoints
  async getTurnos() {
    return this.request<any[]>('/api/turnos');
  }

  async getTurnosByUser() {
    return this.request<any[]>('/api/turnos/my');
  }

  async createTurno(data: {
    cancha_id: string;
    fecha: string;
    hora_inicio: string;
  }) {
    return this.request<any>('/api/turnos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Pagos endpoints
  async createPaymentPreference(turnoId: string) {
    return this.request<{
      preferenceId: string;
      initPoint: string;
      sandboxInitPoint: string;
    }>(`/api/pagos/turnos/${turnoId}/preference`, {
      method: 'POST',
    });
  }

  async checkPaymentStatus(turnoId: string) {
    return this.request<{
      estado: string;
      sena_pagada: boolean;
      pago_completo: boolean;
    }>(`/api/pagos/turnos/${turnoId}/status`);
  }

  // Complejos endpoints
  async getComplejos() {
    return this.request<any[]>('/api/complejos');
  }

  async getComplejo(id: string) {
    return this.request<any>(`/api/complejos/${id}`);
  }

  // Canchas endpoints
  async getCanchas(complejoId?: string) {
    const query = complejoId ? `?complejo_id=${complejoId}` : '';
    return this.request<any[]>(`/api/canchas${query}`);
  }
}

export const apiService = new ApiService();
