'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '../hooks/useAppTheme';

export default function DatosComercio() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useAppTheme(); // ✅ USANDO HOOK
  const [showMenuHamburguesa, setShowMenuHamburguesa] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    restaurantName: 'Esquina Pompeya',
    address: 'Av. Corrientes 1234, CABA',
    phone: '+54 11 4567-8900',
    email: 'contacto@restaurante.com',
    hours: 'Lun a Dom: 12:00 - 00:00',
    description: 'Restaurante familiar especializado en parrilla y platos tradicionales argentinos',
    instagram: '@esquinapompeya',
    facebook: 'Esquina Pompeya Restaurante',
    logoUrl: ''
  });

  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar cambio de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          logoUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Buscar en Google y extraer datos
  const handleGoogleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setSearching(true);
    try {
      // Simular búsqueda en Google Places API o similar
      // En un entorno real, usarías Google Places API, Google My Business API, etc.
      
      console.log(`🔍 Buscando "${searchTerm}" en Google...`);
      
      // Simular respuesta de Google Places
      const mockGoogleData = {
        name: searchTerm,
        address: 'Av. Corrientes 1234, CABA, Argentina',
        phone: '+54 11 4567-8900',
        email: 'contacto@esquinapompeya.com',
        hours: 'Lun a Dom: 12:00 - 00:00',
        description: 'Restaurante familiar especializado en parrilla y platos tradicionales argentinos',
        instagram: '@esquinapompeya',
        facebook: 'Esquina Pompeya Restaurante',
        rating: '4.5',
        reviews: '127 reseñas'
      };
      
      // Actualizar formulario con datos de Google
      setFormData(prev => ({
        ...prev,
        restaurantName: mockGoogleData.name,
        address: mockGoogleData.address,
        phone: mockGoogleData.phone,
        email: mockGoogleData.email,
        hours: mockGoogleData.hours,
        description: mockGoogleData.description,
        instagram: mockGoogleData.instagram,
        facebook: mockGoogleData.facebook
      }));
      
      alert(`✅ Datos encontrados para "${searchTerm}" y cargados automáticamente\n\n⭐ Búsqueda automática real disponible solo en Versión PRO`);
      
    } catch (error) {
      console.error('Error en búsqueda:', error);
      alert('❌ Error al buscar en Google. Intenta nuevamente.');
    } finally {
      setSearching(false);
    }
  };

  // Guardar datos
  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Implementar guardado en base de datos
      console.log('Guardando datos del comercio:', formData);
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('✅ Datos del comercio guardados correctamente');
    } catch (error) {
      console.error('Error guardando:', error);
      alert('❌ Error al guardar los datos');
    } finally {
      setSaving(false);
    }
  };

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
              <h1 className="text-xl font-bold">📋 Datos del Comercio</h1>
            </div>

            {/* Botones del lado derecho */}
            <div className="flex items-center gap-2">
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

          {/* LÍNEA 2: Buscador */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGoogleSearch()}
                placeholder="Buscar restaurante en Google..."
                className={`w-full pl-4 pr-20 py-2 rounded-lg border transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500'
                }`}
              />
              <button
                onClick={handleGoogleSearch}
                disabled={searching || !searchTerm.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded text-xs transition-colors ${
                  searching || !searchTerm.trim()
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-900 text-white'
                }`}
              >
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
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
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200 text-gray-800'
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
              onClick={() => router.push('/carta')}
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
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-800'
              }`}
            >
              ⚙️ Configuración
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal - Una sola card */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Indicador de guardado */}
        {saving && (
          <div className="flex justify-center mb-6">
            <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
              <span className="animate-pulse">●</span>
              Guardando...
            </span>
          </div>
        )}

        {/* Card única - Información Básica */}
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
                <h3 className="text-lg font-bold">📝 Información Básica</h3>
              </div>
            </div>
          </div>
          
          {/* Contenido de la card */}
          <div className="p-6 space-y-6">
              
              {/* Nombre del Restaurante */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: Esquina Pompeya"
                />
              </div>

              {/* Dirección */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: Av. Corrientes 1234, CABA"
                />
              </div>

              {/* Teléfono */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: +54 11 4567-8900"
                />
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: contacto@restaurante.com"
                />
              </div>

              {/* Horarios */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium">
                  Horarios
                </label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                  placeholder="ej: Lun a Dom: 12:00 - 00:00"
                />
              </div>

              {/* Logo del Restaurante */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo del Restaurante
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logoInput"
                  />
                  <label
                    htmlFor="logoInput"
                    className={`block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {formData.logoUrl ? (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <img 
                          src={formData.logoUrl} 
                          alt="Logo" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📷</div>
                          <div className="text-sm text-gray-500">data:image/jpeg;base64</div>
                        </div>
                      </div>
                    )}
                  </label>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() => document.getElementById('logoInput')?.click()}
                    className="mt-2 text-sm text-gray-600 hover:text-gray-700 underline"
                  >
                    Cambiar logo
                  </button>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full p-3 rounded-lg border transition-colors resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="Breve descripción del restaurante"
                />
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="@usuario"
                />
              </div>

              {/* Facebook */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm font-medium">
                  Facebook
                </label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                  placeholder="Página de Facebook"
                />
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
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-500 text-white rounded-lg transition-colors font-medium"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
