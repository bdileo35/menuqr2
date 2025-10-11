import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de datos reales para Esquina Pompeya...');
    console.log('🔍 Verificando que el endpoint se ejecuta correctamente...');

    // Verificar conexión a la base de datos
    console.log('🔗 Conectando a Supabase...');
    
    // Limpiar datos existentes (Prisma se encarga de crear las tablas)
    console.log('🧹 Limpiando datos existentes...');
    
    try {
      await prisma.menuItem.deleteMany();
      await prisma.category.deleteMany();
      await prisma.menu.deleteMany();
      await prisma.user.deleteMany();
      console.log('✅ Datos limpiados exitosamente');
    } catch (error) {
      console.log('⚠️ Error limpiando datos, continuando...', error);
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