# ✅ Cómo Cargar Datos a Supabase (MUY FÁCIL)

## 🎯 Resumen

**NO es complicado.** Los datos ya están en el código, solo necesitas ejecutar 2 comandos cuando la conexión a Supabase funcione.

---

## 📊 Datos Disponibles

### **Esquina Pompeya (5XJ1J37F)**
- ✅ **20 categorías** (ya en el código)
- ✅ **190 platos** (ya en el código)
- ✅ **Con descripciones** (ya en el código)
- ✅ **Con precios** (ya en el código)

### **Los Toritos (5XJ1J39E)**
- ✅ **6 categorías** (ya en el código)
- ✅ **~60 platos** (ya en el código)
- ✅ **Con descripciones** (ya en el código)
- ✅ **Con precios** (ya en el código)

---

## 🚀 Pasos (Solo 2 comandos)

### **Paso 1: Cargar Esquina Pompeya**

Una vez que la conexión a Supabase funcione, ejecuta:

```bash
curl -X POST https://menuqrep.vercel.app/api/seed-demo
```

**Esto carga:**
- Usuario de Esquina Pompeya
- Menú completo
- 20 categorías
- 190 platos con descripciones y precios

**Tiempo:** ~10-15 segundos

### **Paso 2: Cargar Los Toritos**

```bash
curl -X POST https://menuqrep.vercel.app/api/seed-los-toritos
```

**Esto carga:**
- Usuario de Los Toritos
- Menú completo
- 6 categorías
- ~60 platos con descripciones y precios

**Tiempo:** ~5-10 segundos

---

## ✅ Verificar que se Cargaron

```bash
# Verificar Esquina Pompeya
curl https://menuqrep.vercel.app/api/menu/5XJ1J37F | jq '.menu.categories | length'
# Debe mostrar: 20

curl https://menuqrep.vercel.app/api/menu/5XJ1J37F | jq '[.menu.categories[].items[]] | length'
# Debe mostrar: 190

# Verificar Los Toritos
curl https://menuqrep.vercel.app/api/menu/5XJ1J39E | jq '.menu.categories | length'
# Debe mostrar: 6

curl https://menuqrep.vercel.app/api/menu/5XJ1J39E | jq '[.menu.categories[].items[]] | length'
# Debe mostrar: ~60
```

---

## 📋 ¿Qué Hacen los Endpoints?

Los endpoints `/api/seed-demo` y `/api/seed-los-toritos`:

1. ✅ **Crean el usuario** (si no existe)
2. ✅ **Crean el menú** (si no existe)
3. ✅ **Limpian datos anteriores** (si existen)
4. ✅ **Crean todas las categorías**
5. ✅ **Crean todos los platos** con:
   - Nombre
   - Precio
   - Descripción
   - Código
   - Categoría asignada

**Todo automático.** No necesitas hacer nada manual.

---

## ⚠️ Importante

**Solo funciona si:**
- ✅ La conexión a Supabase está funcionando
- ✅ El schema está aplicado en Supabase
- ✅ `DATABASE_URL` está configurada correctamente en Vercel

**Si la conexión no funciona:**
- Los endpoints fallarán con error de conexión
- Primero hay que arreglar la conexión (ver `PLAN-CONEXION-SUPABASE-FINAL.md`)

---

## 🎯 Resumen Final

**NO es complicado porque:**
1. ✅ Los datos ya están en el código
2. ✅ Solo necesitas ejecutar 2 comandos
3. ✅ Todo es automático
4. ✅ No necesitas editar nada manualmente

**Lo único que falta:**
- Arreglar la conexión a Supabase (ver plan en `PLAN-CONEXION-SUPABASE-FINAL.md`)
- Una vez que funcione, ejecutar los 2 comandos arriba
- ¡Listo! 🎉

