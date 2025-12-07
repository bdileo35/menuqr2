# ✅ DATABASE_URL Correcta para Vercel

## 🔴 Problema Encontrado

La DATABASE_URL en Vercel tiene un formato incorrecto:

**❌ INCORRECTA:**
```
postgresql://postgres.vzcniaopxflpgrwarnvn:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
```

**Error:** Usuario incorrecto - mezcla formato pooler con directo

## ✅ FORMATOS CORRECTOS

### **Opción 1: Conexión Directa (Puerto 5432) - RECOMENDADA**

```
postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
```

**Características:**
- Usuario: `postgres` (sin el `.vzcniaopxflpgrwarnvn`)
- Host: `db.vzcniaopxflpgrwarnvn.supabase.co`
- Puerto: `5432`
- SSL: `?sslmode=require`

### **Opción 2: Connection Pooler (Puerto 6543)**

```
postgresql://postgres.vzcniaopxflpgrwarnvn:bat33man@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Características:**
- Usuario: `postgres.vzcniaopxflpgrwarnvn` (con el proyecto)
- Host: `aws-0-us-east-1.pooler.supabase.com`
- Puerto: `6543`
- SSL: No necesario (pooler lo maneja)

## 🔧 Cómo Corregir en Vercel

1. Ir a Vercel Dashboard
2. Settings → Environment Variables
3. Editar `DATABASE_URL`
4. Reemplazar con el formato correcto (Opción 1 recomendada)
5. Guardar
6. Hacer redeploy

## ✅ Verificar

Después de corregir, verificar:

```bash
# Probar conexión
curl https://menuqrep.vercel.app/api/health

# Cargar datos
curl -X POST https://menuqrep.vercel.app/api/seed-demo

# Verificar datos
curl https://menuqrep.vercel.app/api/menu/5XJ1J37F
```

## 📋 Resumen

**Formato correcto para Vercel:**
```
postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
```

**Cambios:**
- ❌ `postgres.vzcniaopxflpgrwarnvn` → ✅ `postgres`
- ✅ Resto igual (host, puerto, SSL)

