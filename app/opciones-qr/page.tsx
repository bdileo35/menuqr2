'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppTheme } from '../hooks/useAppTheme';
import QRWithActions from '../components/QRWithActions';
import NavBar from '../components/NavBar';

export default function OpcionesQR() {
  const router = useRouter();
  const params = useParams();
  const { isDarkMode, toggleTheme } = useAppTheme(); // ✅ USANDO HOOK
  const idUnico = (params?.idUnico as string) || '';
  
  // Debug: verificar que se lee correctamente
  useEffect(() => {
    console.log('🔍 Opciones QR - idUnico desde URL:', idUnico);
    console.log('🔍 Opciones QR - params completo:', params);
  }, [idUnico, params]);
  
  // Si no hay idUnico, mostrar error
  if (!idUnico) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error: ID Único no encontrado</h1>
          <p className="text-gray-600">La URL debe incluir un ID único válido</p>
          <p className="text-sm text-gray-500 mt-2">Ejemplo: /opciones-qr/5XJ1J37F</p>
        </div>
      </div>
    );
  }
  const baseUrl = 'https://menuqrep.vercel.app';
  const qrUrl = `${baseUrl}/carta/${idUnico}`;

  // Controles de vista previa
  const [variant, setVariant] = useState<'plain' | 'framed'>('framed');
  const [showTitle, setShowTitle] = useState(true);
  const [title, setTitle] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [legendText, setLegendText] = useState('Escanear para ver la Carta');

  // Cargar nombre del comercio por idUnico y validar id
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/menu/${idUnico}`);
        const data = await res.json();
        if (active && data?.success && data.menu?.restaurantName) {
          setTitle(data.menu.restaurantName);
        } else {
          // ID no válido: usar demo y avisar en título
          if (active) setTitle('Mi Comercio');
        }
      } catch {
        if (active) setTitle('Mi Comercio');
      }
    };
    load();
    return () => { active = false; };
  }, [idUnico]);

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
              <h1 className="text-xl font-bold">🖨️ Opciones de QR</h1>
            </div>

            {/* Botones del lado derecho */}
            <div className="flex items-center gap-2">
              {/* Botón Carta Menu */}
              <button 
                onClick={() => router.push(`/carta/${idUnico}`)}
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
              <span className="text-sm font-medium text-gray-500">Configurar opciones de QR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal - Una sola card */}
      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        
        {/* Card única - Opciones de QR */}
        <div className={`mb-4 rounded-xl border-2 transition-colors duration-300 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-100 border-gray-300'
        }`}>
          {/* Header */}
          <div className={`px-4 py-2 cursor-pointer transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pl-3">
                <h3 className="text-lg font-bold">🖨️ Opciones de QR</h3>
              </div>
            </div>
          </div>
          
          {/* Contenido de la card - QR y Botones */}
          <div className="p-6 space-y-6">
            
            {/* Controles de vista previa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1">Variante</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVariant('plain')}
                    className={`px-3 py-1 rounded border ${variant==='plain' ? (isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white') : 'bg-transparent'} ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  >
                    Plano
                  </button>
                  <button
                    onClick={() => setVariant('framed')}
                    className={`px-3 py-1 rounded border ${variant==='framed' ? (isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white') : 'bg-transparent'} ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  >
                    En soporte
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <input id="showTitle" type="checkbox" checked={showTitle} onChange={(e)=>setShowTitle(e.target.checked)} />
                  <label htmlFor="showTitle" className="text-sm">Mostrar nombre</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    className={`ml-2 px-2 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'}`}
                    placeholder="Nombre del comercio"
                  />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input id="showLegend" type="checkbox" checked={showLegend} onChange={(e)=>setShowLegend(e.target.checked)} />
                  <label htmlFor="showLegend" className="text-sm">Mostrar leyenda</label>
                  <input
                    type="text"
                    value={legendText}
                    onChange={(e)=>setLegendText(e.target.value)}
                    className={`ml-2 px-2 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'}`}
                    placeholder="Escanear para ver la Carta"
                  />
                </div>

                {/* sin color acento (siempre negro) */}
              </div>

              {/* Vista previa */}
              <div className="flex items-center justify-center">
                <QRWithActions
                  qrUrl={qrUrl}
                  isDarkMode={isDarkMode}
                  title={title}
                  showTitle={showTitle}
                  showLegend={showLegend}
                  legendText={legendText}
                  variant={variant}
                />
              </div>
            </div>

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
      
      {/* NavBar fija en la parte inferior */}
      <NavBar idUnico={idUnico} />
    </div>
  );
}
