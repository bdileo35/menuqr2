'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import SmartScannerMejorado from '../../../_unused/components/SmartScannerMejorado';
// import Sidebar from '../../../_unused/components/Sidebar';
// import QRGenerator from '../components/QRGenerator';

interface ExtractedItem {
  category: string;
  code?: string;
  name: string;
  price: number;
  description?: string;
}

interface BusinessData {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
  instagram: string;
  facebook: string;
  logo: string;
}

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    description: '',
    instagram: '',
    facebook: '',
    logo: ''
  });
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);

  const steps = [
    { id: 1, name: 'Datos del Comercio', icon: '📋' },
    { id: 2, name: 'Generar Menú', icon: '📷' },
    { id: 3, name: 'Editor', icon: '✏️' },
    { id: 4, name: 'Opciones QR', icon: '📱' },
    { id: 5, name: 'Carta Menú', icon: '🍽️' },
    { id: 6, name: 'Configuraciones', icon: '⚙️' }
  ];

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExtractedData = (data: ExtractedItem[]) => {
    setExtractedItems(data);
  };

  const loadDemoData = () => {
    setBusinessData({
      name: 'Esquina Pompeya',
      address: 'Av. Corrientes 1234, CABA',
      phone: '+54 11 4567-8900',
      email: 'contacto@esquinapompeya.com',
      hours: 'Lun a Dom: 12:00 - 00:00',
      description: 'Cocina casera argentina con los sabores de siempre',
      instagram: '@esquinapompeya',
      facebook: 'Esquina Pompeya Restaurante',
      logo: '/demo-images/logo.png'
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Botón Demo */}
            <div className="text-center">
              <button
                onClick={loadDemoData}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto"
              >
                <span>⚡</span>
                Cargar Datos Demo (Esquina Pompeya)
              </button>
              <p className="text-sm text-gray-400 mt-2">Para agilizar la demostración</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información Básica */}
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Información Básica
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nombre del Restaurante *
                    </label>
                    <input
                      type="text"
                      value={businessData.name}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="ej: Esquina Pompeya"
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={businessData.address}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="ej: Av. Corrientes 1234, CABA"
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="ej: +54 11 4567-8900"
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={businessData.email}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ej: contacto@restaurante.com"
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Horarios
                    </label>
                    <input
                      type="text"
                      value={businessData.hours}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, hours: e.target.value }))}
                      placeholder="ej: Lun a Dom: 12:00 - 00:00"
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Imagen y Redes */}
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📷</span>
                  Imagen y Redes
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Logo del Restaurante
                    </label>
                    <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setBusinessData(prev => ({ ...prev, logo: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="logoUpload"
                      />
                      <label htmlFor="logoUpload" className="cursor-pointer">
                        {businessData.logo ? (
                          <img src={businessData.logo} alt="Logo" className="w-32 h-32 object-contain mx-auto rounded" />
                        ) : (
                          <div className="text-gray-400">
                            <span className="text-4xl block mb-2">📷</span>
                            <span>Subir logo</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={businessData.description}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Breve descripción del restaurante"
                      rows={3}
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={businessData.instagram}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="@usuario"
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={businessData.facebook}
                      onChange={(e) => setBusinessData(prev => ({ ...prev, facebook: e.target.value }))}
                      placeholder="Página de Facebook"
                      className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <span>📷</span>
                Scanner OCR Inteligente
              </h2>
              <p className="text-gray-400">Sube imágenes de tu menú y la IA extraerá automáticamente los platos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Panel */}
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📷</span>
                  Subir Imagen de la Carta
                </h3>
                
                {/* Demo Images Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="bg-gray-600 rounded-lg h-20 flex items-center justify-center">
                      <span className="text-gray-400">📄</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mb-4">+5 imágenes más... ✅ 9 imágenes cargadas</p>

                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                  <span>🚀</span>
                  Cargar Demo con Fotos Reales
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Perfecto para presentaciones • Datos reales de restaurante
                </p>

                <div className="mt-6">
                  <h4 className="font-bold text-gray-300 mb-2">Tips para mejores resultados:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Usa buena iluminación</li>
                    <li>• Mantén la carta plana y recta</li>
                    <li>• Evita reflejos y sombras</li>
                    <li>• Asegúrate que el texto sea legible</li>
                  </ul>
                </div>
              </div>

              {/* Results Panel */}
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🤖</span>
                  Datos Extraídos por IA
                </h3>
                
                <div className="bg-gray-600 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-400 mb-2">PLATOS DEL DIA</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Milanesas al horno c/ Puré", price: 9000, confidence: 95 },
                      { name: "Croquetas de carne c/ensalada", price: 8000, confidence: 92 },
                      { name: "Chuleta de merluza c/rusa gatura", price: 10000, confidence: 88 },
                      { name: "Pechuga rellena c/ f. españolas", price: 12000, confidence: 90 },
                      { name: "Mejillones c/ fetuccinis", price: 14000, confidence: 87 },
                      { name: "Vacío a la parrilla c/fritas", price: 15000, confidence: 94 },
                      { name: "Peceto al verdeo c/ Puré", price: 15000, confidence: 91 }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">${item.price}</span>
                          <span className="text-green-400 text-xs">Confianza: {item.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-bold">
                  ✅ Aceptar Datos Extraídos
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <span>✏️</span>
              Editor de Menú
            </h2>
            <p className="text-gray-400">Aquí puedes editar los platos extraídos por la IA</p>
            <button
              onClick={() => router.push('/editor')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              Ir al Editor
            </button>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <span>📱</span>
              Opciones QR
            </h2>
            <p className="text-gray-400">Personaliza el diseño de tu código QR</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-black text-xs">QR CODE</span>
                </div>
                <h3 className="font-bold">Clásico</h3>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="w-32 h-32 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs">QR CODE</span>
                </div>
                <h3 className="font-bold">Moderno</h3>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs">QR CODE</span>
                </div>
                <h3 className="font-bold">Minimalista</h3>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <span>🍽️</span>
              Carta Menú
            </h2>
            <p className="text-gray-400">Vista previa de tu menú digital</p>
            
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">¡Carta Digital Creada Exitosamente!</h3>
              <p className="text-sm opacity-90">Proceso completado en tiempo récord • duplicados eliminados • 15 productos organizados</p>
            </div>

            {/* Menu Preview */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-8 rounded-lg max-w-md mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-800 text-2xl">🍽️</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{businessData.name || 'Esquina Pompeya'}</h3>
                <p className="text-blue-200 text-sm mb-6">{businessData.description || 'Cocina casera argentina con los sabores de siempre'}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <span>📍</span>
                    <span>{businessData.address || 'Av. Corrientes 1234, CABA'}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>📞</span>
                    <span>{businessData.phone || '+54 11 4567-8900'}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>🕒</span>
                    <span>{businessData.hours || 'Lun a Dom: 12:00 - 00:00'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Generator */}
            {/* <QRGenerator 
              restaurantName={businessData.name || 'Esquina Pompeya'}
              menuUrl="https://menuqrep.vercel.app/carta-menu"
            /> */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">🔧 QR Generator (Próximamente)</h2>
              <p className="text-gray-400">El generador de QR estará disponible pronto</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <span>⚙️</span>
              Configuraciones
            </h2>
            <p className="text-gray-400">Configuración avanzada del sistema</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="font-bold mb-4">Tema</h3>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 rounded">Azul</button>
                  <button className="w-full bg-gray-600 text-white py-2 rounded">Gris</button>
                  <button className="w-full bg-green-600 text-white py-2 rounded">Verde</button>
                </div>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="font-bold mb-4">Idioma</h3>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 rounded">Español</button>
                  <button className="w-full bg-gray-600 text-white py-2 rounded">English</button>
                </div>
              </div>
            </div>

            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto">
              <span>✅</span>
              Demo Completado! 6/6 pasos terminados
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Sidebar */}
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {/* setSidebarOpen(true) */}}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <span>🍔</span>
              Menu
            </button>
            
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span>📱</span>
                MenuQR Setup
              </h1>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-gray-300">Progreso del Setup</h2>
            <span className="text-sm text-gray-400">{Math.round((currentStep / 6) * 100)}% completado</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className={`text-xs ${
                step.id === currentStep ? 'text-purple-400 font-bold' : 
                step.id < currentStep ? 'text-green-400' : 'text-gray-500'
              }`}>
                {step.icon} {step.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>←</span>
            Atrás
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === 6}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 6 ? 'Finalizar' : 'Continuar'}
            {currentStep < 6 && <span>→</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

