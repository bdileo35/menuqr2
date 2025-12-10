# 🔍 Cómo Funciona el Fallback (Explicación Simple)

## ❓ Tu Pregunta: "¿Cómo va a ver otros datos que no sean los DEMO?"

## ✅ Respuesta Simple

**El fallback SOLO se activa cuando hay un ERROR.** Si la conexión funciona y hay datos reales en la base de datos, verás los datos reales.

---

## 🔄 Cómo Funciona el Código

### **Flujo Normal (Datos Reales):**

1. La página intenta cargar datos desde `/api/menu/5XJ1J37F`
2. El API consulta Supabase
3. **Si encuentra datos** → Devuelve los datos reales
4. La página muestra los datos reales ✅

### **Flujo con Fallback (Datos Demo):**

1. La página intenta cargar datos desde `/api/menu/5XJ1J39E`
2. El API consulta Supabase
3. **Si hay ERROR** (500, conexión fallida, etc.) → Entra al `catch`
4. El `catch` verifica: ¿Estamos en Vercel? ¿Es 5XJ1J37F o 5XJ1J39E?
5. Si es SÍ → Muestra datos demo ⚠️

---

## 🔴 Problema Actual

**Los Toritos (5XJ1J39E) muestra datos demo porque:**

1. El API busca el menú en Supabase
2. **NO encuentra datos** (porque no se cargaron aún)
3. Devuelve error 404 o 500
4. El código entra al `catch`
5. Activa el fallback → Muestra datos demo

**Esquina Pompeya (5XJ1J37F) muestra datos demo porque:**

1. Probablemente también hay un error (404 o 500)
2. O los datos en la BD no están completos
3. El fallback se activa

---

## ✅ Solución

### **Paso 1: Cargar Datos Reales en Supabase**

Una vez que cargues los datos reales:

```bash
# Cargar Esquina Pompeya
curl -X POST https://menuqrep.vercel.app/api/seed-demo

# Cargar Los Toritos
curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos
```

### **Paso 2: Verificar que se Cargaron**

```bash
# Verificar Esquina Pompeya
curl https://menuqrep.vercel.app/api/menu/5XJ1J37F

# Verificar Los Toritos
curl https://menuqrep.vercel.app/api/menu/5XJ1J39E
```

**Si devuelve datos reales** → El fallback NO se activará
**Si devuelve error** → El fallback se activará (mostrará demo)

---

## 🎯 Resumen

- **Fallback = Plan B** (solo si falla la conexión o no hay datos)
- **Datos Reales = Plan A** (si la conexión funciona y hay datos)
- **Para ver datos reales:** Carga los datos en Supabase primero
- **El fallback desaparece automáticamente** cuando hay datos reales

---

## 🔧 Código Actual

El fallback está en `app/carta/[idUnico]/page.tsx` línea 465-496:

```typescript
// FALLBACK: Solo en Vercel, usar datos demo si falla la conexión
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

if (isVercel && (idUnico === '5XJ1J37F' || idUnico === '5XJ1J39E')) {
  // Muestra datos demo
}
```

**Este código SOLO se ejecuta si hay un error.** Si no hay error, nunca se ejecuta.

