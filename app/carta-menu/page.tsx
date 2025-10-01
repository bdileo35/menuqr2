"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DevBanner from '../components/DevBanner';

interface MenuItem {
  id?: string;
  name: string;
  price: string;
  description?: string;
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

  useEffect(() => {
    console.log('🔍 Cargando datos del restaurante desde localStorage...');
    
    // Cargar datos del localStorage (del wizard completo)
    const savedMenu = localStorage.getItem('editor-menu-data');
    const setupData = localStorage.getItem('setup-comercio-data');
    
    console.log('📦 Editor data:', savedMenu);
    console.log('⚙️ Setup data:', setupData);

    let restaurantInfo: RestaurantData;

    if (savedMenu && setupData) {
      // Usar datos reales del wizard
      const menuData = JSON.parse(savedMenu);
      const setup = JSON.parse(setupData);
      
      restaurantInfo = {
        restaurantName: setup.nombreComercio || setup.restaurantName || 'Mi Restaurante',
        address: setup.direccion || setup.address || 'Dirección no especificada',
        phone: setup.telefono || setup.phone || 'Teléfono no especificado', 
        categories: menuData.categories || menuData || []
      };
      
      console.log('✅ Usando datos reales del wizard:', restaurantInfo);
    } else {
      // Datos de ejemplo genéricos (sin mencionar Esquina Pompeya)
      restaurantInfo = {
        restaurantName: 'Mi Restaurante Demo',
        address: 'Av. Principal 123, Ciudad',
        phone: '+54 11 1234-5678',
        categories: [
          {
            id: 'platos-del-dia',
            name: 'PLATOS DEL DIA',
            items: [
              { id: '1', name: 'Milanesas al horno c/ Puré', price: '$9000' },
              { id: '2', name: 'Croquetas de carne c/ensalada', price: '$8000' },
              { id: '3', name: 'Chuleta de merluza c/rusa gatura', price: '$10000' },
              { id: '4', name: 'Pechuga rellena c/ f. españolas', price: '$12000' },
              { id: '5', name: 'Mejillones c/ fetuccinis', price: '$14000' },
              { id: '6', name: 'Vacio a la parrilla c/fritas', price: '$15000' },
              { id: '7', name: 'Peceto al verdeo c/ Puré', price: '$15000' },
              { id: '8', name: 'Arroz integral con vegetales', price: '$11000' }
            ]
          },
          {
            id: 'promociones',  
            name: 'PROMOCIONES DE LA SEMANA',
            items: [
              { id: 'p1', name: 'PROMO 1: Milanesa Completa', price: '$12000', description: 'Milanesa + Papas + Bebida' },
              { id: 'p2', name: 'PROMO 2: Salpicón de Ave', price: '$12000', description: 'Ensalada + Bebida + Postre' },
              { id: 'p3', name: 'PROMO 3: Parrilla Especial', price: '$15000', description: 'Carne + Guarnición + Postre' }
            ]
          },
          {
            id: 'cocina',
            name: 'COCINA',
            items: [
              { id: 'c1', name: '1/4 Pollo al horno c/ papas', price: '$9000' },
              { id: 'c2', name: '1/4 Pollo provenzal c/ fritas', price: '$10000' },
              { id: 'c3', name: 'Suprema a la napolitana', price: '$12000' },
              { id: 'c4', name: 'Suprema rellena c/ jamón y queso', price: '$13000' },
              { id: 'c5', name: 'Lomo a la pimienta', price: '$16000' },
              { id: 'c6', name: 'Bife de chorizo c/ fritas', price: '$15000' }
            ]
          },
          {
            id: 'tortillas',
            name: 'TORTILLAS',
            items: [
              { id: 't1', name: 'Tortilla española', price: '$8000' },
              { id: 't2', name: 'Tortilla de papa', price: '$7000' },
              { id: 't3', name: 'Tortilla mixta', price: '$9000' }
            ]
          },
          {
            id: 'sandwiches',
            name: 'SÁNDWICHES',
            items: [
              { id: 's1', name: 'Sw. tostado simple', price: '$4000' },
              { id: 's2', name: 'Sw. tostado completo', price: '$5000' },
              { id: 's3', name: 'Sw. milanesa simple', price: '$6000' },
              { id: 's4', name: 'Sw. milanesa completo', price: '$7500' },
              { id: 's5', name: 'Sw. lomito completo', price: '$10000' },
              { id: 's6', name: 'Sw. bondiola completo', price: '$10000' }
            ]
          },
          {
            id: 'empanadas',
            name: 'NUESTRAS EMPANADAS',
            items: [
              { id: 'emp1', name: 'Carne - Pollo - J y Q', price: '$600', description: 'c/u' },
              { id: 'emp2', name: 'Atún, Chía', price: '$800', description: 'c/u' }
            ]
          }
        ]
      };
      
      console.log('⚠️ Usando datos de ejemplo genéricos');
    }

    setTimeout(() => {
      setMenuData(restaurantInfo);
      setLoading(false);
      
      console.log('📋 Total categorías:', restaurantInfo.categories.length);
      console.log('📋 Total productos:', restaurantInfo.categories.reduce((total, cat) => total + cat.items.length, 0));
    }, 500);
  }, []);

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
      
      <DevBanner />
      
      {/* Header con info del restaurante - MÁS ALTO */}
      <div className={`border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* HEADER CON 2 CARDS: LOGO + INFO RESTAURANTE - MÁS ALTO */}
          <div className="grid grid-cols-2 gap-2 items-center py-2">
            
            {/* CARD IZQUIERDA: LOGO - MÁS GRANDE */}
            <div className="flex justify-center">
              <img 
                src="/demo-images/Logo.jpg" 
                alt="Logo Esquina Pompeya"
                className="h-26 w-36 rounded-lg object-cover"
              />
            </div>

            {/* CARD DERECHA: INFO RESTAURANTE */}
            <div className="text-center">
              <h1 className={`text-lg font-bold mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Esquina Pompeya
              </h1>
              
              <p className={`text-xs mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                RESTOBAR & PARRILLA
              </p>
              
              <p className={`text-xs mb-1 transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                📍 Av. Fernández de la Cruz 1100
              </p>
              
              <p className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                📱 +54 11 1234-5678
              </p>

              {/* Toggle modo oscuro/claro - esquina superior derecha */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`absolute top-2 right-2 p-1.5 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
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
        ) : (
          // Categorías del Menú
          menuData.categories.map((category, index) => (
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
                  ? 'grid grid-cols-3 gap-2' 
                  : 'space-y-1.5'
              }`}>
                {category.items.map((item, itemIndex) => (
                  
                  // DISEÑO ESPECIAL PARA PROMOS - MERGED COMO PLATOS
                  category.name.toUpperCase().includes('PROMO') ? (
                    <div 
                      key={item.id || itemIndex}
                      className="flex flex-col hover:opacity-90 transition-opacity duration-300"
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
                            e.currentTarget.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-blue-200">
                                <span class="text-lg">🎯</span>
                              </div>
                            `;
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
                      className="flex items-stretch hover:opacity-90 transition-opacity duration-300 cursor-pointer"
                      onClick={() => setModalItem(item)}
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
                              e.currentTarget.parentElement.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span class="text-xs">🍽️</span>
                                </div>
                              `;
                            }}
                          />
                        </div>
                        
                        {/* Contenido continuando el borde */}
                        <div className={`flex-1 flex items-center justify-between px-2 py-2 rounded-r-lg border-2 border-l-0 transition-colors duration-300 ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700/50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          
                          {/* Texto del plato */}
                          <div className="flex-1">
                            <h3 className={`font-medium text-xs leading-tight transition-colors duration-300 ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              <span className="text-yellow-400 mr-1">⭐</span>{item.name}
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
              <span className="text-yellow-400 mr-2">⭐</span>{modalItem.name}
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