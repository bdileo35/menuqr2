# 🔄 Configuración: Local (SQLite) + Remoto (Supabase)

## 📋 Resumen

Esta guía explica cómo configurar el proyecto para usar:
- **Local (Desarrollo):** SQLite (`file:./prisma/dev.db`) - Rápido, sin conexión
- **Remoto (Producción):** Supabase (PostgreSQL) - Datos reales

---

## ✅ Ventajas

- ✅ **Desarrollo local rápido:** Sin problemas de conexión a internet
- ✅ **Pruebas independientes:** Puedes probar sin depender de Supabase
- ✅ **Datos reales en producción:** Supabase para datos reales
- ✅ **Flexibilidad:** Cambias fácilmente entre ambos

---

## ⚠️ Consideraciones

- ⚠️ **Datos no sincronizados:** Los datos locales NO se sincronizan con remoto
- ⚠️ **Diferencias SQLite/PostgreSQL:** Algunas funciones pueden diferir
- ⚠️ **Regenerar Prisma Client:** Necesitas regenerar al cambiar de provider

---

## 🚀 Configuración Rápida

### **Opción 1: Cambiar a SQLite (Local)**

```bash
# 1. Cambiar schema a SQLite
node scripts/switch-db.js local

# 2. Actualizar .env.local
DATABASE_URL="file:./prisma/dev.db"

# 3. Regenerar Prisma Client
npx prisma generate

# 4. Crear/migrar base de datos local
npx prisma db push

# 5. (Opcional) Cargar datos demo
Invoke-WebRequest -Uri "http://localhost:3000/api/seed-demo" -Method POST
```

### **Opción 2: Cambiar a PostgreSQL (Supabase/Remoto)**

```bash
# 1. Cambiar schema a PostgreSQL
node scripts/switch-db.js remote

# 2. Actualizar .env.local
DATABASE_URL="postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require"

# 3. Regenerar Prisma Client
npx prisma generate

# 4. Sincronizar con Supabase
npx prisma db push
```

---

## 📝 Archivos de Configuración

### `.env.local` (Local - SQLite)
```env
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### `.env.local` (Remoto - Supabase)
```env
DATABASE_URL="postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🔍 Verificar Configuración

### Ver qué provider está activo:
```bash
# Ver el schema actual
cat prisma/schema.prisma | grep provider
```

### Ver qué DATABASE_URL está configurado:
```bash
# PowerShell
Get-Content .env.local | Select-String "DATABASE_URL"
```

---

## 💡 Recomendación

**Para desarrollo diario:**
- Usa **SQLite local** (más rápido, sin problemas de conexión)
- Carga datos demo con `/api/seed-demo`

**Antes de deploy:**
- Cambia a **Supabase** para probar con datos reales
- Verifica que todo funcione correctamente

---

## 🐛 Troubleshooting

### Error: "Provider mismatch"
- **Solución:** Regenera Prisma Client: `npx prisma generate`

### Error: "Database file not found"
- **Solución:** Ejecuta `npx prisma db push` para crear la BD local

### Error: "Connection timeout" (Supabase)
- **Solución:** Verifica que el `DATABASE_URL` sea correcto y que Supabase esté accesible

---

## 📚 Referencias

- [Prisma SQLite Docs](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
- [Prisma PostgreSQL Docs](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Supabase Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)



