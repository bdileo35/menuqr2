'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ExitoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const idUnico = searchParams.get('idUnico');
  const plan = searchParams.get('plan');
  const monto = searchParams.get('monto');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push(`/editor?success=true&idUnico=${idUnico}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, idUnico]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Card principal */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Header verde */}
          <div className="bg-green-600 p-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-green-100">
              Tu suscripción a MenuQR está activa
            </p>
          </div>

          {/* Contenido principal */}
          <div className="p-6 bg-gray-800">
            
            {/* Información del pago */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-3">Detalles del pago:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Plan:</span>
                  <span className="text-white font-medium">
                    {plan === 'mensual' ? 'Mensual' : 'Anual'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monto:</span>
                  <span className="text-white font-medium">${monto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">ID único:</span>
                  <span className="text-blue-400 font-medium">{idUnico}</span>
                </div>
              </div>
            </div>

            {/* Próximos pasos */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">🎉 ¡Ya puedes empezar!</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Tu ID único es: <span className="text-blue-400 font-medium">{idUnico}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Accede a tu panel de control</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Comienza a crear tu menú digital</span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/editor?success=true&idUnico=${idUnico}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Guardar
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Guardar
              </button>
            </div>

            {/* Countdown */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Redirigiendo automáticamente en {countdown} segundos...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    }>
      <ExitoContent />
    </Suspense>
  );
}
