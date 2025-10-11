import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de datos demo...');

    // Limpiar datos existentes
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.menu.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Datos limpiados');

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: 'Esquina Pompeya',
        email: 'admin@esquinapompeya.com',
        phone: '+54 9 11 1234-5678',
        address: 'Av. Corrientes 1234, CABA',
        role: 'ADMIN'
      }
    });

    console.log('👤 Usuario creado:', user.id);

    // Crear menú
    const menu = await prisma.menu.create({
      data: {
        restaurantName: 'Esquina Pompeya',
        restaurantId: 'esquina-pompeya',
        description: 'Restaurante tradicional argentino',
        contactPhone: '+54 9 11 1234-5678',
        contactAddress: 'Av. Corrientes 1234, CABA',
        contactEmail: 'info@esquinapompeya.com',
        socialInstagram: '@esquinapompeya',
        ownerId: user.id
      }
    });

    console.log('🍽️ Menú creado:', menu.id);

    // Crear categorías con códigos
    const categories = [
      { name: 'Platos del Día', code: '01', position: 1 },
      { name: 'Promociones', code: '02', position: 2 },
      { name: 'Cocina', code: '03', position: 3 },
      { name: 'Parrilla', code: '04', position: 4 },
      { name: 'Pescados y Mariscos', code: '05', position: 5 },
      { name: 'Ensaladas', code: '06', position: 6 },
      { name: 'Postres', code: '07', position: 7 },
      { name: 'Bebidas', code: '08', position: 8 }
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

    // Crear platos de ejemplo
    const platosData = [
      // Platos del Día (01)
      { categoryCode: '01', items: [
        { name: 'Riñoncitos al jerez c/ puré', price: 9000, description: 'Deliciosos riñones en salsa jerez' },
        { name: 'Croquetas de carne c/ ensalada', price: 9000, description: 'Croquetas caseras con ensalada fresca' },
        { name: 'Chupín de merluza c/ papa natural', price: 10000, description: 'Pescado fresco con papas naturales' },
        { name: 'Pechuga rellena c/ f. españolas', price: 12000, description: 'Pechuga rellena con papas españolas' },
        { name: 'Mejillones c/ fettuccinis', price: 12000, description: 'Mejillones con pasta fresca' }
      ]},
      // Promociones (02)
      { categoryCode: '02', items: [
        { name: 'Milanesa Completa', price: 2500, description: 'Milanesa con papas, huevo y ensalada' },
        { name: 'Vacio con Papas', price: 3000, description: 'Corte de vacío con papas fritas' },
        { name: 'Rabas', price: 2800, description: 'Rabas frescas con limón' }
      ]},
      // Cocina (03)
      { categoryCode: '03', items: [
        { name: 'Albóndigas con papas', price: 2200, description: 'Albóndigas caseras con papas' },
        { name: 'Pollo al horno', price: 1800, description: 'Pollo entero al horno' },
        { name: 'Vacío al horno c/ papas', price: 14000, description: 'Corte premium al horno' }
      ]},
      // Parrilla (04)
      { categoryCode: '04', items: [
        { name: 'Bife de chorizo', price: 15000, description: 'Bife de chorizo a la parrilla' },
        { name: 'Ojo de bife', price: 11600, description: 'Ojo de bife premium' },
        { name: 'Provoletta Esquina', price: 12000, description: 'Provoleta especial de la casa' }
      ]},
      // Pescados y Mariscos (05)
      { categoryCode: '05', items: [
        { name: 'Filet de merluza a la romana', price: 8000, description: 'Filet de merluza rebozado' },
        { name: 'Salmón rosado c/ crema de puerros', price: 30000, description: 'Salmón con crema de puerros' },
        { name: 'Gambas al ajillo', price: 20000, description: 'Gambas al ajillo españolas' }
      ]}
    ];

    let totalItems = 0;
    for (const catData of platosData) {
      const category = createdCategories.find(c => c.code === catData.categoryCode);
      if (category) {
        for (let i = 0; i < catData.items.length; i++) {
          const item = catData.items[i];
          const itemCode = `${catData.categoryCode}${String(i + 1).padStart(2, '0')}`;
          
          await prisma.menuItem.create({
            data: {
              name: item.name,
              price: item.price,
              description: item.description,
              code: itemCode,
              position: i + 1,
              isAvailable: true,
              isPopular: false,
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
      message: 'Datos demo creados exitosamente',
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
        error: 'Error creando datos demo',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
