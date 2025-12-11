'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useAppTheme } from '../../hooks/useAppTheme';

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
  const { isDarkMode } = useAppTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos (por ahora datos mock)
  useEffect(() => {
    // TODO: Cargar desde API
    // Por ahora datos mock para mostrar la estructura
    const mockOrders: Order[] = [
      {
        id: '1',
        code: 'P001',
        status: 'PENDING',
        customerName: 'Juan Pérez',
        tableNumber: '5',
        waiterName: 'Maria',
        total: 45000,
        notes: 'Sin cebolla',
        items: [
          { id: '1', name: 'Vacío a la parrilla', quantity: 2, price: 14000 },
          { id: '2', name: 'Coca Cola', quantity: 2, price: 8500 }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min atrás
      },
      {
        id: '2',
        code: 'P002',
        status: 'PREPARING',
        customerName: 'Ana García',
        tableNumber: '12',
        waiterName: 'Lucia',
        total: 32000,
        items: [
          { id: '3', name: 'Milanesa completa', quantity: 1, price: 12000 },
          { id: '4', name: 'Ensalada', quantity: 1, price: 8000 }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 min atrás
      },
      {
        id: '3',
        code: 'P003',
        status: 'READY',
        customerName: 'Carlos López',
        tableNumber: '8',
        waiterName: 'Ana',
        total: 28000,
        items: [
          { id: '5', name: 'Peceto al verdeo', quantity: 1, price: 15000 }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 min atrás
      }
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, [idUnico]);

  // Filtrar pedidos por estado
  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');
  const completedOrders = orders.filter(o => o.status === 'DELIVERED');

  // Ordenar por fecha (más antigua primero - a la izquierda)
  const sortByDate = (a: Order, b: Order) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  // Función para cambiar estado (por ahora solo mock)
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    // TODO: Llamar a API para actualizar estado
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  // Obtener siguiente estado posible
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'PREPARING';
      case 'PREPARING':
        return 'READY';
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
      case 'PREPARING':
        return 'Listo para Cobrar';
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
        style={{ width: '180px', minWidth: '180px', maxWidth: '180px', minHeight: '240px' }}
      >
        {/* Header: Código y Mesa */}
        <div className={`px-3 py-2 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              #{order.code}
            </span>
            {order.tableNumber && (
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Mesa {order.tableNumber}
              </span>
            )}
          </div>
        </div>

        {/* Imagen del primer item */}
        <div className="relative h-24 overflow-hidden flex items-center justify-center bg-gray-100">
          {mainItem?.imageUrl ? (
            <img 
              src={mainItem.imageUrl} 
              alt={mainItem.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.icon-cubiertos')) {
                  const icon = document.createElement('div');
                  icon.className = 'icon-cubiertos w-full h-full flex items-center justify-center text-gray-400 text-4xl';
                  icon.innerHTML = '🍽️';
                  parent.appendChild(icon);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🍽️</div>
          )}
        </div>

        {/* Nombre del cliente - 2 líneas */}
        <div className={`px-3 py-2 border-b ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
          <h3 
            className={`text-xs font-bold text-center line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            style={{ minHeight: '2.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {order.customerName || 'Cliente'}
          </h3>
        </div>

        {/* Info: Items y Total */}
        <div className={`px-3 py-2 space-y-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Items: {order.items.length}
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            ${order.total.toLocaleString('es-AR')}
          </div>
        </div>

        {/* Botón cambiar estado */}
        {nextStatus && (
          <div className="px-3 py-2 border-t">
            <button
              onClick={() => handleStatusChange(order.id, nextStatus)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-white transition-colors ${getButtonColor(order.status)}`}
            >
              {getButtonText(order.status)}
            </button>
          </div>
        )}
      </div>
    );
  };

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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} pb-20`}>
      <header className={`p-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-2xl font-bold text-center">🍽️ Gestión de Pedidos</h1>
      </header>

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
                      {pendingOrders.length + preparingOrders.length}
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
                    {[...pendingOrders, ...preparingOrders].sort(sortByDate).map(renderOrderCard)}
                    {pendingOrders.length === 0 && preparingOrders.length === 0 && (
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
                </div>
              </div>
              <div className="px-3 pb-3 pt-3">
                <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: isDarkMode ? '#4B5563 #1F2937' : '#9CA3AF #E5E7EB' }}>
                  <div className="flex gap-3" style={{ width: 'max-content' }}>
                    {completedOrders.sort(sortByDate).map(renderOrderCard)}
                    {completedOrders.length === 0 && (
                      <div className={`flex items-center justify-center w-64 h-32 rounded-lg border-2 border-dashed ${
                        isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'
                      }`}>
                        <p className="text-sm">No hay pedidos completados</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <NavBar idUnico={idUnico} />
    </div>
  );
}
