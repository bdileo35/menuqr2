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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchCategoryTerm, setSearchCategoryTerm] = useState('');
  const [showCategorySearch, setShowCategorySearch] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Cargar datos desde Prisma
  useEffect(() => {
    loadMenuFromAPI();
  }, []);

  // Inicializar estado de disponibilidad cuando se abre el modal
  useEffect(() => {
    if (showAddItem) {
      setIsAvailable(editingItem ? true : true); // TODO: Obtener de editingItem cuando esté en la API
    }
  }, [showAddItem, editingItem]);

  const loadMenuFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/menu/esquina-pompeya/items');
      const data = await response.json();
      
      if (data.success && data.menu) {
        const formattedCategories: Category[] = data.menu.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          items: cat.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: `$${item.price}`,
            description: item.description || '',
            category: cat.id,
            image: item.imageUrl || undefined,
            isAvailable: item.isAvailable
          }))
        }));
        
        setCategories(formattedCategories);
        setSelectedCategory(formattedCategories[0]?.id || null);
      }
    } catch (error) {
      console.error('Error cargando menú:', error);
      alert('Error al cargar el menú. Por favor recarga la página.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (item: MenuItem) => {
    try {
      setSaving(true);
      
      if (editingItem) {
        // Editar item existente - PUT
        const response = await fetch('/api/menu/esquina-pompeya/items', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: item.id,
            name: item.name,
            price: parseFloat(item.price.replace(/[^\d.]/g, '')),
            description: item.description || null
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Actualizar localmente
          setCategories(prev => prev.map(cat => ({
            ...cat,
            items: cat.items.map(i => i.id === item.id ? item : i)
          })));
          alert('✅ Producto actualizado');
        } else {
          throw new Error(data.error || 'Error al actualizar');
        }
      } else {
        // Agregar nuevo item - POST
        const response = await fetch('/api/menu/esquina-pompeya/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            price: parseFloat(item.price.replace(/[^\d.]/g, '')),
            description: item.description || null,
            categoryId: selectedCategory
          })
        });

        const data = await response.json();
        
        if (data.success && data.item) {
          // Agregar localmente con el ID real de la DB
          const newItem = {
            ...item,
            id: data.item.id,
            category: selectedCategory || categories[0]?.id
          };
          
          setCategories(prev => prev.map(cat => 
            cat.id === selectedCategory 
              ? { ...cat, items: [...cat.items, newItem] }
              : cat
          ));
          alert('✅ Producto agregado');
        } else {
          throw new Error(data.error || 'Error al agregar');
        }
      }
      
      setEditingItem(null);
      setShowAddItem(false);
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('❌ Error al guardar. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      setSaving(true);
      
      const response = await fetch(`/api/menu/esquina-pompeya/items?itemId=${itemId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        // Eliminar localmente
        setCategories(prev => prev.map(cat => ({
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        })));
        alert('✅ Producto eliminado');
      } else {
        throw new Error(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('❌ Error al eliminar. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const currentCategory = selectedCategory === 'ALL' 
    ? { 
        id: 'ALL', 
        name: 'Todas las Categorías', 
        items: categories.flatMap(cat => cat.items) 
      }
    : categories.find(cat => cat.id === selectedCategory);
  const totalItems = categories.reduce((total, cat) => total + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DevBanner />
      
      {/* Header - Compacto */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex justify-between items-center">
          <button 
            onClick={() => router.push('/scanner')}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium"
          >
            <span>←</span> Volver
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white">📝 Editor de Menú</h1>
            {saving && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                <span className="animate-pulse">●</span> Guardando
              </span>
            )}
          </div>

          <button 
            onClick={() => router.push('/carta-menu')}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all text-sm font-medium shadow-lg shadow-blue-600/30"
          >
            <span>👁️</span> Vista Previa
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-xl text-gray-400">Cargando menú desde la base de datos...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Layout: Categorías (30%) + Productos (70%) */}
      <div className="flex h-[calc(100vh-60px)] justify-center mt-4">
        <div className="flex w-[85%] max-w-5xl">
        
        {/* SIDEBAR IZQUIERDA - Categorías + Stats */}
        <div className="w-[30%] overflow-y-auto px-4 py-1 custom-scrollbar">
          
          {/* CARD CONTENEDORA PARA CATEGORÍAS */}
          <div className="bg-gray-700/50 rounded-xl border-2 border-gray-600 px-4 py-1">
          
          {/* Header Compacto: Stats + Todas + Nueva */}
          <div className="mb-4">
            <div className="flex items-center justify-between gap-2">
              
              {/* Stats - Click para ver TODAS */}
              <div className="group relative flex-1">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`w-full rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer transition-all ${
                    selectedCategory === 'ALL'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-bold ${selectedCategory === 'ALL' ? 'text-white' : 'text-gray-300'}`}>
                      Categorías
                    </span>
                    <span className={`text-xl font-bold ${selectedCategory === 'ALL' ? 'text-white' : 'text-green-400'}`}>
                      {categories.length}
                    </span>
                  </div>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Click para ver todas ({totalItems} productos)
                </div>
              </div>

              {/* Buscar en categorías */}
              <div className="group relative">
                <button
                  onClick={() => setShowCategorySearch(!showCategorySearch)}
                  className={`p-2.5 rounded-lg transition-all ${
                    showCategorySearch
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                  }`}
                  title="Buscar categoría"
                >
                  <span className="text-xl">🔍</span>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Buscar
                </div>
              </div>

              {/* Nueva Categoría */}
              <div className="group relative">
                <button
                  onClick={() => {
                    // TODO: Abrir modal de nueva categoría
                    alert('Modal para crear nueva categoría\n\nPróximamente con API de categorías 🚀');
                  }}
                  className="p-2.5 bg-green-600/80 hover:bg-green-600 rounded-lg transition-all text-white"
                  title="Agregar categoría"
                >
                  <span className="text-xl">+</span>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Nueva Categoría
                </div>
              </div>

            </div>
            
            {/* Input de búsqueda de categorías */}
            {showCategorySearch && (
              <div className="mt-3">
                <input
                  type="text"
                  value={searchCategoryTerm}
                  onChange={(e) => setSearchCategoryTerm(e.target.value)}
                  placeholder="Buscar categoría..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Lista de Categorías */}
          <div className="pt-2">
            <div className="space-y-1.5">
                {categories
                  .filter(cat => 
                    searchCategoryTerm === '' || 
                    cat.name.toLowerCase().includes(searchCategoryTerm.toLowerCase())
                  )
                  .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      selectedCategory === category.id 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="font-medium truncate">{category.name}</div>
                  </button>
                ))}
                
                {/* Mensaje si no hay resultados */}
                {categories.filter(cat => 
                  searchCategoryTerm === '' || 
                  cat.name.toLowerCase().includes(searchCategoryTerm.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className="text-sm">No se encontraron categorías</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          </div> {/* Cierre de la CARD CONTENEDORA PARA CATEGORÍAS */}

          {/* PANEL DERECHO - Lista de productos (70%) */}
          <div className="flex-1 overflow-y-auto px-4 py-1 custom-scrollbar">
            
          {/* CARD CONTENEDORA PARA PLATOS */}
          <div className="bg-gray-700/50 rounded-xl border-2 border-gray-600 px-4 py-1 h-full">
            {currentCategory && (
              <div>
                {/* Header compacto: Platos + Buscar + Nuevo */}
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-2">
                    
                    {/* Platos count */}
                    <div className="group relative flex-1">
                      <div className="bg-gray-700/50 rounded-lg px-3 py-2 flex items-center gap-2 cursor-help">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-gray-300 truncate">{currentCategory.name}</span>
                          <span className="text-xl font-bold text-blue-400">{currentCategory.items.length}</span>
                        </div>
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {currentCategory.items.length} productos
                      </div>
                    </div>

                    {/* Buscar */}
                    <div className="group relative">
                      <button
                        onClick={() => setShowSearch(!showSearch)}
                        className={`p-2.5 rounded-lg transition-all ${
                          showSearch
                            ? 'bg-yellow-600 text-white shadow-lg'
                            : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                        }`}
                        title="Buscar producto"
                      >
                        <span className="text-xl">🔍</span>
                      </button>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Buscar
                      </div>
                    </div>

                    {/* Nuevo producto */}
                    <div className="group relative">
                      <button
                        onClick={() => setShowAddItem(true)}
                        className="p-2.5 bg-green-600/80 hover:bg-green-600 rounded-lg transition-all text-white"
                        title="Agregar producto"
                      >
                        <span className="text-xl">+</span>
                      </button>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Nuevo Producto
                      </div>
                    </div>

                  </div>

                  {/* Input de búsqueda (aparece al hacer clic en 🔍) */}
                  {showSearch && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre..."
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* Lista de productos */}
                <div className="pt-2">{currentCategory.items.length > 0 ? (
                    <div className="space-y-3">
                      {currentCategory.items
                        .filter(item => {
                          if (searchTerm === '') return true;
                          const search = searchTerm.toLowerCase();
                          return item.name.toLowerCase().includes(search) || 
                                 (item.description && item.description.toLowerCase().includes(search));
                        })
                        .map((item) => (
                        <div 
                          key={item.id} 
                          className="bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors overflow-hidden"
                          onDoubleClick={() => {
                            setEditingItem(item);
                            setShowAddItem(true);
                          }}
                          title="Doble click para editar"
                        >
                          <div className="flex items-center h-16">
                            <div 
                              className="w-16 h-16 bg-gray-600 flex items-center justify-center hover:bg-gray-500 transition-colors flex-shrink-0"
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                alert('Función de carga de imagen próximamente...');
                              }}
                              title="Doble click para cambiar imagen"
                            >
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-gray-400 text-2xl">🍽️</span>
                              )}
                            </div>
                            
                            <div className="flex-1 px-4 min-w-0">
                              <h4 className="font-semibold text-white truncate">{item.name}</h4>
                            </div>
                            
                            <div className="px-4 flex items-center gap-3 flex-shrink-0">
                              <div className="text-blue-400 font-bold text-lg">{item.price}</div>
                              <label className="cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.isAvailable !== false}
                                  onChange={async (e) => {
                                    console.log('Checkbox clicked!', e.target.checked);
                                    const newAvailability = e.target.checked;
                                    
                                    try {
                                      console.log('Updating availability for item:', item.id, 'to:', newAvailability);
                                      
                                      const response = await fetch('/api/menu/esquina-pompeya/items', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          id: item.id,
                                          name: item.name,
                                          price: parseFloat(item.price.replace(/[^\d.]/g, '')),
                                          description: item.description || null,
                                          isAvailable: newAvailability
                                        })
                                      });
                                      
                                      console.log('API response status:', response.status);
                                      const data = await response.json();
                                      console.log('API response data:', data);
                                      
                                      if (!data.success) {
                                        throw new Error(data.error || 'Error al actualizar');
                                      }
                                      
                                      // Actualizar localmente solo si la API fue exitosa
                                      setCategories(prev => prev.map(cat => 
                                        cat.id === selectedCategory 
                                          ? {
                                              ...cat,
                                              items: cat.items.map(i => 
                                                i.id === item.id 
                                                  ? { ...i, isAvailable: newAvailability }
                                                  : i
                                              )
                                            }
                                          : cat
                                      ));
                                      
                                      console.log('✅ Disponibilidad actualizada exitosamente');
                                      
                                    } catch (error) {
                                      console.error('❌ Error actualizando disponibilidad:', error);
                                      alert('❌ Error al actualizar disponibilidad: ' + error.message);
                                    }
                                  }}
                                  className="w-6 h-6 rounded border-2 border-gray-400 bg-transparent checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                  title={item.isAvailable !== false ? 'Disponible' : 'Sin Stock'}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchTerm !== '' ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-lg font-medium">No se encontraron resultados</p>
                      <p className="text-sm mt-2">Intenta con otro término de búsqueda</p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-lg font-medium">No hay productos en esta categoría</p>
                      <p className="text-sm mt-2">Haz clic en "+" para agregar un producto</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div> {/* Cierre de la CARD CONTENEDORA PARA PLATOS */}
          
          </div>
        </div>
        </div> {/* Cierre del contenedor centrado */}
        </>
      )}

      {/* Modal agregar/editar producto */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            {/* Header con título y toggle disponibilidad */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Editar Producto' : 'Agregar Producto'}
              </h3>
              
              {/* Toggle Disponible/Sin Stock */}
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
                  isAvailable 
                    ? 'bg-green-600 hover:bg-green-500' 
                    : 'bg-red-600 hover:bg-red-500'
                }`}
                title="Click para cambiar disponibilidad"
              >
                <span>{isAvailable ? '✓' : '✕'}</span> 
                {isAvailable ? 'Disponible' : 'Sin Stock'}
              </button>
            </div>
            
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
              
              <div className="flex gap-3 mt-6">
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
                
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Estás seguro de eliminar este producto?')) {
                        handleDeleteItem(editingItem.id);
                        setShowAddItem(false);
                        setEditingItem(null);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                )}
                
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium"
                >
                  {editingItem ? 'Guardar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}