# 🎯 Pasos SIMPLES para Conectar Supabase

## ✅ Prioridad #1: Conectar la Base de Datos

**Sí, es el paso más importante.** Sin conexión, no podemos cargar los datos reales.

---

## 📝 PASO 1: Ir a Connection Pooling (MUY IMPORTANTE)

### **¿Por qué Connection Pooler?**
- Vercel funciona mejor con el pooler (puerto 6543)
- El directo (puerto 5432) tiene problemas con IPv4

### **Cómo encontrarlo:**

1. **Supabase Dashboard** → Tu proyecto `vzcniaopxflpgrwarnvn` (MenuQR)

2. **En el sidebar izquierdo**, busca:
   - **"Database"** (icono de base de datos/grid)
   - O **"Settings"** (icono de engranaje) → luego **"Database"**

3. **En la página de Database**, busca una sección que diga:
   - **"Connection Pooling"** 
   - O **"Connection string"**
   - O **"Connect to your project"** (botón verde)

4. **Si ves "Connect to your project":**
   - Haz clic ahí
   - Se abre un modal
   - En el modal, busca la pestaña **"Connection String"**
   - Cambia el dropdown **"Method"** de **"Direct connection"** a **"Session Pooler"** o **"Transaction Pooler"**

5. **Copia el connection string** que aparece (debe tener puerto 6543)

---

## 📝 PASO 2: Verificar Firewall (Opcional, pero importante)

### **Dónde está:**

1. **Supabase Dashboard** → Tu proyecto

2. **Settings** (engranaje) → **Database**

3. **Busca en la página:**
   - **"Network Restrictions"**
   - **"IP Allowlist"**
   - **"Firewall"**
   - **"Connection Security"**

4. **Si NO encuentras ninguna de estas opciones:**
   - **No te preocupes.** Probablemente no está habilitado
   - **Continúa al siguiente paso**

---

## 📝 PASO 3: Actualizar en Vercel

1. **Vercel Dashboard** → Tu proyecto `menuqrep`
2. **Settings** → **Environment Variables**
3. Buscar `DATABASE_URL`
4. **Editar** y pegar el connection string del pooler (del PASO 1)
5. **Reemplazar `[YOUR_PASSWORD]`** con tu contraseña real
6. **Guardar**
7. **Redeploy** (Deployments → 3 puntos → Redeploy)

---

## 🔍 Si NO Encuentras Connection Pooling

**Alternativa más simple:**

1. En el modal "Connect to your project"
2. En la sección de **"IPv4 Compatibility Warning"**
3. Haz clic en el botón **"Pooler settings"**
4. Ahí deberías ver las opciones del pooler

---

## 📞 Si Aún No Lo Encuentras

**Dime:**
- ¿Qué ves en la página de Database?
- ¿Hay algún botón que diga "Connect" o "Connection"?
- ¿Qué opciones ves en Settings → Database?

**Y te guío paso a paso con lo que veas.**

---

## ✅ Checklist Simple

- [ ] Encontré Connection Pooling o "Connect to your project"
- [ ] Copié el connection string del pooler (puerto 6543)
- [ ] Actualicé DATABASE_URL en Vercel con ese string
- [ ] Reemplacé [YOUR_PASSWORD] con mi contraseña real
- [ ] Guardé en Vercel
- [ ] Hice Redeploy
- [ ] Probé el endpoint `/api/diagnostico`

