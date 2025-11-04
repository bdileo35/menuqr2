'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComprarPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<'mensual' | 'anual'>('mensual');
  const [loading, setLoading] = useState(false);

  const handleComprar = async () => {
    setLoading(true);
    try {
      console.log('🛒 Iniciando proceso de compra...');
      
      // Generar ID único para esta compra
      const generarIdUnico = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const idUnico = generarIdUnico();
      const precio = plan === 'mensual' ? 13999 : 139990;
      const descripcion = `MenuQR - Plan ${plan === 'mensual' ? 'Mensual' : 'Anual'}`;

      // Crear preferencia de pago
      const response = await fetch('/api/tienda/crear-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          precio,
          descripcion,
          idUnico
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Preferencia creada, redirigiendo a:', data.init_point);
        
        // Redirigir a la página de éxito (simulando MP)
        window.location.href = data.init_point;
      } else {
        const errorData = await response.json();
        alert(`Error al procesar el pago: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Card principal */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="bg-green-600 p-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="absolute left-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              ← Volver
            </button>
            <div className="text-4xl mb-2">🍽️</div>
            <h1 className="text-2xl font-bold text-white mb-1">
              MenuQR
            </h1>
            <p className="text-green-100 text-sm">
              Elige tu plan
            </p>
          </div>

          {/* Contenido principal */}
          <div className="p-6 bg-gray-800">
            
            {/* Selección de plan */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPlan('mensual')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    plan === 'mensual'
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-300'
                  }`}
                >
                    <div className="text-center">
                      <div className="text-lg font-bold">$13,999</div>
                      <div className="text-sm">por mes</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setPlan('anual')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      plan === 'anual'
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-gray-600 bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">$139,990</div>
                      <div className="text-sm">por año</div>
                      <div className="text-xs text-green-400 mt-1">¡Ahorra 2 meses!</div>
                    </div>
                </button>
              </div>
            </div>

            {/* Características incluidas */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">✅ Incluye:</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Scanner OCR automático</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Menús digitales responsivos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Pedidos por WhatsApp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Panel de gestión completo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Soporte técnico 24/7</span>
                </div>
              </div>
            </div>

            {/* Botón de compra */}
            <button
              onClick={handleComprar}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>💳</span>
                  <span>Guardar</span>
                </>
              )}
            </button>

            {/* Información adicional */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Pago seguro procesado por Mercado Pago
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Puedes cancelar en cualquier momento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
