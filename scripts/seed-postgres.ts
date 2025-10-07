import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos PostgreSQL...');

  try {
    // Limpiar datos existentes
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.menu.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Datos existentes eliminados');

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: 'Admin Esquina Pompeya',
        email: 'admin@esquinapompeya.com',
        password: 'hashed_password_here',
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        phone: '+54 11 2857-9746',
        address: 'Av. Fernández de la Cruz 1100',
        role: 'OWNER'
      }
    });

    // Crear menú
    const menu = await prisma.menu.create({
      data: {
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        description: 'Restobar & Parrilla',
        contactPhone: '+54 11 2857-9746',
        contactAddress: 'Av. Fernández de la Cruz 1100',
        logoUrl: '/demo-images/Logo.jpg',
        ownerId: user.id,
        deliveryEnabled: true,
        deliveryFee: 500,
        deliveryMinOrder: 8000
      }
    });

    // Crear categorías con items
    const categories = [
      {
        name: 'PLATOS DEL DÍA',
        items: [
          { name: 'Milanesas al horno c/ Puré', price: 9000, description: 'Milanesas caseras con puré de papa', isAvailable: true },
          { name: 'Croquetas de carne c/ensalada', price: 8000, description: 'Croquetas artesanales con ensalada fresca', isAvailable: true },
          { name: 'Chuleta de merluza c/rusa', price: 10000, description: 'Merluza a la plancha con papas', isAvailable: false },
          { name: 'Pechuga rellena c/ f. españolas', price: 12000, description: 'Pechuga rellena con papas españolas', isAvailable: true },
          { name: 'Mejillones c/ fetuccinis', price: 14000, description: 'Mejillones frescos con fettuccine', isAvailable: true },
          { name: 'Vacio a la parrilla c/fritas', price: 15000, description: 'Vacio premium a la parrilla con papas fritas', isAvailable: false },
          { name: 'Peceto al verdeo c/ Puré', price: 15000, description: 'Peceto con salsa verdeo y puré', isAvailable: true },
          { name: 'Arroz integral con vegetales', price: 11000, description: 'Arroz integral con vegetales frescos', isAvailable: true }
        ]
      },
      {
        name: 'PROMOCIONES DE LA SEMANA',
        items: [
          { name: 'Milanesa Completa', price: 12000, description: 'Milanesa + Papas + Bebida', isPromo: true },
          { name: 'Salpicón de Ave', price: 12000, description: 'Ensalada + Bebida + Postre', isPromo: true },
          { name: 'Parrilla Especial', price: 15000, description: 'Carne + Guarnición + Postre', isPromo: true }
        ]
      },
      {
        name: 'COCINA',
        items: [
          { name: 'Arepa de Pollo', price: 7500, description: 'Arepa rellena con pollo desmenuzado' },
          { name: 'Arepa de Carne', price: 8000, description: 'Arepa con carne molida' },
          { name: 'Arepa de Queso', price: 6500, description: 'Arepa con queso fresco' },
          { name: 'Arepa Mixta', price: 9000, description: 'Arepa con pollo y carne' },
          { name: 'Casuela de Mariscos', price: 16000, description: 'Casuela con mariscos frescos' },
          { name: 'Pollo al Curry', price: 13000, description: 'Pollo con curry y arroz' },
          { name: 'Lomo Saltado', price: 15000, description: 'Lomo saltado con papas' },
          { name: 'Churrasco c/ Chimichurri', price: 17000, description: 'Churrasco con chimichurri casero' },
          { name: 'Rabas a la Romana', price: 12000, description: 'Rabas empanizadas a la romana' },
          { name: 'Cazuela de Cordero', price: 19000, description: 'Cazuela de cordero con verduras' }
        ]
      }
    ];

    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          position: categories.indexOf(categoryData),
          menuId: menu.id
        }
      });

      for (const itemData of categoryData.items) {
        await prisma.menuItem.create({
          data: {
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            position: categoryData.items.indexOf(itemData),
            isAvailable: itemData.isAvailable ?? true,
            isPromo: itemData.isPromo ?? false,
            menuId: menu.id,
            categoryId: category.id
          }
        });
      }
    }

    console.log('✅ Seed completado exitosamente!');
    console.log(`👤 Usuario creado: ${user.email}`);
    console.log(`🍽️ Menú creado: ${menu.restaurantName}`);
    console.log(`📂 Categorías creadas: ${categories.length}`);
    
    const totalItems = categories.reduce((total, cat) => total + cat.items.length, 0);
    console.log(`🍽️ Total items: ${totalItems}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
