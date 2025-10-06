"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import DevBanner from '../components/DevBanner'; // Moved to _unused

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

export default function CartaMenuPage() {
  const router = useRouter();
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const loadMenuFromAPI = async () => {
      console.log('🔍 Cargando menú desde la base de datos...');
      
      try {
        // Llamar a la API para obtener el menú de Esquina Pompeya
        const response = await fetch('/api/menu/esquina-pompeya');
        const data = await response.json();
        
        if (data.success && data.menu) {
          console.log('✅ Menú cargado desde API:', data.menu);
          
          // Debug: verificar categoría "Platos del Día"
          const platosDelDia = data.menu.categories.find((cat: any) => cat.name.includes('Platos del Día'));
          if (platosDelDia) {
            console.log('🍽️ Platos del Día encontrados:', platosDelDia.items.length);
            platosDelDia.items.forEach((item: any, index: number) => {
              console.log(`${index + 1}. ${item.name} - Disponible: ${item.isAvailable}`);
            });
          }
          
          // Formatear datos para el componente
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
        
        // Fallback: intentar localStorage como backup
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
          <p className="text-white text-lg">Cargando carta digital...</p>
          <p className="text-gray-400 text-sm mt-2">Preparando tu menú personalizado</p>
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
      
      {/* <DevBanner /> */} {/* Moved to _unused */}
      
      {/* Header con info del restaurante - COMPACTO */}
      <div className={`border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* HEADER CON 2 CARDS: LOGO + INFO RESTAURANTE */}
          <div className="grid grid-cols-2 gap-2 items-center">
            
            {/* CARD IZQUIERDA: LOGO - FULL WIDTH */}
            <div className="flex justify-center items-center h-full">
              <img 
                src="/demo-images/Logo.jpg" 
                alt="Logo Esquina Pompeya"
                className="w-52 h-auto rounded-lg object-contain"
              />
            </div>

            {/* CARD DERECHA: INFO RESTAURANTE */}
            <div className="text-center">
              
              {/* Dirección - Link a Google Maps */}
              <a 
                href="https://www.google.com/maps/place/Esquina+Pompeya+Restaurant+Bar/@-34.6450496,-58.4278376,17z/data=!3m1!4b1!4m6!3m5!1s0x95bccba4769aea81:0x1cd0a2bfe4efd8bb!8m2!3d-34.645054!4d-58.4252627!16s%2Fg%2F11ggbt5v1g?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs mb-1 block hover:underline transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                📍 Av. Fernández de la Cruz 1100
              </a>
              
              {/* Teléfono/WhatsApp - Link directo */}
              <a 
                href="https://wa.me/5491128579746"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs mb-1 block hover:underline transition-colors duration-300 ${
                  isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                }`}
              >
                📱 +54 11 2857-9746
              </a>

              {/* Mercado Pago - Alias */}
              <a 
                href="https://www.mercadopago.com.ar/transferencias?alias=esquina.pompeya."
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs block hover:underline transition-colors duration-300 ${
                  isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                💳 esquina.pompeya. 
              </a>

              {/* Botones de acción debajo de la info */}
              <div className="flex gap-2 mt-4 justify-center flex-wrap">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/5491128579746"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                    isDarkMode 
                      ? 'bg-green-600 hover:bg-green-500 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  title="Contactar por WhatsApp"
                >
                  💬
                </a>

                {/* MercadoPago */}
                <a
                  href="https://www.mercadopago.com.ar/transferencias?alias=esquina.pompeya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  title="Pagar con MercadoPago"
                >
                  💰
                </a>

                {/* Dirección */}
                <a
                  href="https://www.google.com/maps/place/Esquina+Pompeya+Restaurant+Bar/@-34.6450496,-58.4278376,17z/data=!3m1!4b1!4m6!3m5!1s0x95bccba4769aea81:0x1cd0a2bfe4efd8bb!8m2!3d-34.645054!4d-58.4252627!16s%2Fg%2F11ggbt5v1g?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                    isDarkMode 
                      ? 'bg-red-600 hover:bg-red-500 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  title="Ver en Google Maps"
                >
                  🗺️
                </a>

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
                  title="Buscar platos"
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input de búsqueda (aparece al hacer clic en 🔍) */}
      {showSearch && (
        <div className={`border-b transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar platos por nombre..."
                  className={`w-full px-4 py-2 pr-24 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                      : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                  }`}
                  autoFocus
                />
                
                {/* Contador de resultados dentro del input */}
                {searchTerm && menuData && (
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {(() => {
                      const totalResults = menuData.categories.reduce((total, cat) => 
                        total + filterItems(cat.items).length, 0
                      );
                      return totalResults > 0 
                        ? `${totalResults} plato${totalResults !== 1 ? 's' : ''}`
                        : '0 platos';
                    })()}
                  </div>
                )}
              </div>
              
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

      {/* Contenido del Menú */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        
        {menuData.categories.length === 0 ? (
          <div className="text-center py-12">
            <h2 className={`text-xl mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>📝 Menú en construcción</h2>
            <p className={`mb-6 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Agrega categorías y productos desde el editor</p>
            <button 
              onClick={() => router.push('/editor')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ir al Editor →
            </button>
          </div>
        ) : searchTerm && menuData.categories.filter(category => filterItems(category.items).length > 0).length === 0 ? (
          // Mensaje cuando no hay resultados de búsqueda
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className={`text-xl mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>No se encontraron platos</h2>
            <p className={`mb-6 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Intenta con otro término de búsqueda</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setShowSearch(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          // Categorías del Menú (filtrar categorías vacías cuando hay búsqueda)
          menuData.categories
            .filter(category => !searchTerm || filterItems(category.items).length > 0)
            .map((category, index) => (
            <div key={category.id || index} className={`mb-4 rounded-lg border transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              
              {/* Header de Categoría */}
              <div className={`px-4 py-2 border-b rounded-t-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <h2 className={`text-base font-bold text-center transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.name}
                </h2>
              </div>
              
              {/* Items de la Categoría */}
              <div className={`p-3 ${
                category.name.toUpperCase().includes('PROMO') 
                  ? 'flex flex-wrap justify-evenly gap-2' 
                  : 'space-y-1.5'
              }`}>
                {filterItems(category.items).map((item, itemIndex) => (
                  
                  // DISEÑO ESPECIAL PARA PROMOS - MERGED COMO PLATOS
                  category.name.toUpperCase().includes('PROMO') ? (
                    <div 
                      key={item.id || itemIndex}
                      className="flex flex-col hover:opacity-90 transition-opacity duration-300 w-[calc(33.333%-0.5rem)] cursor-pointer"
                      onDoubleClick={() => setModalItem(item)}
                      title="Doble click para ver detalles"
                    >
                      {/* Imagen merged con borde superior */}
                      <div className={`h-24 rounded-t-lg overflow-hidden border-2 border-b-0 ${
                        isDarkMode ? 'border-blue-400' : 'border-blue-400'
                      }`}>
                        <img 
                          src={(() => {
                            const promoImages = ['/demo-images/milanesa-completa.jpg', '/demo-images/vacio-papas.jpg', '/demo-images/rabas.jpg'];
                            return promoImages[itemIndex % promoImages.length];
                          })()}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-blue-200">
                                  <span class="text-lg">🎯</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                      
                      {/* Contenido merged con borde inferior */}
                      <div className={`p-2 rounded-b-lg border-2 border-t-0 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'border-blue-400 bg-gradient-to-b from-blue-900/30 to-blue-800/20' 
                          : 'border-blue-400 bg-gradient-to-b from-blue-50 to-blue-100'
                      }`}>
                        <h3 className={`font-bold text-xs mb-1 text-center transition-colors duration-300 ${
                          isDarkMode ? 'text-blue-200' : 'text-blue-800'
                        }`}>
                          🔥 {item.name}
                        </h3>
                        
                        {item.description && (
                          <p className={`text-xs mb-2 text-center transition-colors duration-300 ${
                            isDarkMode ? 'text-blue-300' : 'text-blue-600'
                          }`}>
                            {item.description}
                          </p>
                        )}
                        
                        {/* Precio destacado */}
                        <div className={`text-xs font-bold px-2 py-1 rounded text-center transition-colors duration-300 ${
                          isDarkMode 
                            ? 'text-blue-100 bg-blue-600 border border-blue-400' 
                            : 'text-blue-800 bg-blue-200 border border-blue-500'
                        }`}>
                          {item.price}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // PLATO CON IMAGEN Y CONTENIDO MERGED - CLICKEABLE
                    <div 
                      key={item.id || itemIndex}
                      className={`flex items-stretch transition-opacity duration-300 h-12 ${
                        item.isAvailable === false 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:opacity-90 cursor-pointer'
                      }`}
                      onClick={() => item.isAvailable !== false && setModalItem(item)}
                    >
                        {/* Imagen integrada al borde izquierdo */}
                        <div className={`w-10 h-10 rounded-l-lg overflow-hidden flex-shrink-0 border-2 border-r-0 ${
                          isDarkMode ? 'border-gray-600' : 'border-gray-200'
                        }`}>
                          <img 
                            src={(() => {
                              const platosImages = ['/demo-images/albondigas.jpg', '/demo-images/rabas.jpg', '/demo-images/IMG-20250926-WA0005.jpg'];
                              return platosImages[itemIndex % platosImages.length];
                            })()}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback si no carga la imagen
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
                        
                        {/* Contenido continuando el borde */}
                        <div className={`flex-1 flex items-center justify-between px-2 py-2 rounded-r-lg border-2 border-l-0 transition-colors duration-300 h-10 ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700/50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          
                          {/* Texto del plato */}
                          <div className="flex-1">
                            <h3 className={`font-medium text-sm leading-tight transition-colors duration-300 ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {category.name.toUpperCase().includes('PLATOS DEL DÍA') && (
                                <span className="text-yellow-400 mr-1">⭐</span>
                              )}
                              {item.name}
                            </h3>
                          </div>

                          {/* Precio */}
                          <div className={`text-xs font-bold px-1.5 py-0.5 rounded border-2 transition-colors duration-300 ${
                            isDarkMode 
                              ? 'text-blue-300 bg-gray-800 border-blue-500' 
                              : 'text-blue-700 bg-blue-50 border-blue-300'
                          }`}>
                            {item.price}
                          </div>
                        </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))
        )}

        {/* Footer */}
        <div className={`text-center py-6 text-xs transition-colors duration-300 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p>💡 Carta digital generada con MenuQR</p>
          <p className="mt-1">Actualizada automáticamente</p>
        </div>
      </div>

      {/* MODAL PARA PLATOS */}
      {modalItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setModalItem(null)}
        >
          <div 
            className={`max-w-md w-full rounded-xl p-6 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen grande del plato */}
            <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
              <img 
                src={(() => {
                  const platosImages = ['/demo-images/albondigas.jpg', '/demo-images/rabas.jpg', '/demo-images/IMG-20250926-WA0005.jpg'];
                  return platosImages[0]; // Por ahora primera imagen
                })()}
                alt={modalItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info del plato */}
            <h2 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {modalItem.name}
            </h2>
            
            {modalItem.description && (
              <p className={`text-sm mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {modalItem.description}
              </p>
            )}
            
            {/* Precio destacado */}
            <div className={`text-2xl font-bold text-center p-3 rounded-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'text-blue-300 bg-blue-900 border-2 border-blue-500' 
                : 'text-blue-700 bg-blue-100 border-2 border-blue-400'
            }`}>
              {modalItem.price}
            </div>
            
            {/* Botón cerrar */}
            <button 
              onClick={() => setModalItem(null)}
              className={`w-full mt-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}