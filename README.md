# 📱 MenuQR - Menús Digitales con QR

> **Plataforma SaaS para restaurantes: Cartas digitales, pedidos online y sistema de comandas**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC)](https://tailwindcss.com/)

---

## 🚀 Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/bdileo35/MenuQR.git
cd MenuQR

# Instalar dependencias
npm install

# Configurar base de datos
npx prisma migrate dev
npx tsx scripts/seed-esquina-pompeya.ts

# Levantar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📚 Documentación Completa

### **→ [`PROYECTO-MENUQR-COMPLETO.md`](./PROYECTO-MENUQR-COMPLETO.md)** ← LEE ESTO PRIMERO

Este documento maestro contiene **TODA** la información del proyecto:

- ✅ **Arquitectura técnica completa** (Stack, estructura, flujo de datos)
- ✅ **Base de datos** (Schema Prisma + 73 productos reales)
- ✅ **APIs y Endpoints** (5 endpoints documentados con ejemplos)
- ✅ **Páginas y componentes** (10 páginas explicadas)
- ✅ **Flujos de usuario** (Carta física → QR, Pedidos salón/delivery)
- ✅ **Sistema de comandas** (Arquitectura completa)
- ✅ **Estado actual** (Completado / En progreso / Pendiente)
- ✅ **Roadmap 3 años** (Plan hasta $1.2M ARR)

---

## ⚡ Features Principales

### ✅ **Funcional (MVP):**
- 📱 Carta digital accesible vía QR
- ✏️ Editor de menú con doble-click
- 📊 Base de datos con 73 productos reales
- 🔄 CRUD completo de productos
- 🎨 Modo oscuro/claro
- 📍 Links clickeables (Google Maps, WhatsApp, Mercado Pago)

### ⏳ **En Desarrollo:**
- 🍽️ Sistema de comandas (salón/delivery)
- 📦 Carrito de compras
- 📞 WhatsApp Business API
- 👨‍💼 Panel administrativo

### 🎯 **Roadmap:**
- 🔐 Autenticación multi-tenant
- 💳 Pagos online (Mercado Pago)
- 📈 Analytics y reportes
- 🏢 Multi-sucursal

---

## 🛠️ Stack Tecnológico

```yaml
Frontend:
  - Next.js 14.2.5 (App Router)
  - React 18 + TypeScript
  - Tailwind CSS 3.x

Backend:
  - Next.js API Routes
  - Prisma ORM 5.x
  - SQLite (dev) / PostgreSQL (prod)

Deploy:
  - Vercel (frontend + APIs)
  - Railway/Supabase (DB producción)
```

---

## 📁 Estructura del Proyecto

```
MenuQR/
├── app/                        # Next.js App Router
│   ├── api/                   # Backend APIs
│   │   └── menu/
│   │       └── [restaurantId]/
│   │           ├── route.ts   # GET menú completo
│   │           └── items/
│   │               └── route.ts # CRUD items
│   ├── carta-menu/            # Vista pública del menú ⭐
│   ├── editor-clean/          # Editor optimizado ⭐
│   ├── editor-v2/             # Editor mobile
│   ├── scanner/               # OCR de carta física
│   └── components/            # Componentes reutilizables
│
├── prisma/
│   ├── schema.prisma          # Schema de DB
│   ├── dev.db                 # SQLite local
│   └── migrations/            # Migraciones
│
├── scripts/
│   └── seed-esquina-pompeya.ts # Seed con 73 productos
│
├── Docs/
│   ├── Menu_Esquina_Pompeya.md # Datos del menú demo
│   └── README.md              # Índice de docs
│
└── PROYECTO-MENUQR-COMPLETO.md # 📚 DOCUMENTO MAESTRO
```

---

## 🎯 Casos de Uso

### **Para Restaurantes:**
```
1. Escanear carta física con el scanner OCR
2. Editar productos en /editor-clean (doble-click)
3. Generar QR personalizado
4. Cliente escanea QR → ve carta actualizada
5. Recibir pedidos (salón/delivery)
6. Ver comandas en tiempo real
```

### **Para Desarrolladores:**
```
1. Leer PROYECTO-MENUQR-COMPLETO.md
2. Ejecutar npm install && npm run dev
3. Explorar /carta-menu y /editor-clean
4. Abrir Prisma Studio: npx prisma studio
5. Modificar código con contexto completo
```

---

## 🔌 APIs Disponibles

```typescript
// Obtener menú completo
GET /api/menu/esquina-pompeya

// Listar items para editor
GET /api/menu/esquina-pompeya/items

// Crear producto
POST /api/menu/esquina-pompeya/items
Body: { name, price, description, categoryId }

// Actualizar producto
PUT /api/menu/esquina-pompeya/items
Body: { itemId, name, price, description }

// Eliminar producto
DELETE /api/menu/esquina-pompeya/items?itemId=xxx
```

Ver ejemplos completos en [`PROYECTO-MENUQR-COMPLETO.md`](./PROYECTO-MENUQR-COMPLETO.md#4-apis-y-endpoints)

---

## 🗄️ Base de Datos

### **Modelos Prisma:**
- `User` - Dueños de restaurantes
- `Menu` - Configuración del menú
- `Category` - Secciones (Platos del día, Promos, etc.)
- `MenuItem` - Productos/Platos
- `Order` - Comandas (salón/delivery)
- `OrderItem` - Items del pedido

### **Datos Demo:**
- **Restaurante:** Esquina Pompeya
- **Productos:** 73 items reales
- **Categorías:** 9 secciones
- **Credentials:** esquina@pompeya.com / esquina2024

```bash
# Ver datos en visual DB
npx prisma studio
# http://localhost:5555
```

---

## 🧪 Testing

```bash
# Probar carta digital
http://localhost:3000/carta-menu

# Probar editor
http://localhost:3000/editor-clean

# Probar scanner OCR
http://localhost:3000/scanner
```

---

## 📦 Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Servidor desarrollo
npm run build                  # Build producción
npm run start                  # Correr build

# Base de datos
npx prisma studio              # DB visual
npx prisma migrate dev         # Nueva migración
npx prisma generate            # Regenerar client
npx tsx scripts/seed-esquina-pompeya.ts  # Seed datos

# Deploy
vercel                         # Deploy a Vercel
```

---

## 🐛 Bugs Conocidos

1. **Editor-v2:** Categorías nuevas no se guardan (falta API POST categories)
2. **Carta-menu:** Imágenes demo hardcodeadas (no desde DB)
3. **Scanner:** Precisión OCR ~70%
4. **Logo:** No se carga desde DB

Ver sección completa en [`PROYECTO-MENUQR-COMPLETO.md`](./PROYECTO-MENUQR-COMPLETO.md#9-estado-actual-del-proyecto)

---

## 🤝 Contribuir

1. Lee [`PROYECTO-MENUQR-COMPLETO.md`](./PROYECTO-MENUQR-COMPLETO.md) para entender el contexto
2. Crea un branch: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'feat: descripción'`
4. Push: `git push origin feature/nueva-feature`
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es privado y pertenece a **bdileo35**.

---

## 📞 Contacto

- **GitHub:** [@bdileo35](https://github.com/bdileo35)
- **Repo:** [github.com/bdileo35/MenuQR](https://github.com/bdileo35/MenuQR)

---

## 🎓 Para IAs (Claude, GPT, etc.)

**→ Lee [`PROYECTO-MENUQR-COMPLETO.md`](./PROYECTO-MENUQR-COMPLETO.md) primero**

Este documento contiene TODO el contexto necesario para:
- ✅ Entender la arquitectura
- ✅ Modificar código
- ✅ Agregar features
- ✅ Debuggear problemas
- ✅ Tomar decisiones de diseño

No necesitas leer otros archivos de documentación (están consolidados ahí).

---

**🚀 MenuQR - De carta física a QR en minutos**

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Prisma](https://img.shields.io/badge/DB-Prisma-2D3748)](https://prisma.io)
# Force deploy 10/05/2025 23:31:44
# Force Vercel refresh 10/06/2025 16:08:34
