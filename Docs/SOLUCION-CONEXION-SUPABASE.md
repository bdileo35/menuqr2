# 🔧 Solución: Conexión a Supabase

## 🔴 Problema Identificado

- **DBeaver:** Connection timeout al intentar conectar
- **Vercel:** Probablemente mismo problema (no conecta a la base)

## 🔍 Diagnóstico

### **Puerto 6543 (Pooler) vs 5432 (Directo)**

Supabase ofrece dos formas de conexión:

1. **Puerto 6543 (Connection Pooler)** - Para aplicaciones serverless
   - Más lento pero mejor para muchas conexiones
   - Puede tener timeouts

2. **Puerto 5432 (Directo)** - Conexión directa
   - Más rápido y confiable
   - Requiere SSL: `?sslmode=require`

### **Configuración Correcta**

```env
# Para Vercel (Connection Pooler - puerto 6543)
DATABASE_URL="postgresql://postgres.vzcniaopxflpgrwarnvn:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Para DBeaver y desarrollo local (Directo - puerto 5432)
DATABASE_URL="postgresql://postgres:PASSWORD@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require"
```

## ✅ Solución Paso a Paso

### **Paso 1: Probar Conexión Directa (Puerto 5432)**

En DBeaver:
1. Cambiar puerto de `6543` a `5432`
2. Agregar parámetro SSL: `?sslmode=require`
3. Probar conexión

**Configuración DBeaver:**
- Host: `db.vzcniaopxflpgrwarnvn.supabase.co`
- Port: `5432` (NO 6543)
- Database: `postgres`
- Username: `postgres`
- Password: `bat33man`
- SSL: Habilitado / `sslmode=require`

### **Paso 2: Verificar en Supabase Dashboard**

1. Ir a Supabase Dashboard
2. Settings → Database
3. Verificar:
   - Connection string directo (puerto 5432)
   - Connection pooler (puerto 6543)
   - Firewall/IP allowlist (puede estar bloqueando)

### **Paso 3: Configurar Vercel**

**Opción A: Usar Pooler (Recomendado para Vercel)**
```
DATABASE_URL="postgresql://postgres.vzcniaopxflpgrwarnvn:bat33man@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

**Opción B: Usar Directo (Más confiable)**
```
DATABASE_URL="postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require"
```

## 🧪 Probar Conexión

### **Desde Local (PowerShell)**

```powershell
# Probar con puerto 5432 (directo)
$env:DATABASE_URL="postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require"
npx prisma db push
```

### **Desde DBeaver**

1. Crear nueva conexión PostgreSQL
2. Host: `db.vzcniaopxflpgrwarnvn.supabase.co`
3. Port: `5432`
4. Database: `postgres`
5. Username: `postgres`
6. Password: `bat33man`
7. SSL: Habilitar / `sslmode=require`
8. Probar conexión

## 🚨 Troubleshooting

### **Error: Connection timeout**

**Causas:**
- Puerto incorrecto (usar 5432 en lugar de 6543)
- SSL no configurado
- Firewall bloqueando

**Solución:**
1. Verificar puerto (5432 para directo)
2. Agregar `?sslmode=require`
3. Verificar firewall en Supabase Dashboard

### **Error: Authentication failed**

**Causa:** Credenciales incorrectas

**Solución:**
1. Verificar password en Supabase Dashboard
2. Resetear password si es necesario

### **Error: Database does not exist**

**Causa:** Nombre de base de datos incorrecto

**Solución:**
- Usar `postgres` (base de datos por defecto)

## 💡 Recomendación

**Para DBeaver y desarrollo local:**
- Usar puerto **5432** (directo) con SSL
- Más confiable y rápido

**Para Vercel:**
- Usar puerto **6543** (pooler) si está disponible
- O puerto **5432** (directo) con SSL

## ✅ Checklist

- [ ] DBeaver conecta con puerto 5432 + SSL
- [ ] DATABASE_URL en Vercel configurada correctamente
- [ ] Schema aplicado a Supabase (`npx prisma db push`)
- [ ] Datos cargados (20/190)

