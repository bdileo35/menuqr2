'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DevBanner from '../components/DevBanner';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function EditorClean() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuFromAPI();
  }, []);

  const loadMenuFromAPI = async () => {
    try {
      console.log('🔍 Cargando menú desde API...');
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
            category: cat.id
          }))
        }));
        
        setCategories(formattedCategories);
        setSelectedCategory(formattedCategories[0]?.id || null);
        console.log('✅ Menú cargado:', formattedCategories.length, 'categorías');
      }
    } catch (error) {
      console.error('❌ Error cargando menú:', error);
      alert('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const handleDoubleClick = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    try {
      const priceNumber = editingItem.price.replace(/[^0-9.]/g, '');
      
      const response = await fetch('/api/menu/esquina-pompeya/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: editingItem.id,
          name: editingItem.name,
          price: priceNumber,
          description: editingItem.description
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCategories(prev => prev.map(cat => ({
          ...cat,
          items: cat.items.map(i => i.id === editingItem.id ? editingItem : i)
        })));
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error guardando:', error);
      alert('❌ Error al guardar');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
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
      }
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('❌ Error al eliminar');
    }
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const totalItems = categories.reduce((total, cat) => total + cat.items.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DevBanner />
      
      {/* Header Compacto */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
            >
              ← Volver
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold">Editor de Menú</h1>
            </div>

            <button
              onClick={() => router.push('/carta-menu')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm"
            >
              👁️ Vista Previa
            </button>
          </div>

          {/* Stats Compactos */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-gray-700 rounded-lg p-2 text-center">
              <span className="text-lg font-bold text-blue-400">{totalItems}</span>
              <span className="text-xs text-gray-300 ml-2">Productos</span>
            </div>
            <div className="bg-gray-700 rounded-lg p-2 text-center">
              <span className="text-lg font-bold text-green-400">{categories.length}</span>
              <span className="text-xs text-gray-300 ml-2">Categorías</span>
            </div>
          </div>

          {/* Tabs Categorías - Scroll horizontal */}
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
          </div>
        </div>
      </div>

      {/* Lista de Productos - Sin botones */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="mb-3 flex justify-between items-center">
          <h2 className="text-xl font-bold">{currentCategory?.name}</h2>
          <div className="text-sm text-gray-400">
            Doble click para editar
          </div>
        </div>

        <div className="space-y-2">
          {currentCategory?.items.map(item => (
            <div
              key={item.id}
              onDoubleClick={() => handleDoubleClick(item)}
              className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-all cursor-pointer border border-gray-700 hover:border-gray-600"
            >
              <div className="flex items-center gap-3">
                {/* Imagen placeholder */}
                <div className="w-12 h-12 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center text-gray-500">
                  🍽️
                </div>

                {/* Nombre y descripción */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm">{item.name}</h3>
                  {item.description && (
                    <p className="text-gray-400 text-xs truncate">{item.description}</p>
                  )}
                </div>

                {/* Precio a la derecha */}
                <div className="text-blue-400 font-bold text-base whitespace-nowrap">
                  {item.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentCategory?.items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📝</div>
            <p>No hay productos en esta categoría</p>
          </div>
        )}
      </div>

      {/* Modal de Edición (doble click) */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 w-full max-w-lg rounded-xl border border-gray-700">
            {/* Header */}
            <div className="border-b border-gray-700 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Editar Producto</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Formulario */}
            <div className="p-4 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio
                </label>
                <input
                  type="text"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleDeleteItem(editingItem.id)}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  🗑️ Eliminar
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  💾 Guardar
                </button>
              </div>
            </div>
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
