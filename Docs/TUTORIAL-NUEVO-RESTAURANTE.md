# 🍽️ Tutorial: Crear un Nuevo Restaurante

Guía paso a paso para agregar un nuevo restaurante al sistema MenuQR.

---

## 📋 Índice

1. [Preparar el archivo del menú](#1-preparar-el-archivo-del-menú)
2. [Crear el restaurante](#2-crear-el-restaurante)
3. [Verificar y personalizar](#3-verificar-y-personalizar)
4. [Agregar imágenes (opcional)](#4-agregar-imágenes-opcional)
5. [Configurar tema y colores](#5-configurar-tema-y-colores)

---

## 1. Preparar el archivo del menú

### Paso 1.1: Crear el archivo Markdown

Crea un archivo en la carpeta `Docs/` con el formato:

**Nombre del archivo:** `Menu_[nombre_restaurante].md`

Ejemplo: `Menu_los_toritos.md`, `Menu_esquina_pompeya.md`

### Paso 1.2: Formato de la tabla

El archivo debe tener una tabla con este formato:

```markdown
| Categoría              | Plato                    | Precio |
|------------------------|--------------------------|--------|
| Especiales             | Pizza Especial           | 12500  |
| Pizzas                 | Muzzarella               | 10000  |
| Pizzas                 | Napolitana               | 11500  |
| Empanadas              | Empanada Carne (c/u)     | 1800   |
| Calzones               | Primavera                | 10500  |
```

**Reglas importantes:**
- ✅ Primera línea debe ser el encabezado de la tabla
- ✅ Segunda línea debe ser el separador `|---|`
- ✅ Cada categoría se repite en cada fila
- ✅ Los precios pueden tener formato: `12500`, `$12500`, `12.500`
- ✅ Opcional: Puedes agregar una columna de código (4 dígitos)

**Ejemplo con código:**
```markdown
| Código | Categoría | Plato        | Precio |
|--------|-----------|-------------|--------|
| 0101   | Pizzas    | Muzzarella  | 10000  |
| 0102   | Pizzas    | Napolitana  | 11500  |
```

### Paso 1.3: Verificar el archivo

Asegúrate de que:
- ✅ El archivo está en `MenuQR/Docs/`
- ✅ Tiene extensión `.md`
- ✅ La tabla está bien formateada
- ✅ Todos los precios son números válidos

---

## 2. Crear el restaurante

### Opción A: Modo Interactivo (Recomendado para principiantes)

Ejecuta el comando sin argumentos:

```bash
npm run crear-restaurante
```

El script te hará preguntas interactivas:

```
🍽️  MODO INTERACTIVO - Crear Nuevo Restaurante

📄 Nombre del archivo MD (ej: Menu_mi_restaurante.md): Menu_mi_resto.md
🏪 Nombre del restaurante: Mi Restaurante
📧 Email del administrador: admin@miresto.com
📱 Teléfono: +54 11 1234-5678
📍 Dirección: Av. Corrientes 1234, CABA
📸 ¿Tienes Instagram? (s/n): s
   Instagram (@usuario): @miresto
👥 ¿Tienes Facebook? (s/n): n
📝 ¿Agregar descripción? (s/n): s
   Descripción: El mejor restaurante de la ciudad
```

### Opción B: Modo con Argumentos (Para automatización)

```bash
npm run crear-restaurante -- \
  --nombreArchivo "Menu_mi_resto.md" \
  --nombreComercio "Mi Restaurante" \
  --email "admin@miresto.com" \
  --telefono "+54 11 1234-5678" \
  --direccion "Av. Corrientes 1234, CABA" \
  --instagram "@miresto" \
  --facebook "Mi Restaurante" \
  --descripcion "El mejor restaurante de la ciudad"
```

### Paso 2.1: Ejecutar el script

El script automáticamente:
1. ✅ Valida que el archivo MD existe
2. ✅ Parsea el menú y extrae categorías e items
3. ✅ Genera un ID único para el restaurante
4. ✅ Crea el usuario administrador
5. ✅ Crea el menú en la base de datos
6. ✅ Crea todas las categorías
7. ✅ Crea todos los items del menú

### Paso 2.2: Obtener las URLs

Al finalizar, el script te mostrará:

```
🎉 ¡RESTAURANTE CREADO EXITOSAMENTE!

📊 RESUMEN:
   Nombre: Mi Restaurante
   ID Único: ABC12345
   Email: admin@miresto.com
   Categorías: 5
   Items: 42

🔗 URLs:
   📄 Carta pública: http://localhost:3000/carta/ABC12345
   ✏️  Editor: http://localhost:3000/editor/ABC12345
   ⚙️  Configuración: http://localhost:3000/configuracion/ABC12345
```

**Guarda el ID Único** - Lo necesitarás para acceder al restaurante.

---

## 3. Verificar y personalizar

### Paso 3.1: Ver la carta pública

Abre en el navegador:
```
http://localhost:3000/carta/[ID_UNICO]
```

Verifica que:
- ✅ Todas las categorías aparecen
- ✅ Todos los items tienen precios correctos
- ✅ Los nombres están bien escritos

### Paso 3.2: Editar el menú

Abre el editor:
```
http://localhost:3000/editor/[ID_UNICO]
```

Desde aquí puedes:
- ✏️ Editar nombres y descripciones
- 💰 Cambiar precios
- ➕ Agregar nuevos items
- 🗑️ Eliminar items
- 📝 Agregar descripciones a los platos

### Paso 3.3: Cambiar la contraseña

El usuario se crea con una contraseña temporal. Cambia la contraseña desde:
- Panel de administración (si existe)
- O directamente en la base de datos

---

## 4. Agregar imágenes (opcional)

### Paso 4.1: Crear carpeta de imágenes

Crea una carpeta específica para tu restaurante:

```bash
mkdir -p public/platos/[nombre-restaurante]
```

Ejemplo:
```bash
mkdir -p public/platos/mi-resto
```

### Paso 4.2: Agregar imágenes a items específicos

Para agregar una imagen a un item específico, edita el seed o usa el editor:

1. Ve al editor: `/editor/[ID_UNICO]`
2. Haz click en el item que quieres editar
3. Sube la imagen desde el editor

O modifica el seed para incluir `imageUrl`:

```typescript
{ 
  name: 'Primavera', 
  price: 10500, 
  cat: 'Calzones', 
  desc: 'Muzza, jamón, huevo duro...',
  imageUrl: '/platos/mi-resto/calzone-primavera.jpg',
  hasImage: true 
}
```

### Paso 4.3: Formato de imágenes

- **Formato:** JPG o PNG
- **Tamaño recomendado:** 800x600px (proporción 4:3)
- **Peso máximo:** 500KB para mejor rendimiento
- **Nombre:** Usa nombres descriptivos: `calzone-primavera.jpg`, `pizza-muzzarella.jpg`

---

## 5. Configurar tema y colores

### Paso 5.1: Acceder a configuración

Abre:
```
http://localhost:3000/configuracion/[ID_UNICO]
```

### Paso 5.2: Personalizar

Desde aquí puedes cambiar:
- 🎨 Colores primarios y secundarios
- 🖼️ Logo del restaurante
- 📱 Información de contacto
- 🌐 Redes sociales
- 💳 Configuración de delivery

---

## 📝 Ejemplo Completo

### Archivo: `Docs/Menu_ejemplo.md`

```markdown
| Categoría    | Plato                    | Precio |
|--------------|--------------------------|--------|
| Pizzas       | Muzzarella               | 10000  |
| Pizzas       | Napolitana               | 11500  |
| Pizzas       | Calabresa                | 12000  |
| Empanadas    | Empanada Carne (c/u)     | 1800   |
| Empanadas    | Empanada Jamón y Queso   | 1800   |
| Calzones     | Primavera                | 10500  |
| Calzones     | Napolitano               | 10000  |
```

### Comando:

```bash
npm run crear-restaurante -- \
  --nombreArchivo "Menu_ejemplo.md" \
  --nombreComercio "Restaurante Ejemplo" \
  --email "admin@ejemplo.com" \
  --telefono "+54 11 1234-5678" \
  --direccion "Av. Ejemplo 123, CABA"
```

---

## 🆘 Solución de Problemas

### Error: "Archivo no encontrado"
- ✅ Verifica que el archivo está en `MenuQR/Docs/`
- ✅ Verifica que el nombre del archivo es correcto (incluye `.md`)

### Error: "Email ya registrado"
- ✅ Usa un email diferente
- ✅ O elimina el usuario existente de la base de datos

### Error: "No se pudo parsear el menú"
- ✅ Verifica el formato de la tabla
- ✅ Asegúrate de que la primera línea es el encabezado
- ✅ Verifica que los precios son números válidos

### Los items no aparecen en la carta
- ✅ Verifica que el ID único es correcto
- ✅ Revisa la consola del navegador para errores
- ✅ Verifica que el servidor está corriendo

---

## 🎯 Checklist Final

Antes de considerar el restaurante listo:

- [ ] Archivo MD creado y formateado correctamente
- [ ] Restaurante creado con el script
- [ ] ID único guardado
- [ ] Carta pública verificada
- [ ] Editor accesible y funcional
- [ ] Contraseña cambiada
- [ ] Imágenes agregadas (si aplica)
- [ ] Tema y colores configurados
- [ ] Información de contacto completa
- [ ] Redes sociales configuradas

---

## 📚 Recursos Adicionales

- **Schema de la base de datos:** `prisma/schema.prisma`
- **Ejemplo de menú:** `Docs/Menu_Esquina_Pompeya.md`
- **Script de seed específico:** `scripts/seed-los-toritos.ts`

---

## 💡 Tips

1. **Nombres descriptivos:** Usa nombres claros para categorías e items
2. **Precios consistentes:** Usa el mismo formato para todos los precios
3. **Descripciones atractivas:** Agrega descripciones a los platos desde el editor
4. **Imágenes de calidad:** Usa imágenes nítidas y bien iluminadas
5. **Backup regular:** Guarda copias de tus archivos MD

---

¡Listo! 🎉 Ya tienes tu restaurante en el sistema. Si tienes dudas, revisa los ejemplos en `Docs/` o consulta la documentación del proyecto.

