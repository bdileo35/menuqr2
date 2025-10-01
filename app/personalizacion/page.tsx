'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DevBanner from '../components/DevBanner';

export default function Personalizacion() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    colorPrimario: '#3B82F6',
    colorSecundario: '#1E40AF',
    fuente: 'Inter',
    logoPosition: 'center',
    showPrices: true,
    showDescriptions: true,
    theme: 'dark'
  });

  const continuarGenerarQR = () => {
    // Guardar configuración
    localStorage.setItem('personalizacion-data', JSON.stringify(formData));
    router.push('/generar-qr');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DevBanner />
      
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.push('/editor')}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            ← Anterior
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Personalización</h1>
            <p className="text-gray-300">Paso 4 de 5 - Diseño y branding</p>
          </div>

          <div className="text-gray-400 text-sm">Paso 4/5</div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-2">🎨 Personaliza tu Menú</h2>
            <p className="text-gray-300">
              Ajusta los colores, fuentes y diseño de tu carta digital
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Panel de configuración */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color Primario
                </label>
                <input
                  type="color"
                  value={formData.colorPrimario}
                  onChange={(e) => setFormData({...formData, colorPrimario: e.target.value})}
                  className="w-full h-12 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fuente
                </label>
                <select
                  value={formData.fuente}
                  onChange={(e) => setFormData({...formData, fuente: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Posición del Logo
                </label>
                <select
                  value={formData.logoPosition}
                  onChange={(e) => setFormData({...formData, logoPosition: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="center">Centro</option>
                  <option value="left">Izquierda</option>
                  <option value="right">Derecha</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showPrices}
                    onChange={(e) => setFormData({...formData, showPrices: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Mostrar precios</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showDescriptions}
                    onChange={(e) => setFormData({...formData, showDescriptions: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Mostrar descripciones</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-center">Vista Previa</h3>
              <div 
                className="bg-white rounded-lg p-4 text-black min-h-64"
                style={{ 
                  fontFamily: formData.fuente,
                  borderTop: `4px solid ${formData.colorPrimario}`
                }}
              >
                <div className={`text-center mb-4 text-${formData.logoPosition}`}>
                  <h4 className="text-xl font-bold" style={{ color: formData.colorPrimario }}>
                    ESQUINA POMPEYA
                  </h4>
                </div>
                
                <div className="space-y-2">
                  <div className="border-b pb-2">
                    <div className="font-semibold">Milanesa con papas</div>
                    {formData.showDescriptions && (
                      <div className="text-sm text-gray-600">Milanesa casera con papas fritas</div>
                    )}
                    {formData.showPrices && (
                      <div className="font-bold" style={{ color: formData.colorPrimario }}>$9000</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={continuarGenerarQR}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors text-lg"
            >
              Continuar a Generar QR →
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 mb-2">
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-blue-500 rounded"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded"></div>
          </div>
          <div className="text-center text-sm text-gray-400">
            Setup → Scanner → Editor → Personalización → QR
          </div>
        </div>
      </div>
    </div>
  );
}