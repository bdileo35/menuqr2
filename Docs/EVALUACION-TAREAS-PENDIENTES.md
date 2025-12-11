# 📋 Evaluación: Tareas Pendientes para Entrega

## ✅ Estado Actual

- ✅ **Editor remoto funciona** (después de redeploy)
- ✅ **Agotado/Disponible funciona**
- ✅ **Imágenes funcionan en editor y carta**

---

## 🎯 Tareas Pendientes (Orden de Importancia)

### **1. Carga de Mesero/a** 🔴 ALTA PRIORIDAD

**¿Por qué es importante?**
- Es parte del flujo básico de pedidos
- Ya existe el campo `waiters` en la BD
- Necesario para la funcionalidad de Pedidos

**Complejidad:** ⭐⭐ (Media)
- Ya existe el campo en la BD
- Solo falta la UI en "Datos del Comercio"
- Similar a otros campos ya implementados

**Tiempo estimado:** 30-45 min

**Implementación:**
- Agregar campo en `datos-comercio/[idUnico]/page.tsx`
- Guardar como JSON string en `Menu.waiters`
- Mostrar lista de meseros en la carta (ya existe lógica)

---

### **2. Backup/Restore de Datos** 🟡 MEDIA PRIORIDAD

**¿Por qué es importante?**
- Cliente necesita poder hacer backup antes de cambios importantes
- Restore para recuperar datos en caso de error
- Buena práctica de seguridad

**Complejidad:** ⭐⭐⭐ (Media-Alta)
- Necesita scripts de exportación/importación
- Puede ser manual (SQL) o automático (API)

**Tiempo estimado:** 1-2 horas

**Opciones de implementación:**

**Opción A: Manual (SQL) - MÁS SIMPLE**
- Script SQL para exportar datos
- Script SQL para importar datos
- Cliente ejecuta en Supabase SQL Editor

**Opción B: Automático (API) - MÁS COMPLEJO**
- Endpoint `/api/backup` que exporta a JSON
- Endpoint `/api/restore` que importa desde JSON
- UI en "Config" para descargar/cargar backup

**Recomendación:** Opción A (más simple, suficiente para entrega)

---

### **3. Borrador de Página de Pedidos** 🟡 MEDIA PRIORIDAD

**¿Por qué es importante?**
- Ya existe la página placeholder
- Necesario para el flujo completo
- Cliente puede ver la estructura

**Complejidad:** ⭐⭐⭐ (Media)
- UI similar a Promos en Carta
- 3 categorías: Pendientes, A cobrar, Completados
- Por ahora solo UI (sin funcionalidad real)

**Tiempo estimado:** 1-1.5 horas

**Implementación:**
- Usar mismo formato que Promos en Carta
- 3 secciones con cards
- Datos mock/placeholder por ahora
- Funcionalidad real se implementa después

---

### **4. Carga de Links de Google** 🟢 BAJA PRIORIDAD

**¿Por qué es importante?**
- Mejora UX (acceso directo a Maps y Reviews)
- Ya estaba implementado antes (se comentó)

**Complejidad:** ⭐ (Baja)
- Ya existe el código (comentado)
- Solo descomentar y agregar UI en "Datos del Comercio"

**Tiempo estimado:** 30-45 min

**Implementación:**
- Descomentar campos en schema (si están comentados)
- Agregar campos en "Datos del Comercio"
- Descomentar lógica en Carta
- Modal para editar links

---

## 📊 Recomendación de Orden

### **Para Entrega Mínima Viable:**

1. ✅ **Carga de Mesero/a** (30-45 min)
   - Esencial para el flujo básico
   - Rápido de implementar

2. ✅ **Backup/Restore Manual** (1 hora)
   - Script SQL simple
   - Cliente puede hacer backup/restore fácilmente

3. ⏸️ **Pedidos (Borrador)** (1-1.5 horas)
   - Si hay tiempo, agregar UI básica
   - Si no, dejar placeholder actual

4. ⏸️ **Links de Google** (30-45 min)
   - Si hay tiempo, descomentar
   - Si no, se puede agregar después

---

## 🎯 Plan de Acción Sugerido

### **Fase 1: Esencial (2-3 horas)**
1. Carga de Mesero/a
2. Backup/Restore Manual (SQL)

### **Fase 2: Si hay tiempo (1.5-2 horas)**
3. Pedidos (Borrador UI)
4. Links de Google

---

## 💡 Feedback y Opinión

### **Carga de Mesero/a:**
- ✅ **Hacerlo primero** - Es rápido y esencial
- ✅ Ya existe infraestructura (campo en BD)
- ✅ Mejora inmediata del producto

### **Backup/Restore:**
- ✅ **Muy importante** para el cliente
- ✅ Script SQL es suficiente para MVP
- ✅ Se puede mejorar después con UI

### **Pedidos:**
- ⚠️ **UI básica es suficiente** para entrega
- ⚠️ Funcionalidad real puede esperar
- ✅ Muestra la dirección del producto

### **Links de Google:**
- ⚠️ **Nice to have**, no esencial
- ✅ Muy rápido de implementar
- ✅ Se puede hacer después si falta tiempo

---

## 🚀 Siguiente Paso

**Sugerencia:** Empezar con **Carga de Mesero/a** (más rápido y esencial)

¿Quieres que empecemos con eso?

