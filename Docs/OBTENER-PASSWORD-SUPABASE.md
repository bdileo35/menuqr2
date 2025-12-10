# 🔑 Cómo Obtener la Contraseña de Supabase

## ❓ ¿Por qué no se muestra la contraseña?

Supabase **nunca muestra la contraseña** por seguridad. Siempre verás `[YOUR_PASSWORD]` como placeholder.

## ✅ Solución: Obtener o Resetear la Contraseña

### **Opción 1: Si ya tienes la contraseña configurada**

Si ya configuraste `DATABASE_URL` en Vercel antes, la contraseña está ahí:

1. Vercel Dashboard → Settings → Environment Variables
2. Buscar `DATABASE_URL`
3. La contraseña está después de `postgres:` y antes de `@`
   ```
   postgresql://postgres:TU_PASSWORD_AQUI@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres
   ```

### **Opción 2: Resetear la contraseña (si no la recuerdas)**

1. **Ir a Supabase Dashboard:**
   - Proyecto: `vzcniaopxflpgrwarnvn` (MenuQR)
   - Settings → Database

2. **Buscar sección "Database password":**
   - Debe estar en la parte superior de la página

3. **Hacer clic en "Reset database password"** o "Reset password"

4. **Copiar la nueva contraseña:**
   - ⚠️ **IMPORTANTE:** Solo se muestra UNA VEZ
   - Cópiala inmediatamente
   - Guárdala en un lugar seguro

5. **Actualizar en Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Editar `DATABASE_URL`
   - Reemplazar la contraseña antigua con la nueva
   - Guardar
   - **Redeploy**

## 🔍 Dónde Encontrar Database Settings

1. Supabase Dashboard
2. Seleccionar proyecto `vzcniaopxflpgrwarnvn`
3. **Settings** (icono de engranaje en el sidebar izquierdo)
4. **Database** (en el menú de Settings)
5. Buscar sección **"Database password"** o **"Connection string"**

## ⚠️ Advertencia Importante

- La contraseña solo se muestra **UNA VEZ** cuando la reseteas
- Si la pierdes, tendrás que resetearla de nuevo
- Guarda la contraseña en un lugar seguro (password manager, etc.)

## 📋 Checklist

- [ ] Ir a Supabase Dashboard → Settings → Database
- [ ] Buscar "Database password" o "Reset database password"
- [ ] Resetear la contraseña (si no la recuerdas)
- [ ] Copiar la contraseña inmediatamente
- [ ] Actualizar `DATABASE_URL` en Vercel con la nueva contraseña
- [ ] Guardar cambios en Vercel
- [ ] Hacer Redeploy en Vercel

