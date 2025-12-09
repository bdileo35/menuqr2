# 🔍 Verificar Conexión a Supabase en Vercel

## 🔴 Problema Actual

Los endpoints en Vercel están dando error:
- `curl https://menuqrep.vercel.app/api/menu/5XJ1J39E` → Error interno del servidor
- `curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos` → Error al ejecutar seed

## ✅ Pasos para Solucionar

### **1. Verificar DATABASE_URL en Vercel**

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleccionar el proyecto `menuqrep`
3. Ir a **Settings** → **Environment Variables**
4. Buscar `DATABASE_URL`
5. Verificar que tenga este formato:
   ```
   postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
   ```

**⚠️ IMPORTANTE:**
- Usuario: `postgres` (NO `postgres.vzcniaopxflpgrwarnvn`)
- Host: `db.vzcniaopxflpgrwarnvn.supabase.co`
- Puerto: `5432`
- SSL: `?sslmode=require` (obligatorio)

### **2. Si NO existe DATABASE_URL:**

1. Click en **Add New**
2. Name: `DATABASE_URL`
3. Value: `postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require`
4. Environment: Seleccionar **Production**, **Preview**, y **Development**
5. Click **Save**

### **3. Hacer Redeploy**

Después de agregar/modificar `DATABASE_URL`:
1. Ir a **Deployments**
2. Click en los 3 puntos (⋯) del último deploy
3. Seleccionar **Redeploy**
4. Esperar a que termine el build

### **4. Probar Conexión**

Después del redeploy, probar:

```bash
# Verificar conexión
curl https://menuqrep.vercel.app/api/health

# Cargar Los Toritos
curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos

# Verificar que se cargó
curl https://menuqrep.vercel.app/api/menu/5XJ1J39E
```

### **5. Ver Logs en Vercel**

Si sigue fallando:
1. Ir a **Deployments** → Último deploy
2. Click en **View Function Logs**
3. Buscar errores relacionados con:
   - `Can't reach database`
   - `P1001`
   - `connection`
   - `DATABASE_URL`

## 🔍 Verificar en Supabase

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccionar proyecto `vzcniaopxflpgrwarnvn`
3. Ir a **Settings** → **Database**
4. Verificar **Connection string** (Direct connection):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
   ```
5. Verificar que la contraseña sea `bat33man`

## ⚠️ Errores Comunes

### **Error: "Can't reach database server"**
- **Causa:** DATABASE_URL incorrecta o no configurada
- **Solución:** Verificar formato en Vercel

### **Error: "P1001"**
- **Causa:** No se puede conectar al servidor
- **Solución:** Verificar que Supabase esté activo y la IP no esté bloqueada

### **Error: "FATAL: password authentication failed"**
- **Causa:** Contraseña incorrecta
- **Solución:** Verificar contraseña en Supabase Dashboard

## 📋 Checklist

- [ ] DATABASE_URL configurada en Vercel
- [ ] Formato correcto (usuario `postgres`, no `postgres.vzcniaopxflpgrwarnvn`)
- [ ] SSL habilitado (`?sslmode=require`)
- [ ] Redeploy realizado después de cambiar variables
- [ ] Supabase activo y accesible
- [ ] Contraseña correcta (`bat33man`)

