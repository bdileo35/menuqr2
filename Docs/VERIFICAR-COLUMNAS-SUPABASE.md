# 🔍 Verificar que las Columnas Existen en Supabase

## ❓ Problema

Prisma dice que las columnas no existen, pero ejecutamos el SQL. Necesitamos verificar que realmente se crearon.

---

## ✅ Verificar en Supabase Dashboard

### **1. Verificar columna `hasPro` en tabla `User`**

1. Supabase Dashboard → **Table Editor**
2. Seleccionar tabla **`users`** (o `User`)
3. Hacer clic en el icono de **"+"** o **"Add column"** (si aparece)
4. O simplemente ver las columnas existentes
5. **Buscar:** `hasPro` (debe ser tipo `boolean`)

**Si NO existe:**
- Ejecutar el SQL de nuevo (ver abajo)

### **2. Verificar columna `plan` en tabla `User`**

1. Misma tabla `users`
2. **Buscar:** `plan` (debe ser tipo `text`)

**Si NO existe:**
- Ejecutar el SQL de nuevo (ver abajo)

### **3. Verificar columna `waiters` en tabla `Menu`**

1. Table Editor → tabla **`menus`** (o `Menu`)
2. **Buscar:** `waiters` (debe ser tipo `text`)

**Si NO existe:**
- Ejecutar el SQL de nuevo (ver abajo)

---

## 🔧 Si las Columnas NO Existen

Ejecutar este SQL en Supabase Dashboard → SQL Editor:

```sql
-- Verificar si existen primero
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'User' 
AND column_name IN ('hasPro', 'plan');

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Menu' 
AND column_name = 'waiters';

-- Si no existen, crearlas:
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "hasPro" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "plan" TEXT;

ALTER TABLE "Menu" 
ADD COLUMN IF NOT EXISTS "waiters" TEXT;
```

---

## 🔍 Verificar con SQL Directo

Ejecutar en SQL Editor:

```sql
-- Ver todas las columnas de User
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'User'
ORDER BY column_name;

-- Ver todas las columnas de Menu
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'Menu'
ORDER BY column_name;
```

Esto mostrará TODAS las columnas y podrás ver si `hasPro`, `plan`, y `waiters` están ahí.

---

## ⚠️ Posible Problema: Nombres de Tablas

Prisma usa `@@map("users")` y `@@map("menus")`, pero Supabase puede usar:
- `User` (con mayúscula)
- `users` (minúscula)
- `Menu` (con mayúscula)
- `menus` (minúscula)

**Verificar ambos nombres:**
```sql
-- Ver tablas existentes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('User', 'users', 'Menu', 'menus');
```

---

## 📋 Checklist

- [ ] Verificar columnas en Supabase Table Editor
- [ ] Si no existen, ejecutar SQL de nuevo
- [ ] Verificar nombres de tablas (User vs users, Menu vs menus)
- [ ] Esperar deploy de Vercel (si aún no terminó)
- [ ] Probar endpoints de nuevo

