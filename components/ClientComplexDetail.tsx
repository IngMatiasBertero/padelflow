
import React, { useState } from 'react';
import { Complejo, Cancha, Turno } from '../types';
import { MOCK_CANCHAS, HOURS } from '../constants';

interface ClientComplexDetailProps {
  complex: Complejo;
  onBack: () => void;
  onBook: (turno: Partial<Turno>, cancha: Cancha) => void;
}

const ClientComplexDetail: React.FC<ClientComplexDetailProps> = ({ complex, onBack, onBook }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const canchas = MOCK_CANCHAS.filter(c => c.complejo_id === complex.id);

  // Generate next 7 days for the date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('es-AR', { weekday: 'short' }),
      dayNum: d.getDate(),
    };
  });

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
      >
        <i className="fas fa-arrow-left"></i>
        Volver a la búsqueda
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-8">
        <div className="relative h-64">
          <img src={complex.imagen} className="w-full h-full object-cover" alt={complex.nombre} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold">{complex.nombre}</h2>
              <p className="opacity-90 flex items-center gap-2 mt-1">
                <i className="fas fa-map-marker-alt text-lime-400"></i>
                {complex.direccion}, {complex.ciudad}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4">Seleccionar Fecha</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {dates.map((d) => (
            <button
              key={d.full}
              onClick={() => setSelectedDate(d.full)}
              className={`flex flex-col items-center min-w-[70px] py-4 rounded-2xl transition-all border ${
                selectedDate === d.full 
                ? 'bg-lime-500 border-lime-500 text-slate-900 shadow-lg shadow-lime-500/20 scale-105' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] uppercase font-bold mb-1">{d.dayName}</span>
              <span className="text-xl font-black">{d.dayNum}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Grid */}
      <div className="space-y-8">
        {canchas.map(cancha => (
          <div key={cancha.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-bold text-xl">{cancha.nombre}</h4>
                <p className="text-sm text-slate-500 uppercase font-medium">{cancha.tipo} • 60 min</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">${cancha.precio_hora}</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Por turno</p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {HOURS.map(hour => {
                const isBooked = Math.random() > 0.8; // Simulate some booked slots
                return (
                  <button
                    key={hour}
                    disabled={isBooked}
                    onClick={() => onBook({ fecha: selectedDate, hora_inicio: hour }, cancha)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                      isBooked 
                      ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-lime-500 hover:text-lime-600'
                    }`}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientComplexDetail;
