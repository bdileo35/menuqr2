# ⚠️ Problema: Imágenes no persisten en Vercel

## 🔍 Problema Identificado

### **Síntoma:**
- ✅ La imagen se sube correctamente
- ✅ Se guarda `imageUrl` en la base de datos
- ✅ El mensaje dice "Producto actualizado correctamente"
- ❌ Pero la imagen **no aparece** después de guardar

### **Causa Raíz:**

En **Vercel**, los archivos en `/public` **NO persisten** entre deploys:

1. Cuando subes una imagen → Se guarda en `/public/platos/{idUnico}/nombre.jpg`
2. El archivo existe en el servidor **temporalmente**
3. En el **próximo deploy** → El archivo se **pierde**
4. La URL en la BD (`/platos/...`) apunta a un archivo que **ya no existe**

---

## ✅ Solución Temporal (Funciona para Testing)

**Código corregido para mostrar imágenes correctamente:**

1. **Editor:** Usa `imageUrl` cuando es una URL de archivo (`/platos/...`)
2. **Carta:** Ya funciona correctamente (usa `imageUrl` si empieza con `/platos/`)

**Resultado:** Las imágenes se muestran **mientras el servidor no se reinicie**.

---

## 🚀 Solución Permanente (Recomendada)

### **Opción 1: Supabase Storage** (Recomendado)

1. **Crear bucket en Supabase:**
   - Nombre: `menu-images`
   - Público: ✅ Sí

2. **Modificar `/api/menu/[idUnico]/upload-image/route.ts`:**
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   );
   
   // Subir a Supabase Storage
   const { data, error } = await supabase.storage
     .from('menu-images')
     .upload(`${idUnico}/${fileName}`, imageBuffer, {
       contentType: `image/${imageType}`,
       upsert: true
     });
   
   // Obtener URL pública
   const { data: { publicUrl } } = supabase.storage
     .from('menu-images')
     .getPublicUrl(`${idUnico}/${fileName}`);
   
   return NextResponse.json({
     success: true,
     imageUrl: publicUrl  // URL pública de Supabase
   });
   ```

3. **Ventajas:**
   - ✅ Persistente (no se pierde en deploys)
   - ✅ Escalable
   - ✅ CDN incluido
   - ✅ Gratis hasta cierto límite

### **Opción 2: Cloudinary** (Alternativa)

Similar a Supabase Storage, pero con Cloudinary.

### **Opción 3: Base64 en BD** (No recomendado)

Guardar imágenes como base64 en la BD:
- ❌ Lento
- ❌ Ocupa mucho espacio
- ❌ Límites de tamaño

---

## 📋 Pasos Inmediatos

### **1. Verificar que el código funciona:**
- ✅ Código corregido para usar `imageUrl` correctamente
- ✅ Fallback a icono de cubiertos si no hay imagen

### **2. Probar en Vercel:**
1. Subir una imagen
2. Verificar que se guarda `imageUrl` en BD
3. Verificar que la imagen aparece **inmediatamente**
4. ⚠️ **Nota:** La imagen se perderá en el próximo deploy

### **3. Implementar Supabase Storage (Después):**
- Cuando tengas tiempo
- Para persistencia permanente

---

## 🎯 Estado Actual

- ✅ **Código corregido:** Imágenes se muestran correctamente
- ⚠️ **Limitación:** Imágenes se pierden en cada deploy de Vercel
- ✅ **Funciona para:** Testing y demostración
- 🚀 **Próximo paso:** Implementar Supabase Storage para producción

---

## 💡 Nota Importante

**Para entregar ahora:**
- ✅ El código funciona
- ✅ Las imágenes se muestran **mientras el servidor está activo**
- ⚠️ Si haces un nuevo deploy, las imágenes se pierden

**Para producción:**
- 🚀 Implementar Supabase Storage
- ✅ Las imágenes persistirán permanentemente

