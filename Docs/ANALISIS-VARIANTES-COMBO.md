# 📋 Análisis: Variantes, Combos y Menús Ejecutivos

## 🎯 Problema
Necesitamos manejar casos reales como:
1. **Los Toritos:** Combos combinados (pizza + empanadas)
2. **Platos con variantes:** Milanesa con guarnición (ensalada/puré/papas fritas)
3. **Menús ejecutivos:** Entrada + plato + postre + bebida (cada uno con 2+ opciones)

## 🔍 Casos de Uso Reales

### Caso 1: Platos con Variantes
**Ejemplo:** Milanesa con guarnición
- Precio base: $5000
- Variantes:
  - Ensalada (+$0)
  - Puré (+$500)
  - Papas fritas (+$800)

### Caso 2: Combos/Items Compuestos
**Ejemplo:** Los Toritos - "PROMO 2: 2 muzza + 6 empanadas"
- Item compuesto que incluye:
  - 2x Pizza Muzzarela
  - 6x Empanadas (a elección)
- Precio fijo: $27000

### Caso 3: Menús Ejecutivos
**Ejemplo:** Menú del día con opciones
- Precio: $6000
- Incluye:
  - **Entrada:** (elegir 1)
    - Ensalada
    - Sopa
  - **Plato principal:** (elegir 1)
    - Noquis
    - Supremitas de pollo
    - Ensalada de hojas verdes
  - **Postre:** (elegir 1)
    - Flan
    - Helado
  - **Bebida:** (elegir 1)
    - Gaseosa
    - Agua

## 💡 Soluciones Propuestas

### Opción 1: Campo JSON en MenuItem (Simple)
```prisma
model MenuItem {
  // ... campos existentes
  variants JSON? // { type: "guarnicion", options: [{name: "Ensalada", price: 0}, ...] }
  isCombo Boolean @default(false)
  comboItems JSON? // [{itemId: "...", quantity: 2}, ...]
}
```

**Ventajas:**
- Rápido de implementar
- Flexible

**Desventajas:**
- Difícil de consultar
- No normalizado

### Opción 2: Tablas Relacionales (Recomendado)
```prisma
model MenuItem {
  // ... campos existentes
  hasVariants Boolean @default(false)
  variants MenuItemVariant[]
  isCombo Boolean @default(false)
  comboItems MenuItemComboItem[]
}

model MenuItemVariant {
  id String @id @default(cuid())
  menuItemId String
  menuItem MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Cascade)
  name String // "Guarnición"
  options MenuItemVariantOption[]
  isRequired Boolean @default(true)
  position Int
}

model MenuItemVariantOption {
  id String @id @default(cuid())
  variantId String
  variant MenuItemVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  name String // "Ensalada"
  priceAdjustment Float @default(0) // +500, -200, etc.
  position Int
}

model MenuItemComboItem {
  id String @id @default(cuid())
  comboId String // ID del item combo
  includedItemId String // ID del item incluido
  includedItem MenuItem @relation(fields: [includedItemId], references: [id])
  quantity Int @default(1)
  isOptional Boolean @default(false) // Si puede elegir entre opciones
  categoryId String? // Si es opcional, de qué categoría elegir
}
```

**Ventajas:**
- Normalizado
- Fácil de consultar
- Escalable

**Desventajas:**
- Más complejo
- Requiere migración

### Opción 3: Híbrida (Recomendada para MVP)
```prisma
model MenuItem {
  // ... campos existentes
  // Para variantes simples (guarnición, tamaño, etc.)
  variants JSON? // { "guarnicion": [{name: "Ensalada", price: 0}, ...] }
  
  // Para combos
  isCombo Boolean @default(false)
  comboItems JSON? // [{itemId: "...", quantity: 2, optional: false}, ...]
  
  // Para menús ejecutivos
  isMenuEjecutivo Boolean @default(false)
  menuEjecutivoOptions JSON? // { entrada: [...], plato: [...], postre: [...], bebida: [...] }
}
```

**Ventajas:**
- Balance entre simplicidad y flexibilidad
- Fácil de implementar
- Puede evolucionar a Opción 2 después

## 🎨 Interfaz de Usuario

### Para Variantes Simples
```
Milanesa con guarnición - $5000
[Selector: Ensalada ▼] (+$0)
```

### Para Combos
```
PROMO 2: 2 muzza + 6 empanadas - $27000
Incluye:
  - 2x Pizza Muzzarela
  - 6x Empanadas (elegir sabores)
```

### Para Menús Ejecutivos
```
Menú del Día - $6000
Entrada: [Ensalada ▼]
Plato: [Noquis ▼]
Postre: [Flan ▼]
Bebida: [Gaseosa ▼]
```

## 📋 Recomendación

**Para MVP:** Opción 3 (Híbrida)
- Implementar variantes simples con JSON
- Implementar combos con JSON
- Implementar menús ejecutivos con JSON
- Después, si crece, migrar a Opción 2

## 🔄 Próximos Pasos
1. Agregar campos a schema
2. Actualizar editor para manejar variantes
3. Actualizar carta para mostrar/editar variantes
4. Actualizar carrito para incluir variantes en pedidos

