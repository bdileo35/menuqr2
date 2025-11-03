
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDemoMenuData } from '@/lib/demo-data'; // Fallback para desarrollo
import { useAppTheme } from '../../hooks/useAppTheme';
// import DevBanner from '../components/DevBanner'; // Moved to _unused

interface MenuItem {
  id?: string;
  name: string;
  price: string;
  description?: string;

  isAvailable?: boolean;
  imageBase64?: string | null;
}

interface MenuCategory {
  id?: string;
  name: string;
  description?: string;
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
  const params = useParams();
  const idUnico = (params?.idUnico as string) || '5XJ1J37F';
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useAppTheme(); // ✅ USANDO HOOK
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [modalItemImage, setModalItemImage] = useState<string>('');



  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [showMapsModal, setShowMapsModal] = useState(false);
  const [showMencionesModal, setShowMencionesModal] = useState(false);
  const [showHorariosDropdown, setShowHorariosDropdown] = useState(false);
  const [showArrowAnimation, setShowArrowAnimation] = useState(false);
  const [arrowDirection, setArrowDirection] = useState<'next' | 'prev' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cartItems, setCartItems] = useState<Array<{item: MenuItem, quantity: number, code: string}>>([]);
  const [showCart, setShowCart] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalidad, setModalidad] = useState<'salon' | 'retiro' | 'delivery' | null>(null);
  const [formaPago, setFormaPago] = useState<'efectivo' | 'mp' | null>(null);
  const [productosClicked, setProductosClicked] = useState(false);
  const [showModalidadModal, setShowModalidadModal] = useState(false);
  const [showPagosModal, setShowPagosModal] = useState(false);
  const [showTelon, setShowTelon] = useState(false);
  const [telonContent, setTelonContent] = useState<'productos' | 'entrega' | 'pagos'>('productos');
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  const [animationActive, setAnimationActive] = useState(false);

  // POC: Carrito Pro (FAB + Modal tipo ticket)
  const [showProCart, setShowProCart] = useState(true);
  const [showProCartModal, setShowProCartModal] = useState(false);
  const [proName, setProName] = useState('');
  const [proAddress, setProAddress] = useState('');
  const [proPayment, setProPayment] = useState<'efectivo' | 'mp' | null>(null);

  // Util: generar texto de ticket para WhatsApp
  const buildTicketMessage = () => {
    const lines: string[] = [];
    lines.push(`Pedido - ${menuData?.restaurantName || 'Mi Restaurante'}`);
    if (proName) lines.push(`Nombre: ${proName}`);
    if (proAddress) lines.push(`Dirección: ${proAddress}`);
    lines.push('---');
    cartItems.forEach(ci => {
      const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
      lines.push(`${ci.quantity} x ${ci.item.name} - ${price.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}`);
    });
    const total = cartItems.reduce((sum, it) => sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0);
    lines.push('---');
    lines.push(`Total: ${total.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}`);
    if (proPayment) lines.push(`Pago: ${proPayment === 'mp' ? 'Mercado Pago' : 'Efectivo'}`);
    return lines.join('\n');
  };

  // Función para toggle de categorías
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === undefined ? false : !prev[categoryId]
    }));
  };

  // Horarios del restaurante
  const horarios = {
    lunes: { abierto: '6:00', cerrado: '17:00' },
    martes: { abierto: '6:00', cerrado: '17:00' },
    miercoles: { abierto: '6:00', cerrado: '17:00' },
    jueves: { abierto: '6:00', cerrado: '17:00' },
    viernes: { abierto: '6:00', cerrado: '17:00' },
    sabado: { abierto: '6:00', cerrado: '17:00' },
    domingo: { abierto: 'Cerrado', cerrado: 'Cerrado' }
  };

  // Función para verificar si está abierto
  const isOpenNow = () => {
    const now = new Date();
    const day = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const horario = horarios[day as keyof typeof horarios];
    if (horario.abierto === 'Cerrado') return false;
    
    const [openHour, openMin] = horario.abierto.split(':').map(Number);
    const [closeHour, closeMin] = horario.cerrado.split(':').map(Number);
    
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  // Función para animar flechas
  const animateArrows = (direction: 'next' | 'prev') => {
    setArrowDirection(direction);
    setShowArrowAnimation(true);
    
    setTimeout(() => {
      setShowArrowAnimation(false);
      setArrowDirection(null);
    }, 2200); // 2.2 segundos (8 × 0.2s delay + 0.3s animation + 0.3s extra)
  };

  // Función para generar link de Mercado Pago
  const generateMPLink = async () => {
    if (!modalidad || !formaPago) return;
    
    const total = cartItems.reduce((sum, cartItem) => {
      const price = parseFloat(cartItem.item.price.replace('$', '').replace(',', ''));
      return sum + (price * cartItem.quantity);
    }, 0);

    try {
      const response = await fetch('/api/tienda/crear-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'pedido',
          precio: total,
          descripcion: `Pedido - ${modalidad} - ${cartItems.length} productos`,
          items: cartItems.map(item => ({
            nombre: item.item.name,
            precio: parseFloat(item.item.price.replace('$', '').replace(',', '')),
            cantidad: item.quantity,
            codigo: item.code
          }))
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.init_point;
      } else {
        alert('Error al procesar el pago. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago. Intenta nuevamente.');
    }
  };

  useEffect(() => {
    const loadMenuFromAPI = async () => {
      console.log('🔍 Cargando menú desde la base de datos...');
      
      try {
        // Llamar a la API dinámica por idUnico
        const response = await fetch(`/api/menu/${idUnico}`);
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
          let restaurantInfo: RestaurantData = {
            restaurantName: data.menu.restaurantName,
            address: data.menu.contactAddress || 'Av. Fernández de la Cruz 1100',
            phone: data.menu.contactPhone || '+54 11 1234-5678',
            categories: data.menu.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              description: cat.description,
              items: cat.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: `$${item.price}`,

                description: item.description,
                isAvailable: item.isAvailable
              }))
            }))
          };
          
          // Fusionar con cambios locales (editor)
          try {
            const savedStr = localStorage.getItem('editor-menu-data');
            if (savedStr) {
              const saved = JSON.parse(savedStr) as RestaurantData;
              const savedCatMap = new Map<string, any>();
              saved.categories.forEach(sc => savedCatMap.set(sc.id || sc.name, sc));
              restaurantInfo = {
                ...restaurantInfo,
                categories: restaurantInfo.categories.map(rc => {
                  const sc = savedCatMap.get(rc.id || rc.name);
                  if (!sc) return rc;
                  const savedItemMap = new Map<string, any>();
                  sc.items.forEach((si: any) => savedItemMap.set(si.id || si.name, si));

                  // Merge de items existentes
                  const mergedExisting = rc.items.map(ri => {
                    const si = savedItemMap.get(ri.id || ri.name);
                    if (!si) return ri;
                    const hasLocalImageProp = Object.prototype.hasOwnProperty.call(si, 'imageBase64');
                    return {
                      ...ri,
                      name: si.name || ri.name,
                      description: si.description ?? ri.description,
                      price: si.price || ri.price,
                      isAvailable: typeof si.isAvailable === 'boolean' ? si.isAvailable : ri.isAvailable,
                      imageBase64: hasLocalImageProp ? si.imageBase64 : ri.imageBase64,
                    };
                  });

                  // Agregar items que sólo existen en localStorage (nuevos)
                  const existingIdOrName = new Set(mergedExisting.map(i => (i as any).id || (i as any).name));
                  const onlyLocal = sc.items.filter((si: any) => !existingIdOrName.has(si.id || si.name));
                  const mergedAll = [...mergedExisting, ...onlyLocal];

                  return {
                    ...rc,
                    description: (typeof sc.description === 'string' && sc.description.length > 0) ? sc.description : rc.description,
                    items: mergedAll
                  };
                })
              };
            }
          } catch (mergeErr) {
            console.warn('⚠️ No se pudo fusionar datos locales en Carta:', mergeErr);
          }

          setMenuData(restaurantInfo);
          // Activación Pro desde base de datos (allowOrdering)
          try {
            if (data?.menu?.allowOrdering === true) {
              setShowProCart(true);
            }
          } catch {}
          // Inicializar como expandidas todas las categorías
          const initialExpanded: {[key: string]: boolean} = {};
          restaurantInfo.categories.forEach(cat => {
            initialExpanded[cat.id || cat.name] = true;
          });
          setExpandedCategories(initialExpanded);
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

          // Fallback final: usar datos demo
          console.log('⚠️ Usando datos demo como fallback final...');
          const demoData = getDemoMenuData();
          const restaurantInfo: RestaurantData = {
            restaurantName: demoData.restaurantName,
            address: 'Av. Corrientes 1234, Buenos Aires',
            phone: '+54 11 1234-5678',
            categories: demoData.categories
          };
          setMenuData(restaurantInfo);
        }
      } finally {
        setLoading(false);
      }
    };

    // Habilitar FAB por query (?procart=1 o ?pro=1) o flag de entorno
    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('procart') === '1' || sp.get('pro') === '1' || process.env.NEXT_PUBLIC_CART_PRO === '1') {
        setShowProCart(true);
      } else if (sp.get('procart') === '0' || sp.get('pro') === '0') {
        setShowProCart(false);
      }
    } catch {}

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
            Guardar
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
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 relative ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 pt-2 pb-1">
          {/* HEADER: LOGO + BOTONES EN LÍNEA */}
          <div className="flex items-center justify-between gap-4">
            
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

            {/* COLUMNA DERECHA: BOTONES + BUSCADOR */}
            <div className="flex flex-col gap-2 ml-auto">

              {/* FILA 1: DOS BOTONES */}
              <div className="flex items-center gap-2 w-full">
                {/* Botón 1: Reseñas */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔍 Botón Reseñas clickeado');
                    console.log('Estado actual showMencionesModal:', showMencionesModal);
                    setShowMencionesModal(true);
                    console.log('setShowMencionesModal(true) ejecutado');
                  }}
                  className={`flex-1 h-8 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                  title="Ver Reseñas"
                >
                  <span className="text-lg">🔍</span>
                  <span className="text-sm font-medium">Reseñas</span>
                </button>

                {/* Botón 2: Toggle sol/luna */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTheme();
                  }}
                  className={`flex-1 h-8 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                  title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                >
                  <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{isDarkMode ? 'Claro' : 'Oscuro'}</span>
                </button>
              </div>

              {/* FILA 2: BUSCADOR (ANCHO) */}
              {showSearch ? (
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar platos..."
                    className={`w-full h-8 pl-3 pr-10 text-sm rounded-lg transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500' 
                        : 'bg-gray-200 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500'
                    }`}
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center transition-colors text-sm ${
                      isDarkMode 
                        ? 'hover:bg-gray-600 text-gray-300' 
                        : 'hover:bg-gray-300 text-gray-800'
                    }`}
                    title="Limpiar filtro"
                  >
                    ✕
                  </button>
                </div>
              ) : (
              <button
                  onClick={() => setShowSearch(true)}
                  className={`w-full h-8 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                  title="Buscar platos"
              >
                  <span className="text-lg">🔍</span>
                  <span className="text-sm font-medium">Buscar platos...</span>
              </button>
              )}
            </div>
          </div>

          {/* FILTROS DE CATEGORÍAS ELIMINADOS - AHORA USAMOS TRIANGULITOS EN ENCABEZADOS */}
          {false && menuData?.categories && (menuData?.categories?.length || 0) > 0 && (
            <div className="absolute bottom-0 left-0 right-0">
              <div className="max-w-4xl mx-auto px-4 py-1">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                  {/* Botón "Todas" */}
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === 'ALL'
                        ? 'bg-gray-600 text-white shadow-sm'
                        : isDarkMode 
                          ? 'bg-gray-700/90 hover:bg-gray-600 text-gray-300 backdrop-blur-sm' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800 backdrop-blur-sm'
                    }`}
                  >
                    Todas
                  </button>
                  
                  {/* Botones de categorías */}
                  {menuData?.categories.map((category) => (
              <button

                      key={category.id}
                      onClick={() => {
                        if (category.id) {
                          setSelectedCategory(category.id);
                        }
                      }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-gray-600 text-white shadow-sm'
                          : isDarkMode 
                            ? 'bg-gray-700/90 hover:bg-gray-600 text-gray-300 backdrop-blur-sm' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800 backdrop-blur-sm'
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
      <div className="max-w-6xl mx-auto px-4 py-4">
        
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
              Guardar
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
              Guardar
            </button>
          </div>
        ) : (
          // Categorías del Menú (filtrar por categoría seleccionada y búsqueda)
          menuData.categories
            .filter(category => {
              // Siempre mostrar todas las categorías (filtro eliminado)
              // Filtrar categorías vacías cuando hay búsqueda
              if (searchTerm && filterItems(category.items).length === 0) {
                return false;
              }
              return true;
            })
            .map((category, index) => (
            <div key={category.id || index}             className={`mb-4 rounded-lg border transition-colors duration-300 ${

              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
            }`}>
              
              {/* Header de Categoría - Clickeable */}
              <div 
                className={`px-3 py-1 border-b rounded-t-lg transition-colors duration-300 cursor-pointer hover:opacity-80 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
                }`}
                onClick={() => toggleCategory(category.id || category.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2 pl-2">
                    <span className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full border ${
                      isDarkMode 
                        ? 'bg-transparent border-gray-500 text-white' 
                        : 'bg-transparent border-gray-500 text-gray-800'
                    }`}>
                      {filterItems(category.items).length}
                    </span>
                    <div className="flex flex-col">
                      <h2 className={`text-base font-bold leading-tight ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {category.name}
                      </h2>
                      {category.description && (
                        <span className={`text-[11px] leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category.description}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Triangulito */}
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    {expandedCategories[category.id || category.name] ? '▼' : '▲'}
                  </button>
                </div>
              </div>
              
              {/* Items de la Categoría - Colapsables */}
              {expandedCategories[category.id || category.name] !== false && (
              <div className={`px-3 pb-3 ${
                category.name.toUpperCase().includes('PROMO') 

                  ? 'pt-3 flex flex-wrap justify-evenly gap-2' 
                  : 'pt-0 space-y-0'
              }`}>
                  
                {filterItems(category.items).map((item, itemIndex) => (
                  
                  // DISEÑO ESPECIAL PARA PROMOS - ESTILO ENCABEZADO DE CATEGORÍA
                  category.name.toUpperCase().includes('PROMO') ? (
                    <div 
                      key={item.id || itemIndex}
                      className="flex flex-col hover:opacity-90 transition-opacity duration-300 w-[calc(33.333%-0.5rem)] cursor-pointer h-full rounded-lg overflow-hidden"
                      style={{ minHeight: '140px' }}
                      onClick={() => {
                        setModalItem(item);
                        const promoImages = ['/platos/milanesa-completa.jpg', '/platos/vacio-papas.jpg', '/platos/rabas.jpg'];
                        setModalItemImage(promoImages[itemIndex % promoImages.length]);
                      }}
                      title="Click para ver detalles"
                    >
                      {/* Encabezado estilo categoría */}
                      <div className={`px-3 py-2 border-b transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
                      }`}>
                        <h3 className={`text-sm font-bold text-center transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {item.name}
                        </h3>
                      </div>
                      
                      {/* Imagen */}
                      <div className="h-24 overflow-hidden">
                        <img 
                          src={(() => {
                            const promoImages = ['/platos/milanesa-completa.jpg', '/platos/vacio-papas.jpg', '/platos/rabas.jpg'];
                            return promoImages[itemIndex % promoImages.length];
                          })()}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gray-700">
                                  <span class="text-lg">🎯</span>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                      
                      {/* Contenido */}
                      <div className={`p-2 flex-1 flex flex-col justify-between transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700' 
                          : 'bg-gray-200'
                      }`}>
                        {item.description && (
                          <p className={`text-xs text-center transition-colors duration-300 min-h-[2rem] flex items-center justify-center ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-800'
                          }`}>
                            {item.description}
                          </p>
                        )}
                        
                        {/* Precio centrado */}
                        <div className={`text-sm font-bold text-center transition-colors duration-300 mt-2 text-blue-500`}>
                          {item.price.replace('$$', '$')}
                        </div>
                      </div>
                    </div>
                  ) : (

                    // PLATO SIN MARCOS - SOLO LÍNEA INFERIOR
                    <div 
                      key={item.id || itemIndex}

                      className={`flex items-center transition-all duration-300 border-b ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                      } ${item.isAvailable === false 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:opacity-90 cursor-pointer'
                      }`}
                      onClick={() => {
                        if (item.isAvailable !== false) {
                          setModalItem(item);
                          const fallbacks = ['/platos/albondigas.jpg', '/platos/rabas.jpg', '/platos/IMG-20250926-WA0005.jpg'];
                          setModalItemImage(item.imageBase64 || fallbacks[itemIndex % fallbacks.length]);
                        }
                      }}
                    >
                      {/* Imagen más grande sin marco */}
                      <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ml-0 mr-2 my-1`}>
                        {item.imageBase64 ? (
                          <img
                            src={item.imageBase64}
                            alt={item.name}
                            className={`w-full h-full object-cover ${item.isAvailable === false ? 'grayscale' : ''}`}
                          />
                        ) : (
                          <img 
                            src={(() => {
                              const platosImages = ['/platos/albondigas.jpg', '/platos/rabas.jpg', '/platos/IMG-20250926-WA0005.jpg'];
                              return platosImages[itemIndex % platosImages.length];
                            })()}
                            alt={item.name}
                            className={`w-full h-full object-cover ${item.isAvailable === false ? 'grayscale' : ''}`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class=\"w-full h-full flex items-center justify-center bg-gray-200\">\n                                    <span class=\"text-xs\">🍽️</span>\n                                  </div>
                                `;
                              }
                            }}
                          />
                        )}
                      </div>
                        

                      {/* Contenido sin marco */}
                      <div className={`flex-1 flex items-center justify-between px-2 py-1 transition-colors duration-300 ${
                        item.isAvailable === false 
                          ? 'text-gray-400' 
                          : isDarkMode ? 'text-white' : 'text-black'
                        }`}>
                          
                          {/* Texto del plato */}
                          <div className="flex-1">
                            <h3 className={`font-medium text-xs leading-tight transition-colors duration-300 ${

                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : isDarkMode ? 'text-white' : 'text-black'
                            }`}>

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
                          
                          {/* Precio sin marco */}
                          <div className={`text-sm font-bold transition-colors duration-300 ${
                            item.isAvailable === false 
                              ? 'text-gray-400' 
                              : 'text-blue-500'
                          }`}>
                            {item.price.replace('$$', '$')}
                          </div>
                          </div>
                        </div>
                    </div>
                  )
                ))}
              </div>
              )}
            </div>
          ))
        )}

        {/* Footer */}
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
                src={modalItemImage || '/platos/albondigas.jpg'}
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
            <div className="flex items-center justify-between mb-4">
              {/* Control de cantidad */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
              isDarkMode 

                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  -
                </button>
                <span className={`text-lg font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {modalQuantity}
                </span>
            <button 

                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >

                  +
                </button>
              </div>
            
            {/* Precio destacado */}
              <div className={`text-xl font-bold px-4 py-2 rounded-lg transition-colors duration-300 text-blue-500 ${
                isDarkMode ? 'bg-gray-700 border-2 border-gray-600' : 'bg-transparent'
              }`}>
              {modalItem.price.replace('$$', '$')}
              </div>
            </div>
            
            {/* LÍNEA 5: Botón Agregar al Carrito */}
            <button 
              onClick={() => {
                // Generar código temporal (por ahora)
                const code = `0${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
                
                // Agregar al carrito
                setCartItems(prev => [...prev, {
                  item: modalItem,
                  quantity: modalQuantity,
                  code: code
                }]);
                
                // Cerrar modal y resetear cantidad
                setModalItem(null);
                setModalQuantity(1);
                
                // NO mostrar carrito automáticamente
                // setShowCart(true);
              }}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
              isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              🛒 Agregar al Carrito
            </button>
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

      {/* Carrito flotante clásico - oculto si Pro activo */}
      {!showProCart && (
      <div className="fixed bottom-2 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* TELÓN UNIFICADO - SE DIBUJA ARRIBA DEL FOOTER */}
          {showTelon && (
            <div className={`mb-1 transition-all duration-300 border-t border-gray-300 ${
              isDarkMode 
                ? 'bg-gray-800/60 border-white/15' 
                : 'bg-white/60 border-gray-200/25'
            } backdrop-blur-sm shadow-2xl rounded-t-2xl`}>
              
              {/* CONTENIDO PRODUCTOS */}
              {telonContent === 'productos' && (
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                  <h3 className={`text-lg font-bold mb-3 text-center ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Productos seleccionados
                  </h3>
                  {cartItems.map((cartItem, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                    }`}>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={(() => {
                              const promoImages = ['/platos/milanesa-completa.jpg', '/platos/vacio-papas.jpg', '/platos/rabas.jpg'];
                              return promoImages[index % promoImages.length];
                            })()}
                            alt={cartItem.item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                                    <span class="text-xs">🍽️</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-xs ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {cartItem.item.name}
                          </div>
                        </div>
            </div>
            
                      <div className="flex items-center gap-1">
            <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (cartItem.quantity > 1) {
                              setCartItems(prev => prev.map((item, i) => 
                                i === index ? { ...item, quantity: item.quantity - 1 } : item
                              ));
                            } else {
                              setCartItems(prev => prev.filter((_, i) => i !== index));
                            }
                          }}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                isDarkMode 
                              ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                          }`}
                        >
                          -
                        </button>
                        <span className={`w-4 text-center text-xs font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCartItems(prev => prev.map((item, i) => 
                              i === index ? { ...item, quantity: item.quantity + 1 } : item
                            ));
                          }}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            isDarkMode 
                              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CONTENIDO ENTREGA - TELÓN VACÍO CON CARDS HORIZONTALES */}
              {telonContent === 'entrega' && (
                <div className="p-4">
                  <h3 className={`text-lg font-bold mb-4 text-center ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Seleccionar modalidad
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setModalidad('salon');
                        setShowTelon(false);
                      }}
                      className={`p-3 rounded-lg text-center transition-all hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">🏠</div>
                      <div className="font-bold text-sm">Local</div>
                      <div className={`text-xs mt-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        En el local
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setModalidad('retiro');
                        setShowTelon(false);
                      }}
                      className={`p-3 rounded-lg text-center transition-all hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">🏪</div>
                      <div className="font-bold text-sm">Mostrador</div>
                      <div className={`text-xs mt-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Retiro
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setModalidad('delivery');
                        setShowTelon(false);
                      }}
                      className={`p-3 rounded-lg text-center transition-all hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">🚚</div>
                      <div className="font-bold text-sm">Delivery</div>
                      <div className={`text-xs mt-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        A domicilio
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* CONTENIDO PAGOS - TELÓN VACÍO CON CARDS HORIZONTALES */}
              {telonContent === 'pagos' && (
                <div className="p-4">
                  <h3 className={`text-lg font-bold mb-4 text-center ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Seleccionar forma de pago
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setFormaPago('efectivo');
                        setShowTelon(false);
                        generateMPLink();
                      }}
                      className={`p-3 rounded-lg text-center transition-all hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">💵</div>
                      <div className="font-bold text-sm">Efectivo</div>
                      <div className={`text-xs mt-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Pago en cash
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setFormaPago('mp');
                        setShowTelon(false);
                        generateMPLink();
                      }}
                      className={`p-3 rounded-lg text-center transition-all hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">💳</div>
                      <div className="font-bold text-sm">Mercado Pago</div>
                      <div className={`text-xs mt-1 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Con tarjeta
                      </div>
                    </button>
                  </div>
                </div>
              )}
              
            </div>
          )}




          {/* FOOTER PÍLDORA - SIEMPRE EN EL MISMO LUGAR FIJO */}
          <div 
            className={`transition-all duration-300 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-300'
            } backdrop-blur-sm shadow-2xl ${
              showTelon ? 'rounded-b-none border-b-0' : 'rounded-2xl'
            }`}
          >
            <div className="py-1">
              <div className="flex items-center w-full px-3" style={{ gap: 'calc((100% - 81%) / 6)' }}>
                {/* Botón 1: Productos (27%) */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (cartItems.length > 0) {
                      if (showTelon && telonContent === 'productos') {
                        setShowTelon(false);
                        setProductosClicked(true);
                        animateArrows('next');
                      } else {
                        setTelonContent('productos');
                        setShowTelon(true);
                      }
                    }
                  }}
                  className={`flex items-center justify-between h-8 px-2.5 rounded-full cursor-pointer transition-all bg-transparent border-2 ${
                    cartItems.length > 0 
                      ? 'border-blue-500' 
                      : (isDarkMode ? 'border-gray-600' : 'border-gray-300')
                  }`}
                  style={{ width: '27%' }}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm -ml-4 ${
                    cartItems.length > 0 
                      ? 'bg-blue-500 text-white border-2 border-blue-500' 
                      : (isDarkMode ? 'bg-gray-600 text-white border-2 border-gray-600' : 'bg-gray-400 text-white border-2 border-gray-300')
                  }`}>🛒</span>
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {(() => {
                      const count = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
                      return (
                        <span className={`px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                          {count}
                        </span>
                      );
                    })()}
                  </span>
                </div>
                
                {/* Espacio + Animación AZUL (Productos → Entrega) */}
                <div className="flex items-center justify-center flex-shrink-0" style={{ minWidth: '0' }}>
                  {showArrowAnimation && arrowDirection === 'next' && telonContent === 'productos' && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                          key={i}
                          className="text-xs font-bold text-blue-500"
                          style={{
                            opacity: 0,
                            animation: `fadeInSlide 1.5s ease-in-out forwards`,
                            animationDelay: `${i * 0.15}s`
                          }}
                        >
                          &gt;
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Botón 2: Entrega (27%) */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (cartItems.length > 0 && productosClicked) {
                      if (showTelon && telonContent === 'entrega') {
                        setShowTelon(false);
                        animateArrows('next');
                      } else {
                        setTelonContent('entrega');
                        setShowTelon(true);
                      }
                    }
                  }}
                  className={`flex items-center justify-between h-8 px-2.5 rounded-full transition-all bg-transparent border-2 ${
                    cartItems.length > 0 && productosClicked
                      ? 'border-orange-500 cursor-pointer'
                      : (isDarkMode ? 'border-gray-600 cursor-not-allowed' : 'border-gray-300 cursor-not-allowed')
                  }`}
                  style={{ width: '27%' }}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm -ml-4 ${
                    cartItems.length > 0 && productosClicked
                      ? 'bg-orange-500 text-white border-2 border-orange-500'
                      : (isDarkMode ? 'bg-gray-600 text-white border-2 border-gray-600' : 'bg-gray-400 text-white border-2 border-gray-300')
                  }`}>🚚</span>
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {cartItems.length > 0 
                      ? (modalidad === 'salon' ? '🍽️' : modalidad === 'retiro' ? '🏬' : modalidad === 'delivery' ? '🚚' : '📦')
                      : '📦'}
                  </span>
                </div>
                
                {/* Espacio + Animación NARANJA (Entrega → Pagos) */}
                <div className="flex items-center justify-center flex-shrink-0" style={{ minWidth: '0' }}>
                  {showArrowAnimation && arrowDirection === 'next' && telonContent === 'entrega' && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                          key={i}
                          className="text-xs font-bold text-orange-500"
                          style={{
                            opacity: 0,
                            animation: `fadeInSlide 1.5s ease-in-out forwards`,
                            animationDelay: `${i * 0.15}s`
                          }}
                        >
                          &gt;
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Botón 3: Pagos (27%) */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (cartItems.length > 0 && modalidad) {
                      if (showTelon && telonContent === 'pagos') {
                        setShowTelon(false);
                        animateArrows('prev');
                      } else {
                        setTelonContent('pagos');
                        setShowTelon(true);
                      }
                    }
                  }}
                  className={`flex items-center justify-between h-8 px-2.5 rounded-full transition-all bg-transparent border-2 ${
                    cartItems.length > 0 && modalidad
                      ? 'border-purple-500 cursor-pointer'
                      : (isDarkMode ? 'border-gray-600 cursor-not-allowed' : 'border-gray-300 cursor-not-allowed')
                  }`}
                  style={{ width: '27%' }}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm -ml-4 ${
                    cartItems.length > 0 && modalidad
                      ? 'bg-purple-500 text-white border-2 border-purple-500'
                      : (isDarkMode ? 'bg-gray-600 text-white border-2 border-gray-600' : 'bg-gray-400 text-white border-2 border-gray-300')
                  }`}>💲</span>
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {cartItems.length > 0 
                      ? (formaPago === 'efectivo' ? '💵' : formaPago === 'mp' ? '💳' : '💲')
                      : '💲'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* FAB POC Carrito Pro */}
      {showProCart && (
        <button
          onClick={() => setShowProCartModal(true)}
          className={`fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full shadow-lg border-2 flex items-center justify-center transition-colors ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'
          }`}
          title="Ver carrito (POC)"
        >
          <span className="text-2xl">🛒</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {cartItems.reduce((t, it) => t + it.quantity, 0)}
            </span>
          )}
        </button>
      )}

      {/* Modal POC Carrito Pro */}
      {showProCart && showProCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowProCartModal(false)} />
          <div className={`relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden bg-white border border-gray-300 text-gray-900`}>
            <div className={`px-4 py-2 border-b bg-white border-gray-300`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Pedido/Comanda</h3>
                <button onClick={() => setShowProCartModal(false)} className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300`}>✕</button>
              </div>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {/* Ticket */}
              <div className={`rounded-lg mb-4 bg-white border border-gray-300`}>
                <div className="p-3 space-y-2">
                  {cartItems.length === 0 ? (
                    <div className={`text-center py-6 text-gray-600`}>Carrito vacío</div>
                  ) : (
                    cartItems.map((ci, index) => {
                      const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
                      const subtotal = price * ci.quantity;
                      return (
                        <div key={index} className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{ci.item.name} <span className={`ml-1 text-xs text-gray-600`}>({ci.code})</span></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`inline-flex items-center rounded-full overflow-hidden border border-gray-300 bg-white`}>
                              <button onClick={() => setCartItems(prev => prev.map((it, i) => i === index ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it))} className={`w-7 h-7 text-sm hover:bg-gray-100`}>-</button>
                              <span className="w-7 text-center text-sm font-semibold select-none">{ci.quantity}</span>
                              <button onClick={() => setCartItems(prev => prev.map((it, i) => i === index ? { ...it, quantity: it.quantity + 1 } : it))} className={`w-7 h-7 text-sm hover:bg-gray-100`}>+</button>
                            </div>
                            <div className="w-20 text-right text-sm font-semibold">{subtotal.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className={`px-3 py-2 border-t flex items-center justify-between border-gray-300 bg-white`}>
                  <div className="text-sm font-medium">Total</div>
                  <div className="text-base font-bold">
                    {(() => {
                      const total = cartItems.reduce((sum, it) => sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0);
                      return total.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0});
                    })()}
                  </div>
                </div>
              </div>

              {/* Formulario simple: cada fila label + control */}
              <div className={`space-y-3 rounded-lg border border-gray-300 bg-white p-3`}>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm text-gray-900">Nombre</label>
                  <input value={proName} onChange={(e)=>setProName(e.target.value)} className={`flex-1 rounded-lg px-3 py-2 border bg-white border-gray-300 text-gray-900`} placeholder="Nombre y apellido" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm text-gray-900">Dirección <span className={`text-gray-600`}>(Delivery)</span></label>
                  <input value={proAddress} onChange={(e)=>setProAddress(e.target.value)} className={`flex-1 rounded-lg px-3 py-2 border bg-white border-gray-300 text-gray-900`} placeholder="Calle y número" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm text-gray-900">Pago</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="pago" checked={proPayment==='efectivo'} onChange={()=>setProPayment('efectivo')} /> Efectivo</label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="pago" checked={proPayment==='mp'} onChange={()=>setProPayment('mp')} /> MP</label>
                  </div>
                </div>
              </div>
            </div>

            <div className={`px-4 py-3 border-t flex gap-3 border-gray-300 bg-white`}>
              <button onClick={()=>setShowProCartModal(false)} className={`flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900`}>✖ Cancelar</button>
              <button
                onClick={() => {
                  if (cartItems.length === 0) { alert('Carrito vacío'); return; }
                  const mod = proAddress.trim() ? 'delivery' : 'retiro';
                  if (mod === 'delivery') {
                    if (!proName.trim()) { alert('Ingresá tu nombre para delivery'); return; }
                    if (!proAddress.trim()) { alert('Ingresá la dirección para delivery'); return; }
                    if (!proPayment) { alert('Seleccioná forma de pago'); return; }
                  }
                  setModalidad(mod as any);
                  setFormaPago((proPayment || 'efectivo') as any);
                  if (proPayment === 'mp') {
                    // Explicar y enviar ticket por WhatsApp, luego redirigir a MP
                    try {
                      const phone = '5491165695648';
                      const msg = buildTicketMessage() + '\nPago: Mercado Pago (pendiente)';
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                    } catch {}
                    alert('Te redirigimos a Mercado Pago para completar el pago. Al finalizar, tendrás el comprobante.');
                    setTimeout(()=>{ generateMPLink(); }, 300);
                  } else {
                    alert(`Pedido confirmado!\nNombre: ${proName || 'Cliente'}\nModalidad: ${mod.toUpperCase()}\nPago: ${proPayment || 'efectivo'}`);
                  }
                  setShowProCartModal(false);
                }}
                className={`flex-1 py-2 rounded-lg text-white ${proPayment==='mp' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {proPayment==='mp' ? '💳 Pagar con MP' : '✅ Confirmar pedido'}
              </button>
              <button
                onClick={() => {
                  if (cartItems.length === 0) { alert('Carrito vacío'); return; }
                  const phone = '5491165695648';
                  const text = encodeURIComponent(buildTicketMessage());
                  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                }}
                className={`px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900`}
                title="Enviar ticket por WhatsApp"
              >
                📲 WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animación de flecha */}
      {animationActive && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="animate-bounce text-2xl text-orange-500">
            →
          </div>
        </div>
      )}

      {/* Cards de selección de modalidad */}
      {showModalidadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-4xl mx-auto px-4 w-full">
            <div className={`p-6 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-bold mb-6 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Seleccionar modalidad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setModalidad('salon');
                    setShowModalidadModal(false);
                  }}
                  className={`p-6 rounded-lg text-center transition-all hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-3">🏠</div>
                  <div className="font-bold text-lg">Local</div>
                  <div className={`text-sm mt-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Consumir en el local
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setModalidad('retiro');
                    setShowModalidadModal(false);
                  }}
                  className={`p-6 rounded-lg text-center transition-all hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-3">🏪</div>
                  <div className="font-bold text-lg">Mostrador</div>
                  <div className={`text-sm mt-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Retirar en mostrador
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setModalidad('delivery');
                    setShowModalidadModal(false);
                  }}
                  className={`p-6 rounded-lg text-center transition-all hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-3">🚚</div>
                  <div className="font-bold text-lg">Delivery</div>
                  <div className={`text-sm mt-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Envío a domicilio
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => setShowModalidadModal(false)}
                className={`mt-6 w-full p-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reseñas - Formulario Google Style */}
      {showMencionesModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Cerrar modal si se hace clic en el fondo oscuro
            if (e.target === e.currentTarget) {
              setShowMencionesModal(false);
            }
          }}
        >
          <div className="max-w-2xl mx-auto px-4 w-full">
            <div className={`rounded-lg max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              
              {/* Header del Modal */}
              <div className={`p-6 border-b ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Esquina Pompeya Restaurant Bar
                  </h2>
                  <button
                    onClick={() => setShowMencionesModal(false)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Contenido del Formulario */}
              <div className="p-6 space-y-6">
                
                {/* Perfil del Usuario */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    JC
                  </div>
                  <div>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Juan Carlos Dileo
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Se mostrará públicamente en Google
                    </p>
                  </div>
                </div>

                {/* Calificación General */}
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Calificación general
                  </h3>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="text-3xl text-yellow-400 hover:text-yellow-300">
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calificaciones por Categoría */}
                <div className="space-y-4">
                  {[
                    { name: 'Comida', icon: '🍽️' },
                    { name: 'Servicio', icon: '👨‍💼' },
                    { name: 'Ambiente', icon: '🏠' }
                  ].map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {category.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} className="text-2xl text-yellow-400 hover:text-yellow-300">
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Área de Texto para Reseña */}
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Escribe tu reseña
                  </h3>
                  <textarea
                    className={`w-full h-32 p-4 rounded-lg border resize-none ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Comparte tu experiencia..."
                    defaultValue="Cada día se come mejor, el lugar mejor ubicado de la zona! Muy recomendable. Para probar la Milanesa Esquina ideal para compartir"
                  />
                </div>

                {/* Agregar Fotos */}
                <div>
                  <button className={`w-full p-4 rounded-lg border-2 border-dashed flex items-center justify-center gap-3 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                      : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                  }`}>
                    <span className="text-2xl">📷</span>
                    <span>Agregar fotos y videos</span>
                  </button>
                </div>

                {/* Rango de Precios */}
                <div>
                  <h3 className={`text-lg font-medium mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ¿Cuánto gastaste por persona?
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '$1-5,000',
                      '$5,000-10,000', 
                      '$10,000-12,000',
                      '$12,000-15,000',
                      '$15,000-20,000',
                      '$20,000-25,000'
                    ].map((range, index) => (
                      <button
                        key={range}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          index === 2 // Seleccionar $10,000-12,000 por defecto
                            ? 'bg-blue-500 text-white border-blue-500'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowMencionesModal(false)}
                    className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Redirigir a Google Maps para publicar la reseña
                      window.open('https://www.google.com/maps/search/Esquina+Pompeya+Restaurant+Bar', '_blank');
                      setShowMencionesModal(false);
                    }}
                    className="flex-1 py-3 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    Publicar
            </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes fadeInSlide {
          0% { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          50% { 
            opacity: 1; 
            transform: translateX(0); 
          }
          100% { 
            opacity: 0; 
            transform: translateX(0); 
          }
        }
      `}</style>


    </div>
  );
}