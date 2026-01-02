
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [ownerCode, setOwnerCode] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    nombreComplejo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica para Dueños en el Registro
    if (!isLogin && role === UserRole.OWNER && !formData.nombreComplejo) {
      setError('El nombre del complejo es obligatorio');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7001';
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

      const body: any = {
        email: formData.email,
        password: formData.password,
      };

      if (!isLogin) {
        body.nombre = formData.nombre;
        body.rol = role;
        if (role === UserRole.OWNER) {
          body.activationCode = ownerCode;
        }
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error en la autenticación');
      }

      // Guardar token en localStorage
      localStorage.setItem('token', data.token);

      // Crear objeto de usuario
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        nombre: data.user.nombre,
        telefono: data.user.telefono,
        rol: data.user.rol,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.nombre}`
      };

      onAuthSuccess(user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-10 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-lime-400 rounded-3xl shadow-xl mb-4 rotate-3">
            <i className="fas fa-table-tennis-paddle-ball text-3xl"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">PadelFlow</h1>
          <p className="text-slate-500 font-medium mt-2">Gestión de turnos en Santiago del Estero</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
          {/* Tabs */}
          <div className="flex border-b border-slate-50">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-6 text-sm font-bold transition-all ${isLogin ? 'text-slate-900 border-b-4 border-lime-400' : 'text-slate-400 hover:text-slate-600'}`}
            >
              INGRESAR
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-6 text-sm font-bold transition-all ${!isLogin ? 'text-slate-900 border-b-4 border-lime-400' : 'text-slate-400 hover:text-slate-600'}`}
            >
              CREAR CUENTA
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-xs font-bold animate-in shake duration-300">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="animate-in fade-in duration-500">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">¿Cuál es tu rol?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => { setRole(UserRole.CLIENT); setError(''); }}
                    className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1 ${role === UserRole.CLIENT ? 'border-lime-400 bg-lime-50 text-slate-900 shadow-sm' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    <i className="fas fa-user text-lg"></i>
                    Jugador
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setRole(UserRole.OWNER); setError(''); }}
                    className={`py-3 rounded-2xl border-2 font-bold text-sm transition-all flex flex-col items-center gap-1 ${role === UserRole.OWNER ? 'border-lime-400 bg-lime-50 text-slate-900 shadow-sm' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    <i className="fas fa-building text-lg"></i>
                    Dueño
                  </button>
                </div>
              </div>
            )}

            {!isLogin && role === UserRole.OWNER && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 animate-in slide-in-from-top-4 duration-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Información del Complejo</p>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Nombre Comercial</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Premium Padel Club"
                    className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-lime-400 outline-none transition-all text-sm font-medium"
                    required={role === UserRole.OWNER}
                    onChange={(e) => setFormData({...formData, nombreComplejo: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Código de Activación</label>
                  <input 
                    type="text" 
                    placeholder="Código otorgado por PadelFlow"
                    className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-lime-400 outline-none transition-all text-sm font-medium"
                    required={role === UserRole.OWNER}
                    onChange={(e) => setOwnerCode(e.target.value)}
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Nombre Completo</label>
                <input 
                  type="text" 
                  placeholder="Ej: Gabi Padel"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-4 focus:ring-lime-400/20 outline-none transition-all font-medium"
                  required
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="tu@email.com"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-4 focus:ring-lime-400/20 outline-none transition-all font-medium"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 focus:ring-4 focus:ring-lime-400/20 outline-none transition-all font-medium"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
            >
              {isLogin ? 'INICIAR SESIÓN' : (role === UserRole.OWNER ? 'SOLICITAR ALTA DE DUEÑO' : 'REGISTRARME AHORA')}
            </button>

            {isLogin && (
              <div className="text-center">
                <button type="button" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">¿Olvidaste tu contraseña?</button>
              </div>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-2 text-slate-300 tracking-widest">O continúa con</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5" alt="google" />
                <span className="text-xs font-bold">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5" alt="fb" />
                <span className="text-xs font-bold">Facebook</span>
              </button>
            </div>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-8 leading-relaxed">
          Las cuentas de dueño están sujetas a <span className="text-slate-900">verificación de identidad</span> para garantizar la seguridad del complejo.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
