
import React, { useState, useEffect } from 'react';

interface Turno {
  id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  sena_pagada: boolean;
  sena_monto: number;
  cancha: {
    nombre: string;
    precio_hora: number;
    complejo: {
      nombre: string;
    };
  };
}

const ClientBookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7001'}/api/turnos/my`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getEstadoInfo = (estado: string, senaPagada: boolean) => {
    if (estado === 'RESERVADO' && senaPagada) {
      return { text: 'Confirmado', color: 'bg-emerald-100 text-emerald-600' };
    }
    if (estado === 'PENDIENTE') {
      return { text: 'Pendiente Pago', color: 'bg-amber-100 text-amber-600' };
    }
    if (estado === 'CANCELADO') {
      return { text: 'Cancelado', color: 'bg-rose-100 text-rose-600' };
    }
    return { text: estado, color: 'bg-slate-100 text-slate-600' };
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-100 shadow-sm">
          <div className="text-center py-10">
            <i className="fas fa-spinner fa-spin text-4xl text-slate-300 mb-2"></i>
            <p className="text-slate-400">Cargando reservas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-lime-100 text-lime-600 rounded-2xl flex items-center justify-center">
            <i className="fas fa-ticket-alt text-xl"></i>
          </div>
          <div>
            <h2 className="font-bold text-xl">Mis Reservas</h2>
            <p className="text-sm text-slate-500">Gestiona tus partidos próximos y pasados</p>
          </div>
        </div>

        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map(b => {
              const estadoInfo = getEstadoInfo(b.estado, b.sena_pagada);
              return (
                <div key={b.id} className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <i className="fas fa-table-tennis-paddle-ball"></i>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{b.cancha.complejo.nombre}</p>
                      <p className="text-xs text-slate-500">{formatFecha(b.fecha)} • {b.hora_inicio} • {b.cancha.nombre}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${estadoInfo.color}`}>
                      {estadoInfo.text}
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-1">${b.cancha.precio_hora}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <i className="fas fa-history text-4xl text-slate-200 mb-2"></i>
              <p className="text-slate-400">Aún no tienes reservas.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <h3 className="font-bold mb-2">¿Necesitas ayuda?</h3>
        <p className="text-slate-400 text-sm mb-4">Si tienes problemas con una reserva, contacta con nuestro soporte técnico.</p>
        <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-2xl text-sm font-bold transition-all">
          Contactar Soporte
        </button>
      </div>
    </div>
  );
};

export default ClientBookingHistory;
