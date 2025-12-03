# 🚀 Configurar MenuQR en Vercel

## 📋 Resumen

Esta guía explica cómo configurar MenuQR para funcionar correctamente en Vercel con Supabase (PostgreSQL).

---

## ✅ Pasos Previos al Deploy

### 1. **Cambiar Schema a PostgreSQL**

Antes de hacer push a producción, asegúrate de que el schema esté configurado para PostgreSQL:

```bash
# Cambiar a PostgreSQL
node scripts/switch-db.js remote

# Regenerar Prisma Client
npx prisma generate

# Verificar que el provider sea postgresql
cat prisma/schema.prisma | grep provider
# Debe mostrar: provider = "postgresql"
```

### 2. **Commit y Push**

```bash
git add prisma/schema.prisma
git commit -m "chore: Configurar schema para PostgreSQL (Vercel)"
git push origin main
```

---

## 🔧 Configuración en Vercel

### 1. **Variables de Entorno**

En el dashboard de Vercel, ve a **Settings → Environment Variables** y agrega:

```
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.TU_PROJECT.supabase.co:5432/postgres?sslmode=require
```

**⚠️ IMPORTANTE:**
- Reemplaza `TU_PASSWORD` con tu contraseña de Supabase
- Reemplaza `TU_PROJECT` con tu ID de proyecto de Supabase
- Asegúrate de incluir `?sslmode=require` al final

### 2. **Build Command**

Vercel debería detectar automáticamente Next.js, pero verifica que el build command sea:

```bash
npm run build
```

### 3. **Install Command**

```bash
npm install
```

### 4. **Prisma Generate en Build**

Vercel ejecutará automáticamente `prisma generate` durante el build si tienes Prisma instalado.

**Opcional:** Puedes agregar un script en `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## 🔍 Verificar el Deploy

### 1. **Revisar Logs de Build**

En Vercel, ve a **Deployments → [Tu Deploy] → Build Logs** y verifica:

- ✅ `prisma generate` se ejecutó correctamente
- ✅ No hay errores de conexión a la base de datos
- ✅ El build completó exitosamente

### 2. **Probar Endpoints**

Una vez deployado, prueba:

```
https://tu-app.vercel.app/api/health
https://tu-app.vercel.app/api/menu/5XJ1J37F
```

### 3. **Verificar Base de Datos**

Asegúrate de que:
- ✅ Supabase esté accesible desde internet
- ✅ Las credenciales sean correctas
- ✅ El schema esté sincronizado (`npx prisma db push` en Supabase)

---

## 🐛 Troubleshooting

### Error: "Provider mismatch"

**Síntoma:** Error durante el build sobre provider de base de datos

**Solución:**
```bash
# Localmente, cambiar a PostgreSQL
node scripts/switch-db.js remote
npx prisma generate
git add prisma/schema.prisma
git commit -m "fix: Schema para PostgreSQL"
git push
```

### Error: "Can't reach database server"

**Síntoma:** Error 500 al acceder a endpoints de API

**Solución:**
1. Verifica que `DATABASE_URL` esté correctamente configurada en Vercel
2. Verifica que Supabase esté accesible
3. Verifica que el formato de la URL incluya `?sslmode=require`

### Error: "Prisma Client not generated"

**Síntoma:** Error sobre Prisma Client no encontrado

**Solución:**
Agrega a `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## 📝 Checklist Pre-Deploy

- [ ] Schema configurado para PostgreSQL (`provider = "postgresql"`)
- [ ] `DATABASE_URL` configurada en Vercel con formato correcto
- [ ] Prisma Client regenerado localmente
- [ ] Build local funciona (`npm run build`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Supabase accesible y con datos

---

## 🔄 Workflow Recomendado

### Desarrollo Local
```bash
# Usar SQLite
node scripts/switch-db.js local
npx prisma generate
npm run dev
```

### Antes de Deploy
```bash
# Cambiar a PostgreSQL
node scripts/switch-db.js remote
npx prisma generate
npm run build  # Verificar que compile
git add prisma/schema.prisma
git commit -m "chore: Schema para producción"
git push
```

---

## 📚 Referencias

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Supabase Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)

