import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// DATOS REALES: Menu_Esquina_Pompeya.md
const MENU_DATA = {
  'Platos del Día': [
    { name: 'Rinioncitos al jerez c/ puré', price: 9000 },
    { name: 'Croquetas de carne c/ ensalada', price: 9000 },
    { name: 'Chupín de merluza c/ papa natural', price: 10000 },
    { name: 'Pechuga rellena c/ f. españolas', price: 12000 },
    { name: 'Mejillones c/ fettuccinis', price: 12000 },
    { name: 'Vacío a la parrilla c/ fritas', price: 14000 },
    { name: 'Peceto al verdeo c/ puré', price: 15000 },
    { name: 'Correntinos caseros a la Vangoli', price: 13000 }
  ],
  'Promos de la Semana': [
    { name: 'Promo 1 (Entraña c/ arroz + postre + bebida)', price: 12000, isPromo: true },
    { name: 'Promo 2 (Salpicón de ave + postre + bebida)', price: 12000, isPromo: true }
  ],
  'Tortillas': [
    { name: 'Papas', price: 8000 },
    { name: 'Papas c/ cebolla', price: 9000 },
    { name: 'Española', price: 10000 },
    { name: 'Verdura', price: 8000 },
    { name: 'Papas fritas porción', price: 6000 },
    { name: 'Puré porción', price: 6000 },
    { name: 'P. de papas fritas', price: 6000 },
    { name: 'P. de puré de papas/calabaza', price: 6000 },
    { name: 'P. de papas al horno', price: 7000 },
    { name: 'Papas fritas c/ provenzal', price: 7000 },
    { name: 'Papas fritas a caballo', price: 8000 }
  ],
  'Omelets': [
    { name: 'Omelet c/ jamón', price: 7000 },
    { name: 'Omelet c/ jamón y queso', price: 8000 },
    { name: 'Omelet c/ jamón, queso y tomate', price: 9000 },
    { name: 'Omelet de verdura', price: 7000 }
  ],
  'Cocina': [
    { name: '1/4 Pollo al horno c/ papas', price: 9000 },
    { name: '1/4 Pollo provenzal c/ fritas', price: 10000 },
    { name: 'Matambre al verdeo c/ fritas', price: 12000 },
    { name: 'Matambre a la pizza c/ fritas', price: 12000 },
    { name: 'Bondiola al ajillo c/ fritas', price: 12000 },
    { name: 'Bondiola al verdeo c/ papas', price: 12000 },
    { name: 'Costillitas (2) a la riojana', price: 18000 },
    { name: 'Vacío al horno c/ papas', price: 14000 },
    { name: 'Vacío a la parrilla c/ guarnición (ensalada)', price: 15000 },
    { name: 'Peceto horneado al vino c/ f. españolas', price: 15000 },
    { name: 'Peceto al verdeo c/ puré', price: 15000 },
    { name: 'Peceto al roquefort c/ f. españolas', price: 18000 },
    { name: 'Tapa de asado al horno c/ papas', price: 12000 },
    { name: 'Costillitas a la mostaza c/ fritas', price: 12000 }
  ],
  'Sandwiches Fríos': [
    { name: 'Francés jamón y queso', price: 6000 },
    { name: 'Francés salame y queso', price: 6000 },
    { name: 'Francés jamón crudo y queso', price: 7000 },
    { name: 'Sandwich de matambre casero', price: 7000 }
  ],
  'Sandwiches Calientes': [
    { name: 'Sw. milanesa simple', price: 5000 },
    { name: 'Sw. milanesa LyT', price: 6000 },
    { name: 'Sw. milanesa completo', price: 7000 },
    { name: 'Sw. milanesa napolitana', price: 8000 },
    { name: 'Sw. lomito solo simple', price: 8000 },
    { name: 'Sw. lomito JyQ / LyT', price: 9000 },
    { name: 'Sw. lomito completo', price: 10000 },
    { name: 'Sw. bondiola simple', price: 8000 },
    { name: 'Sw. bondiola JyQ / LyT', price: 9000 },
    { name: 'Sw. bondiola completo', price: 10000 },
    { name: 'Sw. pechuga simple', price: 8000 },
    { name: 'Sw. pechuga JyQ / LyT', price: 9000 },
    { name: 'Sw. pechuga completo', price: 10000 },
    { name: 'Sw. de vacío', price: 10000 }
  ],
  'Entradas': [
    { name: 'Picada para 1', price: 10000 },
    { name: 'Matambre casero c/ rusa', price: 10000 },
    { name: 'Lengua a la vinagreta c/ rusa', price: 9000 },
    { name: 'Mayonesa de ave', price: 10000 },
    { name: 'Mayonesa de atún', price: 10000 },
    { name: 'Pechuga a la criolla c/ rusa', price: 11000 },
    { name: 'Peceto a la criolla c/ rusa', price: 12000 },
    { name: 'Picada para 2', price: 19000 },
    { name: 'Jamón cocido c/ rusa', price: 15000 },
    { name: 'Jamón crudo c/ rusa', price: 18000 },
    { name: 'Jamón crudo c/ melón', price: 18000 },
    { name: 'Salpicón de atún', price: 15000 },
    { name: 'Langostinos c/ salsa golf', price: 15000 },
    { name: 'Palmitos c/ salsa golf', price: 12000 },
    { name: 'Empanadas Carne/Pollo/JyQ (c/u)', price: 1600 }
  ],
  'Empanadas': [
    { name: 'Empanadas Atún (c/u)', price: 1800 }
  ]
};

async function seedEsquinaPompeya() {
  console.log('🌱 Iniciando seed de Esquina Pompeya...');

  try {
    // 1. Crear usuario owner
    console.log('👤 Creando usuario owner...');
    const hashedPassword = await bcrypt.hash('esquina2024', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Esquina Pompeya',
        email: 'esquina@pompeya.com',
        password: hashedPassword,
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        phone: '+54 11 1234-5678',
        address: 'Av. Fernández de la Cruz 1100',
        role: 'OWNER'
      }
    });
    console.log(`✅ Usuario creado: ${user.email}`);

    // 2. Crear menú
    console.log('📋 Creando menú...');
    const menu = await prisma.menu.create({
      data: {
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        description: 'RESTOBAR & PARRILLA',
        ownerId: user.id,
        contactPhone: '+54 11 1234-5678',
        contactAddress: 'Av. Fernández de la Cruz 1100',
        logoUrl: '/demo-images/Logo.jpg',
        
        // Configuración de delivery
        deliveryEnabled: true,
        deliveryFee: 1500,
        deliveryMinOrder: 8000,
        
        // Settings
        allowOrdering: true,
        showPrices: true,
        showImages: true,
        currency: '$'
      }
    });
    console.log(`✅ Menú creado: ${menu.restaurantName}`);

    // 3. Crear categorías y productos
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
    console.log(`\n🔐 Credenciales:`);
    console.log(`   Email: esquina@pompeya.com`);
    console.log(`   Password: esquina2024`);
    console.log(`\n🚀 Abrí http://localhost:3000/menu/esquina-pompeya para ver el menú`);

  } catch (error) {
    console.error('❌ Error en seed:', error);
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
