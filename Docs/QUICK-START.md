# 🚀 Quick Start - Crear Nuevo Restaurante

Guía rápida de 3 pasos para crear un nuevo restaurante.

---

## ⚡ 3 Pasos Rápidos

### 1️⃣ Crear el archivo del menú

Crea `Docs/Menu_[nombre].md` con este formato:

```markdown
| Categoría    | Plato        | Precio |
|--------------|--------------|--------|
| Pizzas       | Muzzarella   | 10000  |
| Pizzas       | Napolitana   | 11500  |
| Empanadas    | Carne (c/u)  | 1800   |
```

### 2️⃣ Ejecutar el script

```bash
npm run crear-restaurante
```

Sigue las preguntas interactivas o usa argumentos:

```bash
npm run crear-restaurante -- \
  --nombreArchivo "Menu_mi_resto.md" \
  --nombreComercio "Mi Restaurante" \
  --email "admin@resto.com" \
  --telefono "+541112345678" \
  --direccion "Calle 123, CABA"
```

### 3️⃣ ¡Listo! 🎉

El script te dará las URLs:
- 📄 Carta: `/carta/[ID_UNICO]`
- ✏️ Editor: `/editor/[ID_UNICO]`

---

## 📚 Documentación Completa

- **Tutorial completo:** `TUTORIAL-NUEVO-RESTAURANTE.md`
- **Plantilla de menú:** `PLANTILLA-MENU.md`
- **Ejemplos:** `Menu_Esquina_Pompeya.md`, `Menu_los_toritos.md`

---

## 💡 Tips Rápidos

- ✅ El archivo MD debe estar en `Docs/`
- ✅ La tabla debe tener encabezado y separador `|---|`
- ✅ Los precios pueden ser `10000`, `$10000`, o `10.000`
- ✅ Guarda el ID único que te da el script

---

¿Problemas? Revisa `TUTORIAL-NUEVO-RESTAURANTE.md` sección "Solución de Problemas"

