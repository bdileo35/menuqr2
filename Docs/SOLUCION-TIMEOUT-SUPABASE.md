# 🔧 Solución: Timeout en Supabase

## 🔴 Problema

- DBeaver configurado correctamente (puerto 5432, SSL require)
- Sigue dando "Connection timeout"

## 🔍 Posibles Causas

### 1. **Firewall de Supabase**
Supabase puede tener un firewall que bloquea conexiones desde ciertas IPs.

**Solución:**
1. Ir a Supabase Dashboard
2. Settings → Database
3. Verificar "Connection Pooling" está habilitado
4. Verificar "IP Allowlist" - agregar tu IP si es necesario
5. O deshabilitar temporalmente el firewall para testing

### 2. **Connection Pooling Deshabilitado**
Si el pooler está deshabilitado, el puerto 6543 no funcionará.

**Solución:**
1. Ir a Supabase Dashboard
2. Settings → Database → Connection Pooling
3. Habilitar si está deshabilitado

### 3. **Host Incorrecto**
Verificar que el host sea correcto:
- Directo: `db.vzcniaopxflpgrwarnvn.supabase.co`
- Pooler: `aws-0-us-east-1.pooler.supabase.com`

### 4. **Credenciales Incorrectas**
Verificar password en Supabase Dashboard.

## ✅ Solución Alternativa: Cargar desde Vercel

Si DBeaver no conecta, podemos cargar los datos directamente desde Vercel:

### **Opción 1: Endpoint Seed desde Vercel**

```bash
# Desde cualquier lugar (PowerShell, curl, Postman)
curl -X POST https://menuqrep.vercel.app/api/seed-demo
```

Esto ejecutará el seed en Vercel, que SÍ debería poder conectar a Supabase.

### **Opción 2: Verificar DATABASE_URL en Vercel**

1. Ir a Vercel Dashboard
2. Settings → Environment Variables
3. Verificar que `DATABASE_URL` esté configurada:
   ```
   postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
   ```

### **Opción 3: Probar Conexión desde Vercel**

Crear un endpoint de prueba:

```typescript
// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();
    const count = await prisma.menu.count();
    return NextResponse.json({ 
      success: true, 
      connected: true,
      menus: count 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
```

Luego probar: `https://menuqrep.vercel.app/api/test-db`

## 🎯 Recomendación

**Si DBeaver no conecta:**
1. **No es crítico** - podemos trabajar sin DBeaver
2. **Cargar datos desde Vercel** - más confiable
3. **Verificar logs de Vercel** - ver si conecta correctamente

**Pasos:**
1. Verificar DATABASE_URL en Vercel
2. Ejecutar seed desde Vercel: `curl -X POST https://menuqrep.vercel.app/api/seed-demo`
3. Verificar que cargó: `https://menuqrep.vercel.app/api/menu/5XJ1J37F`

## 📋 Checklist

- [ ] DBeaver configurado (puerto 5432, SSL require)
- [ ] Verificar firewall en Supabase Dashboard
- [ ] Verificar DATABASE_URL en Vercel
- [ ] Probar seed desde Vercel
- [ ] Verificar datos cargados

