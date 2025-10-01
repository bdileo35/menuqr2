'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DevBanner from '../components/DevBanner';

export default function SetupComercio() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombreComercio: '',
    direccion: '',
    telefono: '',
    email: '',
    descripcion: '',
    horarios: '',
    logo: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Datos del comercio:', formData);
    
    // TODO: Guardar en base de datos
    // Por ahora simulamos y pasamos al siguiente paso
    router.push('/scanner');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DevBanner />
      
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.push('/qr-shop')}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            ← Volver al Shop
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Setup del Comercio</h1>
            <p className="text-gray-300">Paso 1 de 5 - Configuración inicial</p>
          </div>

          <div className="text-gray-400 text-sm">Paso 1/5</div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-2">¡Bienvenido a MenuQR!</h2>
            <p className="text-gray-300">
              Comencemos configurando los datos básicos de tu restaurante
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del comercio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre del Restaurante *
              </label>
              <input
                type="text"
                required
                value={formData.nombreComercio}
                onChange={(e) => setFormData({...formData, nombreComercio: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Esquina Pompeya"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Av. Corrientes 1234, CABA"
              />
            </div>

            {/* Teléfono y Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: +54 11 1234-5678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: info@esquinapompeya.com"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción breve
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={3}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Restaurante de comidas caseras y parrilla argentina..."
              />
            </div>

            {/* Horarios */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Horarios de atención
              </label>
              <input
                type="text"
                value={formData.horarios}
                onChange={(e) => setFormData({...formData, horarios: e.target.value})}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Lun a Dom 12:00 - 15:00 / 19:00 - 24:00"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Logo (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-400">
                    {formData.logo ? formData.logo.name : 'Haz clic para subir tu logo'}
                  </p>
                </label>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => router.push('/qr-shop')}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
              >
                ← Cancelar
              </button>
              
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
              >
                Continuar al Scanner →
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 mb-2">
            <div className="flex-1 h-2 bg-blue-500 rounded"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded"></div>
            <div className="flex-1 h-2 bg-gray-600 rounded"></div>
          </div>
          <div className="text-center text-sm text-gray-400">
            Setup → Scanner → Editor → Personalización → QR
          </div>
        </div>
      </div>
    </div>
  );
}