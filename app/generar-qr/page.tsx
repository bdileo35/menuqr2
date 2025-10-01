'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DevBanner from '../components/DevBanner';

export default function GenerarQR() {
  const router = useRouter();
  const [qrGenerated, setQrGenerated] = useState(false);

  const generarQR = () => {
    setQrGenerated(true);
    // Simular generación del QR
    setTimeout(() => {
      router.push('/carta-menu');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DevBanner />
      
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.push('/personalizacion')}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            ← Anterior
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Generar QR</h1>
            <p className="text-gray-300">Paso 5 de 5 - ¡Casi terminamos!</p>
          </div>

          <div className="text-gray-400 text-sm">Paso 5/5</div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto p-6 pb-24">
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          {!qrGenerated ? (
            <div>
              <h2 className="text-3xl font-bold text-green-400 mb-4">🎉 ¡Tu Menú está Listo!</h2>
              <p className="text-gray-300 mb-8">Genera el código QR para compartir tu carta digital</p>
              
              <button
                onClick={generarQR}
                className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-xl transition-colors"
              >
                🚀 Generar QR y Finalizar
              </button>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-semibold mb-2">Generando tu menú digital...</h3>
              <p className="text-gray-400">Redirigiendo a tu carta final...</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 mb-2">
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
          </div>
          <div className="text-center text-sm text-gray-400">
            Setup → Scanner → Editor → Personalización → QR ✅
          </div>
        </div>
      </div>
    </div>
  );
}