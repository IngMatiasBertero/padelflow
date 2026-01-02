import React, { useEffect, useState } from 'react';

interface PaymentResultProps {
  type: 'success' | 'error' | 'pending';
  onBackToHome: () => void;
}

const PaymentResult: React.FC<PaymentResultProps> = ({ type, onBackToHome }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (type === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onBackToHome();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [type, onBackToHome]);

  const config = {
    success: {
      icon: 'fa-circle-check',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      title: '¡Pago Exitoso!',
      message: 'Tu reserva ha sido confirmada. Recibirás un correo con los detalles.',
      buttonText: 'Ver Mis Reservas',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700'
    },
    error: {
      icon: 'fa-circle-xmark',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      title: 'Pago Rechazado',
      message: 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.',
      buttonText: 'Volver al Inicio',
      buttonClass: 'bg-rose-600 hover:bg-rose-700'
    },
    pending: {
      icon: 'fa-clock',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'Pago Pendiente',
      message: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
      buttonText: 'Ver Mis Reservas',
      buttonClass: 'bg-amber-600 hover:bg-amber-700'
    }
  }[type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="p-12 text-center">
          <div className={`w-24 h-24 ${config.iconBg} ${config.iconColor} rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in-110 duration-700 delay-100`}>
            <i className={`fas ${config.icon} text-5xl`}></i>
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            {config.title}
          </h1>

          <p className="text-slate-500 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            {config.message}
          </p>

          {type === 'success' && (
            <div className="mb-8 text-sm text-slate-400 animate-in fade-in duration-500 delay-400">
              Redirigiendo en {countdown} segundos...
            </div>
          )}

          <button
            onClick={onBackToHome}
            className={`w-full ${config.buttonClass} text-white py-4 rounded-2xl font-bold shadow-lg transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500`}
          >
            {config.buttonText}
          </button>
        </div>

        <div className="bg-slate-50 p-6 text-center">
          <p className="text-xs text-slate-400 font-medium">
            ¿Necesitas ayuda? <a href="mailto:soporte@padelflow.com" className="text-lime-600 hover:text-lime-700 font-bold">Contacta con soporte</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
