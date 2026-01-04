
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  User as UserIcon, 
  LayoutDashboard, 
  MapPin, 
  Star, 
  ChevronRight, 
  Filter,
  CheckCircle2,
  Clock,
  Menu,
  X,
  CreditCard,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { 
  Complex, 
  Court, 
  User, 
  Booking, 
  Review 
} from './types';
import { 
  MOCK_COMPLEXES, 
  MOCK_COURTS, 
  AMENITY_ICONS 
} from './constants';
import { getSmartSummary } from './services/geminiService';

// --- Navigation ---
type Page = 'home' | 'explore' | 'complex-detail' | 'admin' | 'profile' | 'booking-flow';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedComplex, setSelectedComplex] = useState<Complex | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    email: 'marcos@example.com',
    name: 'Marcos Galperin',
    role: 'user',
    avatar_url: 'https://i.pravatar.cc/150?u=marcos'
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Shared state simulation
  const [bookings, setBookings] = useState<Booking[]>([]);

  const navigate = (page: Page, complex?: Complex) => {
    if (complex) setSelectedComplex(complex);
    setCurrentPage(page);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('home')}
        >
          {/* Fix: Handled 'Cannot find name Zap' error by adding Zap to imports */}
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-indigo-900">PadelFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <button onClick={() => navigate('explore')} className="hover:text-indigo-600 transition-colors">Explorar</button>
          <button onClick={() => navigate('profile')} className="hover:text-indigo-600 transition-colors">Mis Reservas</button>
          {currentUser?.role === 'admin' && (
            <button onClick={() => navigate('admin')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors">
              <LayoutDashboard size={16} />
              Admin
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden md:block">
            <UserAvatar user={currentUser} onClick={() => navigate('profile')} />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col gap-6 md:hidden">
          <button onClick={() => navigate('explore')} className="text-2xl font-bold text-gray-800 text-left">Explorar</button>
          <button onClick={() => navigate('profile')} className="text-2xl font-bold text-gray-800 text-left">Mis Reservas</button>
          <button onClick={() => navigate('admin')} className="text-2xl font-bold text-indigo-600 text-left">Panel Administrador</button>
          <hr />
          <div className="flex items-center gap-4">
            <UserAvatar user={currentUser} onClick={() => navigate('profile')} />
            <span className="font-semibold">{currentUser?.name}</span>
          </div>
        </div>
      )}

      {/* Content Rendering */}
      <main className="flex-grow">
        {currentPage === 'home' && <HomePage onExplore={() => navigate('explore')} onSelectComplex={(c) => navigate('complex-detail', c)} />}
        {currentPage === 'explore' && <ExplorePage onSelectComplex={(c) => navigate('complex-detail', c)} />}
        {currentPage === 'complex-detail' && selectedComplex && (
          <ComplexDetailPage 
            complex={selectedComplex} 
            onBack={() => navigate('explore')} 
            onBook={() => navigate('booking-flow')} 
          />
        )}
        {currentPage === 'booking-flow' && selectedComplex && (
          <BookingFlow 
            complex={selectedComplex} 
            user={currentUser} 
            onCancel={() => navigate('complex-detail', selectedComplex)}
            onSuccess={() => navigate('profile')}
          />
        )}
        {currentPage === 'profile' && <ProfilePage user={currentUser} />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 md:px-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Fix: Handled 'Cannot find name Zap' error by adding Zap to imports */}
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-bold">PadelFlow</span>
            </div>
            <p className="text-gray-400 text-sm">Simplificando el deporte en Santiago del Estero. Reservá, jugá y disfrutá.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => navigate('explore')}>Explorar Canchas</button></li>
              <li><button onClick={() => navigate('home')}>Cómo Funciona</button></li>
              <li><button>Preguntas Frecuentes</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Administradores</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button>Registrar Complejo</button></li>
              <li><button>Panel de Gestión</button></li>
              <li><button>Precios y Comisiones</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button>Términos de Uso</button></li>
              <li><button>Política de Privacidad</button></li>
              <li><button>Políticas de Cancelación</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
          © 2024 PadelFlow. Desarrollado con ❤️ para Santiago del Estero.
        </div>
      </footer>
    </div>
  );
};

// --- Sub-Components ---

const UserAvatar: React.FC<{ user: User | null; onClick?: () => void }> = ({ user, onClick }) => (
  <button 
    onClick={onClick}
    className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden hover:scale-105 transition-transform"
  >
    <img src={user?.avatar_url || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-full h-full object-cover" />
  </button>
);

const HomePage: React.FC<{ onExplore: () => void; onSelectComplex: (c: Complex) => void }> = ({ onExplore, onSelectComplex }) => (
  <div className="flex flex-col">
    {/* Hero Section */}
    <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1626242342617-0cb613f39965?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
        className="absolute inset-0 w-full h-full object-cover" 
        alt="Hero Background"
      />
      <div className="relative z-20 text-center px-4 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Reservá tu cancha <br />en segundos
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Encontrá los mejores complejos de padel en Santiago del Estero. Rápido, seguro y con seña online.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-lg mx-auto">
          <button 
            onClick={onExplore}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            Explorar Ahora <ChevronRight size={20} />
          </button>
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl flex items-center gap-3 border border-white/20">
            <CheckCircle2 className="text-green-400" />
            <span className="font-semibold text-sm">Disponibilidad en tiempo real</span>
          </div>
        </div>
      </div>
    </section>

    {/* Featured Complexes */}
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Complejos Destacados</h2>
          <p className="text-gray-500">Los lugares favoritos de la comunidad en Santiago.</p>
        </div>
        <button onClick={onExplore} className="text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
          Ver todos <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_COMPLEXES.map(complex => (
          <ComplexCard key={complex.id} complex={complex} onClick={() => onSelectComplex(complex)} />
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="bg-gray-100 py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Cómo funciona PadelFlow</h2>
          <p className="text-gray-500">Reservar nunca fue tan fácil. Olvidate de los WhatsApp eternos.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Busca y Filtra</h3>
            <p className="text-gray-600">Encontrá canchas por barrio, tipo de superficie (cristal/cemento) o amenities.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Elegí tu Turno</h3>
            <p className="text-gray-600">Visualizá la disponibilidad en tiempo real y elegí el horario que más te convenga.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Paga la Seña</h3>
            <p className="text-gray-600">Asegurá tu cancha pagando el 50% con Mercado Pago de forma 100% segura.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const ComplexCard: React.FC<{ complex: Complex; onClick: () => void }> = ({ complex, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer"
  >
    <div className="relative h-56 overflow-hidden">
      <img src={complex.cover_url} alt={complex.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-gray-800">
        <Star size={14} className="text-yellow-500 fill-yellow-500" /> {complex.rating}
      </div>
      <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        {complex.neighborhood}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{complex.name}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{complex.description}</p>
      <div className="flex flex-wrap gap-2">
        {complex.amenities.slice(0, 3).map(a => (
          <span key={a} className="p-2 bg-gray-50 text-gray-400 rounded-lg" title={a}>
            {AMENITY_ICONS[a]}
          </span>
        ))}
        {complex.amenities.length > 3 && (
          <span className="text-xs text-gray-400 self-center">+{complex.amenities.length - 3}</span>
        )}
      </div>
    </div>
  </div>
);

const ExplorePage: React.FC<{ onSelectComplex: (c: Complex) => void }> = ({ onSelectComplex }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredComplexes = useMemo(() => {
    return MOCK_COMPLEXES.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Explorar Complejos</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o barrio..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-8">
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2"><Filter size={18} /> Barrio</h4>
            <div className="space-y-2">
              {['Norte', 'Centro', 'Sud', 'Huaico Hondo'].map(b => (
                <label key={b} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-gray-600 group-hover:text-indigo-600 transition-colors">Barrio {b}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Superficie</h4>
            <div className="space-y-2">
              {['Cristal', 'Cemento', 'Sintético'].map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-gray-600 group-hover:text-indigo-600 transition-colors">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="md:col-span-3">
          {filteredComplexes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredComplexes.map(c => (
                <ComplexCard key={c.id} complex={c} onClick={() => onSelectComplex(c)} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-300">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No encontramos resultados</h3>
              <p className="text-gray-400">Probá con otros términos de búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ComplexDetailPage: React.FC<{ complex: Complex; onBack: () => void; onBook: () => void }> = ({ complex, onBack, onBook }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingAi(true);
      const reviews = [
        "Increíble ambiente, las canchas están de 10.",
        "Mucha demora en la cantina a veces, pero las canchas de cristal valen la pena.",
        "Muy buena iluminación para jugar de noche.",
        "Los vestuarios podrían estar más limpios, pero el precio es justo."
      ];
      const summary = await getSmartSummary(complex.name, reviews);
      setAiSummary(summary || "Resumen no disponible.");
      setLoadingAi(false);
    };
    fetchSummary();
  }, [complex]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="h-[400px] relative">
        <img src={complex.cover_url} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/40 transition-all border border-white/20"
        >
          <ArrowRight className="rotate-180" size={24} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-24 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Header Info */}
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{complex.name}</h1>
                  <div className="flex items-center gap-4 text-gray-500">
                    <span className="flex items-center gap-1 font-medium"><MapPin size={16} /> {complex.address}, {complex.neighborhood}</span>
                    <span className="flex items-center gap-1 font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full"><Star size={14} fill="currentColor" /> {complex.rating} (48 reseñas)</span>
                  </div>
                </div>
                <img src={complex.logo_url} className="w-24 h-24 rounded-3xl border-4 border-white shadow-lg" alt="Logo" />
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">{complex.description}</p>
              
              <div className="flex flex-wrap gap-4">
                {complex.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-gray-600 font-medium">
                    {AMENITY_ICONS[a]}
                    <span className="capitalize">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 md:p-10 rounded-[40px] text-white shadow-xl shadow-indigo-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-bold">Resumen Inteligente (Gemini AI)</h3>
              </div>
              {loadingAi ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-full"></div>
                  <div className="h-4 bg-white/20 rounded w-5/6"></div>
                  <div className="h-4 bg-white/20 rounded w-4/6"></div>
                </div>
              ) : (
                <p className="text-indigo-50 leading-relaxed italic">"{aiSummary}"</p>
              )}
            </div>

            {/* Courts Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Nuestras Canchas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_COURTS.map(court => (
                  <div key={court.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="relative h-48 mb-6 overflow-hidden rounded-2xl">
                      <img src={court.photos[0]} className="w-full h-full object-cover" alt={court.name} />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {court.is_covered && <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-indigo-600">Techada</span>}
                        <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-700 capitalize">{court.surface_type}</span>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-4">{court.name}</h4>
                    <button 
                      onClick={onBook}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all"
                    >
                      Ver Disponibilidad
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl sticky top-28">
              <h3 className="text-xl font-bold mb-6">Información de Contacto</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="text-indigo-600" size={20} />
                  <span>{complex.opening_time} - {complex.closing_time} hs</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <UserIcon className="text-indigo-600" size={20} />
                  <span>{complex.phone}</span>
                </div>
              </div>
              <button 
                onClick={onBook}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mb-4"
              >
                Reservar Ahora <ChevronRight size={20} />
              </button>
              <button 
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Chat por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingFlow: React.FC<{ complex: Complex; user: User | null; onCancel: () => void; onSuccess: () => void }> = ({ complex, user, onCancel, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(MOCK_COURTS[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = ["18:00", "19:30", "21:00", "22:30"];

  const handleFinish = () => {
    // Simulate payment success
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 flex items-center justify-between">
        <button onClick={onCancel} className="text-gray-400 hover:text-indigo-600 flex items-center gap-1 font-bold">
          <ArrowRight className="rotate-180" size={20} /> Cancelar Reserva
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 w-12 rounded-full ${step >= s ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-extrabold mb-2">Elegí tu turno</h2>
              <p className="text-gray-500 mb-10">Seleccioná una cancha y un horario disponible.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-indigo-600">Cancha</h4>
                  <div className="space-y-3">
                    {MOCK_COURTS.map(c => (
                      <button 
                        key={c.id}
                        onClick={() => setSelectedCourt(c)}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex justify-between items-center ${selectedCourt?.id === c.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        <span className="font-bold">{c.name}</span>
                        {selectedCourt?.id === c.id && <CheckCircle2 className="text-indigo-600" size={20} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-indigo-600">Horario</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {times.map(t => (
                      <button 
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`p-4 rounded-2xl border-2 font-bold transition-all ${selectedTime === t ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 hover:border-gray-300 text-gray-500'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                disabled={!selectedTime}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold text-xl rounded-2xl shadow-xl shadow-indigo-600/20 transition-all"
              >
                Siguiente Paso
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-extrabold mb-2">Confirmar Reserva</h2>
              <p className="text-gray-500 mb-10">Revisá los detalles antes de pagar la seña.</p>
              
              <div className="bg-gray-50 p-8 rounded-3xl mb-12 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Complejo</span>
                  <span className="font-bold">{complex.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Cancha</span>
                  <span className="font-bold">{selectedCourt?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Fecha y Hora</span>
                  <span className="font-bold">Mañana, {selectedTime} hs</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Turno (90 min)</span>
                  <span className="text-xl font-bold">$12.000</span>
                </div>
                <div className="flex justify-between items-center text-indigo-600">
                  <span className="font-bold">Seña a pagar ahora (50%)</span>
                  <span className="text-2xl font-extrabold">$6.000</span>
                </div>
              </div>

              <button 
                onClick={() => setStep(3)}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
              >
                <CreditCard size={24} /> Pagar con Mercado Pago
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">¡Pago Exitoso!</h2>
              <p className="text-gray-500 text-xl mb-12">Tu reserva en <span className="font-bold text-gray-900">{complex.name}</span> ha sido confirmada. Te enviamos los detalles por WhatsApp.</p>
              
              <button 
                onClick={handleFinish}
                className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-600/20 transition-all"
              >
                Ir a Mis Reservas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
    <div className="flex flex-col md:flex-row gap-12">
      <div className="md:w-1/3">
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl text-center">
          <img src={user?.avatar_url} className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-indigo-50 shadow-lg" alt="User" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{user?.name}</h2>
          <p className="text-gray-500 mb-8">{user?.email}</p>
          <button className="w-full py-3 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all">Editar Perfil</button>
        </div>
      </div>

      <div className="md:w-2/3 space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Mis Reservas</h1>
        
        <div className="space-y-6">
          {/* Active Booking Card */}
          <div className="bg-white p-8 rounded-[32px] border-l-8 border-l-indigo-600 shadow-xl shadow-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-grow">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">
                <Clock size={16} /> Próxima Reserva
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Padel Center Norte</h3>
              <p className="text-gray-500 font-medium">Cancha 1 (Cristal) • Sábado 19:30 hs</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm mb-2">Seña Pagada</span>
              <p className="text-gray-400 text-sm">Saldo a pagar en cancha: <span className="font-bold text-gray-800">$6.000</span></p>
            </div>
            <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all">
              <ChevronRight />
            </button>
          </div>

          {/* Past Booking */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 opacity-60 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-1">WPT Santiago</h3>
              <p className="text-gray-500">Cancha A • 12 Mayo 2024</p>
            </div>
            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-bold text-sm">Finalizada</span>
            <button className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all">Reseñar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
    <div className="flex justify-between items-end mb-12">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Panel Admin</h1>
        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Padel Center Norte</p>
      </div>
      <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
        <Calendar size={18} className="text-gray-400" />
        <span className="font-bold text-gray-700">Hoy: 24 de Mayo</span>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
          <TrendingUp size={24} />
        </div>
        <h4 className="text-gray-500 font-bold text-sm mb-1">Ingresos Hoy</h4>
        <p className="text-3xl font-extrabold">$48.500</p>
      </div>
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
          <CheckCircle2 size={24} />
        </div>
        <h4 className="text-gray-500 font-bold text-sm mb-1">Reservas</h4>
        <p className="text-3xl font-extrabold">12</p>
      </div>
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-6">
          <Award size={24} />
        </div>
        <h4 className="text-gray-500 font-bold text-sm mb-1">Rating</h4>
        <p className="text-3xl font-extrabold">4.8</p>
      </div>
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
          <Clock size={24} />
        </div>
        <h4 className="text-gray-500 font-bold text-sm mb-1">Cancelaciones</h4>
        <p className="text-3xl font-extrabold">1</p>
      </div>
    </div>

    {/* Table Simulation */}
    <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-bold">Reservas del Día</h3>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">Agregar Manual</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Usuario</th>
              <th className="px-8 py-4">Cancha</th>
              <th className="px-8 py-4">Hora</th>
              <th className="px-8 py-4">Estado</th>
              <th className="px-8 py-4">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map(i => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6 font-bold">Jugador {i}</td>
                <td className="px-8 py-6 text-gray-500">Cancha {i % 2 + 1}</td>
                <td className="px-8 py-6 font-medium">19:30 hs</td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">Confirmada</span>
                </td>
                <td className="px-8 py-6">
                  <button className="text-indigo-600 font-bold text-sm hover:underline">Gestionar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default App;
