'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppTheme } from '../../hooks/useAppTheme';
import NavBar from '../../components/NavBar';

export default function DatosComercio() {
  const router = useRouter();
  const params = useParams();
  const idUnico = params?.idUnico as string;
  const { isDarkMode, toggleTheme } = useAppTheme();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados del formulario
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    description: '',
    instagram: '',
    facebook: '',
    logoUrl: '',
    whatsappPhone: '',
    waiters: '', // Lista de meseros separados por comas
    googleMapsUrl: '',
    googleReviewsUrl: ''
  });
  
  // Estado para modal de links de Google
  const [showGoogleLinksModal, setShowGoogleLinksModal] = useState(false);

  // Validar que idUnico existe
  if (!idUnico) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ ID Único no encontrado</h1>
          <p className="text-gray-600 mb-4">La URL debe incluir un ID único válido</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Cargar datos del comercio al montar y cuando cambia idUnico
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/menu/${idUnico}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.menu) {
            // Parsear waiters desde JSON string a array y luego a string separado por comas
            let waitersString = '';
            if (data.menu.waiters) {
              try {
                const waitersArray = typeof data.menu.waiters === 'string' 
                  ? JSON.parse(data.menu.waiters) 
                  : data.menu.waiters;
                if (Array.isArray(waitersArray)) {
                  waitersString = waitersArray.join(', ');
                }
              } catch (e) {
                // Si no es JSON válido, usar como string directo
                waitersString = data.menu.waiters;
              }
            }
            
            setFormData({
              restaurantName: data.menu.restaurantName || '',
              address: data.menu.contactAddress || '',
              phone: data.menu.contactPhone || '',
              email: data.menu.contactEmail || '',
              hours: '',
              description: data.menu.description || '',
              instagram: data.menu.socialInstagram || '',
              facebook: data.menu.socialFacebook || '',
              logoUrl: data.menu.logoUrl || '',
              whatsappPhone: data.menu.whatsappPhone || '',
              waiters: waitersString,
              // googleMapsUrl: data.menu.googleMapsUrl || '', // TODO: Descomentar cuando se agreguen columnas en Supabase
              // googleReviewsUrl: data.menu.googleReviewsUrl || '' // TODO: Descomentar cuando se agreguen columnas en Supabase
              googleMapsUrl: '', // Temporalmente vacío
              googleReviewsUrl: '' // Temporalmente vacío
            });
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [idUnico]);
  
  // Recargar datos cuando la página vuelve a estar visible (al volver de otra página)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const loadData = async () => {
          try {
            const response = await fetch(`/api/menu/${idUnico}`);
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.menu) {
                // Parsear waiters desde JSON string a array y luego a string separado por comas
                let waitersString = '';
                if (data.menu.waiters) {
                  try {
                    const waitersArray = typeof data.menu.waiters === 'string' 
                      ? JSON.parse(data.menu.waiters) 
                      : data.menu.waiters;
                    if (Array.isArray(waitersArray)) {
                      waitersString = waitersArray.join(', ');
                    }
                  } catch (e) {
                    // Si no es JSON válido, usar como string directo
                    waitersString = data.menu.waiters;
                  }
                }
                
                setFormData({
                  restaurantName: data.menu.restaurantName || '',
                  address: data.menu.contactAddress || '',
                  phone: data.menu.contactPhone || '',
                  email: data.menu.contactEmail || '',
                  hours: '',
                  description: data.menu.description || '',
                  instagram: data.menu.socialInstagram || '',
                  facebook: data.menu.socialFacebook || '',
                  logoUrl: data.menu.logoUrl || '',
                  whatsappPhone: data.menu.whatsappPhone || '',
                  waiters: waitersString,
                  // googleMapsUrl: data.menu.googleMapsUrl || '', // TODO: Descomentar cuando se agreguen columnas en Supabase
                  // googleReviewsUrl: data.menu.googleReviewsUrl || '' // TODO: Descomentar cuando se agreguen columnas en Supabase
                  googleMapsUrl: '', // Temporalmente vacío
                  googleReviewsUrl: '' // Temporalmente vacío
                });
              }
            }
          } catch (error) {
            console.error('Error recargando datos:', error);
          }
        };
        loadData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [idUnico]);

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

  // Guardar datos
  const handleSave = async () => {
    setSaving(true);
    try {
      // Convertir waiters de string separado por comas a JSON string
      let waitersJson = null;
      if (formData.waiters && formData.waiters.trim()) {
        const waitersArray = formData.waiters
          .split(',')
          .map(w => w.trim())
          .filter(w => w.length > 0);
        if (waitersArray.length > 0) {
          waitersJson = JSON.stringify(waitersArray);
        }
      }

      const response = await fetch(`/api/menu/${idUnico}/comercio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          contactPhone: formData.phone,
          contactEmail: formData.email,
          contactAddress: formData.address,
          socialInstagram: formData.instagram,
          socialFacebook: formData.facebook,
          description: formData.description,
          logoUrl: formData.logoUrl,
          whatsappPhone: formData.whatsappPhone || null,
          waiters: waitersJson
          // googleMapsUrl: formData.googleMapsUrl || null, // TODO: Descomentar cuando se agreguen columnas en Supabase
          // googleReviewsUrl: formData.googleReviewsUrl || null // TODO: Descomentar cuando se agreguen columnas en Supabase
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar datos');
      }

      alert('✅ Datos del comercio guardados correctamente');
    } catch (error: any) {
      console.error('Error guardando:', error);
      alert(`❌ Error al guardar los datos: ${error.message || 'Intenta nuevamente'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      
      {/* Header - Simplificado sin buscador */}
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          
          {/* Título y botones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">📋 Datos del Comercio</h1>
            </div>

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
      </div>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Loading inicial */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Cargando datos del comercio...
              </p>
            </div>
          </div>
        )}

        {/* Indicador de guardado */}
        {saving && !loading && (
          <div className="flex justify-center mb-6">
            <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isDarkMode 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              <span className="animate-spin">⏳</span>
              Guardando cambios...
            </span>
          </div>
        )}

        {/* Card única - Información Básica */}
        {!loading && (
        <div className={`mb-4 rounded-xl border-2 transition-colors duration-300 overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-100 border-gray-300'
        }`}>
          {/* Header de Categoría */}
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
          
          {/* Contenido de la card - COMPACTO */}
          <div className="p-6 space-y-3">
              
              {/* Nombre del Restaurante */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: Esquina Pompeya"
                />
              </div>

              {/* Dirección */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: Av. Corrientes 1234, CABA"
                />
              </div>

              {/* Teléfono */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: +54 11 4567-8900"
                />
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: contacto@restaurante.com"
                />
              </div>

              {/* Horarios */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Horarios
                </label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: Lun a Dom: 12:00 - 00:00"
                />
              </div>

              {/* Logo - EN LÍNEA */}
              <div className="flex items-start gap-3 mb-2">
                <label className="w-24 text-sm font-medium pt-1.5">
                  Logo
                </label>
                <div className="flex-1">
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
                      className={`block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {formData.logoUrl ? (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <img 
                            src={formData.logoUrl} 
                            alt="Logo" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl mb-1">📷</div>
                            <div className="text-xs text-gray-500">Subir imagen</div>
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
                </div>
              </div>

              {/* Descripción - EN LÍNEA */}
              <div className="flex items-start gap-3 mb-2">
                <label className="w-24 text-sm font-medium pt-1.5">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors resize-y ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="Breve descripción del restaurante"
                />
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="@usuario"
                />
              </div>

              {/* Facebook */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Facebook
                </label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="Página de Facebook"
                />
              </div>

              {/* WhatsApp para Pedidos */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsappPhone}
                  onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="5491165695648 (sin + ni espacios)"
                />
                <span className="text-xs text-gray-500 w-32">
                  Número para recibir pedidos
                </span>
              </div>

              {/* Camareros/as */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Camareros/as
                </label>
                <input
                  type="text"
                  value={formData.waiters}
                  onChange={(e) => handleInputChange('waiters', e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: Maria, Lucia, Carmen"
                />
                <span className="text-xs text-gray-500 w-32">
                  Separados por comas
                </span>
              </div>

              {/* Links de Google */}
              <div className="flex items-center gap-3 mb-2">
                <label className="w-24 text-sm font-medium">
                  Google Maps
                </label>
                <button
                  type="button"
                  onClick={() => setShowGoogleLinksModal(true)}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors text-left ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {formData.googleMapsUrl ? (
                    <span className="text-sm text-blue-500 truncate">{formData.googleMapsUrl.substring(0, 50)}...</span>
                  ) : (
                    <span className="text-sm text-gray-500">Configurar links de Google</span>
                  )}
                </button>
                <span className="text-xs text-gray-500 w-32">
                  Maps y Reseñas
                </span>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-600">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className={`px-6 py-2 rounded-lg transition-colors ${
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
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-500 text-white rounded-lg transition-colors font-medium"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
          </div>
        </div>
        )}

        {/* Modal de Links de Google */}
        {showGoogleLinksModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md mx-4`}>
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Links de Google
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Google Maps (URL del lugar)
                  </label>
                  <input
                    type="url"
                    value={formData.googleMapsUrl}
                    onChange={(e) => handleInputChange('googleMapsUrl', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                    }`}
                    placeholder="https://www.google.com/maps/place/..."
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Google Reviews (URL de reseñas)
                  </label>
                  <input
                    type="url"
                    value={formData.googleReviewsUrl}
                    onChange={(e) => handleInputChange('googleReviewsUrl', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
                    }`}
                    placeholder="https://www.google.com/maps/place/.../reviews"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-600">
                <button
                  type="button"
                  onClick={() => setShowGoogleLinksModal(false)}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowGoogleLinksModal(false);
                    handleSave();
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Guardar Links
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* NavBar fija en la parte inferior */}
      <NavBar idUnico={idUnico} />
    </div>
  );
}