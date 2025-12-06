# 🍽️ SISTEMA DE PEDIDOS - PROPUESTA Y DIAGRAMA

**Fecha:** Diciembre 2024  
**Estado:** 📋 EN PLANIFICACIÓN

---

## 🎯 OBJETIVO

Implementar un sistema de gestión de pedidos con:
- **Pantalla Cocina**: Ver pedidos pendientes y en preparación
- **Pantalla Caja**: Ver pedidos listos para cobro/adición
- **Flujo automático**: Pedido → Cocina → Caja → Completado

---

## 📊 DIAGRAMA DE FLUJO

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO DE PEDIDOS                     │
└─────────────────────────────────────────────────────────────────┘

1. CLIENTE HACE PEDIDO (Carta QR)
   │
   ├─ Selecciona items del menú
   ├─ Elige modalidad: DELIVERY | TAKEAWAY | SALÓN
   ├─ Completa datos (nombre, teléfono, dirección, mesa, mesero)
   └─ Confirma pedido
       │
       ▼
   [Estado: PENDING]
   [Código: ORD-001]
   [Guardado en BD: Order + OrderItems]

2. PANTALLA COCINA (/panel/[idUnico]/pedidos/cocina)
   │
   ├─ Sección: PENDIENTES (status = PENDING)
   │   └─ Muestra pedidos nuevos (arriba = más reciente)
   │
   ├─ Acción: "Tomar Pedido"
   │   └─ Cambia status: PENDING → PREPARING
   │
   └─ Sección: EN PREPARACIÓN (status = PREPARING)
       └─ Muestra pedidos que están cocinando
       │
       └─ Acción: "Marcar Listo"
           └─ Cambia status: PREPARING → READY
           └─ ⚠️ NOTIFICA A CAJA (sonido/notificación)

3. PANTALLA CAJA (/panel/[idUnico]/pedidos/caja)
   │
   ├─ Sección: LISTOS PARA COBRO (status = READY)
   │   └─ Muestra pedidos listos (arriba = más reciente)
   │   └─ Muestra: código, modalidad, total, tiempo transcurrido
   │
   ├─ Acción: "Cobrar/Adicionar"
   │   └─ Abre modal de pago
   │   └─ Opciones: Efectivo | Tarjeta | Transferencia
   │   └─ Al confirmar pago:
   │       └─ Cambia status: READY → DELIVERED
   │       └─ ⚠️ NOTIFICA A COCINA (pedido completado)
   │
   └─ Sección: COMPLETADOS (status = DELIVERED)
       └─ Historial de pedidos del día
       └─ Filtros: Por modalidad, por mesero, por rango de tiempo

4. ESTADOS ESPECIALES
   │
   ├─ CANCELLED: Pedido cancelado (solo admin)
   └─ CONFIRMED: Pedido confirmado (opcional, intermedio)

┌─────────────────────────────────────────────────────────────────┐
│                    VISTAS POR PANTALLA                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PANTALLA COCINA - /panel/[idUnico]/pedidos/cocina          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🔴 PENDIENTES (3)                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ORD-001 | DELIVERY | $2,500 | Hace 2 min            │  │
│  │ Juan Pérez | Tel: 11-1234-5678                      │  │
│  │ Av. Corrientes 1234                                  │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ 2x Milanesa Napolitana    $1,800              │  │  │
│  │ │ 1x Coca Cola 500ml        $  700              │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  │ [Tomar Pedido]                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  🟡 EN PREPARACIÓN (2)                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ORD-002 | SALÓN | Mesa 5 | $1,200 | Hace 5 min     │  │
│  │ Mesero: María                                         │  │
│  │ ┌────────────────────────────────────────────────┐  │  │
│  │ │ 1x Pizza Muzzarella        $1,200              │  │  │
│  │ └────────────────────────────────────────────────┘  │  │
│  │ [Marcar Listo]                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PANTALLA CAJA - /panel/[idUnico]/pedidos/caja              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🟢 LISTOS PARA COBRO (2)                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ORD-003 | TAKEAWAY | $3,200 | Listo hace 1 min     │  │
│  │ Cliente: Ana García                                   │  │
│  │ Total: $3,200                                         │  │
│  │ [Cobrar] [Ver Detalle]                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ✅ COMPLETADOS HOY (15)                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ORD-001 | DELIVERY | $2,500 | Completado 10:30     │  │
│  │ ORD-002 | SALÓN | $1,200 | Completado 10:25        │  │
│  │ ...                                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    NAVEGACIÓN EN PANEL                            │
└─────────────────────────────────────────────────────────────────┘

/panel/[idUnico]
  ├─ NavBar:
  │   ├─ 📊 Datos del Comercio
  │   ├─ 🍽️ Menú (Editor)
  │   ├─ 📦 Pedidos ← NUEVO
  │   │   ├─ 🍳 Cocina
  │   │   └─ 💰 Caja
  │   └─ ⚙️ Configuración
  │
  └─ /pedidos
      ├─ /cocina → Pantalla Cocina
      └─ /caja → Pantalla Caja

┌─────────────────────────────────────────────────────────────────┐
│                    MEJORAS SUGERIDAS                             │
└─────────────────────────────────────────────────────────────────┘

✅ LO QUE ESTÁ BIEN:
- Separación clara entre Cocina y Caja
- Estados bien definidos (PENDING → PREPARING → READY → DELIVERED)
- Orden por tiempo (más reciente arriba)

💡 SUGERENCIAS:
1. **Notificaciones en tiempo real**
   - WebSockets o Server-Sent Events para actualizar automáticamente
   - Sonido cuando llega pedido nuevo o cuando está listo

2. **Tiempos estimados**
   - Mostrar tiempo estimado de preparación por tipo de pedido
   - Alerta si un pedido lleva mucho tiempo

3. **Filtros y búsqueda**
   - Filtrar por modalidad (Delivery/Take/Salón)
   - Buscar por código de pedido
   - Filtrar por mesero (solo Salón)

4. **Estadísticas**
   - Pedidos del día
   - Tiempo promedio de preparación
   - Pedidos más pedidos

5. **Impresión de comandas**
   - Botón para imprimir comanda en cocina
   - Formato ticket/etiqueta

6. **Cancelación**
   - Solo admin puede cancelar
   - Motivo de cancelación
   - Notificar al cliente si es posible

7. **Modo oscuro para cocina**
   - Pantalla siempre encendida
   - Colores de alto contraste

---

## 📋 IMPLEMENTACIÓN SUGERIDA (FASES)

### FASE 1: Base (MVP)
- [ ] Guardar pedidos en BD cuando cliente confirma
- [ ] API para crear pedidos desde carta
- [ ] API para listar pedidos por estado
- [ ] API para cambiar estado de pedido
- [ ] Pantalla Cocina básica (solo lectura)
- [ ] Pantalla Caja básica (solo lectura)

### FASE 2: Interacción
- [ ] Botones para cambiar estado (Tomar, Marcar Listo, Cobrar)
- [ ] Actualización en tiempo real (polling cada 5 seg)
- [ ] Notificaciones sonoras
- [ ] Filtros básicos

### FASE 3: Avanzado
- [ ] WebSockets para tiempo real
- [ ] Estadísticas y reportes
- [ ] Impresión de comandas
- [ ] Modo oscuro
- [ ] Historial completo

---

## 🔄 ESTADOS DEL PEDIDO

```
PENDING (Pendiente)
  ↓ [Cocina toma pedido]
PREPARING (En Preparación)
  ↓ [Cocina marca listo]
READY (Listo)
  ↓ [Caja cobra]
DELIVERED (Completado)

[Cancelado] → CANCELLED (solo admin)
```

---

## 📝 NOTAS TÉCNICAS

- **Modelo Order ya existe** en schema.prisma ✅
- **OrderStatus enum ya existe** ✅
- **OrderMode enum ya existe** ✅
- Necesitamos:
  - API routes para CRUD de pedidos
  - Componentes React para las pantallas
  - Integración con el carrito actual
  - Sistema de notificaciones

---

**¿Te parece bien este flujo? ¿Algún ajuste antes de implementar?**

