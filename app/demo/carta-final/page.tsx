'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Share2, QrCode, Eye, Star, MapPin, Clock, Phone, Instagram, Facebook, CheckCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface MenuItem {
  id: string
  nombre: string
  descripcion: string
  precio: string
  categoria: string
  imagen?: string
  procesado?: boolean
}

interface ComercioData {
  nombre: string
  direccion: string
  telefono: string
  email: string
  horarios: string
  logo?: string
  descripcion: string
  instagram?: string
  facebook?: string
}

interface ProcessedMenu {
  items: MenuItem[]
  duplicatesRemoved: number
  categoriesDetected: string[]
  processingTime: string
}

const CATEGORIAS_SUGERIDAS = [
  'Platos del Día',
  'Promos',
  'Parrilla',
  'Cocina',
  'Pastas', 
  'Sándwiches',
  'Postres',
  'Bebidas'
]

export default function DemoCartaFinal() {
  const router = useRouter()
  const [comercioData, setComercioData] = useState<ComercioData | null>(null)
  const [processedMenu, setProcessedMenu] = useState<ProcessedMenu | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    // Cargar datos del localStorage
    const comercio = localStorage.getItem('demo-comercio-data')
    const menu = localStorage.getItem('demo-processed-menu')
    
    if (comercio) {
      setComercioData(JSON.parse(comercio))
    }
    
    if (menu) {
      const menuData = JSON.parse(menu)
      setProcessedMenu(menuData)
      setMenuItems(menuData.items || [])
    } else {
      // Cargar datos completos de Esquina Pompeya si no hay datos procesados
      loadEsquinaPompeyaMenu()
    }

    // Simular proceso de generación
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }, [])

  const getItemsByCategory = (categoria: string) => {
    return menuItems.filter(item => item.categoria === categoria)
  }

  const categoriasConItems = CATEGORIAS_SUGERIDAS.filter(cat => getItemsByCategory(cat).length > 0)

  const loadEsquinaPompeyaMenu = () => {
    const esquinaPompeyaItems: MenuItem[] = [
      // Platos del Día
      { id: '1', nombre: 'Milanesas al horno c/ Puré', descripcion: 'Milanesas caseras al horno con puré cremoso', precio: '$9000', categoria: 'Platos del Día', imagen: '🍖', procesado: true },
      { id: '2', nombre: 'Chuleta de merluza c/rusa', descripcion: 'Chuleta de merluza fresca con ensalada rusa', precio: '$10000', categoria: 'Platos del Día', imagen: '🐟', procesado: true },
      { id: '3', nombre: 'Vacío a la parrilla c/fritas', descripcion: 'Vacío jugoso con papas fritas caseras', precio: '$15000', categoria: 'Platos del Día', imagen: '🥩', procesado: true },
      { id: '4', nombre: 'Pechuga rellena c/ f. españolas', descripcion: 'Pechuga rellena con papas españolas', precio: '$12000', categoria: 'Platos del Día', imagen: '🍗', procesado: true },
      
      // Promos
      { id: '5', nombre: 'PROMO 1: Milanesa c/Papas + Postre + Bebida', descripcion: 'Promo completa para una persona', precio: '$12000', categoria: 'Promos', imagen: '🎉', procesado: true },
      { id: '6', nombre: 'PROMO 2: Salpicón de Ave + Postre + Bebida', descripcion: 'Opción fresca y completa', precio: '$12000', categoria: 'Promos', imagen: '🥗', procesado: true },
      
      // Cocina
      { id: '7', nombre: 'Arepa de Pollo', descripcion: 'Arepa venezolana rellena de pollo mechado', precio: '$7500', categoria: 'Cocina', imagen: '🫓', procesado: true },
      { id: '8', nombre: 'Casuela de Mariscos', descripcion: 'Casuela con mariscos frescos del día', precio: '$16000', categoria: 'Cocina', imagen: '🦐', procesado: true },
      { id: '9', nombre: 'Lomo Saltado', descripcion: 'Lomo salteado con cebolla y tomate', precio: '$15000', categoria: 'Cocina', imagen: '🥩', procesado: true },
      
      // Tortillas
      { id: '10', nombre: 'Tortilla Española', descripcion: 'Tortilla española tradicional con papas', precio: '$8500', categoria: 'Tortillas', imagen: '🍳', procesado: true },
      { id: '11', nombre: 'Tortilla de Jamón y Queso', descripcion: 'Tortilla rellena de jamón y queso', precio: '$9000', categoria: 'Tortillas', imagen: '🧀', procesado: true },
      
      // Omelets  
      { id: '12', nombre: 'Omelet de Jamón y Queso', descripcion: 'Omelet esponjoso con jamón y queso', precio: '$7000', categoria: 'Omelets', imagen: '🍳', procesado: true },
      { id: '13', nombre: 'Omelet de Verduras', descripcion: 'Omelet con verduras frescas de estación', precio: '$6500', categoria: 'Omelets', imagen: '🥬', procesado: true },
      
      // Sándwiches
      { id: '14', nombre: 'Sándwich de Milanesa', descripcion: 'Sándwich con milanesa casera y acompañamientos', precio: '$6500', categoria: 'Sándwiches', imagen: '🥪', procesado: true },
      { id: '15', nombre: 'Sándwich de Lomito', descripcion: 'Lomito completo con todos los agregados', precio: '$9500', categoria: 'Sándwiches', imagen: '🥙', procesado: true },
      { id: '16', nombre: 'Club Sándwich', descripcion: 'Club sándwich triple con pollo y panceta', precio: '$8000', categoria: 'Sándwiches', imagen: '🥪', procesado: true },
      
      // Entradas
      { id: '17', nombre: 'Tabla de Fiambres', descripcion: 'Selección de fiambres y quesos', precio: '$14000', categoria: 'Entradas', imagen: '🧀', procesado: true },
      { id: '18', nombre: 'Provoleta a la Parrilla', descripcion: 'Provoleta grillada con oregano', precio: '$6500', categoria: 'Entradas', imagen: '🧀', procesado: true },
      { id: '19', nombre: 'Ceviche de Pescado', descripcion: 'Ceviche fresco con pescado del día', precio: '$9500', categoria: 'Entradas', imagen: '🐟', procesado: true },
      
      // Empanadas
      { id: '20', nombre: 'Empanadas de Carne', descripcion: 'Empanadas criollas de carne cortada a cuchillo', precio: '$600', categoria: 'Empanadas', imagen: '🥟', procesado: true },
      { id: '21', nombre: 'Empanadas de Pollo', descripcion: 'Empanadas de pollo casero', precio: '$600', categoria: 'Empanadas', imagen: '🥟', procesado: true }
    ]

    const esquinaPompeyaMenu: ProcessedMenu = {
      items: esquinaPompeyaItems,
      duplicatesRemoved: 8,
      categoriesDetected: ['Platos del Día', 'Promos', 'Cocina', 'Tortillas', 'Omelets', 'Sándwiches', 'Entradas', 'Empanadas'],
      processingTime: '3.2s'
    }

    setMenuItems(esquinaPompeyaItems)
    setProcessedMenu(esquinaPompeyaMenu)
  }

  const generateQRCode = () => {
    // Simular generación de QR
    alert('QR Code generado! En producción se descargaría automáticamente.')
  }

  const shareMenu = () => {
    // Simular compartir
    if (navigator.share) {
      navigator.share({
        title: `Menú de ${comercioData?.nombre}`,
        text: 'Mira nuestro nuevo menú digital!',
        url: window.location.href
      })
    } else {
      alert('Enlace copiado al portapapeles!')
    }
  }

  const downloadPDF = () => {
    alert('PDF descargado! En producción se generaría el archivo PDF del menú.')
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Generando tu carta digital...</h2>
          <p className="text-gray-400 mb-6">Aplicando estilos profesionales y optimizando el diseño</p>
          
          <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Procesando {menuItems.length} productos</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Organizando {categoriasConItems.length} categorías</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Aplicando identidad de {comercioData?.nombre}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Optimizando para móviles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header de Control */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/demo/editor')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Editar</span>
              </button>
              <div>
                <h1 className="font-semibold text-white">✨ MenuQR</h1>
                <p className="text-sm text-gray-400">Paso 4 de 4 - Tu carta/menú digital QR</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm">
                🌙
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progreso Completado */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progreso del Setup</span>
              <span>100% completado</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{width: '100%'}}></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-sm text-green-400">1. Datos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-sm text-green-400">2. Scanner</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-sm text-green-400">3. Editor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-sm text-blue-400 font-medium">4. Carta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-bold">¡Carta Digital Creada Exitosamente!</h2>
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-green-100">
            Proceso completado en tiempo récord • {processedMenu?.duplicatesRemoved} duplicados eliminados • {menuItems.length} productos organizados
          </p>
        </div>
      </div>

      {/* Menu Display */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Restaurant Header con Imágenes */}
        <div className="bg-gradient-to-br from-blue-900 via-gray-800 to-blue-800 rounded-xl shadow-lg p-8 mb-8 relative overflow-hidden">
          {/* Imágenes del menú en el fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="flex space-x-2 text-6xl absolute top-4 left-4">🍖</div>
            <div className="flex space-x-2 text-4xl absolute top-16 right-8">🍝</div>
            <div className="flex space-x-2 text-5xl absolute bottom-8 left-16">🥩</div>
            <div className="flex space-x-2 text-3xl absolute bottom-4 right-4">🍳</div>
          </div>
          
          <div className="text-center relative z-10">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <span className="text-3xl">
                {comercioData?.logo || '🍽️'}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2">
              {comercioData?.nombre || 'Esquina Pompeya'}
            </h1>
            
            <p className="text-blue-100 mb-6 text-lg font-medium">
              {comercioData?.descripcion || 'Cocina casera argentina con los sabores de siempre'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2 bg-blue-800/30 rounded-lg p-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-blue-100">{comercioData?.direccion || 'Av. Corrientes 1234, CABA'}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-blue-800/30 rounded-lg p-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-blue-100">{comercioData?.telefono || '+54 11 4567-8900'}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-blue-800/30 rounded-lg p-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-blue-100">{comercioData?.horarios || 'Lun a Dom: 12:00 - 00:00'}</span>
              </div>
            </div>
            
            {(comercioData?.instagram || comercioData?.facebook) && (
              <div className="flex items-center justify-center space-x-4 mt-4">
                {comercioData.instagram && (
                  <a href="#" className="flex items-center space-x-1 text-pink-600 hover:text-pink-700">
                    <Instagram className="w-4 h-4" />
                    <span>@{comercioData.instagram}</span>
                  </a>
                )}
                {comercioData.facebook && (
                  <a href="#" className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <Facebook className="w-4 h-4" />
                    <span>{comercioData.facebook}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Menu Categories */}
        {categoriasConItems.map(categoria => {
          const items = getItemsByCategory(categoria)
          if (items.length === 0) return null

          return (
            <div key={categoria} className="bg-gradient-to-br from-blue-900/40 via-gray-800 to-blue-800/40 rounded-xl shadow-lg p-8 mb-6 border border-blue-700/30">
              <h2 className="text-2xl font-bold text-white mb-8 pb-3 border-b border-blue-600/50 flex items-center">
                <span className="text-2xl mr-3">
                  {categoria === 'Platos del Día' && '🍽️'}
                  {categoria === 'Promos' && '🎉'}
                  {categoria === 'Cocina' && '👨‍🍳'}
                  {categoria === 'Tortillas' && '🥞'}
                  {categoria === 'Omelets' && '🍳'}
                  {categoria === 'Sándwiches' && '🥪'}
                  {categoria === 'Entradas' && '🥗'}
                  {categoria === 'Empanadas' && '🥟'}
                </span>
                {categoria}
              </h2>
              
              <div className="grid gap-6">
                {items.map(item => (
                  <div key={item.id} className="bg-blue-800/20 rounded-lg p-5 border border-blue-600/20 hover:border-blue-500/40 transition-all duration-200 group hover:bg-blue-800/30">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {item.imagen && (
                            <span className="text-2xl">{item.imagen}</span>
                          )}
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors text-lg">
                              {item.nombre}
                            </h3>
                            {item.procesado && (
                              <span className="px-2 py-1 bg-green-600/80 text-white text-xs rounded-full">
                                AI
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-blue-100/80 mt-2 leading-relaxed">{item.descripcion}</p>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="font-bold text-xl text-green-400 bg-green-900/30 px-3 py-1 rounded-lg">
                          {item.precio}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Sección Final - QR Code Funcional en Apaisado */}
        <div className="py-12">
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white p-12 rounded-2xl max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              ¡Tu Menú Digital está Listo!
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Columna Izquierda - QR Code Funcional */}
              <div className="text-center">
                <div className="bg-white p-8 rounded-2xl shadow-2xl mb-6 inline-block">
                  <div className="w-64 h-64 mx-auto">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=https://menu-2uxufo3ze-bdileo35s-projects.vercel.app/menu/esquina-pompeya`}
                      alt="QR Code del Menú"
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <p className="text-gray-300 text-lg font-medium">
                  Escanea para ver el menú digital
                </p>
              </div>
              
              {/* Columna Derecha - Información y Acciones */}
              <div className="space-y-8">
                {/* URL del Menú */}
                <div>
                  <h4 className="font-bold text-xl mb-4 text-green-400">� URL de tu menú:</h4>
                  <div className="bg-gray-700/50 px-6 py-4 rounded-lg border border-gray-600">
                    <p className="text-blue-300 font-mono text-sm break-all">
                      https://menu-2uxufo3ze-bdileo35s-projects.vercel.app/menu/esquina-pompeya
                    </p>
                  </div>
                </div>
                
                {/* Botones de Acción */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={shareMenu}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-semibold">Compartir</span>
                  </button>
                  
                  <button
                    onClick={downloadPDF}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-semibold">Descargar PDF</span>
                  </button>
                </div>
                
                {/* Estadísticas */}
                <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600">
                  <h4 className="font-bold text-lg mb-4 text-blue-400">📊 Resumen del Procesamiento</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{menuItems.length}</div>
                      <div className="text-gray-300">Productos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{categoriasConItems.length}</div>
                      <div className="text-gray-300">Categorías</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{processedMenu?.duplicatesRemoved || 0}</div>
                      <div className="text-gray-300">Duplicados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">100%</div>
                      <div className="text-gray-300">Completado</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Powered by */}
            <div className="border-t border-gray-600 mt-12 pt-8 text-center">
              <h4 className="font-bold text-lg mb-3 text-gray-300">⚡ Powered by MenuQR</h4>
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>OCR Inteligente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Procesamiento IA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Tiempo Real</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>QR Dinámico</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Completion Status */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 border border-green-600">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <div className="font-semibold text-white">Demo Completado!</div>
              <div className="text-sm text-gray-300">4/4 pasos terminados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}