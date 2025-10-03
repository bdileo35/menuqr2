# 🔍 AUDITORÍA COMPLETA - MenuQR Project Structure
**Análisis detallado de archivos, uso y estado**  
**Fecha:** Octubre 2, 2025  
**Versión:** 1.0.0

---

## 📊 RESUMEN EJECUTIVO

| Categoría | Total | En Uso | Deprecado | % Uso |
|-----------|-------|--------|-----------|-------|
| **Páginas** | 21 | 10 | 11 | 47% |
| **Componentes** | 2 | 2 | 0 | 100% |
| **APIs** | 0 | 0 | 0 | N/A |
| **Scripts** | 3 | 1 | 2 | 33% |
| **Config** | 8 | 8 | 0 | 100% |
| **TOTAL** | 34 | 21 | 13 | 62% |

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

### 📁 `/app` - Páginas y Rutas

#### ✅ **EN USO ACTIVO (CORE)**

| Archivo | Ruta | Propósito | Estado |
|---------|------|-----------|--------|
| 🏠 **Homepage** | `/page.tsx` | Landing principal con navegación | ✅ ACTIVO |
| 🛒 **QR-Shop** | `/qr-shop/page.tsx` | Landing comercial de productos | ✅ ACTIVO |
| 📸 **Scanner** | `/scanner/page.tsx` | OCR de carta física (Tesseract.js) | ✅ ACTIVO |
| ✏️ **Editor** | `/editor/page.tsx` | Editor de menú (categorías + productos) | ✅ ACTIVO |
| 📄 **Carta Menu** | `/carta-menu/page.tsx` | Vista final del menú (cliente) | ✅ ACTIVO |
| 🍽️ **Menu Dinámico** | `/menu/[restaurantId]/page.tsx` | Ruta dinámica multi-tenant | ✅ ACTIVO (NO USADO AÚN) |
| 🏪 **Esquina Pompeya** | `/menu/esquina-pompeya/page.tsx` | Ejemplo hardcodeado | ✅ DEMO |
| 🎯 **Setup Comercio** | `/setup-comercio/page.tsx` | Configuración inicial (wizard) | ✅ ACTIVO |
| 🎨 **Personalización** | `/personalizacion/page.tsx` | Selector de tema y colores | ✅ ACTIVO |
| 🔲 **Generar QR** | `/generar-qr/page.tsx` | Generación de QR + guardado | ✅ ACTIVO |

**Total: 10 archivos**

---

#### ⚠️ **EN DESUSO / DEPRECADO**

| Archivo | Ruta | Razón | Acción |
|---------|------|-------|--------|
| 🧪 **Demo Setup** | `/demo/setup-comercio/page.tsx` | Duplicado obsoleto | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Editor** | `/demo/editor/page.tsx` | Duplicado obsoleto | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Carta Final** | `/demo/carta-final/page.tsx` | Duplicado obsoleto | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Esquina Vacía** | `/demo/esquina-pompeya-vacia/page.tsx` | No usado | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Flow Page1** | `/demo-flow/page1/page.tsx` | Prototipo viejo | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Flow Page2** | `/demo-flow/page2/page.tsx` | Prototipo viejo | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Flow Page3** | `/demo-flow/page3/page.tsx` | Prototipo viejo | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Flow Page4** | `/demo-flow/page4/page.tsx` | Prototipo viejo | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Flow Page5** | `/demo-flow/page5/page.tsx` | Prototipo viejo | ❌ MOVER A `_deprecated` |
| 🧪 **Demo Flow Final** | `/demo-flow/final/page.tsx` | Prototipo viejo | ❌ MOVER A `_deprecated` |
| 🔧 **Generador** | `/generador/page.tsx` | Duplicado de `/generar-qr` | ❌ MOVER A `_deprecated` |

**Total: 11 archivos deprecados**

---

### 📦 `/app/components` - Componentes Reutilizables

| Componente | Archivo | Uso | Estado |
|-----------|---------|-----|--------|
| 🏷️ **DevBanner** | `DevBanner.tsx` | Banner de desarrollo en demos | ✅ ACTIVO |
| 📋 **DemoHeader** | `DemoHeader.tsx` | Header de páginas demo | ✅ ACTIVO |

**Total: 2 componentes activos**

---

### ⚙️ `/app/api` - API Routes (Backend)

| API | Ruta | Funcionalidad | Estado |
|-----|------|---------------|--------|
| - | - | - | ❌ **NO EXISTEN** |

**📌 CRÍTICO:** Faltan todas las APIs necesarias para:
- Autenticación (`/api/auth/*`)
- CRUD de menús (`/api/menu/*`)
- Subida de imágenes (`/api/upload/*`)

---

### 🗄️ `/prisma` - Database Schema

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `schema.prisma` | Definición de modelos (User, Menu, Category, MenuItem) | ✅ PERFECTO |
| `dev.db` | Base de datos SQLite de desarrollo | ✅ ACTIVO |
| `/migrations` | Historial de migraciones de BD | ✅ ACTIVO |

**Total: Estructura DB completa y funcional**

---

### 📜 `/scripts` - Scripts de Desarrollo

| Script | Archivo | Propósito | Estado |
|--------|---------|-----------|--------|
| 🌱 **Seed Esquina Pompeya** | `seed-esquina-pompeya.ts` | Poblar DB con datos de ejemplo | ⚠️ DESHABILITADO (error TypeScript) |
| 🔧 **Create Esquina (Mongoose)** | `createEsquinaPompeya.mongoose.js` | Script viejo (MongoDB) | ❌ DEPRECADO |
| 🔧 **Create Esquina (Prisma)** | `createEsquinaPompeya.prisma.js` | Duplicado del .ts | ❌ DEPRECADO |

**Acción:** Mover `.mongoose.js` y `.prisma.js` a `_deprecated`

---

### 🎨 Archivos de Configuración

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `package.json` | Dependencias del proyecto | ✅ ACTIVO |
| `tsconfig.json` | Configuración TypeScript | ✅ ACTIVO |
| `next.config.js` | Configuración Next.js | ✅ ACTIVO |
| `tailwind.config.js` | Configuración Tailwind CSS | ✅ ACTIVO |
| `postcss.config.js` | Configuración PostCSS | ✅ ACTIVO |
| `vercel.json` | Configuración Vercel deployment | ✅ ACTIVO |
| `.env.local` | Variables de entorno | ✅ ACTIVO |
| `.gitignore` | Archivos ignorados por Git | ✅ ACTIVO |

**Total: 8 archivos de configuración, todos activos**

---

### 📄 Archivos de Documentación

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `README.md` | Documentación principal | ✅ ACTIVO |
| `ESTRATEGIA-MULTI-TENANT.md` | Guía de arquitectura | ✅ ACTIVO |
| `NGROK-SETUP.md` | Guía de túnel ngrok | ✅ ACTIVO |
| `menu-esquina-pompeya-completo.md` | Datos de ejemplo | ✅ ACTIVO |

---

## 🔄 FLUJO DE USUARIO ACTUAL

### 📍 **Rutas Principales (Orden del Wizard)**

```
1. /                         → Landing + Navegación
2. /qr-shop                  → Productos (opcional)
3. /setup-comercio           → Configuración inicial
4. /scanner                  → OCR (opcional)
5. /editor                   → Editar menú
6. /personalizacion          → Tema visual
7. /generar-qr               → Generar QR + Guardar
8. /carta-menu               → Vista final (cliente)
   └→ MIGRAR A: /menu/[restaurantId]
```

---

## 🎯 MAPA DE DEPENDENCIAS

### **Páginas que usan localStorage:**

| Página | Lee de localStorage | Escribe en localStorage |
|--------|---------------------|-------------------------|
| `/editor` | `scanned-menu-data` | `editor-menu-data` |
| `/carta-menu` | `editor-menu-data`, `setup-comercio-data` | - |
| `/scanner` | - | `scanned-menu-data` |
| `/setup-comercio` | - | `setup-comercio-data` |
| `/personalizacion` | - | `theme-data` |

### **Páginas que usan Prisma:**

| Página | Modelo | Operación |
|--------|--------|-----------|
| `/menu/[restaurantId]` | `Menu` | `findUnique()` |
| `/menu/esquina-pompeya` | Hardcoded | - |

### **Componentes compartidos:**

| Componente | Usado en |
|-----------|----------|
| `DevBanner` | `/carta-menu`, `/demo/*` |
| `DemoHeader` | `/demo/*` |

---

## 🚨 PROBLEMAS IDENTIFICADOS

### ❌ **CRÍTICO**

1. **Falta Backend Completo**
   - No existen APIs de autenticación
   - No existe API de guardado de menús
   - Todo depende de localStorage (no persistente)

2. **Ruta Dinámica No Usada**
   - `/menu/[restaurantId]` existe pero el wizard no la usa
   - `/carta-menu` debería redirigir a la ruta dinámica

3. **Scripts de Seed Rotos**
   - `seed-esquina-pompeya.ts` deshabilitado (error phone)
   - No hay forma de poblar DB fácilmente

### ⚠️ **MEDIO**

4. **Duplicación de Código**
   - `/generador` vs `/generar-qr` (mismo propósito)
   - Carpetas `/demo` y `/demo-flow` con prototipos viejos

5. **Páginas de Demo Obsoletas**
   - 11 archivos en carpetas demo no usados en producción
   - Confunden la estructura del proyecto

### ℹ️ **BAJO**

6. **Documentación Incompleta**
   - Falta guía de setup local
   - No hay ejemplos de uso de APIs (porque no existen)

---

## 📋 PLAN DE LIMPIEZA

### **FASE 1: Mover archivos deprecados**

```bash
# Crear estructura en _deprecated
MenuQR/
└── _deprecated/
    ├── demo/                   ← Mover /app/demo/*
    ├── demo-flow/              ← Mover /app/demo-flow/*
    ├── generador/              ← Mover /app/generador/*
    └── scripts/                ← Mover scripts viejos
```

### **FASE 2: Crear APIs faltantes**

```
app/
└── api/
    ├── auth/
    │   ├── register/route.ts
    │   └── login/route.ts
    ├── menu/
    │   ├── route.ts            ← POST (crear), GET (listar)
    │   └── [restaurantId]/
    │       └── route.ts        ← GET (leer), PUT (actualizar)
    └── upload/
        └── route.ts            ← Subida de imágenes
```

### **FASE 3: Migrar localStorage → Prisma**

```typescript
// En /generar-qr/page.tsx
const saveMenu = async () => {
  const response = await fetch('/api/menu', {
    method: 'POST',
    body: JSON.stringify({
      ...setupData,
      ...editorData,
      ...themeData
    })
  });
  
  const { restaurantId } = await response.json();
  router.push(`/menu/${restaurantId}`);
};
```

### **FASE 4: Eliminar archivos deprecados**

- Una vez confirmado que no se usan, eliminar carpeta `_deprecated`

---

## 📊 ESTRUCTURA OBJETIVO (Limpia)

```
MenuQR/
├── app/
│   ├── page.tsx                    ← Landing
│   ├── qr-shop/                    ← Productos
│   ├── setup-comercio/             ← Wizard paso 1
│   ├── scanner/                    ← Wizard paso 2 (opcional)
│   ├── editor/                     ← Wizard paso 3
│   ├── personalizacion/            ← Wizard paso 4
│   ├── generar-qr/                 ← Wizard paso 5 (guarda en DB)
│   ├── menu/
│   │   └── [restaurantId]/         ← Vista pública dinámica
│   ├── admin/
│   │   ├── login/                  ← Login de dueños
│   │   └── [restaurantId]/         ← Panel de control
│   ├── api/
│   │   ├── auth/                   ← Autenticación
│   │   ├── menu/                   ← CRUD menús
│   │   └── upload/                 ← Subida imágenes
│   └── components/
│       ├── DevBanner.tsx
│       └── DemoHeader.tsx
├── prisma/
│   ├── schema.prisma               ← Modelos DB
│   └── dev.db                      ← SQLite local
├── scripts/
│   └── seed-esquina-pompeya.ts     ← Seed funcional
├── public/                         ← Assets estáticos
├── lib/                            ← Utilidades
└── _deprecated/                    ← Archivos viejos (temporal)
```

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### **1. Inmediato (Esta semana)**
- [x] Crear carpeta `_deprecated`
- [ ] Mover 11 archivos demo a `_deprecated`
- [ ] Mover 2 scripts viejos a `_deprecated`
- [ ] Crear este documento de auditoría

### **2. Corto plazo (Próxima semana)**
- [ ] Implementar `POST /api/menu` (guardar menú en Prisma)
- [ ] Implementar `GET /api/menu/[restaurantId]` (leer menú público)
- [ ] Conectar `/generar-qr` con la API
- [ ] Migrar `/carta-menu` → `/menu/[restaurantId]`

### **3. Mediano plazo (2 semanas)**
- [ ] Sistema de autenticación completo
- [ ] Panel de admin `/admin/[restaurantId]`
- [ ] Arreglar seed script (agregar campo `phone` al schema)
- [ ] Eliminar carpeta `_deprecated` (si confirmado)

---

## 📈 MÉTRICAS DE SALUD DEL PROYECTO

| Métrica | Antes | Después (Objetivo) |
|---------|-------|---------------------|
| **Archivos totales** | 34 | 23 (-32%) |
| **Páginas activas** | 10/21 | 10/10 (100%) |
| **Código duplicado** | 11 archivos | 0 archivos |
| **Cobertura API** | 0% | 100% |
| **Persistencia datos** | localStorage | Prisma DB |

---

## 🔍 ANÁLISIS POR CATEGORÍA

### **1. Páginas Web (`/app/**/*.tsx`)**

#### ✅ Páginas Productivas (10)
```
Wizard Flow:
  /                          → Entry point
  /qr-shop                   → Marketing
  /setup-comercio            → Paso 1
  /scanner                   → Paso 2 (opcional)
  /editor                    → Paso 3
  /personalizacion           → Paso 4
  /generar-qr                → Paso 5
  
Vista Pública:
  /carta-menu                → Vista actual (migrar)
  /menu/[restaurantId]       → Vista dinámica (objetivo)
  /menu/esquina-pompeya      → Demo hardcoded
```

#### ❌ Páginas Deprecadas (11)
```
Demo Prototypes:
  /demo/setup-comercio       → Duplicado
  /demo/editor               → Duplicado
  /demo/carta-final          → Duplicado
  /demo/esquina-pompeya-vacia → No usado
  
Demo Flow (Prototipo viejo):
  /demo-flow/page1-5         → 5 páginas viejas
  /demo-flow/final           → No usado
  
Duplicados:
  /generador                 → Igual a /generar-qr
```

### **2. Componentes (`/app/components/*.tsx`)**

#### ✅ Componentes Activos (2)
```typescript
// DevBanner.tsx - Banner de ambiente de desarrollo
interface DevBannerProps {
  title: string;
  step?: string;
  description?: string;
}

// DemoHeader.tsx - Header para páginas demo
interface DemoHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
}
```

**Uso:**
- `DevBanner` → `/carta-menu`, páginas `/demo/*`
- `DemoHeader` → Páginas `/demo/*` (deprecadas)

**Acción recomendada:**
- Mantener `DevBanner` (útil para desarrollo)
- `DemoHeader` se puede mover a `_deprecated` si eliminamos `/demo`

### **3. APIs (`/app/api/**/route.ts`)**

#### ❌ Estado Actual: VACÍO

**APIs Faltantes (Críticas):**

```typescript
// 1. Autenticación
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

// 2. Menús (CRUD)
POST   /api/menu              ← Crear menú completo
GET    /api/menu              ← Listar todos (admin)
GET    /api/menu/[id]         ← Leer menú público
PUT    /api/menu/[id]         ← Actualizar menú
DELETE /api/menu/[id]         ← Eliminar menú

// 3. Imágenes
POST   /api/upload            ← Subir logo/fotos de platos
```

### **4. Base de Datos (`/prisma`)**

#### ✅ Schema Perfecto - Multi-tenant Ready

```prisma
User (Dueño del restaurante)
├── restaurantId: String @unique  ← IDU
├── email, password, role
└── menus: Menu[]

Menu (Menú digital)
├── restaurantId: String @unique  ← Vinculado a User
├── Theme (colors, logo, fonts)
├── Settings (precios, idioma, moneda)
└── Relations: categories[], items[]

Category → MenuItem (Estructura jerárquica)
```

**Estado:**
- ✅ Modelos bien diseñados
- ✅ Relaciones correctas
- ⚠️ Seed script deshabilitado (campo `phone` falta en schema)

### **5. Scripts (`/scripts`)**

```
✅ seed-esquina-pompeya.ts     → Deshabilitado (fix pendiente)
❌ createEsquinaPompeya.mongoose.js → MongoDB (obsoleto)
❌ createEsquinaPompeya.prisma.js   → Duplicado
```

**Acción:**
1. Mover `.mongoose.js` y `.prisma.js` a `_deprecated`
2. Arreglar `seed-esquina-pompeya.ts`:
   - Opción A: Agregar campo `phone` al modelo `User` en schema
   - Opción B: Quitar campo `phone` del seed script

---

## 🛠️ COMANDOS ÚTILES

### **Ver estructura actual:**
```bash
tree /f /a MenuQR\app
```

### **Mover archivos deprecados:**
```bash
# PowerShell
Move-Item -Path "app\demo" -Destination "_deprecated\demo"
Move-Item -Path "app\demo-flow" -Destination "_deprecated\demo-flow"
Move-Item -Path "app\generador" -Destination "_deprecated\generador"
```

### **Verificar uso de componentes:**
```bash
# Buscar referencias a DemoHeader
grep -r "DemoHeader" app/
```

### **Limpiar build:**
```bash
rm -rf .next
npm run build
```

---

## 📝 CONCLUSIONES

### ✅ **Fortalezas del Proyecto**

1. **Schema de BD excelente** - Ya soporta multi-tenant
2. **Wizard funcional** - Flujo completo de onboarding
3. **Scanner OCR** - Funcionalidad diferenciadora (aunque mejorable)
4. **Diseño visual** - Interfaz profesional estilo QRing

### ⚠️ **Debilidades Críticas**

1. **Sin backend** - Todo en localStorage (no persistente)
2. **Código duplicado** - 11 archivos demo obsoletos (32% del total)
3. **Ruta dinámica no usada** - `/menu/[restaurantId]` implementada pero ignorada

### 🎯 **Oportunidades**

1. **Implementar APIs** - Convertir en app full-stack real
2. **Limpieza de código** - Eliminar duplicados mejora mantenibilidad
3. **Scanner mejorado** - Integrar GPT Vision o dejarlo como asistente

### 🚨 **Amenazas**

1. **Deuda técnica** - Archivos viejos confunden estructura
2. **localStorage frágil** - Datos se pierden al limpiar caché
3. **Sin multi-tenant real** - Hardcoded a "Esquina Pompeya"

---

## 📞 CONTACTO Y SEGUIMIENTO

**Próxima revisión:** Después de implementar APIs  
**Responsable:** Equipo de desarrollo  
**Estado del proyecto:** 🟡 En desarrollo activo

---

*Documento generado automáticamente - Octubre 2, 2025*  
*MenuQR v1.0.0 - QR-Suite Ecosystem*
