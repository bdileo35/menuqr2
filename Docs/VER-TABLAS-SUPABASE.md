# 👀 Ver Tablas y Datos en Supabase (Como DBeaver)

## ✅ Sí, Puedes Ver Todo

Supabase tiene un **Table Editor** que es similar a DBeaver. Puedes ver tablas, columnas, y datos directamente.

---

## 📍 Cómo Acceder al Table Editor

### **Opción 1: Desde el Sidebar**

1. En Supabase Dashboard (donde estás ahora)
2. En el **sidebar izquierdo**, busca el icono de **tabla/grid** (segundo icono)
3. Hacer clic → Se abre **Table Editor**

### **Opción 2: Desde el Menú**

1. En el sidebar izquierdo, busca **"Table Editor"** o **"Database"**
2. Hacer clic
3. Verás todas las tablas

---

## 🔍 Qué Verás en Table Editor

### **Lista de Tablas (Lado Izquierdo):**
- `users` (o `User`)
- `menus` (o `Menu`)
- `categories`
- `menu_items`
- `orders`
- `order_items`

### **Datos de la Tabla (Centro):**
- Todas las filas (registros)
- Todas las columnas
- Puedes editar directamente (como Excel)

### **Estructura (Lado Derecho):**
- Columnas y sus tipos
- Constraints (primary keys, foreign keys, etc.)

---

## ✅ Verificar Columnas que Faltan

### **1. Verificar tabla `users`:**

1. Table Editor → Seleccionar tabla **`users`** (o `User`)
2. Ver las columnas en la parte superior (headers)
3. **Buscar:**
   - `hasPro` (debe ser tipo boolean)
   - `plan` (debe ser tipo text)

**Si NO las ves:**
- Las columnas no se crearon
- Necesitas ejecutar el SQL de nuevo

### **2. Verificar tabla `menus`:**

1. Table Editor → Seleccionar tabla **`menus`** (o `Menu`)
2. Ver las columnas
3. **Buscar:**
   - `waiters` (debe ser tipo text)

**Si NO la ves:**
- La columna no se creó
- Necesitas ejecutar el SQL de nuevo

---

## 🔧 Si las Columnas NO Existen

1. Ir a **SQL Editor** (icono de terminal `>_` en el sidebar)
2. Ejecutar este SQL:

```sql
-- Agregar columna hasPro a la tabla User
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "hasPro" BOOLEAN NOT NULL DEFAULT false;

-- Agregar columna plan si no existe
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "plan" TEXT;

-- Agregar columna waiters a la tabla Menu si no existe
ALTER TABLE "Menu" 
ADD COLUMN IF NOT EXISTS "waiters" TEXT;
```

3. Hacer clic en **"Run"** (botón verde)
4. Debe mostrar "Success"

---

## 📊 Ver Datos (Como DBeaver)

### **Ver Registros:**

1. Table Editor → Seleccionar tabla (ej: `users`)
2. Verás todas las filas con sus datos
3. Puedes hacer scroll, filtrar, buscar

### **Editar Datos:**

1. Hacer doble clic en una celda
2. Editar el valor
3. Presionar Enter para guardar

### **Agregar Fila:**

1. Hacer clic en el botón **"+"** o **"Insert row"**
2. Llenar los campos
3. Guardar

---

## 🔍 Verificar Datos Existentes

### **Esquina Pompeya (5XJ1J37F):**

1. Table Editor → `users`
2. Buscar fila donde `restaurantId = '5XJ1J37F'`
3. Verificar que existe

### **Los Toritos (5XJ1J39E):**

1. Table Editor → `users`
2. Buscar fila donde `restaurantId = '5XJ1J39E'`
3. **Si NO existe:** Necesitas ejecutar el seed

---

## 📋 Resumen

- ✅ **Sí, puedes ver tablas y datos** (Table Editor)
- ✅ **Es similar a DBeaver** (interfaz visual)
- ✅ **Puedes editar directamente** (como Excel)
- ✅ **Puedes verificar columnas** (headers de la tabla)

**Para acceder:**
- Sidebar → Icono de tabla/grid → Table Editor

**Para verificar columnas:**
- Table Editor → Seleccionar tabla → Ver headers
- Si no ves `hasPro`, `plan`, `waiters` → Ejecutar SQL de nuevo

