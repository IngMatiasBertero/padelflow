
import React from 'react';

const ClientBookingHistory: React.FC = () => {
  const pastBookings = [
    { id: 'b1', complejo: 'Santiago Padel Center', cancha: 'Cancha 1 (Blindex)', fecha: '15 Oct, 2023', hora: '19:00', precio: 4500, estado: 'completado' },
    { id: 'b2', complejo: 'La Redonda Fútbol', cancha: 'Fútbol 5 - A', fecha: '20 Oct, 2023', hora: '21:00', precio: 8000, estado: 'cancelado' },
  ];

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
          {pastBookings.length > 0 ? (
            pastBookings.map(b => (
              <div key={b.id} className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <i className="fas fa-table-tennis-paddle-ball"></i>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{b.complejo}</p>
                    <p className="text-xs text-slate-500">{b.fecha} • {b.hora} • {b.cancha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    b.estado === 'completado' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {b.estado}
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">${b.precio}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <i className="fas fa-history text-4xl text-slate-200 mb-2"></i>
              <p className="text-slate-400">Aún no tienes historial de juegos.</p>
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
