# 🔧 Solución: Error al Guardar Items Sin Categoría

## ❌ Error que aparece:
```
Error al guardar. Intenta nuevamente.
500 Internal Server Error
```

## 🔍 Causa:
La base de datos aún no tiene el campo `categoryId` como opcional (nullable). El schema de Prisma está actualizado, pero la migración no se ha ejecutado en la BD.

## ✅ Solución:

### 1. Ejecutar Migración de Prisma

```bash
# Detener el servidor Next.js si está corriendo (Ctrl+C)

# Ejecutar migración
npx prisma migrate dev --name allow_null_category

# Regenerar cliente de Prisma
npx prisma generate

# Reiniciar servidor
npm run dev
```

### 2. Verificar que funcionó

1. Abre el editor: `/editor/[idUnico]`
2. Edita un plato
3. Selecciona "Sin categoría (discontinuado)"
4. Guarda
5. ✅ Debería guardar sin error

### 3. Si sigue dando error

**Verifica los logs del servidor** para ver el error exacto:

```bash
# En la terminal donde corre npm run dev
# Busca el error específico de Prisma
```

**Errores comunes:**
- `Field "categoryId" is required` → La migración no se ejecutó
- `Cannot read property 'id' of null` → Error en el código (ya corregido)
- `Connection timeout` → Problema de conexión a la BD

### 4. Si usas SQLite local

```bash
# Asegúrate de usar el schema correcto
node scripts/switch-db.js local

# Luego ejecuta la migración
npx prisma migrate dev --name allow_null_category
npx prisma generate
```

### 5. Si usas Supabase (PostgreSQL)

```bash
# Asegúrate de tener DATABASE_URL correcto en .env.local
# Luego ejecuta la migración
npx prisma migrate dev --name allow_null_category
npx prisma generate
```

---

## 📝 Nota

Después de ejecutar la migración, el error debería desaparecer y podrás:
- ✅ Guardar items sin categoría
- ✅ Ver items sin categoría en el editor
- ✅ Recuperar items moviéndolos a una categoría
- ✅ Eliminar items definitivamente



