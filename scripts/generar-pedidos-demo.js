// Script para generar pedidos de ejemplo con datos reales
// Ejecutar en la consola del navegador en la página de Pedidos

function generarPedidosDemo(idUnico = '5XJ1J37F') {
  const ordersKey = `orders-${idUnico}`;
  
  // Pedidos de ejemplo con datos reales de Esquina Pompeya
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
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 min atrás
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
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min atrás
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
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 min atrás
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
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString() // 20 min atrás
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
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() // 10 min atrás
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
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 min atrás
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
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() // 2 min atrás
    }
  ];
  
  // Obtener pedidos existentes
  const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
  
  // Agregar los nuevos pedidos al principio
  const allOrders = [...pedidosDemo, ...existingOrders];
  
  // Guardar en localStorage
  localStorage.setItem(ordersKey, JSON.stringify(allOrders));
  
  console.log(`✅ ${pedidosDemo.length} pedidos de ejemplo generados`);
  console.log('Pedidos creados:');
  pedidosDemo.forEach(p => {
    console.log(`  - ${p.code}: ${p.customerName || 'Cliente'} - $${p.total.toLocaleString('es-AR')} - ${p.status}`);
  });
  console.log(`\nTotal de pedidos en localStorage: ${allOrders.length}`);
  console.log('\n🔄 Recarga la página de Pedidos para ver los nuevos pedidos');
  
  return pedidosDemo;
}

// Exportar para uso en consola
if (typeof window !== 'undefined') {
  window.generarPedidosDemo = generarPedidosDemo;
  console.log('📝 Función disponible: generarPedidosDemo(idUnico)');
  console.log('   Ejemplo: generarPedidosDemo("5XJ1J37F")');
}


