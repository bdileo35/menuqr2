"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDemoMenuData } from '@/lib/demo-data';
import { useAppTheme } from '../../hooks/useAppTheme';

interface MenuItem {
  id?: string;
  name: string;
  price: string;
  description?: string;
  isAvailable?: boolean;
  imageBase64?: string | null;
  code?: string;
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

export default function CartaPage() {
  const router = useRouter();
  const params = useParams();
  const idUnico = (params?.idUnico as string) || '5XJ1J37F';
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useAppTheme();
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [modalItemImage, setModalItemImage] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [showMapsModal, setShowMapsModal] = useState(false);
  const [showMencionesModal, setShowMencionesModal] = useState(false);
  const [showArrowAnimation, setShowArrowAnimation] = useState(false);
  const [arrowDirection, setArrowDirection] = useState<'next' | 'prev' | null>(null);
  const [cartItems, setCartItems] = useState<Array<{item: MenuItem, quantity: number, code: string}>>([]);
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
  const [showProCart, setShowProCart] = useState(true);
  const [showProCartModal, setShowProCartModal] = useState(false);
  const [proName, setProName] = useState('');
  const [proAddress, setProAddress] = useState('');
  const [proPayment, setProPayment] = useState<'efectivo' | 'mp' | null>(null);
  const [waPhone, setWaPhone] = useState<string>(process.env.NEXT_PUBLIC_ORDER_WHATSAPP || '5491165695648');

  const buildTicketMessage = () => {
    const lines: string[] = [];
    lines.push(`Pedido - ${menuData?.restaurantName || 'Mi Restaurante'}`);
    if (proName) lines.push(`Nombre: ${proName}`);
    if (proAddress) lines.push(`Dirección: ${proAddress}`);
    lines.push('---');
    cartItems.forEach(ci => {
      const nameNoParens = (ci.item.name || '').replace(/\s*\([^)]*\)\s*$/, '');
      const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
      lines.push(`${ci.quantity} x ${nameNoParens} - ${price.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}`);
    });
    const total = cartItems.reduce((sum, it) => sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0);
    lines.push('---');
    lines.push(`Total: ${total.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}`);
    if (proPayment) lines.push(`Pago: ${proPayment === 'mp' ? 'Mercado Pago' : 'Efectivo'}`);
    return lines.join('\n');
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === undefined ? false : !prev[categoryId]
    }));
  };

  const generateMPLink = async () => {
    if (!modalidad || !formaPago) return;
    const total = cartItems.reduce((sum, cartItem) => {
      const price = parseFloat(cartItems.length ? cartItems[0].item.price.replace('$','').replace(',','') : '0');
      return sum + (price * cartItem.quantity);
    }, 0);
    try {
      const response = await fetch('/api/tienda/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pedido',
          precio: total,
          descripcion: `Pedido - ${modalidad} - ${cartItems.length} productos`,
          items: cartItems.map(item => ({
            nombre: item.item.name,
            precio: parseFloat(item.item.price.replace('$','').replace(',','')),
            cantidad: item.quantity,
            codigo: item.code
          }))
        })
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
      try {
        const response = await fetch(`/api/menu/${idUnico}`);
        const data = await response.json();
        if (data.success && data.menu) {
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
                isAvailable: item.isAvailable,
                code: item.code
              }))
            }))
          };

          // Fusionar con ediciones locales del editor (incluye nuevos items)
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
                      imageBase64: hasLocalImageProp ? si.imageBase64 : (ri as any).imageBase64,
                    } as any;
                  });
                  const existingIdOrName = new Set(mergedExisting.map(i => (i as any).id || (i as any).name));
                  const onlyLocal = sc.items.filter((si: any) => !existingIdOrName.has(si.id || si.name));
                  return {
                    ...rc,
                    description: (typeof sc.description === 'string' && sc.description.length > 0) ? sc.description : rc.description,
                    items: [...mergedExisting, ...onlyLocal]
                  };
                })
              };
            }
          } catch (mergeErr) {
            console.warn('No se pudo fusionar ediciones locales en Carta:', mergeErr);
          }

          setMenuData(restaurantInfo);
          try { if (data?.menu?.allowOrdering === true) setShowProCart(true); } catch {}
          const initialExpanded: {[key: string]: boolean} = {};
          restaurantInfo.categories.forEach(cat => { initialExpanded[cat.id || cat.name] = true; });
          setExpandedCategories(initialExpanded);
        } else {
          throw new Error('No se pudo cargar el menú');
        }
      } catch (error) {
        console.error('Error cargando menú desde API:', error);
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
        } else {
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

    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('procart') === '1' || sp.get('pro') === '1' || process.env.NEXT_PUBLIC_CART_PRO === '1') {
        setShowProCart(true);
      } else if (sp.get('procart') === '0' || sp.get('pro') === '0') {
        setShowProCart(false);
      }
      const wa = sp.get('wa');
      if (wa) setWaPhone(wa);
    } catch {}

    loadMenuFromAPI();
  }, []);

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
          <button onClick={() => router.push('/setup-comercio')} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">Guardar</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 relative ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-4 pt-2 pb-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <img src="/demo-images/logo.png?v=2" alt="Logo" className="w-[180px] h-auto rounded-lg object-contain cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowMapsModal(true)} title="Ver ubicación en Google Maps" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/demo-images/Logo.jpg?v=2'; }} />
            </div>
            <div className="flex flex-col gap-2 ml-auto">
              <div className="flex items-center gap-2 w-full">
                <button onClick={(e)=>{e.preventDefault();e.stopPropagation();setShowMencionesModal(true);}} className={`flex-1 h-8 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${isDarkMode? 'bg-gray-700 hover:bg-gray-600 text-gray-300':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}> <span className="text-lg">🔍</span><span className="text-sm font-medium">Reseñas</span></button>
                <button onClick={(e)=>{e.preventDefault();e.stopPropagation();toggleTheme();}} className={`flex-1 h-8 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${isDarkMode? 'bg-gray-700 hover:bg-gray-600 text-yellow-400':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title={isDarkMode? 'Cambiar a modo claro':'Cambiar a modo oscuro'}> <span className="text-lg">{isDarkMode?'☀️':'🌙'}</span> <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{isDarkMode?'Claro':'Oscuro'}</span></button>
              </div>
              {showSearch ? (
                <div className="relative w-full">
                  <input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Buscar platos..." className={`w-full h-8 pl-3 pr-10 text-sm rounded-lg transition-colors duration-300 ${isDarkMode? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500':'bg-gray-200 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500'}`} autoFocus />
                  <button onClick={()=>setSearchTerm('')} className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded flex items-center justify-center transition-colors text-sm ${isDarkMode? 'hover:bg-gray-600 text-gray-300':'hover:bg-gray-300 text-gray-800'}`} title="Limpiar filtro">✕</button>
                </div>
              ) : (
                <button onClick={()=>setShowSearch(true)} className={`w-full h-8 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${isDarkMode? 'bg-gray-700 hover:bg-gray-600 text-gray-300':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`} title="Buscar platos"> <span className="text-lg">🔍</span><span className="text-sm font-medium">Buscar platos...</span></button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {menuData.categories.length === 0 ? (
          <div className="text-center py-12">
            <h2 className={`text-xl mb-4 ${isDarkMode? 'text-gray-300':'text-gray-600'}`}>📝 Menú en construcción</h2>
            <p className={`${isDarkMode? 'text-gray-400':'text-gray-500'} mb-6`}>Agrega categorías y productos desde el editor</p>
            <button onClick={()=>router.push('/editor')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">Guardar</button>
          </div>
        ) : (
          menuData.categories.filter(category => {
            if (searchTerm && filterItems(category.items).length === 0) return false; return true;
          }).map((category, index) => (
            <div key={category.id || index} className={`mb-4 rounded-lg border ${isDarkMode? 'bg-gray-800 border-gray-700':'bg-white border-gray-300'}`}>
              <div className={`px-3 py-1 border-b rounded-t-lg cursor-pointer hover:opacity-80 ${isDarkMode? 'bg-gray-700 border-gray-600':'bg-gray-200 border-gray-300'}`} onClick={()=>toggleCategory(category.id || category.name)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2 pl-2">
                    <span className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full border ${isDarkMode? 'bg-transparent border-gray-500 text-white':'bg-transparent border-gray-500 text-gray-800'}`}>{filterItems(category.items).length}</span>
                    <div className="flex flex-col">
                      <h2 className={`text-base font-bold leading-tight ${isDarkMode? 'text-white':'text-gray-800'}`}>{category.name}</h2>
                      {category.description && (<span className={`text-[11px] leading-tight ${isDarkMode? 'text-gray-300':'text-gray-700'}`}>{category.description}</span>)}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-300">{expandedCategories[category.id || category.name] ? '▼' : '▲'}</button>
                </div>
              </div>
              {expandedCategories[category.id || category.name] !== false && (
                <div className={`px-3 pb-3 ${category.name.toUpperCase().includes('PROMO') ? 'pt-3 flex flex-wrap justify-evenly gap-2' : 'pt-0 space-y-0'}`}>
                  {filterItems(category.items).map((item, itemIndex) => (
                    category.name.toUpperCase().includes('PROMO') ? (
                      <div key={item.id || itemIndex} className="flex flex-col hover:opacity-90 transition-opacity duration-300 w-[calc(33.333%-0.5rem)] cursor-pointer h-full rounded-lg overflow-hidden" style={{ minHeight: '140px' }} onClick={()=>{setModalItem(item); const promoImages = ['/platos/milanesa-completa.jpg','/platos/vacio-papas.jpg','/platos/rabas.jpg']; setModalItemImage(promoImages[itemIndex % promoImages.length]);}} title="Click para ver detalles">
                        <div className={`px-3 py-2 border-b ${isDarkMode? 'bg-gray-700 border-gray-600':'bg-gray-200 border-gray-300'}`}>
                          <h3 className={`text-sm font-bold text-center ${isDarkMode? 'text-white':'text-gray-800'}`}>{(/\([^\)]*\)\s*$/.test(item.name||'')) ? (item.name||'').replace(/\s*\([^)]*\)\s*$/, '').trim() : item.name}</h3>
                        </div>
                        <div className="h-24 overflow-hidden">
                          <img src={['/platos/milanesa-completa.jpg','/platos/vacio-papas.jpg','/platos/rabas.jpg'][itemIndex % 3]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className={`${isDarkMode? 'bg-gray-700':'bg-gray-200'} p-2`}>
                          {(() => { const hasParens = /\([^\)]*\)\s*$/.test(item.name||''); const desc = item.description && item.description.length>0 ? item.description : (hasParens ? (item.name.match(/\(([^)]*)\)\s*$/)?.[1] || '' ) : ''); return desc ? (<p className={`${isDarkMode? 'text-gray-300':'text-gray-800'} text-xs text-center min-h-[2rem] flex items-center justify-center`}>{desc}</p>) : null; })()}
                          <div className="text-sm font-bold text-center text-blue-500 mt-2">{item.price.replace('$$','$')}</div>
                        </div>
                      </div>
                    ) : (
                      <div key={item.id || itemIndex} className={`flex items-center border-b ${isDarkMode? 'border-gray-700':'border-gray-200'} ${item.isAvailable === false ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`} title={`${item.code ? `#${item.code}` : ''}${(() => { const hasParens = /\([^\)]*\)\s*$/.test(item.name||''); const d = item.description && item.description.length>0 ? item.description : (hasParens ? (item.name.match(/\(([^)]*)\)\s*$/)?.[1] || '' ) : ''); return (item.code? ' ' : '') + (d||''); })()}`} onClick={()=>{ if (item.isAvailable !== false) { setModalItem(item); const fallbacks = ['/platos/albondigas.jpg','/platos/rabas.jpg','/platos/IMG-20250926-WA0005.jpg']; setModalItemImage(item.imageBase64 || fallbacks[itemIndex % fallbacks.length]); }}}>
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ml-0 mr-2 my-1">
                          {item.imageBase64 ? (
                            <img src={item.imageBase64} alt={item.name} className={`w-full h-full object-cover ${item.isAvailable === false ? 'grayscale' : ''}`} />
                          ) : (
                            <img src={['/platos/albondigas.jpg','/platos/rabas.jpg','/platos/IMG-20250926-WA0005.jpg'][itemIndex % 3]} alt={item.name} className={`w-full h-full object-cover ${item.isAvailable === false ? 'grayscale' : ''}`} />
                          )}
                        </div>
                        <div className={`flex-1 flex items-center justify-between px-2 py-1 ${item.isAvailable === false ? 'text-gray-400' : isDarkMode ? 'text-white' : 'text-black'}`}>
                          <div className="flex-1"><h3 className={`font-medium text-xs leading-tight ${item.isAvailable === false ? 'text-gray-400' : isDarkMode ? 'text-white' : 'text-black'}`}>{(/\([^\)]*\)\s*$/.test(item.name||'')) ? (item.name||'').replace(/\s*\([^)]*\)\s*$/, '').trim() : item.name}</h3></div>
                          <div className="flex items-center gap-1">
                            {item.isAvailable === false && (<div className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-200 text-gray-600 border border-red-300">AGOTADO</div>)}
                            <div className={`text-sm font-bold ${item.isAvailable === false ? 'text-gray-400' : 'text-blue-500'}`}>{item.price.replace('$$','$')}</div>
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
      </div>

      {modalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={()=>setModalItem(null)}>
          <div className={`${isDarkMode? 'bg-gray-800':'bg-white'} max-w-md w-full rounded-xl p-6`} onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`${isDarkMode? 'text-white':'text-gray-900'} text-xl font-bold`}>{modalItem.name}</h2>
              <button onClick={()=>setModalItem(null)} className={`${isDarkMode? 'bg-gray-700 hover:bg-gray-600 text-gray-300':'bg-gray-200 hover:bg-gray-300 text-gray-700'} w-8 h-8 rounded-full flex items-center justify-center`}>✕</button>
            </div>
            <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
              <img src={modalItemImage || '/platos/albondigas.jpg'} alt={modalItem.name} className="w-full h-full object-cover" />
            </div>
            {modalItem.description && (<div className="mb-4"><p className={`${isDarkMode? 'text-gray-300':'text-gray-600'} text-sm`}>{modalItem.description}</p></div>)}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={()=>setModalQuantity(Math.max(1, modalQuantity-1))} className={`${isDarkMode? 'bg-gray-700 hover:bg-gray-600 text-gray-300':'bg-gray-200 hover:bg-gray-300 text-gray-700'} w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold`}>-</button>
                <span className={`${isDarkMode? 'text-white':'text-gray-900'} text-lg font-bold`}>{modalQuantity}</span>
                <button onClick={()=>setModalQuantity(modalQuantity+1)} className={`${isDarkMode? 'bg-gray-700 hover:bg-gray-600 text-gray-300':'bg-gray-200 hover:bg-gray-300 text-gray-700'} w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold`}>+</button>
              </div>
              <div className={`${isDarkMode? 'bg-gray-700 border-2 border-gray-600':'bg-transparent'} text-xl font-bold px-4 py-2 rounded-lg text-blue-500`}>{modalItem.price.replace('$$','$')}</div>
            </div>
            <button onClick={()=>{ const code = `0${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`; setCartItems(prev=>[...prev,{ item: modalItem, quantity: modalQuantity, code }]); setModalItem(null); setModalQuantity(1); }} className={`${isDarkMode? 'bg-blue-600 hover:bg-blue-700 text-white':'bg-blue-500 hover:bg-blue-600 text-white'} w-full py-3 rounded-lg font-bold text-lg`}>🛒 Agregar al Carrito</button>
          </div>
        </div>
      )}

      {/* FAB Pro */}
      {showProCart && (
        <button onClick={()=>setShowProCartModal(true)} className={`${isDarkMode? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600':'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'} fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full shadow-lg border-2 flex items-center justify-center`} title="Ver carrito (POC)"> <span className="text-2xl">🛒</span>{cartItems.length>0 && (<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">{cartItems.reduce((t,it)=>t+it.quantity,0)}</span>)}</button>
      )}

      {showProCart && showProCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setShowProCartModal(false)} />
          <div className={`relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden bg-white border border-gray-300 text-gray-900`}>
            <div className={`px-4 py-2 border-b bg-white border-gray-300`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Pedido/Comanda</h3>
                <button onClick={()=>setShowProCartModal(false)} className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300`}>✕</button>
              </div>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
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
                          <div className="flex items-center gap-1 ml-auto">
                            <div className={`inline-flex items-center rounded-full overflow-hidden border border-gray-300 bg-white`}>
                              <button onClick={()=>setCartItems(prev=>{ const next=[...prev]; if(next[index].quantity>1){ next[index]={...next[index], quantity: next[index].quantity-1}; } else { next.splice(index,1); } return next; })} className={`w-6 h-6 text-sm hover:bg-gray-100`}>-</button>
                              <span className="w-6 text-center text-sm font-semibold select-none">{ci.quantity}</span>
                              <button onClick={()=>setCartItems(prev=>prev.map((it,i)=> i===index ? { ...it, quantity: it.quantity+1} : it))} className={`w-6 h-6 text-sm hover:bg-gray-100`}>+</button>
                            </div>
                            <div className="w-16 text-right text-sm font-semibold">{subtotal.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                            <button onClick={()=>setCartItems(prev=>prev.filter((_,i)=>i!==index))} className={`w-6 h-6 text-sm rounded hover:bg-gray-100`} title="Quitar">✖</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className={`px-3 py-2 border-t flex items-center justify-between border-gray-300 bg-white`}>
                  <div className="text-sm font-medium">Total</div>
                  <div className="text-base font-bold">{(() => { const total = cartItems.reduce((sum,it)=> sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0); return total.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0}); })()}</div>
                </div>
              </div>

              {/* Formulario simple: cada fila label + control */}
              <div className={`space-y-3 rounded-lg border border-gray-300 bg-white p-3`}>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm text-gray-900">Nombre</label>
                  <input value={proName} onChange={(e)=>setProName(e.target.value)} className={`flex-1 rounded-lg px-3 py-1.5 h-8 text-sm border bg-white border-gray-300 text-gray-900`} placeholder="Nombre" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-sm text-gray-900">Dirección <span className={`text-gray-600`}>(Delivery)</span></label>
                  <input value={proAddress} onChange={(e)=>setProAddress(e.target.value)} className={`flex-1 rounded-lg px-3 py-1.5 h-8 text-sm border bg-white border-gray-300 text-gray-900`} placeholder="Calle y número" />
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
              <button onClick={()=>{ if (cartItems.length===0) { alert('Carrito vacío'); return; } const mod = proAddress.trim() ? 'delivery' : 'retiro'; if (mod==='delivery') { if (!proName.trim()) { alert('Ingresá tu nombre para delivery'); return; } if (!proAddress.trim()) { alert('Ingresá la dirección para delivery'); return; } if (!proPayment) { alert('Seleccioná forma de pago'); return; } } setModalidad(mod as any); setFormaPago((proPayment || 'efectivo') as any); if (proPayment === 'mp') { try { const msg = buildTicketMessage() + '\nPago: Mercado Pago (pendiente)'; window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, '_blank'); } catch {} alert('Te redirigimos a Mercado Pago para completar el pago.'); setTimeout(()=>{ generateMPLink(); }, 300); } else { alert(`Pedido confirmado!`); } setShowProCartModal(false); }} className={`flex-1 py-2 rounded-lg text-white ${proPayment==='mp' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>{proPayment==='mp' ? '💳 Pagar con MP' : '✅ Confirmar pedido'}</button>
              <button onClick={()=>{ if (cartItems.length===0) { alert('Carrito vacío'); return; } const text = encodeURIComponent(buildTicketMessage()); window.open(`https://wa.me/${waPhone}?text=${text}`, '_blank'); }} className={`px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900`} title="Enviar ticket por WhatsApp">📲 WhatsApp</button>
            </div>
          </div>
        </div>
      )}

      {animationActive && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"><div className="animate-bounce text-2xl text-orange-500">→</div></div>
      )}
    </div>
  );
}
