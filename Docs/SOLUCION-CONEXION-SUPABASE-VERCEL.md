# 🔧 Solución: No se puede conectar a Supabase desde Vercel

## 🔴 Problema Detectado

El diagnóstico muestra:
- ✅ `DATABASE_URL` está configurada
- ✅ Formato correcto (postgresql://, SSL, host)
- ❌ **ERROR:** "Can't reach database server at `db.vzcniaopxflpgrwarnvn.supabase.co:5432`"

## 🔍 Posibles Causas

### **1. Firewall de Supabase bloqueando conexiones**

Supabase puede tener un firewall que bloquea conexiones desde ciertas IPs o desde Vercel.

**Solución:**
1. Ir a [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccionar proyecto `vzcniaopxflpgrwarnvn`
3. Ir a **Settings** → **Database**
4. Buscar sección **Connection Pooling** o **Network Restrictions**
5. Verificar si hay restricciones de IP
6. **Opción A:** Deshabilitar temporalmente el firewall para testing
7. **Opción B:** Agregar IPs de Vercel a la whitelist (complejo, mejor deshabilitar)

### **2. Proyecto de Supabase pausado**

Si el proyecto está en plan gratuito y no se usa, Supabase puede pausarlo automáticamente.

**Solución:**
1. Ir a Supabase Dashboard
2. Verificar estado del proyecto
3. Si está pausado, hacer clic en "Resume" o "Unpause"

### **3. Usar Connection Pooler en lugar de conexión directa**

Vercel funciona mejor con el Connection Pooler de Supabase (puerto 6543) que con conexión directa (puerto 5432).

**Solución: Cambiar DATABASE_URL en Vercel**

**Formato actual (Directo - NO funciona):**
```
postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
```

**Formato recomendado (Pooler - SÍ funciona):**
```
postgresql://postgres.vzcniaopxflpgrwarnvn:bat33man@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Pasos:**
1. Ir a Vercel Dashboard → Settings → Environment Variables
2. Editar `DATABASE_URL`
3. Reemplazar con el formato del pooler (arriba)
4. Guardar
5. Hacer **Redeploy**

### **4. Verificar credenciales en Supabase**

1. Ir a Supabase Dashboard
2. Settings → Database
3. Verificar **Connection string** (Direct connection)
4. Copiar la contraseña correcta
5. Actualizar en Vercel si es diferente

## ✅ Solución Recomendada (Paso a Paso)

### **Paso 1: Obtener Connection String del Pooler**

1. Ir a Supabase Dashboard
2. Settings → Database
3. Buscar **Connection Pooling**
4. Copiar el **Connection string** (Session mode o Transaction mode)
5. Debe verse así:
   ```
   postgresql://postgres.vzcniaopxflpgrwarnvn:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

### **Paso 2: Actualizar en Vercel**

1. Vercel Dashboard → Settings → Environment Variables
2. Editar `DATABASE_URL`
3. Pegar el connection string del pooler
4. Reemplazar `[PASSWORD]` con `bat33man`
5. Guardar

### **Paso 3: Verificar Firewall**

1. Supabase Dashboard → Settings → Database
2. Buscar **Network Restrictions** o **IP Allowlist**
3. Si está habilitado, deshabilitarlo temporalmente
4. O agregar `0.0.0.0/0` para permitir todas las IPs (solo para testing)

### **Paso 4: Redeploy en Vercel**

1. Deployments → 3 puntos (⋯) → Redeploy
2. Esperar a que termine

### **Paso 5: Probar**

```bash
# Verificar diagnóstico
curl https://menuqrep.vercel.app/api/diagnostico

# Debe mostrar:
# "databaseConnection": { "status": "SUCCESS" }
```

## 🔍 Verificar en Supabase Dashboard

1. Ir a **Logs** → **Database Logs**
2. Ver si aparecen intentos de conexión desde Vercel
3. Si aparecen errores, revisar el mensaje específico

## ⚠️ Notas Importantes

- **Connection Pooler (6543)** es más confiable para Vercel que conexión directa (5432)
- El pooler maneja mejor las conexiones serverless
- No requiere `?sslmode=require` (el pooler lo maneja)
- El usuario del pooler es `postgres.vzcniaopxflpgrwarnvn` (con el proyecto)
- El host del pooler es `aws-0-us-east-1.pooler.supabase.com`

## 📋 Checklist Final

- [ ] DATABASE_URL actualizada a formato pooler (puerto 6543)
- [ ] Firewall de Supabase deshabilitado o configurado
- [ ] Proyecto de Supabase activo (no pausado)
- [ ] Redeploy realizado en Vercel
- [ ] Diagnóstico muestra `databaseConnection: SUCCESS`
- [ ] Ambos restaurantes funcionan (5XJ1J37F y 5XJ1J39E)

