'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DevBanner from '../components/DevBanner';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  image?: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function Editor() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    // Cargar datos del scanner o usar datos demo
    const savedData = localStorage.getItem('demo-processed-menu');
    if (savedData) {
      const processedMenu = JSON.parse(savedData);
      const formattedCategories: Category[] = processedMenu.categories.map((cat: any, index: number) => ({
        id: `cat-${index}`,
        name: cat.name,
        items: cat.items.map((item: any, itemIndex: number) => ({
          id: `item-${index}-${itemIndex}`,
          name: item.name,
          price: item.price,
          description: item.description || '',
          category: `cat-${index}`,
          image: null
        }))
      }));
      setCategories(formattedCategories);
      setSelectedCategory(formattedCategories[0]?.id || null);
    } else {
      // Datos demo por defecto
      const demoCategories: Category[] = [
        {
          id: 'platos-dia',
          name: 'PLATOS DEL DÍA',
          items: [
            { id: '1', name: 'Milanesas al horno c/ Puré', price: '$9000', description: 'Milanesas caseras con puré cremoso', category: 'platos-dia' },
            { id: '2', name: 'Vacío a la parrilla c/ fritas', price: '$15000', description: 'Vacío jugoso con papas fritas', category: 'platos-dia' },
          ]
        },
        {
          id: 'promos',
          name: 'PROMOS',
          items: [
            { id: '3', name: 'Promo 1: Milanesa Completa', price: '$12000', description: 'Milanesa + Papas + Postre + Bebida', category: 'promos' },
          ]
        }
      ];
      setCategories(demoCategories);
      setSelectedCategory('platos-dia');
    }
  }, []);

  const handleSaveItem = (item: MenuItem) => {
    if (editingItem) {
      // Editar item existente
      setCategories(prev => prev.map(cat => ({
        ...cat,
        items: cat.items.map(i => i.id === item.id ? item : i)
      })));
    } else {
      // Agregar nuevo item
      const newItem = {
        ...item,
        id: `item-${Date.now()}`,
        category: selectedCategory || categories[0]?.id
      };
      
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory 
          ? { ...cat, items: [...cat.items, newItem] }
          : cat
      ));
    }
    
    setEditingItem(null);
    setShowAddItem(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.id !== itemId)
      })));
    }
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const totalItems = categories.reduce((total, cat) => total + cat.items.length, 0);

  const continuarPersonalizacion = () => {
    // Guardar datos del editor
    localStorage.setItem('editor-menu-data', JSON.stringify(categories));
    router.push('/personalizacion');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DevBanner />
      
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.push('/scanner')}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            ← Anterior
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Editor de Menú</h1>
            <p className="text-gray-300">Paso 3 de 5 - Editar productos y categorías</p>
          </div>

          <div className="text-gray-400 text-sm">Paso 3/5</div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">{totalItems}</div>
              <div className="text-sm text-gray-300">Total Productos</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{categories.length}</div>
              <div className="text-sm text-gray-300">Categorías</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-sm text-gray-300">Con Imágenes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Categorías */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">📁 Categorías</h3>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm opacity-75">{category.items.length} productos</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const name = prompt('Nombre de la nueva categoría:');
                  if (name) {
                    const newCategory: Category = {
                      id: `cat-${Date.now()}`,
                      name: name.toUpperCase(),
                      items: []
                    };
                    setCategories(prev => [...prev, newCategory]);
                    setSelectedCategory(newCategory.id);
                  }
                }}
                className="w-full mt-4 p-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
              >
                + Agregar Categoría
              </button>
            </div>
          </div>

          {/* Main content - Lista de productos */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              {currentCategory && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">
                      {currentCategory.name}
                    </h3>
                    <button
                      onClick={() => setShowAddItem(true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors font-medium"
                    >
                      + Agregar Producto
                    </button>
                  </div>

                  {currentCategory.items.length > 0 ? (
                    <div className="space-y-3">
                      {currentCategory.items.map((item) => (
                        <div key={item.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <span className="text-gray-400 text-xs">🍽️</span>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white mb-1">{item.name}</h4>
                                  {item.description && (
                                    <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                                  )}
                                  <div className="text-blue-400 font-bold text-lg">{item.price}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  // TODO: Implementar carga de imagen
                                  alert('Función de carga de imagen próximamente...');
                                }}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors"
                              >
                                📷 Imagen
                              </button>
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setShowAddItem(true);
                                }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm transition-colors"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-lg font-medium">No hay productos en esta categoría</p>
                      <p className="text-sm">Haz clic en "Agregar Producto" para comenzar</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón continuar */}
        <div className="mt-8 text-center">
          <button
            onClick={continuarPersonalizacion}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors text-lg"
          >
            Continuar a Personalización →
          </button>
        </div>
      </div>

      {/* Modal agregar/editar producto */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Producto' : 'Agregar Producto'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const item: MenuItem = {
                id: editingItem?.id || '',
                name: formData.get('name') as string,
                price: formData.get('price') as string,
                description: formData.get('description') as string,
                category: selectedCategory || categories[0]?.id
              };
              handleSaveItem(item);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={editingItem?.name || ''}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Milanesa con papas"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Precio *</label>
                  <input
                    name="price"
                    type="text"
                    required
                    defaultValue={editingItem?.price || ''}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: $9000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingItem?.description || ''}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción opcional del plato..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddItem(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  {editingItem ? 'Guardar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-2 mb-2">
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-green-500 rounded"></div>
            <div className="flex-1 h-2 bg-blue-500 rounded"></div>
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