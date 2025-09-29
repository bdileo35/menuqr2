'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EsquinaPompeyaVaciaDemo() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 via-white to-slate-100'
    }`}>
      
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-sm border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} sticky top-0 z-50 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-blue-600'} transition-colors duration-200 font-medium`}
            >
              ← Volver
            </button>
            
            <div className="text-center flex-1">
              <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} transition-colors duration-300`}>
                🍽️ Esquina Pompeya
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} transition-colors duration-300`}>
                Estado inicial - Sin datos
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Empty State - Mensaje de carta vacía */}
        <div className={`text-center py-16 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 mb-8`}>
          <div className="text-6xl mb-4">📋</div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-2`}>
            Carta Vacía - Lista para Generar
          </h2>
          <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
            Esta carta está completamente vacía, sin menú digitalizado.
          </p>
          
          <div className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'} rounded-lg p-6 max-w-md mx-auto`}>
            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
              Para generar el menú completo desde cero:
            </p>
            <div className="space-y-2 text-left text-sm">
              <div className={`flex items-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="mr-2">1️⃣</span>
                Escanear fotos de la carta física
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="mr-2">2️⃣</span>
                Procesar con IA inteligente
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="mr-2">3️⃣</span>
                Editar y personalizar
              </div>
              <div className={`flex items-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="mr-2">4️⃣</span>
                Generar carta digital completa
              </div>
            </div>
          </div>
        </div>

        {/* Botón para empezar el proceso */}
        <div className="text-center">
          <button
            onClick={() => router.push('/scanner')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            🚀 Empezar Proceso de Digitalización
          </button>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-2`}>
            Comenzar desde el scanner OCR inteligente
          </p>
        </div>

        {/* Estructura vacía de categorías para mostrar lo que se va a generar */}
        <div className="mt-12 space-y-6">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} text-center mb-8`}>
            Vista previa de estructura que se generará:
          </h3>
          
          {['🍽️ PLATOS PRINCIPALES', '🥟 EMPANADAS', '🥤 BEBIDAS', '🍰 POSTRES'].map((category, index) => (
            <div key={index} className={`${isDarkMode ? 'bg-slate-800/30' : 'bg-white/60'} rounded-xl p-6 backdrop-blur-sm border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} transition-all duration-300`}>
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'} mb-4 flex items-center justify-between`}>
                {category}
                <span className={`text-sm font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sin elementos
                </span>
              </h4>
              
              <div className={`${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-100/80'} rounded-lg p-4 text-center`}>
                <div className="text-3xl mb-2">⚪</div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Los elementos aparecerán aquí después del procesamiento OCR
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}