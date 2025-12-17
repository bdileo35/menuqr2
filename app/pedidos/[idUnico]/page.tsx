'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useAppTheme } from '../../hooks/useAppTheme';
import { MdArrowBack } from 'react-icons/md';
import AuthGuard from '@/components/AuthGuard';

// Tipos para pedidos
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
}

interface Order {
  id: string;
  code: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  customerName?: string | null;
  address?: string | null;
  tableNumber?: string | null;
  waiterName?: string | null;
  total: number;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
}

export default function PedidosPage() {
  const params = useParams();
  const idUnico = params?.idUnico as string;
  const { isDarkMode, toggleTheme } = useAppTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [previousStatuses, setPreviousStatuses] = useState<Map<string, Order['status']>>(new Map());
  
  // Estados para modales de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [confirmNewStatus, setConfirmNewStatus] = useState<Order['status'] | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  
  // Estados para el modal de pedido
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderTable, setOrderTable] = useState('');
  const [orderWaiter, setOrderWaiter] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mp'>('cash');
  const [orderCode, setOrderCode] = useState('');

  // Cargar pedidos desde localStorage
  useEffect(() => {
    setLoading(true);
    try {
      // Cargar desde localStorage
      const ordersKey = `orders-${idUnico}`;
      const savedOrders = localStorage.getItem(ordersKey);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
      } else {
        // Si no hay pedidos guardados, dejar array vacío
        setOrders([]);
      }
    } catch (e) {
      console.error('Error cargando pedidos:', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
    
    // Escuchar cambios en localStorage (cuando se agrega un nuevo pedido desde otra pestaña/ventana)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `orders-${idUnico}`) {
        console.log('Cambio detectado en localStorage, recargando pedidos...');
        try {
          const savedOrders = e.newValue;
          if (savedOrders) {
            const parsedOrders = JSON.parse(savedOrders);
            setOrders(parsedOrders);
          }
        } catch (err) {
          console.error('Error al recargar pedidos:', err);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente (por si el cambio fue en la misma ventana)
    const interval = setInterval(() => {
      const ordersKey = `orders-${idUnico}`;
      const currentOrders = localStorage.getItem(ordersKey);
      if (currentOrders) {
        try {
          const parsed = JSON.parse(currentOrders);
          setOrders(prevOrders => {
            // Comparar cantidad de pedidos para detectar cambios
            if (parsed.length !== prevOrders.length) {
              // Cambio detectado en localStorage (misma ventana)
              return parsed;
            }
            // También comparar IDs para detectar cambios aunque la cantidad sea igual
            const prevIds = new Set(prevOrders.map(o => o.id));
            const newIds = new Set(parsed.map((o: Order) => o.id));
            if (prevIds.size !== newIds.size || Array.from(prevIds).some(id => !newIds.has(id))) {
              // Cambio detectado en localStorage (IDs diferentes)
              return parsed;
            }
            return prevOrders;
          });
        } catch (e) {
          // Ignorar errores de parsing
        }
      } else {
        // Si no hay pedidos en localStorage pero hay en el estado, mantener el estado
        // (no limpiar para evitar que desaparezcan al hacer refresh)
      }
    }, 1000); // Verificar cada segundo
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [idUnico]);

  // Filtrar pedidos por estado
  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const completedOrders = orders.filter(o => o.status === 'DELIVERED');

  // Ordenar por fecha (más antigua primero - a la izquierda)
  const sortByDate = (a: Order, b: Order) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  // Función para guardar pedidos en localStorage
  const saveOrdersToStorage = (ordersToSave: Order[]) => {
    try {
      const ordersKey = `orders-${idUnico}`;
      localStorage.setItem(ordersKey, JSON.stringify(ordersToSave));
    } catch (e) {
      console.error('Error guardando pedidos en localStorage:', e);
    }
  };

  // Función para abrir modal de confirmación
  const handleStatusChangeClick = (orderId: string, newStatus: Order['status']) => {
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;
    
    setConfirmOrderId(orderId);
    setConfirmNewStatus(newStatus);
    
    if (newStatus === 'READY') {
      setConfirmMessage('¿Desea marcar como A cobrar?');
    } else if (newStatus === 'DELIVERED') {
      setConfirmMessage('¿Desea marcar como Cobrado?');
    } else {
      setConfirmMessage('¿Confirmar cambio de estado?');
    }
    
    setShowConfirmModal(true);
  };

  // Función para confirmar cambio de estado
  const confirmStatusChange = () => {
    if (!confirmOrderId || !confirmNewStatus) return;
    
    // Actualizar estado en memoria
    const updatedOrders = orders.map(o => 
      o.id === confirmOrderId ? { ...o, status: confirmNewStatus } : o
    );
    setOrders(updatedOrders);
    
    // Persistir en localStorage
    saveOrdersToStorage(updatedOrders);
    
    // Cerrar modal
    setShowConfirmModal(false);
    setConfirmOrderId(null);
    setConfirmNewStatus(null);
    setConfirmMessage('');
  };

  // Función para revertir al estado anterior
  const handleRevertStatus = (orderId: string) => {
    const previousStatus = previousStatuses.get(orderId);
    if (previousStatus) {
      const updatedOrders = orders.map(o => 
        o.id === orderId ? { ...o, status: previousStatus } : o
      );
      setOrders(updatedOrders);
      
      // Persistir en localStorage
      saveOrdersToStorage(updatedOrders);
      
      // Limpiar el estado anterior guardado
      setPreviousStatuses(prev => {
        const newMap = new Map(prev);
        newMap.delete(orderId);
        return newMap;
      });
    }
  };

  // Obtener siguiente estado posible
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'READY'; // Saltar PREPARING, ir directo a READY
      case 'READY':
        return 'DELIVERED';
      default:
        return null;
    }
  };

  // Obtener texto del botón
  const getButtonText = (status: Order['status']): string => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'En Preparación';
      case 'READY':
        return 'Marcar como Cobrado';
      default:
        return '';
    }
  };

  // Obtener color del botón
  const getButtonColor = (status: Order['status']): string => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600';
      case 'PREPARING':
        return isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
      case 'READY':
        return isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600';
      default:
        return '';
    }
  };

  // Funciones para el modal de pedido
  const openNewOrderModal = () => {
    // Generar código único
    const newCode = `S${Date.now().toString().slice(-4)}`;
    setOrderCode(newCode);
    setOrderItems([]);
    setOrderNotes('');
    setOrderTable('');
    setOrderWaiter('');
    setPaymentMethod('cash');
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setOrderItems([]);
    setOrderNotes('');
    setOrderTable('');
    setOrderWaiter('');
  };

  const addItemToOrder = (item: { id: string; name: string; price: number; code?: string }) => {
    const existingItem = orderItems.find(i => i.id === item.id);
    if (existingItem) {
      setOrderItems(orderItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setOrderItems([...orderItems, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      }]);
    }
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    }));
  };

  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const confirmOrder = () => {
    if (orderItems.length === 0) return;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      code: orderCode,
      status: 'PENDING',
      customerName: orderTable ? `Mesa ${orderTable}` : undefined,
      tableNumber: orderTable || undefined,
      waiterName: orderWaiter || undefined,
      total: calculateTotal(),
      notes: orderNotes || undefined,
      items: orderItems,
      createdAt: new Date().toISOString()
    };

    setOrders([...orders, newOrder]);
    closeOrderModal();
  };

  // Renderizar card de pedido
  const renderOrderCard = (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    const mainItem = order.items[0]; // Primer item para imagen
    
    return (
      <div 
        key={order.id} 
        className={`flex flex-col rounded-lg overflow-hidden shadow-md flex-shrink-0 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
        style={{ width: '180px', minWidth: '180px', maxWidth: '180px', minHeight: 'auto' }}
      >
        {/* Header: 2 líneas - Código con fecha/hora y DATO */}
        <div className={`px-3 py-2 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {order.code}
              </span>
              {(() => {
                const fecha = new Date(order.createdAt);
                const hora = fecha.getHours();
                const minutos = fecha.getMinutes();
                return (
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {hora.toString().padStart(2, '0')}:<span className="font-bold">{minutos.toString().padStart(2, '0')}</span>
                  </span>
                );
              })()}
            </div>
            {(() => {
              const modalidad = (order as any).modalidad;
              const code = order.code || '';
              const prefix = code.charAt(0);
              let dato = '';
              
              if (prefix === 'S' || modalidad === 'salon') {
                // Salón: Mesa - Mesero/a
                dato = order.tableNumber ? `Mesa ${order.tableNumber}` : '';
                if (order.waiterName) {
                  dato += dato ? ` - ${order.waiterName}` : order.waiterName;
                }
              } else if (prefix === 'T' || modalidad === 'retiro') {
                // Take Away: Nombre cliente
                dato = order.customerName || '';
              } else if (prefix === 'D' || modalidad === 'delivery') {
                // Delivery: Dirección
                dato = order.address || '';
              } else if (order.tableNumber) {
                // Fallback para pedidos antiguos sin modalidad
                dato = `Mesa ${order.tableNumber}`;
                if (order.waiterName) {
                  dato += ` - ${order.waiterName}`;
                }
              }
              return dato ? (
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {dato}
                </span>
              ) : null;
            })()}
          </div>
        </div>

        {/* Body blanco para items */}
        <div className={`px-3 py-2 flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {order.status === 'READY' ? (
            /* Mostrar items individuales con precios cuando está en "A Cobrar" */
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className={`text-xs flex justify-between items-start ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span className="flex-1 pr-2">{item.quantity} {item.name}</span>
                  <span className={`font-semibold whitespace-nowrap ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    ${(item.price * item.quantity).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
              <div className={`text-xs flex justify-between items-center pt-1 border-t ${isDarkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>
                <span className="font-bold">Total:</span>
                <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  ${order.total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          ) : (
            /* Mostrar items completos sin precios en Pendientes */
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.quantity} {item.name}
                </div>
              ))}
              <div className={`text-xs flex justify-between items-center pt-1 border-t ${isDarkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-800'}`}>
                <span>Total:</span>
                <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  ${order.total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botones: Cambiar estado (sin botón revertir) */}
        {nextStatus && (
          <div className="px-3 py-2 border-t">
            <button
              onClick={() => handleStatusChangeClick(order.id, nextStatus)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-white transition-colors ${getButtonColor(order.status)}`}
            >
              {getButtonText(order.status)}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Función para generar pedidos de ejemplo (disponible en consola)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).generarPedidosDemo = (customIdUnico?: string) => {
        const targetId = customIdUnico || idUnico;
        const ordersKey = `orders-${targetId}`;
        
        const pedidosDemo = [
          {
            id: `pedido-${Date.now()}-1`,
            code: 'S9636',
            status: 'PENDING',
            customerName: 'Mesa 12',
            tableNumber: '12',
            waiterName: 'Juan Pérez',
            total: 65000,
            notes: 'Sin cebolla en el vacío',
            modalidad: 'salon',
            paymentMethod: 'efectivo',
            items: [
              { id: '0106', name: 'Vacío a la parrilla c/ fritas', quantity: 2, price: 14000 },
              { id: '0105', name: 'Mejillones c/ fettuccinis', quantity: 1, price: 12000 },
              { id: '0107', name: 'Peceto al verdeo c/ puré', quantity: 1, price: 15000 },
              { id: 'bebida-1', name: 'Coca Cola 1.5L', quantity: 2, price: 3000 }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
          },
          {
            id: `pedido-${Date.now()}-2`,
            code: 'S9637',
            status: 'PREPARING',
            customerName: 'Mesa 8',
            tableNumber: '8',
            waiterName: 'Ana',
            total: 45000,
            notes: 'Bien cocido',
            modalidad: 'salon',
            paymentMethod: 'mp',
            items: [
              { id: '0104', name: 'Pechuga rellena c/ f. españolas', quantity: 1, price: 12000 },
              { id: '0103', name: 'Chupín de merluza c/ papa natural', quantity: 1, price: 10000 },
              { id: '0108', name: 'Correntinos caseros a la Vangoli', quantity: 1, price: 13000 },
              { id: 'bebida-2', name: 'Agua sin gas', quantity: 2, price: 3000 }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
          },
          {
            id: `pedido-${Date.now()}-3`,
            code: 'S9638',
            status: 'READY',
            customerName: 'Mesa 5',
            tableNumber: '5',
            waiterName: 'Juan Pérez',
            total: 62000,
            notes: null,
            modalidad: 'salon',
            paymentMethod: 'efectivo',
            items: [
              { id: '0106', name: 'Vacío a la parrilla c/ fritas', quantity: 2, price: 14000 },
              { id: '0102', name: 'Croquetas de carne c/ ensalada', quantity: 1, price: 9000 },
              { id: '0101', name: 'Riñoncitos al jerez c/ puré', quantity: 1, price: 9000 },
              { id: 'bebida-3', name: 'Vino tinto copa', quantity: 2, price: 6500 }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
          },
          {
            id: `pedido-${Date.now()}-4`,
            code: 'D9639',
            status: 'PENDING',
            customerName: 'María González',
            tableNumber: null,
            waiterName: null,
            total: 28000,
            notes: 'Timbre 3B',
            modalidad: 'delivery',
            paymentMethod: 'mp',
            items: [
              { id: '0107', name: 'Peceto al verdeo c/ puré', quantity: 1, price: 15000 },
              { id: 'bebida-4', name: 'Coca Cola 500ml', quantity: 2, price: 2000 }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
          },
          {
            id: `pedido-${Date.now()}-5`,
            code: 'T9640',
            status: 'PREPARING',
            customerName: 'Carlos Rodríguez',
            tableNumber: null,
            waiterName: null,
            total: 24000,
            notes: null,
            modalidad: 'retiro',
            paymentMethod: 'efectivo',
            items: [
              { id: '0105', name: 'Mejillones c/ fettuccinis', quantity: 1, price: 12000 },
              { id: '0102', name: 'Croquetas de carne c/ ensalada', quantity: 1, price: 9000 },
              { id: 'bebida-5', name: 'Agua con gas', quantity: 1, price: 3000 }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
          },
          {
            id: `pedido-${Date.now()}-6`,
            code: 'S9641',
            status: 'READY',
            customerName: 'Mesa 15',
            tableNumber: '15',
            waiterName: 'Ana',
            total: 55000,
            notes: 'Sin sal en el peceto',
            modalidad: 'salon',
            paymentMethod: 'mp',
            items: [
              { id: '0106', name: 'Vacío a la parrilla c/ fritas', quantity: 2, price: 14000 },
              { id: '0104', name: 'Pechuga rellena c/ f. españolas', quantity: 1, price: 12000 },
              { id: '0105', name: 'Mejillones c/ fettuccinis', quantity: 1, price: 12000 },
              { id: 'bebida-6', name: 'Cerveza artesanal', quantity: 3, price: 3500 }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
          },
          {
            id: `pedido-${Date.now()}-7`,
            code: 'S9642',
            status: 'PENDING',
            customerName: 'Mesa 3',
            tableNumber: '3',
            waiterName: 'Juan Pérez',
            total: 18500,
            notes: null,
            modalidad: 'salon',
            paymentMethod: 'efectivo',
            items: [
              { id: '0103', name: 'Chupín de merluza c/ papa natural', quantity: 1, price: 10000 },
              { id: 'bebida-7', name: 'Cerveza artesanal', quantity: 1, price: 3500 }
            ],
            createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
          }
        ];
        
        const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        const allOrders = [...pedidosDemo, ...existingOrders];
        localStorage.setItem(ordersKey, JSON.stringify(allOrders));
        
        console.log(`✅ ${pedidosDemo.length} pedidos de ejemplo generados`);
        console.log('Pedidos creados:');
        pedidosDemo.forEach((p) => {
          console.log(`  - ${p.code}: ${p.customerName || 'Cliente'} - $${p.total.toLocaleString('es-AR')} - ${p.status}`);
        });
        console.log(`\nTotal de pedidos en localStorage: ${allOrders.length}`);
        console.log('\n🔄 Recarga la página para ver los nuevos pedidos');
        
        // Recargar pedidos en la página
        setOrders(allOrders as Order[]);
        
        return pedidosDemo;
      };
      
      console.log('📝 Función disponible: generarPedidosDemo(idUnico?)');
      console.log('   Ejemplo: generarPedidosDemo() o generarPedidosDemo("5XJ1J37F")');
    }
  }, [idUnico]);

  if (!idUnico) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error: ID Único no encontrado</h1>
          <p className="text-gray-600 dark:text-gray-400">La URL debe incluir un ID único válido.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard idUnico={idUnico}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} pb-20`}>
      {/* Header Unificado */}
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 pt-1 pb-2">
          <div className="flex items-center justify-between">
            {/* Izquierda: Icono + Título */}
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">🍽️ Gestión de Pedidos</h1>
            </div>

            {/* Derecha: Botón Demo + Sol/Luna */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('¿Limpiar pedidos actuales y generar pedidos demo?')) {
                    const ordersKey = `orders-${idUnico}`;
                    // Limpiar pedidos actuales
                    localStorage.removeItem(ordersKey);
                    
                    // Generar pedidos demo
                    const pedidosDemo = [
                      {
                        id: `pedido-${Date.now()}-1`,
                        code: 'S9636',
                        status: 'PENDING',
                        customerName: 'Mesa 12',
                        tableNumber: '12',
                        waiterName: 'Juan Pérez',
                        total: 65000,
                        notes: 'Sin cebolla en el vacío',
                        modalidad: 'salon',
                        paymentMethod: 'efectivo',
                        items: [
                          { id: '0106', name: 'Vacío a la parrilla c/ fritas', quantity: 2, price: 14000 },
                          { id: '0105', name: 'Mejillones c/ fettuccinis', quantity: 1, price: 12000 },
                          { id: '0107', name: 'Peceto al verdeo c/ puré', quantity: 1, price: 15000 },
                          { id: 'bebida-1', name: 'Coca Cola 1.5L', quantity: 2, price: 3000 }
                        ],
                        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
                      },
                      {
                        id: `pedido-${Date.now()}-2`,
                        code: 'S9637',
                        status: 'READY',
                        customerName: 'Mesa 8',
                        tableNumber: '8',
                        waiterName: 'Ana',
                        total: 45000,
                        notes: 'Bien cocido',
                        modalidad: 'salon',
                        paymentMethod: 'mp',
                        items: [
                          { id: '0104', name: 'Pechuga rellena c/ f. españolas', quantity: 1, price: 12000 },
                          { id: '0103', name: 'Chupín de merluza c/ papa natural', quantity: 1, price: 10000 },
                          { id: '0108', name: 'Correntinos caseros a la Vangoli', quantity: 1, price: 13000 },
                          { id: 'bebida-2', name: 'Agua sin gas', quantity: 2, price: 3000 }
                        ],
                        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
                      },
                      {
                        id: `pedido-${Date.now()}-3`,
                        code: 'S9638',
                        status: 'READY',
                        customerName: 'Mesa 5',
                        tableNumber: '5',
                        waiterName: 'Juan Pérez',
                        total: 62000,
                        notes: null,
                        modalidad: 'salon',
                        paymentMethod: 'efectivo',
                        items: [
                          { id: '0106', name: 'Vacío a la parrilla c/ fritas', quantity: 2, price: 14000 },
                          { id: '0102', name: 'Croquetas de carne c/ ensalada', quantity: 1, price: 9000 },
                          { id: '0101', name: 'Riñoncitos al jerez c/ puré', quantity: 1, price: 9000 },
                          { id: 'bebida-3', name: 'Vino tinto copa', quantity: 2, price: 6500 }
                        ],
                        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
                      },
                      {
                        id: `pedido-${Date.now()}-4`,
                        code: 'D9639',
                        status: 'PENDING',
                        customerName: 'María González',
                        tableNumber: null,
                        waiterName: null,
                        total: 28000,
                        notes: 'Timbre 3B',
                        modalidad: 'delivery',
                        paymentMethod: 'mp',
                        items: [
                          { id: '0107', name: 'Peceto al verdeo c/ puré', quantity: 1, price: 15000 },
                          { id: 'bebida-4', name: 'Coca Cola 500ml', quantity: 2, price: 2000 }
                        ],
                        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
                      },
                      {
                        id: `pedido-${Date.now()}-5`,
                        code: 'T9640',
                        status: 'READY',
                        customerName: 'Carlos Rodríguez',
                        tableNumber: null,
                        waiterName: null,
                        total: 24000,
                        notes: null,
                        modalidad: 'retiro',
                        paymentMethod: 'efectivo',
                        items: [
                          { id: '0105', name: 'Mejillones c/ fettuccinis', quantity: 1, price: 12000 },
                          { id: '0102', name: 'Croquetas de carne c/ ensalada', quantity: 1, price: 9000 },
                          { id: 'bebida-5', name: 'Agua con gas', quantity: 1, price: 3000 }
                        ],
                        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
                      },
                      {
                        id: `pedido-${Date.now()}-6`,
                        code: 'S9641',
                        status: 'READY',
                        customerName: 'Mesa 15',
                        tableNumber: '15',
                        waiterName: 'Ana',
                        total: 55000,
                        notes: 'Sin sal en el peceto',
                        modalidad: 'salon',
                        paymentMethod: 'mp',
                        items: [
                          { id: '0106', name: 'Vacío a la parrilla c/ fritas', quantity: 2, price: 14000 },
                          { id: '0104', name: 'Pechuga rellena c/ f. españolas', quantity: 1, price: 12000 },
                          { id: '0105', name: 'Mejillones c/ fettuccinis', quantity: 1, price: 12000 },
                          { id: 'bebida-6', name: 'Cerveza artesanal', quantity: 3, price: 3500 }
                        ],
                        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
                      },
                      {
                        id: `pedido-${Date.now()}-7`,
                        code: 'S9642',
                        status: 'PENDING',
                        customerName: 'Mesa 3',
                        tableNumber: '3',
                        waiterName: 'Juan Pérez',
                        total: 18500,
                        notes: null,
                        modalidad: 'salon',
                        paymentMethod: 'efectivo',
                        items: [
                          { id: '0103', name: 'Chupín de merluza c/ papa natural', quantity: 1, price: 10000 },
                          { id: 'bebida-7', name: 'Cerveza artesanal', quantity: 1, price: 3500 }
                        ],
                        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
                      },
                      {
                        id: `pedido-${Date.now()}-8`,
                        code: 'D9643',
                        status: 'DELIVERED',
                        customerName: 'Laura Martínez',
                        tableNumber: null,
                        waiterName: null,
                        total: 35000,
                        notes: 'Entregar en puerta',
                        modalidad: 'delivery',
                        paymentMethod: 'efectivo',
                        items: [
                          { id: '0106', name: 'Vacío a la parrilla c/ fritas', quantity: 1, price: 14000 },
                          { id: '0105', name: 'Mejillones c/ fettuccinis', quantity: 1, price: 12000 },
                          { id: 'bebida-8', name: 'Coca Cola 1.5L', quantity: 1, price: 3000 }
                        ],
                        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
                      }
                    ];
                    
                    // Guardar en localStorage
                    localStorage.setItem(ordersKey, JSON.stringify(pedidosDemo));
                    
                    // Recargar pedidos
                    setOrders(pedidosDemo);
                    
                    alert(`✅ ${pedidosDemo.length} pedidos demo generados`);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400'
                }`}
                title="Generar pedidos demo"
              >
                🎲 Demo
              </button>
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg border ${
                  isDarkMode 
                    ? 'bg-transparent border-gray-600 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-transparent border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
                title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="p-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cargando pedidos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Pendientes (Cocina) */}
            <div className={`mb-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
              <div className={`px-3 py-1 border-b rounded-t-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2 pl-2">
                    <span className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full border ${
                      isDarkMode ? 'bg-transparent border-gray-500 text-white' : 'bg-transparent border-gray-500 text-gray-800'
                    }`}>
                      {pendingOrders.length}
                    </span>
                    <div className="flex flex-col">
                      <h2 className={`text-base font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        🍳 Pendientes
                      </h2>
                      <span className={`text-[11px] leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Pedidos en cocina
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 pb-3 pt-3">
                <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: isDarkMode ? '#4B5563 #1F2937' : '#9CA3AF #E5E7EB' }}>
                  <div className="flex gap-3" style={{ width: 'max-content' }}>
                    {pendingOrders.sort(sortByDate).map(renderOrderCard)}
                    {pendingOrders.length === 0 && (
                      <div className={`flex items-center justify-center w-64 h-32 rounded-lg border-2 border-dashed ${
                        isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'
                      }`}>
                        <p className="text-sm">No hay pedidos pendientes</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* A Cobrar (Caja) */}
            <div className={`mb-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
              <div className={`px-3 py-1 border-b rounded-t-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2 pl-2">
                    <span className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full border ${
                      isDarkMode ? 'bg-transparent border-gray-500 text-white' : 'bg-transparent border-gray-500 text-gray-800'
                    }`}>
                      {readyOrders.length}
                    </span>
                    <div className="flex flex-col">
                      <h2 className={`text-base font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        💰 A Cobrar
                      </h2>
                      <span className={`text-[11px] leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Pedidos listos para cobro
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 pb-3 pt-3">
                <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: isDarkMode ? '#4B5563 #1F2937' : '#9CA3AF #E5E7EB' }}>
                  <div className="flex gap-3" style={{ width: 'max-content' }}>
                    {readyOrders.sort(sortByDate).map(renderOrderCard)}
                    {readyOrders.length === 0 && (
                      <div className={`flex items-center justify-center w-64 h-32 rounded-lg border-2 border-dashed ${
                        isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'
                      }`}>
                        <p className="text-sm">No hay pedidos listos para cobrar</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Completados */}
            <div className={`mb-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
              <div className={`px-3 py-1 border-b rounded-t-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2 pl-2">
                    <span className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full border ${
                      isDarkMode ? 'bg-transparent border-gray-500 text-white' : 'bg-transparent border-gray-500 text-gray-800'
                    }`}>
                      {completedOrders.length}
                    </span>
                    <div className="flex flex-col">
                      <h2 className={`text-base font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        ✅ Completados
                      </h2>
                      <span className={`text-[11px] leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Pedidos finalizados
                      </span>
                    </div>
                  </div>
                  {completedOrders.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar todos los pedidos completados?')) {
                          const ordersKey = `orders-${idUnico}`;
                          const allOrders = orders.filter(o => o.status !== 'DELIVERED');
                          localStorage.setItem(ordersKey, JSON.stringify(allOrders));
                          setOrders(allOrders);
                        }
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        isDarkMode 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                      title="Limpiar pedidos completados"
                    >
                      🗑️ Limpiar
                    </button>
                  )}
                </div>
              </div>
              <div className="px-3 pb-3 pt-3">
                {completedOrders.length === 0 ? (
                  <div className={`flex items-center justify-center py-8 rounded-lg border-2 border-dashed ${
                    isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'
                  }`}>
                    <p className="text-sm">No hay pedidos completados</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {completedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => {
                      const fecha = new Date(order.createdAt);
                      const fechaStr = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
                      const hora = fecha.getHours();
                      const minutos = fecha.getMinutes();
                      const horaStr = `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
                      
                      // Dato según modalidad
                      let datoModalidad = '';
                      const modalidad = (order as any).modalidad;
                      const code = order.code || '';
                      const prefix = code.charAt(0);
                      
                      if (prefix === 'S' || modalidad === 'salon') {
                        // Salón: Mesa - Mesero/a
                        datoModalidad = order.tableNumber ? `Mesa ${order.tableNumber}` : '';
                        if (order.waiterName) {
                          datoModalidad += datoModalidad ? ` - ${order.waiterName}` : order.waiterName;
                        }
                      } else if (prefix === 'T' || modalidad === 'retiro') {
                        // Take Away: Nombre cliente
                        datoModalidad = order.customerName || '';
                      } else if (prefix === 'D' || modalidad === 'delivery') {
                        // Delivery: Dirección
                        datoModalidad = order.address || '';
                      }
                      
                      const paymentMethod = (order as any).paymentMethod;
                      const formaPago = paymentMethod === 'mp' ? 'MP     ' : paymentMethod === 'efectivo' ? 'Efectivo' : '-      ';
                      
                      return (
                        <div 
                          key={order.id}
                          className={`px-3 py-2 rounded border ${
                            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {order.code}
                              </span>
                              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {fechaStr}
                              </span>
                              {datoModalidad && (
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {datoModalidad}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                ${order.total.toLocaleString('es-AR')}
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ width: '70px', textAlign: 'right', fontFamily: 'monospace' }}>
                                {formaPago}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <NavBar idUnico={idUnico} />

      {/* Modal de confirmación de cambio de estado */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirmModal(false)}>
          <div className={`rounded-xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full`} onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Confirmar
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {confirmMessage}
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmOrderId(null);
                  setConfirmNewStatus(null);
                  setConfirmMessage('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear/Editar Pedido */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Header del Modal */}
            <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pedido <span className="text-blue-500">S</span>{orderCode.slice(1)}
                </h2>
                <button
                  onClick={closeOrderModal}
                  className={`text-2xl ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {/* Lista de Items - Solo cantidad y nombre */}
              <div className="space-y-2 mb-4">
                {orderItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-2 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.quantity}
                    </span>
                    <span className={`text-sm flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
                {orderItems.length === 0 && (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No hay items en el pedido
                  </div>
                )}
              </div>

              {/* Total */}
              <div className={`flex justify-between items-center p-3 rounded mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Total</span>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  ${calculateTotal().toLocaleString('es-AR')}
                </span>
              </div>

              {/* Observaciones */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Observaciones (ej: Sin sal)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Sin sal, sin cebolla, etc."
                />
              </div>

              {/* Salón y Mesa */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Salón
                  </label>
                  <select
                    value={orderTable}
                    onChange={(e) => setOrderTable(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="">Seleccionar...</option>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num.toString()}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Camarero/a
                  </label>
                  <select
                    value={orderWaiter}
                    onChange={(e) => setOrderWaiter(e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Juan Pérez">Juan Pérez</option>
                    <option value="Ana">Ana</option>
                    <option value="Carmen">Carmen</option>
                    <option value="Lucia">Lucia</option>
                  </select>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Método de Pago
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex-1 py-2 px-3 rounded border ${
                      paymentMethod === 'cash'
                        ? isDarkMode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-blue-500 border-blue-400 text-white'
                        : isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    Pago Efectivo
                  </button>
                  <button
                    onClick={() => setPaymentMethod('mp')}
                    className={`flex-1 py-2 px-3 rounded border ${
                      paymentMethod === 'mp'
                        ? isDarkMode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-blue-500 border-blue-400 text-white'
                        : isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}
                  >
                    MP
                  </button>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className={`px-4 py-3 border-t flex justify-end gap-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={closeOrderModal}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Cancelar
              </button>
              <button
                onClick={confirmOrder}
                disabled={orderItems.length === 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  orderItems.length === 0
                    ? isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
