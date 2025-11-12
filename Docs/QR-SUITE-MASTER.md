# 🚀 QR-SUITE: Apps Independientes con Core Compartido

**Fecha de creación:** 11 de Noviembre, 2025  
**Última actualización:** 11 de Noviembre, 2025  
**Líneas de Producto:**  
- 📱 **Línea QR** (QR-Shop) - MenuQR, QRing, QRCard  
- 🏠 **Línea Domótica** (Domo-Shop) - Futuro  
**Versión:** 1.0.0  
**Estado:** En desarrollo activo

---

## ⚠️ IMPORTANTE: ARQUITECTURA INDEPENDIENTE

**Este documento describe el ecosistema QR-Suite con dos líneas de producto:**

### **Línea QR (QR-Shop) - ACTIVA:**
Productos digitales basados en códigos QR (MenuQR, QRing, QRCard)

### **Línea Domótica (Domo-Shop) - FUTURO:**
Productos físicos domóticos (Cámaras, Luces, Alarmas, etc.)

### Principio fundamental:
```
Tienda (QR-Shop o Domo-Shop) → MP Pago → IDU Generado
                    ↓
            A PARTIR DE AQUÍ: APPS 100% SEPARADAS
```

**Shared Core (mínimo - común a ambas líneas):**  
- Tienda Service, Mercado Pago, IDU Generator, QR Generator

**Apps separadas:**  
- User, DB, Deploy, Git → Independientes por app

---

## 📋 ÍNDICE

1. [Visión General](#visión-general)
2. [Arquitectura: Separación Correcta](#arquitectura-separación-correcta)
3. [Flujo Post-Compra MenuQR](#flujo-post-compra-menuqr)
4. [Módulos Compartidos](#módulos-compartidos)
5. [Integración con MaxiRest](#integración-con-maxirest)
6. [Integración WhatsApp Business](#integración-whatsapp-business)
7. [Roadmap](#roadmap)

---

## 1. VISIÓN GENERAL

### 🎯 **QR-Suite: Ecosistema de Productos Digitales**

```
┌──────────────────────────────────────────────────────────┐
│           LÍNEA DE PRODUCTOS QR (QR-Shop)                │
└──────────────────────────────────────────────────────────┘
                    ↓
            ┌───────┴───────┐
            │   QR-SHOP     │ ← Tienda común productos QR
            │   + MP Pago   │
            └───────┬───────┘
                    │
              IDU Generado
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    ┌─────────┐ ┌──────┐  ┌─────────┐
    │ MenuQR  │ │QRing │  │ QRCard  │
    │   Pro   │ │Básico│  │         │
    └─────────┘ └──────┘  └─────────┘
        │           │           │
    Menú QR     QR Links   QR Tarjeta
    Pedidos     Analytics  Personal
    Comandas    Landing    Contacto
        │           │           │
        └───────────┼───────────┘
                    ↓
        Apps Independientes
        User/DB/Deploy separados

┌──────────────────────────────────────────────────────────┐
│      LÍNEA DOMÓTICA (Domo-Shop) - FUTURO                 │
└──────────────────────────────────────────────────────────┘
                    ↓
            ┌───────┴───────┐
            │  DOMO-SHOP    │ ← Tienda productos domóticos
            │   + MP Pago   │
            └───────┬───────┘
                    │
              IDU Generado
                    │
                    ↓
            ┌───────────────┐
            │  Smart Home   │
            │  Controller   │
            └───────────────┘
                    │
            Cámaras, Luces
            Alarmas, Sensores
                    │
            Smart Life / Tuya
            Home Assistant

┌──────────────────────────────────────────────────────────┐
│          MÓDULO COMPARTIDO (Ambas líneas)                │
│  • Tienda Service (UI + Lógica de compra)               │
│  • Mercado Pago (Pagos)                                  │
│  • IDU Generator (Identificación)                        │
└──────────────────────────────────────────────────────────┘
```

### 💡 **Principio Arquitectónico:**

**ANTES del IDU:** Todo compartido (Tienda + MP)  
**DESPUÉS del IDU:** Apps 100% independientes

### 🛒 **Productos Actuales y Futuros:**

#### **Línea QR (QR-Shop) - Activa:**
- ✅ **MenuQR Pro** - Menú digital QR ($13,999/mes)
- 🔄 **QRing** - Generador QR + Analytics ($9,999/mes)
- 🎯 **QRCard** - Tarjeta personal digital (por definir)
- 💎 **Suite Combo** - 2+ apps con descuento

#### **Línea Domótica (Domo-Shop) - Futuro:**
- 🎯 Cámaras IP
- 🎯 Luces inteligentes (Smart bulbs)
- 🎯 Alarmas y sensores
- 🎯 Kits completos
- 🎯 App de control (Smart Life/Tuya/HA integration)

---

## 2. ARQUITECTURA: SEPARACIÓN CORRECTA

### 🎯 **PRINCIPIO FUNDAMENTAL:**

```
QR-Shop (Tienda) → Pago MP → IDU Generado
         ↓
    A PARTIR DE AQUÍ: APPS INDEPENDIENTES
```

### 📦 **Módulos REALMENTE Compartidos (Mínimos):**

**Core compartido (`lib/shared` - copiado a cada app):**
- ✅ `idu-generator.ts` - Generación de IDU único multi-tenant
- ✅ `mercadopago.ts` - Pagos MP (común a todas las apps)
- ✅ `qr-generator.ts` - Generador de QR (común a todas)
- ✅ `tienda-service.ts` - QR-Shop/Domo-Shop (UI + lógica compra)

**NO compartir (específico de cada app):**
- ❌ `User` model → Cada app tiene su propio User
- ❌ `auth-service.ts` → Autenticación independiente por app
- ❌ Lógica de negocio → MenuQR ≠ QRing ≠ QRCard

### 🗄️ **Base de Datos: SEPARADAS por App**

```typescript
// ┌──────────────────────────────────────┐
// │  SUPABASE: BASES DE DATOS SEPARADAS  │
// └──────────────────────────────────────┘

// ───────────────────────────────────────
// LÍNEA QR (QR-Shop)
// ───────────────────────────────────────

// DB MenuQR (menuqr_production):
- User_MenuQR          // Usuario de MenuQR
- Menu                 // Menú del restaurante
- Category             // Categorías
- MenuItem             // Platos
- Order                // Pedidos
- OrderItem            // Items de pedidos
- Subscription         // Plan activo (Mensual/Anual)

// DB QRing (qring_production):
- User_QRing           // Usuario de QRing
- QRCode               // QRs creados
- LandingPage          // Landing pages
- Click                // Analytics de clicks
- Campaign             // Campañas de marketing
- Subscription         // Plan activo

// DB QRCard (qrcard_production - por crear):
- User_QRCard          // Usuario de QRCard
- Card                 // Tarjeta digital
- Contact              // Información de contacto
- SocialLinks          // Redes sociales
- Analytics            // Visitas/Scans
- Subscription         // Plan activo

// ───────────────────────────────────────
// LÍNEA DOMÓTICA (Domo-Shop - FUTURO)
// ───────────────────────────────────────

// DB DomoShop (domoshop_production - futuro):
- User_Domo            // Usuario de tienda domótica
- Product              // Productos (cámaras, luces, etc.)
- Order                // Pedidos de productos
- OrderItem            // Items del pedido
- Inventory            // Inventario
- Shipping             // Envíos
- Payment              // Pagos (MP integrado)

// ⚠️ ÚNICO PUNTO COMPARTIDO (OPCIONAL):
// Tabla Payment_Global en DB central
// Para tracking cross-plataforma de pagos MP
// Útil para analytics y reportes consolidados
```

### 🏗️ **Estructura de Carpetas (Actual y Futura):**

```
Z:\VSCode\QR-Suite\
│
├── ─────────────────────────────────────
│   LÍNEA QR (QR-Shop)
├── ─────────────────────────────────────
│
├── MenuQR\                    # ← App QR #1 (Activa)
│   ├── app/
│   ├── prisma/
│   │   └── schema.prisma     # User_MenuQR, Menu, Category...
│   ├── lib/
│   │   └── shared/           # Copy del core compartido
│   ├── vercel.json           # menuqrep.vercel.app
│   └── package.json
│
├── QRing\                     # ← App QR #2 (Activa)
│   ├── app/
│   ├── prisma/
│   │   └── schema.prisma     # User_QRing, QRCode, Landing...
│   ├── lib/
│   │   └── shared/           # Copy del core compartido
│   ├── vercel.json           # qring.vercel.app
│   └── package.json
│
├── QRCard\                    # ← App QR #3 (Por crear)
│   ├── app/
│   ├── prisma/
│   │   └── schema.prisma     # User_QRCard, Card, Contact...
│   ├── lib/
│   │   └── shared/           # Copy del core compartido
│   ├── vercel.json           # qrcard.vercel.app
│   └── package.json
│
├── ─────────────────────────────────────
│   LÍNEA DOMÓTICA (Domo-Shop - FUTURO)
├── ─────────────────────────────────────
│
├── DomoShop\                  # ← Tienda domótica (Futuro)
│   ├── app/
│   ├── prisma/
│   │   └── schema.prisma     # Product, Order, Inventory...
│   ├── lib/
│   │   └── shared/           # Copy del core compartido
│   ├── vercel.json           # domoshop.vercel.app
│   └── package.json
│
└── ─────────────────────────────────────
    SHARED CORE (Source of truth)
    ─────────────────────────────────────
    
    shared-core/               # ← Solo 4 archivos mínimos
    ├── idu-generator.ts       # IDU único multi-tenant
    ├── mercadopago.ts         # Pagos MP
    ├── qr-generator.ts        # Generar QR (solo línea QR)
    └── tienda-service.ts      # QR-Shop/Domo-Shop UI
```

### 📦 **QR-Shop vs Domo-Shop:**

```typescript
// QR-Shop (Productos digitales QR):
{
  productos: [
    { id: 'menuqr-pro', precio: 13999, tipo: 'suscripción' },
    { id: 'qring-basico', precio: 9999, tipo: 'suscripción' },
    { id: 'qrcard', precio: 5999, tipo: 'único' },
  ],
  pago: 'Mercado Pago',
  entrega: 'Inmediata (IDU + acceso digital)',
  redirige: '/app-correspondiente/bienvenida/[idu]'
}

// Domo-Shop (Productos físicos domóticos):
{
  productos: [
    { id: 'camara-ip', precio: 45000, tipo: 'físico' },
    { id: 'smart-bulb', precio: 8500, tipo: 'físico' },
    { id: 'alarma-kit', precio: 85000, tipo: 'físico' },
  ],
  pago: 'Mercado Pago',
  entrega: 'Física (envío a domicilio)',
  redirige: '/tracking-envio/[orderId]'
}
```

### 🔄 **Sincronización del Shared Core:**

**Cuando modificás un archivo compartido:**
```bash
# 1. Editar en shared-core/
# 2. Copiar a MenuQR
cp shared-core/*.ts MenuQR/lib/shared/

# 3. Copiar a QRing
cp shared-core/*.ts QRing/lib/shared/

# 4. Commit en ambos repos
cd MenuQR && git commit -m "sync: shared core updated"
cd QRing && git commit -m "sync: shared core updated"
```

**Ventajas de esta arquitectura:**
✅ **Apps 100% independientes** → Deploy, scale, rollback separados  
✅ **Sin acoplamiento** → Cada app evoluciona a su ritmo  
✅ **Multi-tenant limpio** → IDU identifica al usuario en cada app  
✅ **Git/Vercel separados** → Repos y deploys independientes  
✅ **Mantenimiento simple** → Copy/paste cuando hay cambios en shared

---

## 3. FLUJO POST-COMPRA MENUQR

### 🛒 **FLUJO COMPLETO (Paso a Paso)**

```
┌──────────────────────────────────────────────────┐
│  FASE 1: COMPRA Y PAGO                            │
└──────────────────────────────────────────────────┘

1. Usuario entra a /qr-shop o /comprar
   ↓
2. Elige plan (Mensual $13,999 / Anual $139,990)
   ↓
3. Click en "Comprar" → POST /api/tienda/crear-preferencia
   ├─ Genera IDU único (ej: 5XJ1J37F)
   ├─ Crea preferencia en Mercado Pago
   └─ Redirige a checkout MP
   ↓
4. Usuario paga en Mercado Pago
   ↓
5. MP confirma pago → Webhook /api/webhooks/mercadopago
   ├─ Verifica pago aprobado
   ├─ Crea User en Supabase
   ├─ Crea Menu vacío con restaurantId = IDU
   ├─ Envía email de bienvenida
   └─ Redirige a /tienda/exito?idUnico=XXX

┌──────────────────────────────────────────────────┐
│  FASE 2: ONBOARDING (Con IDU ya asignado)        │
└──────────────────────────────────────────────────┘

6. /tienda/exito?idUnico=ABC123
   ├─ Muestra QR generado
   ├─ Botón "Configurar mi Menú"
   └─ Link: /bienvenida/ABC123
   ↓
7. /bienvenida/[idUnico] (Wizard de setup)
   ├─ Paso 1: Datos del Comercio
   │   └─ /datos-comercio/[idUnico]
   ↓
   ├─ Paso 2: Scanner/OCR (Opcional)
   │   ├─ /scanner?idUnico=ABC123
   │   ├─ Subir fotos del menú físico
   │   ├─ OCR extrae categorías + platos
   │   └─ Guardar en DB via /api/seed-from-ocr
   ↓
   ├─ Paso 3: Administrar Menú
   │   └─ /editor/[idUnico]
   │       ├─ Cargar productos manualmente
   │       ├─ Editar categorías
   │       └─ Subir imágenes
   ↓
   ├─ Paso 4: Opciones QR
   │   └─ /opciones-qr/[idUnico]
   │       ├─ Personalizar diseño QR
   │       ├─ Descargar QR de mesa
   │       └─ Generar QR por mesa
   ↓
   ├─ Paso 5: Ver Carta
   │   └─ /carta/[idUnico]
   │       └─ Preview del menú público
   ↓
   └─ Paso 6: Configuración
       └─ /configuracion/[idUnico]
           ├─ Teléfono WhatsApp de pedidos
           ├─ Horarios de atención
           ├─ Modalidades (Delivery/Takeaway/Salón)
           └─ Tema de colores

┌──────────────────────────────────────────────────┐
│  FASE 3: USO DIARIO                               │
└──────────────────────────────────────────────────┘

8. Cliente escanea QR → /carta/[idUnico]
   ├─ Ve menú actualizado
   ├─ Puede hacer pedidos (si pro=1)
   └─ Pedido se envía por WhatsApp
   ↓
9. Comerciante gestiona desde:
   ├─ /editor/[idUnico] → Actualizar menú
   ├─ /configuracion/[idUnico] → Cambiar config
   └─ /datos-comercio/[idUnico] → Actualizar info
```

---

## 4. MÓDULOS COMPARTIDOS

### 🔑 **IDU Generator (`lib/shared/idu-generator.ts`)**

```typescript
// Genera ID único de 8 caracteres
import { generarIDU, validarIDU, generarIDUUnico } from '@/lib/shared';

// Uso básico
const idu = generarIDU(); // "5XJ1J37F"

// Con verificación de unicidad
const iduUnico = await generarIDUUnico(async (idu) => {
  const existe = await prisma.menu.findUnique({
    where: { restaurantId: idu }
  });
  return !!existe;
});

// Validar formato
if (validarIDU(idu)) {
  // IDU válido
}
```

### 💳 **Mercado Pago (`lib/shared/mercadopago.ts`)**

```typescript
import { crearPreferencia, verificarPago, procesarWebhook } from '@/lib/shared';

// Crear preferencia
const preferencia = await crearPreferencia({
  titulo: 'MenuQR - Plan Mensual',
  precio: 13999,
  descripcion: 'Carta digital QR',
  metadata: { idUnico: 'ABC123', plan: 'mensual' },
  backUrls: {
    success: '/tienda/exito',
    failure: '/tienda/error',
  }
});

// Procesar webhook
const pago = await procesarWebhook(webhookBody);
if (pago) {
  // Pago aprobado
  await crearUsuarioYMenu(pago.metadata.idUnico);
}
```

### 🎨 **QR Generator (`lib/shared/qr-generator.ts`)**

```typescript
import { generarQR, generarURLMenuQR } from '@/lib/shared';

// Generar QR para MenuQR
const url = generarURLMenuQR('https://menuqr.app', 'ABC123', 'carta');
const qr = await generarQR(url, {
  size: 300,
  color: { dark: '#000000', light: '#FFFFFF' },
  errorCorrectionLevel: 'M'
});

// qr = "data:image/png;base64,..."
```

### 📦 **Planes (`lib/shared/planes.ts`)**

```typescript
import { PLANES_MENUQR, PLAN_SUITE, obtenerPlan, formatearPrecio } from '@/lib/shared';

// Obtener todos los planes de MenuQR
console.log(PLANES_MENUQR);

// Obtener un plan específico
const plan = obtenerPlan('menuqr-mensual');

// Formatear precio
const precioFormateado = formatearPrecio(13999); // "$13.999"
```

---

## 5. INTEGRACIÓN CON MAXIREST

### 🔌 **Conector MenuQR ↔ MaxiRest**

**Objetivo:** Sincronizar menú de MenuQR con sistema POS MaxiRest

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   MenuQR     │  ←API→  │  Conector    │  ←API→  │  MaxiRest    │
│   Editor     │         │  Middleware  │         │     POS      │
└──────────────┘         └──────────────┘         └──────────────┘
```

### **Flujo de Sincronización:**

```typescript
// POST /api/integrations/maxirest/sync
export async function POST(request: Request) {
  const { restaurantId } = await request.json();
  
  // 1. Obtener menú de MenuQR (Supabase)
  const menu = await prisma.menu.findUnique({
    where: { restaurantId },
    include: {
      categories: {
        include: { items: true }
      }
    }
  });
  
  // 2. Formatear para MaxiRest API
  const maxirestData = {
    restaurante_id: menu.maxirestId, // ID en MaxiRest
    categorias: menu.categories.map(cat => ({
      id: cat.maxirestCategoryId,
      nombre: cat.name,
      productos: cat.items.map(item => ({
        id: item.maxirestItemId,
        nombre: item.name,
        precio: parseFloat(item.price),
        descripcion: item.description,
        disponible: item.available,
      }))
    }))
  };
  
  // 3. Enviar a MaxiRest API
  const response = await fetch('https://api.maxirest.com/v1/menu/sync', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAXIREST_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(maxirestData)
  });
  
  return NextResponse.json({ success: true });
}
```

### **Campos adicionales en Schema:**

```prisma
model Menu {
  id              String   @id @default(cuid())
  restaurantId    String   @unique
  maxirestId      String?  // ID en MaxiRest
  maxirestEnabled Boolean  @default(false)
  // ... resto de campos
}

model Category {
  id                  String @id @default(cuid())
  maxirestCategoryId  String? // ID en MaxiRest
  // ... resto
}

model MenuItem {
  id                String  @id @default(cuid())
  maxirestItemId    String? // ID en MaxiRest
  // ... resto
}
```

---

## 6. INTEGRACIÓN WHATSAPP BUSINESS

### 📱 **MenuQR → WhatsApp Business Catalog**

**Feature Premium:** Sincronizar menú con catálogo de productos de WhatsApp Business

```typescript
// POST /api/integrations/whatsapp/sync
export async function POST(request: Request) {
  const { restaurantId } = await request.json();
  
  // 1. Obtener menú
  const menu = await prisma.menu.findUnique({
    where: { restaurantId },
    include: { categories: { include: { items: true } } }
  });
  
  // 2. Formatear para WhatsApp Catalog
  const catalogItems = menu.categories.flatMap(cat =>
    cat.items.map(item => ({
      retailer_id: item.id,
      name: item.name,
      description: item.description,
      price: parseInt(item.price) * 100, // En centavos
      currency: 'ARS',
      image_url: item.imageUrl,
      availability: item.available ? 'in stock' : 'out of stock',
      category: cat.name,
    }))
  );
  
  // 3. Sincronizar con WhatsApp Business API
  const WHATSAPP_TOKEN = process.env.WHATSAPP_BUSINESS_TOKEN;
  const CATALOG_ID = process.env.WHATSAPP_CATALOG_ID;
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${CATALOG_ID}/items`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: catalogItems })
    }
  );
  
  return NextResponse.json({ success: true, synced: catalogItems.length });
}
```

**Botón en Editor:**

```tsx
// En /editor/[idUnico]/page.tsx
<button
  onClick={async () => {
    await fetch('/api/integrations/whatsapp/sync', {
      method: 'POST',
      body: JSON.stringify({ restaurantId: menu.restaurantId })
    });
    alert('✅ Menú sincronizado con WhatsApp Business!');
  }}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  📱 Sincronizar con WhatsApp
</button>
```

---

## 7. ROADMAP

### **FASE 1: MVP Funcional (2 semanas)**

#### Semana 1: Core Features
- [x] Módulos compartidos (`lib/shared`)
- [ ] Webhook Mercado Pago real
- [ ] Crear User + Menu al confirmar pago
- [ ] Email de bienvenida (Resend)
- [ ] Página /bienvenida/[idUnico]

#### Semana 2: Onboarding
- [ ] Wizard de 6 pasos (Datos → Scanner → Editor → Opciones → Carta → Config)
- [ ] Scanner OCR integrado con `/api/seed-from-ocr`
- [ ] Dashboard básico `/dashboard/[idUnico]`
- [ ] Autenticación con Next-Auth

### **FASE 2: Integraciones (3 semanas)**

#### Semana 3: MaxiRest
- [ ] API conector MenuQR ↔ MaxiRest
- [ ] Sincronización bidireccional
- [ ] Mapping de campos
- [ ] Testing con EP (Esquina Pompeya)

#### Semana 4: WhatsApp Business
- [ ] Integración con WhatsApp Cloud API
- [ ] Sincronización de catálogo
- [ ] Webhook para recibir pedidos desde WhatsApp
- [ ] Panel de pedidos unificado

#### Semana 5: QRing Integration
- [ ] Plan Suite (QRing + MenuQR)
- [ ] Dashboard unificado
- [ ] Compartir IDU entre apps
- [ ] Cross-selling

### **FASE 3: Analytics y Scale (4 semanas)**

#### Semana 6-7: Analytics
- [ ] Dashboard de estadísticas
- [ ] Productos más vendidos
- [ ] Pedidos por canal (QR/WhatsApp/MaxiRest)
- [ ] Reportes exportables

#### Semana 8-9: Scale
- [ ] Multi-restaurante (cadenas)
- [ ] Roles y permisos
- [ ] API pública para partners
- [ ] Marketplace de themes

---

## 📚 DOCUMENTOS RELACIONADOS

### **Documentación Actual:**

#### ✅ **Activos (Keep):**
1. `ESTRUCTURA_TABLAS.md` - Schema de base de datos
2. `Menu_Esquina_Pompeya.md` - Datos reales para testing
3. `Propuesta-Integracion-Maxirest.md` - Spec del conector

#### 🔄 **Consolidados en este documento:**
4. `FLUJO-REAL-ACTUAL.md` → Sección 3
5. `ANALISIS-ESTADO-SISTEMA.md` → Sección 7 (Roadmap)
6. `PROYECTO-MENUQR-COMPLETO.md` → Este documento es el sucesor

#### ❌ **Obsoletos (Eliminar):**
7. `FLUJO-COMPLETO.md` - Reemplazado por FLUJO-REAL-ACTUAL
8. `FuturasCaracteristicas.md` - Consolidado en Roadmap
9. `PedidoComandaSnippet.md` - Ya implementado
10. `Qwen_md_20251012_uv3p97ob8.md` - Temporal, obsoleto

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### **Hoy (Noviembre 11):**
1. ✅ Crear módulos compartidos (`lib/shared`)
2. ✅ Unificar documentación en este MD
3. [ ] Eliminar MDs obsoletos
4. [ ] Testear `/api/seed-from-md` con PowerShell
5. [ ] Sincronizar local y Vercel con 21/196 platos

### **Esta Semana:**
1. [ ] Implementar webhook MP real
2. [ ] Crear `/api/seed-from-ocr` para scanner
3. [ ] Página `/bienvenida/[idUnico]` con wizard
4. [ ] Email de bienvenida con Resend
5. [ ] Testing completo del flujo post-compra

---

**Mantenido por:** bdileo35  
**Última revisión:** 11 de Noviembre, 2025  
**Estado del proyecto:** 🟡 MVP en desarrollo (70% completo)
