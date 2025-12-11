# 📋 Estructura de Pedidos - Propuesta

## 🎯 Objetivo

Crear una página de pedidos con 3 categorías:
- **Pendientes** (Cocina)
- **A Cobrar** (Caja)
- **Completados** (Historial)

## 📐 Diseño

### **Layout Similar a Promos:**
- Cards con ancho fijo (180px)
- Scroll horizontal para recorrer todos
- Orden cronológico: **más antigua a la IZQUIERDA**

### **Estructura del Card:**
```
┌─────────────────┐
│  #PEDIDO   MESA │  ← Header con número y mesa
├─────────────────┤
│   [Imagen]      │  ← Imagen del plato principal
│                 │
├─────────────────┤
│ Nombre Cliente  │  ← 2 líneas máximo
│                 │
├─────────────────┤
│ Items: 3        │  ← Cantidad de items
│ Total: $45.000  │  ← Total del pedido
├─────────────────┤
│ [Preparación]   │  ← Botón cambiar estado
│    ↓            │
│ [A Cobrar]      │
│    ↓            │
│ [Finalizado]    │
└─────────────────┘
```

## 🔄 Flujo de Estados

### **Estados:**
1. **PENDIENTE** → Botón: "En Preparación"
2. **PREPARANDO** → Botón: "Listo para Cobrar"
3. **LISTO** → Botón: "Marcar como Cobrado"
4. **COBRADO** → Botón: "Finalizar"
5. **COMPLETADO** → Sin botón (solo visualización)

### **Transiciones:**
- Pendiente → Preparando (Cocina inicia)
- Preparando → Listo (Cocina termina)
- Listo → Cobrado (Caja cobra)
- Cobrado → Completado (Finaliza)

## 💡 Ventajas del Diseño

1. **Ancho fijo:** Cards siempre del mismo tamaño
2. **Scroll horizontal:** Fácil recorrer todos los pedidos
3. **Orden cronológico:** Más antiguo a la izquierda (más visible)
4. **Responsive:** En PC se ven más cards, en móvil menos
5. **Reutilizable:** Misma estructura que promos

## 🎨 Estilos

- **Ancho card:** 180px fijo
- **Altura mínima:** 220px
- **Gap entre cards:** 12px
- **Scroll:** Horizontal, barra delgada
- **Colores por estado:**
  - Pendiente: Amarillo/Naranja
  - Preparando: Azul
  - Listo: Verde
  - Cobrado: Gris
  - Completado: Gris claro

## 📱 Responsive

- **Móvil:** 1-2 cards visibles
- **Tablet:** 2-3 cards visibles
- **PC:** 3-4+ cards visibles
- **Scroll:** Siempre disponible si hay más cards

