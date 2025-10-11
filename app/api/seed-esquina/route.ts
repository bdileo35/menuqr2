import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Datos del menú de Esquina Pompeya
const MENU_DATA = {
  'Platos del Día': [
    { name: 'Riñoncitos al jerez c/ puré', price: '$9000' },
    { name: 'Croquetas de carne c/ ensalada', price: '$9000' },
    { name: 'Chupín de merluza c/ papa natural', price: '$10000' },
    { name: 'Pechuga rellena c/ f. españolas', price: '$12000' },
    { name: 'Mejillones c/ fettuccinis', price: '$12000' },
    { name: 'Vacío a la parrilla c/ fritas', price: '$14000' },
    { name: 'Peceto al verdeo c/ puré', price: '$15000' },
    { name: 'Correntinos caseros a la Vangoli', price: '$13000' }
  ],
  'Promos de la Semana': [
    { name: 'Promo 1 (Entraña c/ arroz + postre + bebida)', price: '$12000', isPromo: true },
    { name: 'Promo 2 (Salpicón de ave + postre + bebida)', price: '$12000', isPromo: true }
  ],
  'Cocina': [
    { name: '1/4 Pollo al horno c/ papas', price: '$9000' },
    { name: '1/4 Pollo provenzal c/ fritas', price: '$10000' },
    { name: 'Matambre al verdeo c/ fritas', price: '$12000' },
    { name: 'Matambre a la pizza c/ fritas', price: '$12000' },
    { name: 'Bondiola al ajillo c/ fritas', price: '$12000' },
    { name: 'Bondiola al verdeo c/ papas', price: '$12000' },
    { name: 'Costillitas (2) a la riojana', price: '$18000' },
    { name: 'Vacío al horno c/ papas', price: '$14000' },
    { name: 'Vacío a la parrilla c/ guarnición (ensalada)', price: '$15000' },
    { name: 'Peceto horneado al vino c/ f. españolas', price: '$15000' },
    { name: 'Peceto al verdeo c/ puré', price: '$15000' },
    { name: 'Peceto al roquefort c/ f. españolas', price: '$18000' },
    { name: 'Tapa de asado al horno c/ papas', price: '$12000' },
    { name: 'Costillitas a la mostaza c/ fritas', price: '$12000' }
  ],
  'DEL MAR: PESCADOS Y MARISCOS': [
    { name: 'Rabas (porción)', price: '$18000' },
    { name: 'Rabas (media docena)', price: '$11000' },
    { name: 'Langostinos c/ salsa golf', price: '$15000' },
    { name: 'Merluza a la romana c/ papas', price: '$12000' },
    { name: 'Merluza a la plancha c/ ensalada', price: '$11000' },
    { name: 'Salmón a la plancha c/ ensalada', price: '$18000' },
    { name: 'Corvina a la plancha c/ ensalada', price: '$15000' },
    { name: 'Brócoli c/ salsa holandesa', price: '$8000' },
    { name: 'Calamares a la romana c/ papas', price: '$12000' },
    { name: 'Calamares en su tinta c/ arroz', price: '$14000' },
    { name: 'Paella para 2 personas', price: '$25000' },
    { name: 'Risotto de mariscos', price: '$18000' },
    { name: 'Lenguado a la meuniere c/ papas', price: '$16000' },
    { name: 'Atún a la plancha c/ ensalada', price: '$18000' },
    { name: 'Pulpo a la gallega', price: '$16000' },
    { name: 'Cazuela de mariscos', price: '$20000' },
    { name: 'Sushi roll de salmón', price: '$12000' },
    { name: 'Sashimi de atún', price: '$15000' },
    { name: 'Ceviche de pescado', price: '$13000' }
  ],
  'ENSALADAS': [
    { name: 'Ensalada mixta', price: '$8000' },
    { name: 'Ensalada de lechuga y tomate', price: '$6000' },
    { name: 'Ensalada César', price: '$10000' },
    { name: 'Ensalada de pollo', price: '$12000' }
  ],
  'ENSALADAS ESPECIALES': [
    { name: 'Ensalada de salmón ahumado', price: '$15000' },
    { name: 'Ensalada de langostinos', price: '$16000' },
    { name: 'Ensalada de atún', price: '$14000' },
    { name: 'Ensalada griega', price: '$12000' },
    { name: 'Ensalada de quinoa', price: '$13000' },
    { name: 'Ensalada de espinaca y nueces', price: '$11000' },
    { name: 'Ensalada de rúcula y parmesano', price: '$12000' },
    { name: 'Ensalada de tomate y mozzarella', price: '$10000' },
    { name: 'Ensalada de palta y camarones', price: '$15000' },
    { name: 'Ensalada de pollo y aguacate', price: '$13000' },
    { name: 'Ensalada de atún y garbanzos', price: '$14000' },
    { name: 'Ensalada de quinoa y vegetales', price: '$12000' },
    { name: 'Ensalada de espinaca y fresas', price: '$13000' },
    { name: 'Ensalada de remolacha y queso de cabra', price: '$14000' }
  ]
};

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de Esquina Pompeya en Vercel...');

    // 1. Limpiar datos existentes
    console.log('🗑️ Limpiando datos antiguos...');
    await prisma.menuItem.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.menu.deleteMany({});
    await prisma.user.deleteMany({});

    // 2. Crear usuario owner
    console.log('👤 Creando usuario owner...');
    const hashedPassword = await bcrypt.hash('esquina2024', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Esquina Pompeya',
        email: 'esquina@pompeya.com',
        password: hashedPassword,
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        phone: '+54 11 4911-6666',
        address: 'Av. Fernández de la Cruz 1100, Buenos Aires',
        role: 'OWNER'
      }
    });
    console.log(`✅ Usuario creado: ${user.email}`);

    // 3. Crear menú
    console.log('📋 Creando menú...');
    const menu = await prisma.menu.create({
      data: {
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        description: 'Restaurante tradicional con cocina argentina y especialidades del mar',
        ownerId: user.id,
        contactPhone: '+54 11 4911-6666',
        contactAddress: 'Av. Fernández de la Cruz 1100, Buenos Aires',
        contactEmail: 'esquina@pompeya.com',
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        showPrices: true,
        showImages: true,
        showDescriptions: true,
        currency: '$',
        language: 'es'
      }
    });
    console.log(`✅ Menú creado: ${menu.restaurantName}`);

    // 4. Crear categorías y productos
    console.log('📦 Creando categorías y productos...');
    let totalItems = 0;
    let categoryPosition = 0;

    for (const [categoryName, items] of Object.entries(MENU_DATA)) {
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          menuId: menu.id,
          position: categoryPosition++,
          isActive: true
        }
      });

      console.log(`  📁 Categoría: ${categoryName}`);

      // Crear items de esta categoría
      let itemPosition = 0;
      for (const item of items) {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            price: item.price,
            menuId: menu.id,
            categoryId: category.id,
            position: itemPosition++,
            isPromo: item.isPromo || false,
            isAvailable: true
          }
        });
        totalItems++;
      }
      
      console.log(`     ✓ ${items.length} productos creados`);
    }

    console.log(`\n🎉 Seed completado exitosamente!`);
    console.log(`📊 Resumen:`);
    console.log(`   👤 1 usuario (Owner)`);
    console.log(`   📋 1 menú`);
    console.log(`   📁 ${Object.keys(MENU_DATA).length} categorías`);
    console.log(`   🍽️ ${totalItems} productos`);

    return NextResponse.json({
      success: true,
      message: 'Seed completado exitosamente',
      data: {
        user: user.email,
        menu: menu.restaurantName,
        categories: Object.keys(MENU_DATA).length,
        items: totalItems
      }
    });

  } catch (error) {
    console.error('❌ Error en seed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al ejecutar seed',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
