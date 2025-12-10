# 📁 Estructura de Imágenes - Directorio por Defecto

## ✅ Directorio Estándar

**Todas las imágenes se guardan en:**
```
/public/platos/{idUnico}/
```

**Ejemplo:**
- Esquina Pompeya (`5XJ1J37F`) → `/public/platos/5XJ1J37F/`
- Los Toritos (`5XJ1J39E`) → `/public/platos/5XJ1J39E/`

---

## 🔍 Verificación de Implementación

### **1. Endpoint de Upload** ✅
**Archivo:** `app/api/menu/[idUnico]/upload-image/route.ts`

```typescript
// Ruta del directorio: public/platos/{idUnico}
const uploadDir = path.join(process.cwd(), 'public', 'platos', idUnico);

// URL relativa para usar en el frontend
const imageUrl = `/platos/${idUnico}/${fileName}`;
```

**✅ Correcto:** Usa `/public/platos/{idUnico}/`

---

### **2. Editor** ✅
**Archivo:** `app/editor/[idUnico]/page.tsx`

- ✅ Sube imágenes a `/api/menu/${idUnico}/upload-image`
- ✅ Recibe `imageUrl` como `/platos/${idUnico}/nombre.jpg`
- ✅ Guarda `imageUrl` en la base de datos
- ✅ Muestra imágenes usando `imageUrl` si empieza con `/platos/`

**✅ Correcto:** Usa directorio por `idUnico`

---

### **3. Carta (Visualización)** ✅
**Archivo:** `app/carta/[idUnico]/page.tsx`

- ✅ Prioriza `imageUrl` si empieza con `/platos/`
- ✅ Fallbacks usan `/platos/${idUnico}/...`
- ✅ Muestra icono de cubiertos si no hay imagen

**✅ Correcto:** Usa directorio por `idUnico`

---

## 📋 Estructura de Archivos

```
MenuQR/
├── public/
│   └── platos/
│       ├── 5XJ1J37F/          # Esquina Pompeya
│       │   ├── vacio-papas-1234567890.jpg
│       │   ├── milanesa-1234567891.jpg
│       │   └── ...
│       └── 5XJ1J39E/          # Los Toritos
│           ├── pizza-1234567892.jpg
│           └── ...
```

---

## 🎯 URLs en Base de Datos

**Formato guardado en `menuItem.imageUrl`:**
```
/platos/{idUnico}/{nombre-archivo}.jpg
```

**Ejemplos:**
- `/platos/5XJ1J37F/vacio-papas-1234567890.jpg`
- `/platos/5XJ1J39E/pizza-1234567892.jpg`

---

## ✅ Verificación Completa

- ✅ **Upload:** Guarda en `/public/platos/{idUnico}/`
- ✅ **Editor:** Muestra desde `/platos/{idUnico}/...`
- ✅ **Carta:** Muestra desde `/platos/{idUnico}/...`
- ✅ **Fallbacks:** Usan `/platos/${idUnico}/...`
- ✅ **Multi-tenant:** Cada restaurante tiene su directorio

---

## 🚀 Estado Actual

**✅ TODO CORRECTO:** Todas las imágenes usan el directorio `/public/platos/{idUnico}/` por defecto.

**Nota:** En Vercel, estos archivos no persisten entre deploys. Para producción, considerar Supabase Storage (ver `PROBLEMA-IMAGENES-VERCEL.md`).

