# 🔥 FLUJO COMPLETO - MenuQR

**Estado:** ✅ Totalmente funcional con Prisma  
**Fecha:** Octubre 2025

---

## 🎯 ARQUITECTURA ACTUAL

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────┐           ┌──────▼──────┐
    │ Frontend│           │   API Routes│
    │ (Next.js│           │   (Next.js) │
    │  Pages) │◄──────────┤             │
    └─────────┘           └──────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │ Prisma ORM  │
                          └──────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │ SQLite DB   │
                          │ (190 platos)│
                          └─────────────┘
```

---

## 🚀 FLUJO COMPLETO DEL USUARIO

### **Paso 1: Setup Comercio** (`/setup-comercio`)

**Propósito:** Configuración inicial del restaurante

```
Usuario ingresa:
├── Nombre del restaurante
├── Dirección
├── Teléfono
├── Logo (opcional)
└── Click "Guardar y Continuar"
```

**Siguiente:** → Scanner

---

### **Paso 2: Scanner OCR** (`/scanner`)

**Propósito:** Escanear carta física con OCR (Tesseract.js)

```
Usuario:
├── Sube foto de la carta física
├── OCR procesa texto (70% precisión)
├── Extrae productos y precios
└── Click "Continuar al Editor"
```

**Siguiente:** → Editor

---

### **Paso 3: Editor de Menú** (`/editor`) ✅ **CONECTADO A PRISMA**

**Propósito:** Gestionar productos y categorías (CRUD completo)

```
CARGA INICIAL:
├── GET /api/menu/esquina-pompeya/items
├── Trae 190 productos reales desde Prisma
└── Organiza en 19 categorías

OPERACIONES:
├── ✏️ Editar producto:
│   └── PUT /api/menu/esquina-pompeya/items
│       Body: { itemId, name, price, description }
│
├── ➕ Agregar producto:
│   └── POST /api/menu/esquina-pompeya/items
│       Body: { name, price, description, categoryId }
│
└── 🗑️ Eliminar producto:
    └── DELETE /api/menu/esquina-pompeya/items?itemId=xxx
```

**Features:**
- ✅ Auto-save a Prisma
- ✅ 190 productos reales cargados
- ✅ 19 categorías
- ✅ Stats en tiempo real
- ✅ Vista previa del menú

**Siguiente:** → Vista Previa (CartaMenu)

---

### **Paso 4: Carta Digital** (`/carta-menu`) ✅ **CONECTADO A PRISMA**

**Propósito:** Vista pública del menú para clientes

```
CARGA INICIAL:
├── GET /api/menu/esquina-pompeya
├── Muestra todos los productos organizados por categoría
└── Links clickeables (Google Maps, WhatsApp, MP)

FEATURES:
├── 🌙 Modo oscuro/claro
├── 📱 Responsive mobile
├── 📍 Google Maps (dirección)
├── 💬 WhatsApp directo
├── 💳 Mercado Pago alias
└── 🔍 Modal de detalle por producto
```

**Acceso:** Cliente escanea QR → ve menú actualizado en tiempo real

---

## 📊 DATOS ACTUALES EN PRISMA

### **Base de datos:** SQLite (`prisma/dev.db`)

```yaml
Restaurante: Esquina Pompeya
Productos: 190 items
Categorías: 19

Ejemplos de categorías:
  - PLATOS DEL DÍA (8)
  - PROMOS (6)
  - DESAYUNOS Y MERIENDAS (17)
  - PANIFICADOS CASEROS (6)
  - SANDWICHES FRÍOS (12)
  - SANDWICHES CALIENTES (24)
  - PIZZAS Y EMPANADAS (6)
  - ENSALADAS (8)
  - PASTAS (10)
  - CARNES Y POLLO (15)
  - PESCADOS Y MARISCOS (10)
  - MINUTAS (18)
  - GUARNICIONES (10)
  - INFANTILES (8)
  - POSTRES Y HELADOS (15)
  - BEBIDAS FRÍAS (20)
  - BEBIDAS CALIENTES (10)
  - TRAGOS Y CERVEZAS (12)
  - VINOS (5)
```

---

## 🔌 APIs DISPONIBLES

### **1. GET `/api/menu/[restaurantId]`**

**Uso:** Carta pública (carta-menu)

**Respuesta:**
```json
{
  "success": true,
  "menu": {
    "restaurantName": "Esquina Pompeya",
    "contactPhone": "+54 11 1234-5678",
    "deliveryEnabled": true,
    "categories": [
      {
        "id": "cat_xxx",
        "name": "PLATOS DEL DÍA",
        "items": [
          {
            "id": "item_xxx",
            "name": "Milanesas al horno c/ Puré",
            "price": 9000,
            "isAvailable": true
          }
        ]
      }
    ]
  }
}
```

---

### **2. GET `/api/menu/[restaurantId]/items`**

**Uso:** Editor (carga completa con todos los datos)

**Respuesta:**
```json
{
  "success": true,
  "menu": {
    "id": "menu_xxx",
    "categories": [
      {
        "id": "cat_xxx",
        "name": "PLATOS DEL DÍA",
        "position": 0,
        "items": [...]
      }
    ]
  }
}
```

---

### **3. POST `/api/menu/[restaurantId]/items`**

**Uso:** Crear nuevo producto

**Body:**
```json
{
  "name": "Hamburguesa completa",
  "price": 8000,
  "description": "Con papas fritas",
  "categoryId": "cat_xxx"
}
```

**Respuesta:**
```json
{
  "success": true,
  "item": {
    "id": "item_new",
    "name": "Hamburguesa completa",
    "price": 8000
  }
}
```

---

### **4. PUT `/api/menu/[restaurantId]/items`**

**Uso:** Actualizar producto existente

**Body:**
```json
{
  "itemId": "item_xxx",
  "name": "Nuevo nombre",
  "price": 9500,
  "description": "Nueva descripción"
}
```

---

### **5. DELETE `/api/menu/[restaurantId]/items?itemId=xxx`**

**Uso:** Eliminar producto

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

---

## ⚡ COMANDOS ÚTILES

```bash
# Levantar servidor
npm run dev
# http://localhost:3000

# Ver base de datos
npx prisma studio
# http://localhost:5555

# Recargar seed (190 productos)
npx tsx scripts/seed-esquina-pompeya-full.ts

# Migración nueva
npx prisma migrate dev --name nombre-migracion

# Regenerar Prisma Client
npx prisma generate
```

---

## 🎯 RUTAS PRINCIPALES

```
http://localhost:3000/setup-comercio    # Paso 1
http://localhost:3000/scanner           # Paso 2
http://localhost:3000/editor            # Paso 3 (CRUD Prisma)
http://localhost:3000/carta-menu        # Paso 4 (Vista pública)
```

---

## ✅ CHECKLIST DE FUNCIONAMIENTO

### **Base de datos:**
- [x] Prisma configurado
- [x] 190 productos cargados
- [x] 19 categorías cargadas
- [x] Usuario esquina@pompeya.com existe

### **APIs:**
- [x] GET /api/menu/esquina-pompeya (carta pública)
- [x] GET /api/menu/esquina-pompeya/items (editor)
- [x] POST /api/menu/esquina-pompeya/items (crear)
- [x] PUT /api/menu/esquina-pompeya/items (actualizar)
- [x] DELETE /api/menu/esquina-pompeya/items (eliminar)

### **Frontend:**
- [x] /editor carga desde API
- [x] /editor guarda en Prisma (auto-save)
- [x] /carta-menu carga desde API
- [x] Cambios en editor se reflejan en carta-menu
- [x] Stats funcionan (190 productos, 19 categorías)

---

## 🚀 PRÓXIMOS PASOS (FASE 1)

### **Pendientes inmediatos:**

1. **Botón reseñas Google** (1 día)
   - Agregar link directo en carta-menu
   
2. **Selector Salón/Mostrador/Delivery** (3 días)
   - Modal en carta-menu para elegir modalidad
   - Guardar en Order con mode
   
3. **Mercado Pago** (5 días)
   - Integrar checkout
   - Generar link de pago
   
4. **Ticket PDF** (2 días)
   - Generar PDF con pedido
   - Descargable/imprimible

---

## 📝 NOTAS TÉCNICAS

### **Por qué funciona ahora:**

1. **Editor usa API real:** No más localStorage
2. **Auto-save:** Cada cambio va directo a Prisma
3. **Carta-menu sincronizada:** Lee desde la misma DB
4. **190 productos reales:** Seed completo desde Qwen.md

### **Arquitectura limpia:**

```
Editor → API → Prisma → DB
CartaMenu → API → Prisma → DB
```

No hay localStorage, todo pasa por Prisma.

---

## 🎉 ESTADO ACTUAL

**✅ FLUJO COMPLETO FUNCIONAL**

```
Setup → Scanner → Editor (Prisma) → CartaMenu (Prisma)
                       ↑                    ↑
                       └────────────────────┘
                         MISMA BASE DE DATOS
```

**Próxima parada:** Implementar Fase 1 completa (reseñas, MP, ticket)

---

**Última actualización:** Octubre 2025  
**Documentado por:** Sistema MenuQR
