import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de datos reales para Esquina Pompeya...');
    console.log('🔍 Verificando que el endpoint se ejecuta correctamente...');

    // Verificar conexión a la base de datos
    console.log('🔗 Conectando a Supabase...');
    
    // Crear tablas con nombres de columna correctos para Prisma
    console.log('🔧 Creando tablas con schema correcto...');
    
    try {
      // Eliminar tablas existentes si existen
      await prisma.$executeRaw`DROP TABLE IF EXISTS menu_items CASCADE`;
      await prisma.$executeRaw`DROP TABLE IF EXISTS categories CASCADE`;
      await prisma.$executeRaw`DROP TABLE IF EXISTS menus CASCADE`;
      await prisma.$executeRaw`DROP TABLE IF EXISTS users CASCADE`;
      await prisma.$executeRaw`DROP TYPE IF EXISTS "Role" CASCADE`;
      console.log('🧹 Tablas existentes eliminadas');

      // Crear enum Role
      await prisma.$executeRaw`CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'OWNER', 'SUPERADMIN')`;
      
      // Crear tabla users con nombres correctos
      await prisma.$executeRaw`
        CREATE TABLE "users" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "restaurantId" TEXT NOT NULL,
          "restaurantName" TEXT NOT NULL,
          "phone" TEXT,
          "address" TEXT,
          "plan" TEXT DEFAULT 'basic',
          "role" "Role" DEFAULT 'ADMIN',
          "avatar" TEXT,
          "isActive" BOOLEAN DEFAULT true,
          "lastLogin" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        )
      `;
      
      // Crear tabla menus con nombres correctos
      await prisma.$executeRaw`
        CREATE TABLE "menus" (
          "id" TEXT NOT NULL,
          "restaurantId" TEXT NOT NULL,
          "restaurantName" TEXT NOT NULL,
          "description" TEXT,
          "logoUrl" TEXT,
          "logoPublicId" TEXT,
          "primaryColor" TEXT DEFAULT '#2563eb',
          "secondaryColor" TEXT DEFAULT '#64748b',
          "backgroundColor" TEXT DEFAULT '#ffffff',
          "textColor" TEXT DEFAULT '#1f2937',
          "fontFamily" TEXT DEFAULT 'Inter',
          "contactPhone" TEXT,
          "contactEmail" TEXT,
          "contactAddress" TEXT,
          "contactWebsite" TEXT,
          "socialInstagram" TEXT,
          "socialFacebook" TEXT,
          "socialTwitter" TEXT,
          "showPrices" BOOLEAN DEFAULT true,
          "showImages" BOOLEAN DEFAULT true,
          "showDescriptions" BOOLEAN DEFAULT true,
          "showNutritional" BOOLEAN DEFAULT false,
          "allowOrdering" BOOLEAN DEFAULT false,
          "currency" TEXT DEFAULT '$',
          "language" TEXT DEFAULT 'es',
          "deliveryEnabled" BOOLEAN DEFAULT false,
          "deliveryFee" DOUBLE PRECISION DEFAULT 0,
          "deliveryRadius" DOUBLE PRECISION,
          "deliveryMinOrder" DOUBLE PRECISION,
          "isActive" BOOLEAN DEFAULT true,
          "ownerId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "menus_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "menus_restaurantId_key" UNIQUE ("restaurantId")
        )
      `;
      
      // Crear tabla categories con nombres correctos
      await prisma.$executeRaw`
        CREATE TABLE "categories" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "position" INTEGER DEFAULT 0,
          "isActive" BOOLEAN DEFAULT true,
          "code" TEXT,
          "imageUrl" TEXT,
          "imagePublicId" TEXT,
          "menuId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "categories_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "categories_code_key" UNIQUE ("code")
        )
      `;
      
      // Crear tabla menu_items con nombres correctos
      await prisma.$executeRaw`
        CREATE TABLE "menu_items" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "price" DOUBLE PRECISION NOT NULL,
          "originalPrice" DOUBLE PRECISION,
          "position" INTEGER DEFAULT 0,
          "code" TEXT,
          "imageUrl" TEXT,
          "imagePublicId" TEXT,
          "galleryImages" TEXT,
          "hasImage" BOOLEAN DEFAULT false,
          "isAvailable" BOOLEAN DEFAULT true,
          "isPopular" BOOLEAN DEFAULT false,
          "isPromo" BOOLEAN DEFAULT false,
          "spicyLevel" INTEGER DEFAULT 0,
          "preparationTime" INTEGER,
          "tags" TEXT,
          "menuId" TEXT NOT NULL,
          "categoryId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
        )
      `;
      
      // Agregar foreign keys
      await prisma.$executeRaw`ALTER TABLE "menus" ADD CONSTRAINT "menus_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
      await prisma.$executeRaw`ALTER TABLE "categories" ADD CONSTRAINT "categories_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
      await prisma.$executeRaw`ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
      await prisma.$executeRaw`ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`;
      
      console.log('✅ Tablas creadas con schema correcto');
      
    } catch (error) {
      console.log('⚠️ Error creando tablas, continuando...', error);
    }

    // Crear usuario usando Prisma ORM
    console.log('👤 Creando usuario...');
    const user = await prisma.user.create({
      data: {
        name: 'Esquina Pompeya',
        email: 'admin@esquinapompeya.com',
        password: 'esquina2024',
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        phone: '+54 11 4911-6666',
        address: 'Av. Fernández de la Cruz 1100, Buenos Aires',
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Usuario creado: ${user.email}`);

    // Crear menú usando Prisma ORM
    console.log('🍽️ Creando menú...');
    const menu = await prisma.menu.create({
      data: {
        restaurantName: 'Esquina Pompeya',
        restaurantId: 'esquina-pompeya',
        description: 'Restaurante tradicional argentino',
        contactPhone: '+54 11 4911-6666',
        contactAddress: 'Av. Fernández de la Cruz 1100, Buenos Aires',
        contactEmail: 'info@esquinapompeya.com',
        socialInstagram: '@esquinapompeya',
        ownerId: user.id,
      },
    });
    console.log(`✅ Menú creado: ${menu.restaurantName}`);

    // Crear categorías principales usando Prisma ORM
    console.log('📂 Creando categorías...');
    const categoriesData = [
      { name: 'Platos del Día', code: '01', position: 1 },
      { name: 'Promos de la Semana', code: '02', position: 2 },
      { name: 'Cocina', code: '03', position: 3 },
      { name: 'Parrilla', code: '04', position: 4 },
      { name: 'Pescados y Mariscos', code: '05', position: 5 }
    ];

    const createdCategories = [];
    for (const catData of categoriesData) {
      const category = await prisma.category.create({
        data: {
          name: catData.name,
          code: catData.code,
          position: catData.position,
          description: `Categoría de ${catData.name}`,
          menuId: menu.id,
          isActive: true,
        },
      });
      createdCategories.push(category);
      console.log(`📂 Categoría creada: ${category.name} (${category.code})`);
    }

    // Crear algunos platos de ejemplo usando Prisma ORM
    console.log('🍽️ Creando platos...');
    const platosData = [
      // Platos del Día
      { name: 'Riñoncitos al jerez c/ puré', price: 9000, code: '0101', categoryCode: '01' },
      { name: 'Croquetas de carne c/ ensalada', price: 9000, code: '0102', categoryCode: '01' },
      { name: 'Vacío a la parrilla c/ fritas', price: 14000, code: '0103', categoryCode: '01' },
      
      // Cocina
      { name: '1/4 Pollo al horno c/ papas', price: 9000, code: '0301', categoryCode: '03' },
      { name: 'Vacío al horno c/ papas', price: 14000, code: '0302', categoryCode: '03' },
      { name: 'Peceto al verdeo c/ puré', price: 15000, code: '0303', categoryCode: '03' },
      
      // Pescados y Mariscos
      { name: 'Filet de merluza a la romana c/ g.', price: 8000, code: '0501', categoryCode: '05' },
      { name: 'Gambas al ajillo c/ fritas a la española', price: 20000, code: '0502', categoryCode: '05' },
      { name: 'Rabas a la romana c/ f. españolas', price: 18000, code: '0503', categoryCode: '05' }
    ];

    for (const plato of platosData) {
      const category = createdCategories.find(cat => cat.code === plato.categoryCode);
      if (category) {
        await prisma.menuItem.create({
          data: {
            name: plato.name,
            price: plato.price,
            code: plato.code,
            description: `Delicioso ${plato.name.toLowerCase()}`,
            position: parseInt(plato.code.substring(2), 10),
            isAvailable: true,
            isPopular: false,
            isPromo: false,
            categoryId: category.id,
            menuId: menu.id,
          },
        });
        console.log(`  - Plato creado: ${plato.name} (${plato.code})`);
      }
    }

    console.log(`🚀 Datos de Esquina Pompeya poblados exitosamente con ${platosData.length} platos.`);

    return NextResponse.json({
      success: true,
      message: 'Datos de Esquina Pompeya creados exitosamente en Supabase',
      data: {
        menuId: menu.id,
        categoriesCount: categoriesData.length,
        itemsCount: platosData.length
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error en endpoint',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}