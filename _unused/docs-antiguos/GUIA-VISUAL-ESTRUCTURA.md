# 🎨 GUÍA VISUAL - Estructura MenuQR
**Documentación visual con diagramas y flujos**

---

## 🏗️ ARQUITECTURA DEL PROYECTO

```
┌─────────────────────────────────────────────────────────────────┐
│                         MENUQR SYSTEM                            │
│                     Full-Stack Application                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
         ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
         │   FRONTEND  │ │  BACKEND  │ │  DATABASE   │
         │   Next.js   │ │    API    │ │   Prisma    │
         │  (React)    │ │  Routes   │ │   SQLite    │
         └─────────────┘ └───────────┘ └─────────────┘
                │               │               │
         ┌──────▼──────┐       │        ┌──────▼──────┐
         │  20 Páginas │       │        │   4 Models  │
         │  2 Compons  │       │        │  User/Menu  │
         └─────────────┘       │        └─────────────┘
                               │
                        ┌──────▼──────┐
                        │   ❌ VACÍO  │
                        │  Falta TODO │
                        └─────────────┘
```

---

## 🎯 FLUJO DE USUARIO (User Journey)

```
┌────────────────────────────────────────────────────────────────────┐
│                      WIZARD DE ONBOARDING                           │
└────────────────────────────────────────────────────────────────────┘

    🏠 HOME                          🛒 QR-SHOP (Opcional)
    /page.tsx                        /qr-shop/page.tsx
    └─► Landing principal            └─► Ver productos y planes
         │                                    │
         ▼                                    │
    ⚙️ SETUP                         ◄───────┘
    /setup-comercio/page.tsx
    └─► Formulario: nombre, dirección, teléfono
         │
         ▼
    📸 SCANNER (Opcional)            
    /scanner/page.tsx
    └─► OCR de carta física → Extrae platos
         │
         ▼
    ✏️ EDITOR                        
    /editor/page.tsx
    └─► Edita categorías y productos
         │ (Guarda: localStorage → editor-menu-data)
         ▼
    🎨 PERSONALIZACIÓN               
    /personalizacion/page.tsx
    └─► Colores, logo, tema
         │ (Guarda: localStorage → theme-data)
         ▼
    🔲 GENERAR QR                    
    /generar-qr/page.tsx
    └─► Genera QR + [DEBERÍA GUARDAR EN PRISMA]
         │
         ▼
    📄 VISTA FINAL                   
    /carta-menu/page.tsx
    └─► Cliente ve el menú (lee localStorage)
         │
         │ [DEBERÍA IR A ⬇️]
         ▼
    🌐 RUTA DINÁMICA                 
    /menu/[restaurantId]/page.tsx
    └─► Vista multi-tenant (lee Prisma) ✅
```

---

## 📂 ESTRUCTURA DE CARPETAS

```
MenuQR/
│
├── 📁 app/                          ← Frontend (Next.js 14 App Router)
│   │
│   ├── 🏠 page.tsx                  ← Landing principal ✅
│   ├── 🎨 layout.tsx                ← Layout raíz ✅
│   ├── 💅 globals.css               ← Estilos globales ✅
│   │
│   ├── 📁 qr-shop/                  ← Landing comercial ✅
│   │   ├── page.tsx
│   │   └── exito/page.tsx
│   │
│   ├── 📁 setup-comercio/           ← Paso 1: Config inicial ✅
│   │   └── page.tsx
│   │
│   ├── 📁 scanner/                  ← Paso 2: OCR carta ✅
│   │   └── page.tsx
│   │
│   ├── 📁 editor/                   ← Paso 3: Editor menú ✅
│   │   └── page.tsx
│   │
│   ├── 📁 personalizacion/          ← Paso 4: Tema visual ✅
│   │   └── page.tsx
│   │
│   ├── 📁 generar-qr/               ← Paso 5: QR + Guardar ✅
│   │   └── page.tsx
│   │
│   ├── 📁 carta-menu/               ← Vista cliente (localStorage) ✅
│   │   └── page.tsx
│   │
│   ├── 📁 menu/
│   │   ├── [restaurantId]/          ← Ruta dinámica (Prisma) ✅
│   │   │   └── page.tsx
│   │   └── esquina-pompeya/         ← Demo hardcoded ✅
│   │       └── page.tsx
│   │
│   ├── 📁 api/                      ← Backend (API Routes)
│   │   └── ❌ VACÍO (Falta TODO)
│   │
│   ├── 📁 components/               ← Componentes reutilizables
│   │   ├── DevBanner.tsx            ✅ En uso
│   │   └── DemoHeader.tsx           ✅ En uso (demos)
│   │
│   ├── 📁 hooks/                    ← Custom React Hooks
│   │   └── (vacío)
│   │
│   ├── 📁 demo/                     ← ⚠️ DEPRECADO
│   │   ├── setup-comercio/
│   │   ├── editor/
│   │   ├── carta-final/
│   │   └── esquina-pompeya-vacia/
│   │
│   ├── 📁 demo-flow/                ← ⚠️ DEPRECADO
│   │   ├── page1/ ... page5/
│   │   └── final/
│   │
│   └── 📁 generador/                ← ⚠️ DEPRECADO (duplicado)
│       └── page.tsx
│
├── 📁 prisma/                       ← ORM y Database
│   ├── schema.prisma                ← Modelos DB ✅
│   ├── dev.db                       ← SQLite local ✅
│   └── migrations/                  ← Historial migraciones ✅
│
├── 📁 public/                       ← Assets estáticos
│   ├── images/
│   └── demo-images/
│
├── 📁 lib/                          ← Utilidades compartidas
│   └── prisma.ts                    ← Cliente Prisma ✅
│
├── 📁 scripts/                      ← Scripts de desarrollo
│   ├── seed-esquina-pompeya.ts      ⚠️ Deshabilitado
│   ├── createEsquinaPompeya.mongoose.js  ❌ Deprecado
│   └── createEsquinaPompeya.prisma.js    ❌ Deprecado
│
├── 📁 _deprecated/                  ← Archivos viejos (temporal)
│   └── (vacía por ahora)
│
├── 📄 package.json                  ← Dependencias ✅
├── 📄 tsconfig.json                 ← Config TypeScript ✅
├── 📄 next.config.js                ← Config Next.js ✅
├── 📄 tailwind.config.js            ← Config Tailwind ✅
├── 📄 vercel.json                   ← Config Vercel ✅
└── 📄 README.md                     ← Documentación ✅
```

---

## 🗄️ MODELOS DE BASE DE DATOS

```
┌─────────────────────────────────────────────────────────────────┐
│                          PRISMA SCHEMA                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│       👤 USER            │
│  (Dueño del restaurante) │
├──────────────────────────┤
│ • id: String (PK)        │
│ • restaurantId: String ◄─┼─── 🔑 IDU (Identificador Único)
│ • email: String          │
│ • password: String       │
│ • restaurantName: String │
│ • phone: String?         │
│ • role: Role (enum)      │
│ • plan: String?          │
│ • whatsappPhone: String? │
└──────────┬───────────────┘
           │ 1:N
           │
           ▼
┌──────────────────────────┐
│       📋 MENU            │
│  (Menú digital)          │
├──────────────────────────┤
│ • id: String (PK)        │
│ • restaurantId: String   │◄─── Vinculado a User.restaurantId
│ • restaurantName: String │
│ • logoUrl: String?       │
│ • primaryColor: String   │
│ • backgroundColor: String│
│ • showPrices: Boolean    │
│ • currency: String       │
│ • ownerId: String (FK) ──┼─── Relación con User
└──────────┬───────────────┘
           │ 1:N
           │
           ▼
┌──────────────────────────┐
│     📁 CATEGORY          │
│  (Ej: Platos del día)    │
├──────────────────────────┤
│ • id: String (PK)        │
│ • name: String           │
│ • description: String?   │
│ • position: Int          │
│ • menuId: String (FK) ───┼─── Pertenece a Menu
└──────────┬───────────────┘
           │ 1:N
           │
           ▼
┌──────────────────────────┐
│     🍽️ MENUITEM         │
│  (Plato individual)      │
├──────────────────────────┤
│ • id: String (PK)        │
│ • name: String           │
│ • description: String?   │
│ • price: Float           │
│ • imageUrl: String?      │
│ • isAvailable: Boolean   │
│ • isPopular: Boolean     │
│ • isPromo: Boolean       │
│ • categoryId: String (FK)┼─── Pertenece a Category
│ • menuId: String (FK) ───┼─── Pertenece a Menu
└──────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS

### **Actual (localStorage - Temporal)**

```
┌─────────────┐
│   SCANNER   │
└──────┬──────┘
       │ Guarda texto OCR
       ▼
  localStorage
  scanned-menu-data
       │
       ▼
┌─────────────┐
│   EDITOR    │ ← Lee datos del scanner
└──────┬──────┘
       │ Guarda menú editado
       ▼
  localStorage
  editor-menu-data
       │
       ▼
┌─────────────┐
│ CARTA-MENU  │ ← Lee menú final
└─────────────┘
```

### **Objetivo (Prisma - Persistente)**

```
┌─────────────┐
│   SCANNER   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   EDITOR    │
└──────┬──────┘
       │ Usuario edita
       ▼
┌─────────────┐
│ GENERAR-QR  │
└──────┬──────┘
       │ POST /api/menu
       ▼
  ┌─────────────┐
  │   PRISMA    │ ← Guarda en Database
  │   Database  │
  └──────┬──────┘
         │
         ▼
  ┌─────────────────────────┐
  │  /menu/[restaurantId]   │ ← GET /api/menu/[id]
  │  Vista pública dinámica │
  └─────────────────────────┘
```

---

## 🎨 PÁGINAS EN USO vs DEPRECADAS

```
┌───────────────────────────────────────────────────────────────┐
│                    PÁGINAS PRODUCTIVAS (10)                    │
└───────────────────────────────────────────────────────────────┘

  ✅ /page.tsx                       → Landing principal
  ✅ /qr-shop/page.tsx               → Productos
  ✅ /setup-comercio/page.tsx        → Wizard paso 1
  ✅ /scanner/page.tsx               → Wizard paso 2
  ✅ /editor/page.tsx                → Wizard paso 3
  ✅ /personalizacion/page.tsx       → Wizard paso 4
  ✅ /generar-qr/page.tsx            → Wizard paso 5
  ✅ /carta-menu/page.tsx            → Vista cliente
  ✅ /menu/[restaurantId]/page.tsx   → Ruta dinámica
  ✅ /menu/esquina-pompeya/page.tsx  → Demo

┌───────────────────────────────────────────────────────────────┐
│                    PÁGINAS DEPRECADAS (11)                     │
└───────────────────────────────────────────────────────────────┘

  ❌ /demo/setup-comercio/           → Duplicado obsoleto
  ❌ /demo/editor/                   → Duplicado obsoleto
  ❌ /demo/carta-final/              → Duplicado obsoleto
  ❌ /demo/esquina-pompeya-vacia/    → No usado
  ❌ /demo-flow/page1/               → Prototipo viejo
  ❌ /demo-flow/page2/               → Prototipo viejo
  ❌ /demo-flow/page3/               → Prototipo viejo
  ❌ /demo-flow/page4/               → Prototipo viejo
  ❌ /demo-flow/page5/               → Prototipo viejo
  ❌ /demo-flow/final/               → Prototipo viejo
  ❌ /generador/                     → Duplicado de /generar-qr

                    ⬇️ MOVER A ⬇️
              📁 _deprecated/
```

---

## 🔌 APIs FALTANTES (Backend)

```
┌───────────────────────────────────────────────────────────────┐
│                     APP/API/ (VACÍO)                           │
└───────────────────────────────────────────────────────────────┘

NECESARIAS:

📁 app/api/
   │
   ├── 📁 auth/                      ← Autenticación
   │   ├── register/route.ts         POST - Crear cuenta
   │   ├── login/route.ts            POST - Login
   │   └── me/route.ts               GET  - Usuario actual
   │
   ├── 📁 menu/                      ← CRUD Menús
   │   ├── route.ts                  POST - Crear menú
   │   │                             GET  - Listar menús
   │   └── [restaurantId]/
   │       └── route.ts              GET  - Leer menú
   │                                 PUT  - Actualizar
   │                                 DELETE - Eliminar
   │
   └── 📁 upload/                    ← Subida de archivos
       └── route.ts                  POST - Subir imagen

IMPLEMENTACIÓN EJEMPLO:

// app/api/menu/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  // 1. Crear User
  const user = await prisma.user.create({
    data: {
      email: body.email,
      restaurantId: generateId(),
      restaurantName: body.restaurantName,
      ...
    }
  });
  
  // 2. Crear Menu
  const menu = await prisma.menu.create({
    data: {
      restaurantId: user.restaurantId,
      ownerId: user.id,
      ...body.theme
    }
  });
  
  // 3. Crear Categories + MenuItems
  for (const cat of body.categories) {
    await prisma.category.create({
      data: {
        menuId: menu.id,
        name: cat.name,
        items: {
          create: cat.items
        }
      }
    });
  }
  
  return Response.json({ 
    restaurantId: user.restaurantId,
    menuUrl: `/menu/${user.restaurantId}`
  });
}
```

---

## 🎯 DEPENDENCIAS ENTRE ARCHIVOS

```
┌────────────────────────────────────────────────────────────────┐
│                  DEPENDENCIAS DE PÁGINAS                        │
└────────────────────────────────────────────────────────────────┘

/scanner
   │ Escribe → localStorage(scanned-menu-data)
   ▼
/editor
   │ Lee → localStorage(scanned-menu-data)
   │ Escribe → localStorage(editor-menu-data)
   ▼
/carta-menu
   │ Lee → localStorage(editor-menu-data)
   │ Lee → localStorage(setup-comercio-data)
   │ Usa → DevBanner component
   ▼
[OBJETIVO]
/menu/[restaurantId]
   │ Lee → Prisma.menu.findUnique()
   │ No usa localStorage
   
┌────────────────────────────────────────────────────────────────┐
│                DEPENDENCIAS DE COMPONENTES                      │
└────────────────────────────────────────────────────────────────┘

DevBanner.tsx
   ├─ Usado en: /carta-menu
   ├─ Usado en: /demo/* (deprecadas)
   └─ Props: { title, step, description }

DemoHeader.tsx
   ├─ Usado en: /demo/* (deprecadas)
   └─ Props: { step, totalSteps, title, description }
```

---

## 📦 STACK TECNOLÓGICO

```
┌───────────────────────────────────────────────────────────────┐
│                       FRONTEND                                 │
└───────────────────────────────────────────────────────────────┘
  
  Next.js 14.2.5       ← Framework React (App Router)
  React 18             ← UI Library
  TypeScript 5         ← Type Safety
  Tailwind CSS 3       ← Styling
  
┌───────────────────────────────────────────────────────────────┐
│                       BACKEND                                  │
└───────────────────────────────────────────────────────────────┘
  
  Next.js API Routes   ← Backend (❌ Falta implementar)
  Prisma 5             ← ORM ✅
  SQLite (dev)         ← Database local ✅
  PostgreSQL (prod)    ← Database producción (futuro)
  
┌───────────────────────────────────────────────────────────────┐
│                    HERRAMIENTAS                                │
└───────────────────────────────────────────────────────────────┘
  
  Tesseract.js         ← OCR (Scanner)
  QRCode               ← Generación de QR
  Vercel               ← Deployment
  Git/GitHub           ← Control de versiones
```

---

## 🚀 ROADMAP VISUAL

```
┌──────────────────────────────────────────────────────────────┐
│  FASE 1: LIMPIEZA (Esta semana)                               │
└──────────────────────────────────────────────────────────────┘
  [✅] Crear carpeta _deprecated
  [ ] Mover 11 archivos demo
  [ ] Mover 2 scripts viejos
  [ ] Documentar estructura

┌──────────────────────────────────────────────────────────────┐
│  FASE 2: BACKEND (Próxima semana)                             │
└──────────────────────────────────────────────────────────────┘
  [ ] Crear POST /api/menu
  [ ] Crear GET /api/menu/[id]
  [ ] Implementar autenticación
  [ ] Conectar /generar-qr con API

┌──────────────────────────────────────────────────────────────┐
│  FASE 3: MIGRACIÓN (2 semanas)                                │
└──────────────────────────────────────────────────────────────┘
  [ ] Migrar localStorage → Prisma
  [ ] Redirigir /carta-menu → /menu/[id]
  [ ] Panel admin /admin/[id]
  [ ] Sistema de login

┌──────────────────────────────────────────────────────────────┐
│  FASE 4: PRODUCCIÓN (1 mes)                                   │
└──────────────────────────────────────────────────────────────┘
  [ ] Testing multi-tenant
  [ ] Deploy PostgreSQL
  [ ] Configurar dominios
  [ ] Analytics y monitoreo
```

---

## 📊 MÉTRICAS DEL PROYECTO

```
┌─────────────────────────────────────────────────────────┐
│              ESTADO ACTUAL DEL CÓDIGO                    │
└─────────────────────────────────────────────────────────┘

  PÁGINAS:        21 total    →  10 activas (47%)
  COMPONENTES:     2 total    →   2 activos (100%)
  APIS:            0 total    →   0 activas (0% ❌)
  SCRIPTS:         3 total    →   1 activo (33%)
  
┌─────────────────────────────────────────────────────────┐
│                 COBERTURA DE FEATURES                    │
└─────────────────────────────────────────────────────────┘

  ✅ Frontend:        95% completo
  ⚠️  Backend:         0% completo (crítico)
  ✅ Database Schema: 100% completo
  ⚠️  Persistencia:   20% (solo localStorage)
  ✅ UI/UX:          90% completo
  
┌─────────────────────────────────────────────────────────┐
│              SALUD DEL CÓDIGO                            │
└─────────────────────────────────────────────────────────┘

  📈 Mantenibilidad:    MEDIA   (mucho código duplicado)
  🔐 Seguridad:         BAJA    (no hay auth real)
  ⚡ Performance:       ALTA    (Next.js optimizado)
  📦 Modularidad:       ALTA    (componentes bien separados)
  📝 Documentación:     MEDIA   (falta docs de APIs)
```

---

## 🎨 CONVENCIONES DE CÓDIGO

```typescript
// 🎨 NOMBRES DE ARCHIVOS
page.tsx           ← Páginas de Next.js (App Router)
route.ts           ← API Routes
ComponentName.tsx  ← Componentes (PascalCase)
utils.ts           ← Utilidades (camelCase)

// 📁 ESTRUCTURA DE COMPONENTES
interface Props {
  title: string;
  isActive?: boolean;
}

export default function ComponentName({ title, isActive }: Props) {
  return <div>{title}</div>;
}

// 🗄️ PRISMA QUERIES
const menu = await prisma.menu.findUnique({
  where: { restaurantId },
  include: {
    categories: {
      include: { items: true }
    }
  }
});

// 💾 LOCALSTORAGE (Temporal)
localStorage.setItem('editor-menu-data', JSON.stringify(data));
const data = JSON.parse(localStorage.getItem('editor-menu-data') || '{}');

// 🎯 RUTAS DINÁMICAS
app/menu/[restaurantId]/page.tsx
→ URL: /menu/esquina-pompeya
→ params.restaurantId = "esquina-pompeya"
```

---

## 🔗 ENLACES ÚTILES

```
📚 Documentación:
  ├─ AUDITORIA-ESTRUCTURA.md     ← Análisis detallado
  ├─ ESTRATEGIA-MULTI-TENANT.md  ← Arquitectura objetivo
  ├─ NGROK-SETUP.md              ← Setup de túnel
  └─ README.md                   ← Guía general

🌐 Repositorio:
  └─ github.com/bdileo35/MenuQR

☁️ Deployment:
  └─ menu-qr-beta.vercel.app

🗄️ Database:
  ├─ SQLite (local):  prisma/dev.db
  └─ PostgreSQL (prod): TBD
```

---

*Guía Visual generada - Octubre 2, 2025*  
*MenuQR v1.0.0*
