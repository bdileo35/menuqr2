# 🎯 PLAN DE ACCIÓN PRIORITARIO - MenuQR
**Roadmap ejecutable con orden de tareas**

**Fecha:** Octubre 2, 2025  
**Objetivo:** Convertir MenuQR en aplicación full-stack funcional

---

## 📋 RESUMEN DE TAREAS IDENTIFICADAS

### **Temas a resolver (del usuario):**
1. ✅ Limpieza - Pasar a desuso antes de borrar
2. ⏳ Generar lista del menú desde nuevo MD
3. ⏳ Crear tablas y relaciones en Prisma (producción ready)
4. ⏳ Alimentar Editor con datos reales de Prisma
5. ⏳ Revisar/Mejorar Scanner y decidir su futuro

### **Temas adicionales críticos (identificados en auditoría):**
6. ⏳ Implementar APIs backend (autenticación + CRUD)
7. ⏳ Migrar localStorage → Prisma en todo el flujo
8. ⏳ Implementar sistema de autenticación real
9. ⏳ Crear panel de administración funcional
10. ⏳ Testing y deployment a producción

---

## 🚀 PLAN DE ACCIÓN (ORDENADO POR PRIORIDAD)

---

## 📦 **FASE 1: LIMPIEZA Y ORGANIZACIÓN** (1 día)
**Objetivo:** Código limpio, documentado y organizado

### ✅ **TAREA 1.1: Ejecutar limpieza de archivos deprecados**
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 30 minutos  
**Dependencias:** Ninguna

**Acciones:**
```powershell
cd Z:\VSCode\QR-Suite\MenuQR
.\cleanup-deprecated.ps1
# Confirmar movimiento de 13 archivos
```

**Archivos a mover:**
- `/app/demo/` (4 páginas)
- `/app/demo-flow/` (6 páginas)
- `/app/generador/` (1 página duplicada)
- `/scripts/createEsquinaPompeya.mongoose.js`
- `/scripts/createEsquinaPompeya.prisma.js`

**Verificación:**
```bash
npm run dev
# Probar páginas principales
# Verificar que no hay errores 404
```

**Criterio de éxito:**
- ✅ 13 archivos movidos a `_deprecated/`
- ✅ App funciona sin errores
- ✅ Build de producción exitoso

---

### ✅ **TAREA 1.2: Mover documentación a carpeta Docs/**
**Prioridad:** 🟡 MEDIA  
**Tiempo:** 15 minutos  
**Dependencias:** Tarea 1.1

**Acciones:**
```powershell
# Ya hecho parcialmente, verificar que estén todos
Move-Item -Path "*.md" -Destination "Docs\" -Exclude "README.md"
```

**Resultado esperado:**
```
MenuQR/
├── README.md (raíz - mantener)
└── Docs/
    ├── AUDITORIA-ESTRUCTURA.md
    ├── GUIA-VISUAL-ESTRUCTURA.md
    ├── ESTRATEGIA-MULTI-TENANT.md
    ├── INDICE-DOCUMENTACION.md
    ├── RESUMEN-EJECUTIVO.md
    ├── PLAN-ACCION-PRIORITARIO.md (este archivo)
    ├── COMPARATIVA-MENUS.md
    ├── Menu_Esquina_Pompeya.md (nuevo)
    └── menu-esquina-pompeya-completo.md (viejo - deprecar)
```

**Criterio de éxito:**
- ✅ Todos los MD en Docs/ excepto README.md
- ✅ Links internos actualizados

---

### ✅ **TAREA 1.3: Commit de limpieza**
**Prioridad:** 🟡 MEDIA  
**Tiempo:** 5 minutos  
**Dependencias:** Tareas 1.1 y 1.2

**Acciones:**
```bash
git add .
git commit -m "🧹 Limpieza: Archivos deprecados + Docs organizados"
git push
```

---

## 🗄️ **FASE 2: SCHEMA PRISMA PRODUCCIÓN** (1 día)
**Objetivo:** Base de datos completa y optimizada

### 🔴 **TAREA 2.1: Revisar y mejorar schema Prisma actual**
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 2 horas  
**Dependencias:** Fase 1 completa

**Estado actual del schema:**
```prisma
// ✅ Ya tenemos 4 modelos base:
- User (dueño restaurante)
- Menu (menú digital)
- Category (categorías)
- MenuItem (platos individuales)
```

**Mejoras necesarias:**

#### **A. Agregar campo `phone` al modelo User**
```prisma
model User {
  // ... campos existentes
  phone          String?   ← AGREGAR para arreglar seed script
  // ... resto
}
```

#### **B. Agregar índices para performance**
```prisma
model Menu {
  // ... campos
  
  @@index([restaurantId])  ← AGREGAR para búsquedas rápidas
  @@index([ownerId])
}

model MenuItem {
  // ... campos
  
  @@index([menuId, categoryId])  ← AGREGAR
  @@index([isAvailable])
}
```

#### **C. Agregar modelo para auditoría (opcional pero recomendado)**
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  userId      String
  action      String   // "CREATE_MENU", "UPDATE_ITEM", etc
  entityType  String   // "Menu", "MenuItem", etc
  entityId    String
  changes     Json?    // Snapshot de cambios
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id])
  
  @@index([userId, createdAt])
  @@map("audit_logs")
}
```

#### **D. Agregar modelo para imágenes (Cloudinary)**
```prisma
model Image {
  id          String   @id @default(cuid())
  url         String
  publicId    String   // Cloudinary ID
  width       Int?
  height      Int?
  format      String?  // jpg, png, webp
  size        Int?     // bytes
  
  // Relaciones polimórficas
  menuId      String?
  menuItemId  String?
  categoryId  String?
  
  menu        Menu?     @relation(fields: [menuId], references: [id])
  menuItem    MenuItem? @relation(fields: [menuItemId], references: [id])
  category    Category? @relation(fields: [categoryId], references: [id])
  
  createdAt   DateTime @default(now())
  
  @@index([menuId])
  @@index([menuItemId])
  @@map("images")
}
```

**Acciones:**
1. Abrir `prisma/schema.prisma`
2. Aplicar mejoras A, B, C, D
3. Ejecutar migraciones
4. Verificar en Prisma Studio

```bash
npx prisma format
npx prisma db push
npx prisma generate
npx prisma studio
```

**Criterio de éxito:**
- ✅ Campo `phone` agregado a User
- ✅ Índices agregados
- ✅ Modelos adicionales creados
- ✅ Migraciones aplicadas sin errores
- ✅ Prisma Client regenerado

---

### 🔴 **TAREA 2.2: Crear seed script funcional con datos de Esquina Pompeya**
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 1 hora  
**Dependencias:** Tarea 2.1

**Usar datos del nuevo MD:** `Docs/Menu_Esquina_Pompeya.md`

**Archivo:** `scripts/seed-esquina-pompeya.ts`

**Estructura del seed:**
```typescript
async function seedEsquinaPompeya() {
  // 1. Crear User
  const user = await prisma.user.create({
    data: {
      email: 'esquinapompeya@menuqr.com',
      password: await hashPassword('demo123'),
      restaurantId: 'esquina-pompeya',
      restaurantName: 'ESQUINA POMPEYA',
      phone: '+54 9 11 1234-5678',  ← AHORA FUNCIONA
      address: 'Av. Pompeya 123, CABA',
      role: 'OWNER',
      plan: 'premium'
    }
  });

  // 2. Crear Menu
  const menu = await prisma.menu.create({
    data: {
      restaurantId: 'esquina-pompeya',
      restaurantName: 'ESQUINA POMPEYA',
      description: 'Parrilla y cocina casera argentina',
      ownerId: user.id,
      
      // Theme
      primaryColor: '#1e40af',
      secondaryColor: '#64748b',
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      
      // Settings
      currency: '$',
      showPrices: true,
      showImages: true,
      showDescriptions: true
    }
  });

  // 3. Crear categorías con items (del nuevo MD)
  const categories = [
    {
      name: 'PLATOS DEL DIA',
      items: [
        { name: 'Milanesas al horno c/ Puré', price: 9000, description: '...' },
        { name: 'Croquetas de carne c/ensalada', price: 8000 },
        // ... 8 items total
      ]
    },
    {
      name: 'PROMOCIONES',
      items: [
        { name: 'PROMO 1: Milanesa Completa', price: 12000, isPromo: true },
        { name: 'PROMO 2: Salpicón de Ave', price: 12000, isPromo: true },
        // ... 3 items total
      ]
    },
    // ... resto de categorías (6 total)
  ];

  for (const cat of categories) {
    await prisma.category.create({
      data: {
        name: cat.name,
        menuId: menu.id,
        items: {
          create: cat.items.map((item, idx) => ({
            ...item,
            menuId: menu.id,
            position: idx,
            isAvailable: true
          }))
        }
      }
    });
  }
}
```

**Ejecutar seed:**
```bash
npx tsx scripts/seed-esquina-pompeya.ts
```

**Criterio de éxito:**
- ✅ Script ejecuta sin errores
- ✅ User creado en DB
- ✅ Menu creado con 6 categorías
- ✅ 28 MenuItems creados (según nuevo MD)
- ✅ Visible en Prisma Studio

---

## 🔌 **FASE 3: BACKEND APIs** (2-3 días)
**Objetivo:** APIs funcionales para CRUD y autenticación

### 🔴 **TAREA 3.1: API de lectura de menú público**
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 2 horas  
**Dependencias:** Fase 2 completa

**Crear:** `app/api/menu/[restaurantId]/route.ts`

```typescript
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const menu = await prisma.menu.findUnique({
      where: { restaurantId: params.restaurantId },
      include: {
        categories: {
          include: {
            items: {
              where: { isAvailable: true },
              orderBy: { position: 'asc' }
            }
          },
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!menu) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Testing:**
```bash
curl http://localhost:3000/api/menu/esquina-pompeya
```

**Criterio de éxito:**
- ✅ API responde con JSON completo
- ✅ Incluye categorías e items anidados
- ✅ Maneja errores (404, 500)
- ✅ Performance < 200ms

---

### 🔴 **TAREA 3.2: API de creación de menú**
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 3 horas  
**Dependencias:** Tarea 3.1

**Crear:** `app/api/menu/route.ts`

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validar datos
    if (!body.restaurantName || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 2. Generar restaurantId único
    const restaurantId = generateRestaurantId(body.restaurantName);

    // 3. Crear User
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: await hashPassword(body.password),
        restaurantId,
        restaurantName: body.restaurantName,
        phone: body.phone,
        address: body.address
      }
    });

    // 4. Crear Menu con categorías e items
    const menu = await prisma.menu.create({
      data: {
        restaurantId,
        restaurantName: body.restaurantName,
        ownerId: user.id,
        ...body.theme,
        categories: {
          create: body.categories.map((cat, idx) => ({
            name: cat.name,
            position: idx,
            items: {
              create: cat.items.map((item, itemIdx) => ({
                ...item,
                position: itemIdx
              }))
            }
          }))
        }
      }
    });

    // 5. Generar QR
    const qrData = await generateQR(`/menu/${restaurantId}`);

    return NextResponse.json({
      success: true,
      restaurantId,
      menuUrl: `/menu/${restaurantId}`,
      qrImage: qrData
    });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Failed to create menu' },
      { status: 500 }
    );
  }
}
```

**Criterio de éxito:**
- ✅ Crea User + Menu + Categories + Items en una transacción
- ✅ Genera restaurantId único
- ✅ Retorna QR generado
- ✅ Maneja errores de validación

---

### 🟡 **TAREA 3.3: APIs de autenticación**
**Prioridad:** 🟡 ALTA  
**Tiempo:** 4 horas  
**Dependencias:** Tarea 3.2

**Crear:**
- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/me/route.ts`

**Implementar:**
- JWT tokens
- Password hashing (bcrypt)
- Middleware de autenticación

**Librerías:**
```bash
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

**Criterio de éxito:**
- ✅ Register crea usuario y retorna JWT
- ✅ Login valida credenciales
- ✅ Middleware protege rutas privadas

---

## 🎨 **FASE 4: CONECTAR FRONTEND CON BACKEND** (2 días)
**Objetivo:** Eliminar localStorage, usar APIs reales

### 🔴 **TAREA 4.1: Migrar /menu/[restaurantId] a usar API**
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 1 hora  
**Dependencias:** Tarea 3.1

**Archivo:** `app/menu/[restaurantId]/page.tsx`

**Cambiar de:**
```typescript
// ❌ ANTES: Hardcoded
const menuData = {
  restaurantName: 'Esquina Pompeya',
  categories: [...]
};
```

**A:**
```typescript
// ✅ AHORA: Desde API
const response = await fetch(`/api/menu/${params.restaurantId}`);
const menuData = await response.json();
```

**Criterio de éxito:**
- ✅ Página carga datos desde API
- ✅ Maneja loading state
- ✅ Maneja errores (404, 500)
- ✅ Renderiza correctamente

---

### 🔴 **TAREA 4.2: Conectar /generar-qr con API POST**
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 2 horas  
**Dependencias:** Tarea 3.2

**Archivo:** `app/generar-qr/page.tsx`

**Cambiar de:**
```typescript
// ❌ ANTES: Solo genera QR, no guarda nada
const qrUrl = `/carta-menu`;
```

**A:**
```typescript
// ✅ AHORA: Guarda en Prisma y genera QR
const setupData = JSON.parse(localStorage.getItem('setup-comercio-data'));
const editorData = JSON.parse(localStorage.getItem('editor-menu-data'));
const themeData = JSON.parse(localStorage.getItem('theme-data'));

const response = await fetch('/api/menu', {
  method: 'POST',
  body: JSON.stringify({
    ...setupData,
    categories: editorData.categories,
    theme: themeData
  })
});

const { restaurantId, menuUrl, qrImage } = await response.json();

// Redirigir a la URL dinámica
router.push(menuUrl);
```

**Criterio de éxito:**
- ✅ Guarda datos en Prisma
- ✅ Genera QR con URL real
- ✅ Redirige a /menu/[restaurantId]
- ✅ Limpia localStorage después

---

### 🟡 **TAREA 4.3: Alimentar /editor con datos de Prisma**
**Prioridad:** 🟡 ALTA  
**Tiempo:** 2 horas  
**Dependencias:** Fase 3 completa

**Objetivo:** Editor puede cargar menú existente para editar

**Archivo:** `app/editor/page.tsx`

**Agregar botón:** "Cargar menú existente"

```typescript
const loadExistingMenu = async (restaurantId: string) => {
  const response = await fetch(`/api/menu/${restaurantId}`);
  const menuData = await response.json();
  
  // Poblar estado del editor
  setCategories(menuData.categories);
  setTheme({
    primaryColor: menuData.primaryColor,
    // ... resto
  });
};
```

**Flujos:**
1. **Usuario nuevo:** Editor vacío, crea desde cero
2. **Usuario existente:** Editor carga datos de su menú

**Criterio de éxito:**
- ✅ Editor puede cargar menú de Prisma
- ✅ Mantiene compatibilidad con flow de scanner
- ✅ Guarda cambios vía API PUT

---

## 📸 **FASE 5: DECISIÓN SOBRE SCANNER** (1 día)
**Objetivo:** Scanner funcional o eliminado

### ⚠️ **TAREA 5.1: Evaluar precisión del Scanner actual**
**Prioridad:** 🟡 MEDIA  
**Tiempo:** 2 horas  
**Dependencias:** Ninguna (paralelo a otras tareas)

**Testing exhaustivo:**

1. **Subir 10 imágenes de cartas reales:**
   - Carta impresa profesional
   - Carta escrita a mano
   - Carta en pizarra
   - Menú digital screenshot
   - Carta con fotos

2. **Medir precisión:**
   - ¿Detecta categorías correctamente?
   - ¿Extrae precios con formato correcto?
   - ¿Identifica nombres de platos completos?
   - ¿Maneja múltiples columnas?

3. **Registrar resultados:**
   ```
   Precisión promedio: X%
   Casos exitosos: Y/10
   Casos fallidos: Z/10
   Errores comunes: [lista]
   ```

**Criterio de decisión:**
- ✅ Si precisión > 70% → **MANTENER como asistente**
- ❌ Si precisión < 50% → **ELIMINAR o hacer opcional**
- ⚠️ Si 50-70% → **Mejorar o integrar GPT Vision**

---

### 🟢 **TAREA 5.2A: OPCIÓN A - Mejorar Scanner (si se mantiene)**
**Prioridad:** 🟢 BAJA  
**Tiempo:** 1 día  
**Dependencias:** Tarea 5.1 (si precisión > 50%)

**Mejoras posibles:**

#### **Opción Simple: Pre-procesamiento de imagen**
```typescript
// Mejorar contraste, recortar bordes, etc
const processedImage = await preprocessImage(rawImage);
const text = await Tesseract.recognize(processedImage);
```

#### **Opción Avanzada: Integrar GPT-4 Vision**
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [{
    role: "user",
    content: [
      { 
        type: "text", 
        text: "Extrae el menú de esta carta en formato JSON con categorías, items, precios y descripciones"
      },
      { 
        type: "image_url", 
        image_url: { url: imageBase64 }
      }
    ]
  }]
});

const menuData = JSON.parse(response.choices[0].message.content);
```

**Costo estimado:**
- GPT-4 Vision: ~$0.01 - $0.03 por imagen
- Viable para low-volume (< 1000 scans/mes)

**Criterio de éxito:**
- ✅ Precisión mejora a > 85%
- ✅ UX clara: "Esto es una sugerencia, verifica en el editor"

---

### 🟢 **TAREA 5.2B: OPCIÓN B - Hacer Scanner opcional (recomendado)**
**Prioridad:** 🟢 BAJA  
**Tiempo:** 2 horas  
**Dependencias:** Tarea 5.1

**Cambios en el flujo:**

```
/qr-shop
   ↓
/setup-comercio
   ↓
[BIFURCACIÓN]
   ├─► /scanner (opcional) → "Acelera tu carga con OCR"
   │      ↓
   └─► /editor (siempre) → "O crea tu menú desde cero"
```

**Modificar página `/scanner`:**
- Agregar botón grande: **"Saltar y crear desde cero"**
- Texto: "El scanner es una herramienta para acelerar, pero no es obligatorio"

**Modificar navegación:**
```typescript
// En cualquier página antes del editor
<button onClick={() => router.push('/editor')}>
  Crear menú manualmente
</button>

<button onClick={() => router.push('/scanner')}>
  Digitalizar carta con OCR (beta)
</button>
```

**Criterio de éxito:**
- ✅ Scanner es completamente opcional
- ✅ UX clara: dos caminos igual de válidos
- ✅ Editor funciona con o sin scanner

---

### 🟢 **TAREA 5.2C: OPCIÓN C - Eliminar Scanner**
**Prioridad:** 🟢 BAJA  
**Tiempo:** 1 hora  
**Dependencias:** Tarea 5.1 (si precisión < 50%)

**Si el scanner no aporta valor:**

1. Mover a `_deprecated/scanner`
2. Eliminar del flujo wizard
3. Actualizar documentación
4. Commit: "Remove OCR scanner (low precision)"

**Ventajas:**
- Menos complejidad
- Menos confusión para usuarios
- Enfoque en editor manual (más control)

**Criterio de éxito:**
- ✅ Scanner eliminado sin romper flujo
- ✅ Documentación actualizada

---

## 🧪 **FASE 6: TESTING Y PRODUCCIÓN** (2-3 días)
**Objetivo:** App funcional en producción

### 🟡 **TAREA 6.1: Testing multi-tenant**
**Prioridad:** 🟡 ALTA  
**Tiempo:** 4 horas

**Crear 3 restaurantes de prueba:**
1. Esquina Pompeya (ya existe)
2. La Pizzería Demo
3. Sushi Express Demo

**Verificar:**
- ✅ Cada uno tiene su propia URL
- ✅ Datos no se mezclan
- ✅ QRs diferentes
- ✅ Temas independientes

---

### 🟡 **TAREA 6.2: Migrar a PostgreSQL (producción)**
**Prioridad:** 🟡 ALTA  
**Tiempo:** 2 horas

```bash
# Crear DB en Vercel/Supabase/Railway
# Actualizar .env.production
DATABASE_URL="postgresql://..."

# Migrar schema
npx prisma db push --preview-feature
npx prisma generate
```

---

### 🟡 **TAREA 6.3: Deploy a Vercel**
**Prioridad:** 🟡 ALTA  
**Tiempo:** 1 hora

```bash
vercel --prod
```

**Verificar:**
- ✅ Build exitoso
- ✅ URLs funcionan
- ✅ APIs responden
- ✅ DB conecta correctamente

---

## 📊 CRONOGRAMA ESTIMADO

| Fase | Duración | Dependencias |
|------|----------|--------------|
| **Fase 1: Limpieza** | 1 día | Ninguna |
| **Fase 2: Schema Prisma** | 1 día | Fase 1 |
| **Fase 3: Backend APIs** | 2-3 días | Fase 2 |
| **Fase 4: Frontend conectado** | 2 días | Fase 3 |
| **Fase 5: Scanner decisión** | 1 día | Paralelo |
| **Fase 6: Testing y prod** | 2-3 días | Fases 1-4 |
| **TOTAL** | **9-11 días** | - |

---

## 🎯 QUICK WINS (Hacer primero para resultados rápidos)

### **Día 1:**
1. ✅ Limpieza de archivos (30 min)
2. ✅ Arreglar schema Prisma (1 hora)
3. ✅ Seed funcional (1 hora)
4. ✅ API GET /menu/[id] (2 horas)

**Resultado:** Datos reales en BD, API funcional para leer

### **Día 2:**
5. ✅ API POST /menu (3 horas)
6. ✅ Conectar /generar-qr (2 horas)

**Resultado:** Flujo completo funciona end-to-end

### **Día 3:**
7. ✅ Migrar /menu/[id] a API (1 hora)
8. ✅ Testing multi-tenant (2 horas)
9. ✅ Deploy a Vercel (1 hora)

**Resultado:** App en producción, multi-tenant funcional

---

## ✅ CHECKLIST DE PROGRESO

### **Fase 1: Limpieza** ⏳
- [ ] Ejecutar cleanup-deprecated.ps1
- [ ] Mover docs a carpeta Docs/
- [ ] Verificar funcionamiento
- [ ] Commit de limpieza

### **Fase 2: Schema Prisma** ⏳
- [ ] Agregar campo `phone` a User
- [ ] Agregar índices de performance
- [ ] Crear modelo AuditLog (opcional)
- [ ] Crear modelo Image (opcional)
- [ ] Aplicar migraciones
- [ ] Arreglar seed script
- [ ] Ejecutar seed exitosamente

### **Fase 3: Backend** ⏳
- [ ] GET /api/menu/[restaurantId]
- [ ] POST /api/menu
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] Middleware de autenticación

### **Fase 4: Frontend** ⏳
- [ ] /menu/[id] usa API
- [ ] /generar-qr usa API POST
- [ ] /editor carga datos de Prisma
- [ ] Eliminar dependencia de localStorage

### **Fase 5: Scanner** ⏳
- [ ] Evaluar precisión actual
- [ ] DECISIÓN: Mejorar / Opcional / Eliminar
- [ ] Implementar opción elegida

### **Fase 6: Producción** ⏳
- [ ] Testing multi-tenant (3 restaurantes)
- [ ] Migrar a PostgreSQL
- [ ] Deploy a Vercel
- [ ] Verificación end-to-end

---

## 🚨 BLOQUEADORES POTENCIALES

| Bloqueador | Probabilidad | Impacto | Mitigación |
|------------|-------------|---------|------------|
| **Errores en migraciones Prisma** | Media | Alto | Backup de dev.db antes de migrar |
| **APIs no autentican correctamente** | Media | Medio | Implementar JWT desde el inicio |
| **Scanner muy impreciso** | Alta | Bajo | Hacerlo opcional desde el día 1 |
| **Performance en producción** | Baja | Alto | Agregar índices en schema |
| **Vercel build falla** | Baja | Alto | Testing local de build antes |

---

## 💡 RECOMENDACIONES FINALES

### **Prioriza en este orden:**
1. 🔴 **Backend funcional** - Sin esto, no hay persistencia
2. 🔴 **Schema Prisma correcto** - Fundación de todo
3. 🟡 **Frontend conectado** - Usuarios ven datos reales
4. 🟢 **Scanner** - Nice to have, no crítico

### **Decisión sobre Scanner:**
**Recomendación:** **OPCIÓN B - Hacer opcional**

**Razones:**
- ✅ Bajo costo de implementación
- ✅ Diferenciador comercial (aunque imperfecto)
- ✅ No bloquea a usuarios que prefieren manual
- ✅ Se puede mejorar después

**Flujo sugerido:**
```
"Tienes dos opciones para crear tu menú:
 
 [🚀 RÁPIDO] Scanner OCR (beta)
 → Sube foto de tu carta, nosotros extraemos los datos
 → Precisión: ~70% - siempre puedes editar después
 
 [✏️ MANUAL] Editor desde cero
 → Control total, cero errores
 → Toma un poco más de tiempo"
```

---

## 📞 SIGUIENTE PASO INMEDIATO

**¿Qué hacer AHORA?**

```bash
# 1. Ejecutar limpieza
cd Z:\VSCode\QR-Suite\MenuQR
.\cleanup-deprecated.ps1

# 2. Abrir Prisma Schema
code prisma/schema.prisma

# 3. Agregar campo phone y aplicar
npx prisma db push
npx prisma generate

# 4. Arreglar y ejecutar seed
code scripts/seed-esquina-pompeya.ts
npx tsx scripts/seed-esquina-pompeya.ts

# 5. Verificar en Prisma Studio
npx prisma studio
```

**Tiempo estimado para esto:** 1-2 horas  
**Resultado:** Base de datos funcional con datos reales

---

*Plan de acción creado: Octubre 2, 2025*  
*Duración total estimada: 9-11 días*  
*Prioridad: Alta - Ejecutar en orden*
