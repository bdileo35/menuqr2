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
  code?: string;
}

interface MenuCategory {
  id?: string;
  name: string;
  items: MenuItem[];
  code?: string;
}

interface RestaurantData {
  restaurantName: string;
  categories: MenuCategory[];
}

export default function Editor2() {
  const router = useRouter();

  // Función para generar código de categoría
  const getCategoryCode = (categoryName: string, index: number): string => {
    // Categorías fijas en orden específico
    const fixedCategories = [
      { name: 'Platos del Día', code: '01' },
      { name: 'Promociones', code: '02' },
      { name: 'Cocina', code: '03' },
      { name: 'Parrilla', code: '04' }
    ];
    
    // Buscar si es una categoría fija
    const fixedCategory = fixedCategories.find(cat => 
      categoryName.toLowerCase().includes(cat.name.toLowerCase())
    );
    
    if (fixedCategory) {
      return fixedCategory.code;
    }
    
    // Si no es fija, usar índice + 4 (después de las fijas)
    return String(index + 5).padStart(2, '0');
  };

  // Función para generar código de plato
  const getItemCode = (categoryCode: string, itemIndex: number): string => {
    return `${categoryCode}${String(itemIndex + 1).padStart(2, '0')}`;
  };
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [selectedCategoryForItem, setSelectedCategoryForItem] = useState<string>('');
  const [allCategoriesExpanded, setAllCategoriesExpanded] = useState(true);
  const [showMenuHamburguesa, setShowMenuHamburguesa] = useState(false);

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
        
        // Datos temporales para demo
        const tempData: RestaurantData = {
          restaurantName: 'Esquina Pompeya',
          categories: [
            {
              id: 'platos-dia',
              name: 'Platos del Día',
              items: [
                { id: '1', name: 'Riñoncitos al jerez c/ puré', price: '$9000', description: 'Deliciosos riñones en salsa jerez', isAvailable: true },
                { id: '2', name: 'Croquetas de carne c/ ensalada', price: '$9000', description: 'Croquetas caseras con ensalada fresca', isAvailable: true },
                { id: '3', name: 'Chupín de merluza c/ papa natural', price: '$10000', description: 'Pescado fresco con papas naturales', isAvailable: true },
                { id: '4', name: 'Pechuga rellena c/ f. españolas', price: '$12000', description: 'Pechuga rellena con papas españolas', isAvailable: true },
                { id: '5', name: 'Mejillones c/ fettuccinis', price: '$12000', description: 'Mejillones con pasta fresca', isAvailable: true },
                { id: '6', name: 'Vacío a la parrilla c/ fritas', price: '$14000', description: 'Corte premium con papas fritas', isAvailable: false },
                { id: '7', name: 'Peceto al verdeo c/ puré', price: '$15000', description: 'Carne tierna con puré de papas', isAvailable: true },
                { id: '8', name: 'Correntinos caseros a la Vangoli', price: '$13000', description: 'Especialidad casera con salsa especial', isAvailable: true }
              ]
            },
            {
              id: 'promos',
              name: 'Promos',
              items: [
                { id: '9', name: 'Milanesa Completa', price: '$2500', description: 'Milanesa con papas, huevo y ensalada', isAvailable: true },
                { id: '10', name: 'Vacio con Papas', price: '$3000', description: 'Corte de vacío con papas fritas', isAvailable: true },
                { id: '11', name: 'Rabas', price: '$2800', description: 'Rabas frescas con limón', isAvailable: true }
              ]
            },
            {
              id: 'cocina',
              name: 'Cocina',
              items: [
                { id: '12', name: 'Albóndigas con papas', price: '$2200', description: 'Albóndigas caseras con papas', isAvailable: true },
                { id: '13', name: 'Pollo al horno', price: '$1800', description: 'Pollo entero al horno', isAvailable: true }
              ]
            }
          ]
        };
        
        setMenuData(tempData);
        
        // Expandir todas las categorías por defecto
        const initialExpanded: {[key: string]: boolean} = {};
        tempData.categories.forEach(cat => {
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

  // Estados para el modal de plato
  const [modalData, setModalData] = useState({
    name: '',
    code: '',
    price: '',
    description: '',
    categoryId: '',
    imageFile: null as File | null,
    imagePreview: '',
    isAvailable: true  // ✅ AGREGAR ESTADO DISPONIBLE/AGOTADO
  });

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

  // Estados para interacciones táctiles
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);

  // Abrir modal para editar plato
  const openEditPlateModal = (item: MenuItem, categoryId: string) => {
    setModalData({
      name: item.name,
      code: item.code || '',
      price: item.price,
      description: item.description || '',
      categoryId: categoryId,
      imageFile: null,
      imagePreview: '',
      isAvailable: item.isAvailable ?? true  // ✅ INCLUIR ESTADO DISPONIBLE
    });
    setEditingItem(item);
    setShowAddItem(true);
  };

  // Abrir modal para editar categoría
  const openEditCategoryModal = (category: MenuCategory) => {
    // TODO: Implementar modal de edición de categoría
    console.log('Editando categoría:', category.name);
    alert(`Editando categoría: ${category.name} (${category.code})`);
  };

  // Manejar inicio de toque (móvil)
  const handleTouchStart = (e: React.TouchEvent, action: 'category' | 'item', data: any) => {
    e.preventDefault();
    setTouchStartTime(Date.now());
    
    const timer = setTimeout(() => {
      // Sostener por más de 500ms
      if (action === 'category') {
        openEditCategoryModal(data);
      } else if (action === 'item') {
        openEditPlateModal(data.item, data.categoryId);
      }
    }, 500);
    
    setTouchTimer(timer);
  };

  // Manejar fin de toque (móvil)
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
    
    const touchDuration = Date.now() - touchStartTime;
    
    // Si fue un toque corto, no hacer nada (evitar conflicto con doble click)
    if (touchDuration < 500) {
      return;
    }
  };

  // Manejar doble click (PC)
  const handleDoubleClick = (e: React.MouseEvent, action: 'category' | 'item', data: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (action === 'category') {
      openEditCategoryModal(data);
    } else if (action === 'item') {
      openEditPlateModal(data.item, data.categoryId);
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModalData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Manejar cambio de categoría y generar código automáticamente
  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = menuData?.categories.find(cat => (cat.id || cat.name) === categoryId);
    if (selectedCategory) {
      // Generar código automáticamente
      const categoryCode = selectedCategory.code || '01';
      const nextItemNumber = (selectedCategory.items.length + 1).toString().padStart(2, '0');
      const generatedCode = `${categoryCode}${nextItemNumber}`;
      
      setModalData(prev => ({
        ...prev,
        categoryId: categoryId,
        code: generatedCode
      }));
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
      
      {/* Botón modo claro/oscuro en vértice superior derecho absoluto */}
                <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-2 right-2 w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg z-50 ${
          isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
      >
        {isDarkMode ? '☀️' : '🌙'}
                </button>
      
      {/* Header Reorganizado - 2 Líneas */}
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 pt-1 pb-2">
          
          {/* LÍNEA 1: Título Panel de Control */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
                <button
                onClick={() => setShowMenuHamburguesa(!showMenuHamburguesa)}
                className={`p-2 border rounded-lg transition-all ${
                  isDarkMode 
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white' 
                    : 'border-blue-300 hover:bg-blue-100 text-blue-700'
                }`}
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

            {/* Botón Carta Menu - Solo ícono (alineado con sol) */}
                <button
              onClick={() => router.push('/carta-menu')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              }`}
              title="Ver Carta Menu"
            >
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
            
            {/* Botones unificados: Buscar + Agregar + Expandir - Buscador siempre activo */}
            <div className="flex items-center justify-end gap-3">
              {/* 1. Buscador siempre activo */}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className={`px-2 py-1 text-xs rounded-lg transition-colors duration-300 w-24 ${
                    isDarkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                      : 'bg-white border border-blue-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                  }`}
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`w-6 h-6 flex items-center justify-center transition-colors text-xs ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>

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
                className={`w-9 h-9 flex items-center justify-center transition-colors text-lg ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
                title={allCategoriesExpanded ? 'Contraer todas' : 'Expandir todas'}
              >
                {allCategoriesExpanded ? '▲' : '▼'}
              </button>
            </div>
          </div>
                      </div>
                    </div>

      {/* Menu Hamburguesa Desplegable */}
      {showMenuHamburguesa && (
        <div className="fixed top-16 left-4 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg min-w-64">
          <div className="p-2">
            <button 
              onClick={() => router.push('/datos-comercio')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              📋 Datos del comercio
            </button>
            <button 
              onClick={() => router.push('/generar-menu')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              📝 Generar menú (TXT/Scanner/Manual)
            </button>
            <button 
              onClick={() => router.push('/qr-opciones')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              🖨️ Opciones QR (Imprimir/Compartir/Probar)
            </button>
            <button 
              onClick={() => router.push('/scanner')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              📷 Scanner OCR
            </button>
                      <button
              onClick={() => {
                // TODO: Implementar configuraciones
                alert('Configuraciones próximamente');
              }}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-blue-100 text-blue-700'
              }`}
            >
              ⚙️ Configuraciones
                      </button>
                      </div>
                    </div>
      )}

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Lista de Categorías */}
        {menuData.categories
          .filter(category => {
            // Filtrar categorías que contengan platos según el término de búsqueda
            if (searchTerm && filterItems(category.items).length === 0) {
              return false;
            }
            return true;
          })
          .map((category) => {
          const categoryId = category.id || category.name;
          const isExpanded = expandedCategories[categoryId];
          const filteredItems = filterItems(category.items);
          
          return (
            <div 
              key={categoryId}
              className={`mb-4 rounded-xl border-2 transition-colors duration-300 overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-100 border-blue-400'
              }`}
            >
              {/* Header de Categoría - Compacto como carta */}
              <div 
                className={`px-4 py-2 cursor-pointer transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-blue-100 hover:bg-blue-200'
                }`}
                onClick={() => toggleCategory(categoryId)}
                onTouchStart={(e) => handleTouchStart(e, 'category', category)}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={(e) => handleDoubleClick(e, 'category', category)}
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
                  <span className="text-xs text-gray-400 ml-2">✏️</span>
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
                      className={`flex items-center transition-opacity duration-300 py-2 border-b ${
                        item.isAvailable === false 
                          ? 'opacity-50 cursor-not-allowed border-gray-600' 
                          : 'hover:opacity-90 cursor-pointer border-gray-700'
                      }`}
                      onClick={() => item.isAvailable !== false && setEditingItem(item) && setShowAddItem(true)}
                      onTouchStart={(e) => item.isAvailable !== false && handleTouchStart(e, 'item', { item, categoryId })}
                      onTouchEnd={handleTouchEnd}
                      onDoubleClick={(e) => item.isAvailable !== false && handleDoubleClick(e, 'item', { item, categoryId })}
                    >
                      {/* Imagen sin marco */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-3">
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
                            
                      {/* Contenido sin marco */}
                      <div className="flex-1 flex items-center justify-between">
                        
                        {/* Texto del plato */}
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm leading-tight transition-colors duration-300 ${
                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {category.name.includes('Platos del Día') && (
                              <span className="text-yellow-400 mr-1">⭐</span>
                            )}
                            {item.name}
                            <span className="text-xs text-gray-400 ml-2">✏️</span>
                          </h4>
                            </div>
                            
                        {/* Precio sin marco */}
                        <div className="flex items-center gap-2">
                          
                          {/* Precio sin marco */}
                          <span className={`text-sm font-bold transition-colors duration-300 ${
                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : isDarkMode 
                                ? 'text-blue-300' 
                                : 'text-blue-600'
                          }`}>
                            {item.price}
                          </span>
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
                  setModalData({
                    name: '',
                    code: '',
                    price: '',
                    description: '',
                    categoryId: '',
                    imageFile: null,
                    imagePreview: '',
                    isAvailable: true
                  });
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
                code: modalData.code,
                isAvailable: modalData.isAvailable  // ✅ USAR ESTADO DEL MODAL
              };
              handleSaveItem(item);
            }}>
              <div className="space-y-4">
                {/* Foto + Código + Precio en layout horizontal */}
                <div className="flex gap-4">
                  {/* Cuadro de imagen - 40% ancho */}
                  <div className="w-[40%]">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Foto</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        capture="camera"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageInput"
                      />
                      <label
                        htmlFor="imageInput"
                        className="w-full h-24 bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        {modalData.imagePreview ? (
                          <img 
                            src={modalData.imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 text-2xl">📷</span>
                        )}
                      </label>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📷</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Toca para tomar foto o seleccionar</p>
                  </div>
                  
                  {/* Código + Precio al lado de la foto */}
                  <div className="flex-1 space-y-3">
                    {/* Código - label e input en misma línea */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Código:</label>
                      <input
                        type="text"
                        value={modalData.code}
                        readOnly
                        className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded text-gray-300 cursor-not-allowed text-sm"
                        placeholder="Se genera automáticamente"
                      />
                    </div>
                    <p className="text-xs text-gray-400">El código se genera al seleccionar categoría</p>
                    
                    {/* Precio */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Precio:</label>
                      <input
                        name="price"
                        type="text"
                        required
                        value={modalData.price}
                        onChange={(e) => setModalData(prev => ({ ...prev, price: e.target.value }))}
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Ej: $9000"
                      />
                    </div>
                  </div>
                </div>

                {/* Combo de categorías */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
                  <select
                    name="category"
                    required
                    value={modalData.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {menuData?.categories.map((category) => (
                      <option key={category.id || category.name} value={category.id || category.name}>
                        {category.name} ({category.code})
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
                    value={modalData.name}
                    onChange={(e) => setModalData(prev => ({ ...prev, name: e.target.value }))}
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
                    value={modalData.description}
                    onChange={(e) => setModalData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción opcional del plato..."
                  />
                </div>

                {/* Estado Disponible/Agotado */}
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Estado del plato</label>
                    <p className="text-xs text-gray-400 mt-1">
                      {modalData.isAvailable ? '✅ Disponible para pedidos' : '❌ Agotado - No disponible'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      modalData.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        modalData.isAvailable ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
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