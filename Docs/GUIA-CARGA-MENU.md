# 📖 Guía de Carga de Menú - MenuQR

Esta guía explica cómo cargar un menú completo usando archivos Markdown (.md).

---

## 🎯 ¿Cuándo Usar Esta Guía?

- ✅ Tienes un menú grande (más de 20 platos)
- ✅ Quieres cargar el menú rápidamente
- ✅ Tienes el menú en formato digital (Word, PDF, Excel)
- ✅ Quieres usar IA para generar el formato

---

## 📋 Paso 1: Preparar el Archivo .MD

### Opción A: Crear Manualmente

1. Crea un archivo: `Menu_[Nombre_Comercio].md`
2. Usa la plantilla: `PLANTILLA-MENU-UNIFICADA.md`
3. Copia y pega tus platos en formato tabla

### Opción B: Usar IA (Recomendado)

**Prompt para ChatGPT/Claude**:
```
Necesito convertir este menú a formato Markdown tabla con esta estructura:

| Código | Categoría | Plato | Precio | Descripción | Imagen |
|--------|-----------|-------|--------|-------------|--------|

Reglas:
- Código: opcional, formato 0101 (categoría + número)
- Categoría: nombre de la categoría
- Plato: nombre del plato
- Precio: solo números (sin $)
- Descripción: opcional
- Imagen: opcional

Aquí está mi menú:
[PEGAR MENÚ AQUÍ]
```

**Ejemplo de respuesta de IA**:
```markdown
| Código | Categoría | Plato | Precio | Descripción | Imagen |
|--------|-----------|-------|--------|-------------|--------|
| 0101   | Pizzas    | Muzzarela | 10000 | Clásica de muzza | muzzarela.jpg |
| 0102   | Pizzas    | Napolitana | 11500 | Con ajo opcional | napolitana.jpg |
```

---

## 📁 Paso 2: Guardar el Archivo

**Ubicación**: `MenuQR/Docs/Menu_[Nombre_Comercio].md`

**Ejemplos**:
- `MenuQR/Docs/Menu_Esquina_Pompeya.md`
- `MenuQR/Docs/Menu_los_toritos.md`
- `MenuQR/Docs/Menu_Mi_Restaurante.md`

---

## 🔧 Paso 3: Cargar el Menú

### Método 1: API (Recomendado)

**Endpoint**: `POST /api/seed-from-md`

**Body**:
```json
{
  "idUnico": "5XJ1J39E",
  "archivoMD": "contenido del archivo .md como string"
}
```

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/api/seed-from-md \
  -H "Content-Type: application/json" \
  -d '{
    "idUnico": "5XJ1J39E",
    "archivoMD": "| Código | Categoría | Plato | Precio |\n|--------|-----------|-------|--------|\n| 0101   | Pizzas    | Muzzarela | 10000 |"
  }'
```

### Método 2: Script Local

**Ubicación**: `MenuQR/scripts/crear-restaurante.ts`

**Uso**:
```bash
npx ts-node scripts/crear-restaurante.ts
```

**Configuración**:
```typescript
const config: RestauranteConfig = {
  nombreArchivo: 'Menu_Mi_Restaurante.md',
  email: 'admin@mirestaurante.com',
  nombreComercio: 'Mi Restaurante',
  telefono: '+54 11 1234-5678',
  direccion: 'Av. Corrientes 1234, CABA',
  // ... otros datos
};
```

---

## ✅ Paso 4: Verificar la Carga

1. Accede a: `http://localhost:3000/editor/[idUnico]`
2. Verifica que las categorías aparezcan
3. Verifica que los platos estén en cada categoría
4. Revisa que los precios sean correctos

---

## 🔍 Validación del Formato

### ✅ Formato Correcto

```markdown
| Código | Categoría | Plato | Precio |
|--------|-----------|-------|--------|
| 0101   | Pizzas    | Muzzarela | 10000 |
| 0102   | Pizzas    | Napolitana | 11500 |
|        | Empanadas | Empanadas Carne (c/u) | 1800 |
```

### ❌ Errores Comunes

1. **Faltan pipes (|)**
   ```
   ❌ Pizzas | Muzzarela | 10000
   ✅ | Pizzas | Muzzarela | 10000 |
   ```

2. **Precio con símbolo $**
   ```
   ❌ | Pizzas | Muzzarela | $10000 |
   ✅ | Pizzas | Muzzarela | 10000 |
   ```

3. **Falta separador de tabla**
   ```
   ❌ | Categoría | Plato | Precio |
      | Pizzas    | Muzzarela | 10000 |
   ✅ | Categoría | Plato | Precio |
      |--------|-------|--------|
      | Pizzas | Muzzarela | 10000 |
   ```

---

## 🎨 Formato Simplificado (Sin Código)

Si no quieres usar códigos, puedes usar este formato:

```markdown
| Categoría | Plato | Precio |
|-----------|-------|--------|
| Pizzas    | Muzzarela | 10000 |
| Pizzas    | Napolitana | 11500 |
| Empanadas | Empanadas Carne (c/u) | 1800 |
```

El parser generará códigos automáticamente.

---

## 📊 Ejemplo Completo

**Archivo**: `MenuQR/Docs/Menu_Ejemplo.md`

```markdown
| Código | Categoría | Plato | Precio | Descripción | Imagen |
|--------|-----------|-------|--------|-------------|--------|
| 0101   | Pizzas    | Muzzarela | 10000 | Clásica de muzza fundida | muzzarela.jpg |
| 0102   | Pizzas    | Napolitana | 11500 | Con ajo opcional | napolitana.jpg |
| 0103   | Pizzas    | Fugazzeta | 11500 | Cebolla y queso | fugazzeta.jpg |
| 0201   | Empanadas | Empanadas Carne (c/u) | 1800 | Empanadas caseras | empanadas.jpg |
| 0202   | Empanadas | Empanadas Jamón y queso (c/u) | 1800 | | |
| 0301   | Bebidas   | Coca Cola 500ml | 1500 | | |
| 0302   | Bebidas   | Agua 500ml | 800 | | |
```

**Resultado**:
- 3 categorías: Pizzas, Empanadas, Bebidas
- 7 platos en total
- Códigos generados automáticamente para los que no tienen

---

## 🚀 Tips y Mejores Prácticas

1. **Usa IA para generar el formato**
   - Ahorra tiempo
   - Reduce errores
   - Formato consistente

2. **Revisa el formato antes de cargar**
   - Usa un editor de Markdown (VS Code, Typora)
   - Verifica que las tablas se vean bien

3. **Guarda una copia del .md**
   - Útil para futuras actualizaciones
   - Fácil de editar y recargar

4. **Usa códigos consistentes**
   - Facilita la búsqueda
   - Mejor organización

5. **Agrega descripciones**
   - Mejora la experiencia del cliente
   - Más información = más ventas

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo cargar el menú sin códigos?**
R: Sí, el parser genera códigos automáticamente.

**P: ¿Puedo actualizar el menú después?**
R: Sí, puedes editar desde el editor o recargar el .md.

**P: ¿Qué pasa si hay un error en el formato?**
R: El parser mostrará un error indicando la línea problemática.

**P: ¿Puedo usar imágenes?**
R: Sí, coloca las imágenes en `/public/platos/` y referencia el nombre en la columna "Imagen".

---

## 📞 Soporte

Si tienes problemas:
1. Revisa el formato usando la plantilla
2. Verifica que el archivo esté en `Docs/`
3. Revisa los logs del servidor
4. Contacta al administrador

