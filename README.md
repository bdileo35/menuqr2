# MenuQR-Next 🍽️

> **MenuQR modernizado con Next.js 15 + TypeScript siguiendo la arquitectura de QRing**

Aplicación **Full-Stack integrada** para crear y gestionar menús digitales con códigos QR para restaurantes.

## 🚀 **Arquitectura Moderna**

- **Framework**: Next.js 15 + TypeScript (App Router)  
- **Base de datos**: SQLite + Prisma ORM  
- **Estilos**: TailwindCSS  
- **Autenticación**: JWT  
- **Deployment**: Vercel (Full-Stack)  
- **Imágenes**: Cloudinary integration  

## 📁 **Estructura del Proyecto**

```
MenuQR-Next/
├── app/
│   ├── api/               # API Routes (reemplaza backend Express)
│   │   ├── auth/         # Autenticación (login, register)
│   │   └── menus/        # CRUD de menús
│   ├── menu/             # Páginas públicas de menús
│   ├── admin/            # Panel administrativo
│   ├── components/       # Componentes reutilizables
│   └── globals.css       # Estilos globales
├── lib/
│   └── prisma.ts         # Cliente Prisma
├── prisma/
│   └── schema.prisma     # Esquema de base de datos
└── package.json          # Dependencias unificadas
```

## 🔄 **Migración desde MenuQR Original**

### **ANTES (Separado):**
- `frontend/` → React app (puerto 3000)  
- `backend/` → Express server (puerto 5000)  
- Dos `package.json` separados  
- Configuración CORS necesaria  

### **AHORA (Integrado):**
- Un solo proyecto Next.js  
- API Routes integradas  
- Un solo `package.json`  
- Sin configuraciones de red  

## 🛠️ **Desarrollo**

### **Instalación:**
```bash
cd MenuQR-Next
npm install
```

### **Configurar base de datos:**
```bash
npm run db:push
npm run db:generate
```

### **Ejecutar en desarrollo:**
```bash
npm run dev
# Visita: http://localhost:3000
```

### **Build y deployment:**
```bash
npm run build
npm start
```

## 📱 **Funcionalidades**

### **✅ MIGRADAS Y FUNCIONANDO:**
- Visualización pública de menús (`/menu/{restaurantId}`)
- Sistema de autenticación JWT
- Registro de restaurantes con ID único
- Categorías y productos
- Gestión de imágenes
- Diseño responsive

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