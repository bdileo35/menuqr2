# 📚 DOCUMENTACIÓN MENUQR# MenuQR-Next 🍽️



## 📄 DOCUMENTO MAESTRO> **MenuQR modernizado con Next.js 15 + TypeScript **



**[`PROYECTO-MENUQR-COMPLETO.md`](../PROYECTO-MENUQR-COMPLETO.md)** ← **LEE ESTE PRIMERO**Aplicación **Full-Stack integrada** para crear y gestionar menús digitales con códigos QR para restaurantes.



Este documento contiene TODA la información del proyecto:## 🚀 **Arquitectura Moderna**

- ✅ Arquitectura completa (Stack, DB, APIs)

- ✅ Base de datos con 73 productos reales- **Framework**: Next.js 15 + TypeScript (App Router)  

- ✅ 10 páginas documentadas con ejemplos- **Base de datos**: SQLite + Prisma ORM  

- ✅ Flujos de usuario y sistema de comandas- **Estilos**: TailwindCSS  

- ✅ Estado actual y roadmap 3 años- **Autenticación**: JWT  

- ✅ Guía para programadores e IAs- **Deployment**: Vercel (Full-Stack)  

- **Imágenes**: Cloudinary integration  

---

## 📁 **Estructura del Proyecto**

## 📂 ARCHIVOS EN ESTA CARPETA

```

### 1. **Menu_Esquina_Pompeya.md**MenuQR-Next/

Datos del menú real de prueba (73 productos en 9 categorías).  ├── app/

**Uso:** Referencia para seed script.│   ├── api/               # API Routes (reemplaza backend Express)

│   │   ├── auth/         # Autenticación (login, register)

### 2. **README.md** (este archivo)│   │   └── menus/        # CRUD de menús

Índice de documentación.│   ├── menu/             # Páginas públicas de menús

│   ├── admin/            # Panel administrativo

---│   ├── components/       # Componentes reutilizables

│   └── globals.css       # Estilos globales

## 🗂️ DOCUMENTOS ANTIGUOS├── lib/

│   └── prisma.ts         # Cliente Prisma

Los siguientes documentos fueron consolidados en `PROYECTO-MENUQR-COMPLETO.md` y movidos a `_unused/docs-antiguos/`:├── prisma/

│   └── schema.prisma     # Esquema de base de datos

```└── package.json          # Dependencias unificadas

❌ ARQUITECTURA-COMANDAS.md          → Sección 8 del doc maestro```

❌ AUDITORIA-ESTRUCTURA.md           → Sección 2 del doc maestro

❌ COMPARATIVA-MENUS.md              → No necesario## 🔄 **Migración desde MenuQR Original**

❌ ESTRATEGIA-MULTI-TENANT.md        → Sección 10 del doc maestro

❌ GUIA-VISUAL-ESTRUCTURA.md         → Sección 5 del doc maestro### **ANTES (Separado):**

❌ INDICE-DOCUMENTACION.md           → Reemplazado por este README- `frontend/` → React app (puerto 3000)  

❌ menu-esquina-pompeya-completo.md  → Mantenido como Menu_Esquina_Pompeya.md- `backend/` → Express server (puerto 5000)  

❌ NGROK-SETUP.md                    → No necesario (Vercel deploy)- Dos `package.json` separados  

❌ PLAN-ACCION-PRIORITARIO.md        → Sección 10 del doc maestro- Configuración CORS necesaria  

❌ REDEFINICION-ESTRATEGICA.md       → Sección 1 del doc maestro

❌ RESUMEN-EJECUTIVO.md              → Sección 1 del doc maestro### **AHORA (Integrado):**

```- Un solo proyecto Next.js  

- API Routes integradas  

---- Un solo `package.json`  

- Sin configuraciones de red  

## 🚀 INICIO RÁPIDO

## 🛠️ **Desarrollo**

### Para desarrolladores nuevos:

### **Instalación:**

```bash```bash

# 1. Clonar repocd MenuQR-Next

git clone https://github.com/bdileo35/MenuQR.gitnpm install

cd MenuQR```



# 2. Instalar dependencias### **Configurar base de datos:**

npm install```bash

npm run db:push

# 3. Setup base de datosnpm run db:generate

npx prisma migrate dev```

npx tsx scripts/seed-esquina-pompeya.ts

### **Ejecutar en desarrollo:**

# 4. Levantar servidor```bash

npm run devnpm run dev

# http://localhost:3000# Visita: http://localhost:3000

``````



### Para IAs:### **Build y deployment:**

```bash

Lee **`PROYECTO-MENUQR-COMPLETO.md`** - contiene todo el contexto necesario para entender y modificar el proyecto.npm run build

npm start

---```



## 📞 Enlaces Útiles## 📱 **Funcionalidades**



- **Repo:** github.com/bdileo35/MenuQR### **✅ MIGRADAS Y FUNCIONANDO:**

- **Prisma Studio:** `npx prisma studio` → http://localhost:5555- Visualización pública de menús (`/menu/{restaurantId}`)

- **Deploy:** Vercel (auto-deploy desde master)- Sistema de autenticación JWT

- Registro de restaurantes con ID único

---- Categorías y productos

- Gestión de imágenes

**Última actualización:** Octubre 2025  - Diseño responsive

**Documentación mantenida por:** Sistema MenuQR

### **🔄 EN PROCESO:**
- Panel administrativo completo
- CRUD de menús (backend listo, frontend en desarrollo)
- Upload de imágenes con Cloudinary
- Configuración de temas y colores
- WhatsApp integration

### **🎯 POR IMPLEMENTAR:**
- Sistema de QR codes
- Analytics y estadísticas
- Múltiples idiomas
- PWA features

## 🌐 **API Endpoints**

### **Autenticación:**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar restaurante

### **Menús (Público):**
- `GET /api/menus/restaurant/{restaurantId}` - Obtener menú público

### **Administración (Protegido):**
- `GET /api/menus/{id}` - Obtener menú completo
- `POST /api/menus` - Crear menú
- `PUT /api/menus/{id}` - Actualizar menú
- `DELETE /api/menus/{id}` - Eliminar menú

## 🔐 **Variables de Entorno**

Copiar `.env.example` a `.env.local` y configurar:

```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu_jwt_secret_super_seguro"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="tu_cloudinary_name"
```

## 🚀 **Ventajas de la Migración**

### **🎯 Performance:**
- **SSR automático** → Mejor SEO y velocidad inicial
- **Imágenes optimizadas** → Carga más rápida  
- **Bundling automático** → Menor tamaño de archivos  

### **🔧 Desarrollo:**
- **Un solo comando** `npm run dev` (no más frontend + backend)
- **Hot reload completo** → Cambios inmediatos en cliente y servidor  
- **TypeScript integrado** → Mejor experiencia de desarrollo  
- **Debugging unificado** → Errores más claros  

### **🌐 Deployment:**
- **Un solo deploy** en Vercel  
- **Configuración automática** → Sin configurar servidores  
- **Escalabilidad automática** → Se adapta al tráfico  
- **HTTPS por defecto** → Seguridad incluida  

## 🎨 **Compatibilidad con QRing Suite**

Este proyecto utiliza la **misma arquitectura** que QRing:
- Next.js 15 + TypeScript  
- Prisma + SQLite  
- Vercel deployment  
- Componentes reutilizables  

Permite **compartir código** entre MenuQR y QRing para acelerar el desarrollo.

## 📞 **Soporte**

- Desarrollado siguiendo el patrón de **QRing**  
- Compatible con **QR-Suite** comercial  
- Stack moderno y escalable  

---

**🚀 MenuQR-Next: De React+Express separado → Next.js Full-Stack integrado**