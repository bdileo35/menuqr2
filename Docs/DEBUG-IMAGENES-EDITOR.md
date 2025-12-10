# 🐛 Debug: Problema de Imágenes en Editor

## 🔍 Problema Reportado

**Síntoma:**
- ✅ La imagen se sube correctamente
- ✅ Se guarda en la BD (mensaje de éxito)
- ❌ **Pero no aparece** después de guardar
- ❌ Se muestra el icono de cubiertos (fallback)

---

## 🔧 Cambios Realizados

### **1. Mejorar Mapeo de Imágenes al Recargar**

**Archivo:** `app/editor/[idUnico]/page.tsx` (línea ~454)

**Antes:**
```typescript
imageUrl: item.imageUrl || null,
imageBase64: (item.imageUrl && item.imageUrl.startsWith('/platos/')) ? item.imageUrl : (item.imageUrl || null)
```

**Después:**
```typescript
// Asegurar que imageUrl se mantenga si existe
imageUrl: item.imageUrl || null,
// Si imageUrl es una URL de archivo, también ponerla en imageBase64 para compatibilidad
imageBase64: item.imageUrl && item.imageUrl.startsWith('/platos/') 
  ? item.imageUrl 
  : (item.imageUrl || null)
```

**Agregado:** Logs de debug para verificar `imageUrl` de cada item.

---

### **2. Mejorar Visualización de Imágenes**

**Archivo:** `app/editor/[idUnico]/page.tsx` (línea ~1130)

**Cambios:**
- Lógica más clara para determinar qué imagen mostrar
- Logs de debug cuando se carga/falla una imagen
- Mejor manejo de errores

**Código:**
```typescript
{(() => {
  // Determinar la URL de la imagen a mostrar
  let imageSrc = '';
  if (item.imageUrl && item.imageUrl.startsWith('/platos/')) {
    imageSrc = item.imageUrl;
  } else if (item.imageBase64) {
    imageSrc = item.imageBase64;
  } else if (item.imageUrl) {
    imageSrc = item.imageUrl;
  }
  
  return imageSrc ? (
    <img 
      src={imageSrc}
      onError={(e) => {
        console.error(`❌ Error cargando imagen para "${item.name}":`, imageSrc);
        // ... mostrar fallback
      }}
      onLoad={() => {
        console.log(`✅ Imagen cargada correctamente para "${item.name}"`);
      }}
    />
  ) : (
    // Fallback: icono de cubiertos
  );
})()}
```

---

### **3. Corregir Preview en Modal de Edición**

**Archivo:** `app/editor/[idUnico]/page.tsx` (línea ~523)

**Problema:** El modal usaba solo `item.imageBase64`, ignorando `item.imageUrl`.

**Solución:**
```typescript
// Determinar la imagen a mostrar en el preview
const imagePreview = (item.imageUrl && item.imageUrl.startsWith('/platos/'))
  ? item.imageUrl
  : (item.imageBase64 || item.imageUrl || '');
```

---

## 📋 Logs de Debug Agregados

1. **Al subir imagen:**
   ```typescript
   console.log('✅ Imagen subida:', finalImageUrl);
   ```

2. **Al recargar menú:**
   ```typescript
   if (item.imageUrl) {
     console.log(`🖼️ Item "${item.name}": imageUrl =`, item.imageUrl);
   }
   ```

3. **Al abrir modal:**
   ```typescript
   console.log(`🖼️ Abriendo modal para "${item.name}":`, {
     imageUrl: item.imageUrl,
     imageBase64: item.imageBase64,
     imagePreview
   });
   ```

4. **Al cargar/fallar imagen:**
   ```typescript
   onLoad: () => console.log(`✅ Imagen cargada correctamente`);
   onError: () => console.error(`❌ Error cargando imagen`);
   ```

---

## 🧪 Cómo Probar

1. **Abrir consola del navegador** (F12)
2. **Subir una imagen** en el editor
3. **Verificar logs:**
   - `✅ Imagen subida: /platos/5XJ1J37F/nombre.jpg`
   - `🖼️ Item "...": imageUrl = /platos/5XJ1J37F/nombre.jpg`
4. **Verificar que la imagen aparece** después de guardar
5. **Si no aparece, revisar logs de error:**
   - `❌ Error cargando imagen para "...": /platos/...`

---

## ⚠️ Posibles Causas

### **1. Imagen no existe en el servidor**
- **Causa:** En Vercel, archivos en `/public` no persisten entre deploys
- **Solución:** Implementar Supabase Storage (ver `PROBLEMA-IMAGENES-VERCEL.md`)

### **2. URL incorrecta**
- **Causa:** La URL guardada en BD no coincide con la ruta real
- **Solución:** Verificar logs de `imageUrl` en consola

### **3. Caché del navegador**
- **Causa:** El navegador está mostrando una versión en caché
- **Solución:** Hard refresh (Ctrl+Shift+R) o limpiar caché

### **4. Problema de CORS o permisos**
- **Causa:** El servidor no permite acceder a la imagen
- **Solución:** Verificar configuración de Next.js para archivos estáticos

---

## 🎯 Próximos Pasos

1. **Probar en local** con los logs
2. **Verificar qué muestra la consola** cuando subes una imagen
3. **Si el problema persiste:**
   - Revisar logs de error en consola
   - Verificar que la imagen existe en `/public/platos/{idUnico}/`
   - Considerar implementar Supabase Storage para persistencia

---

## 📝 Notas

- Los logs de debug ayudarán a identificar exactamente dónde falla
- Si la imagen se guarda pero no aparece, el problema es de visualización
- Si la imagen no se guarda, el problema es en el endpoint de upload

