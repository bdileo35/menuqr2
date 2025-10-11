import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de datos reales para Esquina Pompeya...');

    // Verificar conexión a la base de datos
    console.log('🔗 Conectando a Supabase...');

    // Crear tablas si no existen (usando SQL directo)
    console.log('🔧 Creando tablas en Supabase...');
    
    try {
      // Crear tabla users
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "restaurantId" TEXT NOT NULL,
          "restaurantName" TEXT NOT NULL,
          "phone" TEXT,
          "address" TEXT,
          "plan" TEXT DEFAULT 'basic',
          "role" "Role" NOT NULL DEFAULT 'ADMIN',
          "avatar" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "lastLogin" TIMESTAMP(3),
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        )
      `;
      
      // Crear tabla menus
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Menu" (
          "id" TEXT NOT NULL,
          "restaurantName" TEXT NOT NULL,
          "restaurantId" TEXT NOT NULL,
          "description" TEXT,
          "logoUrl" TEXT,
          "contactPhone" TEXT,
          "contactAddress" TEXT,
          "contactEmail" TEXT,
          "socialInstagram" TEXT,
          "primaryColor" TEXT,
          "secondaryColor" TEXT,
          "showPrices" BOOLEAN NOT NULL DEFAULT true,
          "showImages" BOOLEAN NOT NULL DEFAULT true,
          "showDescriptions" BOOLEAN NOT NULL DEFAULT true,
          "currency" TEXT NOT NULL DEFAULT '$',
          "language" TEXT NOT NULL DEFAULT 'es',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "ownerId" TEXT NOT NULL,
          CONSTRAINT "Menu_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Menu_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )
      `;
      
      // Crear tabla categories
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Category" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "position" INTEGER NOT NULL DEFAULT 0,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "menuId" TEXT NOT NULL,
          "code" TEXT,
          CONSTRAINT "Category_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "Category_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )
      `;
      
      // Crear tabla menuItems
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "MenuItem" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "price" DOUBLE PRECISION NOT NULL,
          "description" TEXT,
          "imageUrl" TEXT,
          "position" INTEGER NOT NULL DEFAULT 0,
          "isAvailable" BOOLEAN NOT NULL DEFAULT true,
          "isPopular" BOOLEAN NOT NULL DEFAULT false,
          "isPromo" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "categoryId" TEXT NOT NULL,
          "menuId" TEXT NOT NULL,
          "code" TEXT,
          CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
          CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )
      `;
      
      console.log('✅ Tablas creadas exitosamente');
      
      // Limpiar datos existentes
      await prisma.menuItem.deleteMany();
      await prisma.category.deleteMany();
      await prisma.menu.deleteMany();
      await prisma.user.deleteMany();
      console.log('🧹 Datos limpiados');
      
    } catch (error) {
      console.log('⚠️ Error creando tablas, continuando...', error);
    }

    // Crear usuario
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
        role: Role.ADMIN
      }
    });

    // Crear menú
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
        ownerId: user.id
      }
    });

    // Crear categorías principales
    const categories = [
      { name: 'Platos del Día', code: '01', position: 1 },
      { name: 'Promos de la Semana', code: '02', position: 2 },
      { name: 'Cocina', code: '03', position: 3 },
      { name: 'Parrilla', code: '04', position: 4 },
      { name: 'Pescados y Mariscos', code: '05', position: 5 },
      { name: 'Ensaladas', code: '06', position: 6 },
      { name: 'Ensaladas Especiales', code: '07', position: 7 },
      { name: 'Entradas', code: '08', position: 8 },
      { name: 'Postres', code: '09', position: 9 },
      { name: 'Bebidas', code: '10', position: 10 }
    ];

    const createdCategories = [];
    for (const catData of categories) {
      const category = await prisma.category.create({
        data: {
          name: catData.name,
          code: catData.code,
          position: catData.position,
          description: `Categoría ${catData.name}`,
          menuId: menu.id,
          isActive: true
        }
      });
      createdCategories.push(category);
      console.log(`📂 Categoría creada: ${category.name} (${category.code})`);
    }

    // Crear platos de ejemplo (primeros 20 de cada categoría principal)
    const platosData = [
      // Platos del Día (01)
      { categoryCode: '01', items: [
        { name: 'Riñoncitos al jerez c/ puré', price: 9000, code: '0101' },
        { name: 'Croquetas de carne c/ ensalada', price: 9000, code: '0102' },
        { name: 'Chupín de merluza c/ papa natural', price: 10000, code: '0103' },
        { name: 'Pechuga rellena c/ f. españolas', price: 12000, code: '0104' },
        { name: 'Mejillones c/ fettuccinis', price: 12000, code: '0105' },
        { name: 'Vacío a la parrilla c/ fritas', price: 14000, code: '0106' },
        { name: 'Peceto al verdeo c/ puré', price: 15000, code: '0107' },
        { name: 'Correntinos caseros a la Vangoli', price: 13000, code: '0108' }
      ]},
      // Promos de la Semana (02)
      { categoryCode: '02', items: [
        { name: 'Promo 1 (Entraña c/ arroz + postre + bebida)', price: 12000, code: '0201' },
        { name: 'Promo 2 (Salpicón de ave + postre + bebida)', price: 12000, code: '0202' }
      ]},
      // Cocina (03)
      { categoryCode: '03', items: [
        { name: '1/4 Pollo al horno c/ papas', price: 9000, code: '0301' },
        { name: '1/4 Pollo provenzal c/ fritas', price: 10000, code: '0302' },
        { name: 'Matambre al verdeo c/ fritas', price: 12000, code: '0303' },
        { name: 'Matambre a la pizza c/ fritas', price: 12000, code: '0304' },
        { name: 'Bondiola al ajillo c/ fritas', price: 12000, code: '0305' },
        { name: 'Bondiola al verdeo c/ papas', price: 12000, code: '0306' },
        { name: 'Costillitas (2) a la riojana', price: 18000, code: '0307' },
        { name: 'Vacío al horno c/ papas', price: 14000, code: '0308' },
        { name: 'Vacío a la parrilla c/ guarnición (ensalada)', price: 15000, code: '0309' },
        { name: 'Peceto horneado al vino c/ f. españolas', price: 15000, code: '0310' },
        { name: 'Peceto al verdeo c/ puré', price: 15000, code: '0311' },
        { name: 'Peceto al roquefort c/ f. españolas', price: 18000, code: '0312' },
        { name: 'Tapa de asado al horno c/ papas', price: 12000, code: '0313' },
        { name: 'Costillitas a la mostaza c/ fritas', price: 12000, code: '0314' }
      ]},
      // Pescados y Mariscos (05)
      { categoryCode: '05', items: [
        { name: 'Filet de merluza a la romana c/ g.', price: 8000, code: '0501' },
        { name: 'Filet de merluza napolitano / capresse c/g', price: 10000, code: '0502' },
        { name: 'Filet de merluza Suisse c/g.', price: 10000, code: '0503' },
        { name: 'Filet brotola al verdeo c/g', price: 12000, code: '0504' },
        { name: 'Trucha a la manteca negra c/ alcaparras', price: 25000, code: '0505' },
        { name: 'Salmón rosado c/ crema de puerros', price: 30000, code: '0506' },
        { name: 'Gambas al ajillo c/ fritas a la española', price: 20000, code: '0507' },
        { name: 'Calamares a la leonesa', price: 18000, code: '0508' },
        { name: 'Calamares con arroz', price: 12000, code: '0509' },
        { name: 'Calamares con spaghettis', price: 13000, code: '0510' },
        { name: 'Mejillones c/ arroz', price: 12000, code: '0511' },
        { name: 'Mejillones c/ spaghettis', price: 13000, code: '0512' },
        { name: 'Arroz con mariscos p/2', price: 25000, code: '0513' },
        { name: 'Cazuela de mariscos', price: 25000, code: '0514' },
        { name: 'Paella a la valenciana p/2', price: 30000, code: '0515' },
        { name: 'Rabas a la romana c/ f. españolas', price: 18000, code: '0516' },
        { name: 'Pulpo a la gallega', price: 60000, code: '0517' },
        { name: 'Bacalao de Noruega a la gallega', price: 30000, code: '0518' },
        { name: 'Bacalao a la vizcaína', price: 30000, code: '0519' }
      ]},
      // Ensaladas (06)
      { categoryCode: '06', items: [
        { name: '1 Ingrediente', price: 4000, code: '0601' },
        { name: '2 Ingrediente', price: 4500, code: '0602' },
        { name: '3 Ingredientes', price: 5000, code: '0603' },
        { name: '4 Ingredientes', price: 7000, code: '0604' }
      ]}
    ];

    let totalItems = 0;
    for (const catData of platosData) {
      const category = createdCategories.find(c => c.code === catData.categoryCode);
      if (category) {
        for (let i = 0; i < catData.items.length; i++) {
          const item = catData.items[i];
          
          await prisma.menuItem.create({
            data: {
              name: item.name,
              price: item.price,
              description: `Delicioso ${item.name.toLowerCase()}`,
              code: item.code,
              position: i + 1,
              isAvailable: true,
              isPopular: catData.categoryCode === '01',
              isPromo: catData.categoryCode === '02',
              categoryId: category.id,
              menuId: menu.id
            }
          });
          totalItems++;
        }
      }
    }

    console.log(`🍽️ ${totalItems} platos creados`);

    return NextResponse.json({
      success: true,
      message: 'Datos reales de Esquina Pompeya creados exitosamente',
      data: {
        userId: user.id,
        menuId: menu.id,
        categoriesCount: createdCategories.length,
        itemsCount: totalItems
      }
    });

  } catch (error) {
    console.error('❌ Error en seed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error creando datos reales',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
