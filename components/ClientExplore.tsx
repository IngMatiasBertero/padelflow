
import React, { useState } from 'react';
import { MOCK_COMPLEJOS } from '../constants';
import { Complejo } from '../types';

interface ClientExploreProps {
  onSelectComplex: (complex: Complejo) => void;
}

const ClientExplore: React.FC<ClientExploreProps> = ({ onSelectComplex }) => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_COMPLEJOS.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) || 
    c.direccion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-slate-900">¿Dónde jugamos hoy?</h2>
        <p className="text-slate-500 text-sm">Reserva tu cancha en los mejores complejos de Santiago.</p>
      </div>

      <div className="relative group">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lime-500 transition-colors"></i>
        <input 
          type="text"
          placeholder="Buscar complejo (ej. Padelmania, Blindex...)"
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-4 focus:ring-lime-400/20 focus:border-lime-400 outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {['Todos', 'Cerca mío', 'Padel', 'Fútbol', 'Techado', 'Abierto ahora'].map(tag => (
          <button key={tag} className="bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filtered.map(comp => (
          <div 
            key={comp.id} 
            onClick={() => onSelectComplex(comp)}
            className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-lime-500/10 transition-all hover:-translate-y-1 cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={comp.imagen} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={comp.nombre} 
              />
              <div className="absolute top-4 left-4 bg-lime-400 text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg">
                Abierto
              </div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-xl">
                <i className="fas fa-star text-amber-400"></i>
                {comp.rating}
                <span className="text-slate-400 font-medium">({comp.reviewsCount})</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="bg-slate-900/40 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                   <p className="text-white text-[10px] font-bold uppercase tracking-widest opacity-80">Desde</p>
                   <p className="text-white text-lg font-black">$4.200</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-black text-xl text-slate-800 mb-1 truncate">{comp.nombre}</h3>
              <p className="text-slate-400 text-sm flex items-center gap-2 mb-4 font-medium italic">
                <i className="fas fa-location-dot text-lime-500"></i>
                {comp.direccion}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-100 uppercase">
                  <i className="fas fa-snowflake mr-1"></i> Blindex
                </span>
                <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-100 uppercase">
                  <i className="fas fa-coffee mr-1"></i> Buffet
                </span>
                <span className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-100 uppercase">
                  <i className="fas fa-parking mr-1"></i> Parking
                </span>
              </div>

              <button className="w-full bg-slate-900 text-white group-hover:bg-lime-500 group-hover:text-slate-900 py-4 rounded-[20px] font-black text-sm transition-all flex items-center justify-center gap-3 shadow-lg group-hover:shadow-lime-500/30">
                Reservar Turno
                <i className="fas fa-arrow-right-long text-xs"></i>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">No encontramos resultados</h3>
            <p className="text-slate-400">Intenta buscando con otro nombre de complejo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientExplore;
