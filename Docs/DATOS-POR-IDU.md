# 📊 Datos Únicos por IDU (ID Único)

Este documento explica qué datos son únicos para cada restaurante (identificado por su `IDU` o `restaurantId`) y dónde se almacenan en la base de datos.

---

## 🔑 Relación IDU → Datos

**IDU** = `restaurantId` (String único de 8 caracteres, ej: `5XJ1J37F`)

El IDU es el identificador principal que vincula todos los datos de un restaurante.

---

## 📋 Datos Únicos por IDU

### 1. **📱 Número de WhatsApp para Pedidos**

**Ubicación en BD:**
- **Tabla:** `users`
- **Campo:** `whatsappPhone` (String, opcional)
- **Relación:** `users.restaurantId = IDU`

**Cómo se usa:**
- Se carga desde la tabla `users` cuando se busca por `restaurantId`
- Si no está configurado, se usa el valor por defecto: `5491165695648`
- También se puede pasar por parámetro URL: `?wa=5491165695648`

**Código de referencia:**
```typescript
// app/carta/[idUnico]/page.tsx línea 67
const [waPhone, setWaPhone] = useState<string>(
  process.env.NEXT_PUBLIC_ORDER_WHATSAPP || '5491165695648'
);
```

**Cómo configurarlo:**
- Actualmente se debe actualizar directamente en la base de datos `users.whatsappPhone`
- O usar la variable de entorno `NEXT_PUBLIC_ORDER_WHATSAPP` (global, no por IDU)

**⚠️ NOTA:** Actualmente el WhatsApp es global por variable de entorno. Para hacerlo por IDU, se debe:
1. Cargar desde `users.whatsappPhone` en la API `/api/menu/[idUnico]`
2. Pasar el valor al frontend en la respuesta

---

### 2. **👥 Nombres de Meseros/Meseras**

**Ubicación en BD:**
- **Tabla:** `menus`
- **Campo:** `waiters` (String JSON, opcional)
- **Relación:** `menus.restaurantId = IDU`
- **Formato:** JSON array como string: `'["Maria", "Lucia", "Carmen"]'`

**Cómo se guarda:**
```typescript
// Se guarda como JSON string en la BD
waiters: JSON.stringify(['Maria', 'Lucia', 'Carmen'])
```

**Cómo se carga:**
```typescript
// app/api/menu/[idUnico]/route.ts líneas 37-53
let waitersArray: string[] = ['Maria', 'Lucia', 'Carmen']; // Por defecto
if (menuAny?.waiters) {
  if (typeof menuAny.waiters === 'string' && menuAny.waiters.trim()) {
    const parsed = JSON.parse(menuAny.waiters);
    if (Array.isArray(parsed) && parsed.length > 0) {
      waitersArray = parsed;
    }
  }
}
```

**Valores por defecto:**
- Si no hay datos: `['Maria', 'Lucia', 'Carmen']`

**Cómo configurarlo:**
- Se puede actualizar directamente en la BD: `menus.waiters = '["Yesica", "Magali"]'`
- O crear un endpoint de API para actualizar (actualmente no existe)

---

### 3. **🏢 Datos del Comercio**

**Ubicación en BD:**
- **Tabla:** `menus` (principal)
- **Tabla:** `users` (complementario)
- **Relación:** `menus.restaurantId = IDU` y `users.restaurantId = IDU`

#### **Datos en `menus` (Tabla principal):**

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `restaurantName` | String | Nombre del restaurante | "Esquina Pompeya" |
| `description` | String? | Descripción del restaurante | "Restaurante tradicional..." |
| `contactPhone` | String? | Teléfono de contacto | "+54 11 4911-6666" |
| `contactEmail` | String? | Email de contacto | "info@esquinapompeya.com" |
| `contactAddress` | String? | Dirección física | "Av. Fernández de la Cruz 1100" |
| `contactWebsite` | String? | Sitio web | "https://esquinapompeya.com" |
| `socialInstagram` | String? | Instagram | "@esquinapompeya" |
| `socialFacebook` | String? | Facebook | "Esquina Pompeya Restaurante" |
| `socialTwitter` | String? | Twitter | "@esquinapompeya" |
| `logoUrl` | String? | URL del logo | "https://..." |
| `logoPublicId` | String? | ID público del logo (Cloudinary) | "logo_5XJ1J37F" |

#### **Datos en `users` (Tabla complementaria):**

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `name` | String | Nombre del dueño/admin | "Juan Pérez" |
| `email` | String | Email del usuario | "admin@esquinapompeya.com" |
| `phone` | String? | Teléfono del usuario | "+54 11 1234-5678" |
| `address` | String? | Dirección del usuario | "Av. Corrientes 1234" |
| `restaurantName` | String | Nombre del restaurante (duplicado) | "Esquina Pompeya" |

**Cómo se cargan:**
```typescript
// app/api/menu/[idUnico]/route.ts
const menu = await prisma.menu.findFirst({
  where: { restaurantId: idUnico },
  include: { categories: { include: { items: true } } }
});
```

---

### 4. **⚙️ Configuraciones del Menú**

**Ubicación en BD:**
- **Tabla:** `menus`
- **Relación:** `menus.restaurantId = IDU`

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `allowOrdering` | Boolean | false | Permite hacer pedidos |
| `deliveryEnabled` | Boolean | false | Habilita delivery |
| `deliveryFee` | Float | 0 | Costo de envío |
| `deliveryRadius` | Float? | null | Radio de delivery (km) |
| `deliveryMinOrder` | Float? | null | Pedido mínimo |
| `showPrices` | Boolean | true | Mostrar precios |
| `showImages` | Boolean | true | Mostrar imágenes |
| `showDescriptions` | Boolean | true | Mostrar descripciones |
| `currency` | String | "$" | Moneda |
| `language` | String | "es" | Idioma |

---

### 5. **🎨 Configuración de Tema**

**Ubicación en BD:**
- **Tabla:** `menus`
- **Relación:** `menus.restaurantId = IDU`

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `primaryColor` | String | "#2563eb" | Color primario |
| `secondaryColor` | String | "#64748b" | Color secundario |
| `backgroundColor` | String | "#ffffff" | Color de fondo |
| `textColor` | String | "#1f2937" | Color de texto |
| `fontFamily` | String | "Inter" | Fuente |

---

## 📍 Estructura de la Base de Datos

### **Tabla `users`**
```sql
users
├── id (PK)
├── restaurantId (UNIQUE) ← IDU aquí
├── restaurantName
├── phone
├── address
├── whatsappPhone ← WhatsApp para pedidos
├── whatsappToken
├── whatsappPhoneId
└── whatsappEnabled
```

### **Tabla `menus`**
```sql
menus
├── id (PK)
├── restaurantId (UNIQUE) ← IDU aquí
├── restaurantName
├── contactPhone
├── contactEmail
├── contactAddress
├── contactWebsite
├── socialInstagram
├── socialFacebook
├── socialTwitter
├── logoUrl
├── waiters ← Meseros/meseras (JSON string)
├── allowOrdering
├── deliveryEnabled
├── deliveryFee
└── ... (más configuraciones)
```

---

## 🔍 Cómo Consultar Datos por IDU

### **1. Obtener todos los datos del menú:**
```typescript
GET /api/menu/[idUnico]
```

**Respuesta:**
```json
{
  "success": true,
  "menu": {
    "idUnico": "5XJ1J37F",
    "restaurantName": "Esquina Pompeya",
    "contactPhone": "+54 11 4911-6666",
    "contactAddress": "Av. Fernández de la Cruz 1100",
    "waiters": ["Maria", "Lucia", "Carmen"],
    "allowOrdering": true,
    "categories": [...]
  }
}
```

### **2. Consulta directa en Supabase:**
```sql
-- Obtener datos del menú
SELECT * FROM menus WHERE "restaurantId" = '5XJ1J37F';

-- Obtener datos del usuario
SELECT * FROM users WHERE "restaurantId" = '5XJ1J37F';

-- Obtener meseros
SELECT waiters FROM menus WHERE "restaurantId" = '5XJ1J37F';
```

---

## ⚠️ Problemas Actuales y Mejoras Necesarias

### **1. WhatsApp no está vinculado por IDU**
- **Problema:** Se usa variable de entorno global `NEXT_PUBLIC_ORDER_WHATSAPP`
- **Solución:** Cargar desde `users.whatsappPhone` en la API

### **2. No hay endpoint para actualizar meseros**
- **Problema:** No existe API para editar `menus.waiters`
- **Solución:** Crear endpoint `PUT /api/menu/[idUnico]/waiters`

### **3. No hay endpoint para actualizar datos del comercio**
- **Problema:** No existe API completa para editar datos del comercio
- **Solución:** Crear endpoint `PUT /api/menu/[idUnico]/comercio`

### **4. Datos duplicados entre `users` y `menus`**
- **Problema:** `restaurantName` está en ambas tablas
- **Solución:** Usar solo `menus.restaurantName` como fuente de verdad

---

## 📝 Resumen de Datos por IDU

| Dato | Tabla | Campo | Configurable | Estado |
|------|-------|-------|--------------|--------|
| WhatsApp pedidos | `users` | `whatsappPhone` | ❌ No (solo BD) | ⚠️ Mejorar |
| Meseros/meseras | `menus` | `waiters` | ❌ No (solo BD) | ⚠️ Mejorar |
| Nombre restaurante | `menus` | `restaurantName` | ✅ Sí | ✅ OK |
| Teléfono contacto | `menus` | `contactPhone` | ✅ Sí | ✅ OK |
| Dirección | `menus` | `contactAddress` | ✅ Sí | ✅ OK |
| Email | `menus` | `contactEmail` | ✅ Sí | ✅ OK |
| Redes sociales | `menus` | `socialInstagram`, etc. | ✅ Sí | ✅ OK |
| Logo | `menus` | `logoUrl` | ✅ Sí | ✅ OK |
| Configuraciones | `menus` | `allowOrdering`, etc. | ✅ Sí | ✅ OK |
| Tema | `menus` | `primaryColor`, etc. | ✅ Sí | ✅ OK |

---

## 🚀 Próximos Pasos

1. **Crear endpoint para actualizar WhatsApp por IDU**
2. **Crear endpoint para actualizar meseros**
3. **Mejorar página de configuración para editar todos estos datos**
4. **Unificar fuente de datos (usar solo `menus` para datos del comercio)**

---

**Última actualización:** 2025-01-XX
**Versión del schema:** Prisma schema actual



