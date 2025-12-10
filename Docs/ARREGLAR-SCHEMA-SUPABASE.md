# 🔧 Arreglar Schema en Supabase (Falta columna hasPro)

## 🔴 Error Actual

```
The column `hasPro` does not exist in the current database.
```

**Causa:** El schema de Supabase no está actualizado. Falta la columna `hasPro` en la tabla `User`.

---

## ✅ Solución: Aplicar Schema a Supabase

### **Opción 1: Desde Local (Recomendado)**

1. **Cambiar schema a PostgreSQL:**
   ```bash
   node scripts/switch-db.js remote
   ```

2. **Aplicar schema a Supabase:**
   ```bash
   # Asegúrate de tener DATABASE_URL apuntando a Supabase
   npx prisma db push
   ```

3. **Regenerar Prisma Client:**
   ```bash
   npx prisma generate
   ```

### **Opción 2: Desde Supabase Dashboard (SQL Editor)**

1. Ir a Supabase Dashboard → **SQL Editor**
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

---

## 📋 Verificar Schema

Después de aplicar el schema, verifica:

1. Supabase Dashboard → **Table Editor** → **User**
2. Debe existir la columna `hasPro` (tipo boolean)
3. Debe existir la columna `plan` (tipo text)

---

## 🚀 Después de Arreglar

1. **Aplicar schema** (arriba)
2. **Ejecutar seed:**
   ```bash
   curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos
   ```
3. **Verificar:**
   ```bash
   curl https://menuqrep.vercel.app/api/menu/5XJ1J39E
   ```

