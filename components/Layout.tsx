
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-lime-400 p-2 rounded-lg">
            <i className="fas fa-table-tennis-paddle-ball text-slate-900 text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">PadelFlow</span>
        </div>

        <nav className="flex-1 space-y-2">
          {user.rol === UserRole.OWNER && (
            <>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-lime-400 text-slate-900' : 'hover:bg-slate-800'}`}
              >
                <i className="fas fa-chart-pie w-5"></i>
                <span className="font-medium">Dashboard</span>
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'calendar' ? 'bg-lime-400 text-slate-900' : 'hover:bg-slate-800'}`}
              >
                <i className="fas fa-calendar-alt w-5"></i>
                <span className="font-medium">Agenda</span>
              </button>
              <button 
                onClick={() => setActiveTab('courts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'courts' ? 'bg-lime-400 text-slate-900' : 'hover:bg-slate-800'}`}
              >
                <i className="fas fa-th w-5"></i>
                <span className="font-medium">Canchas</span>
              </button>
            </>
          )}
          {user.rol === UserRole.CLIENT && (
            <>
              <button 
                onClick={() => setActiveTab('explore')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'explore' ? 'bg-lime-400 text-slate-900' : 'hover:bg-slate-800'}`}
              >
                <i className="fas fa-search w-5"></i>
                <span className="font-medium">Explorar</span>
              </button>
              <button 
                onClick={() => setActiveTab('my-bookings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'my-bookings' ? 'bg-lime-400 text-slate-900' : 'hover:bg-slate-800'}`}
              >
                <i className="fas fa-history w-5"></i>
                <span className="font-medium">Mis Reservas</span>
              </button>
            </>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-lime-400" alt="avatar" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.nombre}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user.rol}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors"
          >
            <i className="fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="md:hidden flex items-center gap-2">
             <i className="fas fa-table-tennis-paddle-ball text-lime-600 text-xl"></i>
             <span className="text-lg font-bold">PadelFlow</span>
          </div>
          <h1 className="hidden md:block text-xl font-semibold capitalize">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-900">
              <i className="far fa-bell text-xl"></i>
            </button>
            <button className="md:hidden" onClick={onLogout}>
              <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-lime-400" alt="avatar" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        {user.rol === UserRole.OWNER ? (
          <>
            <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-lime-600' : 'text-slate-400'}`}>
              <i className="fas fa-chart-pie text-xl"></i>
              <span className="text-[10px] font-bold">Resumen</span>
            </button>
            <button onClick={() => setActiveTab('calendar')} className={`flex flex-col items-center gap-1 ${activeTab === 'calendar' ? 'text-lime-600' : 'text-slate-400'}`}>
              <i className="fas fa-calendar-alt text-xl"></i>
              <span className="text-[10px] font-bold">Agenda</span>
            </button>
            <button onClick={() => setActiveTab('courts')} className={`flex flex-col items-center gap-1 ${activeTab === 'courts' ? 'text-lime-600' : 'text-slate-400'}`}>
              <i className="fas fa-th text-xl"></i>
              <span className="text-[10px] font-bold">Canchas</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setActiveTab('explore')} className={`flex flex-col items-center gap-1 ${activeTab === 'explore' ? 'text-lime-600' : 'text-slate-400'}`}>
              <i className="fas fa-search text-xl"></i>
              <span className="text-[10px] font-bold">Explorar</span>
            </button>
            <button onClick={() => setActiveTab('my-bookings')} className={`flex flex-col items-center gap-1 ${activeTab === 'my-bookings' ? 'text-lime-600' : 'text-slate-400'}`}>
              <i className="fas fa-history text-xl"></i>
              <span className="text-[10px] font-bold">Mis Turnos</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Layout;
