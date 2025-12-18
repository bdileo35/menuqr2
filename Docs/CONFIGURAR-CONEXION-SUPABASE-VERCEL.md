# 🔧 Configurar Conexión a Supabase en Vercel

## ⚠️ PROBLEMA ACTUAL
La conexión a Supabase falla intermitentemente entre deploys, causando errores 500.

## 🎯 SOLUCIÓN: Usar Connection Pooler de Supabase

### **Paso 1: Obtener Connection Pooler String desde Supabase**

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. Busca la sección **Connection Pooling**
5. Selecciona **Session mode** (recomendado para Vercel)
6. Copia el **Connection string**

**Formato correcto:**
```
postgresql://postgres.vzcniaopxflpgrwarnvn:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**Características importantes:**
- ✅ Usa `pooler.supabase.com` (NO `db.supabase.co`)
- ✅ Puerto **6543** (NO 5432)
- ✅ Incluye `?sslmode=require`

### **Paso 2: Configurar en Vercel**

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto `menuqrpro`
3. Ve a **Settings** → **Environment Variables**
4. Busca `DATABASE_URL`
5. **Edita** y pega el Connection Pooler String completo
6. **IMPORTANTE:** Reemplaza `[PASSWORD]` con tu contraseña real de Supabase
7. **Guarda**

### **Paso 3: Verificar Contraseña de Supabase**

Si no recuerdas la contraseña:

1. Supabase Dashboard → **Settings** → **Database**
2. Busca **Database password**
3. Si no la ves, haz clic en **Reset database password**
4. **Copia la nueva contraseña** (solo se muestra una vez)
5. Actualiza `DATABASE_URL` en Vercel con la nueva contraseña

### **Paso 4: Redeploy en Vercel**

**CRÍTICO:** Después de cambiar `DATABASE_URL`, debes hacer **Redeploy**:

1. Ve a **Deployments**
2. Encuentra el último deployment
3. Haz clic en los **3 puntos** → **Redeploy**
4. Espera a que termine el deploy

### **Paso 5: Verificar Conexión**

1. Ve a `https://menuqrep.vercel.app/api/diagnostico`
2. Deberías ver:
   ```json
   {
     "checks": {
       "databaseConnection": {
         "status": "SUCCESS",
         "canQuery": true
       }
     }
   }
   ```

## 🔍 Diferencias entre Connection Types

### ❌ **Direct Connection (NO usar en Vercel)**
```
postgresql://postgres:[PASSWORD]@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres
```
- Puerto: **5432**
- Host: `db.supabase.co`
- **Problema:** Límite de conexiones simultáneas (máx 4 en plan gratuito)
- **Causa:** Errores intermitentes en serverless (Vercel)

### ✅ **Connection Pooler (USAR en Vercel)**
```
postgresql://postgres.vzcniaopxflpgrwarnvn:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```
- Puerto: **6543**
- Host: `pooler.supabase.com`
- **Ventaja:** Maneja múltiples conexiones simultáneas
- **Recomendado:** Para serverless (Vercel)

## 🛠️ Cambios Implementados en el Código

1. **Retry Logic:** Reintentos automáticos en caso de error de conexión
2. **Connection Pooling:** Configuración optimizada en Prisma Client
3. **Error Handling:** Mejor detección y manejo de errores de conexión

## 📋 Checklist Final

- [ ] Connection Pooler String obtenido de Supabase
- [ ] `DATABASE_URL` actualizada en Vercel (puerto 6543, pooler.supabase.com)
- [ ] Contraseña correcta en `DATABASE_URL`
- [ ] Redeploy realizado después de cambiar `DATABASE_URL`
- [ ] `/api/diagnostico` muestra `SUCCESS`
- [ ] Editor carga datos reales (20/190, no 6/23)

## 🚨 Si Sigue Fallando

1. **Verifica logs en Vercel:**
   - Ve a **Deployments** → Último deployment → **Logs**
   - Busca errores de conexión

2. **Verifica estado de Supabase:**
   - Supabase Dashboard → **Logs** → **Database Logs**
   - Verifica si hay intentos de conexión

3. **Verifica región:**
   - Si tu proyecto está en otra región, actualiza el host del pooler:
     - `us-east-1` → `aws-0-us-east-1.pooler.supabase.com`
     - `us-west-1` → `aws-0-us-west-1.pooler.supabase.com`
     - etc.

4. **Contacta soporte:**
   - Si nada funciona, contacta a Supabase Support

