# 📥 Importar Menú desde Markdown - Guía Rápida

Esta guía explica cómo importar un menú completo desde un archivo Markdown de forma sencilla.

---

## 🚀 Método Rápido (Recomendado)

### Opción 1: Desde el Editor (Próximamente)

1. Ve a `/editor/[idUnico]`
2. Busca el botón "Importar desde MD"
3. Pega el contenido del archivo .md
4. Click en "Importar"
5. ✅ Listo

### Opción 2: Usando la API Directamente

**Endpoint**: `POST /api/menu/[idUnico]/import-md`

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/api/menu/5XJ1J39E/import-md \
  -H "Content-Type: application/json" \
  -d '{
    "mdContent": "| Categoría | Plato | Precio |\n|-----------|-------|--------|\n| Pizzas | Muzzarela | 10000 |\n| Pizzas | Napolitana | 11500 |",
    "replaceExisting": false
  }'
```

**Ejemplo con JavaScript (fetch)**:
```javascript
const mdContent = `| Categoría | Plato | Precio |
|-----------|-------|--------|
| Pizzas | Muzzarela | 10000 |
| Pizzas | Napolitana | 11500 |`;

const response = await fetch('/api/menu/5XJ1J39E/import-md', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mdContent: mdContent,
    replaceExisting: false // true para reemplazar todo, false para agregar
  })
});

const result = await response.json();
console.log(result);
```

---

## 📋 Parámetros

### `mdContent` (requerido)
- **Tipo**: `string`
- **Descripción**: Contenido completo del archivo Markdown
- **Formato**: Ver `PLANTILLA-MENU-UNIFICADA.md`

### `replaceExisting` (opcional)
- **Tipo**: `boolean`
- **Default**: `false`
- **Descripción**: 
  - `false`: Agrega items a las categorías existentes
  - `true`: Elimina todas las categorías e items y crea nuevos

---

## ✅ Respuesta Exitosa

```json
{
  "success": true,
  "message": "Menú importado exitosamente",
  "data": {
    "menuId": "cmhunwmw80002gas0jkt7tk4b",
    "categoriesCount": 5,
    "itemsWithCategory": 45,
    "itemsWithoutCategory": 2,
    "totalItems": 47
  }
}
```

---

## 🔍 Items Sin Categoría

La API soporta items sin categoría (para platos discontinuados temporalmente):

```markdown
| Categoría | Plato | Precio |
|-----------|-------|--------|
| Pizzas | Muzzarela | 10000 |
|           | Milanesa (discontinuada) | 8000 |  ← Sin categoría
```

**Comportamiento**:
- ✅ Se guardan en la BD con `categoryId = null`
- ✅ **NO se muestran en la carta pública** (solo items con categoría)
- ✅ Se pueden ver/editar en el editor
- ✅ Se pueden reactivar moviéndolos a una categoría

---

## 📝 Ejemplo Completo

```javascript
// 1. Obtener contenido del MD (desde archivo, IA, etc.)
const mdContent = `
| Código | Categoría | Plato | Precio | Descripción |
|--------|-----------|-------|--------|-------------|
| 0101   | Pizzas    | Muzzarela | 10000 | Clásica de muzza |
| 0102   | Pizzas    | Napolitana | 11500 | Con ajo opcional |
|        |           | Milanesa (temp) | 8000 | Discontinuada |
| 0201   | Empanadas | Empanadas Carne | 1800 | |
`;

// 2. Importar
const response = await fetch('/api/menu/5XJ1J39E/import-md', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mdContent: mdContent,
    replaceExisting: false
  })
});

// 3. Verificar resultado
if (response.ok) {
  const result = await response.json();
  console.log(`✅ Importados: ${result.data.totalItems} items`);
} else {
  const error = await response.json();
  console.error('❌ Error:', error.error);
}
```

---

## 🎯 Casos de Uso

### Caso 1: Importar desde IA
1. Genera el MD con ChatGPT/Claude usando la plantilla
2. Copia el contenido
3. Usa la API para importar
4. ✅ Listo

### Caso 2: Importar desde Excel/Word
1. Convierte a formato tabla Markdown
2. Usa la API para importar
3. ✅ Listo

### Caso 3: Actualizar Menú Existente
1. Genera nuevo MD con cambios
2. Usa `replaceExisting: true` para reemplazar todo
3. O usa `replaceExisting: false` para agregar items nuevos
4. ✅ Listo

---

## ⚠️ Errores Comunes

### Error: "mdContent es requerido"
- **Causa**: No se envió el parámetro `mdContent`
- **Solución**: Asegúrate de incluir `mdContent` en el body

### Error: "No se encontró menú para IDU"
- **Causa**: El IDU no existe en la BD
- **Solución**: Verifica que el IDU sea correcto y que el menú exista

### Error: "Error al parsear MD"
- **Causa**: Formato del MD incorrecto
- **Solución**: Revisa el formato usando `PLANTILLA-MENU-UNIFICADA.md`

---

## 🔧 Próximas Mejoras

- [ ] Interfaz visual en el editor para importar MD
- [ ] Validación de formato en tiempo real
- [ ] Preview antes de importar
- [ ] Importación desde archivo (drag & drop)
- [ ] Soporte para múltiples formatos (CSV, Excel)

---

## 📞 Soporte

Si tienes problemas:
1. Verifica el formato del MD
2. Revisa los logs del servidor
3. Prueba con un MD pequeño primero
4. Contacta al administrador



