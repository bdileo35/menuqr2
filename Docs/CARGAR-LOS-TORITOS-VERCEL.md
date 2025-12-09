# 🔧 Cargar Los Toritos (5XJ1J39E) en Vercel/Supabase

## 🔴 Problema Actual

- **Local:** ✅ Funciona correctamente (SQLite)
- **Vercel:** ❌ Error "No se pudo conectar a la base de datos"
- **Causa:** Los datos de Los Toritos no están en Supabase

## ✅ Solución: Cargar Datos desde Vercel

### **Opción 1: Usar Endpoint de Seed (RECOMENDADO)**

Ejecutar el endpoint de seed directamente desde Vercel:

```bash
curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos
```

Este endpoint:
- ✅ Crea el usuario de Los Toritos
- ✅ Crea el menú con ID `5XJ1J39E`
- ✅ Crea 6 categorías
- ✅ Crea ~60 items

### **Opción 2: Verificar DATABASE_URL en Vercel**

1. Ir a Vercel Dashboard
2. Settings → Environment Variables
3. Verificar que `DATABASE_URL` esté configurada:
   ```
   postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres?sslmode=require
   ```
4. Si no está, agregarla
5. Hacer redeploy

### **Opción 3: Verificar Schema en Supabase**

Asegurarse de que el schema esté aplicado en Supabase:

```bash
# Desde local (con DATABASE_URL apuntando a Supabase)
npx prisma db push
```

## 📋 Pasos Completos

1. **Verificar conexión:**
   ```bash
   curl https://menuqrep.vercel.app/api/health
   ```

2. **Cargar datos de Los Toritos:**
   ```bash
   curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos
   ```

3. **Verificar que se cargó:**
   ```bash
   curl https://menuqrep.vercel.app/api/menu/5XJ1J39E
   ```

4. **Probar en navegador:**
   ```
   https://menuqrep.vercel.app/carta/5XJ1J39E
   ```

## 🔍 Verificar Datos en Supabase

Si tienes acceso a Supabase Dashboard:

1. Ir a Table Editor
2. Verificar tabla `menus`:
   - Debe existir un registro con `restaurantId = '5XJ1J39E'`
3. Verificar tabla `categories`:
   - Debe haber 6 categorías para ese menú
4. Verificar tabla `menu_items`:
   - Debe haber ~60 items

## ⚠️ Notas Importantes

- El endpoint `/api/seed-los-toritos` limpia y recrea los datos
- Si ya existen datos, se eliminarán y se recrearán
- El proceso puede tardar unos segundos

