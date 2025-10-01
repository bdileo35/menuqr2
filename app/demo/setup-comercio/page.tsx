'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ComercioData {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  horarios: string;
  logo: string;
  descripcion: string;
  instagram: string;
  facebook: string;
}

export default function SetupComercioDemo() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [comercioData, setComercioData] = useState<ComercioData>({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    horarios: '',
    logo: '',
    descripcion: '',
    instagram: '',
    facebook: ''
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setComercioData(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof ComercioData, value: string) => {
    setComercioData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadDefaultLogo = () => {
    setComercioData(prev => ({
      ...prev,
      logo: '🍽️'
    }));
  };

  const handleContinue = () => {
    // Guardar datos en localStorage para usar en la carta final
    localStorage.setItem('comercioData', JSON.stringify(comercioData));
    
    // Ir al siguiente paso - digitalización
    router.push('/scanner?demo=true');
  };

  const loadDemoData = () => {
    setComercioData({
      nombre: 'Esquina Pompeya',
      direccion: 'Av. Corrientes 1234, CABA',
      telefono: '+54 11 4567-8900',
      email: 'contacto@esquinapompeya.com.ar',
      horarios: 'Lun a Dom: 12:00 - 00:00',
      logo: '🍽️',
      descripcion: 'Cocina casera argentina con los sabores de siempre',
      instagram: '@esquinapompeya',
      facebook: 'EsquinaPompeya'
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-white to-slate-100'
    }`}>
      
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-slate-200'} sticky top-0 z-50 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-blue-600'} transition-colors duration-200 font-medium`}
            >
              ← Volver
            </button>
            
            <div className="text-center flex-1">
              <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} transition-colors duration-300`}>
                🏪 MenuQR
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} transition-colors duration-300`}>
                Paso 1 de 4 - Tu carta/menú digital QR
              </p>
            </div>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              Progreso del Setup
            </span>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              25% completado
            </span>
          </div>
          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-1/4 transition-all duration-300"></div>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>1. Datos</span>
            <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>2. Scanner</span>
            <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>3. Editor</span>
            <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>4. Carta</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 p-6`}>
          
          {/* Demo Data Button */}
          <div className="mb-6 text-center">
            <button
              onClick={loadDemoData}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
            >
              ⚡ Cargar Datos Demo (Esquina Pompeya)
            </button>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
              Para agilizar la demostración
            </p>
          </div>

          {/* Form */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Columna Izquierda - Datos Básicos */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-4 flex items-center`}>
                📋 Información Básica
              </h3>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Nombre del Restaurante *
                </label>
                <input
                  type="text"
                  value={comercioData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="ej: Esquina Pompeya"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-slate-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Dirección
                </label>
                <input
                  type="text"
                  value={comercioData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="ej: Av. Corrientes 1234, CABA"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-slate-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={comercioData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  placeholder="ej: +54 11 4567-8900"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-slate-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  value={comercioData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="ej: contacto@restaurante.com"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-slate-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Horarios
                </label>
                <input
                  type="text"
                  value={comercioData.horarios}
                  onChange={(e) => handleInputChange('horarios', e.target.value)}
                  placeholder="ej: Lun a Dom: 12:00 - 00:00"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-slate-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
              </div>
            </div>

            {/* Columna Derecha - Logo y Redes */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-4 flex items-center`}>
                🎨 Imagen y Redes
              </h3>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Logo del Restaurante
                </label>
                <div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-4 text-center`}>
                  {comercioData.logo ? (
                    <div className="space-y-2">
                      <div className="text-4xl">{comercioData.logo}</div>
                      <button
                        onClick={() => handleInputChange('logo', '')}
                        className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Cambiar logo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-2">📷</div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'} mb-2`}>
                        Subir logo o usar emoji
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <div className="flex space-x-2 justify-center">
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Subir Imagen
                        </label>
                        <button
                          onClick={loadDefaultLogo}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Logo Demo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Descripción
                </label>
                <textarea
                  value={comercioData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Breve descripción del restaurante"
                  rows={3}
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-slate-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Instagram
                </label>
                <input
                  type="text"
                  value={comercioData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="@usuario"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-slate-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-700'} mb-2`}>
                  Facebook
                </label>
                <input
                  type="text"
                  value={comercioData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  placeholder="Página de Facebook"
                  className={`w-full px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-slate-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push('/demo/esquina-pompeya-vacia')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-slate-700'
              }`}
            >
              ← Atrás
            </button>
            
            <button
              onClick={handleContinue}
              disabled={!comercioData.nombre.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              Continuar al Scanner OCR →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}