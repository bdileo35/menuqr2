# 🔍 Análisis Exhaustivo: Multi-tenant Logo y Links

## 📋 Problemas Identificados

### 1. **Error de Deploy (logoPublicId/primaryColor)**
- **Estado:** El archivo local está correcto, pero Vercel muestra error
- **Causa:** Posible caché de Vercel o versión anterior en el repo
- **Solución:** Verificar commit remoto y forzar redeploy

### 2. **Logo Hardcodeado por IDU**
- **Problema:** Ambos IDUs (5XJ1J37F y 5XJ1J39E) muestran el logo de "Esquina Pompeya"
- **Causa:** El logo se carga desde `menu.logoUrl` pero puede estar compartido o no configurado correctamente
- **Ubicación:** `app/carta/[idUnico]/page.tsx` línea 633

### 3. **Links de Google Maps Hardcodeados**
- **Problema:** Los links de Google Maps y Reviews usan solo el nombre del restaurante
- **Código actual:**
  ```typescript
  // Línea 1174 - Google Maps
  src={`https://www.google.com/maps?q=${encodeURIComponent(menuData?.restaurantName || 'Esquina Pompeya')}&output=embed`}
  
  // Línea 1195 - Google Reviews
  href={`https://www.google.com/search?q=${encodeURIComponent(`${menuData?.restaurantName || ''} ${menuData?.address || ''} opiniones reseñas`.trim())}`}
  ```
- **Problema:** No hay campos específicos en el schema para estos links
- **Solución:** Agregar `googleMapsUrl` y `googleReviewsUrl` al schema

---

## 🎯 Solución Propuesta

### **Paso 1: Agregar Campos al Schema**

Agregar a `prisma/schema.prisma` en el model `Menu`:

```prisma
model Menu {
  // ... campos existentes ...
  logoUrl        String?
  googleMapsUrl  String?  // URL específica de Google Maps (embed o share)
  googleReviewsUrl String? // URL específica de Google Reviews/Business
  // ... resto de campos ...
}
```

### **Paso 2: Actualizar API**

En `app/api/menu/[idUnico]/route.ts`, agregar a `formattedMenu`:

```typescript
const formattedMenu = {
  // ... campos existentes ...
  logoUrl: menu.logoUrl || '',
  googleMapsUrl: menu.googleMapsUrl || '',
  googleReviewsUrl: menu.googleReviewsUrl || '',
  // ... resto de campos ...
};
```

### **Paso 3: Actualizar Carta**

En `app/carta/[idUnico]/page.tsx`:

**Antes (hardcodeado):**
```typescript
src={`https://www.google.com/maps?q=${encodeURIComponent(menuData?.restaurantName || 'Esquina Pompeya')}&output=embed`}
```

**Después (configurable):**
```typescript
src={menuData?.googleMapsUrl || `https://www.google.com/maps?q=${encodeURIComponent(menuData?.restaurantName || '')}&output=embed`}
```

### **Paso 4: Actualizar Formulario Datos-Comercio**

En `app/datos-comercio/[idUnico]/page.tsx`, agregar campos:

```typescript
const [formData, setFormData] = useState({
  // ... campos existentes ...
  logoUrl: '',
  googleMapsUrl: '',
  googleReviewsUrl: ''
});
```

Y en el formulario, agregar inputs para estos campos.

### **Paso 5: Actualizar API de Comercio**

En `app/api/menu/[idUnico]/comercio/route.ts`, agregar soporte para guardar estos campos.

---

## 📊 Estado Actual de Datos por IDU

### **IDU: 5XJ1J37F (Esquina Pompeya)**
- Logo: Debe estar en `menus.logoUrl` donde `restaurantId = '5XJ1J37F'`
- Google Maps: Actualmente usa nombre "Esquina Pompeya"
- Google Reviews: Actualmente usa nombre + dirección

### **IDU: 5XJ1J39E (Los Toritos)**
- Logo: Debe estar en `menus.logoUrl` donde `restaurantId = '5XJ1J39E'`
- Google Maps: Actualmente usa nombre "Esquina Pompeya" (INCORRECTO)
- Google Reviews: Actualmente usa nombre "Esquina Pompeya" (INCORRECTO)

---

## ✅ Checklist de Implementación

- [ ] 1. Agregar `googleMapsUrl` y `googleReviewsUrl` al schema
- [ ] 2. Ejecutar `npx prisma db push` (o migración)
- [ ] 3. Regenerar Prisma Client: `npx prisma generate`
- [ ] 4. Actualizar API `/api/menu/[idUnico]` para devolver nuevos campos
- [ ] 5. Actualizar API `/api/menu/[idUnico]/comercio` para guardar nuevos campos
- [ ] 6. Actualizar `app/carta/[idUnico]/page.tsx` para usar links configurables
- [ ] 7. Actualizar `app/datos-comercio/[idUnico]/page.tsx` para permitir configurar links
- [ ] 8. Verificar que cada IDU tenga su logo correcto en la BD
- [ ] 9. Configurar links de Google Maps y Reviews para cada IDU
- [ ] 10. Probar con ambos IDUs (5XJ1J37F y 5XJ1J39E)

---

## 🔧 Comandos para Aplicar Cambios

```bash
# 1. Actualizar schema
# (Editar prisma/schema.prisma)

# 2. Aplicar cambios a BD
npx prisma db push

# 3. Regenerar Prisma Client
npx prisma generate

# 4. Commit y push
git add prisma/schema.prisma app/api app/carta app/datos-comercio
git commit -m "feat: Agregar googleMapsUrl y googleReviewsUrl configurables por IDU"
git push origin main
```

---

## 📝 Notas Adicionales

1. **Fallback:** Si `googleMapsUrl` o `googleReviewsUrl` están vacíos, usar el comportamiento actual (búsqueda por nombre)
2. **Validación:** Los URLs deben ser válidos (opcional, pero recomendado)
3. **Formato Google Maps:** Puede ser embed (`?output=embed`) o share link
4. **Formato Google Reviews:** Puede ser link directo a Google Business Profile

