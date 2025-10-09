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
  const [showMapsModal, setShowMapsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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
        
        // Cargar datos temporales si hay error
        loadTemporaryData();
      }
    };

    const loadTemporaryData = () => {
      console.log('🔄 Cargando datos temporales...');
      const tempData: RestaurantData = {
        restaurantName: 'Esquina Pompeya Restaurant Bar',
        address: 'Av. Fernández de la Cruz 1100',
        phone: '+54 11 2857-9746',
        categories: [
          {
            id: 'cat-1',
            name: 'PLATOS DEL DÍA',
            items: [
              {
                id: 'item-1',
                name: 'Milanesa Completa',
                price: '$2,500',
                description: 'Milanesa de carne con papas fritas, huevo y ensalada',
                isAvailable: true
              },
              {
                id: 'item-2',
                name: 'Rabas',
                price: '$3,200',
                description: 'Rabas frescas con limón y salsa tártara',
                isAvailable: true
              }
            ]
          },
          {
            id: 'cat-2',
            name: 'PARRILLA',
            items: [
              {
                id: 'item-3',
                name: 'Vacio con Papas',
                price: '$4,500',
                description: 'Vacio a la parrilla con papas fritas',
                isAvailable: true
              }
            ]
          },
          {
            id: 'cat-3',
            name: 'PROMOS',
            items: [
              {
                id: 'item-4',
                name: 'Combo Familiar',
                price: '$8,500',
                description: '2 Milanesas + 2 Papas + 2 Bebidas',
                isAvailable: true
              }
            ]
          }
        ]
      };
      
      setMenuData(tempData);
      console.log('✅ Datos temporales cargados');
    };

        
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
      <div className={`border-b sticky top-0 z-50 transition-colors duration-300 relative ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-0 pb-0.5">
          {/* HEADER: LOGO + BOTONES EN LÍNEA */}
          <div className="flex items-center justify-center gap-8">
            
            {/* LOGO A LA IZQUIERDA */}
            <div className="flex-shrink-0">
              <img 
                src="/demo-images/logo.png?v=2" 
                alt="Logo Esquina Pompeya"
                className="w-[180px] h-auto rounded-lg object-contain cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowMapsModal(true)}
                title="Ver ubicación en Google Maps"
                onError={(e) => {
                  console.log('Error cargando logo.png, intentando Logo.jpg');
                  e.currentTarget.src = '/demo-images/Logo.jpg?v=2';
                }}
              />
            </div>

            {/* BOTONES A LA DERECHA */}
            <div className="flex gap-1.5 items-center">
                {/* MercadoPago */}
                <a
                  href="https://www.mercadopago.com.ar/transferencias?alias=esquina.pompeya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                      : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
                  }`}
                  title="Pagar con MercadoPago"
                >
                  💳
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/5491128579746"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-green-400' 
                      : 'bg-gray-200 hover:bg-gray-300 text-green-600'
                  }`}
                  title="Contactar por WhatsApp"
                >
                  💬
                </a>
                
                {/* Reseña Google Maps */}
                <a
                  href="https://www.google.com/maps/place/Esquina+Pompeya+Restaurant+Bar/@-34.6450496,-58.4278376,17z/data=!3m1!4b1!4m6!3m5!1s0x95bccba4769aea81:0x1cd0a2bfe4efd8bb!8m2!3d-34.645054!4d-58.4252627!16s%2Fg%2F11ggbt5v1g?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                      : 'bg-gray-200 hover:bg-gray-300 text-yellow-600'
                  }`}
                  title="Dejar reseña en Google Maps"
                >
                  ⭐
                </a>

                {/* Buscador o Input - AL FINAL */}
                {showSearch ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar..."
                      className={`px-3 py-2 text-sm rounded-lg transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                          : 'bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                      }`}
                      autoFocus
                      style={{ width: '140px' }}
                    />
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        setSearchTerm('');
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-sm ${
                        isDarkMode 
                          ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                      title="Cerrar búsqueda"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-purple-400' 
                        : 'bg-gray-200 hover:bg-gray-300 text-purple-600'
                    }`}
                    title="Buscar platos"
                  >
                    🔎
                  </button>
                )}
            </div>
          </div>

          {/* FILTROS DE CATEGORÍAS SUPERPUESTOS */}
          {menuData && menuData.categories.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="max-w-4xl mx-auto px-4 py-1">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                  {/* Botón "Todas" */}
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === 'ALL'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isDarkMode 
                          ? 'bg-gray-700/90 hover:bg-gray-600 text-gray-300 backdrop-blur-sm' 
                          : 'bg-gray-200/90 hover:bg-gray-300 text-gray-700 backdrop-blur-sm'
                    }`}
                  >
                    Todas
                  </button>
                  
                  {/* Botones de categorías */}
                  {menuData.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id || '')}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : isDarkMode 
                            ? 'bg-gray-700/90 hover:bg-gray-600 text-gray-300 backdrop-blur-sm' 
                            : 'bg-gray-200/90 hover:bg-gray-300 text-gray-700 backdrop-blur-sm'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
          // Categorías del Menú (filtrar por categoría seleccionada y búsqueda)
          menuData.categories
            .filter(category => {
              // Filtrar por categoría seleccionada
              if (selectedCategory !== 'ALL' && (category.id || '') !== selectedCategory) {
                return false;
              }
              // Filtrar categorías vacías cuando hay búsqueda
              if (searchTerm && filterItems(category.items).length === 0) {
                return false;
              }
              return true;
            })
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
                        item.isAvailable === false 
                          ? 'border-gray-400 bg-gray-500/20' 
                          : isDarkMode 
                            ? 'border-gray-600 bg-gray-700/50' 
                            : 'border-gray-200 bg-gray-50'
                      }`}>
                        
                        {/* Texto del plato */}
                        <div className="flex-1">
                          <h3 className={`font-medium text-sm leading-tight transition-colors duration-300 ${
                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {category.name.toUpperCase().includes('PLATOS DEL DÍA') && (
                              <span className="text-yellow-400 mr-1">⭐</span>
                            )}
                            {item.name}
                          </h3>
                        </div>

                        {/* Estado + Precio */}
                        <div className="flex items-center gap-1">
                          {/* Texto AGOTADO */}
                          {item.isAvailable === false && (
                            <div className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-200 text-gray-600 border border-red-300">
                              AGOTADO
                            </div>
                          )}
                          
                          {/* Precio */}
                          <div className={`text-xs font-bold px-1.5 py-0.5 rounded border-2 transition-colors duration-300 ${
                            item.isAvailable === false 
                              ? 'text-gray-400 bg-gray-600 border-gray-400' 
                              : isDarkMode 
                                ? 'text-blue-300 bg-gray-800 border-blue-500' 
                                : 'text-blue-700 bg-blue-50 border-blue-300'
                          }`}>
                            {item.price}
                          </div>
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
            {/* LÍNEA 1: Nombre y X para cerrar */}
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {modalItem.name}
              </h2>
              <button 
                onClick={() => setModalItem(null)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                ✕
              </button>
            </div>
            
            {/* LÍNEA 2: Foto */}
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
            
            {/* LÍNEA 3: Descripción expandible */}
            {modalItem.description && (
              <div className="mb-4">
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {modalItem.description}
                </p>
              </div>
            )}
            
            {/* LÍNEA 4: Control "- x +" y Precio */}
            <div className="flex items-center justify-between">
              {/* Control de cantidad */}
              <div className="flex items-center gap-3">
                <button className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}>
                  -
                </button>
                <span className={`text-lg font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  1
                </span>
                <button className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}>
                  +
                </button>
              </div>
              
              {/* Precio destacado */}
              <div className={`text-xl font-bold px-4 py-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-blue-300 bg-blue-900 border-2 border-blue-500' 
                  : 'text-blue-700 bg-blue-100 border-2 border-blue-400'
              }`}>
                {modalItem.price}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Google Maps */}
      {showMapsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-[90vw] h-[80vh] max-w-6xl max-h-[800px] relative">
            {/* Header del modal */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">📍 Esquina Pompeya Restaurant Bar</h2>
              <button
                onClick={() => setShowMapsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            {/* Contenido del modal */}
            <div className="p-4 h-[calc(100%-80px)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.2345678901234!2d-58.4252627!3d-34.645054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccba4769aea81%3A0x1cd0a2bfe4efd8bb!2sEsquina%20Pompeya%20Restaurant%20Bar!5e0!3m2!1ses!2sar!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Esquina Pompeya Restaurant Bar"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}