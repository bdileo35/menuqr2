# 📋 Plantilla de Menú - Formato Unificado

Esta es la plantilla estándar para crear archivos de menú en formato Markdown.

## 📝 Estructura del Archivo

```markdown
| Código | Categoría              | Plato                                              | Precio | Descripción (opcional) | Imagen (opcional) |
|--------|------------------------|----------------------------------------------------|--------|------------------------|-------------------|
| 0101   | Platos del Día         | Riñoncitos al jerez c/ puré                        | 9000   | Deliciosos riñones...   | rinoncitos.jpg    |
| 0102   | Platos del Día         | Croquetas de carne c/ ensalada                     | 9000   |                        | croquetas.jpg     |
|        | Cocina                 | 1/4 Pollo al horno c/ papas                        | 9000   |                        |                   |
```

## 📌 Reglas

1. **Código**: Opcional. Formato recomendado: `0101` (categoría + número de item)
   - Si no se especifica, se genera automáticamente
   - Si se especifica, debe ser único dentro de la categoría

2. **Categoría**: Obligatorio. Nombre de la categoría del menú
   - Se agrupan automáticamente los items por categoría
   - Las categorías se ordenan por orden de aparición

3. **Plato**: Obligatorio. Nombre del plato/producto

4. **Precio**: Obligatorio. Precio numérico (sin símbolo $)
   - Ejemplos: `9000`, `12000`, `1500`

5. **Descripción**: Opcional. Descripción del plato
   - Si está vacío, se puede dejar en blanco o omitir la columna

6. **Imagen**: Opcional. Nombre del archivo de imagen
   - Ruta relativa desde `/public/platos/`
   - Si está vacío, se usa imagen por defecto

## 📋 Ejemplo Completo

```markdown
| Código | Categoría              | Plato                                              | Precio | Descripción                    | Imagen            |
|--------|------------------------|----------------------------------------------------|--------|--------------------------------|-------------------|
| 0101   | Platos del Día         | Riñoncitos al jerez c/ puré                        | 9000   | Deliciosos riñones en salsa    | rinoncitos.jpg    |
| 0102   | Platos del Día         | Croquetas de carne c/ ensalada                     | 9000   | Croquetas caseras              | croquetas.jpg     |
|        | Cocina                 | 1/4 Pollo al horno c/ papas                        | 9000   |                                |                   |
|        | Cocina                 | Matambre al verdeo c/ fritas                       | 12000  |                                |                   |
| 0301   | Pizzas                 | Muzzarela                                          | 10000  | Clásica de muzza fundida        | muzzarela.jpg     |
| 0302   | Pizzas                 | Napolitana                                         | 11500  | Con ajo opcional                | napolitana.jpg    |
```

## 🔄 Formato Simplificado (sin código ni descripción)

Si prefieres un formato más simple, puedes usar solo las columnas esenciales:

```markdown
| Categoría              | Plato                                              | Precio |
|------------------------|----------------------------------------------------|--------|
| Platos del Día         | Riñoncitos al jerez c/ puré                        | 9000   |
| Platos del Día         | Croquetas de carne c/ ensalada                     | 9000   |
| Cocina                 | 1/4 Pollo al horno c/ papas                        | 9000   |
| Pizzas                 | Muzzarela                                          | 10000  |
```

## ✅ Validación

El parser acepta ambos formatos:
- **Formato completo**: Con código, descripción e imagen
- **Formato simplificado**: Solo categoría, plato y precio

## 📁 Ubicación del Archivo

Los archivos deben guardarse en: `MenuQR/Docs/Menu_[Nombre_Comercio].md`

Ejemplos:
- `MenuQR/Docs/Menu_Esquina_Pompeya.md`
- `MenuQR/Docs/Menu_los_toritos.md`
- `MenuQR/Docs/Menu_Mi_Restaurante.md`

