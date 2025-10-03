# 🎯 ARQUITECTURA: Sistema de Comandas y Modos (Salón vs Delivery)

## 📋 **Resumen Ejecutivo**

Este documento define cómo diferenciar el contexto de uso de CartaMenu (salón vs delivery) y cómo identificar cliente/mesa para generar comandas o pedidos.

---

## 🔑 **1. DIFERENCIACIÓN DE CONTEXTOS VÍA URL**

### **Estrategia: Query Parameters en el QR**

Cada QR generado incluirá parámetros que definen el contexto:

```
SALÓN (QR en mesa):
https://menuqr.com/menu/esquina-pompeya?mode=salon&table=12

DELIVERY (QR en volante/redes):
https://menuqr.com/menu/esquina-pompeya?mode=delivery
```

### **Ventajas de este approach:**
✅ **Un solo código base** - CartaMenu se adapta según URL  
✅ **QR específicos** - El comercio genera 2 tipos de QR  
✅ **Sin autenticación** - El cliente solo escanea/clickea  
✅ **Tracking automático** - Sabes de dónde viene cada pedido  
✅ **Analítica clara** - Ventas por canal (salón vs delivery)  

---

## 🏗️ **2. ARQUITECTURA DE DATOS - Prisma Schema**

### **Extensiones al Schema Actual**

```prisma
// ============================================
// NUEVOS MODELOS PARA COMANDAS
// ============================================

enum OrderMode {
  SALON     // Pedido en mesa (presencial)
  DELIVERY  // Pedido para envío
  TAKEAWAY  // Retiro en local (opcional futuro)
}

enum OrderStatus {
  PENDING     // Cliente armando pedido
  CONFIRMED   // Cliente confirmó, esperando cocina
  PREPARING   // En cocina
  READY       // Listo para servir/enviar
  DELIVERED   // Entregado/Servido
  CANCELLED   // Cancelado
}

// ============================================
// MODELO: Order (Comanda/Pedido)
// ============================================
model Order {
  id              String       @id @default(cuid())
  orderNumber     Int          // Número correlativo por día (ej: #001, #002)
  
  // CONTEXTO
  mode            OrderMode    // SALON o DELIVERY
  status          OrderStatus  @default(PENDING)
  
  // IDENTIFICACIÓN CLIENTE/MESA
  tableNumber     String?      // Solo si mode=SALON ("Mesa 12")
  customerName    String?      // Obligatorio si mode=DELIVERY
  customerPhone   String?      // Obligatorio si mode=DELIVERY
  customerAddress String?      // Obligatorio si mode=DELIVERY
  deliveryNotes   String?      // "Timbre 3B", "Casa azul"
  
  // DATOS DEL RESTAURANTE
  restaurantId    String       // A qué comercio pertenece
  menu            Menu         @relation(fields: [menuId], references: [id])
  menuId          String
  
  // ITEMS DEL PEDIDO
  items           OrderItem[]  // Relación con items
  
  // TOTALES
  subtotal        Float        // Suma de items
  deliveryFee     Float        @default(0) // Solo si mode=DELIVERY
  total           Float        // subtotal + deliveryFee
  
  // METADATA
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  confirmedAt     DateTime?    // Cuando cliente apretó "Confirmar"
  completedAt     DateTime?    // Cuando se marcó DELIVERED
  
  // WHATSAPP (opcional)
  whatsappSent    Boolean      @default(false)
  whatsappMessage String?      // Mensaje generado automáticamente
  
  @@map("orders")
}

// ============================================
// MODELO: OrderItem (Item dentro de un pedido)
// ============================================
model OrderItem {
  id          String   @id @default(cuid())
  
  // RELACIÓN CON PEDIDO
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId     String
  
  // DATOS DEL PRODUCTO (snapshot al momento del pedido)
  menuItem    MenuItem @relation(fields: [menuItemId], references: [id])
  menuItemId  String
  itemName    String   // Guardamos nombre por si cambia el menu
  itemPrice   Float    // Guardamos precio al momento del pedido
  
  // CANTIDAD Y TOTAL
  quantity    Int      @default(1)
  subtotal    Float    // quantity * itemPrice
  
  // PERSONALIZACIONES (opcional futuro)
  notes       String?  // "Sin cebolla", "Bien cocido"
  
  createdAt   DateTime @default(now())
  
  @@map("order_items")
}

// ============================================
// EXTENSIÓN A MODELO Menu (agregar relación)
// ============================================
// Agregar a Menu existente:
model Menu {
  // ... campos existentes ...
  orders      Order[]  // Relación con pedidos
  
  // CONFIGURACIÓN DELIVERY
  deliveryEnabled  Boolean @default(false)
  deliveryFee      Float   @default(0)
  deliveryRadius   Float?  // km (opcional)
  deliveryMinOrder Float?  // Mínimo para delivery (opcional)
}

// ============================================
// EXTENSIÓN A MODELO MenuItem (agregar relación)
// ============================================
// Agregar a MenuItem existente:
model MenuItem {
  // ... campos existentes ...
  orderItems  OrderItem[]  // Relación con items de pedidos
}
```

---

## 🎨 **3. FLUJO UX: CartaMenu Adaptativo**

### **A. Detección de Modo (useEffect inicial)**

```typescript
// app/menu/[restaurantId]/page.tsx

interface MenuPageProps {
  params: { restaurantId: string };
  searchParams: { mode?: string; table?: string };
}

export default function MenuPage({ params, searchParams }: MenuPageProps) {
  const mode = searchParams.mode || 'salon'; // Default: salón
  const tableNumber = searchParams.table || null;
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  
  // Renderizado condicional según mode
  return (
    <div>
      <MenuHeader mode={mode} table={tableNumber} />
      <CategoryList />
      <CartFloatingButton cart={cart} mode={mode} />
      
      {mode === 'delivery' && <CustomerInfoModal />}
      {mode === 'salon' && <TableConfirmation table={tableNumber} />}
    </div>
  );
}
```

### **B. UI Diferenciada**

#### **MODO SALÓN:**
```
┌─────────────────────────────────────┐
│  🍽️ Esquina Pompeya                │
│  Mesa: 12                           │  ← Identificador visible
│  📱 Llamar mozo                     │  ← Opcional
└─────────────────────────────────────┘

[ Categorías y productos ]

┌─────────────────────────────────────┐
│  🛒 Tu pedido (3 items)             │
│  Total: $25.000                     │
│  [Confirmar Pedido] ──────────►     │  ← Va directo a cocina
└─────────────────────────────────────┘
```

#### **MODO DELIVERY:**
```
┌─────────────────────────────────────┐
│  🚚 Esquina Pompeya - Delivery      │
│  Envío a domicilio: $1.500          │  ← Fee visible
│  Pedido mínimo: $8.000              │
└─────────────────────────────────────┘

[ Categorías y productos ]

┌─────────────────────────────────────┐
│  🛒 Tu pedido (3 items)             │
│  Subtotal: $25.000                  │
│  Envío: $1.500                      │
│  Total: $26.500                     │
│  [Completar datos] ──────────►      │  ← Pide info cliente
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  📝 Tus datos                       │
│  Nombre: [          ]               │
│  Teléfono: [          ]             │
│  Dirección: [          ]            │
│  Observaciones: [          ]        │
│  [Confirmar Pedido]                 │
└─────────────────────────────────────┘
```

---

## 🔄 **4. FLUJO DE DATOS COMPLETO**

### **Diagrama de Flujo: MODO SALÓN**

```
┌─────────────┐
│ Cliente QR  │  Escanea QR en mesa
│ Mesa 12     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ CartaMenu carga con:                │
│ ?mode=salon&table=12                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Cliente agrega productos al carrito │
│ (localStorage temporal)             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ [Confirmar Pedido] ────► POST       │
│ /api/orders/create                  │
│ {                                   │
│   mode: "salon",                    │
│   tableNumber: "12",                │
│   items: [...],                     │
│   total: 25000                      │
│ }                                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Backend crea Order en DB            │
│ - Genera orderNumber: #042          │
│ - Status: CONFIRMED                 │
│ - Items guardados como snapshot     │
└──────┬──────────────────────────────┘
       │
       ├──────► Notifica cocina (WebSocket/Polling)
       │
       └──────► Envía WhatsApp opcional
                "Mesa 12 - Pedido #042:
                 - 2x Milanesa c/fritas
                 - 1x Coca-Cola
                 Total: $25.000"
```

### **Diagrama de Flujo: MODO DELIVERY**

```
┌─────────────┐
│ Cliente URL │  Clickea link de Instagram/WhatsApp
│ o QR Volante│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ CartaMenu carga con:                │
│ ?mode=delivery                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Cliente agrega productos al carrito │
│ (localStorage temporal)             │
│ Ve subtotal + delivery fee          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ [Completar Datos] ────► Modal       │
│ Pide:                               │
│ - Nombre                            │
│ - Teléfono                          │
│ - Dirección                         │
│ - Notas opcionales                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ [Confirmar Pedido] ────► POST       │
│ /api/orders/create                  │
│ {                                   │
│   mode: "delivery",                 │
│   customerName: "Juan Pérez",       │
│   customerPhone: "11-2345-6789",    │
│   customerAddress: "Av. X 123",     │
│   deliveryNotes: "Timbre 3B",       │
│   items: [...],                     │
│   subtotal: 25000,                  │
│   deliveryFee: 1500,                │
│   total: 26500                      │
│ }                                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Backend crea Order en DB            │
│ - Genera orderNumber: #043          │
│ - Status: CONFIRMED                 │
│ - Guarda datos de cliente           │
│ - Items guardados como snapshot     │
└──────┬──────────────────────────────┘
       │
       ├──────► Notifica cocina + delivery
       │
       └──────► Envía WhatsApp automático
                "Nuevo pedido #043 - Delivery
                 📍 Av. X 123 (Timbre 3B)
                 👤 Juan Pérez (11-2345-6789)
                 🍽️ Items:
                 - 2x Milanesa c/fritas
                 - 1x Coca-Cola
                 💰 Total: $26.500"
```

---

## 🛠️ **5. IMPLEMENTACIÓN TÉCNICA**

### **A. API Endpoint: Crear Pedido**

```typescript
// app/api/orders/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      mode,           // 'salon' | 'delivery'
      restaurantId,
      tableNumber,    // Solo si mode=salon
      customerName,   // Solo si mode=delivery
      customerPhone,  // Solo si mode=delivery
      customerAddress,// Solo si mode=delivery
      deliveryNotes,
      items,          // Array de { menuItemId, quantity }
      subtotal,
      deliveryFee,
      total
    } = body;

    // VALIDACIÓN
    if (mode === 'salon' && !tableNumber) {
      return NextResponse.json(
        { error: 'Mesa requerida para modo salón' },
        { status: 400 }
      );
    }

    if (mode === 'delivery' && (!customerName || !customerPhone || !customerAddress)) {
      return NextResponse.json(
        { error: 'Datos de cliente requeridos para delivery' },
        { status: 400 }
      );
    }

    // GENERAR NÚMERO DE PEDIDO (correlativo del día)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ordersToday = await prisma.order.count({
      where: {
        restaurantId,
        createdAt: { gte: today }
      }
    });
    
    const orderNumber = ordersToday + 1;

    // CREAR PEDIDO
    const order = await prisma.order.create({
      data: {
        orderNumber,
        mode,
        status: 'CONFIRMED',
        restaurantId,
        menuId: body.menuId,
        
        // Datos condicionales
        tableNumber: mode === 'salon' ? tableNumber : null,
        customerName: mode === 'delivery' ? customerName : null,
        customerPhone: mode === 'delivery' ? customerPhone : null,
        customerAddress: mode === 'delivery' ? customerAddress : null,
        deliveryNotes,
        
        // Totales
        subtotal,
        deliveryFee: mode === 'delivery' ? deliveryFee : 0,
        total,
        
        confirmedAt: new Date(),
        
        // Crear items en la misma transacción
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            itemName: item.name,
            itemPrice: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          }))
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    // ENVIAR NOTIFICACIÓN WHATSAPP (opcional)
    if (body.sendWhatsApp) {
      const whatsappMessage = formatWhatsAppMessage(order);
      await sendWhatsAppNotification(restaurantId, whatsappMessage);
    }

    return NextResponse.json({
      success: true,
      order,
      message: `Pedido #${orderNumber} confirmado`
    });

  } catch (error) {
    console.error('Error creando pedido:', error);
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    );
  }
}

// HELPER: Formatear mensaje WhatsApp
function formatWhatsAppMessage(order: any): string {
  const modeEmoji = order.mode === 'salon' ? '🍽️' : '🚚';
  const identifier = order.mode === 'salon' 
    ? `Mesa ${order.tableNumber}` 
    : `${order.customerName} (${order.customerPhone})`;
  
  let message = `${modeEmoji} *Nuevo Pedido #${order.orderNumber}*\n\n`;
  message += `📍 ${identifier}\n\n`;
  
  if (order.mode === 'delivery') {
    message += `🏠 Dirección: ${order.customerAddress}\n`;
    if (order.deliveryNotes) {
      message += `📝 Notas: ${order.deliveryNotes}\n`;
    }
    message += `\n`;
  }
  
  message += `🍽️ *Items:*\n`;
  order.items.forEach((item: any) => {
    message += `• ${item.quantity}x ${item.itemName} - $${item.subtotal}\n`;
  });
  
  message += `\n💰 *Total: $${order.total}*`;
  
  return message;
}
```

### **B. Componente CartaMenu con Context Detection**

```typescript
// app/menu/[restaurantId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MenuPage({ params }: { params: { restaurantId: string } }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'salon';
  const tableNumber = searchParams.get('table');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  // CARGAR MENÚ
  useEffect(() => {
    loadMenu(params.restaurantId);
  }, [params.restaurantId]);

  // CONFIRMAR PEDIDO
  const handleConfirmOrder = async () => {
    if (mode === 'delivery' && !customerData) {
      setShowCustomerForm(true);
      return;
    }

    const orderData = {
      mode,
      restaurantId: params.restaurantId,
      menuId: menuData.id,
      
      // Condicional según modo
      ...(mode === 'salon' && { tableNumber }),
      ...(mode === 'delivery' && {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        deliveryNotes: customerData.notes
      }),
      
      items: cart.map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      
      subtotal: cartSubtotal,
      deliveryFee: mode === 'delivery' ? menuData.deliveryFee : 0,
      total: cartTotal,
      
      sendWhatsApp: true
    };

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Mostrar confirmación
        showSuccessModal(result.order);
        
        // Limpiar carrito
        setCart([]);
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error confirmando pedido:', error);
    }
  };

  return (
    <div>
      {/* Header adaptativo */}
      <MenuHeader 
        mode={mode} 
        tableNumber={tableNumber}
        deliveryFee={mode === 'delivery' ? menuData.deliveryFee : 0}
      />

      {/* Categorías y productos */}
      <CategoryList items={menuData.categories} onAddToCart={addToCart} />

      {/* Carrito flotante */}
      <CartFloatingButton 
        cart={cart}
        mode={mode}
        onConfirm={handleConfirmOrder}
      />

      {/* Modal datos cliente (solo delivery) */}
      {showCustomerForm && (
        <CustomerInfoModal 
          onSubmit={(data) => {
            setCustomerData(data);
            setShowCustomerForm(false);
            handleConfirmOrder();
          }}
          onClose={() => setShowCustomerForm(false)}
        />
      )}
    </div>
  );
}
```

---

## 📊 **6. PANEL ADMIN: Vista de Comandas**

### **Dashboard de Pedidos en Tiempo Real**

```
┌───────────────────────────────────────────────────┐
│  🍽️ COMANDAS EN VIVO - Esquina Pompeya           │
│  [🏠 Salón] [🚚 Delivery] [📊 Historial]          │
└───────────────────────────────────────────────────┘

SALÓN (Activas: 8)
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 🍽️ MESA 12          │ 🍽️ MESA 05          │ 🍽️ MESA 08          │
│ Pedido #042          │ Pedido #038          │ Pedido #040          │
│ ⏱️ 12:45 (8 min)     │ ⏱️ 12:30 (23 min)    │ ⏱️ 12:38 (15 min)    │
│                      │                      │                      │
│ • 2x Milanesa fritas │ • 1x Lomo pimienta   │ • 3x Empanada JyQ    │
│ • 1x Coca-Cola       │ • 1x Ensalada mixta  │ • 2x Quilmes         │
│                      │                      │                      │
│ Total: $25.000       │ Total: $18.500       │ Total: $12.000       │
│                      │                      │                      │
│ [🔥 En cocina]       │ [✅ Listo]           │ [🔥 En cocina]       │
│ [❌ Cancelar]        │ [✔️ Servido]         │ [❌ Cancelar]        │
└──────────────────────┴──────────────────────┴──────────────────────┘

DELIVERY (Activas: 3)
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 🚚 Juan Pérez        │ 🚚 María González    │ 🚚 Carlos López      │
│ Pedido #043          │ Pedido #041          │ Pedido #044          │
│ ⏱️ 12:50 (3 min)     │ ⏱️ 12:35 (18 min)    │ ⏱️ 12:52 (1 min)     │
│                      │                      │                      │
│ 📍 Av. Directorio 123│ 📍 Calle Falsa 456   │ 📍 Av. Rivadavia 789 │
│ 📞 11-2345-6789      │ 📞 11-8765-4321      │ 📞 11-5555-1234      │
│ 📝 Timbre 3B         │ 📝 Piso 2, Dpto A    │ 📝 Casa azul         │
│                      │                      │                      │
│ • 2x Milanesa fritas │ • 1x Pizza muzza     │ • 4x Empanada carne  │
│ • 1x Coca-Cola       │ • 1x Fernet          │ • 1x Coca-Cola       │
│                      │                      │                      │
│ Subtotal: $25.000    │ Subtotal: $15.000    │ Subtotal: $10.400    │
│ Envío: $1.500        │ Envío: $1.500        │ Envío: $1.500        │
│ Total: $26.500       │ Total: $16.500       │ Total: $11.900       │
│                      │                      │                      │
│ [🔥 En cocina]       │ [✅ Listo]           │ [🔥 En cocina]       │
│ [📞 Llamar cliente]  │ [🚗 En camino]       │ [❌ Cancelar]        │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

---

## 🎯 **7. ESTRATEGIA DE IMPLEMENTACIÓN**

### **Fase 1: MVP (1 semana)**
```
✅ Extender Prisma schema (Order, OrderItem)
✅ API POST /api/orders/create
✅ CartaMenu con detección de ?mode=salon|delivery
✅ UI diferenciada (header, footer, carrito)
✅ Modal datos cliente (delivery)
✅ Confirmación de pedido básica
```

### **Fase 2: Panel Admin (3-5 días)**
```
✅ Dashboard comandas en vivo
✅ Vista separada Salón vs Delivery
✅ Botones de estado (En cocina → Listo → Servido/Entregado)
✅ Auto-refresh cada 10 segundos (polling)
```

### **Fase 3: WhatsApp & Notificaciones (2-3 días)**
```
✅ Integración WhatsApp Business API
✅ Envío automático de confirmación
✅ Formateo bonito del mensaje
✅ (Opcional) Estados de WhatsApp (confirmado, preparando, listo)
```

### **Fase 4: Mejoras (opcional)**
```
🔲 WebSockets para comandas en tiempo real
🔲 Impresión automática en cocina
🔲 Estadísticas (ventas por canal, platos más pedidos)
🔲 Historial de pedidos por cliente
🔲 Zona de delivery (radio en mapa)
```

---

## ✅ **8. CHECKLIST DE IMPLEMENTACIÓN**

### **Backend (Prisma + API)**
- [ ] Migrar schema con modelos Order y OrderItem
- [ ] Seedear Menu con deliveryEnabled y deliveryFee
- [ ] Crear API /api/orders/create
- [ ] Crear API /api/orders/list (para admin)
- [ ] Crear API /api/orders/[id]/update-status

### **Frontend (CartaMenu)**
- [ ] Detectar mode y table de searchParams
- [ ] UI condicional header (salón vs delivery)
- [ ] Componente Cart con subtotal/delivery/total
- [ ] Modal CustomerInfoForm (delivery)
- [ ] Confirmación de pedido con animación
- [ ] Botón "Ver estado pedido" (opcional)

### **Admin Panel**
- [ ] Página /admin/comandas
- [ ] Cards de pedidos activos (salón)
- [ ] Cards de pedidos activos (delivery)
- [ ] Botones cambio de estado
- [ ] Auto-refresh con polling
- [ ] Sonido notificación pedido nuevo (opcional)

### **Generación de QRs**
- [ ] Componente QR Generator en /editor
- [ ] Opción "QR Salón" → genera con ?mode=salon&table=X
- [ ] Opción "QR Delivery" → genera con ?mode=delivery
- [ ] Descargar QRs en PDF (por mesa)
- [ ] QR único para redes sociales (delivery)

---

## 🚀 **9. EJEMPLO PRÁCTICO**

### **Escenario: Restaurante "Esquina Pompeya"**

#### **QRs Generados:**
```
Mesa 1:  https://menuqr.com/menu/esquina-pompeya?mode=salon&table=1
Mesa 2:  https://menuqr.com/menu/esquina-pompeya?mode=salon&table=2
...
Mesa 20: https://menuqr.com/menu/esquina-pompeya?mode=salon&table=20

Delivery (redes/volantes):
https://menuqr.com/menu/esquina-pompeya?mode=delivery
```

#### **Flujo Cliente Mesa 12:**
1. Escanea QR → Abre con ?mode=salon&table=12
2. Ve header: "🍽️ Mesa 12"
3. Agrega: 2x Milanesa ($18.000), 1x Coca ($3.000)
4. Aprieta [Confirmar Pedido]
5. Ve confirmación: "Pedido #042 enviado a cocina"
6. En cocina aparece card: "Mesa 12 - Pedido #042"

#### **Flujo Cliente Delivery:**
1. Clickea link Instagram → Abre con ?mode=delivery
2. Ve header: "🚚 Delivery - Envío: $1.500"
3. Agrega: 1x Pizza ($15.000)
4. Aprieta [Completar Datos]
5. Llena: Nombre, teléfono, dirección
6. Aprieta [Confirmar Pedido]
7. Ve confirmación: "Pedido #043 recibido. Te enviaremos actualización por WhatsApp"
8. Recibe WhatsApp: "Pedido #043 confirmado. Tiempo estimado: 45 min"

---

## 💡 **10. PREGUNTAS FRECUENTES**

### **¿Por qué no usar autenticación de usuario?**
**R:** Para salón es innecesario (la mesa es identificador). Para delivery, pedir datos una vez por pedido es más rápido que crear cuenta.

### **¿Cómo evitar pedidos duplicados?**
**R:** Deshabilitar botón "Confirmar" durante POST. Limpiar carrito después de éxito.

### **¿Qué pasa si el cliente cierra la página antes de confirmar?**
**R:** El carrito está en localStorage, se recupera si vuelve a entrar (mismo navegador).

### **¿Cómo manejar cambios de mesa?**
**R:** En admin panel, botón "Cambiar mesa" actualiza tableNumber del Order.

### **¿Y si el delivery es fuera de zona?**
**R:** (Opcional) Validar con API de geolocalización. Por ahora, rechazar manual desde admin.

---

## 📌 **11. RESUMEN**

| Aspecto | Salón | Delivery |
|---------|-------|----------|
| **URL** | ?mode=salon&table=12 | ?mode=delivery |
| **Identificador** | Número de mesa | Datos de cliente |
| **UI Header** | 🍽️ Mesa X | 🚚 Delivery |
| **Datos requeridos** | Ninguno (mesa ya en URL) | Nombre, tel, dirección |
| **Delivery fee** | No aplica | Configurable por comercio |
| **Notificación** | WhatsApp a comercio | WhatsApp a comercio + cliente |
| **Admin panel** | Vista "Salón" | Vista "Delivery" |

---

**Documento creado:** 2025-10-02  
**Versión:** 1.0  
**Autor:** Sistema MenuQR  

---
