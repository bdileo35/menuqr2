'use client';
import { useState, useEffect } from 'react';
import { useAppTheme } from '../../../../hooks/useAppTheme';

interface PanelDatosProps {
  idUnico: string;
}

export default function PanelDatos({ idUnico }: PanelDatosProps) {
  const { isDarkMode } = useAppTheme();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    instagram: '',
    facebook: '',
    logoUrl: '',
    whatsappPhone: ''
  });

  // Cargar datos del comercio
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/menu/${idUnico}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.menu) {
            setFormData({
              restaurantName: data.menu.restaurantName || '',
              address: data.menu.contactAddress || '',
              phone: data.menu.contactPhone || '',
              email: data.menu.contactEmail || '',
              description: data.menu.description || '',
              instagram: data.menu.socialInstagram || '',
              facebook: data.menu.socialFacebook || '',
              logoUrl: data.menu.logoUrl || '',
              whatsappPhone: data.menu.whatsappPhone || ''
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
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
          whatsappPhone: formData.whatsappPhone || null
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Cargando datos del comercio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📋 Datos del Comercio
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Completa la información básica de tu restaurante
        </p>
      </div>

      {/* Card principal con bordes y sombra */}
      <div className={`rounded-xl border-2 transition-colors duration-300 overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="p-6 space-y-5">
          
          {/* Sección: Información Básica */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
              isDarkMode ? 'text-gray-300 border-gray-700' : 'text-gray-800 border-gray-200'
            }`}>
              🏢 Información Básica
            </h3>
            
            {/* Nombre del Restaurante */}
            <div className="flex items-center gap-4">
              <label className="w-28 text-sm font-medium flex items-center gap-2">
                <span>🏷️</span> <span>Nombre</span>
              </label>
              <input
                type="text"
                value={formData.restaurantName}
                onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Nombre del restaurante"
              />
            </div>

            {/* Dirección */}
            <div className="flex items-center gap-4">
              <label className="w-28 text-sm font-medium flex items-center gap-2">
                <span>📍</span> <span>Dirección</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Dirección completa"
              />
            </div>

            {/* Descripción */}
            <div className="flex items-start gap-4">
              <label className="w-28 text-sm font-medium flex items-center gap-2 pt-2">
                <span>📝</span> <span>Descripción</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all resize-none focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Breve descripción del restaurante"
              />
            </div>
          </div>

          {/* Sección: Contacto */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
              isDarkMode ? 'text-gray-300 border-gray-700' : 'text-gray-800 border-gray-200'
            }`}>
              📞 Contacto
            </h3>
            
            {/* Teléfono */}
            <div className="flex items-center gap-4">
              <label className="w-28 text-sm font-medium flex items-center gap-2">
                <span>☎️</span> <span>Teléfono</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Teléfono de contacto"
              />
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-4">
              <label className="w-28 text-sm font-medium flex items-center gap-2">
                <span>💬</span> <span>WhatsApp</span>
              </label>
              <input
                type="text"
                value={formData.whatsappPhone}
                onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Número para pedidos (ej: 5491165695648)"
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <label className="w-28 text-sm font-medium flex items-center gap-2">
                <span>✉️</span> <span>Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Email de contacto"
              />
            </div>
          </div>

          {/* Sección: Redes Sociales */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
              isDarkMode ? 'text-gray-300 border-gray-700' : 'text-gray-800 border-gray-200'
            }`}>
              🌐 Redes Sociales
            </h3>
            
            {/* Instagram */}
            <div className="flex items-center gap-4">
              <label className="w-28 text-sm font-medium flex items-center gap-2">
                <span>📷</span> <span>Instagram</span>
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="@usuario_instagram"
              />
            </div>

            {/* Facebook */}
            <div className="flex items-center gap-4">
              <label className="w-28 text-sm font-medium flex items-center gap-2">
                <span>👥</span> <span>Facebook</span>
              </label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                className={`flex-1 py-2 px-4 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500/50 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Nombre de página de Facebook"
              />
            </div>
          </div>

          {/* Sección: Logo */}
          <div className="pt-4 border-t border-gray-700">
            <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
              isDarkMode ? 'text-gray-300 border-gray-700' : 'text-gray-800 border-gray-200'
            }`}>
              🖼️ Logo del Restaurante
            </h3>
            
            <div className="flex items-start gap-4">
              <label className="w-28 text-sm font-medium pt-2">
                Logo
              </label>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logoInput"
                />
                <div className="relative">
                  <label
                    htmlFor="logoInput"
                    className={`block w-full min-h-[120px] border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {formData.logoUrl ? (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <img 
                          src={formData.logoUrl} 
                          alt="Logo" 
                          className="max-w-full max-h-32 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="text-3xl mb-2">📷</div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Haz clic para subir imagen
                          </div>
                        </div>
                      </div>
                    )}
                  </label>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      title="Eliminar logo"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {formData.logoUrl && (
                  <button
                    type="button"
                    onClick={() => document.getElementById('logoInput')?.click()}
                    className={`mt-2 text-xs underline ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}
                  >
                    Cambiar logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-8 py-3 rounded-lg font-semibold transition-all shadow-lg ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
          } text-white flex items-center gap-2`}
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Guardar Datos</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}



