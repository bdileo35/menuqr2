"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  address: string;
  phone: string;
  categories: MenuCategory[];
}

export default function HomePage() {
  const router = useRouter();
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

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
            address: data.menu.contactAddress || 'Av. Fernández de la Cruz 1100',
            phone: data.menu.contactPhone || '+54 11 1234-5678',
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
          console.log('📋 Total categorías:', restaurantInfo.categories.length);
          console.log('📋 Total productos:', restaurantInfo.categories.reduce((total, cat) => total + cat.items.length, 0));
        } else {
          throw new Error('No se pudo cargar el menú');
        }
      } catch (error) {
        console.error('❌ Error cargando menú desde API:', error);
        
        const savedMenu = localStorage.getItem('editor-menu-data');
        const setupData = localStorage.getItem('setup-comercio-data');
        
        if (savedMenu && setupData) {
          const menuData = JSON.parse(savedMenu);
          const setup = JSON.parse(setupData);
          
          const restaurantInfo: RestaurantData = {
            restaurantName: setup.nombreComercio || 'Mi Restaurante',
            address: setup.direccion || 'Dirección no especificada',
            phone: setup.telefono || 'Teléfono no especificado', 
            categories: menuData.categories || menuData || []
          };
          
          setMenuData(restaurantInfo);
          console.log('⚠️ Usando datos de localStorage como fallback');
        } else {
          console.error('❌ No hay datos disponibles');
          setMenuData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadMenuFromAPI();
  }, []);

  // Función para filtrar categorías por término de búsqueda
  const filterCategories = (categories: MenuCategory[]) => {
    if (!searchTerm.trim()) return categories;
    
    const term = searchTerm.toLowerCase();
    return categories.filter(category => 
      category.name.toLowerCase().includes(term) ||
      category.items.some(item => 
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      )
    );
  };

  // Función para filtrar platos por término de búsqueda
  const filterItems = (items: MenuItem[]) => {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando panel de control...</p>
          <p className="text-gray-400 text-sm mt-2">Preparando tu menú personalizado</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      
      {/* Header principal */}
      <div className={`border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo y título */}
            <div className="flex items-center gap-4">
              <img 
                src="/demo-images/Logo.jpg" 
                alt="Logo Esquina Pompeya"
                className="w-16 h-16 rounded-lg object-contain"
              />
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Panel de Control
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Esquina Pompeya - Gestión de Menú
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              {/* Buscador */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                  showSearch
                    ? 'bg-purple-600 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-purple-400' 
                      : 'bg-gray-200 hover:bg-gray-300 text-purple-600'
                }`}
                title="Buscar"
              >
                🔎
              </button>
              
              {/* Toggle modo oscuro/claro */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDarkMode ? '☀️' : '🌑'}
              </button>

              {/* Vista previa */}
              <button
                onClick={() => router.push('/carta-menu')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                👁️ Vista Previa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Input de búsqueda */}
      {showSearch && (
        <div className={`border-b transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar categorías y platos..."
                className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                    : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                }`}
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSearch(false);
                }}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel izquierdo: Categorías */}
          <div className={`rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b rounded-t-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Categorías
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
                  }`}>
                    {menuData ? filterCategories(menuData.categories).length : 0}
                  </span>
                  <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}>
                    🔍
                  </button>
                  <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isDarkMode 
                      ? 'bg-green-600 hover:bg-green-500 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}>
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {!menuData || filterCategories(menuData.categories).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No se encontraron categorías
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filterCategories(menuData.categories).map((category, index) => (
                    <div 
                      key={category.id || index}
                      className={`p-3 rounded-lg transition-colors duration-300 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <h3 className={`font-medium text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {category.name}
                      </h3>
                      <p className={`text-xs mt-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {category.items.length} platos
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho: Platos */}
          <div className={`lg:col-span-2 rounded-lg border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`px-4 py-3 border-b rounded-t-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Platos
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {menuData ? menuData.categories.reduce((total, cat) => total + filterItems(cat.items).length, 0) : 0}
                  </span>
                  <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}>
                    🔍
                  </button>
                  <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isDarkMode 
                      ? 'bg-green-600 hover:bg-green-500 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}>
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {!menuData ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🍽️</div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No hay datos del menú
                  </p>
                  <button 
                    onClick={() => router.push('/setup-comercio')}
                    className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Configurar Menú →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filterCategories(menuData.categories).map((category, index) => (
                    <div key={category.id || index}>
                      <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {category.name}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filterItems(category.items).map((item, itemIndex) => (
                          <div 
                            key={item.id || itemIndex}
                            className={`p-3 rounded-lg border transition-colors duration-300 ${
                              item.isAvailable === false 
                                ? 'opacity-50 border-gray-400 bg-gray-500/20' 
                                : isDarkMode 
                                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className={`font-medium text-sm transition-colors duration-300 ${
                                  item.isAvailable === false 
                                    ? 'text-gray-400' 
                                    : isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className={`text-xs mt-1 transition-colors duration-300 ${
                                    item.isAvailable === false 
                                      ? 'text-gray-500' 
                                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded transition-colors duration-300 ${
                                  item.isAvailable === false 
                                    ? 'text-gray-400 bg-gray-600 border-gray-400' 
                                    : isDarkMode 
                                      ? 'text-blue-300 bg-gray-800 border-blue-500' 
                                      : 'text-blue-700 bg-blue-50 border-blue-300'
                                }`}>
                                  {item.price}
                                </span>
                                
                                {item.isAvailable === false && (
                                  <span className="text-xs font-bold px-2 py-1 rounded bg-red-200 text-gray-600 border border-red-300">
                                    AGOTADO
                                  </span>
                                )}
                                
                                <input
                                  type="checkbox"
                                  checked={item.isAvailable !== false}
                                  onChange={() => {
                                    // TODO: Implementar toggle de disponibilidad
                                    console.log('Toggle disponibilidad:', item.name);
                                  }}
                                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}