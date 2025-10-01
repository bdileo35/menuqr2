'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, GripVertical, Plus, Trash2, Eye, Save, CheckCircle } from 'lucide-react'

interface MenuItem {
  id: string
  nombre: string
  descripcion: string
  precio: string
  categoria: string
  imagen?: string
  procesado?: boolean
}

interface QuickImage {
  id: string
  url: string
  name: string
  category: string
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
  'Cocina',
  'Tortillas',
  'Omelets',
  'Sándwiches',
  'Entradas',
  'Empanadas'
]

export default function DemoEditor() {
  const router = useRouter()
  const [comercioData, setComercioData] = useState<ComercioData | null>(null)
  const [processedMenu, setProcessedMenu] = useState<ProcessedMenu | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Platos del Día')
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [showVistaPrevia, setShowVistaPrevia] = useState(false)
  const [quickImages] = useState<QuickImage[]>([
    { id: '1', url: '🍖', name: 'Milanesa', category: 'Platos del Día' },
    { id: '2', url: '🍗', name: 'Pollo', category: 'Cocina' },
    { id: '3', url: '🍝', name: 'Pasta', category: 'Cocina' },
    { id: '4', url: '🥩', name: 'Carne', category: 'Parrilla' },
    { id: '5', url: '🥪', name: 'Sándwich', category: 'Sándwiches' },
    { id: '6', url: '🥟', name: 'Empanada', category: 'Empanadas' },
    { id: '7', url: '🍳', name: 'Huevos', category: 'Omelets' },
    { id: '8', url: '🥙', name: 'Wrap', category: 'Sándwiches' }
  ])

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
      // Cargar datos de demo si no hay datos procesados
      loadDemoMenu()
    }
  }, [])

  const loadDemoMenu = () => {
    // Datos reales del menú Esquina Pompeya del MD
    const demoItems: MenuItem[] = [
      // Platos del Día
      { id: '1', nombre: 'Rinioncitos al jerez c/ puré', descripcion: 'Riñones al jerez con puré cremoso', precio: '$9000', categoria: 'Platos del Día', procesado: true },
      { id: '2', nombre: 'Croquetas de carne c/ ensalada', descripcion: 'Croquetas artesanales con ensalada fresca', precio: '$9000', categoria: 'Platos del Día', procesado: true },
      { id: '3', nombre: 'Chupín de merluza c/ papa natural', descripcion: 'Chupín de merluza con papas naturales', precio: '$10000', categoria: 'Platos del Día', procesado: true },
      { id: '4', nombre: 'Pechuga rellena c/ f. españolas', descripcion: 'Pechuga rellena con papas españolas', precio: '$12000', categoria: 'Platos del Día', procesado: true },
      { id: '5', nombre: 'Mejillones c/ fettuccinis', descripcion: 'Mejillones frescos con fettuccinis', precio: '$12000', categoria: 'Platos del Día', procesado: true },
      { id: '6', nombre: 'Vacío a la parrilla c/ fritas', descripcion: 'Vacío a la parrilla con papas fritas', precio: '$14000', categoria: 'Platos del Día', procesado: true },
      { id: '7', nombre: 'Peceto al verdeo c/ puré', descripcion: 'Peceto al verdeo con puré', precio: '$15000', categoria: 'Platos del Día', procesado: true },
      
      // Promos de la Semana
      { id: '8', nombre: 'Promo 1', descripcion: 'Entraña c/ arroz + postre + bebida', precio: '$12000', categoria: 'Promos', procesado: true },
      { id: '9', nombre: 'Promo 2', descripcion: 'Salpicón de ave + postre + bebida', precio: '$12000', categoria: 'Promos', procesado: true },
      
      // Cocina
      { id: '10', nombre: '1/4 Pollo al horno c/ papas', descripcion: 'Cuarto de pollo al horno con papas', precio: '$9000', categoria: 'Cocina', procesado: true },
      { id: '11', nombre: 'Matambre al verdeo c/ fritas', descripcion: 'Matambre al verdeo con fritas', precio: '$12000', categoria: 'Cocina', procesado: true },
      { id: '12', nombre: 'Bondiola al ajillo c/ fritas', descripcion: 'Bondiola al ajillo con fritas', precio: '$12000', categoria: 'Cocina', procesado: true },
      { id: '13', nombre: 'Vacío al horno c/ papas', descripcion: 'Vacío al horno con papas', precio: '$14000', categoria: 'Cocina', procesado: true },
      
      // Sándwiches
      { id: '14', nombre: 'Sw. milanesa completo', descripcion: 'Milanesa completa', precio: '$7000', categoria: 'Sándwiches', procesado: true },
      { id: '15', nombre: 'Sw. lomito completo', descripcion: 'Lomito completo', precio: '$10000', categoria: 'Sándwiches', procesado: true },
      { id: '16', nombre: 'Francés jamón y queso', descripcion: 'Pan francés con jamón y queso', precio: '$6000', categoria: 'Sándwiches', procesado: true },
      
      // Entradas
      { id: '17', nombre: 'Picada para 2', descripcion: 'Picada para dos personas', precio: '$19000', categoria: 'Entradas', procesado: true },
      { id: '18', nombre: 'Matambre casero c/ rusa', descripcion: 'Matambre con ensalada rusa', precio: '$10000', categoria: 'Entradas', procesado: true },
      { id: '19', nombre: 'Empanadas Carne/Pollo/JyQ', descripcion: 'Empanadas c/u', precio: '$1600', categoria: 'Entradas', procesado: true },
      
      // Tortillas
      { id: '20', nombre: 'Tortilla Española', descripcion: 'Tortilla española tradicional', precio: '$10000', categoria: 'Tortillas', procesado: true },
      { id: '21', nombre: 'Tortilla de Papas c/ cebolla', descripcion: 'Tortilla de papas con cebolla', precio: '$9000', categoria: 'Tortillas', procesado: true }
    ]

    const demoProcessedMenu: ProcessedMenu = {
      items: demoItems,
      duplicatesRemoved: 12,
      categoriesDetected: ['Platos del Día', 'Promos', 'Cocina', 'Sándwiches', 'Entradas', 'Tortillas'],
      processingTime: '2.8s'
    }

    setMenuItems(demoItems)
    setProcessedMenu(demoProcessedMenu)
    localStorage.setItem('demo-processed-menu', JSON.stringify(demoProcessedMenu))
  }

  const getItemsByCategory = (categoria: string) => {
    return menuItems.filter(item => item.categoria === categoria)
  }

  const moveItemToCategory = (itemId: string, newCategory: string) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, categoria: newCategory } : item
      )
    )
  }

  const updateItem = (itemId: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    )
  }

  const quickLoadImage = (itemId: string, imageEmoji: string) => {
    updateItem(itemId, { imagen: imageEmoji })
  }

  const handleVistaPrevia = () => {
    setShowVistaPrevia(true)
  }

  const deleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId))
  }

  const addNewItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      nombre: 'Nuevo Plato',
      descripcion: 'Descripción del plato',
      precio: '$0',
      categoria: selectedCategory,
      procesado: false
    }
    setMenuItems(prev => [...prev, newItem])
    setIsEditing(newItem.id)
  }

  const saveAndContinue = () => {
    // Guardar el menú editado
    const updatedProcessedMenu = {
      ...processedMenu!,
      items: menuItems
    }
    localStorage.setItem('demo-processed-menu', JSON.stringify(updatedProcessedMenu))
    
    // Ir a la carta final
    router.push('/demo/carta-final')
  }

  const categoryStats = CATEGORIAS_SUGERIDAS.map(cat => ({
    name: cat,
    count: getItemsByCategory(cat).length
  }))

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
              <div>
                <h1 className="text-xl font-bold">📝 MenuQR</h1>
                <p className="text-gray-400 text-sm">
                  Paso 3 de 4 - Tu carta/menú digital QR
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm">
                🌙
              </button>
              
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{isPreview ? 'Editar' : 'Vista Previa'}</span>
              </button>

              <button
                onClick={handleVistaPrevia}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Vista Previa Modal</span>
              </button>
              
              <button
                onClick={saveAndContinue}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Guardar y Continuar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progreso del Setup</span>
              <span>75% completado</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" style={{width: '75%'}}></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-sm text-blue-400">1. Datos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              <span className="text-sm text-blue-400">2. Scanner</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-sm text-white font-medium">3. Editor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-600 text-gray-300 rounded-full flex items-center justify-center text-xs">4</div>
              <span className="text-sm text-gray-400">4. Carta</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats y Progress */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{menuItems.length}</div>
              <div className="text-gray-400 text-sm">Productos Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{categoryStats.filter(c => c.count > 0).length}</div>
              <div className="text-gray-400 text-sm">Categorías Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{processedMenu?.duplicatesRemoved || 0}</div>
              <div className="text-gray-400 text-sm">Duplicados Eliminados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{processedMenu?.processingTime || '0s'}</div>
              <div className="text-gray-400 text-sm">Tiempo de Procesado</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categorías */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-4">Categorías</h3>
              <div className="space-y-2">
                {CATEGORIAS_SUGERIDAS.map(categoria => {
                  const count = getItemsByCategory(categoria).length
                  return (
                    <button
                      key={categoria}
                      onClick={() => setSelectedCategory(categoria)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === categoria
                          ? 'bg-blue-600 text-white'
                          : count > 0 
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      <span className="text-sm">{categoria}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        count > 0 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={addNewItem}
                className="w-full mt-4 flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Agregar Producto</span>
              </button>
            </div>
          </div>

          {/* Main Content - Items */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{selectedCategory}</h3>
                <span className="text-sm text-gray-400">
                  {getItemsByCategory(selectedCategory).length} productos
                </span>
              </div>

              <div className="space-y-3">
                {getItemsByCategory(selectedCategory).length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8" />
                    </div>
                    <p>No hay productos en esta categoría</p>
                    <button
                      onClick={addNewItem}
                      className="mt-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Agregar el primero
                    </button>
                  </div>
                ) : (
                  getItemsByCategory(selectedCategory).map(item => (
                    <div
                      key={item.id}
                      className={`bg-gray-700 rounded-lg p-4 ${item.procesado ? 'border border-green-600' : 'border border-yellow-500'}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {isEditing === item.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={item.nombre}
                                onChange={(e) => updateItem(item.id, { nombre: e.target.value })}
                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                                placeholder="Nombre del producto"
                              />
                              <textarea
                                value={item.descripcion}
                                onChange={(e) => updateItem(item.id, { descripcion: e.target.value })}
                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                                rows={2}
                                placeholder="Descripción del producto"
                              />
                              <div className="flex space-x-3">
                                <input
                                  type="text"
                                  value={item.precio}
                                  onChange={(e) => updateItem(item.id, { precio: e.target.value })}
                                  className="w-32 bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                                  placeholder="Precio"
                                />
                                <select
                                  value={item.categoria}
                                  onChange={(e) => moveItemToCategory(item.id, e.target.value)}
                                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 focus:outline-none"
                                >
                                  {CATEGORIAS_SUGERIDAS.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-300 mb-1">Carga Rápida de Imagen:</p>
                                <div className="flex space-x-1 mb-3">
                                  {quickImages.slice(0, 6).map(qImg => (
                                    <button
                                      key={qImg.id}
                                      onClick={() => quickLoadImage(item.id, qImg.url)}
                                      className="text-lg hover:bg-gray-600 p-1 rounded transition-colors"
                                      title={qImg.name}
                                    >
                                      {qImg.url}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setIsEditing(null)}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  Guardar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{item.nombre}</h4>
                                <div className="flex items-center space-x-2">
                                  {item.procesado && (
                                    <div title="Procesado automáticamente">
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    </div>
                                  )}
                                  <span className="font-semibold text-green-400">{item.precio}</span>
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm mt-1">{item.descripcion}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0 flex items-center space-x-2">
                          <button
                            onClick={() => setIsEditing(isEditing === item.id ? null : item.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Modal de Vista Previa */}
      {showVistaPrevia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Vista Previa - {comercioData?.nombre || 'Menú'}</h2>
              <button
                onClick={() => setShowVistaPrevia(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {CATEGORIAS_SUGERIDAS.map(categoria => {
                const items = getItemsByCategory(categoria)
                if (items.length === 0) return null
                
                return (
                  <div key={categoria} className="space-y-3">
                    <h3 className="text-xl font-bold text-white border-b border-gray-600 pb-2">
                      {categoria}
                    </h3>
                    <div className="grid gap-3">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {item.imagen && (
                              <div className="text-2xl">{item.imagen}</div>
                            )}
                            <div>
                              <h4 className="font-medium text-white">{item.nombre}</h4>
                              <p className="text-sm text-gray-300">{item.descripcion}</p>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-green-400">{item.precio}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}