# 📊 ESTRUCTURA DE TABLAS - MenuQR

## 🏗️ DIAGRAMA DE RELACIONES

```
┌─────────────────────────────────────────────────────────────────┐
│                        BASE DE DATOS MenuQR                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      USER       │    │      MENU       │    │   CATEGORY      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ name            │    │ restaurantId    │    │ name            │
│ email (UNIQUE)  │    │ restaurantName  │    │ description     │
│ password        │    │ description     │    │ position        │
│ restaurantId    │    │ logoUrl         │    │ code (UNIQUE)   │
│ restaurantName  │    │ primaryColor    │    │ imageUrl        │
│ phone           │    │ secondaryColor  │    │ isActive        │
│ address         │    │ backgroundColor │    │ menuId (FK)     │
│ plan            │    │ textColor       │    └─────────────────┘
│ role            │    │ fontFamily      │             │
│ avatar          │    │ contactPhone    │             │ 1:N
│ isActive        │    │ contactEmail    │             ▼
│ whatsappPhone   │    │ contactAddress  │    ┌─────────────────┐
│ whatsappToken   │    │ contactWebsite  │    │   MENUITEM      │
│ whatsappEnabled │    │ socialInstagram │    ├─────────────────┤
│ createdAt       │    │ socialFacebook  │    │ id (PK)         │
│ updatedAt       │    │ socialTwitter   │    │ name            │
└─────────────────┘    │ showPrices      │    │ description     │
         │             │ showImages      │    │ price           │
         │ 1:1         │ showDescriptions│    │ originalPrice   │
         ▼             │ allowOrdering   │    │ position        │
┌─────────────────┐    │ currency        │    │ code            │
│      MENU       │    │ language        │    │ imageUrl        │
│                 │    │ deliveryEnabled │    │ galleryImages   │
│ ownerId (FK)    │    │ deliveryFee     │    │ hasImage        │
│                 │    │ deliveryRadius  │    │ isAvailable     │
│                 │    │ deliveryMinOrder│    │ isPopular       │
│                 │    │ isActive        │    │ isPromo         │
│                 │    │ ownerId (FK)    │    │ spicyLevel      │
│                 │    │ createdAt       │    │ preparationTime │
│                 │    │ updatedAt       │    │ tags            │
│                 │    └─────────────────┘    │ menuId (FK)     │
│                 │             │             │ categoryId (FK) │
│                 │             │ 1:N         │ createdAt       │
│                 │             ▼             │ updatedAt       │
│                 │    ┌─────────────────┐    └─────────────────┘
│                 │    │   CATEGORY      │             │
│                 │    │                 │             │ 1:N
│                 │    │ menuId (FK)     │             ▼
│                 │    │                 │    ┌─────────────────┐
│                 │    └─────────────────┘    │   ORDERITEM     │
│                 │             │             ├─────────────────┤
│                 │             │ 1:N         │ id (PK)         │
│                 │             ▼             │ orderId (FK)    │
│                 │    ┌─────────────────┐    │ menuItemId (FK) │
│                 │    │   MENUITEM      │    │ itemName        │
│                 │    │                 │    │ itemPrice       │
│                 │    │ menuId (FK)     │    │ quantity        │
│                 │    │ categoryId (FK) │    │ subtotal        │
│                 │    │                 │    │ notes           │
│                 │    └─────────────────┘    │ createdAt       │
│                 │             │             └─────────────────┘
│                 │             │ 1:N                   │
│                 │             ▼                       │ N:1
│                 │    ┌─────────────────┐              │
│                 │    │     ORDER       │◄─────────────┘
│                 │    ├─────────────────┤
│                 │    │ id (PK)         │
│                 │    │ orderNumber     │
│                 │    │ mode            │
│                 │    │ status          │
│                 │    │ tableNumber     │
│                 │    │ customerName    │
│                 │    │ customerPhone   │
│                 │    │ customerAddress │
│                 │    │ deliveryNotes   │
│                 │    │ restaurantId    │
│                 │    │ menuId (FK)     │
│                 │    │ subtotal        │
│                 │    │ deliveryFee     │
│                 │    │ total           │
│                 │    │ createdAt       │
│                 │    │ updatedAt       │
│                 │    │ confirmedAt     │
│                 │    │ completedAt     │
│                 │    │ whatsappSent    │
│                 │    │ whatsappMessage │
│                 │    └─────────────────┘
│                 │
└─────────────────┘
```

## 📋 DETALLE DE CADA TABLA

### 👤 USER
**Propósito:** Gestión de usuarios y comercios
- **Clave Primaria:** `id`
- **Campos Únicos:** `email`, `restaurantId`
- **Roles:** USER, ADMIN, OWNER, SUPERADMIN
- **WhatsApp:** Configuración para notificaciones

### 🍽️ MENU
**Propósito:** Configuración del menú digital
- **Clave Primaria:** `id`
- **Campos Únicos:** `restaurantId`
- **Tema:** Colores, fuentes, estilos
- **Contacto:** Teléfono, email, dirección, redes sociales
- **Delivery:** Configuración de envíos

### 📂 CATEGORY
**Propósito:** Categorías de platos (ej: "Platos del Día", "Promos")
- **Clave Primaria:** `id`
- **Campos Únicos:** `code` (ej: "01", "02", "03")
- **Posición:** Orden de visualización
- **Imagen:** Foto de la categoría

### 🍴 MENUITEM
**Propósito:** Platos individuales del menú
- **Clave Primaria:** `id`
- **Código:** Formato "0101" (categoría + número)
- **Imágenes:** URL principal + galería adicional
- **Estados:** Disponible, Popular, Promo
- **Tags:** Etiquetas para filtros

### 📦 ORDER
**Propósito:** Pedidos de clientes
- **Clave Primaria:** `id`
- **Modos:** SALON (mesa) o DELIVERY (envío)
- **Estados:** PENDING → CONFIRMED → PREPARING → READY → DELIVERED
- **Cliente:** Datos según el modo
- **WhatsApp:** Notificaciones automáticas

### 🛒 ORDERITEM
**Propósito:** Items individuales de cada pedido
- **Clave Primaria:** `id`
- **Snapshot:** Guarda nombre y precio al momento del pedido
- **Cantidad:** Número de unidades
- **Notas:** Personalizaciones del cliente

## 🔗 RELACIONES PRINCIPALES

1. **USER** ←→ **MENU** (1:1) - Un usuario tiene un menú
2. **MENU** ←→ **CATEGORY** (1:N) - Un menú tiene muchas categorías
3. **MENU** ←→ **MENUITEM** (1:N) - Un menú tiene muchos platos
4. **CATEGORY** ←→ **MENUITEM** (1:N) - Una categoría tiene muchos platos
5. **MENU** ←→ **ORDER** (1:N) - Un menú puede tener muchos pedidos
6. **ORDER** ←→ **ORDERITEM** (1:N) - Un pedido tiene muchos items
7. **MENUITEM** ←→ **ORDERITEM** (1:N) - Un plato puede estar en muchos pedidos

## 🎯 FLUJO TÍPICO

```
1. USER confirma su restaurante
2. MENU se crea con configuración básica
3. CATEGORY se crean (Platos del Día, Promos, etc.)
4. MENUITEM se agregan a cada categoría
5. Cliente hace ORDER a través de la carta digital
6. ORDERITEM se crean para cada plato seleccionado
7. WhatsApp notifica al restaurante
```

## 📊 ESTADÍSTICAS POSIBLES

- **Platos más pedidos:** GROUP BY menuItemId en ORDERITEM
- **Categorías populares:** JOIN CATEGORY con ORDERITEM
- **Horarios pico:** GROUP BY HOUR(createdAt) en ORDER
- **Modo de pedido:** COUNT por mode en ORDER
- **Ingresos:** SUM de total en ORDER por fecha
