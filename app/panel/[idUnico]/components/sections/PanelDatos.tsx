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

      <div className="space-y-4">
        {/* Nombre del Restaurante */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={formData.restaurantName}
            onChange={(e) => handleInputChange('restaurantName', e.target.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
            }`}
            placeholder="Nombre del restaurante"
          />
        </div>

        {/* Dirección */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Dirección</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
            }`}
            placeholder="Dirección completa"
          />
        </div>

        {/* Teléfono */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Teléfono</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
            }`}
            placeholder="Teléfono de contacto"
          />
        </div>

        {/* WhatsApp */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">WhatsApp</label>
          <input
            type="text"
            value={formData.whatsappPhone}
            onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
            }`}
            placeholder="Número de WhatsApp para pedidos"
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
            }`}
            placeholder="Email de contacto"
          />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Logo</label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="logoInput"
            />
            <input
              type="text"
              value={formData.logoUrl || ''}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
              }`}
              placeholder="URL del logo o data:image..."
            />
            <label
              htmlFor="logoInput"
              className={`px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📁
            </label>
            {formData.logoUrl && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                className="px-2 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Descripción</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
            }`}
            placeholder="Breve descripción del restaurante"
          />
        </div>

        {/* Instagram */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Instagram</label>
          <input
            type="text"
            value={formData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
            }`}
            placeholder="@usuario_instagram"
          />
        </div>

        {/* Facebook */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-sm font-medium">Facebook</label>
          <input
            type="text"
            value={formData.facebook}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
            className={`flex-1 py-1.5 px-3 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'
            }`}
            placeholder="Nombre de página de Facebook"
          />
        </div>
      </div>

      {/* Botón Guardar y Siguiente */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar Datos'}
        </button>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          💡 Completa los datos y presiona "Siguiente" en el menú inferior
        </div>
      </div>
    </div>
  );
}



