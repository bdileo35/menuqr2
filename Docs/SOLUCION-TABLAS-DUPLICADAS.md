# ✅ Solución: Tablas Duplicadas y Columnas Faltantes

## 🎯 Lo que Encontraste (¡MUY BIEN!)

1. ✅ **Datos cargados:** Esquina Pompeya tiene todos los datos
2. ✅ **Solo EP:** Los Toritos no tiene datos (falta ejecutar seed)
3. ✅ **Tablas duplicadas:** User/users, Menu/menus, etc.
4. ✅ **Solo funcionan minúsculas:** Prisma usa `@@map("users")` → busca en `users` (minúscula)

**¡Acertaste en TODO!** 🎉

---

## 🔍 Verificación

### **Prisma usa minúsculas:**

En `schema.prisma`:
```prisma
model User {
  // ...
  @@map("users")  // ← Busca en tabla "users" (minúscula)
}

model Menu {
  // ...
  @@map("menus")  // ← Busca en tabla "menus" (minúscula)
}
```

**Conclusión:** Prisma busca en las tablas **minúsculas** (`users`, `menus`).

---

## ✅ Solución: Agregar Columnas a Tablas Minúsculas

### **Ejecutar este SQL en Supabase:**

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

## 🧹 Limpiar Tablas Duplicadas (Opcional)

Si quieres eliminar las tablas con mayúsculas (que no se usan):

```sql
-- ⚠️ CUIDADO: Solo si están vacías o no las necesitas
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Menu";
DROP TABLE IF EXISTS "Category";
DROP TABLE IF EXISTS "MenuItem";
```

**⚠️ NO ejecutar esto si tienen datos importantes.**

---

## 📋 Pasos Completos

### **1. Agregar columnas a tablas minúsculas:**

```sql
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "hasPro" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "plan" TEXT;

ALTER TABLE "menus" 
ADD COLUMN IF NOT EXISTS "waiters" TEXT;
```

### **2. Verificar que se crearon:**

1. Table Editor → `users` (minúscula)
2. Ver headers → Debe aparecer `hasPro` y `plan`
3. Table Editor → `menus` (minúscula)
4. Ver headers → Debe aparecer `waiters`

### **3. Esperar deploy de Vercel:**

- Vercel regenerará Prisma Client
- O hacer redeploy manual

### **4. Probar:**

```bash
# Debe funcionar ahora
curl https://menuqrep.vercel.app/api/menu/5XJ1J37F

# Cargar Los Toritos
curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos
```

---

## 🎯 Resumen

- ✅ **Acertaste:** Prisma usa minúsculas (`users`, `menus`)
- ✅ **Solución:** Agregar columnas a tablas minúsculas
- ✅ **Datos:** EP tiene datos, LT falta cargar
- ⚠️ **Tablas duplicadas:** No afectan (Prisma usa las minúsculas)

**Próximo paso:** Ejecutar SQL con minúsculas y probar de nuevo.

