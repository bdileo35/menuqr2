# 🔧 Agregar Columnas Google Maps/Reviews a Supabase

## 🔴 Problema

Error 500 en Vercel porque las columnas `googleMapsUrl` y `googleReviewsUrl` no existen en Supabase.

**Error:**
```
500 Internal Server Error
Failed to load resource: /api/menu/5XJ1J37F
```

**Causa:** Agregamos los campos al schema de Prisma, pero no se aplicaron en Supabase.

---

## ✅ Solución: Agregar Columnas a Supabase

### **Ejecutar este SQL en Supabase Dashboard → SQL Editor:**

```sql
-- Agregar columnas googleMapsUrl y googleReviewsUrl a la tabla "menus" (minúscula)
ALTER TABLE "menus" 
ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;

ALTER TABLE "menus" 
ADD COLUMN IF NOT EXISTS "googleReviewsUrl" TEXT;
```

**⚠️ IMPORTANTE:** Usar **`menus`** (minúscula) porque Prisma usa `@@map("menus")`.

---

## 📋 Pasos Completos

1. **Ir a Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Seleccionar tu proyecto

2. **Ir a SQL Editor:**
   - Menú lateral → **SQL Editor**

3. **Ejecutar el SQL:**
   ```sql
   ALTER TABLE "menus" 
   ADD COLUMN IF NOT EXISTS "googleMapsUrl" TEXT;

   ALTER TABLE "menus" 
   ADD COLUMN IF NOT EXISTS "googleReviewsUrl" TEXT;
   ```

4. **Verificar:**
   - Table Editor → `menus`
   - Debe aparecer `googleMapsUrl` y `googleReviewsUrl` en las columnas

5. **Redeploy en Vercel (opcional):**
   - Vercel regenerará Prisma Client automáticamente
   - O esperar al próximo push

---

## 🔍 Verificar que Funcionó

Después de agregar las columnas, el error 500 debería desaparecer.

**Probar:**
```bash
curl https://menuqrep.vercel.app/api/menu/5XJ1J37F
```

Debería devolver `200 OK` en lugar de `500`.

