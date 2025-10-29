'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '../hooks/useAppTheme';

export default function Configuracion() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useAppTheme(); // ✅ USANDO HOOK
  const [showMenuHamburguesa, setShowMenuHamburguesa] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      
      {/* Header - Misma estructura que el editor */}
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 pt-1 pb-2">
          
          {/* LÍNEA 1: Título Panel de Control */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMenuHamburguesa(!showMenuHamburguesa)}
                className={`p-2 border rounded-lg transition-all ${
                  isDarkMode 
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white' 
                    : 'border-gray-300 hover:bg-gray-200 text-gray-800'
                }`}
                title="Menú de funciones"
              >
                <div className="flex flex-col gap-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </button>
              <h1 className="text-xl font-bold">⚙️ Configuración</h1>
            </div>

            {/* Botones del lado derecho */}
            <div className="flex items-center gap-2">
              {/* Botón Carta Menu */}
              <button 
                onClick={() => router.push('/carta/5XJ1J37F')}
                className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                title="Ver Carta Menu"
              >
                <span className="text-lg">👁️</span>
                <span className="text-sm font-medium">Ver Carta</span>
              </button>

              {/* Botón modo claro/oscuro */}
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-300 hover:bg-gray-200 text-gray-800'
                }`}
                title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* LÍNEA 2: Solicito */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Solicito:</span>
              <span className="text-sm font-medium text-gray-500">Configurar opciones generales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Hamburguesa Desplegable */}
      {showMenuHamburguesa && (
        <div className="fixed top-16 left-4 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg min-w-64">
          <div className="p-2">
            <button
              onClick={() => router.push('/datos-comercio')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-800'
              }`}
            >
              📋 Datos del comercio
            </button>
            <button
              onClick={() => router.push('/editor')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-800'
              }`}
            >
              📝 Administrar menú
            </button>
            <button 
              onClick={() => router.push('/opciones-qr')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-800'
              }`}
            >
              🖨️ Opciones QR
            </button>
            <button 
              onClick={() => router.push('/carta/5XJ1J37F')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-800'
              }`}
            >
              👁️ Ver carta
            </button>
            <button
              onClick={() => router.push('/configuracion')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              ⚙️ Configuración
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal - Una sola card */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Card única - Configuración */}
        <div className={`mb-4 rounded-xl border-2 transition-colors duration-300 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-100 border-gray-300'
        }`}>
          {/* Header de Categoría - Estilo como "Platos del Día" */}
          <div className={`px-4 py-2 cursor-pointer transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pl-3">
                <h3 className="text-lg font-bold">⚙️ Configuración</h3>
              </div>
            </div>
          </div>
          
          {/* Contenido de la card */}
          <div className="p-6 space-y-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-xl font-bold mb-2">Configuración</h2>
              <p className="text-gray-400 mb-4">
                Aquí podrás configurar las opciones generales del sistema, preferencias y configuraciones avanzadas.
              </p>
              <div className="text-sm text-gray-500">
                Próximamente disponible...
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-600">
              <button
                type="button"
                onClick={() => router.back()}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => alert('Funcionalidad próximamente disponible')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
