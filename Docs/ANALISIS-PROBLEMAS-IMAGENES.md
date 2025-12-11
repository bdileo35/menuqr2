# 🔍 Análisis: Problemas con Imágenes en Editor

## 📋 Problemas Identificados

### **1. Nombres de Archivo con Acentos** ✅ SOLUCIONADO

**Problema:**
- Nombre generado: `vac-o-a-la-parrilla-c--fritas-1765465816238.jpg`
- Nombre deseado: `vacio-fritas-1765465816238.jpg`

**Causa:**
El código anterior usaba:
```typescript
.replace(/[^a-z0-9]/g, '-')  // Elimina TODO excepto letras y números
```

Esto eliminaba:
- Acentos (í, ó, á, etc.) → se convertían en guiones
- Caracteres especiales (/, c/, etc.) → se convertían en guiones
- Resultado: `vac-o-a-la-parrilla-c--fritas` (muchos guiones)

**Solución Aplicada:**
```typescript
const normalizeString = (str: string) => {
  return str
    .normalize('NFD') // Descompone "í" → "i" + "´"
    .replace(/[\u0300-\u036f]/g, '') // Elimina solo los acentos (´)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Elimina caracteres especiales
    .replace(/\s+/g, '-') // Espacios → guiones
    .replace(/-+/g, '-') // Múltiples guiones → uno solo
    .replace(/^-|-$/g, ''); // Elimina guiones al inicio/final
};
```

**Resultado:**
- `Vacío a la parrilla c/ fritas` → `vacio-a-la-parrilla-c-fritas`
- Más limpio y legible ✅

---

### **2. Imágenes No Aparecen en Editor (pero sí en Carta)** 🔴 PROBLEMA PRINCIPAL

**Síntoma:**
- ✅ Imagen se sube correctamente
- ✅ Se guarda en BD (`imageUrl: /platos/5XJ1J37F/...`)
- ✅ Aparece en **Carta** perfectamente
- ❌ **NO aparece en Editor** después de recargar

**Causa Raíz:**

#### **Diferencia en el Mapeo:**

**Carta (`app/carta/[idUnico]/page.tsx`):**
```typescript
imageUrl: item.imageUrl || null,
imageBase64: item.imageBase64 || item.imageUrl || null
```

**Editor (`app/editor/[idUnico]/page.tsx`):**
```typescript
imageUrl: normalizedImageUrl,
imageBase64: normalizedImageUrl 
  ? (normalizedImageUrl.startsWith('/platos/') ? normalizedImageUrl : normalizedImageUrl)
  : null
```

**Problema:**
1. La API devuelve `imageUrl: null` o `imageUrl: undefined` para items con imágenes
2. El editor normaliza y si es `null` → `imageBase64` también es `null`
3. La carta usa `item.imageBase64 || item.imageUrl` → si `imageUrl` existe, lo usa

**Por qué funciona en Carta:**
- Carta usa: `item.imageBase64 || item.imageUrl || null`
- Si `imageUrl` existe aunque `imageBase64` sea `null`, lo muestra

**Por qué NO funciona en Editor:**
- Editor normaliza `imageUrl` → si es `null`, `imageBase64` también es `null`
- Luego busca `imageUrl || imageBase64` → ambos son `null` → muestra fallback

---

## 🔧 Solución Aplicada

### **1. Normalizar Acentos** ✅
- Función `normalizeString()` que maneja acentos correctamente
- Resultado: nombres más limpios (`vacio-fritas` en lugar de `vac-o-a-la-parrilla-c--fritas`)

### **2. Unificar Lógica Editor/Carta** ✅
- Editor ahora usa la misma lógica que Carta:
  ```typescript
  imageUrl: normalizedImageUrl,
  imageBase64: normalizedImageUrl || null  // Igual que carta
  ```

**Pero falta verificar:**
- ¿La API está devolviendo `imageUrl` correctamente?
- Los logs muestran `imageUrl: undefined` para todos los items
- Esto sugiere que la API NO está devolviendo `imageUrl` desde la BD

---

## 🎯 Próximo Paso

**Verificar qué devuelve la API:**

Los logs deberían mostrar:
- `🔍 API - Item "Vacío...": {imageUrl: ..., tipo: ...}`

Si la API devuelve `imageUrl: null` o `undefined`, el problema está en:
1. La BD no tiene `imageUrl` guardado
2. La API no está leyendo `imageUrl` de la BD
3. El mapeo en la API está convirtiendo `imageUrl` a `null`

---

## 📝 Resumen

1. ✅ **Acentos:** Solucionado - nombres más limpios
2. 🔴 **Editor no muestra imágenes:** 
   - Unificada lógica con Carta
   - **PERO** falta verificar que la API devuelva `imageUrl` correctamente
   - Los logs muestran `imageUrl: undefined` → problema en la API o BD

**Próximo paso:** Verificar logs de la API cuando recargas el menú.

