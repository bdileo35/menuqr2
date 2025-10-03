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

export default function EditorV2() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuId, setMenuId] = useState<string>('');

  useEffect(() => {
    loadMenuFromAPI();
  }, []);

  const loadMenuFromAPI = async () => {
    try {
      console.log('🔍 Cargando menú desde API...');
      const response = await fetch('/api/menu/esquina-pompeya/items');
      const data = await response.json();
      
      if (data.success && data.menu) {
        setMenuId(data.menu.id);
        
        const formattedCategories: Category[] = data.menu.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          items: cat.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: `$${item.price}`,
            description: item.description || '',
            category: cat.id
          }))
        }));
        
        setCategories(formattedCategories);
        setSelectedCategory(formattedCategories[0]?.id || null);
        console.log('✅ Menú cargado:', formattedCategories);
      }
    } catch (error) {
      console.error('❌ Error cargando menú:', error);
      alert('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (item: MenuItem) => {
    try {
      const priceNumber = item.price.replace(/[^0-9.]/g, '');
      
      if (editingItem) {
        // Actualizar item existente
        const response = await fetch('/api/menu/esquina-pompeya/items', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: item.id,
            name: item.name,
            price: priceNumber,
            description: item.description
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setCategories(prev => prev.map(cat => ({
            ...cat,
            items: cat.items.map(i => i.id === item.id ? item : i)
          })));
          alert('✅ Producto actualizado!');
        }
      } else {
        // Crear nuevo item
        const response = await fetch('/api/menu/esquina-pompeya/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            price: priceNumber,
            description: item.description,
            categoryId: selectedCategory
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          const newItem = {
            id: data.item.id,
            name: data.item.name,
            price: `$${data.item.price}`,
            description: data.item.description || '',
            category: selectedCategory || categories[0]?.id
          };
          
          setCategories(prev => prev.map(cat => 
            cat.id === selectedCategory 
              ? { ...cat, items: [...cat.items, newItem] }
              : cat
          ));
          alert('✅ Producto agregado!');
        }
      }
      
      setEditingItem(null);
      setShowAddItem(false);
    } catch (error) {
      console.error('Error guardando item:', error);
      alert('❌ Error al guardar el producto');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const response = await fetch(`/api/menu/esquina-pompeya/items?itemId=${itemId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCategories(prev => prev.map(cat => ({
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        })));
        alert('✅ Producto eliminado!');
      }
    } catch (error) {
      console.error('Error eliminando item:', error);
      alert('❌ Error al eliminar el producto');
    }
    
    setActiveMenu(null);
  };

  const handleSaveMenu = () => {
    // Ya no necesitamos guardar porque cada cambio se guarda automáticamente
    alert('✅ Todos los cambios se guardan automáticamente!');
    router.push('/carta-menu');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando editor...</p>
        </div>
      </div>
    );
  }

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <DevBanner />
      
      {/* Header Compacto */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Editor v2</h1>
              <p className="text-xs text-gray-400">Mobile-optimized</p>
            </div>
            
            {/* Botones compactos */}
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/carta-menu')}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                👁️ Vista
              </button>
              <button
                onClick={handleSaveMenu}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                💾 Guardar
              </button>
            </div>
          </div>

          {/* Tabs de categorías - Scroll horizontal */}
          <div className="flex gap-2 overflow-x-auto mt-3 pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.items.length})</span>
              </button>
            ))}
            <button
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 whitespace-nowrap text-sm"
            >
              + Categoría
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-3 py-4">
        
        {/* Header de Categoría */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{currentCategory?.name}</h2>
            <p className="text-sm text-gray-400">{currentCategory?.items.length || 0} productos</p>
          </div>
          <button
            onClick={() => setShowAddItem(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Producto
          </button>
        </div>

        {/* Lista de Productos - Cards Compactos */}
        <div className="space-y-2">
          {currentCategory?.items.map(item => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center justify-between">
                {/* Info del producto */}
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
                    <span className="text-blue-400 font-bold text-sm whitespace-nowrap">{item.price}</span>
                  </div>
                  {item.description && (
                    <p className="text-gray-400 text-xs truncate">{item.description}</p>
                  )}
                </div>

                {/* Menú de 3 puntos */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400 text-xl leading-none">⋮</span>
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === item.id && (
                    <>
                      {/* Overlay para cerrar al clickear afuera */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveMenu(null)}
                      />
                      
                      {/* Menu flotante */}
                      <div className="absolute right-0 top-full mt-1 bg-gray-700 rounded-lg shadow-xl border border-gray-600 overflow-hidden z-20 min-w-[160px]">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddItem(true);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                          <span>✏️</span> Editar
                        </button>
                        <button
                          onClick={() => {
                            // Duplicar
                            const duplicated = { ...item, id: `item-${Date.now()}`, name: `${item.name} (copia)` };
                            setCategories(prev => prev.map(cat => 
                              cat.id === selectedCategory 
                                ? { ...cat, items: [...cat.items, duplicated] }
                                : cat
                            ));
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                          <span>📋</span> Duplicar
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                          <span>📸</span> Imagen
                        </button>
                        <div className="border-t border-gray-600"></div>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-900/30 transition-colors flex items-center gap-2"
                        >
                          <span>🗑️</span> Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay productos */}
        {currentCategory?.items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg mb-4">No hay productos en esta categoría</p>
            <button
              onClick={() => setShowAddItem(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              + Agregar Primer Producto
            </button>
          </div>
        )}
      </div>

      {/* Modal Agregar/Editar Producto */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-gray-800 w-full sm:max-w-lg sm:rounded-t-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={() => {
                  setShowAddItem(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Formulario */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const item: MenuItem = {
                  id: editingItem?.id || `item-${Date.now()}`,
                  name: formData.get('name') as string,
                  price: formData.get('price') as string,
                  description: formData.get('description') as string,
                  category: selectedCategory || categories[0]?.id
                };
                handleSaveItem(item);
              }}
              className="p-4 space-y-4"
            >
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                  placeholder="Ej: Milanesa con papas fritas"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio *
                </label>
                <input
                  type="text"
                  name="price"
                  defaultValue={editingItem?.price}
                  required
                  placeholder="Ej: $9000"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description}
                  rows={3}
                  placeholder="Breve descripción del plato..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddItem(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingItem ? 'Guardar Cambios' : 'Agregar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
