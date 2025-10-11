'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDemoMenuData } from '@/lib/demo-data';

interface MenuItem {
  id?: string;
  name: string;
  price: string;
  description?: string;
  isAvailable?: boolean;
}

interface MenuCategory {
  id?: string;
  name: string;
  items: MenuItem[];
}

interface RestaurantData {
  restaurantName: string;
  categories: MenuCategory[];
}

export default function Editor2() {
  const router = useRouter();
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategoryForItem, setSelectedCategoryForItem] = useState<string>('');
  const [allCategoriesExpanded, setAllCategoriesExpanded] = useState(true);

  // Cargar datos desde API
  useEffect(() => {
    const loadMenuFromAPI = async () => {
      console.log('🔍 Cargando menú desde la base de datos...');
      
      try {
        const response = await fetch('/api/menu/esquina-pompeya');
        const data = await response.json();
        
        if (data.success && data.menu) {
          console.log('✅ Menú cargado desde API:', data.menu);
          
          const restaurantInfo: RestaurantData = {
            restaurantName: data.menu.restaurantName,
            categories: data.menu.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              items: cat.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: `$${item.price}`,
                description: item.description,
                isAvailable: item.isAvailable
              }))
            }))
          };
          
          setMenuData(restaurantInfo);
          
          // Expandir todas las categorías por defecto
          const initialExpanded: {[key: string]: boolean} = {};
          restaurantInfo.categories.forEach(cat => {
            initialExpanded[cat.id || cat.name] = true;
          });
          setExpandedCategories(initialExpanded);
          
        } else {
          throw new Error('No se pudo cargar el menú');
        }
      } catch (error) {
        console.error('❌ Error cargando menú desde API:', error);
        
        
        // Fallback final: usar datos de demo compartidos
        const demoData = getDemoMenuData();
        setMenuData(demoData);
        
        // Expandir todas las categorías por defecto
        const initialExpanded: {[key: string]: boolean} = {};
        demoData.categories.forEach(cat => {
          initialExpanded[cat.id || cat.name] = true;
        });
        setExpandedCategories(initialExpanded);
        
      } finally {
        setLoading(false);
      }
    };

    loadMenuFromAPI();
  }, []);

  // Función para filtrar platos por término de búsqueda
  const filterItems = (items: MenuItem[]) => {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  };

  // Toggle expandir/colapsar categoría
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Toggle expandir/contraer TODAS las categorías
  const toggleAllCategories = () => {
    const newExpandedState = !allCategoriesExpanded;
    setAllCategoriesExpanded(newExpandedState);
    
    if (menuData?.categories) {
      const newExpandedCategories: {[key: string]: boolean} = {};
      menuData.categories.forEach(cat => {
        newExpandedCategories[cat.id || cat.name] = newExpandedState;
      });
      setExpandedCategories(newExpandedCategories);
    }
  };

  // Guardar item
  const handleSaveItem = async (item: MenuItem) => {
    try {
      setSaving(true);
      
      if (editingItem) {
        // TODO: Implementar actualización via API
        console.log('Actualizando item:', item);
        alert('✅ Producto actualizado (demo)');
      } else {
        // TODO: Implementar creación via API
        console.log('Creando item:', item);
        alert('✅ Producto agregado (demo)');
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

  // Eliminar item
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      setSaving(true);
      // TODO: Implementar eliminación via API
      console.log('Eliminando item:', itemId);
      alert('✅ Producto eliminado (demo)');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('❌ Error al eliminar. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando editor...</p>
          <p className="text-gray-400 text-sm mt-2">Preparando tu menú</p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">⚠️ No hay datos del menú</h1>
          <p className="text-gray-400 mb-6">Completa el proceso de configuración primero</p>
          <button 
            onClick={() => router.push('/setup-comercio')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Ir a Configuración →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      
      {/* Header Reorganizado - 2 Líneas */}
      <div className={`border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-2">
          
          {/* LÍNEA 1: Título Panel de Control */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  // TODO: Implementar menú hamburguesa
                  alert('Menú hamburguesa:\n\n• Datos del comercio\n• Subir listado TXT\n• Imprimir QR\n• Escanear QR\n• Configuraciones');
                }}
                className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all text-gray-300 hover:text-white"
                title="Menú de funciones"
              >
                <div className="flex flex-col gap-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </button>
              <h1 className="text-xl font-bold">📝 Panel de Control</h1>
              {saving && (
                <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  <span className="animate-pulse">●</span>
                  Guardando...
                </span>
              )}
            </div>
            
            {/* Botón Carta Menu + Ojo - Todo dentro del botón */}
            <button 
              onClick={() => router.push('/carta-menu')}
              className={`w-[120px] h-9 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              }`}
              title="Ver Carta Menu"
            >
              <span className="font-medium text-sm">Carta Menu</span>
              <span className="text-lg">👁️</span>
            </button>
          </div>

          {/* LÍNEA 2: Configuración de Categorías + Funciones */}
          <div className="flex items-center justify-between">
            {/* Info Categorías */}
            <div className="flex items-center gap-2">
              <span className="text-lg">📂</span>
              <span className="font-medium">
                Categorías ({menuData?.categories.length || 0})
              </span>
            </div>

            {/* Botones unificados: Buscar + Agregar + Expandir - Sin fondo ni marco */}
            <div className="flex items-center justify-end gap-3">
              {/* 1. Buscador con animación desenrollable */}
              {showSearch ? (
                <div className="flex items-center gap-1 animate-in slide-in-from-right duration-300">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className={`px-2 py-1 text-xs rounded-lg transition-colors duration-300 w-24 ${
                      isDarkMode 
                        ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                        : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                    }`}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearch(false);
                      setSearchTerm('');
                    }}
                    className="w-6 h-6 flex items-center justify-center transition-colors text-xs text-gray-400 hover:text-gray-300"
                    title="Cerrar búsqueda"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-9 h-9 flex items-center justify-center transition-colors text-lg text-gray-400 hover:text-gray-300"
                  title="Buscar platos"
                >
                  🔎
                </button>
              )}

              {/* 2. Botón Agregar - Sin fondo ni marco */}
              <button
                onClick={() => setShowAddCategory(true)}
                className="w-9 h-9 flex items-center justify-center transition-colors text-lg text-green-400 hover:text-green-300"
                title="Agregar categoría"
              >
                +
              </button>

              {/* 3. Botón Expandir/Contraer TODAS las categorías */}
              <button
                onClick={toggleAllCategories}
                className="w-9 h-9 flex items-center justify-center transition-colors text-lg text-gray-400 hover:text-gray-300"
                title={allCategoriesExpanded ? 'Contraer todas' : 'Expandir todas'}
              >
                {allCategoriesExpanded ? '▲' : '▼'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Lista de Categorías */}
        {menuData.categories.map((category) => {
          const categoryId = category.id || category.name;
          const isExpanded = expandedCategories[categoryId];
          const filteredItems = filterItems(category.items);
          
          return (
            <div 
              key={categoryId}
              className={`mb-4 rounded-xl border-2 transition-colors duration-300 overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Header de Categoría */}
              <div 
                className={`p-3 cursor-pointer transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => toggleCategory(categoryId)}
              >
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 pl-3">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    isDarkMode 
                      ? 'bg-blue-600 text-blue-100' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {filteredItems.length}
                  </span>
                </div>
                  <div className="flex items-center justify-end gap-3">
                    {/* 1. Botón Lupa (placeholder para futura funcionalidad) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implementar búsqueda específica en esta categoría
                        alert('Búsqueda en ' + category.name + ' próximamente...');
                      }}
                      className="w-9 h-9 flex items-center justify-center transition-colors text-lg text-gray-400 hover:text-gray-300"
                      title="Buscar en esta categoría"
                    >
                      🔎
                    </button>
                    
                    {/* 2. Botón Agregar - Sin fondo ni marco */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Pre-seleccionar la categoría actual
                        setSelectedCategoryForItem(categoryId);
                        setEditingItem(null); // Asegurar que es un nuevo item
                        setShowAddItem(true);
                      }}
                      className="w-9 h-9 flex items-center justify-center transition-colors text-lg text-green-400 hover:text-green-300"
                      title="Agregar plato a esta categoría"
                    >
                      +
                    </button>
                    
                    {/* 3. Triangulito de expandir/colapsar esta categoría */}
                    <span 
                      className="text-lg cursor-pointer text-gray-400 hover:text-gray-300 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(categoryId);
                      }}
                      title={isExpanded ? 'Contraer categoría' : 'Expandir categoría'}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items de la Categoría */}
              {isExpanded && (
                <div className="p-3 space-y-2">
                  {filteredItems.map((item, itemIndex) => (
                    <div 
                      key={item.id || itemIndex}
                      className={`flex items-center transition-opacity duration-300 h-10 ${
                        item.isAvailable === false 
                          ? 'opacity-50' 
                          : 'hover:opacity-90 cursor-pointer'
                      }`}
                      onClick={() => item.isAvailable !== false && setEditingItem(item) && setShowAddItem(true)}
                    >
                      {/* Imagen */}
                      <div className={`w-8 h-8 rounded-l-lg overflow-hidden flex-shrink-0 border-2 border-r-0 ${
                        item.isAvailable === false 
                          ? 'border-gray-400' 
                          : isDarkMode ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        <img 
                          src={(() => {
                            const platosImages = ['/demo-images/albondigas.jpg', '/demo-images/rabas.jpg', '/demo-images/IMG-20250926-WA0005.jpg'];
                            return platosImages[itemIndex % platosImages.length];
                          })()}
                          alt={item.name}
                          className={`w-full h-full object-cover ${
                            item.isAvailable === false ? 'grayscale' : ''
                          }`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span class="text-xs">🍽️</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                      
                      {/* Contenido + Precio MERGED */}
                      <div className={`flex-1 flex items-center justify-between px-2 py-1 rounded-r-lg border-2 border-l-0 transition-colors duration-300 h-8 ${
                        item.isAvailable === false 
                          ? 'border-gray-400 bg-gray-500/20' 
                          : isDarkMode 
                            ? 'border-gray-600 bg-gray-700/50' 
                            : 'border-gray-200 bg-gray-50'
                      }`}>
                        
                        {/* Texto del plato */}
                        <div className="flex-1 pl-2">
                          <h4 className={`font-medium text-sm leading-tight transition-colors duration-300 ${
                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {category.name.includes('Platos del Día') && (
                              <span className="text-yellow-400 mr-1">⭐</span>
                            )}
                            {item.name}
                          </h4>
                        </div>

                        {/* Estado + Precio MERGED */}
                        <div className="flex items-center gap-1">
                          {/* Checkbox Disponible */}
                          <label className="cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isAvailable !== false}
                              onChange={(e) => {
                                e.stopPropagation();
                                // TODO: Actualizar disponibilidad via API
                                console.log('Toggle disponibilidad:', item.name, e.target.checked);
                              }}
                              className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent checked:bg-green-500 checked:border-green-500"
                              title={item.isAvailable !== false ? 'Disponible' : 'Sin Stock'}
                            />
                          </label>
                          
                          {/* Precio SIN MARCO - justificado a la derecha */}
                          <div className={`text-xs font-bold px-2 py-1 transition-colors duration-300 text-right ${
                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : isDarkMode 
                                ? 'text-blue-300' 
                                : 'text-blue-700'
                          }`}>
                            {item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredItems.length === 0 && searchTerm && (
                    <div className="text-center py-4 text-gray-500">
                      <p>No se encontraron resultados para "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal agregar/editar plato */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Editar Plato' : 'Agregar Plato'}
              </h3>
              <button
                onClick={() => {
                  setShowAddItem(false);
                  setEditingItem(null);
                  setSelectedCategoryForItem('');
                }}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300"
              >
                ✕
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
                category: formData.get('category') as string,
                isAvailable: true
              };
              handleSaveItem(item);
            }}>
              <div className="space-y-4">
                {/* Foto + Precio - Arriba a la izquierda */}
                <div className="flex gap-4">
                  {/* Cuadro de imagen - 30% ancho */}
                  <div className="w-[30%]">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Foto</label>
                    <div className="w-full h-24 bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
                      <span className="text-gray-400 text-2xl">📷</span>
                    </div>
                  </div>
                  
                  {/* Precio al lado de la foto */}
                  <div className="flex-1">
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
                </div>

                {/* Combo de categorías */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
                  <select
                    name="category"
                    required
                    defaultValue={editingItem?.category || selectedCategoryForItem}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {menuData?.categories.map((category) => (
                      <option key={category.id || category.name} value={category.id || category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Nombre del plato */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del plato *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={editingItem?.name || ''}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Milanesa con papas"
                  />
                </div>
                
                {/* Descripción */}
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
                    setSelectedCategoryForItem('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Estás seguro de eliminar este plato?')) {
                        handleDeleteItem(editingItem.id || '');
                        setShowAddItem(false);
                        setEditingItem(null);
                        setSelectedCategoryForItem('');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                    title="Eliminar plato"
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

      {/* Modal agregar categoría */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Agregar Categoría</h3>
              <button
                onClick={() => setShowAddCategory(false)}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const categoryName = formData.get('name') as string;
              
              // TODO: Implementar creación de categoría via API
              console.log('Creando categoría:', categoryName);
              alert('✅ Categoría "' + categoryName + '" creada (demo)');
              
              setShowAddCategory(false);
            }}>
              <div className="space-y-4">
                {/* Nombre de la categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de la categoría *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Platos del Día, Promos, Bebidas..."
                  />
                </div>
                
                {/* Descripción opcional */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descripción (opcional)</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción de la categoría..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors font-medium"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}