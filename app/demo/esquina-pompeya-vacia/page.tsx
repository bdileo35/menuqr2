'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EsquinaPompeyaVaciaDemo() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 via-white to-slate-100'
    }`}>
      
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-50 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200 font-medium`}
            >
              ← Volver
            </button>
            
            <div className="text-center flex-1">
              <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
                ✨ MenuQR
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                Demo - Digitalización de Carta Completa
              </p>
            </div>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Estado Inicial - Limpio y Enfocado */}
        <div className={`text-center py-20 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 mb-8`}>
          <div className="text-8xl mb-6">🍽️</div>
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
            MenuQR
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>
            Estado inicial - Sin datos
          </p>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 text-lg`}>
            Esta carta está completamente vacía, sin menú digitalizado.
          </p>
          
          {/* Proceso Simple */}
          <div className={`${isDarkMode ? 'bg-gray-700/40' : 'bg-gray-100'} rounded-xl p-8 max-w-lg mx-auto mb-8`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
              Proceso de Digitalización (4 pasos):
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-600/30' : 'bg-white'} rounded-lg`}>
                <span className="text-2xl mb-2">📋</span>
                <span className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>1. Datos</span>
              </div>
              <div className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-600/30' : 'bg-white'} rounded-lg`}>
                <span className="text-2xl mb-2">📷</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>2. Scanner</span>
              </div>
              <div className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-600/30' : 'bg-white'} rounded-lg`}>
                <span className="text-2xl mb-2">✏️</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>3. Editor</span>
              </div>
              <div className={`flex flex-col items-center p-4 ${isDarkMode ? 'bg-gray-600/30' : 'bg-white'} rounded-lg`}>
                <span className="text-2xl mb-2">🎯</span>
                <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>4. Carta Final</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón principal de inicio */}
        <div className="text-center">
          <button
            onClick={() => router.push('/demo/setup-comercio')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl text-xl hover:scale-105"
          >
            ✨ Comenzar Digitalización
          </button>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-4 font-medium`}>
            De carta física a menú digital en 4 pasos
          </p>
        </div>
      </div>
    </div>
  );
}