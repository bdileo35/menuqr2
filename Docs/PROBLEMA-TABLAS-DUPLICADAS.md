# 🔴 Problema: Tablas Duplicadas en Supabase

## ❓ Qué Está Pasando

Veo que hay **tablas duplicadas** en Supabase:
- `Category` y `categories`
- `Menu` y `menus`
- `User` y `users`
- `MenuItem` y `menu_items`

**Esto causa problemas porque:**
- Prisma busca en `users` (minúscula, por `@@map("users")`)
- Pero las columnas pueden estar en `User` (mayúscula)
- O viceversa

---

## 🔍 Verificar Dónde Están las Columnas

### **Opción 1: Verificar tabla `users` (minúscula)**

1. Table Editor → Seleccionar **`users`** (minúscula)
2. Ver headers (nombres de columnas)
3. **Buscar:** `hasPro`, `plan`

### **Opción 2: Verificar tabla `User` (mayúscula)**

1. Table Editor → Seleccionar **`User`** (mayúscula)
2. Ver headers
3. **Buscar:** `hasPro`, `plan`

### **Opción 3: Verificar tabla `menus` (minúscula)**

1. Table Editor → Seleccionar **`menus`** (minúscula)
2. Ver headers
3. **Buscar:** `waiters`

### **Opción 4: Verificar tabla `Menu` (mayúscula)**

1. Table Editor → Seleccionar **`Menu`** (mayúscula)
2. Ver headers
3. **Buscar:** `waiters`

---

## ✅ Solución: Agregar Columnas a la Tabla Correcta

Prisma usa `@@map("users")` y `@@map("menus")`, así que busca en las tablas **minúsculas**.

### **Ejecutar SQL para las tablas CORRECTAS:**

```sql
-- Agregar a tabla "users" (minúscula - la que usa Prisma)
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "hasPro" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "plan" TEXT;

-- Agregar a tabla "menus" (minúscula - la que usa Prisma)
ALTER TABLE "menus" 
ADD COLUMN IF NOT EXISTS "waiters" TEXT;
```

**⚠️ IMPORTANTE:** Usar **minúsculas** (`users`, `menus`) porque Prisma usa `@@map`.

---

## 🔍 Verificar Qué Tabla Tiene Datos

### **Verificar `users` vs `User`:**

1. Table Editor → `users` (minúscula)
2. ¿Tiene filas? ¿Tiene datos de Esquina Pompeya?
3. Table Editor → `User` (mayúscula)
4. ¿Tiene filas? ¿Tiene datos?

**La que tiene datos es la que usa Prisma.**

---

## 🎯 Próximos Pasos

1. **Verificar qué tabla tiene datos** (`users` o `User`)
2. **Agregar columnas a esa tabla** (usar SQL con el nombre correcto)
3. **Probar de nuevo** los endpoints

---

## 📋 Checklist

- [ ] Verificar si `users` (minúscula) tiene datos
- [ ] Verificar si `User` (mayúscula) tiene datos
- [ ] Agregar columnas a la tabla que tiene datos
- [ ] Verificar que las columnas se crearon
- [ ] Probar endpoints de nuevo

