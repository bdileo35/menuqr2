import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEsquinaPompeya() {
  console.log('🌱 Poblando base de datos con Esquina Pompeya...');

  try {
    // Crear usuario/restaurante
    const user = await prisma.user.upsert({
      where: { email: 'esquinapompeya@example.com' },
      update: {},
      create: {
        name: 'Esquina Pompeya',
        email: 'esquinapompeya@example.com',
        password: 'password123', // En producción usar hash
        restaurantId: 'esquina-pompeya',
        restaurantName: 'ESQUINA POMPEYA',
        phone: '+54 11 1234-5678',
        address: 'Av. Pompeya 123, CABA',
        role: 'ADMIN'
      }
    });

    // Crear menú principal
    const menu = await prisma.menu.upsert({
      where: { restaurantId: 'esquina-pompeya' },
      update: {},
      create: {
        restaurantId: 'esquina-pompeya',
        restaurantName: 'ESQUINA POMPEYA',
        description: 'Parrilla tradicional argentina',
        ownerId: user.id,
        primaryColor: '#1e40af', // blue-800
        secondaryColor: '#64748b', // slate-500
        backgroundColor: '#1f2937', // gray-800
        textColor: '#ffffff',
        contactPhone: '+54 11 1234-5678',
        contactAddress: 'Av. Pompeya 123, CABA',
        currency: '$',
        showPrices: true,
        showImages: true,
        showDescriptions: true
      }
    });

    // Crear categoría "PLATOS DEL DIA"
    const platosDiaCategory = await prisma.category.create({
      data: {
        name: 'PLATOS DEL DIA',
        description: 'Especialidades diarias de la casa',
        menuId: menu.id,
        position: 1,
        isActive: true
      }
    });

    // Crear items de PLATOS DEL DIA
    const platosDia = [
      {
        name: 'Milanesas al horno c/ Puré',
        description: 'Milanesas caseras al horno acompañadas con puré de papa cremoso',
        price: 9000,
        isPopular: true
      },
      {
        name: 'Croquetas de carne c/ensalada',
        description: 'Croquetas de carne caseras con ensalada mixta fresca',
        price: 8000,
        isPopular: true
      },
      {
        name: 'Chuleta de merluza c/rusa gatura',
        description: 'Chuleta de merluza grillada con ensalada rusa casera',
        price: 10000,
        isPopular: true
      },
      {
        name: 'Pechuga rellena c/ f. españolas',
        description: 'Pechuga de pollo rellena con jamón y queso, papas españolas',
        price: 12000,
        isPopular: true
      },
      {
        name: 'Mejillones c/ fetuccinis',
        description: 'Mejillones frescos con pasta fetuccini en salsa marinara',
        price: 14000,
        isPopular: true
      },
      {
        name: 'Vacío a la parrilla c/fritas',
        description: 'Vacío jugoso a la parrilla con papas fritas caseras',
        price: 15000,
        isPopular: true
      },
      {
        name: 'Pechito al verdeo c/ Puré',
        description: 'Pechito de cerdo al verdeo con puré de papa cremoso',
        price: 15000,
        isPopular: true
      }
    ];

    for (let i = 0; i < platosDia.length; i++) {
      const plato = platosDia[i];
      await prisma.menuItem.create({
        data: {
          ...plato,
          menuId: menu.id,
          categoryId: platosDiaCategory.id,
          position: i + 1,
          isAvailable: true,
          isPromo: false,
          spicyLevel: 0
        }
      });
    }

    // Crear categoría "PROMOS"
    const promosCategory = await prisma.category.create({
      data: {
        name: 'PROMOS • Incluyen bebida y postre',
        description: 'Promociones especiales con bebida y postre incluido',
        menuId: menu.id,
        position: 2,
        isActive: true
      }
    });

    // Crear items de PROMOS
    const promos = [
      {
        name: 'PROMO 1: Milanesa Completa',
        description: 'Milanesa con guarnición + bebida + postre',
        price: 12000,
        originalPrice: 15000,
        isPromo: true
      },
      {
        name: 'PROMO 2: Salpicón de Ave',
        description: 'Salpicón de pollo fresco + bebida + postre',
        price: 12000,
        originalPrice: 15000,
        isPromo: true
      }
    ];

    for (let i = 0; i < promos.length; i++) {
      const promo = promos[i];
      await prisma.menuItem.create({
        data: {
          ...promo,
          menuId: menu.id,
          categoryId: promosCategory.id,
          position: i + 1,
          isAvailable: true,
          isPopular: false,
          spicyLevel: 0
        }
      });
    }

    // Crear categoría "EMPANADAS"
    const empanadasCategory = await prisma.category.create({
      data: {
        name: 'EMPANADAS',
        description: 'Empanadas caseras recién horneadas',
        menuId: menu.id,
        position: 3,
        isActive: true
      }
    });

    // Crear items de EMPANADAS
    await prisma.menuItem.create({
      data: {
        name: 'Carne - Pollo - J y Q',
        description: 'Docena de empanadas mixtas: carne, pollo, jamón y queso',
        price: 8000,
        menuId: menu.id,
        categoryId: empanadasCategory.id,
        position: 1,
        isAvailable: true,
        isPopular: false,
        isPromo: false,
        spicyLevel: 0
      }
    });

    console.log('✅ Esquina Pompeya creada exitosamente!');
    console.log(`📋 Menú ID: ${menu.id}`);
    console.log(`🏪 Restaurant ID: esquina-pompeya`);
    console.log(`🔗 URL: /menu/esquina-pompeya`);

  } catch (error) {
    console.error('❌ Error creando Esquina Pompeya:', error);
    throw error;
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  seedEsquinaPompeya()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedEsquinaPompeya;