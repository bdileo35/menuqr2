# Plantilla de Menú - Copiar y Personalizar

Esta es una plantilla para crear nuevos menús. Copia este archivo y personalízalo con los datos de tu restaurante.

**Nombre del archivo:** `Menu_[nombre_restaurante].md`

---

## Formato Básico (Sin códigos)

```markdown
| Categoría              | Plato                                              | Precio |
|------------------------|----------------------------------------------------|--------|
| Categoría 1            | Plato 1                                            | 10000  |
| Categoría 1            | Plato 2                                            | 12000  |
| Categoría 2            | Plato 3                                            | 15000  |
| Categoría 2            | Plato 4                                            | 18000  |
```

---

## Formato con Códigos (Opcional)

```markdown
| Código | Categoría              | Plato                                              | Precio |
|--------|------------------------|----------------------------------------------------|--------|
| 0101   | Categoría 1            | Plato 1                                            | 10000  |
| 0102   | Categoría 1            | Plato 2                                            | 12000  |
| 0201   | Categoría 2            | Plato 3                                            | 15000  |
| 0202   | Categoría 2            | Plato 4                                            | 18000  |
```

---

## Ejemplo Real: Pizzas y Empanadas

```markdown
| Categoría              | Plato                                              | Precio |
|------------------------|----------------------------------------------------|--------|
| Pizzas                 | Muzzarella                                         | 10000  |
| Pizzas                 | Napolitana                                         | 11500  |
| Pizzas                 | Calabresa                                          | 12000  |
| Pizzas                 | Jamón y Morrones                                   | 12000  |
| Empanadas              | Empanada Carne (c/u)                              | 1800   |
| Empanadas              | Empanada Jamón y Queso (c/u)                      | 1800   |
| Empanadas              | Empanada Roquefort (c/u)                          | 1800   |
| Calzones               | Napolitano                                         | 10000  |
| Calzones               | Primavera                                          | 10500  |
| Hamburguesas           | Hamburguesa Casera 180g                            | 9000   |
| Hamburguesas           | Hamburguesa Completa                               | 9500   |
```

---

## Reglas Importantes

1. **Primera línea:** Siempre debe ser el encabezado de la tabla con `|`
2. **Segunda línea:** Siempre debe ser el separador `|---|`
3. **Categorías:** Se repiten en cada fila del mismo grupo
4. **Precios:** Pueden ser `10000`, `$10000`, o `10.000` - el sistema los parsea automáticamente
5. **Espacios:** Los espacios alrededor de `|` no importan, pero ayuda a la legibilidad

---

## Tips

- ✅ Usa nombres descriptivos para categorías
- ✅ Mantén consistencia en los nombres de platos
- ✅ Agrupa items similares en la misma categoría
- ✅ Ordena las categorías por importancia (ej: Pizzas primero, Postres al final)

---

## Ejemplo Completo con Múltiples Categorías

```markdown
| Categoría              | Plato                                              | Precio |
|------------------------|----------------------------------------------------|--------|
| Pizzas                 | Muzzarella                                         | 10000  |
| Pizzas                 | Napolitana                                         | 11500  |
| Pizzas                 | Calabresa                                          | 12000  |
| Pizzas                 | Fugazzeta                                          | 11500  |
| Empanadas              | Empanada Carne (c/u)                              | 1800   |
| Empanadas              | Empanada Jamón y Queso (c/u)                      | 1800   |
| Empanadas              | Empanada Roquefort (c/u)                          | 1800   |
| Empanadas              | Media docena empanadas                            | 10000  |
| Calzones               | Napolitano                                         | 10000  |
| Calzones               | Primavera                                          | 10500  |
| Calzones               | El calzón de león                                  | 11000  |
| Hamburguesas           | Hamburguesa Casera 180g                           | 9000   |
| Hamburguesas           | Hamburguesa Completa                              | 9500   |
| Bebidas                | Coca Cola 2.25L                                    | 6000   |
| Bebidas                | Agua 500ml                                         | 1000   |
```

---

**¡Listo!** Copia esta plantilla, personalízala con tus datos y guárdala como `Menu_[tu_restaurante].md` en la carpeta `Docs/`.

