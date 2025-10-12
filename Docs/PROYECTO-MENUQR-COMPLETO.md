# 📚 PROYECTO MENUQR - DOCUMENTACIÓN MAESTRA

**Fecha de creación:** Octubre 2025  
**Última actualización:** 13 de Octubre 2025  
**Autor:** Sistema MenuQR / bdileo35  
**Versión:** 2.0.0  
**Estado:** Demo funcional con datos reales en Supabase  

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Técnica](#arquitectura-técnica)
3. [Base de Datos](#base-de-datos)
4. [APIs y Endpoints](#apis-y-endpoints)
5. [Estructura de Páginas](#estructura-de-páginas)
6. [Componentes Clave](#componentes-clave)
7. [Flujos de Usuario](#flujos-de-usuario)
8. [Sistema de Comandas](#sistema-de-comandas)
9. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
10. [Roadmap y Próximos Pasos](#roadmap-y-próximos-pasos)

---

## 1. RESUMEN EJECUTIVO

### 🎯 **¿Qué es MenuQR?**

MenuQR es una plataforma SaaS para restaurantes que permite:
- Crear menús digitales accesibles vía QR
- Gestionar productos y categorías en tiempo real
- Recibir pedidos de salón y delivery
- Sistema de comandas para cocina

### 💡 **Propuesta de Valor**

**Problema que resuelve:**
- Cartas físicas desactualizadas y costosas
- Gestión manual de pedidos propensa a errores
- Falta de visibilidad de ventas por canal (salón/delivery)

**Solución:**
- Carta digital actualizable en segundos
- QR específicos por mesa para pedidos directos
- Panel de comandas en tiempo real
- Analytics de productos más vendidos

### 🎯 **Target**

- **Primario:** Restaurantes pequeños/medianos (10-30 mesas)
- **Secundario:** Cafeterías, bares, food trucks
- **Perfil ideal:** Comercios que buscan digitalizar sin sistemas complejos

### 💰 **Modelo de Negocio**

```
FREE:     Carta digital básica + QR
PRO:      $10/mes - Comandas + Delivery + WhatsApp
PREMIUM:  $30/mes - Multi-sucursal + POS + Analytics
```

---

## 2. ARQUITECTURA TÉCNICA

### 🏗️ **Stack Tecnológico**

```yaml
Fullstack (Frontend + Backend):
  - Next.js 14.2.5 (App Router)
  - React 18
  - TypeScript 5.x
  - Tailwind CSS 3.x
  - Next.js API Routes (serverless)
  - Node.js runtime

Base de Datos:
  - Prisma ORM 5.x
  - PostgreSQL en Supabase (producción) ✅ ACTIVO
  - SQLite (desarrollo local)

Deploy:
  - Vercel (aplicación completa + APIs) ✅ ACTIVO
  - Supabase (PostgreSQL) ✅ ACTIVO
  - GitHub Actions (CI/CD pendiente)

Herramientas y Dependencias:
  - Tesseract.js (OCR scanner - gratuito)
  - OpenAI GPT-4 Vision (OCR mejorado - futuro)
  - bcryptjs (encriptación)
  - qrcode (generación QR)
  - react-dropzone (upload archivos)
  - Storybook (testing visual - instalado)
  - Git/GitHub (control versiones)
  
Servicios Externos (Gratuitos):
  - Supabase (PostgreSQL + Auth + Storage)
  - Cloudinary (1000 imágenes/mes gratis)
  - Resend (3000 emails/mes gratis)
  - Google Places API (futuro - para horarios)
  - WhatsApp Business API (básico gratis)
```

### 📁 **Estructura del Proyecto**

```
MenuQR/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── api/                     # Backend APIs
│   │   ├── menu/
│   │   │   └── esquina-pompeya/
│   │   │       └── route.ts     # GET menú específico ⭐
│   │   ├── seed-demo/
│   │   │   └── route.ts         # POST seed Supabase ⭐
│   │   └── health/
│   │       └── route.ts         # Health check
│   ├── carta-menu/
│   │   └── page.tsx             # Vista pública del menú ⭐ FUNCIONAL
│   ├── editor2/
│   │   └── page.tsx             # Editor principal ⭐ FUNCIONAL
│   ├── scanner/
│   │   └── page.tsx             # OCR de carta física
│   ├── qr-shop/
│   │   └── page.tsx             # Tienda QR (futuro)
│   └── components/
│       ├── DemoHeader.tsx       # Header demo
│       └── SmartScannerMejorado.tsx  # Scanner multi-imagen ⭐
│
├── prisma/
│   ├── schema.prisma            # Definición DB (PostgreSQL)
│   └── dev.db                   # SQLite local
│
├── scripts/
│   └── [eliminados]             # Scripts de seed deprecados
│
├── lib/
│   └── prisma.ts                # Cliente Prisma singleton
│
├── public/
│   ├── demo-images/             # Imágenes ejemplo
│   ├── platos/                  # Fotos de platos
│   ├── DatosComercio.jpg        # Mockup paso 1 wizard
│   ├── Scanner_OCR.jpg          # Mockup paso 2 wizard
│   ├── page1.jpg, page4.jpg, page5.jpg, final.jpg  # Mockups
│   └── Logo.jpg                 # Logo Esquina Pompeya
│
├── Docs/                         # Documentación
│   ├── PROYECTO-MENUQR-COMPLETO.md  # ⭐ DOCUMENTO MAESTRO
│   ├── Menu_Esquina_Pompeya.md      # Datos reales del menú
│   ├── Qwen_md_20251012_uv3p97ob8.md  # Análisis Qwen AI
│   └── [otros docs deprecados]
│
└── [archivos deprecados eliminados]  # Limpieza reciente
```

### 🔄 **Arquitectura de Datos**

```
┌─────────────┐
│   Cliente   │ (Browser)
└──────┬──────┘
       │
       │ HTTP/HTTPS
       ▼
┌─────────────────────────────────┐
│      Next.js Frontend           │
│  (React Components + Pages)     │
└──────────┬──────────────────────┘
           │
           │ fetch('/api/...')
           ▼
┌─────────────────────────────────┐
│    Next.js API Routes           │
│  (Serverless Functions)         │
└──────────┬──────────────────────┘
           │
           │ Prisma Client
           ▼
┌─────────────────────────────────┐
│      Prisma ORM                 │
│  (Query Builder + Migrations)   │
└──────────┬──────────────────────┘
           │
           │ SQL Queries
           ▼
┌─────────────────────────────────┐
│    SQLite / PostgreSQL          │
│  (Base de Datos)                │
└─────────────────────────────────┘
```

---

## 3. BASE DE DATOS

### 📊 **Schema Prisma Completo**

```prisma
// ============================================
// ENUMS
// ============================================

enum Role {
  USER
  ADMIN
  OWNER
  SUPERADMIN  // Para OCR y features avanzados
}

enum OrderMode {
  SALON       // Pedido en mesa (presencial)
  DELIVERY    // Pedido para envío a domicilio
  TAKEAWAY    // Retiro en local (futuro)
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
// MODELO: User (Dueño del comercio)
// ============================================

model User {
  id             String   @id @default(cuid())
  name           String
  email          String   @unique
  password       String   // Hasheado con bcryptjs
  restaurantId   String   @unique
  restaurantName String
  phone          String?
  address        String?
  plan           String?  @default("basic")
  role           Role     @default(ADMIN)
  avatar         String?
  isActive       Boolean  @default(true)
  lastLogin      DateTime?
  
  // WhatsApp Business API
  whatsappPhone       String?
  whatsappToken       String?
  whatsappPhoneId     String?
  whatsappEnabled     Boolean @default(false)
  
  // Relaciones
  menus          Menu[]
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("users")
}

// ============================================
// MODELO: Menu (Configuración del menú)
// ============================================

model Menu {
  id             String   @id @default(cuid())
  restaurantId   String   @unique
  restaurantName String
  description    String?
  
  // Logo
  logoUrl        String?
  logoPublicId   String?   // Cloudinary ID
  
  // Theme (personalización visual)
  primaryColor     String @default("#2563eb")
  secondaryColor   String @default("#64748b")
  backgroundColor  String @default("#ffffff")
  textColor        String @default("#1f2937")
  fontFamily       String @default("Inter")
  
  // Información de contacto
  contactPhone     String?
  contactEmail     String?
  contactAddress   String?
  contactWebsite   String?
  socialInstagram  String?
  socialFacebook   String?
  socialTwitter    String?
  
  // Configuración de visualización
  showPrices       Boolean @default(true)
  showImages       Boolean @default(true)
  showDescriptions Boolean @default(true)
  showNutritional  Boolean @default(false)
  allowOrdering    Boolean @default(false)
  currency         String  @default("$")
  language         String  @default("es")
  
  // Configuración de Delivery
  deliveryEnabled  Boolean @default(false)
  deliveryFee      Float   @default(0)
  deliveryRadius   Float?  // km
  deliveryMinOrder Float?  // Monto mínimo
  
  isActive       Boolean  @default(true)
  
  // Relaciones
  owner          User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId        String
  categories     Category[]
  items          MenuItem[]
  orders         Order[]
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("menus")
}

// ============================================
// MODELO: Category (Sección del menú)
// ============================================

model Category {
  id          String   @id @default(cuid())
  name        String   // "PLATOS DEL DÍA", "PROMOS", etc.
  description String?
  position    Int      @default(0)  // Orden de visualización
  isActive    Boolean  @default(true)
  
  // Imagen de categoría (opcional)
  imageUrl    String?
  imagePublicId String?
  
  // Relaciones
  menu        Menu     @relation(fields: [menuId], references: [id], onDelete: Cascade)
  menuId      String
  items       MenuItem[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("categories")
}

// ============================================
// MODELO: MenuItem (Producto/Plato)
// ============================================

model MenuItem {
  id              String   @id @default(cuid())
  name            String
  description     String?
  price           Float
  originalPrice   Float?    // Para mostrar descuentos
  position        Int       @default(0)
  
  // Imágenes (Valor comercial clave)
  imageUrl        String?
  imagePublicId   String?
  galleryImages   String?   // JSON array de URLs
  hasImage        Boolean   @default(false)
  
  // Estado y features
  isAvailable     Boolean  @default(true)
  isPopular       Boolean  @default(false)
  isPromo         Boolean  @default(false)
  spicyLevel      Int      @default(0)  // 0-3
  
  // Info comercial
  preparationTime Int?      // minutos
  tags            String?   // "PROMO,POPULAR,NUEVO"
  
  // Relaciones
  menu            Menu     @relation(fields: [menuId], references: [id], onDelete: Cascade)
  menuId          String
  category        Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  categoryId      String
  orderItems      OrderItem[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("menu_items")
}

// ============================================
// MODELO: Order (Comanda/Pedido)
// ============================================

model Order {
  id              String       @id @default(cuid())
  orderNumber     Int          // Correlativo del día (1, 2, 3...)
  
  // Contexto del pedido
  mode            OrderMode
  status          OrderStatus  @default(PENDING)
  
  // Identificación (condicional según mode)
  tableNumber     String?      // Solo SALON
  customerName    String?      // Solo DELIVERY
  customerPhone   String?      // Solo DELIVERY
  customerAddress String?      // Solo DELIVERY
  deliveryNotes   String?      // "Timbre 3B", etc.
  
  // Datos del restaurante
  restaurantId    String
  menu            Menu         @relation(fields: [menuId], references: [id])
  menuId          String
  
  // Items del pedido
  items           OrderItem[]
  
  // Totales
  subtotal        Float
  deliveryFee     Float        @default(0)
  total           Float
  
  // Metadata temporal
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  confirmedAt     DateTime?
  completedAt     DateTime?
  
  // WhatsApp (opcional)
  whatsappSent    Boolean      @default(false)
  whatsappMessage String?
  
  @@map("orders")
}

// ============================================
// MODELO: OrderItem (Producto en pedido)
// ============================================

model OrderItem {
  id          String   @id @default(cuid())
  
  // Relación con pedido
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId     String
  
  // Snapshot del producto (por si cambia el menú)
  menuItem    MenuItem @relation(fields: [menuItemId], references: [id])
  menuItemId  String
  itemName    String   // Guardado al momento del pedido
  itemPrice   Float    // Guardado al momento del pedido
  
  // Cantidad y total
  quantity    Int      @default(1)
  subtotal    Float    // quantity * itemPrice
  
  // Personalizaciones (futuro)
  notes       String?  // "Sin cebolla", etc.
  
  createdAt   DateTime @default(now())
  
  @@map("order_items")
}
```

### 🔑 **Relaciones Clave**

```
User (1) ──► Menu (N)
Menu (1) ──► Category (N) ──► MenuItem (N)
Menu (1) ──► Order (N) ──► OrderItem (N)
MenuItem (1) ──► OrderItem (N)
```

### 📦 **Datos Actuales (Seed)**

**Restaurante de prueba:** Esquina Pompeya

```yaml
Usuario:
  email: esquina@pompeya.com
  password: esquina2024
  restaurantId: esquina-pompeya

Menú:
  - 9 categorías
  - 73 productos reales
  - Delivery habilitado ($1500 fee)

Categorías:
  1. Platos del Día (8 items)
  2. Promos de la Semana (2 items)
  3. Tortillas (11 items)
  4. Omelets (4 items)
  5. Cocina (14 items)
  6. Sandwiches Fríos (4 items)
  7. Sandwiches Calientes (14 items)
  8. Entradas (15 items)
  9. Empanadas (1 item)
```

---

## 4. APIS Y ENDPOINTS

### 🔌 **Endpoints Disponibles**

#### **1. GET `/api/menu/[restaurantId]`**

Obtiene el menú completo de un restaurante con todas sus categorías e items.

**Request:**
```http
GET /api/menu/esquina-pompeya
```

**Response (200):**
```json
{
  "success": true,
  "menu": {
    "id": "clxxx...",
    "restaurantName": "Esquina Pompeya",
    "restaurantId": "esquina-pompeya",
    "contactPhone": "+54 11 1234-5678",
    "contactAddress": "Av. Fernández de la Cruz 1100",
    "deliveryEnabled": true,
    "deliveryFee": 1500,
    "categories": [
      {
        "id": "cat_xxx",
        "name": "PLATOS DEL DÍA",
        "position": 0,
        "items": [
          {
            "id": "item_xxx",
            "name": "Milanesas al horno c/ Puré",
            "price": 9000,
            "description": null,
            "isAvailable": true,
            "isPopular": false,
            "isPromo": false
          }
        ]
      }
    ]
  }
}
```

**Uso:** Carta pública (carta-menu/page.tsx)

---

#### **2. GET `/api/menu/[restaurantId]/items`**

Obtiene el menú con estructura completa para el editor.

**Request:**
```http
GET /api/menu/esquina-pompeya/items
```

**Response (200):**
```json
{
  "success": true,
  "menu": {
    "id": "clxxx...",
    "categories": [
      {
        "id": "cat_xxx",
        "name": "PLATOS DEL DÍA",
        "items": [...]
      }
    ]
  }
}
```

**Uso:** Editor (editor-clean/page.tsx)

---

#### **3. POST `/api/menu/[restaurantId]/items`**

Crea un nuevo producto en una categoría.

**Request:**
```http
POST /api/menu/esquina-pompeya/items
Content-Type: application/json

{
  "name": "Hamburguesa completa",
  "price": 8000,
  "description": "Con papas fritas",
  "categoryId": "cat_xxx"
}
```

**Response (200):**
```json
{
  "success": true,
  "item": {
    "id": "item_new",
    "name": "Hamburguesa completa",
    "price": 8000,
    "position": 15
  },
  "message": "Producto creado exitosamente"
}
```

**Validaciones:**
- `name` requerido
- `price` requerido (se limpia de caracteres no numéricos)
- `categoryId` requerido y debe existir

---

#### **4. PUT `/api/menu/[restaurantId]/items`**

Actualiza un producto existente.

**Request:**
```http
PUT /api/menu/esquina-pompeya/items
Content-Type: application/json

{
  "itemId": "item_xxx",
  "name": "Milanesas al horno c/ Puré (nuevo)",
  "price": 9500,
  "description": "Actualizada"
}
```

**Response (200):**
```json
{
  "success": true,
  "item": {
    "id": "item_xxx",
    "name": "Milanesas al horno c/ Puré (nuevo)",
    "price": 9500
  },
  "message": "Producto actualizado exitosamente"
}
```

---

#### **5. DELETE `/api/menu/[restaurantId]/items?itemId=X`**

Elimina un producto.

**Request:**
```http
DELETE /api/menu/esquina-pompeya/items?itemId=item_xxx
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

---

### 🔒 **Seguridad y Autenticación**

**Estado actual:** No implementada (MVP)

**Próximos pasos:**
```typescript
// Middleware de autenticación (futuro)
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }
  
  // Verificar que el usuario sea owner del restaurante
  // ...
}
```

---

## 5. ESTRUCTURA DE PÁGINAS

### 📄 **Páginas Activas**

#### **1. `/` - Landing Page**

**Archivo:** `app/page.tsx`  
**Estado:** ✅ Funcional  
**Propósito:** Página de inicio con navegación a features

**Features:**
- Hero section con CTA
- Navegación a scanner, setup, editor
- Links a demo

---

#### **2. `/carta-menu` - Vista Pública del Menú**

**Archivo:** `app/carta-menu/page.tsx`  
**Estado:** ✅ Funcional (conectado a API)  
**Propósito:** Menú digital accesible vía QR

**Features implementadas:**
- ✅ Carga datos desde `/api/menu/esquina-pompeya`
- ✅ Logo responsive (h-24 w-36)
- ✅ Links clickeables (Google Maps, WhatsApp, MP)
- ✅ Modo oscuro/claro
- ✅ Modal de detalle al clickear producto
- ✅ Categorías colapsables
- ✅ Fallback a localStorage si API falla

**UI/UX:**
```
┌────────────────────────────────────┐
│ [Logo]    Esquina Pompeya          │
│           📍 Dirección (→ Maps)    │
│           📱 WhatsApp (→ WA)       │
│           💳 MP Alias              │
│                           [🌙]     │
├────────────────────────────────────┤
│ PLATOS DEL DÍA                     │
│ ┌────────────────────────────────┐ │
│ │ [img] Milanesas c/Puré  $9000 │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ [img] Vacío a la parrilla...  │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

**Conexión API:**
```typescript
useEffect(() => {
  const loadMenuFromAPI = async () => {
    const response = await fetch('/api/menu/esquina-pompeya');
    const data = await response.json();
    setMenuData(data.menu);
  };
  loadMenuFromAPI();
}, []);
```

---

#### **3. `/editor-clean` - Editor Optimizado ⭐ (NUEVO)**

**Archivo:** `app/editor-clean/page.tsx`  
**Estado:** ✅ Funcional (conectado a API)  
**Propósito:** Editor de menú simplificado sin botones

**Features implementadas:**
- ✅ Carga datos desde `/api/menu/esquina-pompeya/items`
- ✅ **Doble click** para editar (sin botones visibles)
- ✅ Precio a la derecha del nombre
- ✅ Altura reducida (48px por card)
- ✅ Guardar/Eliminar con confirmación
- ✅ Stats compactos (productos/categorías)
- ✅ Sin paso X de X ni footer

**UI/UX:**
```
┌────────────────────────────────────┐
│ ← Volver  Editor de Menú  👁️ Vista│
│                                    │
│ [63 Productos] [8 Categorías]      │
│                                    │
│ [PLATOS DEL DÍA (10)] [PROMOS (5)] │
├────────────────────────────────────┤
│ Doble click para editar            │
│                                    │
│ [🍽️] Milanesas c/Puré      $9000  │
│ [🍽️] Vacío a la parrilla  $15000  │
│ [🍽️] Croquetas de carne    $8000  │
└────────────────────────────────────┘
```

**Interacciones:**
- **Doble click** en card → Modal edición
- **Guardar** → PUT `/api/menu/.../items`
- **Eliminar** → DELETE `/api/menu/.../items`

---

#### **4. `/editor` - Editor Original (con pasos)**

**Archivo:** `app/editor/page.tsx`  
**Estado:** ✅ Funcional (localStorage)  
**Propósito:** Editor completo con wizard paso a paso

**Features:**
- Paso 3 de 5 del wizard
- Botones visibles (Editar, Imagen, Eliminar)
- Stats destacados
- Footer con "Continuar"

**Uso:** Se mantiene para backward compatibility

---

#### **5. `/editor-v2` - Editor Mobile (menú ⋮)**

**Archivo:** `app/editor-v2/page.tsx`  
**Estado:** ✅ Funcional (conectado a API)  
**Propósito:** Editor optimizado mobile con menú de 3 puntos

**Features:**
- Menú flotante ⋮ con opciones (Editar, Duplicar, Imagen, Eliminar)
- Modal fullscreen mobile-friendly
- Auto-save en cada acción

---

#### **6. `/scanner` - OCR Scanner**

**Archivo:** `app/scanner/page.tsx`  
**Estado:** ✅ Funcional  
**Propósito:** Escanear carta física con cámara (Tesseract.js)

**Features:**
- Captura con cámara o upload
- OCR con ~70% precisión
- Export a JSON para editor

---

#### **7. `/setup-comercio` - Onboarding**

**Archivo:** `app/setup-comercio/page.tsx`  
**Estado:** ✅ Funcional  
**Propósito:** Configuración inicial del restaurante

**Features:**
- Nombre comercio
- Dirección
- Teléfono
- Logo upload (opcional)

---

### 🗑️ **Páginas Deprecadas**

```
_deprecated/
├── demo/                    # Demos antiguos (4 páginas)
├── demo-flow/               # Flujo demo viejo (6 páginas)
└── generador/               # Generador QR viejo
```

**Razón:** Reemplazadas por versiones mejoradas

---

## 6. COMPONENTES CLAVE

### 🧩 **Componentes Reutilizables**

#### **DevBanner.tsx**

```typescript
// app/components/DevBanner.tsx
export default function DevBanner() {
  return (
    <div className="bg-yellow-500 text-black text-center py-2 text-sm font-bold">
      🚧 MODO DESARROLLO - Demo con datos de prueba
    </div>
  );
}
```

**Uso:** Todas las páginas en desarrollo

---

#### **DemoHeader.tsx**

```typescript
// app/components/DemoHeader.tsx
interface Props {
  title: string;
  subtitle?: string;
}

export default function DemoHeader({ title, subtitle }: Props) {
  return (
    <div className="bg-gray-800 p-6 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
}
```

---

### 🎨 **Estilos y Temas**

**Tailwind Config:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-750': '#2d3748',
      },
    },
  },
  plugins: [],
}
```

**Paleta de Colores:**
```css
Oscuro:    #111827 (bg-gray-900)
Medio:     #1f2937 (bg-gray-800)
Claro:     #374151 (bg-gray-700)
Acento:    #3b82f6 (blue-600)
Éxito:     #10b981 (green-600)
Peligro:   #ef4444 (red-600)
Advertencia: #f59e0b (yellow-600)
```

---

## 7. FLUJOS DE USUARIO

### 🔄 **Flujo Principal: De Carta Física a QR**

```
1. LANDING
   Usuario entra a la página
   ↓
2. SCANNER (/scanner)
   Saca foto de la carta física
   OCR procesa y extrae texto
   ↓
3. EDITOR (/editor o /editor-clean)
   Revisa productos detectados
   Corrige precios/nombres
   Agrega categorías
   ↓
4. PERSONALIZACIÓN (/personalizacion)
   Elige colores
   Sube logo
   ↓
5. GENERACIÓN QR (/generar-qr)
   Sistema genera QR único
   ↓
6. CARTA DIGITAL (/carta-menu)
   Cliente escanea QR
   Ve menú actualizado
```

---

### 🍽️ **Flujo de Pedido: Salón**

```
1. Cliente escanea QR en mesa 12
   URL: /menu/esquina-pompeya?mode=salon&table=12
   ↓
2. Ve carta digital con precios
   ↓
3. Agrega productos al carrito
   (localStorage temporal)
   ↓
4. Presiona "Confirmar Pedido"
   ↓
5. Sistema crea Order en DB
   POST /api/orders/create
   {
     mode: "SALON",
     tableNumber: "12",
     items: [...],
     total: 25000
   }
   ↓
6. Pedido aparece en panel cocina
   (comandas en tiempo real)
   ↓
7. Cocina marca "PREPARING" → "READY"
   ↓
8. Mozo sirve y marca "DELIVERED"
```

---

### 🚚 **Flujo de Pedido: Delivery**

```
1. Cliente clickea link en Instagram
   URL: /menu/esquina-pompeya?mode=delivery
   ↓
2. Ve carta + fee de envío ($1500)
   ↓
3. Agrega productos al carrito
   ↓
4. Presiona "Completar Datos"
   Modal pide: Nombre, Teléfono, Dirección
   ↓
5. Confirma pedido
   POST /api/orders/create
   {
     mode: "DELIVERY",
     customerName: "Juan Pérez",
     customerPhone: "11-2345-6789",
     customerAddress: "Av. X 123",
     items: [...],
     deliveryFee: 1500,
     total: 26500
   }
   ↓
6. Sistema envía WhatsApp automático
   "Pedido #043 confirmado. ETA: 45min"
   ↓
7. Aparece en panel delivery
   (con dirección y teléfono)
   ↓
8. Cocina → Delivery → "DELIVERED"
```

---

### ✏️ **Flujo de Edición: Editor Clean**

```
1. Dueño entra a /editor-clean
   GET /api/menu/esquina-pompeya/items
   ↓
2. Ve 73 productos en 9 categorías
   ↓
3. Hace DOBLE CLICK en un producto
   Modal de edición aparece
   ↓
4. Edita nombre/precio/descripción
   ↓
5. Presiona "Guardar"
   PUT /api/menu/esquina-pompeya/items
   {
     itemId: "xxx",
     name: "Nuevo nombre",
     price: 10000
   }
   ↓
6. Cambio guardado en DB
   ↓
7. Cliente ve cambio inmediato en /carta-menu
```

---

## 8. SISTEMA DE COMANDAS

### 📋 **Arquitectura de Comandas**

**Documento técnico completo:** `Docs/ARQUITECTURA-COMANDAS.md`

**Resumen ejecutivo:**

#### **Diferenciación por URL:**
```
SALÓN:    ?mode=salon&table=12
DELIVERY: ?mode=delivery
```

#### **Identificadores:**

| Modo | Identificador | Datos Requeridos |
|------|--------------|------------------|
| SALÓN | Número de mesa | Ninguno (mesa en URL) |
| DELIVERY | Datos de cliente | Nombre, Teléfono, Dirección |

#### **Flujo de Datos:**

```typescript
// 1. Cliente confirma pedido
const orderData = {
  mode: 'SALON' | 'DELIVERY',
  tableNumber: mode === 'SALON' ? '12' : null,
  customerName: mode === 'DELIVERY' ? 'Juan' : null,
  // ...
  items: [...],
  total: 25000
};

// 2. POST a API
const response = await fetch('/api/orders/create', {
  method: 'POST',
  body: JSON.stringify(orderData)
});

// 3. API crea Order en DB
const order = await prisma.order.create({
  data: {
    orderNumber: todayOrderCount + 1,
    mode: orderData.mode,
    status: 'CONFIRMED',
    // ...
    items: {
      create: orderData.items.map(item => ({
        menuItemId: item.id,
        itemName: item.name,  // Snapshot
        itemPrice: item.price, // Snapshot
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }))
    }
  }
});

// 4. Notificación (opcional)
if (sendWhatsApp) {
  await sendWhatsAppNotification(order);
}
```

#### **Panel de Comandas (Futuro)**

```
/admin/comandas

┌─────────────────────────────────────┐
│  🍽️ SALÓN (8 activas)               │
├─────────────────────────────────────┤
│ Mesa 12 - Pedido #042               │
│ ⏱️ 12:45 (8 min)                     │
│ • 2x Milanesa fritas                │
│ • 1x Coca-Cola                      │
│ Total: $25.000                      │
│ [🔥 En cocina] [✅ Listo]            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🚚 DELIVERY (3 activas)            │
├─────────────────────────────────────┤
│ Juan Pérez - Pedido #043            │
│ ⏱️ 12:50 (3 min)                     │
│ 📍 Av. Directorio 123               │
│ 📞 11-2345-6789                     │
│ • 2x Milanesa fritas                │
│ Total: $26.500                      │
│ [🔥 En cocina] [🚗 En camino]        │
└─────────────────────────────────────┘
```

---

## 9. ESTADO ACTUAL DEL PROYECTO

### ✅ **Completado (MVP Funcional)**

#### **Base de Datos:**
- [x] Schema Prisma completo
- [x] Migraciones aplicadas
- [x] Modelos Order/OrderItem para comandas
- [x] Seed con 73 productos reales (Esquina Pompeya)

#### **APIs:**
- [x] GET `/api/menu/[restaurantId]` - Menú completo
- [x] GET `/api/menu/[restaurantId]/items` - Items para editor
- [x] POST `/api/menu/[restaurantId]/items` - Crear producto
- [x] PUT `/api/menu/[restaurantId]/items` - Actualizar producto
- [x] DELETE `/api/menu/[restaurantId]/items` - Eliminar producto

#### **Frontend:**
- [x] Landing page funcional
- [x] Carta digital (`/carta-menu`) conectada a API
- [x] Editor clean (`/editor-clean`) con doble-click
- [x] Editor mobile (`/editor-v2`) con menú ⋮
- [x] Scanner OCR (`/scanner`) funcional
- [x] Setup inicial (`/setup-comercio`)

#### **Features:**
- [x] Carga/guardado en base de datos real
- [x] CRUD completo de productos
- [x] Logo responsive y optimizado
- [x] Links clickeables (Maps, WhatsApp, MP)
- [x] Modo oscuro/claro en carta
- [x] Datos demo reales cargados

---

### ⏳ **En Progreso**

#### **Comandas (80% diseñado, 20% implementado):**
- [ ] API POST `/api/orders/create`
- [ ] Carrito en `/carta-menu`
- [ ] Modal datos cliente (delivery)
- [ ] Panel admin `/admin/comandas`
- [ ] Estados de pedido (PENDING → DELIVERED)

#### **Categorías:**
- [ ] API POST `/api/menu/[restaurantId]/categories` - Crear categoría
- [ ] API PUT `/api/menu/[restaurantId]/categories` - Editar categoría
- [ ] API DELETE `/api/menu/[restaurantId]/categories` - Eliminar categoría
- [ ] UI para agregar/editar categorías en editor

---

### ❌ **No Implementado (Roadmap)**

#### **Autenticación:**
- [ ] Sistema de login/registro
- [ ] Protección de rutas admin
- [ ] Multi-tenant (varios restaurantes)
- [ ] Roles (Owner, Admin, Staff)

#### **WhatsApp Business:**
- [ ] Integración API oficial
- [ ] Envío automático de confirmaciones
- [ ] Estados de pedido vía WA
- [ ] Respuestas automáticas

#### **Features Avanzados:**
- [ ] Upload de imágenes de productos
- [ ] Generación QR personalizado
- [ ] Analytics y reportes
- [ ] POS integration
- [ ] Kitchen Display System (KDS)
- [ ] Pagos online (Mercado Pago)

---

### 🐛 **Bugs Conocidos**

1. **Editor-v2:** Categorías nuevas no se guardan (falta API POST categories)
2. **Carta-menu:** Imágenes demo hardcodeadas (no vienen de DB)
3. **Scanner:** Precisión OCR ~70% (necesita mejoras)
4. **Logo:** No se carga desde DB (hardcoded en `/demo-images/Logo.jpg`)

---

### 📊 **Métricas del Proyecto**

```yaml
Archivos totales: 34
  - Activos: 21 (62%)
  - Deprecados: 13 (38%)

Código:
  - TypeScript/TSX: ~5,000 líneas
  - APIs: 5 endpoints
  - Páginas: 10 activas

Base de Datos:
  - Tablas: 7 (User, Menu, Category, MenuItem, Order, OrderItem)
  - Seed: 73 productos reales
  - Migraciones: 1 aplicada

Dependencias:
  - Producción: 12 paquetes
  - Desarrollo: 8 paquetes
  - Total: 235 paquetes (con sub-deps)
```

---

## 10. ROADMAP Y PRÓXIMOS PASOS

### ✅ **COMPLETADO (Octubre 2025)**

#### **Base de Datos:**
- [x] Schema Prisma completo con PostgreSQL
- [x] Migración a Supabase exitosa
- [x] Seed con 20 categorías y 190 platos reales (Esquina Pompeya)
- [x] Códigos XX/XXXX implementados para organización

#### **APIs:**
- [x] GET `/api/menu/esquina-pompeya` - Menú completo con códigos
- [x] POST `/api/seed-demo` - Seed automático en Supabase
- [x] Códigos de categorías (01-20) y platos (XXYY)

#### **Frontend:**
- [x] Carta digital (`/carta-menu`) con estética QRing
- [x] Dark/Light mode toggle funcional
- [x] Carrito flotante transparente (pill-shaped)
- [x] Filtros de categorías (pill-shaped)
- [x] Búsqueda activa con clear button
- [x] Editor2 (`/editor2`) con doble-click y long-press
- [x] Modales Add/Edit con layout horizontal (foto + código + precio)
- [x] Códigos automáticos al seleccionar categoría
- [x] Input de imagen con capture="camera"

#### **Deploy:**
- [x] Vercel deployment activo
- [x] Supabase PostgreSQL conectado
- [x] GitHub CI/CD configurado

---

### 🚀 **FASE 1: FINALIZAR DEMO (AHORA - 1-2 días)**

**Objetivo:** Demo lista para presentar con funcionalidad completa de Add/Edit

```
✅ COMPLETADO:
  - Modal visual mejorado (código automático, foto con texto)
  - Alineación campos con altura de foto
  - Push a Vercel exitoso

⏳ PENDIENTE INMEDIATO:
  Día 1 (2-4 horas):
    - [ ] Implementar lógica Add Plato (guardar en DB)
    - [ ] Implementar lógica Edit Plato (actualizar en DB)
    - [ ] Loading states en modales
    - [ ] Probar en móvil (touch events)
  
  Día 2 (2-3 horas):
    - [ ] Implementar Add/Edit Categoría
    - [ ] Upload de imagen (Cloudinary o Supabase Storage)
    - [ ] Validaciones de formularios
    - [ ] Testing completo en móvil y desktop
```

**Entregables:**
- [ ] Add/Edit de platos funcional
- [ ] Add/Edit de categorías funcional
- [ ] Upload de imágenes funcional
- [ ] Demo testeada y estable

---

### ⚡ **FASE 2: QUICK WINS (2-3 días después de demo)**

**Objetivo:** Mejoras rápidas de alto impacto

#### **Prioridad 1: Carrito Funcional (4h)**
```typescript
ESTRUCTURA DEL CARRITO (idea original):
  [Icono] → [Productos] → [Total] → [Método] → [Forma Pago] → [Aceptar]

Implementación:
- [ ] Guardar carrito en localStorage
- [ ] Mostrar: Icono carrito + Cantidad productos + Total
- [ ] Al expandir: Lista de productos con códigos XXYY
- [ ] Selector de método: 📍 Local / 🚶 Retiro / 🚚 Delivery
- [ ] Selector de pago: 💵 Efectivo / 💳 Tarjeta / 📱 Transferencia
- [ ] Botón "Aceptar" → Generar mensaje WhatsApp
- [ ] Botón alternativo "Enviar por WhatsApp"
```

#### **Prioridad 2: Mejoras UX (3h)**
```typescript
- [ ] Agregar horarios en header (input manual)
- [ ] Toast notifications (react-hot-toast)
- [ ] Confirmaciones al eliminar
- [ ] Validaciones mejoradas
- [ ] Loading states globales
```

#### **Prioridad 3: Gestión de Imágenes (2h)**
```typescript
- [ ] Setup Cloudinary (gratis 1000 img/mes)
- [ ] Upload desde modal Add/Edit
- [ ] Preview antes de guardar
- [ ] Fallback a placeholder si no hay imagen
```

**Entregables:**
- [ ] Cliente puede enviar pedido por WhatsApp
- [ ] UX pulida con feedback visual
- [ ] Imágenes gestionadas en cloud

---

### 🏗️ **FASE 3: ESTRUCTURA FINAL (1-2 semanas)**

**Objetivo:** Arquitectura multi-tenant completa

#### **Página Raíz con IDU (2 días)**
```typescript
// app/[idu]/page.tsx
- [ ] Landing con input de IDU
- [ ] Validación de IDU en DB
- [ ] Redirección a wizard si es primera vez
- [ ] Redirección a dashboard si ya completó
```

#### **Wizard 4 Pasos (3 días)**
```
Paso 1: Datos del Comercio
  - [ ] Formulario con Google Places API
  - [ ] Auto-completar dirección y horarios
  
Paso 2: Scanner OCR
  - [ ] Subir múltiples imágenes
  - [ ] Procesar con IA (Tesseract gratis)
  - [ ] Mostrar datos extraídos
  
Paso 3: Editor de Menú
  - [ ] Revisar y corregir datos
  - [ ] Agregar/eliminar categorías y platos
  
Paso 4: Generar QR
  - [ ] Generar QR único
  - [ ] Opciones: Descargar, Imprimir, Compartir
  - [ ] Vista previa de carta digital
```

#### **Dashboard Central (2 días)**
```typescript
// app/[idu]/dashboard/page.tsx
Hamburger Menu con 5 opciones:
  - [ ] Editar Datos Comercio
  - [ ] Re-escanear Carta
  - [ ] Editor de Menú (Editor2)
  - [ ] Gestión QR
  - [ ] Vista Previa Carta (carta-menu)
```

#### **Mercado Pago Integration (1 día)**
```typescript
- [ ] Checkout para generar IDU
- [ ] Webhook para confirmar pago
- [ ] Generar IDU único (ej: esquina-pompeya-a3f9)
- [ ] Crear usuario en DB
- [ ] Enviar email con link a wizard
```

**Entregables:**
- [ ] Cualquier restaurante puede registrarse
- [ ] Wizard guiado completo
- [ ] Dashboard funcional
- [ ] Generación de IDU automática

---

### 🎯 **FASE 4: COMANDAS Y PEDIDOS (2-3 semanas)**

**Objetivo:** Sistema de pedidos completo

#### **API de Pedidos (1 semana)**
```typescript
- [ ] POST /api/orders/create
- [ ] GET /api/orders/[idu]
- [ ] PUT /api/orders/[id]/status
- [ ] DELETE /api/orders/[id]
```

#### **Panel de Comandas (1 semana)**
```typescript
// app/[idu]/admin/comandas/page.tsx
- [ ] Vista SALÓN (por mesa)
- [ ] Vista DELIVERY (por cliente)
- [ ] Cambio de estados (Pending → Preparing → Ready → Delivered)
- [ ] Notificaciones en tiempo real (Polling o WebSockets)
```

#### **WhatsApp Integration (3 días)**
```typescript
- [ ] WhatsApp Business API setup
- [ ] Confirmaciones automáticas
- [ ] Estados de pedido
- [ ] Plantillas de mensajes
```

**Entregables:**
- [ ] Sistema de comandas funcional
- [ ] Cliente recibe confirmación por WhatsApp
- [ ] Admin gestiona pedidos en panel

---

### 📈 **FASE 5: FEATURES AVANZADOS (2-3 meses)**

#### **Analytics y Reportes (2 semanas)**
```typescript
- [ ] Dashboard de ventas
- [ ] Productos más vendidos
- [ ] Análisis por canal (Salón/Delivery)
- [ ] Reportes exportables (PDF/Excel)
```

#### **Multi-sucursal (3 semanas)**
```typescript
- [ ] Gestión de múltiples locales
- [ ] Menús por sucursal
- [ ] Analytics por sucursal
- [ ] Gestión de usuarios por sucursal
```

#### **Autenticación y Roles (2 semanas)**
```typescript
- [ ] NextAuth setup
- [ ] Login/Registro
- [ ] Roles: Owner, Admin, Staff, Cocina
- [ ] Protección de rutas
- [ ] Permisos por rol
```

#### **Pagos Online (1 semana)**
```typescript
- [ ] Mercado Pago checkout en delivery
- [ ] Confirmación de pago
- [ ] Reembolsos
- [ ] Historial de transacciones
```

**Entregables:**
- [ ] Plataforma escalable multi-tenant
- [ ] Analytics completo
- [ ] Sistema de suscripciones
- [ ] Pagos online integrados

---

### 🎯 **Fase 2: WhatsApp & Delivery (2-3 semanas)**

**Objetivo:** Notificaciones y pedidos delivery

```
Semana 3:
  - [ ] Integrar WhatsApp Business API
  - [ ] Envío de confirmaciones automáticas
  - [ ] Modal datos cliente para delivery

Semana 4:
  - [ ] Calcular delivery fee por zona
  - [ ] Validar mínimo de compra
  - [ ] Panel delivery separado

Semana 5:
  - [ ] Estados de delivery tracking
  - [ ] Notificaciones de estado
  - [ ] Analytics básico
```

**Entregables:**
- [ ] Cliente recibe WhatsApp al confirmar
- [ ] Sistema delivery completo
- [ ] Métricas de pedidos por canal

---

### 🎯 **Fase 3: Multi-tenant & Autenticación (3-4 semanas)**

**Objetivo:** Plataforma para múltiples restaurantes

```
Semana 6-7:
  - [ ] Sistema de registro/login (NextAuth)
  - [ ] Onboarding completo
  - [ ] Subdominio por restaurante
  - [ ] Upload imágenes (Cloudinary)

Semana 8-9:
  - [ ] Panel admin completo
  - [ ] Gestión de usuarios/roles
  - [ ] Subscripciones (Free/Pro/Premium)
  - [ ] Pasarela de pago (Stripe/MP)
```

**Entregables:**
- [ ] Cualquier restaurante puede registrarse
- [ ] Sistema de suscripciones funcional
- [ ] Dashboard de analytics

---

### 🎯 **Fase 4: Features Avanzados (2-3 meses)**

```
Mes 3:
  - [ ] Kitchen Display System (tablet cocina)
  - [ ] Impresión automática de comandas
  - [ ] Reservas de mesas
  - [ ] Programa de fidelización

Mes 4:
  - [ ] POS integration (Mercado Pago Point)
  - [ ] Pagos online en delivery
  - [ ] Facturación electrónica (AFIP)
  - [ ] App mobile nativa (React Native)

Mes 5:
  - [ ] Analytics avanzado
  - [ ] Recomendaciones IA
  - [ ] Inventario automático
  - [ ] Multi-sucursal
```

---

### 📈 **Plan de Crecimiento**

**Año 1:**
```
Q1 (Meses 1-3):
  - MVP comandas lanzado
  - 10 restaurantes beta testers
  - $0 revenue (free beta)

Q2 (Meses 4-6):
  - WhatsApp + Delivery completo
  - 50 restaurantes activos
  - $500/mes revenue (10 Pro, 5 Premium)

Q3 (Meses 7-9):
  - Multi-tenant público
  - 200 restaurantes
  - $3,000/mes revenue

Q4 (Meses 10-12):
  - Features avanzados
  - 500 restaurantes
  - $10,000/mes revenue
```

**Proyección 3 años:**
- Año 1: 500 restaurantes → $120K ARR
- Año 2: 2,000 restaurantes → $480K ARR
- Año 3: 5,000 restaurantes → $1.2M ARR

---

### 🛠️ **Mejoras Técnicas Prioritarias**

**Performance:**
- [ ] Server-side caching (Redis)
- [ ] Image optimization (next/image)
- [ ] Lazy loading de categorías
- [ ] WebSockets para comandas en tiempo real

**Seguridad:**
- [ ] Rate limiting en APIs
- [ ] Input validation (Zod)
- [ ] SQL injection protection (Prisma lo hace)
- [ ] XSS protection
- [ ] CORS configuration

**DevOps:**
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Testing automatizado (Jest + Playwright)
- [ ] Monitoring (Sentry)
- [ ] Logging estructurado (Pino)
- [ ] Backups automáticos DB

**Escalabilidad:**
- [ ] Migrar a PostgreSQL
- [ ] Separar backend en microservicios
- [ ] CDN para assets estáticos
- [ ] Load balancing
- [ ] Database sharding

---

## 📚 APÉNDICES

### A. Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Levantar servidor (localhost:3000)
npx prisma studio              # Abrir DB visual (localhost:5555)
npx prisma migrate dev         # Crear migración
npx tsx scripts/seed-esquina-pompeya.ts  # Cargar datos demo

# Base de datos
npx prisma generate            # Regenerar Prisma Client
npx prisma migrate reset       # Resetear DB (¡cuidado!)
npx prisma db push             # Push schema sin migración

# Deploy
npm run build                  # Build producción
npm run start                  # Correr build
vercel                         # Deploy a Vercel

# Testing
npm run lint                   # ESLint
npm run type-check             # TypeScript check
```

---

### B. Variables de Entorno

```env
# .env.local

# Base de Datos
DATABASE_URL="file:./dev.db"  # SQLite local
# DATABASE_URL="postgresql://user:pass@host:5432/menuqr"  # Producción

# Next Auth (futuro)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# WhatsApp Business (futuro)
WHATSAPP_API_KEY="your-api-key"
WHATSAPP_PHONE_ID="your-phone-id"

# Cloudinary (futuro)
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"

# Stripe (futuro)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

---

### C. Estructura de Datos de Ejemplo

#### **Menu completo (JSON):**

```json
{
  "id": "clxxx",
  "restaurantId": "esquina-pompeya",
  "restaurantName": "Esquina Pompeya",
  "deliveryEnabled": true,
  "deliveryFee": 1500,
  "categories": [
    {
      "id": "cat_1",
      "name": "PLATOS DEL DÍA",
      "position": 0,
      "items": [
        {
          "id": "item_1",
          "name": "Milanesas al horno c/ Puré",
          "price": 9000,
          "description": null,
          "isAvailable": true,
          "isPopular": false,
          "position": 0
        }
      ]
    }
  ]
}
```

#### **Order ejemplo (SALON):**

```json
{
  "id": "order_1",
  "orderNumber": 42,
  "mode": "SALON",
  "status": "CONFIRMED",
  "tableNumber": "12",
  "customerName": null,
  "items": [
    {
      "id": "orderitem_1",
      "itemName": "Milanesas al horno c/ Puré",
      "itemPrice": 9000,
      "quantity": 2,
      "subtotal": 18000
    }
  ],
  "subtotal": 18000,
  "deliveryFee": 0,
  "total": 18000,
  "createdAt": "2025-10-03T12:45:00Z",
  "confirmedAt": "2025-10-03T12:45:30Z"
}
```

#### **Order ejemplo (DELIVERY):**

```json
{
  "id": "order_2",
  "orderNumber": 43,
  "mode": "DELIVERY",
  "status": "PREPARING",
  "tableNumber": null,
  "customerName": "Juan Pérez",
  "customerPhone": "11-2345-6789",
  "customerAddress": "Av. Directorio 123",
  "deliveryNotes": "Timbre 3B",
  "items": [
    {
      "itemName": "Vacío a la parrilla",
      "itemPrice": 15000,
      "quantity": 1,
      "subtotal": 15000
    }
  ],
  "subtotal": 15000,
  "deliveryFee": 1500,
  "total": 16500,
  "createdAt": "2025-10-03T13:20:00Z"
}
```

---

### D. Glosario Técnico

| Término | Definición |
|---------|-----------|
| **App Router** | Sistema de routing de Next.js 14 basado en carpetas |
| **CRUD** | Create, Read, Update, Delete (operaciones básicas DB) |
| **ORM** | Object-Relational Mapping (Prisma mapea objetos a SQL) |
| **OCR** | Optical Character Recognition (extrae texto de imágenes) |
| **Seed** | Datos iniciales para poblar la DB |
| **Multi-tenant** | Múltiples clientes en la misma instancia de software |
| **Serverless** | Funciones que se ejecutan bajo demanda sin servidor dedicado |
| **Snapshot** | Copia de datos en un momento específico (OrderItem guarda precio) |
| **Middleware** | Código que se ejecuta antes de procesar requests |
| **Migration** | Cambio versionado en el schema de la DB |

---

### E. Enlaces y Referencias

**Repositorio:**
- GitHub: `github.com/bdileo35/MenuQR`
- Branch principal: `master`

**Deploy:**
- Producción: `menu-qr-beta.vercel.app`
- Preview: Auto-deploy por branch

**Documentación:**
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Tailwind: https://tailwindcss.com/docs

**Tools:**
- Prisma Studio: http://localhost:5555
- Dev Server: http://localhost:3000

---

## 🎓 GUÍA PARA PROGRAMADORES

### Para Desarrolladores Nuevos:

1. **Clonar repo:**
   ```bash
   git clone https://github.com/bdileo35/MenuQR.git
   cd MenuQR
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Setup DB:**
   ```bash
   npx prisma migrate dev
   npx tsx scripts/seed-esquina-pompeya.ts
   ```

4. **Levantar dev:**
   ```bash
   npm run dev
   ```

5. **Explorar:**
   - Carta: http://localhost:3000/carta-menu
   - Editor: http://localhost:3000/editor-clean
   - DB: npx prisma studio

---

### Para IAs (Claude, GPT, etc.):

**Este documento contiene TODO el contexto necesario para:**
- ✅ Entender la arquitectura completa
- ✅ Modificar cualquier parte del código
- ✅ Agregar nuevas features
- ✅ Debuggear problemas
- ✅ Explicar el proyecto a otros
- ✅ Tomar decisiones de diseño consistentes

**NO necesitas:**
- ❌ Leer otros archivos de documentación (están desactualizados)
- ❌ Buscar en internet (toda la info está aquí)
- ❌ Adivinar el contexto (está explícito)

**Cuando trabajes:**
1. Referencia este documento como fuente de verdad
2. Mantén consistencia con decisiones aquí documentadas
3. Actualiza este documento si haces cambios mayores

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

Para validar que todo esté funcionando:

### Base de Datos:
- [ ] `npx prisma studio` abre correctamente
- [ ] Tablas: users, menus, categories, menu_items, orders, order_items existen
- [ ] Seed cargó 73 productos en 9 categorías
- [ ] Usuario esquina@pompeya.com existe

### APIs:
- [ ] GET /api/menu/esquina-pompeya devuelve menú completo
- [ ] GET /api/menu/esquina-pompeya/items devuelve items
- [ ] POST /api/menu/esquina-pompeya/items crea producto
- [ ] PUT /api/menu/esquina-pompeya/items actualiza producto
- [ ] DELETE /api/menu/esquina-pompeya/items elimina producto

### Frontend:
- [ ] /carta-menu carga 73 productos desde DB
- [ ] /editor-clean muestra categorías y productos
- [ ] Doble click en producto abre modal edición
- [ ] Guardar cambio actualiza DB
- [ ] Cambio se refleja en /carta-menu

### Integración:
- [ ] Cambio en editor-clean → guardado en DB → visible en carta-menu
- [ ] Logo visible y responsive
- [ ] Links clickeables funcionan (Maps, WA, MP)
- [ ] Modo oscuro/claro funciona

---

## 📝 NOTAS FINALES

### Decisiones de Diseño Clave:

1. **¿Por qué Next.js App Router?**
   - SSR para SEO de cartas públicas
   - API Routes integradas (no backend separado)
   - Deployment simple en Vercel

2. **¿Por qué Prisma?**
   - Type-safety con TypeScript
   - Migraciones automáticas
   - Multi-database support (SQLite → PostgreSQL)

3. **¿Por qué SQLite en dev?**
   - Zero config
   - File-based (fácil reset)
   - Suficiente para MVP
   - PostgreSQL en producción

4. **¿Por qué 3 editores?**
   - `/editor` - Original con wizard (backward compat)
   - `/editor-v2` - Mobile optimizado (menú ⋮)
   - `/editor-clean` - Desktop optimizado (doble-click) ⭐

5. **¿Por qué snapshot en OrderItem?**
   - Si cambias precio de "Milanesa" de $9000 a $10000
   - Pedidos viejos deben mostrar $9000 (precio al momento)
   - Evita inconsistencias en reportes históricos

---

### Contacto y Soporte:

**Repositorio:** github.com/bdileo35/MenuQR  
**Creador:** bdileo35  
**Fecha última actualización:** Octubre 2025  

---

## 🎉 FIN DEL DOCUMENTO

**Este documento es la única fuente de verdad del proyecto MenuQR.**

Toda la información necesaria para entender, desarrollar y extender el proyecto está aquí documentada.

---

**Versión:** 2.0.0  
**Última modificación:** 2025-10-13  
**Próxima revisión:** Después de implementar Fase 1 (Demo Funcional Add/Edit)

---

## 🎓 PARA CUALQUIER IA QUE LEA ESTO

Este documento contiene **TODA** la información del proyecto MenuQR:
- ✅ Stack tecnológico completo (Fullstack Next.js + Supabase)
- ✅ Arquitectura y decisiones de diseño
- ✅ Estado actual (Demo funcional con 190 platos reales)
- ✅ Roadmap detallado por fases
- ✅ Código de ejemplo y APIs
- ✅ Principio: TODO GRATUITO en etapa inicial

**NO necesitas:**
- ❌ Buscar en otros documentos (están desactualizados)
- ❌ Adivinar el contexto (está todo aquí)
- ❌ Proponer soluciones pagas (solo gratuitas por ahora)

**Cuando trabajes en MenuQR:**
1. Este documento es la fuente de verdad
2. Mantén consistencia con lo documentado
3. Actualiza este documento si haces cambios importantes
4. Respeta el principio de "Quick Wins" (cambios < 2h)
5. Usa la metodología: Commit → Push → Test → Siguiente

---

## 📞 CONTACTO

**Repositorio:** https://github.com/bdileo35/menuqr2  
**Deploy Vercel:** https://menuqr-nine.vercel.app  
**Supabase Project:** [Configurado y activo]  
**Creador:** bdileo35  

---

**✨ MenuQR - Digitaliza tu carta en minutos, sin costo inicial ✨**
