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
    whatsappPhone: '',
    waiters: '' // Lista de camareros/as separados por comas
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
              whatsappPhone: data.menu.whatsappPhone || '',
              waiters: data.menu.waiters || ''
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
          whatsappPhone: formData.whatsappPhone || null,
          waiters: formData.waiters || null
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
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Card única - Datos del Comercio */}
      <div className={`mb-4 rounded-xl border-2 transition-colors duration-300 overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gray-200 border-gray-400'
      }`}>
        {/* Header de Categoría */}
        <div className={`px-4 py-2 cursor-pointer transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pl-3">
              <h3 className="text-lg font-bold">📋 Datos del Comercio</h3>
            </div>
          </div>
        </div>
        
        {/* Contenido de la card - COMPACTO */}
        <div className="p-6 space-y-3">
              
              {/* Nombre del Restaurante */}
              <div className="flex items-center gap-4">
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
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
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
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
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
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
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
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="ej: contacto@restaurante.com"
                />
              </div>

              {/* Logo */}
              <div className="flex items-start gap-4">
                <label className="w-24 text-sm font-medium pt-2">
                  Logo
                </label>
                <div className="flex-1 space-y-2">
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

              {/* Descripción - TEXTAREA EXPANDIBLE (2 líneas iniciales) */}
              <div className="flex items-start gap-4">
                <label className="w-24 text-sm font-medium pt-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  ref={(textarea) => {
                    if (textarea) {
                      textarea.style.height = 'auto';
                      textarea.style.height = textarea.scrollHeight + 'px';
                    }
                  }}
                  onChange={(e) => {
                    handleInputChange('description', e.target.value);
                    // Auto-expand textarea
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                  rows={2}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  style={{ minHeight: '2.5rem', lineHeight: '1.25rem' }}
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
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
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
                  className={`flex-1 px-3 py-1.5 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="Página de Facebook"
                />
              </div>

              {/* WhatsApp para Pedidos */}
              <div className="flex items-center gap-4">
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
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
                  }`}
                  placeholder="5491165695648 (sin + ni espacios)"
                />
                <span className="text-xs text-gray-500 w-32">
                  Número para recibir pedidos
                </span>
              </div>

              {/* Camareros/as */}
              <div className="flex items-start gap-4">
                <label className="w-24 text-sm font-medium pt-2">
                  Camareros/as
                </label>
                <div className="flex-1">
                  <textarea
                    value={formData.waiters}
                    onChange={(e) => {
                      handleInputChange('waiters', e.target.value);
                      // Auto-expand textarea
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                    rows={2}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors resize-none ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-500'
                    }`}
                    style={{ minHeight: '2.5rem', lineHeight: '1.25rem' }}
                    placeholder="Separar por comas: Juan, María, Pedro..."
                  />
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Lista de camareros/as separados por comas
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-600">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    saving
                      ? 'bg-gray-500 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-gray-800 hover:bg-gray-900 text-white'
                        : 'bg-gray-800 hover:bg-gray-900 text-white'
                  }`}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
          </div>
        </div>
    </div>
  );
}



