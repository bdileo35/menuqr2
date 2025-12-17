"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getDemoMenuData, getDemoMenuDataLosToritos } from '@/lib/demo-data';
import { useAppTheme } from '../../hooks/useAppTheme';

interface MenuItem {
  id?: string;
  name: string;
  price: string;
  description?: string;
  isAvailable?: boolean;
  imageBase64?: string | null;
  imageUrl?: string | null;
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
  logoUrl?: string | null;
  hasPro?: boolean;  // Si tiene versión PRO comprada
  categories: MenuCategory[];
}

export default function CartaPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const idUnico = params?.idUnico as string;
  // Detectar si es modo interno (uso en cocina) - por parámetro o por defecto en Salón
  const isModoInterno = searchParams?.get('interno') === '1' || false;
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuNotFound, setMenuNotFound] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
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
  const [modalidad, setModalidad] = useState<'delivery' | 'retiro' | 'salon'>('delivery');
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  const [animationActive, setAnimationActive] = useState(false);
  const [showProCart, setShowProCart] = useState(false);  // Solo visible si hasPro=true
  const [showProCartModal, setShowProCartModal] = useState(false);
  const [showComandaPreview, setShowComandaPreview] = useState(false);
  const [showTicketInModal, setShowTicketInModal] = useState(false); // Nuevo: ticket dentro del modal del carrito
  const [comandaCode, setComandaCode] = useState('');
  const [proName, setProName] = useState('');
  const [proAddress, setProAddress] = useState('');
  const [proMesa, setProMesa] = useState('');
  const [proMesera, setProMesera] = useState('');
  const [waiters, setWaiters] = useState<string[]>(['Maria', 'Lucia', 'Carmen']); // Valores por defecto
  const [proPayment, setProPayment] = useState<'efectivo' | 'mp' | null>(null);
  const [customerNotes, setCustomerNotes] = useState(''); // Campo de observaciones
  const [waPhone, setWaPhone] = useState<string>(process.env.NEXT_PUBLIC_ORDER_WHATSAPP || '5491165695648');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const storageKey = `pro-cart-${idUnico}`;
  const [cartHydrated, setCartHydrated] = useState(false);

  function generateOrderCode(mode: 'delivery' | 'retiro' | 'salon') {
    const prefix = mode === 'delivery' ? 'D' : mode === 'retiro' ? 'T' : 'S';
    
    // Algoritmo: timestamp (últimos 2 dígitos) + random (2 dígitos)
    // Ejemplo: S1234 = S + (12 de timestamp) + (34 random)
    const timestamp = Date.now();
    const lastTwoDigits = timestamp % 100; // Últimos 2 dígitos del timestamp
    const randomTwo = Math.floor(Math.random() * 100); // 2 dígitos aleatorios
    
    // Combinar: últimos 2 del timestamp + 2 aleatorios = 4 dígitos
    const number = (lastTwoDigits * 100 + randomTwo).toString().padStart(4, '0');
    
    return `${prefix}${number}`;
  }

  const [orderCode, setOrderCode] = useState<string>(() => generateOrderCode('delivery'));

  const ensureOrderCodeForMode = (mode: 'delivery' | 'retiro' | 'salon') => {
    const expectedPrefix = mode === 'delivery' ? 'D' : mode === 'retiro' ? 'T' : 'S';
    if (orderCode.startsWith(expectedPrefix)) return orderCode;
    const newCode = generateOrderCode(mode);
    setOrderCode(newCode);
    return newCode;
  };

  const buildTicketMessage = (modeOverride?: 'delivery' | 'retiro' | 'salon', codeOverride?: string) => {
    const mode = modeOverride || modalidad;
    const code = codeOverride || orderCode;
    const lines: string[] = [];
    lines.push(`Pedido - ${menuData?.restaurantName || 'Restaurante'}`);
    if (code) {
      const modeLabel = mode === 'delivery' ? 'Delivery' : mode === 'retiro' ? 'Take Away' : 'Salón';
      lines.push(`${modeLabel} - ${code}`);
    }
    if (mode === 'delivery' && proAddress) {
      lines.push(`Dirección: ${proAddress}`);
    } else if (mode === 'retiro' && proName) {
      lines.push(`Nombre: ${proName}`);
    } else if (mode === 'salon') {
      if (proMesa) lines.push(`Mesa: ${proMesa}`);
      if (proMesera) lines.push(`Atendió: ${proMesera}`);
    }
    lines.push('---');
    cartItems.forEach(ci => {
      const nameNoParens = (ci.item.name || '').replace(/\s*\([^)]*\)\s*$/, '');
      const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
      lines.push(`${ci.quantity} x ${nameNoParens} - ${price.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}`);
    });
    const total = cartItems.reduce((sum, it) => sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0);
    lines.push('---');
    lines.push(`Total: ${total.toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}`);
    if (customerNotes.trim()) {
      lines.push(`Obs.: ${customerNotes.trim()}`);
    }
    if (proPayment) lines.push(`Pago: ${proPayment === 'mp' ? 'Mercado Pago' : 'Efectivo'}`);
    return lines.join('\n');
  };

  const showComandaPreviewModal = (code: string) => {
    setComandaCode(code);
    setShowComandaPreview(true);
  };

  const printComanda = (code: string) => {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const hora = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const total = cartItems.reduce((sum, it) => sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0);
    // En modo interno (Salón), siempre es uso interno (para cocina)
    const esUsoInterno = modalidad === 'salon' || isModoInterno;
    
    const comandaHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Comanda ${code}</title>
  <style>
    @media print {
      @page {
        size: 58mm auto;
        margin: 0;
      }
      body {
        margin: 0;
        padding: 3mm 2mm;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        line-height: 1.4;
        width: 58mm;
      }
    }
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      max-width: 58mm;
      width: 58mm;
      margin: 0 auto;
      padding: 3mm 2mm;
    }
    .header {
      margin-bottom: 10px;
      border-bottom: 1px dashed #000;
      padding-bottom: 5px;
    }
    .comanda-title {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .info-line {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      font-size: 11px;
    }
    .separator {
      margin: 8px 0;
      border: none;
      display: none;
    }
    .item-line {
      margin: 6px 0;
    }
    .item-name {
      display: block;
      margin-bottom: 3px;
      word-wrap: break-word;
      line-height: 1.4;
      font-size: 11px;
    }
    .item-details {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-top: 2px;
    }
    .item-quantity {
      display: inline-block;
    }
    .item-price {
      text-align: right;
      white-space: nowrap;
    }
    .total {
      font-weight: bold;
      font-size: 14px;
      margin-top: 5px;
    }
    .footer {
      margin-top: 5px;
      text-align: center;
      font-size: 8px;
      border-top: 1px dashed #000;
      padding-top: 3px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="comanda-title">
      <span style="font-size: 18px; font-weight: bold;">COMANDA</span>
      <span style="font-size: 12px; font-weight: normal;">${code}</span>
    </div>
  </div>
  
  <div class="info-line">
    <span>${fecha} ${hora}</span>
  </div>
  <div class="info-line" style="margin: 4px 0;">
    <span>Mesa: ${proMesa || '___'}-${proMesera || '__________'}</span>
  </div>
  
  <div style="margin: 5px 0; text-align: center; font-size: 10px;">-------------------------</div>
  
  ${cartItems.map(ci => {
    const nameNoParens = (ci.item.name || '').replace(/\s*\([^)]*\)\s*$/, '');
    const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
    const subtotal = price * ci.quantity;
    return `
      <div class="item-line">
        <div class="item-name">${nameNoParens}</div>
        <div class="item-details">
          <span class="item-quantity">Cant: ${ci.quantity}</span>
          <span class="item-price">$${subtotal.toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
        </div>
      </div>
    `;
  }).join('')}
  
  <div class="item-line total">
    <span>TOTAL:</span>
    <span class="item-price">$${total.toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
  </div>
  
  ${customerNotes.trim() ? `
    <div class="separator"></div>
    <div class="info-line">
      <span>Obs: ${customerNotes.trim()}</span>
    </div>
  ` : ''}
  
  ${!esUsoInterno ? `
    <div class="footer">
      ${menuData?.restaurantName || 'Restaurante'}<br>
      ${menuData?.address || ''}
    </div>
  ` : ''}
</body>
</html>
    `;
    
    // Crear ventana de impresión optimizada para impresoras térmicas 48mm
    // Compatible con Android (Bluetooth 4.0) - funciona desde el celular de la mesera
    const printWindow = window.open('', '_blank', 'width=200,height=300');
    if (printWindow) {
      printWindow.document.write(comandaHTML);
      printWindow.document.close();
      
      // Esperar a que cargue el contenido y luego imprimir
      setTimeout(() => {
        printWindow.focus();
        // window.print() funciona en Android y usará la impresora predeterminada
        // Si la H22 está emparejada por Bluetooth, aparecerá en el diálogo
        // No cerramos automáticamente para que el usuario pueda ver y seleccionar la impresora
        printWindow.print();
        
        // Cerrar la ventana después de un delay más largo (dar tiempo para seleccionar impresora)
        setTimeout(() => {
          printWindow.close();
        }, 5000);
      }, 500);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === undefined ? false : !prev[categoryId]
    }));
  };

  const generateMPLink = async () => {
    if (proPayment !== 'mp') return;
    const currentMode = modalidad;
    const total = cartItems.reduce((sum, cartItem) => {
      const price = parseFloat((cartItem.item.price || '').replace(/[$,\s]/g, '')) || 0;
      return sum + price * cartItem.quantity;
    }, 0);
    try {
      const response = await fetch('/api/tienda/crear-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pedido',
          precio: total,
          descripcion: `Pedido - ${currentMode} - ${cartItems.length} productos`,
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
        console.log('🔍 Carta - Status de la respuesta:', response.status);
        
        // Si es 404, el menú no existe para este IDU
        if (response.status === 404) {
          console.log(`⚠️ No se encontró menú para IDU: ${idUnico}`);
          setMenuNotFound(true);
          setMenuData(null);
          setLoading(false);
          return;
        }
        
        // Si es 500, hay un error de conexión - intentar fallback con datos demo
        if (response.status === 500) {
          console.log('⚠️ Error de conexión a la base de datos (500)');
          console.log('📦 Intentando fallback con datos demo para', idUnico);
          
          // FALLBACK: Intentar cargar datos demo para IDUs conocidos
          try {
            if (idUnico === '5XJ1J37F') {
              console.log('📦 Usando datos demo de Esquina Pompeya');
              const demoData = getDemoMenuData();
              // Agregar campos requeridos para RestaurantData
              const restaurantInfo: RestaurantData = {
                ...demoData,
                address: 'Av. Fernández de la Cruz 1100',
                phone: '+54 11 1234-5678',
                logoUrl: null,
                hasPro: true
              };
              setMenuData(restaurantInfo);
              setLoading(false);
              return;
            } else if (idUnico === '5XJ1J39E' || idUnico === 'LOS-TORITOS') {
              console.log('📦 Usando datos demo de Los Toritos');
              const demoData = getDemoMenuDataLosToritos();
              // Agregar campos requeridos para RestaurantData
              const restaurantInfo: RestaurantData = {
                ...demoData,
                address: 'Dirección Los Toritos',
                phone: '+54 11 1234-5678',
                logoUrl: null,
                hasPro: true
              };
              setMenuData(restaurantInfo);
              setLoading(false);
              return;
            }
          } catch (fallbackError) {
            console.error('❌ Error en fallback de datos demo:', fallbackError);
          }
          
          // Si no hay fallback disponible, mostrar error
          setConnectionError(true);
          throw new Error('Error de conexión a la base de datos');
        }
        
        const data = await response.json();
        if (data.success && data.menu) {
          // Cargar meseras desde el menú (parsear JSON string si es necesario)
          let waitersArray: string[] = [];
          if (data.menu.waiters) {
            try {
              // Si es string JSON, parsearlo
              if (typeof data.menu.waiters === 'string') {
                waitersArray = JSON.parse(data.menu.waiters);
              } else if (Array.isArray(data.menu.waiters)) {
                waitersArray = data.menu.waiters;
              }
            } catch (e) {
              console.warn('Error parseando waiters:', e);
              // Si falla el parseo, intentar como string separado por comas
              if (typeof data.menu.waiters === 'string') {
                waitersArray = data.menu.waiters.split(',').map((w: string) => w.trim()).filter((w: string) => w.length > 0);
              }
            }
          }
          
          if (waitersArray.length > 0) {
            setWaiters(waitersArray);
            console.log('Meseras cargadas:', waitersArray);
          } else {
            // Valores por defecto solo si no hay waiters en BD
            setWaiters(['Maria', 'Lucia', 'Carmen']);
            console.log('Usando meseras por defecto:', ['Maria', 'Lucia', 'Carmen']);
          }
          
          let restaurantInfo: RestaurantData = {
            restaurantName: data.menu.restaurantName,
            address: data.menu.contactAddress || 'Av. Fernández de la Cruz 1100',
            phone: data.menu.contactPhone || '+54 11 1234-5678',
            logoUrl: data.menu.logoUrl || null,
            hasPro: data.menu.hasPro || false,
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
                code: item.code,
                imageUrl: item.imageUrl || null,
                imageBase64: item.imageBase64 || item.imageUrl || null
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
          // TODO: Mostrar carrito PRO solo si el usuario tiene PRO comprado
          // TEMPORAL: Carrito siempre visible (puenteado para otro momento)
          // console.log('🔍 hasPro recibido de API:', data?.menu?.hasPro);
          // console.log('🔍 showProCart se setea a:', data?.menu?.hasPro === true);
          // setShowProCart(data?.menu?.hasPro === true);
          setShowProCart(true); // TEMPORAL: siempre visible
          const initialExpanded: {[key: string]: boolean} = {};
          restaurantInfo.categories.forEach(cat => { initialExpanded[cat.id || cat.name] = true; });
          setExpandedCategories(initialExpanded);
        } else {
          throw new Error('No se pudo cargar el menú');
        }
      } catch (error) {
        console.error('Error cargando menú desde API:', error);
        // TEMPORAL: Asegurar que carrito esté visible incluso con errores
        setShowProCart(true);
        
        // ⚠️ IMPORTANTE: NO mostrar datos demo a clientes en producción
        // Solo mostrar error de conexión o menú no encontrado
        console.log(`❌ Error cargando menú para ${idUnico}:`, error);
        
        // Verificar si es error de conexión (500) o menú no encontrado (404)
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isConnectionError = errorMessage.includes('conexión') || 
                                  errorMessage.includes('connection') ||
                                  errorMessage.includes('500');
        
        if (isConnectionError) {
          // Error de conexión: mostrar mensaje de error, NO datos demo
          setConnectionError(true);
          setMenuData(null);
        } else {
          // Intentar cargar desde localStorage primero (solo para desarrollo)
          const savedMenu = localStorage.getItem('editor-menu-data');
          const setupData = localStorage.getItem('setup-comercio-data');
          if (savedMenu && setupData) {
            const menuData = JSON.parse(savedMenu);
            const setup = JSON.parse(setupData);
            const restaurantInfo: RestaurantData = {
              restaurantName: setup.nombreComercio || 'Mi Restaurante',
              address: setup.direccion || 'Dirección no especificada',
              phone: setup.telefono || 'Teléfono no especificado',
              logoUrl: setup.logoUrl || null,
              categories: menuData.categories || menuData || []
            };
            setMenuData(restaurantInfo);
          } else {
            // Menú no encontrado: mostrar mensaje, NO datos demo
            setMenuNotFound(true);
            setMenuData(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    try {
      const sp = new URLSearchParams(window.location.search);
      // TODO: Permitir override por URL (para testing), pero por defecto usar hasPro de la BD
      // TEMPORAL: Carrito siempre visible
      // if (sp.get('procart') === '1' || sp.get('pro') === '1') {
      //   setShowProCart(true);  // Override: forzar PRO
      // } else if (sp.get('procart') === '0' || sp.get('pro') === '0') {
      //   setShowProCart(false);  // Override: forzar sin PRO
      // }
      // Si no hay override, se usa hasPro de la BD (se setea en loadMenuFromAPI)
      const wa = sp.get('wa');
      if (wa) setWaPhone(wa);
    } catch {}

    loadMenuFromAPI();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.items)) {
          setCartItems(parsed.items);
        }
        if (parsed.modalidad === 'delivery' || parsed.modalidad === 'retiro' || parsed.modalidad === 'salon') {
          setModalidad(parsed.modalidad);
        }
        if (typeof parsed.orderCode === 'string') {
          setOrderCode(parsed.orderCode);
        }
        if (typeof parsed.proName === 'string') {
          setProName(parsed.proName);
        }
        if (typeof parsed.proAddress === 'string') {
          setProAddress(parsed.proAddress);
        }
        if (typeof parsed.proMesa === 'string') {
          setProMesa(parsed.proMesa);
        }
        if (typeof parsed.proMesera === 'string') {
          setProMesera(parsed.proMesera);
        }
        if (parsed.proPayment === 'efectivo' || parsed.proPayment === 'mp') {
          setProPayment(parsed.proPayment);
        }
      }
    } catch (err) {
      console.warn('No se pudo hidratar carrito Pro:', err);
    } finally {
      setCartHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!cartHydrated) return;
    const payload = {
      items: cartItems,
      modalidad,
      orderCode,
      proName,
      proAddress,
      proMesa,
      proMesera,
      proPayment,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (err) {
      console.warn('No se pudo guardar carrito Pro:', err);
    }
  }, [cartHydrated, cartItems, modalidad, orderCode, proName, proAddress, proMesa, proMesera, proPayment, storageKey]);

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

  if (menuNotFound) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4 text-red-500">❌ NO EXISTE COMERCIO</h1>
          <p className="text-gray-400 mb-2">El ID único <span className="font-mono font-bold text-yellow-400">{idUnico}</span> no está registrado</p>
          <p className="text-gray-500 text-sm mb-6">Verifica que el ID sea correcto o contacta al administrador</p>
        </div>
      </div>
    );
  }

  if (connectionError && !menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4 text-yellow-500">⚠️ Error de Conexión</h1>
          <p className="text-gray-400 mb-2">No se pudo conectar a la base de datos</p>
          <p className="text-gray-500 text-sm mb-6">El comercio con ID <span className="font-mono font-bold text-yellow-400">{idUnico}</span> podría existir, pero no se puede verificar en este momento</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors text-white font-semibold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando carta digital...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 relative ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 pt-0 pb-1 -mt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <img
                src={menuData.logoUrl || '/demo-images/logo.png?v=2'}
                alt={`Logo ${menuData.restaurantName}`}
                className="w-[180px] h-auto rounded-lg object-contain cursor-pointer hover:opacity-80 transition-opacity"
                // onClick={() => setShowMapsModal(true)} // TODO: Implementar después (tenant)
                // title="Ver ubicación en Google Maps" // TODO: Implementar después (tenant)
                onError={(e) => { 
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== '/demo-images/Logo.jpg?v=2') {
                    target.src = '/demo-images/Logo.jpg?v=2';
                  } else {
                    target.src = '/demo-images/logo.png?v=2';
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2 ml-auto">
              <div className="flex items-center gap-2 w-full">
                {/* TODO: Implementar después (tenant) */}
                {/* <button onClick={(e)=>{e.preventDefault();e.stopPropagation();setShowMencionesModal(true);}} className={`flex-1 h-8 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${isDarkMode? 'bg-gray-700 hover:bg-gray-600 text-gray-300':'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                  <span className="text-lg">🔍</span><span className="text-sm font-medium">Reseñas</span>
                </button> */}
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
        {/* Barra de filtros posicionada al fondo del header */}
        {menuData?.categories && (menuData?.categories?.length || 0) > 0 && (
          <div className={`absolute bottom-[-1px] left-0 right-0 hidden min-[450px]:block z-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} pointer-events-none`}>
            <div className="max-w-6xl mx-auto px-4 pb-1">
              <div className="flex gap-2 overflow-x-auto custom-scrollbar pointer-events-auto">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === 'ALL'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Todas
                </button>
                {menuData.categories.map((category) => {
                  const key = category.id || category.name;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key!)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === key
                          ? 'bg-blue-600 text-white shadow-sm'
                          : isDarkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                      title={category.name}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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
            if (selectedCategory !== 'ALL' && (category.id || category.name) !== selectedCategory) return false;
            if (searchTerm && filterItems(category.items).length === 0) return false;
            return true;
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
                <div className={`px-3 pb-3 ${category.name.toUpperCase().includes('PROMO') ? 'pt-3' : 'pt-0 space-y-0'}`}>
                  {category.name.toUpperCase().includes('PROMO') ? (
                    // Contenedor con scroll horizontal para promos
                    <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: isDarkMode ? '#4B5563 #1F2937' : '#9CA3AF #E5E7EB' }}>
                      <div className="flex gap-3" style={{ width: 'max-content' }}>
                        {filterItems(category.items).map((item, itemIndex) => (
                          <div key={item.id || itemIndex} className="flex flex-col hover:opacity-90 transition-opacity duration-300 cursor-pointer rounded-lg overflow-hidden shadow-md flex-shrink-0" style={{ minHeight: '180px', width: '180px', minWidth: '180px', maxWidth: '180px' }} onClick={()=>{setModalItem(item); const promoImages = [`/platos/${idUnico}/milanesa-completa.jpg`,`/platos/${idUnico}/vacio-papas.jpg`,`/platos/${idUnico}/rabas.jpg`]; const imageSrc = item.imageUrl && item.imageUrl.startsWith('/platos/') ? item.imageUrl : (item.imageBase64 || item.imageUrl || promoImages[itemIndex % promoImages.length]); setModalItemImage(imageSrc);}} title="Click para ver detalles">
                            {/* Imagen con número de promo en círculo */}
                            <div className="relative h-32 overflow-hidden flex items-center justify-center bg-gray-100">
                              {/* Número de promo en círculo */}
                              <div className={`absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                                isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                              }`}>
                                {itemIndex + 1}
                              </div>
                              {item.imageUrl && item.imageUrl.startsWith('/platos/') ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={(e) => { const target = e.currentTarget; target.style.display = 'none'; const parent = target.parentElement; if (parent && !parent.querySelector('.icon-cubiertos')) { const icon = document.createElement('div'); icon.className = 'icon-cubiertos w-full h-full flex items-center justify-center text-gray-400 text-4xl'; icon.innerHTML = '🍽️'; parent.appendChild(icon); }}} />
                              ) : item.imageBase64 || item.imageUrl ? (
                                <img src={item.imageBase64 || item.imageUrl || ''} alt={item.name} className="w-full h-full object-cover" onError={(e) => { const target = e.currentTarget; target.style.display = 'none'; const parent = target.parentElement; if (parent && !parent.querySelector('.icon-cubiertos')) { const icon = document.createElement('div'); icon.className = 'icon-cubiertos w-full h-full flex items-center justify-center text-gray-400 text-4xl'; icon.innerHTML = '🍽️'; parent.appendChild(icon); }}} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🍽️</div>
                              )}
                            </div>
                            {/* Nombre del plato - 2 líneas */}
                            <div className={`px-3 py-2 border-b ${isDarkMode? 'bg-gray-700 border-gray-600':'bg-gray-200 border-gray-300'}`}>
                              <h3 className={`text-xs font-bold text-center line-clamp-2 ${isDarkMode? 'text-white':'text-gray-800'}`} style={{ minHeight: '2.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {(() => {
                                  const hasParens = /\([^\)]*\)\s*$/.test(item.name||'');
                                  return hasParens ? (item.name||'').replace(/\s*\([^)]*\)\s*$/, '').trim() : item.name;
                                })()}
                              </h3>
                            </div>
                            {/* Precio - sin descripción */}
                            <div className={`${isDarkMode? 'bg-gray-700':'bg-gray-200'} p-2`}>
                              <div className="text-sm font-bold text-center text-blue-500">{item.price.replace('$$','$')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Items normales (no promos)
                    filterItems(category.items).map((item, itemIndex) => (
                      <div key={item.id || itemIndex} className={`flex items-center border-b ${isDarkMode? 'border-gray-700':'border-gray-200'} ${item.isAvailable === false ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`} title={`${item.code ? `#${item.code}` : ''}${(() => { const hasParens = /\([^\)]*\)\s*$/.test(item.name||''); const d = item.description && item.description.length>0 ? item.description : (hasParens ? (item.name.match(/\(([^)]*)\)\s*$/)?.[1] || '' ) : ''); return (item.code? ' ' : '') + (d||''); })()}`} onClick={()=>{ if (item.isAvailable !== false) { setModalItem(item); const fallbacks = [`/platos/${idUnico}/albondigas.jpg`,`/platos/${idUnico}/rabas.jpg`,`/platos/${idUnico}/milanesa-completa.jpg`,`/platos/${idUnico}/vacio-papas.jpg`]; setModalItemImage(item.imageBase64 || item.imageUrl || fallbacks[itemIndex % fallbacks.length]); }}}>
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ml-0 mr-2 my-1 flex items-center justify-center bg-gray-200">
                          {item.imageBase64 || item.imageUrl ? (
                            <img 
                              src={
                                // Si es URL de archivo (/platos/{idUnico}/...), usarla directamente
                                (item.imageUrl && item.imageUrl.startsWith('/platos/')) 
                                  ? item.imageUrl 
                                  : (item.imageBase64 || item.imageUrl) || ''
                              } 
                              alt={item.name} 
                              className={`w-full h-full object-cover ${item.isAvailable === false ? 'grayscale' : ''}`} 
                              onError={(e) => {
                                // Fallback: mostrar icono de cubiertos si la imagen falla
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('.icon-cubiertos')) {
                                  const icon = document.createElement('div');
                                  icon.className = 'icon-cubiertos w-full h-full flex items-center justify-center text-gray-400';
                                  icon.innerHTML = '🍽️';
                                  parent.appendChild(icon);
                                }
                              }}
                            />
                          ) : (
                            // Sin imagen: mostrar icono de cubiertos
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                              🍽️
                            </div>
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
              {modalItemImage ? (
                <img 
                  src={modalItemImage} 
                  alt={modalItem.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.icon-cubiertos-modal')) {
                      const icon = document.createElement('div');
                      icon.className = 'icon-cubiertos-modal w-full h-full flex items-center justify-center text-gray-400 text-6xl bg-gray-100';
                      icon.innerHTML = '🍽️';
                      parent.appendChild(icon);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl bg-gray-100">🍽️</div>
              )}
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
            <button onClick={()=>{ 
              setCartItems(prev => {
                // Buscar si el item ya existe en el carrito
                const existingIndex = prev.findIndex(ci => ci.item.id === modalItem.id || ci.item.name === modalItem.name);
                if (existingIndex >= 0) {
                  // Si existe, incrementar la cantidad
                  return prev.map((ci, idx) => 
                    idx === existingIndex 
                      ? { ...ci, quantity: ci.quantity + modalQuantity }
                      : ci
                  );
                } else {
                  // Si no existe, agregar nuevo
                  const code = `0${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
                  return [...prev, { item: modalItem, quantity: modalQuantity, code }];
                }
              });
              setModalItem(null); 
              setModalQuantity(1); 
            }} className={`${isDarkMode? 'bg-blue-600 hover:bg-blue-700 text-white':'bg-blue-500 hover:bg-blue-600 text-white'} w-full py-3 rounded-lg font-bold text-lg`}>🛒 Agregar al Carrito</button>
          </div>
        </div>
      )}

      {/* FAB Pro */}
      {showProCart && (
        <button onClick={()=>setShowProCartModal(true)} className={`${isDarkMode? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600':'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'} fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full shadow-lg border-2 flex items-center justify-center`} title="Ver carrito (POC)"> <span className="text-2xl">🛒</span>{cartItems.length>0 && (<span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">{cartItems.reduce((t,it)=>t+it.quantity,0)}</span>)}</button>
      )}

      {showProCart && showProCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={()=>{
            setShowProCartModal(false);
            setShowTicketInModal(false);
            // NO limpiar datos - solo cerrar el modal
          }} />
          <div className={`relative w-full max-w-3xl mx-4 rounded-xl shadow-2xl bg-white`}>
            {/* Header con código */}
            <div className={`px-4 py-3 border-b border-gray-200`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                  {showTicketInModal ? (
                    <>Comanda <span className="text-sm font-bold text-black">{comandaCode}</span></>
                  ) : (
                    <>Pedido <span className="text-sm font-semibold text-black">{orderCode}</span></>
                  )}
                </h3>
                <button onClick={()=>{
                  setShowProCartModal(false);
                  setShowTicketInModal(false);
                  // NO limpiar datos - solo cerrar el modal
                  // Los datos se mantienen hasta que se confirme y se genere la comanda
                }} className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-black`}>✕</button>
              </div>
            </div>

            {/* Mostrar ticket o formulario según el estado */}
            {showTicketInModal ? (
              /* TICKET DE COMANDA */
              <div className="p-4 overflow-y-auto max-h-[70vh]">
                <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300" style={{ maxWidth: '95%', width: '95%', margin: '0 auto', fontFamily: 'Courier New, monospace', fontSize: '14px' }}>
                  <div className="mb-2">
                    <div className="font-bold text-xl flex items-center justify-between">
                      <span>COMANDA</span>
                      <span className="text-base font-bold text-black">{comandaCode}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs my-1">
                    <span>{new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })} {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                    {modalidad === 'salon' ? (
                      <span>Mesa: {proMesa || '___'}-{proMesera || '__________'}</span>
                    ) : modalidad === 'delivery' ? (
                      <span>Delivery</span>
                    ) : (
                      <span>Take Away</span>
                    )}
                  </div>
                  
                  <div className="border-t border-dashed border-black my-2"></div>
                  
                  {cartItems.map((ci, idx) => {
                    const nameNoParens = (ci.item.name || '').replace(/\s*\([^)]*\)\s*$/, '');
                    const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
                    const subtotal = price * ci.quantity;
                    return (
                      <div key={idx} className="my-2 flex justify-between items-start" style={{ fontSize: '13px' }}>
                        <span>{ci.quantity} {nameNoParens}</span>
                        <span className="whitespace-nowrap ml-2">${subtotal.toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between font-bold mt-2" style={{ fontSize: '14px' }}>
                    <span>TOTAL:</span>
                    <span>${cartItems.reduce((sum, it) => sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0).toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                  </div>
                  
                  {(customerNotes.trim() || proPayment) && (
                    <>
                      <div className="border-t border-dashed border-black my-2"></div>
                      {customerNotes.trim() && (
                        <div className="text-xs mb-1">
                          <span>Obs: {customerNotes.trim()}</span>
                        </div>
                      )}
                      {proPayment && (
                        <div className="text-xs">
                          <span>Pago: {proPayment === 'mp' ? 'Mercado Pago' : 'Efectivo'}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Botón Enviar Comanda */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      printComanda(comandaCode);
                      // Limpiar datos y cerrar modal después de enviar
                      setShowProCartModal(false);
                      setShowTicketInModal(false);
                      setCartItems([]);
                      setProName('');
                      setProAddress('');
                      setProMesa('');
                      setProMesera('');
                      setProPayment(null);
                      setCustomerNotes('');
                      try {
                        localStorage.removeItem(storageKey);
                      } catch {}
                    }}
                    className="flex-1 px-2 py-1.5 rounded text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
                  >
                    Enviar Comanda
                  </button>
                </div>
              </div>
            ) : (
              /* FORMULARIO DE PEDIDO */
              <>
            {/* Items del pedido */}
            <div className="px-4 pt-4 pb-0 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2 mb-4">
                {cartItems.length === 0 ? (
                  <div className={`text-center py-6 text-gray-400`}>Carrito vacío</div>
                ) : (
                  cartItems.map((ci, index) => {
                    const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
                    return (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-black">{ci.item.name}</div>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                          <div className="inline-flex items-center rounded-full overflow-hidden border border-gray-300 bg-white">
                            <button 
                              onClick={()=>setCartItems(prev=>{ 
                                const next=[...prev]; 
                                if(next[index].quantity>1){ 
                                  next[index]={...next[index], quantity: next[index].quantity-1}; 
                                } else { 
                                  next.splice(index,1); 
                                } 
                                return next; 
                              })} 
                              className="w-6 h-6 text-sm hover:bg-gray-100 text-black"
                            >-</button>
                            <span className="w-6 text-center text-sm font-semibold select-none text-black">{ci.quantity}</span>
                            <button 
                              onClick={()=>setCartItems(prev=>prev.map((it,i)=> i===index ? { ...it, quantity: it.quantity+1} : it))} 
                              className="w-6 h-6 text-sm hover:bg-gray-100 text-black"
                            >+</button>
                          </div>
                          <div className="w-16 text-right text-sm font-semibold text-black">{(price * ci.quantity).toLocaleString('es-AR',{style:'currency',currency:'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total */}
              {cartItems.length > 0 && (
                <div className="pb-3 text-black">
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>$ {cartItems.reduce((sum,it)=> sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0).toLocaleString('es-AR', {minimumFractionDigits: 0})}</span>
                  </div>
                </div>
              )}

              {/* Campo de observaciones */}
              {cartItems.length > 0 && (
                <div className="pb-3">
                  <input
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-400"
                    placeholder="Observaciones (ej: Sin sal)"
                  />
                </div>
              )}
            </div>

            {/* Footer con pago y confirmar */}
            {cartItems.length > 0 && (
              <div className="px-4 py-2.5 border-t border-gray-200 rounded-b-xl bg-gray-50">
                <div className="flex gap-2 mb-2">
                  <select
                    value={modalidad}
                    onChange={(e) => {
                      const value = e.target.value as 'delivery' | 'retiro' | 'salon';
                      setModalidad(value);
                      setOrderCode(generateOrderCode(value));
                    }}
                    className="w-28 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900"
                  >
                    <option value="delivery">Delivery</option>
                    <option value="retiro">Take Away</option>
                    <option value="salon">Salón</option>
                  </select>
                  {modalidad === 'salon' ? (
                    <div className="flex-1 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-1.5">
                      <input
                        type="text"
                        value={proMesa}
                        onChange={(e) => setProMesa(e.target.value)}
                        className="w-16 text-xs text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0 p-0"
                        placeholder="Mesa"
                      />
                      <span className="text-xs text-gray-400">-</span>
                      <select
                        value={proMesera}
                        onChange={(e) => setProMesera(e.target.value)}
                        className="flex-1 text-xs text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right center',
                          paddingRight: '16px'
                        }}
                      >
                        <option value="">Atendió</option>
                        {waiters.map((waiter) => (
                          <option key={waiter} value={waiter}>
                            {waiter}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <input
                      value={modalidad === 'delivery' ? proAddress : proName}
                      onChange={(e) => (modalidad === 'delivery' ? setProAddress(e.target.value) : setProName(e.target.value))}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 placeholder-gray-400"
                      placeholder={modalidad === 'delivery' ? 'Calle y número' : 'Nombre'}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-black">Pago</span>
                    <label className="flex items-center gap-1.5 text-xs text-black cursor-pointer ml-2">
                      <input
                        type="radio"
                        name="pago"
                        checked={proPayment === 'efectivo'}
                        onChange={() => setProPayment('efectivo')}
                      />
                      Efectivo
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-black cursor-pointer">
                      <input
                        type="radio"
                        name="pago"
                        checked={proPayment === 'mp'}
                        onChange={() => setProPayment('mp')}
                      />
                      MP
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      const mode: 'delivery' | 'retiro' | 'salon' = modalidad;
                      if (mode === 'delivery') {
                        if (!proAddress.trim()) {
                          alert('Ingresá la dirección para delivery');
                          return;
                        }
                      } else if (mode === 'retiro') {
                        if (!proName.trim()) {
                          alert('Ingresá tu nombre');
                          return;
                        }
                      } else if (mode === 'salon') {
                        if (!proMesa.trim()) {
                          alert('Ingresá el número de mesa');
                          return;
                        }
                        if (!proMesera.trim()) {
                          alert('Seleccioná la mesera que atendió');
                          return;
                        }
                      }
                      if (!proPayment) {
                        alert('Seleccioná forma de pago');
                        return;
                      }
                      const effectiveCode = ensureOrderCodeForMode(mode);
                      
                      // Guardar pedido en localStorage para que aparezca en Pedidos
                      const newOrder = {
                        id: Date.now().toString(),
                        code: effectiveCode,
                        status: 'PENDING',
                        customerName: mode === 'salon' ? (proMesa ? `Mesa ${proMesa}` : undefined) : (mode === 'delivery' ? proName : (mode === 'retiro' ? proName : undefined)),
                        address: mode === 'delivery' ? proAddress : undefined,
                        tableNumber: mode === 'salon' ? proMesa : undefined,
                        waiterName: mode === 'salon' ? proMesera : undefined,
                        total: cartItems.reduce((sum, it) => sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0),
                        notes: customerNotes || undefined,
                        modalidad: mode, // 'delivery' | 'retiro' | 'salon'
                        paymentMethod: proPayment || undefined, // 'efectivo' | 'mp'
                        items: cartItems.map(ci => ({
                          id: ci.item.id || ci.code,
                          name: ci.item.name,
                          quantity: ci.quantity,
                          price: parseFloat((ci.item.price || '').replace(/[$,\s]/g,'')) || 0
                        })),
                        createdAt: new Date().toISOString()
                      };
                      
                      // Guardar en localStorage (clave específica para pedidos)
                      try {
                        const ordersKey = `orders-${idUnico}`;
                        const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
                        existingOrders.unshift(newOrder); // Agregar al principio
                        localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
                      } catch (e) {
                        console.error('Error guardando pedido:', e);
                      }
                      
                      // Mostrar ticket dentro del modal (reemplaza el contenido)
                      setComandaCode(effectiveCode);
                      setShowTicketInModal(true);
                      
                      // Para delivery/take away también enviar por WhatsApp
                      if (mode !== 'salon') {
                        const mensaje = buildTicketMessage(mode, effectiveCode);
                        if (proPayment === 'mp') {
                          try {
                            window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(mensaje)}`, '_blank');
                          } catch {}
                          // No mostrar alert, solo enviar por WhatsApp
                        } else {
                          try {
                            window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(mensaje)}`, '_blank');
                          } catch {}
                        }
                      }
                      // NO limpiar datos aquí - se limpian cuando se cierra el modal
                    }}
                    className="px-4 py-1.5 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Preview Comanda */}
      {showComandaPreview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowComandaPreview(false)}>
          <div className="bg-white rounded-xl w-full" style={{ maxWidth: '85%' }} onClick={(e) => e.stopPropagation()}>
            <div className="px-2 py-2 border-b flex items-center justify-between border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Preview Comanda</h3>
              <button 
                onClick={() => setShowComandaPreview(false)} 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Preview del ticket */}
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300" style={{ maxWidth: '95%', width: '95%', margin: '0 auto', fontFamily: 'Courier New, monospace', fontSize: '14px' }}>
                <div className="mb-2">
                  <div className="font-bold text-xl flex items-center justify-between">
                    <span>COMANDA</span>
                    <span className="text-base font-normal">{comandaCode}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs my-1">
                  <span>{new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })} {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  {modalidad === 'salon' ? (
                    <span>Mesa: {proMesa || '___'}-{proMesera || '__________'}</span>
                  ) : modalidad === 'delivery' ? (
                    <span>Delivery</span>
                  ) : (
                    <span>Take Away</span>
                  )}
                </div>
                
                <div className="text-center my-2" style={{ fontSize: '10px' }}>-------------------------</div>
                
                {cartItems.map((ci, idx) => {
                  const nameNoParens = (ci.item.name || '').replace(/\s*\([^)]*\)\s*$/, '');
                  const price = parseFloat((ci.item.price || '').replace(/[$,\s]/g, '')) || 0;
                  const subtotal = price * ci.quantity;
                  return (
                    <div key={idx} className="my-2 flex justify-between items-start" style={{ fontSize: '13px' }}>
                      <span>{ci.quantity} {nameNoParens}</span>
                      <span className="whitespace-nowrap ml-2">${subtotal.toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                    </div>
                  );
                })}
                
                <div className="flex justify-between font-bold mt-2" style={{ fontSize: '14px' }}>
                  <span>TOTAL:</span>
                  <span>${cartItems.reduce((sum, it) => sum + (parseFloat((it.item.price || '').replace(/[$,\s]/g,'')) || 0) * it.quantity, 0).toLocaleString('es-AR', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                </div>
                
                {(customerNotes.trim() || proPayment) && (
                  <>
                    <div className="border-t border-dashed border-black my-2"></div>
                    {customerNotes.trim() && (
                      <div className="text-xs mb-1">
                        <span>Obs: {customerNotes.trim()}</span>
                      </div>
                    )}
                    {proPayment && (
                      <div className="text-xs">
                        <span>Pago: {proPayment === 'mp' ? 'Mercado Pago' : 'Efectivo'}</span>
                      </div>
                    )}
                  </>
                )}
                
                {/* Footer solo si NO es uso interno (Salón) */}
                {(modalidad !== 'salon' && !isModoInterno) && (
                  <div className="mt-3 pt-2 border-t border-dashed border-black text-center text-xs">
                    <div>{menuData?.restaurantName || 'Restaurante'}</div>
                    <div>{menuData?.address || ''}</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Botones - siempre claro */}
            <div className="px-4 py-3 border-t flex gap-2 border-gray-200">
              <button
                onClick={() => setShowComandaPreview(false)}
                className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  printComanda(comandaCode);
                  setShowComandaPreview(false);
                  setShowProCartModal(false);
                  setCartItems([]);
                  setProName('');
                  setProAddress('');
                  setProMesa('');
                  setProMesera('');
                  setProPayment(null);
                  setCustomerNotes('');
                  try {
                    localStorage.removeItem(storageKey);
                  } catch {}
                }}
                className="flex-1 px-2 py-1.5 rounded text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                Enviar Comanda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Google Maps (embed) */}
      {showMapsModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={()=>setShowMapsModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-3xl h-[70vh] overflow-hidden shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <div className="px-4 py-2 border-b flex items-center justify-between">
              <h3 className="text-gray-900 font-semibold">Ubicación - Google Maps</h3>
              <button onClick={()=>setShowMapsModal(false)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">✕</button>
            </div>
            <iframe
              className="w-full h-full"
              src={`https://www.google.com/maps?q=${encodeURIComponent(menuData?.restaurantName || 'Restaurante')}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}

      {/* Modal Reseñas (no iframe por X-Frame-Options; CTA a Google) */}
      {showMencionesModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={()=>setShowMencionesModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-xl overflow-hidden shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <div className="px-4 py-2 border-b flex items-center justify-between">
              <h3 className="text-gray-900 font-semibold">Reseñas</h3>
              <button onClick={()=>setShowMencionesModal(false)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">✕</button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700">
                Abrí Google para ver y escribir reseñas del local. Por políticas de Google, no se puede embeber esta vista dentro del sitio.
              </p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`${menuData?.restaurantName || ''} ${menuData?.address || ''} opiniones reseñas`.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Ver reseñas en Google
              </a>
              <button
                onClick={()=>{ 
                  const reviewUrl = `https://www.google.com/search?q=${encodeURIComponent(`${menuData?.restaurantName || ''} ${menuData?.address || ''} opiniones reseñas`.trim())}`;
                  navigator.clipboard?.writeText(reviewUrl); 
                  alert('Link copiado al portapapeles'); 
                }}
                className="w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
              >
                Copiar link de reseñas
              </button>
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
