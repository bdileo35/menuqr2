# 🎯 Plan Final: Solucionar Conexión a Supabase

## 📋 Estado Actual

- ✅ **Local (SQLite):** Funciona perfectamente con 20/190 datos
- ✅ **Vercel (Fallback):** Funciona con datos demo para ambos IDUs
- ❌ **Vercel (Supabase):** No puede conectar a la base de datos

## 🔍 Diagnóstico Actual

El endpoint `/api/diagnostico` muestra:
- ✅ `DATABASE_URL` configurada
- ✅ Formato correcto (postgresql://, SSL, host)
- ❌ **ERROR:** "Can't reach database server at `db.vzcniaopxflpgrwarnvn.supabase.co:5432`"

## 🎯 Objetivo

Conectar Vercel a Supabase para que ambos restaurantes (5XJ1J37F y 5XJ1J39E) funcionen con datos reales.

---

## 📝 PASO 1: Verificar Estado del Proyecto Supabase

### **1.1. Verificar si el proyecto está activo**

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccionar proyecto `vzcniaopxflpgrwarnvn`
3. **Verificar estado:**
   - Si está **pausado** → Hacer clic en "Resume" o "Unpause"
   - Si está **activo** → Continuar al siguiente paso

### **1.2. Verificar firewall/restricciones de red**

1. Supabase Dashboard → **Settings** → **Database**
2. Buscar sección **Network Restrictions** o **IP Allowlist**
3. **Si está habilitado:**
   - **Opción A (Recomendada):** Deshabilitar temporalmente para testing
   - **Opción B:** Agregar `0.0.0.0/0` para permitir todas las IPs (solo para testing)
4. **Si no está habilitado:** Continuar al siguiente paso

---

## 📝 PASO 2: Obtener Connection String Correcto

### **2.1. Obtener Connection Pooler String**

1. Supabase Dashboard → **Settings** → **Database**
2. Buscar sección **Connection Pooling**
3. Seleccionar **Session mode** (recomendado para Vercel)
4. Copiar el **Connection string**
5. Debe verse así:
   ```
   postgresql://postgres.vzcniaopxflpgrwarnvn:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

### **2.2. Verificar credenciales**

1. En la misma página, buscar **Connection string** (Direct connection)
2. Verificar la contraseña
3. Si es diferente a `bat33man`, anotarla

---

## 📝 PASO 3: Actualizar DATABASE_URL en Vercel

### **3.1. Ir a Vercel Dashboard**

1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleccionar proyecto `menuqrep`
3. Ir a **Settings** → **Environment Variables**

### **3.2. Editar DATABASE_URL**

1. Buscar variable `DATABASE_URL`
2. Hacer clic en **Edit** (o **Add** si no existe)
3. **Reemplazar** con el connection string del pooler:
   ```
   postgresql://postgres.vzcniaopxflpgrwarnvn:bat33man@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   (Reemplazar `bat33man` con la contraseña correcta si es diferente)

4. **Seleccionar ambientes:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. Hacer clic en **Save**

### **3.3. Verificar formato**

El formato debe ser:
- ✅ Usuario: `postgres.vzcniaopxflpgrwarnvn` (con el proyecto)
- ✅ Host: `aws-0-us-east-1.pooler.supabase.com` (pooler, no directo)
- ✅ Puerto: `6543` (pooler, no 5432)
- ✅ Base de datos: `postgres`
- ❌ **NO incluir** `?sslmode=require` (el pooler lo maneja)

---

## 📝 PASO 4: Redeploy en Vercel

### **4.1. Forzar redeploy**

1. Vercel Dashboard → **Deployments**
2. Buscar el último deployment
3. Hacer clic en los **3 puntos (⋯)** → **Redeploy**
4. Seleccionar **Use existing Build Cache** (opcional)
5. Hacer clic en **Redeploy**
6. Esperar a que termine (2-3 minutos)

---

## 📝 PASO 5: Verificar Conexión

### **5.1. Probar endpoint de diagnóstico**

```bash
curl https://menuqrep.vercel.app/api/diagnostico
```

**Resultado esperado:**
```json
{
  "success": true,
  "diagnostics": {
    "checks": {
      "databaseConnection": {
        "status": "SUCCESS"
      }
    }
  }
}
```

### **5.2. Probar endpoints de menú**

```bash
# Esquina Pompeya
curl https://menuqrep.vercel.app/api/menu/5XJ1J37F

# Los Toritos
curl https://menuqrep.vercel.app/api/menu/5XJ1J39E
```

**Resultado esperado:**
- Status: `200 OK`
- `success: true`
- Datos del menú con categorías e items

### **5.3. Probar en navegador**

- `https://menuqrep.vercel.app/carta/5XJ1J37F` → Debe mostrar menú real
- `https://menuqrep.vercel.app/carta/5XJ1J39E` → Debe mostrar menú real

---

## 📝 PASO 6: Cargar Datos si Faltan

### **6.1. Verificar si hay datos en Supabase**

1. Supabase Dashboard → **Table Editor**
2. Verificar tabla `menus`:
   - Debe existir registro con `restaurantId = '5XJ1J37F'`
   - Debe existir registro con `restaurantId = '5XJ1J39E'`
3. Verificar tabla `categories`:
   - Debe haber ~20 categorías para cada menú
4. Verificar tabla `menu_items`:
   - Debe haber ~190 items para 5XJ1J37F
   - Debe haber ~60 items para 5XJ1J39E

### **6.2. Cargar datos si faltan**

**Para Esquina Pompeya (5XJ1J37F):**
```bash
curl -X POST https://menuqrep.vercel.app/api/seed-demo
```

**Para Los Toritos (5XJ1J39E):**
```bash
curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos
```

### **6.3. Verificar carga**

```bash
# Verificar datos cargados
curl https://menuqrep.vercel.app/api/menu/5XJ1J37F | jq '.menu.categories | length'
curl https://menuqrep.vercel.app/api/menu/5XJ1J39E | jq '.menu.categories | length'
```

---

## 🔧 Troubleshooting

### **Problema: Sigue sin conectar después de cambiar DATABASE_URL**

**Solución 1: Verificar logs de Supabase**
1. Supabase Dashboard → **Logs** → **Database Logs**
2. Ver si aparecen intentos de conexión
3. Si aparecen errores, revisar el mensaje

**Solución 2: Probar conexión directa (temporal)**
1. Cambiar `DATABASE_URL` a formato directo:
   ```
   postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
   ```
2. Redeploy
3. Probar diagnóstico
4. Si funciona, el problema es el pooler
5. Si no funciona, el problema es el firewall o credenciales

**Solución 3: Verificar región de Supabase**
1. Supabase Dashboard → **Settings** → **General**
2. Verificar región del proyecto
3. Si es diferente a `us-east-1`, actualizar el host del pooler:
   - `us-east-1` → `aws-0-us-east-1.pooler.supabase.com`
   - `us-west-1` → `aws-0-us-west-1.pooler.supabase.com`
   - etc.

### **Problema: "Invalid password" o "Authentication failed"**

**Solución:**
1. Supabase Dashboard → **Settings** → **Database**
2. Buscar **Database password**
3. Si no la recuerdas, hacer clic en **Reset database password**
4. Copiar la nueva contraseña
5. Actualizar `DATABASE_URL` en Vercel
6. Redeploy

### **Problema: "Connection timeout"**

**Solución:**
1. Verificar que el proyecto de Supabase esté activo (no pausado)
2. Verificar firewall/restricciones de red
3. Intentar con connection pooler (puerto 6543) en lugar de directo (5432)

---

## ✅ Checklist Final

- [ ] Proyecto de Supabase activo (no pausado)
- [ ] Firewall/restricciones de red deshabilitadas o configuradas
- [ ] Connection Pooler string obtenido de Supabase
- [ ] `DATABASE_URL` actualizada en Vercel (formato pooler, puerto 6543)
- [ ] Redeploy realizado en Vercel
- [ ] Endpoint `/api/diagnostico` muestra `databaseConnection: SUCCESS`
- [ ] Endpoint `/api/menu/5XJ1J37F` devuelve datos reales
- [ ] Endpoint `/api/menu/5XJ1J39E` devuelve datos reales
- [ ] `https://menuqrep.vercel.app/carta/5XJ1J37F` muestra menú real
- [ ] `https://menuqrep.vercel.app/carta/5XJ1J39E` muestra menú real
- [ ] Datos cargados en Supabase (20/190 para EP, ~6/60 para LT)

---

## 📞 Si Nada Funciona

1. **Contactar soporte de Supabase:**
   - Verificar si hay problemas conocidos
   - Solicitar ayuda con conexión desde Vercel

2. **Alternativa temporal:**
   - Usar fallback hardcodeado (ya implementado)
   - Funciona para ambos IDUs en Vercel
   - No requiere conexión a Supabase

3. **Alternativa permanente:**
   - Considerar otra base de datos (PlanetScale, Neon, etc.)
   - O usar Vercel Postgres (si está disponible)

