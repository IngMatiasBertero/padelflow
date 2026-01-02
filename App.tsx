
import React, { useState } from 'react';
import Layout from './components/Layout';
import AuthPage from './components/AuthPage';
import OwnerDashboard from './components/OwnerDashboard';
import OwnerCalendar from './components/OwnerCalendar';
import ClientExplore from './components/ClientExplore';
import ClientComplexDetail from './components/ClientComplexDetail';
import ClientBookingHistory from './components/ClientBookingHistory';
import { MOCK_USER } from './constants';
import { UserRole, Complejo, Cancha, Turno, User } from './types';

const App: React.FC = () => {
  // Estado para la sesión del usuario (null significa no logueado)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedComplex, setSelectedComplex] = useState<Complejo | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [pendingTurno, setPendingTurno] = useState<{turno: Partial<Turno>, cancha: Cancha} | null>(null);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab(user.rol === UserRole.OWNER ? 'dashboard' : 'explore');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedComplex(null);
  };

  // Si no hay usuario, mostramos la pantalla de login/registro
  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const handleBook = (turno: Partial<Turno>, cancha: Cancha) => {
    setPendingTurno({ turno, cancha });
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!pendingTurno) return;

    try {
      // Crear el turno en la base de datos
      const turno = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7001'}/api/turnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          cancha_id: pendingTurno.cancha.id,
          fecha: pendingTurno.turno.fecha,
          hora_inicio: pendingTurno.turno.hora_inicio
        })
      });

      if (!turno.ok) {
        const error = await turno.json();
        throw new Error(error.message || 'Error al crear la reserva');
      }

      const turnoData = await turno.json();

      // Crear preferencia de pago en Mercado Pago
      const preference = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7001'}/api/pagos/turnos/${turnoData.id}/preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!preference.ok) {
        const error = await preference.json();
        throw new Error(error.message || 'Error al crear la preferencia de pago');
      }

      const preferenceData = await preference.json();

      // Redirigir a Mercado Pago
      window.location.href = preferenceData.initPoint;

    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const renderContent = () => {
    if (selectedComplex && activeTab === 'explore' && currentUser.rol === UserRole.CLIENT) {
      return (
        <ClientComplexDetail 
          complex={selectedComplex} 
          onBack={() => setSelectedComplex(null)} 
          onBook={handleBook}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <OwnerDashboard />;
      case 'calendar':
        return <OwnerCalendar />;
      case 'explore':
        return <ClientExplore onSelectComplex={setSelectedComplex} />;
      case 'my-bookings':
        return <ClientBookingHistory />;
      case 'courts':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6">Mis Canchas</h2>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <i className="fas fa-table-tennis-paddle-ball text-2xl"></i>
                    </div>
                    <div>
                      <p className="font-bold">Cancha {i}</p>
                      <p className="text-sm text-slate-500">Padel • Blindex • Techada</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold">$4.500/hr</p>
                      <p className="text-xs text-lime-600 font-bold">Activa</p>
                    </div>
                    <button className="bg-slate-100 p-3 rounded-xl hover:bg-slate-200">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              <i className="fas fa-plus"></i>
              Añadir Nueva Cancha
            </button>
          </div>
        );
      default:
        return <div>Contenido en desarrollo...</div>;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setSelectedComplex(null);
        setActiveTab(tab);
      }}
      onLogout={handleLogout}
    >
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && pendingTurno && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-3xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Resumen de Reserva</h3>
              <p className="text-slate-500 mb-8">Estás a un paso de confirmar tu partido en {selectedComplex?.nombre}</p>
              
              <div className="bg-slate-50 rounded-3xl p-6 text-left space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs uppercase">Cancha</span>
                  <span className="font-bold text-slate-800">{pendingTurno.cancha.nombre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs uppercase">Fecha y Hora</span>
                  <span className="font-bold text-slate-800">{pendingTurno.turno.fecha} • {pendingTurno.turno.hora_inicio} hs</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs uppercase">Precio Total</span>
                  <span className="text-xl font-black text-slate-900">${pendingTurno.cancha.precio_hora}</span>
                </div>
                <div className="flex justify-between items-center text-lime-600">
                  <span className="font-bold text-xs uppercase">Seña requerida (25%)</span>
                  <span className="font-black">${pendingTurno.cancha.precio_hora * 0.25}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={confirmBooking}
                  className="w-full bg-[#009EE3] text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                >
                  <i className="fas fa-hand-holding-dollar"></i>
                  Pagar con Mercado Pago
                </button>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Transacción segura vía PadelFlow
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
