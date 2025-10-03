# 🏗️ ESTRATEGIA MULTI-TENANT MenuQR
**Análisis completo: Estado actual vs Arquitectura objetivo**

---

## 📊 ESTADO ACTUAL (Lo que TENEMOS)

### ✅ **Database Schema (Prisma) - BIEN ESTRUCTURADO**
```prisma
User (Dueño del restaurante)
├── restaurantId: String @unique  ← Ya tenemos IDU!
├── restaurantName: String
├── Configuración completa (WhatsApp, plan, rol)
└── Relación: menus[] (One-to-Many)

Menu (Menú digital del restaurante)
├── restaurantId: String @unique  ← Vinculado al User
├── restaurantName: String
├── Theme completo (colores, fuentes, logo)
├── Configuración (precios, imágenes, moneda)
└── Relations: categories[], items[]

Category → MenuItem (Estructura del menú)
```

**✅ ESTO ESTÁ PERFECTO** - Ya tiene la estructura multi-tenant correcta.

### ⚠️ **Flujo de Usuario Actual - MIXTO (localStorage + API futura)**

#### **Wizard de Onboarding:**
```
1. /qr-shop (Landing comercial)
   └→ Elige paquete
   
2. /setup (Configuración inicial) [PÁGINA FALTA]
   ├─ Nombre del comercio
   ├─ Dirección, teléfono
   ├─ Tipo de negocio
   └─ Guarda en localStorage('setup-comercio-data')
   
3. /scanner (OCR de carta física) [FUNCIONAL PERO IMPRECISO]
   └─ Extrae texto → "Platos detectados"
   └─ Guarda en localStorage('scanned-menu-data')
   
4. /editor (Editor de productos) [FUNCIONAL]
   ├─ Edita categorías y productos
   ├─ Carga datos del scanner o desde cero
   └─ Guarda en localStorage('editor-menu-data')
   
5. /personalizacion (Tema visual) [PÁGINA FALTA]
   ├─ Colores, logo, estilos
   └─ Guarda en localStorage('theme-data')
   
6. /generar-qr (Generación QR + Guardado final) [PÁGINA FALTA]
   ├─ Genera QR con URL única
   ├─ **AQUÍ SE GUARDA TODO EN PRISMA**
   └─ Crea User + Menu + Categories + MenuItems
   
7. /carta-menu (Vista final cliente) [FUNCIONAL - USA LOCALSTORAGE]
   └─ Muestra el menú al público
   └─ **DEBE CAMBIAR A:** /menu/[restaurantId]
```

### ✅ **Rutas Dinámicas - YA EXISTE**
```typescript
// app/menu/[restaurantId]/page.tsx
// ✅ YA está implementada
// ❌ PERO no se está usando en el flujo wizard
```

---

## 🎯 ARQUITECTURA OBJETIVO (Lo que NECESITAMOS)

### **Flujo Multi-Tenant Completo:**

```
ONBOARDING (Primera vez):
1. /qr-shop → Cliente elige plan
2. /setup → Crea cuenta (email, contraseña) + Info del comercio
3. [OPCIONAL] /scanner → OCR de carta (solo como asistente)
4. /editor → Edita menú (con o sin OCR)
5. /personalizacion → Personaliza tema
6. /generar-qr → GUARDA TODO EN BD + Genera QR
   └─ Crea:
      - User (con restaurantId único)
      - Menu (vinculado al User)
      - Categories + MenuItems
   └─ Genera QR → https://menuqr.com/menu/[restaurantId]
   
7. **REDIRECCIÓN FINAL:**
   → /menu/[restaurantId] (URL pública)
   → /admin/[restaurantId] (Panel de control del dueño)

ACCESO POSTERIOR (Cliente regresa):
- Login → /login
- Panel Admin → /admin/[restaurantId]
  ├─ Editar menú
  ├─ Ver estadísticas
  ├─ Configurar WhatsApp
  └─ Regenerar QR
```

---

## 🔧 CAMBIOS NECESARIOS

### **1. Backend - API Routes (FALTAN)**

#### **`app/api/auth/register/route.ts`** - Crear cuenta
```typescript
POST /api/auth/register
Body: {
  email, password, 
  restaurantName, phone, address
}
→ Crea User con restaurantId único (cuid())
→ Devuelve JWT token + restaurantId
```

#### **`app/api/auth/login/route.ts`** - Login
```typescript
POST /api/auth/login
Body: { email, password }
→ Valida credenciales
→ Devuelve JWT + restaurantId
```

#### **`app/api/menu/route.ts`** - Guardar menú completo
```typescript
POST /api/menu
Headers: { Authorization: Bearer TOKEN }
Body: {
  restaurantId,
  categories: [...],
  theme: { primaryColor, logo, ... }
}
→ Crea/Actualiza Menu + Categories + MenuItems
→ Devuelve URL pública: /menu/[restaurantId]
```

#### **`app/api/menu/[restaurantId]/route.ts`** - Leer menú público
```typescript
GET /api/menu/[restaurantId]
→ Busca Menu por restaurantId
→ Incluye: categories + items
→ Para renderizar en /menu/[restaurantId]
```

---

### **2. Frontend - Páginas que FALTAN**

#### **✅ YA EXISTEN:**
- `/qr-shop` - Landing comercial
- `/scanner` - OCR (necesita mejoras)
- `/editor` - Editor de menú
- `/carta-menu` - Vista final (MOVER a `/menu/[restaurantId]`)

#### **❌ FALTAN (CRÍTICAS):**
- **`/setup`** - Formulario de registro + info del comercio
- **`/personalizacion`** - Selector de tema (colores, logo)
- **`/generar-qr`** - Página final que:
  1. Llama a `POST /api/menu` (guarda en Prisma)
  2. Genera QR con URL única
  3. Muestra QR + URL para compartir
  4. Ofrece descarga del QR (PDF/PNG)
  
- **`/login`** - Login de usuarios registrados
- **`/admin/[restaurantId]`** - Panel de control (reutilizar /editor)

---

### **3. Migración de localStorage → Prisma**

#### **Actual (localStorage):**
```javascript
localStorage.setItem('setup-comercio-data', JSON.stringify(data));
localStorage.setItem('editor-menu-data', JSON.stringify(menu));
localStorage.setItem('theme-data', JSON.stringify(theme));
```

#### **Nuevo (Prisma via API):**
```javascript
// En /generar-qr (última página del wizard)
const response = await fetch('/api/menu', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    restaurantId: user.restaurantId,
    restaurantName: setupData.nombreComercio,
    contactPhone: setupData.telefono,
    contactAddress: setupData.direccion,
    categories: editorData.categories,
    theme: themeData,
    // ... resto de datos del wizard
  })
});

const { menuUrl } = await response.json();
// menuUrl = "https://menuqr.com/menu/cl5xyz123"
```

---

## 🤖 SCANNER/OCR - Análisis y Recomendación

### **Estado Actual:**
- ✅ **Funciona**: Detecta texto de imágenes
- ❌ **Impreciso**: 
  - No distingue categorías vs productos
  - No extrae precios correctamente
  - No identifica estructura jerárquica
  - Alta tasa de "falsos positivos"

### **Problema Técnico:**
```javascript
// Actual: OCR simple (Tesseract.js)
const text = await Tesseract.recognize(image);
// → "Milanesa $8000 Pollo Empanadas..."
// → No tiene contexto ni estructura
```

### **Soluciones Posibles:**

#### **Opción 1: OCR + IA (GPT Vision) [RECOMENDADA]**
```javascript
// Enviar imagen a GPT-4 Vision
const response = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [{
    role: "user",
    content: [
      { type: "text", text: "Extrae el menú de esta carta en formato JSON..." },
      { type: "image_url", image_url: imageBase64 }
    ]
  }]
});

// Respuesta estructurada:
{
  "categories": [
    {
      "name": "PLATOS DEL DIA",
      "items": [
        { "name": "Milanesa c/puré", "price": 8000 },
        { "name": "Pollo grillado", "price": 7500 }
      ]
    }
  ]
}
```

**✅ Ventajas:**
- 95%+ precisión
- Extrae estructura jerárquica
- Identifica precios correctamente
- Maneja múltiples formatos de carta

**❌ Desventajas:**
- Costo: ~$0.01 por imagen (aceptable)
- Requiere API Key de OpenAI
- Dependencia externa

#### **Opción 2: OCR como "Asistente" [TU SUGERENCIA - EXCELENTE]**
```
Flujo híbrido:
1. Usuario sube foto de su carta física
2. OCR extrae texto (sin estructura perfecta)
3. Se muestra en el Editor como "sugerencias"
4. Usuario edita manualmente (arrastra, corrige, organiza)
5. Guarda versión final

Ventajas:
✅ Ahorra tiempo (no empieza de cero)
✅ Sin costo de API externa
✅ El usuario valida la precisión
✅ Funciona como "punto de partida"
```

### **💡 RECOMENDACIÓN FINAL:**

**IMPLEMENTAR OPCIÓN 2 (Scanner como asistente opcional)**

**Razones:**
1. **Menor fricción**: El usuario SIEMPRE puede crear menú desde cero si el OCR falla
2. **Sin dependencias**: No requiere API keys caras ni dependencias externas
3. **Valor percibido**: "Digitaliza tu carta en 5 minutos" → cumple aunque sea 70% preciso
4. **Validación humana**: El editor permite corregir errores fácilmente
5. **Diferenciador comercial**: Pocos competidores ofrecen OCR (aunque sea básico)

**Implementación sugerida:**
```
/scanner → [OPCIONAL] Botón "Saltar y crear desde cero"
  ├─ Sube foto → OCR extrae texto
  ├─ Muestra preview de "platos detectados"
  └─ Botón "Usar estos datos" → va a /editor
  
/editor → Recibe datos del scanner COMO SUGERENCIAS
  ├─ Permite editar TODO
  ├─ Agregar/eliminar categorías
  └─ El usuario tiene control total
```

---

## 📋 ROADMAP DE IMPLEMENTACIÓN

### **FASE 1: Backend Foundation (Semana 1-2)**
- [ ] API Routes de autenticación (`/api/auth/*`)
- [ ] API Routes de menús (`/api/menu/*`)
- [ ] Middleware de JWT authentication
- [ ] Migración de datos del wizard → Prisma

### **FASE 2: Flujo Wizard Completo (Semana 2-3)**
- [ ] `/setup` - Registro + info del comercio
- [ ] `/personalizacion` - Selector de tema
- [ ] `/generar-qr` - Guardado final + QR generation
- [ ] Conectar localStorage → APIs

### **FASE 3: Rutas Dinámicas (Semana 3-4)**
- [ ] Migrar `/carta-menu` → `/menu/[restaurantId]`
- [ ] Crear `/admin/[restaurantId]` (panel del dueño)
- [ ] Sistema de login persistente (JWT)

### **FASE 4: Scanner Mejorado (Semana 4-5)**
- [ ] Mejorar UI del scanner (drag & drop)
- [ ] Implementar preview de datos extraídos
- [ ] Hacer OPCIONAL (botón "Saltar OCR")
- [ ] Integrar con Editor como "punto de partida"

### **FASE 5: Producción (Semana 5-6)**
- [ ] Testing multi-tenant (varios restaurantes)
- [ ] Deploy a Vercel con DB production (PostgreSQL)
- [ ] Configuración de dominios custom
- [ ] Monitoreo y analytics

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### **Para agregar un NUEVO restaurante (Manual - Desarrollo):**
```bash
# 1. Crear usuario en Prisma Studio o script
npx prisma studio

# 2. En tabla User:
restaurantId: "nuevo-resto-123" (único!)
email: "resto@ejemplo.com"
password: "hashed_password"
restaurantName: "El Nuevo Resto"

# 3. Crear Menu vinculado:
restaurantId: "nuevo-resto-123"
ownerId: [ID del User creado arriba]
categories: crear manualmente

# 4. Acceder vía:
https://tu-dominio.vercel.app/menu/nuevo-resto-123
```

### **Para producción (Automático - Wizard):**
```
Usuario completa wizard → Click "Generar QR"
→ POST /api/menu (guarda en Prisma)
→ Responde con: { 
    qrUrl: "/menu/cl5xyz123",
    qrImage: "data:image/png;base64..." 
  }
→ Usuario descarga QR + comparte URL
```

---

## 📞 RESUMEN EJECUTIVO

### **¿Qué tenemos?**
✅ Database schema perfecto (multi-tenant ready)
✅ Editor de menú funcional
✅ Scanner OCR básico (funciona pero impreciso)
✅ Vista pública de carta (`/carta-menu`)
✅ Ruta dinámica `/menu/[restaurantId]` (existe pero no se usa)

### **¿Qué falta?**
❌ API Routes (autenticación + CRUD de menús)
❌ Páginas del wizard (`/setup`, `/personalizacion`, `/generar-qr`)
❌ Migración localStorage → Prisma
❌ Sistema de login persistente
❌ Panel de admin para cada restaurante

### **¿Cuál es el próximo paso crítico?**
🎯 **Crear `/setup` + `/generar-qr`** para cerrar el flujo wizard
🎯 **Implementar `POST /api/menu`** para guardar en Prisma
🎯 **Migrar `/carta-menu` → `/menu/[restaurantId]`** con lectura desde API

### **¿Qué hacemos con el Scanner/OCR?**
💡 **Mantenerlo como asistente opcional:**
- Útil para acelerar carga inicial
- Usuario siempre puede crear desde cero
- Editor permite corregir imprecisiones
- Diferenciador comercial ("Digitaliza tu carta en minutos")
- No requiere inversión en APIs externas (por ahora)
- Si crece el negocio → migrar a GPT Vision para 95% precisión

---

## 🚀 ARQUITECTURA FINAL

```
Cliente busca QR en mesa:
└─ Escanea QR → https://menuqr.com/menu/resto-abc123
   └─ GET /api/menu/resto-abc123
      └─ Prisma.menu.findUnique({ restaurantId: 'resto-abc123' })
         └─ Renderiza carta digital personalizada

Dueño administra su menú:
└─ Login → /login
   └─ JWT authentication
      └─ Dashboard → /admin/resto-abc123
         ├─ Editar productos
         ├─ Ver estadísticas (próximamente)
         ├─ Configurar WhatsApp (ya en schema)
         └─ Regenerar QR
```

---

**Documento creado:** Octubre 2, 2025  
**Proyecto:** MenuQR - Sistema Multi-Tenant  
**Stack:** Next.js 14 + Prisma + SQLite (dev) → PostgreSQL (prod)
