# 🚀 Flujo de Onboarding de Comercio - MenuQR

Este documento describe el flujo completo desde la venta hasta que el comercio tiene su QR funcional.

---

## 📊 Diagrama de Flujo

```
1. VENTA
   ↓
2. GENERACIÓN IDU
   ↓
3. ACCESO AL EDITOR
   ↓
4. CARGA DATOS COMERCIO
   ↓
5. QR FUNCIONAL ✅
   ↓
6. CARGA CATEGORÍAS/PLATOS (opcional)
```

---

## 🔄 Proceso Detallado

### 1️⃣ **VENTA** 💰

**Acción**: Cliente compra MenuQR

**Datos necesarios**:
- Email del cliente
- Nombre del comercio (opcional en este paso)
- Método de pago

**Resultado**: Se registra la venta en el sistema

---

### 2️⃣ **GENERACIÓN IDU** 🆔

**Acción**: Sistema genera un ID Único (IDU) de 8 caracteres

**Proceso**:
```typescript
// Ejemplo de generación
const idUnico = generarIDUUnico(); // Ej: "5XJ1J39E"
```

**Características**:
- 8 caracteres alfanuméricos
- Único en la base de datos
- No se puede cambiar después de la creación

**Almacenamiento**:
- Se crea registro en tabla `users` con `restaurantId = idUnico`
- Se crea registro en tabla `menus` con `restaurantId = idUnico`

**Resultado**: Cliente recibe su IDU único

---

### 3️⃣ **ACCESO AL EDITOR** 🔓

**URL**: `https://menuqrep.vercel.app/editor/[idUnico]`

**Ejemplo**: `https://menuqrep.vercel.app/editor/5XJ1J39E`

**Seguridad** (por ahora):
- ⚠️ **SIN AUTENTICACIÓN** - Cualquiera con el IDU puede acceder
- ✅ **FUTURO**: Agregar login con email/password o token

**Acciones disponibles**:
- Ver menú (vacío inicialmente)
- Editar datos del comercio
- Agregar categorías y platos
- Ver opciones de QR

---

### 4️⃣ **CARGA DATOS DEL COMERCIO** 📝

**URL**: `https://menuqrep.vercel.app/datos-comercio/[idUnico]`

**Datos que se pueden cargar**:
- ✅ Nombre del comercio (`restaurantName`)
- ✅ Teléfono de contacto (`contactPhone`)
- ✅ Dirección (`contactAddress`)
- ✅ Email de contacto (`contactEmail`)
- ✅ Instagram (`socialInstagram`)
- ✅ Facebook (`socialFacebook`)
- ✅ Logo (`logoUrl`)
- ✅ WhatsApp para pedidos (`whatsappPhone`)

**Persistencia**:
- Se guarda en tabla `menus` (datos del comercio)
- Se guarda en tabla `users` (whatsappPhone)

**Resultado**: Comercio tiene sus datos básicos configurados

---

### 5️⃣ **QR FUNCIONAL** ✅

**URL del QR**: `https://menuqrep.vercel.app/carta/[idUnico]`

**Ejemplo**: `https://menuqrep.vercel.app/carta/5XJ1J39E`

**Estado**:
- ✅ QR ya funciona y muestra la carta
- ⚠️ Muestra "Menú en construcción" si no hay categorías/platos
- ✅ Muestra logo del comercio (si se cargó)
- ✅ Muestra datos del comercio (nombre, dirección, teléfono)

**Generación del QR**:
- Se puede generar desde: `/opciones-qr/[idUnico]`
- URL del QR: `https://menuqrep.vercel.app/carta/[idUnico]`
- Formato: Código QR estándar (se puede escanear con cualquier lector)

**Resultado**: Cliente ya puede usar su QR, aunque el menú esté vacío

---

### 6️⃣ **CARGA CATEGORÍAS/PLATOS** (Opcional) 🍽️

**Opción A: Manual desde el Editor**
- URL: `/editor/[idUnico]`
- Agregar categorías y platos uno por uno
- Ideal para menús pequeños o ajustes

**Opción B: Desde Archivo .MD (Recomendado para menús grandes)**
- Crear archivo: `Docs/Menu_[Nombre_Comercio].md`
- Usar formato unificado (ver `PLANTILLA-MENU-UNIFICADA.md`)
- Cargar mediante API: `POST /api/seed-from-md` (con `idUnico`)

**Opción C: Con IA Externa**
- Cliente puede usar IA (ChatGPT, Claude, etc.) para generar el .md
- Formato: Usar la plantilla unificada
- Luego cargar el .md mediante la API

**Resultado**: Menú completo con categorías y platos

---

## 📋 Checklist de Onboarding

### ✅ Pasos Mínimos (QR Funcional)
- [ ] Cliente recibe IDU único
- [ ] Cliente accede a `/editor/[idUnico]`
- [ ] Cliente carga datos del comercio en `/datos-comercio/[idUnico]`
- [ ] Cliente genera QR desde `/opciones-qr/[idUnico]`
- [ ] ✅ **QR YA FUNCIONAL** (aunque el menú esté vacío)

### 📝 Pasos Opcionales (Menú Completo)
- [ ] Cliente carga categorías y platos manualmente
- [ ] O: Cliente genera .md con IA y lo carga
- [ ] O: Cliente usa API para cargar desde .md

---

## 🔧 APIs Disponibles

### Crear Comercio (Backend)
```typescript
POST /api/seed-comercio
Body: {
  email: string,
  nombreComercio: string,
  telefono: string,
  direccion: string,
  // ... otros datos
}
```

### Cargar Menú desde .MD
```typescript
POST /api/seed-from-md
Body: {
  idUnico: string,
  archivoMD: string // contenido del .md
}
```

### Actualizar Datos del Comercio
```typescript
PUT /api/menu/[idUnico]/comercio
Body: {
  restaurantName: string,
  contactPhone: string,
  contactAddress: string,
  // ... otros datos
}
```

### Obtener Menú
```typescript
GET /api/menu/[idUnico]
Response: {
  success: true,
  menu: {
    restaurantName: string,
    categories: [...],
    // ... otros datos
  }
}
```

---

## 🎯 Casos de Uso

### Caso 1: Cliente con Menú Pequeño
1. Recibe IDU
2. Accede a `/editor/[idUnico]`
3. Carga datos del comercio
4. Agrega categorías/platos manualmente
5. Genera QR
6. ✅ Listo

### Caso 2: Cliente con Menú Grande
1. Recibe IDU
2. Accede a `/editor/[idUnico]`
3. Carga datos del comercio
4. Genera .md con IA (usando plantilla)
5. Carga .md mediante API
6. Genera QR
7. ✅ Listo

### Caso 3: Cliente que Solo Quiere QR Básico
1. Recibe IDU
2. Accede a `/editor/[idUnico]`
3. Carga datos del comercio
4. Genera QR
5. ✅ QR funcional (muestra "Menú en construcción")
6. Puede agregar platos después

---

## 🔐 Seguridad (Futuro)

### Implementación Sugerida:
1. **Login con Email/Password**
   - Cliente recibe email con credenciales
   - Login en `/login`
   - Sesión con token JWT

2. **Token de Acceso**
   - Cliente recibe token único
   - Token en URL: `/editor/[idUnico]?token=xxx`
   - Validación en backend

3. **Permisos por IDU**
   - Solo el dueño del IDU puede editar
   - Lectura pública del QR (sin token)

---

## 📞 Soporte

Si el cliente tiene problemas:
1. Verificar que el IDU sea correcto
2. Verificar que los datos se guardaron (revisar BD)
3. Verificar que el QR apunta a la URL correcta
4. Revisar logs del servidor

---

## ✅ Resumen

**Flujo Mínimo para QR Funcional**:
1. Venta → 2. IDU → 3. Acceso Editor → 4. Carga Datos → 5. ✅ QR Funcional

**Tiempo estimado**: 5-10 minutos

**Flujo Completo con Menú**:
1-5 (igual) → 6. Carga Categorías/Platos → ✅ Menú Completo

**Tiempo estimado**: 15-30 minutos (depende del tamaño del menú)



