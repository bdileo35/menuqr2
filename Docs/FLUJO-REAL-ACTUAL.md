# 🚀 FLUJO REAL ACTUAL DEL SISTEMA MenuQR

**Fecha:** 10 de Noviembre, 2025  
**Estado:** ✅ FUNCIONAL (MP Puenteado para demo)

---

## 🎯 FLUJO COMPLETO REAL (Como está implementado)

```
┌─────────────────────────────────────────────────────────┐
│                    FLUJO DEL USUARIO                     │
└─────────────────────────────────────────────────────────┘

1. HOME (/)
   ├─ Ver Demo MenuQR → /carta/5XJ1J37F
   ├─ Ver Demo Pro → /carta/5XJ1J37F?pro=1
   ├─ Comprar → /comprar
   └─ QR Shop → /qr-shop

2. COMPRAR (/comprar o /qr-shop)
   ├─ Elegir Plan (Mensual $13,999 / Anual $139,990)
   ├─ Click en "Comprar"
   └─ POST /api/tienda/crear-preferencia
       {
         plan: 'mensual' | 'anual',
         precio: 13999 | 139990,
         descripcion: 'MenuQR - Plan ...',
         idUnico: 'ABC123XY'  ← 🔑 SE GENERA AQUÍ
       }

3. API CREAR PREFERENCIA (/api/tienda/crear-preferencia)
   ├─ Genera ID Único de 8 caracteres (ej: 5XJ1J37F)
   ├─ 🔄 PUENTEADO: Simula respuesta de Mercado Pago
   └─ Redirige a /tienda/exito?plan=...&idUnico=ABC123XY

4. PÁGINA DE ÉXITO (/tienda/exito)
   ├─ Muestra QR con el idUnico generado
   ├─ URL del QR: /carta/[idUnico]
   ├─ Botón: Descargar QR
   ├─ Botón: Enviar comprobante por WhatsApp
   └─ Usuario tiene su idUnico personal

5. USAR EL SISTEMA
   ├─ /editor/[idUnico] → Editar menú (conectado a Prisma)
   ├─ /carta/[idUnico] → Ver carta pública
   ├─ /carta/[idUnico]?pro=1 → Ver carta con carrito PRO
   ├─ /configuracion/[idUnico] → Configurar tema
   ├─ /datos-comercio/[idUnico] → Editar datos del comercio
   └─ /opciones-qr/[idUnico] → Descargar QR personalizado
```

---

## 🔑 GENERACIÓN DEL ID ÚNICO

### **¿Dónde se genera?**

**OPCIÓN 1 (ACTUAL en /comprar):**
```typescript
// app/comprar/page.tsx
const generarIdUnico = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const idUnico = generarIdUnico(); // Ej: "5XJ1J37F"
```

**OPCIÓN 2 (ACTUAL en /tienda/exito):**
```typescript
// app/tienda/exito/page.tsx
// Si NO viene idUnico en la URL, genera uno nuevo
if (!idUnicoParam) {
  const nuevoIdUnico = generarIdUnico();
  setIdUnico(nuevoIdUnico);
}
```

### **Problema detectado:**
❌ **El idUnico NO se guarda en Prisma al momento de la compra**  
❌ **No hay registro de User + Menu en la base de datos**  
❌ **Solo se usa para generar la URL del QR**

---

## 🔴 GAPS IDENTIFICADOS

### **1. ID Único NO se persiste en BD**

**Problema:**
```typescript
// Flujo actual:
Compra → Genera idUnico → Muestra QR → Usuario escanea

// ❌ PERO:
- No se crea User en Prisma
- No se crea Menu en Prisma
- Si el usuario pierde el idUnico, no puede recuperarlo
- No hay autenticación
```

**Solución necesaria:**
```typescript
// POST /api/tienda/crear-preferencia
{
  plan: 'mensual',
  precio: 13999,
  email: 'cliente@email.com',  // ← AGREGAR
  nombre: 'Restaurante ABC',   // ← AGREGAR
  telefono: '+54911...',       // ← AGREGAR
}

// Backend debe:
1. Generar idUnico
2. Crear User en Prisma:
   - email
   - restaurantId = idUnico
   - restaurantName
   - phone
3. Crear Menu en Prisma:
   - restaurantId = idUnico
   - ownerId = userId
4. Enviar email con acceso al sistema
```

---

### **2. No hay flujo de "Primera Configuración"**

**Después de la compra:**
```
Usuario tiene QR → ¿Y ahora qué?
¿Cómo carga sus productos?
¿Cómo personaliza su carta?
```

**Falta:**
- Página de Bienvenida post-compra
- Tutorial de "Primeros Pasos"
- Link directo al Editor
- Email con instrucciones

**Flujo sugerido:**
```
/tienda/exito?idUnico=ABC123
  ↓
Mostrar QR + Botón "Configurar mi Menú"
  ↓
/bienvenida/ABC123
  ├─ Paso 1: Datos del comercio (nombre, dirección, teléfono)
  ├─ Paso 2: Scanner OCR (opcional)
  ├─ Paso 3: Editor (cargar productos)
  └─ Paso 4: ¡Listo! Ver tu carta digital
```

---

### **3. Editor y Carta usan datos DEMO por defecto**

**Problema:**
```typescript
// Si accedes a /editor/NUEVO_ID o /carta/NUEVO_ID
// El sistema intenta buscar en Prisma:
const menu = await prisma.menu.findUnique({
  where: { restaurantId: 'NUEVO_ID' }
});

// ❌ Si no existe, devuelve null
// ✅ Debería crear uno automáticamente O mostrar onboarding
```

**Solución:**
```typescript
// En /editor/[idUnico]
if (!menu) {
  // Redirigir a onboarding
  router.push(`/bienvenida/${idUnico}`);
}
```

---

## 📋 FLUJO IDEAL (Cómo debería ser)

### **FASE 1: COMPRA**
```
1. /qr-shop o /comprar
   ↓
2. Completar datos:
   - Email
   - Nombre del restaurante
   - Teléfono
   - Plan (mensual/anual)
   ↓
3. Pagar con Mercado Pago
   ↓
4. MP confirma pago
   ↓
5. Webhook de MP → /api/webhooks/mercadopago
   ├─ Verificar pago
   ├─ Generar idUnico
   ├─ Crear User en Prisma
   ├─ Crear Menu vacío
   ├─ Enviar email con acceso
   └─ Redirigir a /tienda/exito?idUnico=...&email=...
```

### **FASE 2: ONBOARDING**
```
6. /tienda/exito?idUnico=ABC123&email=...
   ├─ Mostrar QR
   ├─ Botón "Configurar mi Menú"
   └─ Link enviado a email
   ↓
7. /bienvenida/ABC123
   ├─ Tutorial interactivo
   ├─ Paso 1: Confirmar datos del comercio
   ├─ Paso 2: (Opcional) Scanner OCR
   ├─ Paso 3: Cargar productos manualmente
   └─ Paso 4: Vista previa + Descargar QR
   ↓
8. /dashboard/ABC123
   ├─ Panel principal
   ├─ Acceso a Editor
   ├─ Acceso a Configuración
   ├─ Estadísticas de pedidos
   └─ Descargar QR actualizado
```

### **FASE 3: USO DIARIO**
```
9. Cliente escanea QR → /carta/ABC123
   ├─ Ve menú actualizado
   ├─ Puede hacer pedidos (si pro=1)
   └─ Pedidos llegan por WhatsApp

10. Comerciante gestiona desde:
    ├─ /editor/ABC123 → Actualizar menú
    ├─ /configuracion/ABC123 → Cambiar tema
    ├─ /datos-comercio/ABC123 → Actualizar info
    └─ /stats/ABC123 → Ver pedidos y estadísticas
```

---

## 🔄 ESTADO ACTUAL VS ESTADO IDEAL

| Feature | Estado Actual | Estado Ideal |
|---------|--------------|--------------|
| Compra con MP | 🟡 Puenteado | ✅ Real |
| Genera idUnico | ✅ Sí (frontend) | ✅ Sí (backend) |
| Crea User en BD | ❌ No | ✅ Sí |
| Crea Menu en BD | ❌ No | ✅ Sí |
| Email de confirmación | ❌ No | ✅ Sí |
| Onboarding guiado | ❌ No | ✅ Sí |
| Dashboard post-compra | ❌ No | ✅ Sí |
| Autenticación | ❌ No | ✅ Sí |
| Editor funciona | ✅ Sí (con ID demo) | ✅ Sí |
| Carta funciona | ✅ Sí (con ID demo) | ✅ Sí |
| Carrito PRO | ✅ Sí | ✅ Sí |

---

## 🛠️ TAREAS PARA COMPLETAR EL FLUJO

### **PRIORIDAD ALTA (Esenciales)**

#### 1. **Webhook de Mercado Pago** (2 días)
```typescript
// POST /api/webhooks/mercadopago
export async function POST(req: NextRequest) {
  const body = await req.json();
  
  if (body.type === 'payment' && body.data.status === 'approved') {
    const paymentId = body.data.id;
    
    // Verificar pago con API de MP
    const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    });
    
    // Crear User + Menu
    const idUnico = generarIdUnico();
    const user = await prisma.user.create({
      data: {
        email: payment.metadata.email,
        restaurantId: idUnico,
        restaurantName: payment.metadata.restaurantName,
        phone: payment.metadata.phone,
        plan: payment.metadata.plan
      }
    });
    
    const menu = await prisma.menu.create({
      data: {
        restaurantId: idUnico,
        restaurantName: payment.metadata.restaurantName,
        ownerId: user.id
      }
    });
    
    // Enviar email con acceso
    await sendWelcomeEmail(user.email, idUnico);
  }
}
```

#### 2. **Página de Bienvenida** (1 día)
```typescript
// /bienvenida/[idUnico]
- Tutorial interactivo
- Primeros pasos
- Links a Editor, Configuración, etc.
```

#### 3. **Dashboard Principal** (2 días)
```typescript
// /dashboard/[idUnico]
- Panel de control
- Estadísticas
- Accesos rápidos
- Gestión de menú
```

#### 4. **Autenticación Básica** (3 días)
```typescript
// Next-Auth con email mágico
- Login con email
- Sesión persistente
- Protección de rutas
```

---

### **PRIORIDAD MEDIA (Mejoras)**

#### 5. **Recuperar ID Único** (1 día)
```typescript
// /recuperar-id
- Ingresar email
- Envía email con link al dashboard
```

#### 6. **Email Transaccional** (2 días)
```typescript
// Resend o similar
- Email de bienvenida
- Email de recuperación de ID
- Email de confirmación de pedidos
```

#### 7. **Onboarding Guiado** (3 días)
```typescript
// /onboarding/[idUnico]/step-[n]
- Wizard paso a paso
- Progreso guardado
- Skip opcional
```

---

### **PRIORIDAD BAJA (Opcionales)**

#### 8. **Stats y Analytics** (5 días)
```typescript
// /stats/[idUnico]
- Pedidos por día/mes
- Productos más vendidos
- Ingresos totales
- Gráficos
```

#### 9. **Multi-idioma** (3 días)
```typescript
// i18n con next-intl
- Español
- Inglés
- Portugués
```

#### 10. **Subdominios** (2 días)
```typescript
// https://esquina-pompeya.menuqr.app
// Middleware de rewrite
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Semana 1: MVP Funcional**
- [ ] Integración real con Mercado Pago
- [ ] Webhook de MP → Crear User + Menu
- [ ] Email de bienvenida con idUnico
- [ ] Página de bienvenida post-compra
- [ ] Dashboard básico

### **Semana 2: Mejoras**
- [ ] Autenticación con Next-Auth
- [ ] Recuperar ID por email
- [ ] Onboarding guiado
- [ ] Emails transaccionales

### **Semana 3: Polish**
- [ ] Stats y analytics
- [ ] Testing completo
- [ ] Documentación de usuario
- [ ] Deploy a producción

---

## 🎯 CONCLUSIÓN

### **¿El flujo está completo?**
🟡 **70% completo**

**Lo que SÍ funciona:**
- ✅ Compra (simulada)
- ✅ Generación de idUnico
- ✅ Página de éxito con QR
- ✅ Editor con Prisma
- ✅ Carta con carrito PRO

**Lo que falta:**
- ❌ Persistir idUnico en BD
- ❌ Crear User + Menu automáticamente
- ❌ Onboarding post-compra
- ❌ Autenticación
- ❌ Dashboard

### **Plan de acción:**
1. Implementar webhook de MP (2 días)
2. Crear User + Menu al confirmar pago (1 día)
3. Página de bienvenida (1 día)
4. Dashboard básico (2 días)

**Total: 6 días para flujo completo funcional**

---

**Próxima actualización:** Después de implementar webhook de MP
**Última revisión:** 10 de Noviembre, 2025
