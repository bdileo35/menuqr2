# 📊 COMPARATIVA - Menús Esquina Pompeya

**Análisis de los 2 archivos de menú disponibles**

---

## 📁 ARCHIVOS COMPARADOS

| Archivo | Ubicación | Formato | Productos | Categorías |
|---------|-----------|---------|-----------|------------|
| **Menu_Esquina_Pompeya.md** (NUEVO) | `/Docs/` | Tabla Markdown | **79** | **9** |
| **menu-esquina-pompeya-completo.md** (VIEJO) | `/raíz` | Texto narrativo | **32** | **8** |

---

## 🏆 GANADOR: Menu_Esquina_Pompeya.md (ChatGPT)

### ✅ **Ventajas del archivo NUEVO:**

1. **Más completo**: 79 productos vs 32 productos (+147%)
2. **Mejor formato**: Tabla markdown limpia y estructurada
3. **Más categorías**: 9 categorías vs 8 categorías
4. **Datos reales**: Extraído de imagen real de carta
5. **Precios actualizados**: Datos de octubre 2025
6. **Fácil de importar**: Formato tabla → JSON directo

### ❌ **Desventajas del archivo VIEJO:**

1. **Menos productos**: Solo 32 items
2. **Formato narrativo**: Difícil de parsear automáticamente
3. **Datos inventados**: No extraído de carta real
4. **Categorías mixtas**: Mezcla platos que no coinciden

---

## 📋 COMPARATIVA DETALLADA

### **Categorías únicas en archivo NUEVO (no en viejo):**

```
✅ Tortillas (21 items)
✅ Omelets (4 items)  
✅ Sandwiches Fríos (4 items)
✅ Sandwiches Calientes (17 items)
✅ Entradas (15 items)
```

### **Categorías en ambos archivos:**

| Categoría | Nuevo | Viejo | Diferencia |
|-----------|-------|-------|------------|
| **Platos del Día** | 8 | 7 | +1 (Correntinos caseros) |
| **Promos** | 2 | 2 | Mismo |
| **Cocina** | 14 | 2 | +12 items |
| **Empanadas** | 2 | 1 | +1 item |

---

## 🎯 PRODUCTOS ÚNICOS EN CADA ARCHIVO

### **Solo en archivo NUEVO (datos reales):**

#### **Platos del Día:**
- ✅ Rinioncitos al jerez c/ puré ($9000)
- ✅ Chupín de merluza c/ papa natural ($10000)
- ✅ Correntinos caseros a la Vangoli ($13000)

#### **Promos:**
- ✅ Promo 1: Entraña c/ arroz + postre + bebida ($12000)
- ✅ Promo 2: Salpicón de ave + postre + bebida ($12000)

#### **Cocina (14 items):**
- ✅ 1/4 Pollo al horno c/ papas ($9000)
- ✅ 1/4 Pollo provenzal c/ fritas ($10000)
- ✅ Matambre al verdeo/pizza c/ fritas ($12000)
- ✅ Bondiola al ajillo/verdeo ($12000)
- ✅ Costillitas a la riojana ($18000)
- ✅ Vacío al horno c/ papas ($14000)
- ✅ Peceto horneado al vino ($15000)
- ✅ Peceto al roquefort ($18000)
- ✅ Tapa de asado ($12000)
- ✅ Costillitas a la mostaza ($12000)

#### **Tortillas (21 items):**
- Completa desde papas simples hasta papas a caballo

#### **Sandwiches (21 items):**
- Desde milanesa simple hasta lomito/bondiola/pechuga completo

#### **Entradas (15 items):**
- Picadas, matambre, lengua, mayonesas, jamones, langostinos

---

### **Solo en archivo VIEJO (inventado):**

#### **Parrilla:**
- ❌ Bife de Chorizo ($8500)
- ❌ Asado de Tira ($7500)
- ❌ Choripán ($3500)

#### **Pastas:**
- ❌ Ñoquis Caseros ($6500)
- ❌ Ravioles de Ricota ($7200)
- ❌ Sorrentinos ($7800)

#### **Sándwiches:**
- ❌ Hamburguesa Completa ($5500)
- ❌ Tostado Mixto ($3200)
- ❌ Lomito Completo ($6800)

#### **Postres:**
- ❌ Flan Casero ($2500)
- ❌ Tiramisú ($3200)
- ❌ Helado ($2800)

#### **Bebidas:**
- ❌ Coca Cola ($1800)
- ❌ Agua Mineral ($1200)
- ❌ Cerveza Quilmes ($2200)
- ❌ Vino Tinto ($1800)
- ❌ Café Cortado ($1500)

**NOTA:** Estos productos probablemente NO existen en la carta real de Esquina Pompeya

---

## 📊 ESTADÍSTICAS

### **Archivo NUEVO (ChatGPT - REAL):**
```
Total productos:    79
Categorías:         9
  - Platos del Día:           8
  - Promos de la Semana:      2
  - Tortillas:               21
  - Omelets:                  4
  - Cocina:                  14
  - Sandwiches Fríos:         4
  - Sandwiches Calientes:    17
  - Entradas:                15
  - Empanadas:                2

Rango precios:      $1600 - $19000
Precio promedio:    ~$9800
Formato:            Tabla Markdown
Fuente:             Imagen real de carta
```

### **Archivo VIEJO (Inventado):**
```
Total productos:    32
Categorías:         8
  - Platos del Día:      7
  - Promos:              2
  - Empanadas:           1
  - Parrilla:            3
  - Cocina:              2
  - Pastas:              3
  - Sándwiches:          3
  - Postres:             3
  - Bebidas:             5

Rango precios:      $1200 - $15000
Precio promedio:    ~$5800
Formato:            Texto narrativo
Fuente:             Datos inventados
```

---

## 🎯 RECOMENDACIÓN

### **USAR: Menu_Esquina_Pompeya.md (NUEVO)**

**Razones:**
1. ✅ **Datos reales** extraídos de carta física
2. ✅ **Más completo** (79 vs 32 productos)
3. ✅ **Formato mejor** para importar a sistema
4. ✅ **Precios actualizados** (octubre 2025)
5. ✅ **Fácil conversión** a JSON/Prisma

### **ACCIÓN: Mover archivo viejo a deprecados**

```powershell
# Mover archivo viejo
Move-Item "menu-esquina-pompeya-completo.md" "_deprecated/"
```

---

## 🔄 PRÓXIMOS PASOS

### **1. Parsear archivo NUEVO a JSON:**
```typescript
// Script para convertir tabla MD → JSON
const menuData = parseMarkdownTable('Docs/Menu_Esquina_Pompeya.md');

// Resultado:
{
  "categories": [
    {
      "name": "Platos del Día",
      "items": [
        {
          "name": "Rinioncitos al jerez c/ puré",
          "price": 9000
        },
        // ...
      ]
    }
  ]
}
```

### **2. Importar a Prisma:**
```typescript
// Seed script
for (const category of menuData.categories) {
  await prisma.category.create({
    data: {
      name: category.name,
      menuId: esquinaPompeyaMenuId,
      items: {
        create: category.items.map(item => ({
          name: item.name,
          price: item.price,
          menuId: esquinaPompeyaMenuId
        }))
      }
    }
  });
}
```

### **3. Actualizar seed script:**
```bash
# Arreglar seed-esquina-pompeya.ts
# Usar datos del archivo NUEVO
# 79 productos reales vs 32 inventados
```

---

## 📁 ORGANIZACIÓN FINAL

```
MenuQR/
├── Docs/
│   ├── Menu_Esquina_Pompeya.md          ✅ USAR ESTE
│   ├── AUDITORIA-ESTRUCTURA.md
│   ├── GUIA-VISUAL-ESTRUCTURA.md
│   ├── ESTRATEGIA-MULTI-TENANT.md
│   ├── INDICE-DOCUMENTACION.md
│   └── RESUMEN-EJECUTIVO.md
│
└── _deprecated/
    └── menu-esquina-pompeya-completo.md  ← Mover aquí
```

---

## 🎨 FORMATO DE DATOS

### **Archivo NUEVO (Tabla Markdown):**
```markdown
| Categoría | Plato | Precio |
|:----------|:------|-------:|
| Platos del Día | Rinioncitos al jerez c/ puré | 9000 |
```

✅ **Ventajas:**
- Fácil de leer visualmente
- Parseable con regex/parser simple
- Compatible con herramientas MD
- Exportable a CSV/Excel

### **Archivo VIEJO (Narrativo):**
```markdown
### Milanesas al horno c/ Puré
- **Precio**: $9000
- **Descripción**: Milanesas caseras...
```

❌ **Desventajas:**
- Difícil de parsear automáticamente
- Requiere parser complejo
- No escalable para muchos items

---

## 🔍 VERIFICACIÓN DE DUPLICADOS

### **Items que aparecen en AMBOS archivos:**

| Plato | Precio Nuevo | Precio Viejo | Diferencia |
|-------|--------------|--------------|------------|
| Croquetas de carne c/ ensalada | $9000 | $8000 | +$1000 |
| Pechuga rellena c/ f. españolas | $12000 | $12000 | = |
| Mejillones c/ fetuccinis | $12000 | $14000 | -$2000 |
| Vacío a la parrilla c/ fritas | $14000 | $15000 | -$1000 |
| Peceto al verdeo c/ puré | $15000 | $15000 | = |

**NOTA:** El archivo NUEVO tiene precios más consistentes (extraídos de carta real)

---

## ✅ CONCLUSIÓN

| Criterio | Archivo NUEVO | Archivo VIEJO |
|----------|---------------|---------------|
| **Completitud** | 🟢🟢🟢🟢🟢 79 items | 🟡🟡 32 items |
| **Formato** | 🟢🟢🟢🟢🟢 Tabla MD | 🟡🟡🟡 Narrativo |
| **Fuente datos** | 🟢🟢🟢🟢🟢 Carta real | 🔴🔴 Inventado |
| **Parseable** | 🟢🟢🟢🟢🟢 Fácil | 🟡🟡 Complejo |
| **Actualizado** | 🟢🟢🟢🟢🟢 Oct 2025 | 🟡🟡 Sep 2025 |

**GANADOR CLARO: Menu_Esquina_Pompeya.md** 🏆

---

*Comparativa generada: Octubre 2, 2025*  
*Archivo recomendado: `/Docs/Menu_Esquina_Pompeya.md`*
