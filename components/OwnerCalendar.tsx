
import React, { useState } from 'react';
import { HOURS, MOCK_CANCHAS } from '../constants';
import { Cancha, Turno } from '../types';

const OwnerCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<Turno[]>([]);
  
  // Mocking some bookings
  const mockBookings: Turno[] = [
    { id: '1', cancha_id: 'ca1', fecha: selectedDate, hora_inicio: '18:00', hora_fin: '19:00', estado: 'reservado', cliente_nombre: 'Ricardo G.', precio: 4500, seña_pagada: true },
    { id: '2', cancha_id: 'ca2', fecha: selectedDate, hora_inicio: '20:00', hora_fin: '21:00', estado: 'pendiente', cliente_nombre: 'Matias L.', precio: 4000, seña_pagada: false },
    { id: '3', cancha_id: 'ca1', fecha: selectedDate, hora_inicio: '21:30', hora_fin: '22:30', estado: 'reservado', cliente_nombre: 'Santi P.', precio: 4500, seña_pagada: true },
  ];

  const getBookingForSlot = (canchaId: string, hour: string) => {
    return mockBookings.find(b => b.cancha_id === canchaId && b.hora_inicio === hour);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-lime-400 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="w-3 h-3 bg-lime-400 rounded-full"></span> Reservado
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="w-3 h-3 bg-amber-400 rounded-full"></span> Pendiente
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="w-3 h-3 bg-slate-100 border rounded-full"></span> Libre
          </div>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="flex bg-slate-50 border-b">
            <div className="w-20 p-4 sticky left-0 bg-slate-50 z-10 border-r font-bold text-slate-400 text-xs uppercase tracking-wider">Hora</div>
            {MOCK_CANCHAS.filter(c => c.complejo_id === 'c1').map(cancha => (
              <div key={cancha.id} className="flex-1 p-4 text-center font-bold text-slate-700 border-r last:border-r-0">
                {cancha.nombre}
                <div className="text-[10px] text-slate-400 font-normal uppercase">{cancha.tipo}</div>
              </div>
            ))}
          </div>

          {/* Slots */}
          {HOURS.map(hour => (
            <div key={hour} className="flex border-b last:border-b-0 hover:bg-slate-50/50 transition-colors">
              <div className="w-20 p-4 sticky left-0 bg-white z-10 border-r font-semibold text-slate-500 text-sm">{hour}</div>
              {MOCK_CANCHAS.filter(c => c.complejo_id === 'c1').map(cancha => {
                const booking = getBookingForSlot(cancha.id, hour);
                return (
                  <div 
                    key={`${cancha.id}-${hour}`} 
                    className={`flex-1 min-h-[60px] p-2 border-r last:border-r-0 relative group cursor-pointer transition-all`}
                  >
                    {booking ? (
                      <div className={`h-full w-full rounded-lg p-2 text-xs font-medium shadow-sm flex flex-col justify-between ${
                        booking.estado === 'reservado' ? 'bg-lime-50 text-lime-800 border border-lime-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <div className="truncate font-bold">{booking.cliente_nombre}</div>
                        <div className="flex justify-between items-center mt-1">
                           <span>{booking.seña_pagada ? 'PAGADO' : 'SEÑA PEND.'}</span>
                           <i className="fas fa-check-circle opacity-50"></i>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-slate-300">
                        <i className="fas fa-plus-circle text-lg"></i>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerCalendar;
