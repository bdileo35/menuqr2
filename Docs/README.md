# 📖 MenuQR - Guía de Inicio Rápido

**Versión:** 1.0.0  
**Última actualización:** 11 de Noviembre, 2025  
**Estado:** MVP en desarrollo (70% completo)

---

## 🎯 ¿Qué es MenuQR?

**MenuQR** es una plataforma SaaS para restaurantes que permite crear **menús digitales accesibles mediante códigos QR**.

### Características principales:
- 📱 Carta digital QR con pedidos online
- 🎨 Editor visual de menú en tiempo real
- 📦 Scanner OCR para digitalizar menús físicos
- 🛒 Carrito PRO con WhatsApp integrado
- 🎨 Personalización de tema y colores
- 📊 Sistema de comandas D/T (Delivery/Takeaway)

---

## 🚀 Quick Start (5 minutos)

### 1. **Instalar dependencias**
```bash
npm install
```

### 2. **Configurar base de datos**
```bash
# Variables de entorno (.env)
DATABASE_URL="postgresql://postgres:bat33man@db.vzcniaopxflpgrwarnvn.supabase.co:5432/postgres"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Ejecutar migraciones
npx prisma migrate dev
```

### 3. **Cargar datos demo**
```bash
# Iniciar servidor
npm run dev

# En otra terminal (PowerShell):
Invoke-WebRequest -Uri "http://localhost:3000/api/seed-demo" -Method POST

# O con curl:
curl -X POST http://localhost:3000/api/seed-demo
```

### 4. **Ver el resultado**
```
✅ Editor:  http://localhost:3000/editor/5XJ1J37F
✅ Carta:   http://localhost:3000/carta/5XJ1J37F
✅ Pro:     http://localhost:3000/carta/5XJ1J37F?pro=1
```

---

## 📂 Estructura del Proyecto

```
MenuQR/
├── app/
│   ├── api/                    # Endpoints de API
│   │   ├── menu/              # CRUD de menús
│   │   ├── seed-demo/         # Cargar datos demo
│   │   ├── seed-from-md/      # Cargar desde MD
│   │   └── tienda/            # Mercado Pago
│   ├── carta/[idUnico]/       # Menú público
│   ├── editor/[idUnico]/      # Editor de menú
│   ├── scanner/               # OCR para digitalizar
│   ├── configuracion/         # Configuración del comercio
│   └── qr-shop/               # Tienda de compra
├── lib/
│   ├── prisma.ts              # Cliente Prisma singleton
│   └── shared/                # 🆕 Módulos compartidos (QRing + MenuQR)
│       ├── idu-generator.ts   # Generador de IDs únicos
│       ├── mercadopago.ts     # Service de Mercado Pago
│       ├── qr-generator.ts    # Generador de QR
│       └── planes.ts          # Planes y precios
├── prisma/
│   ├── schema.prisma          # Schema de base de datos
│   └── migrations/            # Migraciones
└── Docs/
    ├── README.md              # Este archivo
    ├── QR-SUITE-MASTER.md     # 📘 DOCUMENTO MAESTRO COMPLETO
    ├── ESTRUCTURA_TABLAS.md   # Schema detallado
    ├── Menu_Esquina_Pompeya.md # Datos demo reales
    └── Propuesta-Integracion-Maxirest.md
```

---

## 🔑 Conceptos Clave

### **IDU (ID Único)**
- Identificador de 8 caracteres (ej: `5XJ1J37F`)
- Se genera al comprar un plan
- Es el `restaurantId` en la base de datos
- Se usa en todas las URLs: `/carta/[idUnico]`

### **Modalidades de Pedido**
1. **Salón**: `?mesa=1` → Pedido en mesa
2. **Delivery**: `?modalidad=delivery` → Envío a domicilio
3. **Takeaway**: `?modalidad=takeaway` → Retiro en local

### **Códigos de Pedido**
- `D####` → Delivery (ej: D0001)
- `T####` → Takeaway (ej: T0012)

---

## 🗄️ Base de Datos

**Stack:** PostgreSQL + Prisma ORM + Supabase

### Modelos principales:
```typescript
User         → Dueño del restaurante
Menu         → Menú del restaurante (restaurantId = IDU)
Category     → Categorías del menú (Entradas, Platos, Postres...)
MenuItem     → Platos individuales
Order        → Pedidos realizados
OrderItem    → Items de cada pedido
```

📖 Ver detalles completos en [ESTRUCTURA_TABLAS.md](./ESTRUCTURA_TABLAS.md)

---

## 🛠️ APIs Disponibles

### **Menú**
```bash
GET  /api/menu/[idUnico]              # Obtener menú completo
GET  /api/menu/[idUnico]/categories   # Obtener categorías + items
POST /api/menu/[idUnico]/categories   # Crear/actualizar categoría
```

### **Seed Data**
```bash
POST /api/seed-demo                   # Cargar datos demo (Esquina Pompeya)
POST /api/seed-from-md                # Cargar desde Menu_Esquina_Pompeya.md
```

### **Tienda (Mercado Pago)**
```bash
POST /api/tienda/crear-preferencia    # Crear pago MP
GET  /api/tienda/pago-exitoso         # Callback de pago exitoso
```

---

## 📱 Flujo Completo del Usuario

### **FASE 1: Compra**
```
/qr-shop → Elegir plan → Pagar MP → Obtener IDU → /tienda/exito
```

### **FASE 2: Setup (6 pasos)**
```
1. /datos-comercio/[idUnico]      → Datos del comercio
2. /scanner?idUnico=XXX           → OCR para digitalizar menú físico
3. /editor/[idUnico]              → Administrar menú
4. /opciones-qr/[idUnico]         → Personalizar y descargar QR
5. /carta/[idUnico]               → Ver carta pública
6. /configuracion/[idUnico]       → Configuración (tel WhatsApp, horarios)
```

### **FASE 3: Uso diario**
```
Cliente escanea QR → /carta/[idUnico] → Hace pedido → Envía por WhatsApp
Comerciante edita → /editor/[idUnico] → Actualiza en tiempo real
```

---

## 🔗 Integraciones

### **✅ Implementadas:**
- Mercado Pago (puenteado para demo)
- WhatsApp (envío de pedidos)
- Supabase (PostgreSQL)

### **🔄 En desarrollo:**
- WhatsApp Business Catalog
- MaxiRest POS (conector bidireccional)
- Scanner OCR real (Google Vision)

### **🎯 Planeadas:**
- QRing (integración completa)
- Analytics avanzado
- Multi-idioma

---

## 🚀 Deploy

### **Producción:**
- URL: https://menuqrep.vercel.app
- Demo: https://menuqrep.vercel.app/carta/5XJ1J37F
- Platform: Vercel + Supabase

### **Deploy local:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 📚 Documentación Completa

### 📘 **[QR-SUITE-MASTER.md](./QR-SUITE-MASTER.md)** ← **LEER ESTO PRIMERO**
**Documento maestro con TODO:**
- Arquitectura completa QRing + MenuQR
- Módulos compartidos (`lib/shared`)
- Flujo post-compra detallado (6 pasos)
- Integraciones (MaxiRest, WhatsApp Business)
- Roadmap completo
- Estado actual y pendientes

### Otros documentos:
- [ESTRUCTURA_TABLAS.md](./ESTRUCTURA_TABLAS.md) - Schema de base de datos
- [Menu_Esquina_Pompeya.md](./Menu_Esquina_Pompeya.md) - Datos demo reales (21 categorías, 196 platos)
- [Propuesta-Integracion-Maxirest.md](./Propuesta-Integracion-Maxirest.md) - Spec del conector POS

---

## ⚠️ Estado Actual del Proyecto

### **✅ Funcional (70%):**
- Editor de menú con Prisma
- Carta pública con carrito PRO
- Sistema de comandas D/T
- Generación de QR
- Modal de pedido con WhatsApp

### **🔄 En progreso (20%):**
- Webhook Mercado Pago real
- Scanner OCR integrado
- Onboarding guiado (6 pasos)
- Autenticación

### **❌ Pendiente (10%):**
- Dashboard de estadísticas
- WhatsApp Business Catalog
- Conector MaxiRest
- Integración QRing

---

## 🆘 Para una IA que retome este proyecto

**Si perdimos el hilo de la conversación, lee en este orden:**

1. **Este README** → Contexto general y quick start
2. **[QR-SUITE-MASTER.md](./QR-SUITE-MASTER.md)** → TODO el proyecto en detalle
3. **[ESTRUCTURA_TABLAS.md](./ESTRUCTURA_TABLAS.md)** → Schema de DB
4. **Ejecutar seed-demo** → Ver datos reales en acción

**Preguntas clave para entender el proyecto:**
- ¿Qué es un IDU? → ID único de 8 chars que identifica al restaurante
- ¿Dónde está el flujo post-compra? → QR-SUITE-MASTER.md, Sección 3
- ¿Cómo se integra con QRing? → Módulos compartidos en `lib/shared`
- ¿Qué falta implementar? → Ver Roadmap en QR-SUITE-MASTER.md

**Contexto del último hilo:**
- Se crearon módulos compartidos en `lib/shared` para QRing + MenuQR
- Se consolidó toda la documentación en QR-SUITE-MASTER.md
- Se implementó sistema de comandas D/T (Delivery/Takeaway)
- Hay 20 categorías y 190 platos cargados en Supabase (Esquina Pompeya)
- Falta completar el flujo de 6 pasos post-compra

---

## 📞 Contacto

**Desarrollador:** bdileo35  
**Última revisión:** 11 de Noviembre, 2025  
**Stack:** Next.js 14 + Prisma + PostgreSQL + Supabase + Vercel
