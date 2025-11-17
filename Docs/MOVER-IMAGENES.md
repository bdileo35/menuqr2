# 📁 Guía: Mover Imágenes entre Carpetas

## ⚠️ Importante

Si mueves archivos de imágenes de una carpeta a otra (ej: de `los-toritos` a `5XJ1J37F`), **las rutas en la base de datos se romperán** porque están hardcodeadas.

**Nota:** Las imágenes en `los-toritos` son de Esquina Pompeya (ID: `5XJ1J37F`), no de Los Toritos.

## 🔍 ¿Qué se rompe?

Las rutas de imágenes se almacenan en la base de datos en el campo `imageUrl` de la tabla `menu_items`. Si mueves los archivos sin actualizar la base de datos, las imágenes no se mostrarán.

## ✅ Solución: Actualizar Rutas Automáticamente

### Paso 1: Mover los archivos físicos

```bash
# Mover todos los archivos de los-toritos a 5XJ1J37F (Esquina Pompeya)
mv public/platos/los-toritos/* public/platos/5XJ1J37F/
```

### Paso 2: Actualizar rutas en la base de datos

Usa el script que creamos (usando el ID de Esquina Pompeya):

```bash
npm run actualizar-rutas 5XJ1J37F "/platos/los-toritos" "/platos/5XJ1J37F"
```

O directamente:

```bash
npx tsx scripts/actualizar-rutas-imagenes.ts 5XJ1J37F "/platos/los-toritos" "/platos/5XJ1J37F"
```

### Paso 3: Actualizar el script de seed (opcional)

Si vuelves a ejecutar el seed, actualiza `scripts/seed-los-toritos.ts`:

```typescript
// Cambiar esta línea:
imageUrl: '/platos/los-toritos/calzone-primavera.jpg'

// Por esta:
imageUrl: '/platos/5XJ1J37F/calzone-primavera.jpg'
```

## 📋 Checklist

- [ ] Mover archivos físicos a la nueva carpeta
- [ ] Ejecutar script de actualización de rutas
- [ ] Verificar que las imágenes se muestran correctamente
- [ ] Actualizar script de seed (si aplica)
- [ ] Actualizar documentación (README.md, etc.)

## 🔄 Ejemplo Completo

```bash
# 1. Mover archivos
mv public/platos/los-toritos/* public/platos/5XJ1J37F/

# 2. Actualizar base de datos (usando ID de Esquina Pompeya)
npm run actualizar-rutas 5XJ1J37F "/platos/los-toritos" "/platos/5XJ1J37F"

# 3. Verificar en el navegador
# Abre: http://localhost:3000/carta/5XJ1J37F
```

## ⚡ Script Rápido

Si quieres hacer todo de una vez, puedes crear un script bash:

```bash
#!/bin/bash
RESTAURANT_ID="5XJ1J37F"  # ID de Esquina Pompeya
OLD_PATH="/platos/los-toritos"
NEW_PATH="/platos/5XJ1J37F"

# Mover archivos
mv public/platos/los-toritos/* public/platos/5XJ1J37F/

# Actualizar base de datos
npm run actualizar-rutas $RESTAURANT_ID "$OLD_PATH" "$NEW_PATH"

echo "✅ Proceso completado"
```

## 🐛 Troubleshooting

### Las imágenes no se muestran después de mover

1. Verifica que los archivos estén en la nueva carpeta
2. Verifica que las rutas en la base de datos se actualizaron:
   ```sql
   SELECT id, name, imageUrl FROM menu_items WHERE imageUrl LIKE '%los-toritos%';
   ```
3. Limpia la caché del navegador (Ctrl+Shift+R)

### Error al ejecutar el script

- Verifica que el `restaurantId` sea correcto
- Verifica que las rutas estén entre comillas si tienen espacios
- Verifica que la base de datos esté accesible

