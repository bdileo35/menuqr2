'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ExitoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const ref = searchParams?.get('ref') || null;
  const product = searchParams?.get('product') || null;
  const precio = searchParams?.get('precio') || null;

  useEffect(() => {
    // Simular verificación de pago
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleContinue = () => {
    // Redirigir según el producto comprado
    if (product?.includes('menuqr')) {
      router.push('/demo/setup-comercio');
    } else if (product?.includes('qring')) {
      // Redirigir a QRing
      window.open('https://qring.vercel.app/admin', '_blank');
    } else {
      router.push('/qr-shop');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Procesando pago...</h2>
          <p className="text-gray-400">Verificando transacción con MercadoPago</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-gray-800 rounded-2xl p-8 text-center">
          {/* Éxito */}
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-green-400 mb-4">
            ¡Pago Exitoso!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Tu compra ha sido procesada correctamente.
          </p>

          {/* Detalles de compra */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Detalles de tu compra
            </h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">Referencia:</span>
                <span className="text-white font-mono text-sm">{ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Producto:</span>
                <span className="text-white">{product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monto:</span>
                <span className="text-green-400 font-bold">${precio ? (parseInt(precio) / 100).toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className="text-green-400">✅ Aprobado</span>
              </div>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">
              📋 Próximos pasos
            </h3>
            <div className="text-left space-y-2 text-blue-100">
              <p>• Recibirás un email de confirmación</p>
              <p>• Tu plan se activará inmediatamente</p>
              <p>• Puedes comenzar a usar el servicio ahora</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200"
            >
              🚀 Comenzar a usar {product?.includes('menuqr') ? 'MenuQR' : 'el servicio'}
            </button>
            
            <button
              onClick={() => router.push('/qr-shop')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Volver a la tienda
            </button>
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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
      </div>
    }>
      <ExitoContent />
    </Suspense>
  );
}