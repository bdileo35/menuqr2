'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppTheme } from '../hooks/useAppTheme';
import QRWithActions from '../components/QRWithActions';

export default function OpcionesQR() {
  const router = useRouter();
  const params = useParams();
  const { isDarkMode, toggleTheme } = useAppTheme(); // ✅ USANDO HOOK
  const [showMenuHamburguesa, setShowMenuHamburguesa] = useState(false);
  const idUnico = (params?.idUnico as string) || '5XJ1J37F'; // Por defecto
  const qrUrl = `https://menuqrep.vercel.app/carta-menu/${idUnico}`;

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
                    : 'border-blue-300 hover:bg-blue-100 text-blue-700'
                }`}
                title="Menú de funciones"
              >
                <div className="flex flex-col gap-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </button>
              <h1 className="text-xl font-bold">🖨️ Opciones de QR</h1>
            </div>

            {/* Botones del lado derecho */}
            <div className="flex items-center gap-2">
              {/* Botón Carta Menu */}
              <button 
                onClick={() => router.push('/carta-menu')}
                className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
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
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
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
              <span className="text-sm font-medium text-blue-400">Configurar opciones de QR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Hamburguesa Desplegable */}
      {showMenuHamburguesa && (
        <div className="fixed top-16 left-4 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg min-w-64">
          <div className="p-2">
            <button
              onClick={() => {
                setShowMenuHamburguesa(false);
                router.push(`/datos-comercio/${idUnico}`);
              }}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              📋 Datos del comercio
            </button>
            <button
              onClick={() => {
                setShowMenuHamburguesa(false);
                router.push(`/editor/${idUnico}`);
              }}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              📝 Administrar menú
            </button>
            <button 
              onClick={() => {
                setShowMenuHamburguesa(false);
                router.push(`/opciones-qr/${idUnico}`);
              }}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              🖨️ Opciones QR
            </button>
            <button 
              onClick={() => {
                setShowMenuHamburguesa(false);
                router.push(`/carta-menu/${idUnico}`);
              }}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              👁️ Ver carta
            </button>
            <button
              onClick={() => {
                setShowMenuHamburguesa(false);
                router.push(`/configuracion/${idUnico}`);
              }}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              ⚙️ Configuración
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal - Una sola card */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Card única - Opciones de QR */}
        <div className={`mb-4 rounded-xl border-2 transition-colors duration-300 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-100 border-blue-400'
        }`}>
          {/* Header de Categoría - Estilo como "Platos del Día" */}
          <div className={`px-4 py-2 cursor-pointer transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-blue-100 hover:bg-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pl-3">
                <h3 className="text-lg font-bold">🖨️ Opciones de QR</h3>
              </div>
            </div>
          </div>
          
          {/* Contenido de la card - QR y Botones */}
          <div className="p-6 space-y-6">
            
            {/* QR Code y Botones lado a lado */}
            <QRWithActions qrUrl={qrUrl} isDarkMode={isDarkMode} />

            {/* Información adicional */}
            <div className="text-center">
              <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                💡 Guarda este QR para acceder a tu menú digital
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Puedes personalizar tu menú desde el editor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
