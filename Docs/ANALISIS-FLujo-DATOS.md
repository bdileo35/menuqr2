# 🔍 Análisis Exhaustivo: Flujo de Datos y Guardado en BD

**Fecha:** 2025-01-XX  
**Objetivo:** Verificar que TODOS los datos se guarden correctamente en Supabase antes del deploy comercial

---

## 📊 Estado Actual: ¿Qué se Guarda y Qué NO?

### ✅ **LO QUE SÍ SE GUARDA EN BD (Supabase/Prisma)**

#### 1. **Creación Inicial de Comercio**
- **Endpoint:** `POST /api/seed-comercio`
- **Endpoint:** `POST /api/seed-demo`
- **Endpoint:** `POST /api/seed-from-md`
- **Guarda:**
  - ✅ `users` (usuario administrador)
  - ✅ `menus` (datos del menú)
  - ✅ `categories` (categorías)
  - ✅ `menu_items` (platos)

#### 2. **Categorías (CRUD Completo)**
- **Endpoint:** `GET /api/menu/[idUnico]/categories`
- **Endpoint:** `POST /api/menu/[idUnico]/categories` ✅
- **Endpoint:** `PUT /api/menu/[idUnico]/categories` ✅
- **Endpoint:** `DELETE /api/menu/[idUnico]/categories` ✅
- **Estado:** ✅ **FUNCIONA CORRECTAMENTE**

#### 3. **Lectura de Menú**
- **Endpoint:** `GET /api/menu/[idUnico]`
- **Lee:** Menú completo con categorías e items
- **Estado:** ✅ **FUNCIONA CORRECTAMENTE**

---

### ❌ **LO QUE NO SE GUARDA EN BD (Solo localStorage)**

#### 1. **Editor de Menú - Items (Platos)**
- **Ubicación:** `app/editor/[idUnico]/page.tsx`
- **Línea 283:** `// TODO: Implementar guardado en base de datos`
- **Problema:** 
  - Solo guarda en `localStorage.setItem('editor-menu-data')`
  - NO hay API para crear/actualizar/eliminar items individuales
  - Los cambios se pierden al cerrar el navegador o cambiar de dispositivo

**Código actual:**
```typescript
// Línea 328 y 345
localStorage.setItem('editor-menu-data', JSON.stringify(updatedData));
```

**Impacto:** 🔴 **CRÍTICO** - Los comercios no pueden editar sus platos permanentemente

---

#### 2. **Datos del Comercio**
- **Ubicación:** `app/datos-comercio/page.tsx`
- **Línea 105:** `// TODO: Implementar guardado en base de datos`
- **Problema:**
  - Solo simula guardado (línea 109: `await new Promise(resolve => setTimeout(resolve, 1000))`)
  - NO actualiza `menus.contactPhone`, `menus.contactAddress`, etc.
  - NO actualiza `users.whatsappPhone`

**Código actual:**
```typescript
// Línea 105-111
// TODO: Implementar guardado en base de datos
console.log('Guardando datos del comercio:', formData);
// Simular guardado
await new Promise(resolve => setTimeout(resolve, 1000));
alert('✅ Datos del comercio guardados correctamente');
```

**Impacto:** 🔴 **CRÍTICO** - Los comercios no pueden actualizar sus datos

---

#### 3. **Meseros/Meseras**
- **Ubicación:** Se carga desde BD pero NO se puede editar
- **Problema:**
  - Se lee desde `menus.waiters` (JSON string)
  - NO hay endpoint para actualizar
  - NO hay UI para editar

**Impacto:** 🟡 **MEDIO** - Se puede editar manualmente en BD

---

#### 4. **WhatsApp para Pedidos**
- **Ubicación:** `app/carta/[idUnico]/page.tsx` línea 67
- **Problema:**
  - Usa variable de entorno global `NEXT_PUBLIC_ORDER_WHATSAPP`
  - NO se carga desde `users.whatsappPhone`
  - NO se puede configurar por IDU

**Impacto:** 🟡 **MEDIO** - Funciona pero no es por comercio

---

## 🔄 Flujo Actual vs Flujo Ideal

### **Flujo Actual (Con Problemas)**

```
1. Crear Comercio
   └─> POST /api/seed-comercio ✅
       └─> Guarda en BD ✅

2. Editar Menú (Editor)
   └─> Editar items en UI
       └─> Guarda en localStorage ❌
       └─> NO guarda en BD ❌

3. Editar Datos Comercio
   └─> Editar en UI
       └─> Simula guardado ❌
       └─> NO guarda en BD ❌

4. Ver Carta
   └─> GET /api/menu/[idUnico] ✅
       └─> Lee desde BD ✅
       └─> Fusiona con localStorage (solo items nuevos) ⚠️
```

### **Flujo Ideal (Para Comercialización)**

```
1. Crear Comercio
   └─> POST /api/seed-comercio ✅
       └─> Guarda en BD ✅

2. Editar Menú (Editor)
   └─> Editar items en UI
       └─> POST/PUT /api/menu/[idUnico]/items ✅
       └─> Guarda en BD ✅

3. Editar Datos Comercio
   └─> Editar en UI
       └─> PUT /api/menu/[idUnico]/comercio ✅
       └─> Guarda en BD ✅

4. Ver Carta
   └─> GET /api/menu/[idUnico] ✅
       └─> Lee TODO desde BD ✅
       └─> NO necesita localStorage ✅
```

---

## 🎯 Plan de Acción: Antes del Deploy

### **FASE 1: APIs de Guardado (CRÍTICO)** 🔴

#### 1.1. API para Items del Menú
**Crear:** `app/api/menu/[idUnico]/items/route.ts`

**Endpoints necesarios:**
- `POST` - Crear nuevo item
- `PUT` - Actualizar item existente
- `DELETE` - Eliminar item (soft delete: `isAvailable = false`)

**Campos a guardar:**
```typescript
{
  name: string;
  description?: string;
  price: number;
  code?: string;
  categoryId: string;
  imageUrl?: string; // Base64 o URL
  isAvailable: boolean;
  isPopular?: boolean;
  isPromo?: boolean;
}
```

**Prioridad:** 🔴 **ALTA** - Sin esto, el editor no funciona para producción

---

#### 1.2. API para Datos del Comercio
**Crear:** `app/api/menu/[idUnico]/comercio/route.ts`

**Endpoint:** `PUT /api/menu/[idUnico]/comercio`

**Campos a actualizar:**
```typescript
{
  restaurantName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  contactWebsite?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  logoUrl?: string;
  whatsappPhone?: string; // Actualizar en users también
}
```

**Prioridad:** 🔴 **ALTA** - Sin esto, no se pueden actualizar datos

---

#### 1.3. API para Meseros
**Crear:** `app/api/menu/[idUnico]/waiters/route.ts`

**Endpoint:** `PUT /api/menu/[idUnico]/waiters`

**Body:**
```typescript
{
  waiters: string[]; // ["Maria", "Lucia", "Carmen"]
}
```

**Prioridad:** 🟡 **MEDIA** - Puede esperar pero es útil

---

### **FASE 2: Actualizar Frontend** 🔴

#### 2.1. Editor de Menú
**Archivo:** `app/editor/[idUnico]/page.tsx`

**Cambios:**
- Reemplazar `localStorage.setItem` por llamadas a API
- Línea 283: Implementar `handleSaveItem` con API
- Línea 328: Llamar a `POST /api/menu/[idUnico]/items`
- Línea 345: Llamar a `PUT /api/menu/[idUnico]/items/[itemId]`

**Prioridad:** 🔴 **ALTA**

---

#### 2.2. Página de Datos del Comercio
**Archivo:** `app/datos-comercio/page.tsx`

**Cambios:**
- Línea 105: Implementar `handleSave` con API
- Llamar a `PUT /api/menu/[idUnico]/comercio`

**Prioridad:** 🔴 **ALTA**

---

#### 2.3. WhatsApp por IDU
**Archivo:** `app/carta/[idUnico]/page.tsx`

**Cambios:**
- Cargar `whatsappPhone` desde `users.whatsappPhone` en la API
- Pasar en la respuesta de `GET /api/menu/[idUnico]`

**Prioridad:** 🟡 **MEDIA**

---

### **FASE 3: Testing y Validación** 🟡

#### 3.1. Probar Flujo Completo
1. Crear comercio nuevo
2. Editar items en editor
3. Verificar que se guarden en BD
4. Recargar página
5. Verificar que los cambios persistan

#### 3.2. Probar Multi-tenant
1. Crear 2 comercios diferentes
2. Editar items de cada uno
3. Verificar que no se mezclen datos

---

## 📋 Checklist Pre-Deploy

### **Datos que DEBEN guardarse en BD:**

- [x] Creación inicial de comercio
- [x] Categorías (CRUD completo)
- [ ] **Items del menú (CRUD completo)** ❌
- [ ] **Datos del comercio (actualización)** ❌
- [ ] **Meseros/meseras (actualización)** ⚠️
- [ ] **WhatsApp por IDU** ⚠️
- [ ] Configuraciones del menú (allowOrdering, etc.)
- [ ] Tema/colores del menú

### **APIs que FALTAN:**

- [ ] `POST /api/menu/[idUnico]/items` - Crear item
- [ ] `PUT /api/menu/[idUnico]/items/[itemId]` - Actualizar item
- [ ] `DELETE /api/menu/[idUnico]/items/[itemId]` - Eliminar item
- [ ] `PUT /api/menu/[idUnico]/comercio` - Actualizar datos comercio
- [ ] `PUT /api/menu/[idUnico]/waiters` - Actualizar meseros
- [ ] `PUT /api/menu/[idUnico]/config` - Actualizar configuraciones

---

## 🚨 Riesgos si NO se Arregla Antes del Deploy

1. **Pérdida de Datos:** Los comercios editarán sus menús y se perderán al cerrar el navegador
2. **No Multi-dispositivo:** Un comercio no puede editar desde otro dispositivo
3. **No Multi-usuario:** Varios usuarios no pueden colaborar
4. **Escalabilidad:** localStorage no escala para producción
5. **Sincronización:** Datos en localStorage pueden estar desactualizados

---

## 💡 Recomendación Final

**ANTES de hacer deploy a Vercel/Supabase:**

1. ✅ Implementar APIs de guardado (FASE 1)
2. ✅ Actualizar frontend para usar APIs (FASE 2)
3. ✅ Probar flujo completo (FASE 3)
4. ✅ Hacer deploy

**Los detalles visuales pueden esperar**, pero **los datos DEBEN guardarse correctamente** antes de comercializar.

---

## 📝 Notas Técnicas

### **Estructura de BD Actual:**
```
users (1 por comercio)
  └─ restaurantId (IDU)
  └─ whatsappPhone

menus (1 por comercio)
  └─ restaurantId (IDU)
  └─ contactPhone, contactAddress, etc.
  └─ waiters (JSON string)

categories (N por comercio)
  └─ menuId

menu_items (N por comercio)
  └─ menuId
  └─ categoryId
```

### **Relaciones:**
- `users.restaurantId` = IDU único
- `menus.restaurantId` = IDU único
- `categories.menuId` → `menus.id`
- `menu_items.menuId` → `menus.id`
- `menu_items.categoryId` → `categories.id`

---

**Última actualización:** 2025-01-XX  
**Estado:** 🔴 **REQUIERE ACCIÓN INMEDIATA**

