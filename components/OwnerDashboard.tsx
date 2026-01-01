
import React, { useState, useEffect } from 'react';
import { getSmartInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Lun', turnos: 12 },
  { name: 'Mar', turnos: 15 },
  { name: 'Mie', turnos: 18 },
  { name: 'Jue', turnos: 22 },
  { name: 'Vie', turnos: 30 },
  { name: 'Sab', turnos: 35 },
  { name: 'Dom', turnos: 28 },
];

const COLORS = ['#64748b', '#64748b', '#64748b', '#64748b', '#64748b', '#a3e635', '#a3e635'];

const OwnerDashboard: React.FC = () => {
  const [insights, setInsights] = useState<string>('Analizando datos con IA...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      const result = await getSmartInsights(data);
      setInsights(result || "Error al cargar recomendaciones.");
      setLoading(false);
    };
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ingresos Hoy', val: '$42.500', icon: 'fa-money-bill-trend-up', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Ocupación', val: '84%', icon: 'fa-chart-line', color: 'text-lime-600', bg: 'bg-lime-50' },
          { label: 'Turnos Pendientes', val: '5', icon: 'fa-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Clientes Nuevos', val: '12', icon: 'fa-user-plus', color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`${item.bg} ${item.color} p-3 rounded-xl`}>
                <i className={`fas ${item.icon} text-lg`}></i>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hoy</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{item.label}</p>
            <p className="text-2xl font-bold mt-1">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg">Demanda Semanal</h3>
             <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg p-1 px-2 outline-none">
               <option>Últimos 7 días</option>
               <option>Mes actual</option>
             </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="turnos" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-lime-400 p-2 rounded-lg">
              <i className="fas fa-wand-magic-sparkles text-slate-900"></i>
            </div>
            <h3 className="font-bold text-lg">Insights de IA</h3>
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm">
                <p className="text-slate-300 leading-relaxed italic">
                  "{insights}"
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <button className="w-full bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <i className="fas fa-redo text-xs"></i>
              Actualizar Análisis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
