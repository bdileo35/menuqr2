# 🎯 PRIORIDADES PARA ENTREGA - Lo Mínimo Vital

## ✅ LO QUE YA FUNCIONA (No tocar)
- ✅ Crear comercio nuevo → Se guarda en BD
- ✅ Ver carta pública → Lee desde BD
- ✅ Categorías → Se pueden crear/editar en BD

---

## 🔴 CRÍTICO - HACER AHORA (Sin esto NO funciona)

### 1. **Guardar Items del Menú en BD** 
**Problema:** El editor solo guarda en localStorage, se pierde todo al cerrar navegador.

**Solución:** Crear API para guardar items en BD.

**Tiempo:** 1-2 horas

---

### 2. **Guardar Datos del Comercio en BD**
**Problema:** La página de datos del comercio solo simula guardado.

**Solución:** Crear API para actualizar datos en BD.

**Tiempo:** 30 minutos

---

## 🟡 IMPORTANTE - Pero puede esperar

### 3. Meseros/Meseras
- Se puede editar manualmente en BD por ahora
- No bloquea la entrega

### 4. WhatsApp por IDU
- Funciona con variable global
- Se puede mejorar después

---

## 🟢 DETALLES - Para después

- Mejoras visuales
- Optimizaciones
- Features extras

---

## 📋 PLAN DE ACCIÓN (Paso a Paso)

### PASO 1: API para Items del Menú (CRÍTICO)
- Crear `app/api/menu/[idUnico]/items/route.ts`
- Implementar POST, PUT, DELETE

### PASO 2: Actualizar Editor para usar API
- Modificar `app/editor/[idUnico]/page.tsx`
- Reemplazar localStorage por llamadas API

### PASO 3: API para Datos del Comercio (CRÍTICO)
- Crear `app/api/menu/[idUnico]/comercio/route.ts`
- Implementar PUT

### PASO 4: Actualizar Página Datos Comercio
- Modificar `app/datos-comercio/page.tsx`
- Implementar guardado real

### PASO 5: Probar TODO
- Crear comercio
- Editar items
- Editar datos
- Verificar que persiste

---

## ⏱️ TIEMPO ESTIMADO TOTAL: 2-3 horas

**Empecemos con PASO 1 y PASO 2 (lo más crítico)**

