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
          { name: 'Milanesas al horno c/ Puré', price: 9000, description: 'Milanesas caseras con puré de papa', isAvailable: true, isPromo: false },
          { name: 'Croquetas de carne c/ensalada', price: 8000, description: 'Croquetas artesanales con ensalada fresca', isAvailable: true, isPromo: false },
          { name: 'Chuleta de merluza c/rusa', price: 10000, description: 'Merluza a la plancha con papas', isAvailable: false, isPromo: false },
          { name: 'Pechuga rellena c/ f. españolas', price: 12000, description: 'Pechuga rellena con papas españolas', isAvailable: true, isPromo: false },
          { name: 'Mejillones c/ fetuccinis', price: 14000, description: 'Mejillones frescos con fettuccine', isAvailable: true, isPromo: false },
          { name: 'Vacio a la parrilla c/fritas', price: 15000, description: 'Vacio premium a la parrilla con papas fritas', isAvailable: false, isPromo: false },
          { name: 'Peceto al verdeo c/ Puré', price: 15000, description: 'Peceto con salsa verdeo y puré', isAvailable: true, isPromo: false },
          { name: 'Arroz integral con vegetales', price: 11000, description: 'Arroz integral con vegetales frescos', isAvailable: true, isPromo: false }
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
          { name: 'Arepa de Pollo', price: 7500, description: 'Arepa rellena con pollo desmenuzado', isPromo: false },
          { name: 'Arepa de Carne', price: 8000, description: 'Arepa con carne molida', isPromo: false },
          { name: 'Arepa de Queso', price: 6500, description: 'Arepa con queso fresco', isPromo: false },
          { name: 'Arepa Mixta', price: 9000, description: 'Arepa con pollo y carne', isPromo: false },
          { name: 'Casuela de Mariscos', price: 16000, description: 'Casuela con mariscos frescos', isPromo: false },
          { name: 'Pollo al Curry', price: 13000, description: 'Pollo con curry y arroz', isPromo: false },
          { name: 'Lomo Saltado', price: 15000, description: 'Lomo saltado con papas', isPromo: false },
          { name: 'Churrasco c/ Chimichurri', price: 17000, description: 'Churrasco con chimichurri casero', isPromo: false },
          { name: 'Rabas a la Romana', price: 12000, description: 'Rabas empanizadas a la romana', isPromo: false },
          { name: 'Cazuela de Cordero', price: 19000, description: 'Cazuela de cordero con verduras', isPromo: false }
        ]
      },
      {
        name: 'TORTILLAS',
        items: [
          { name: 'Tortilla Española', price: 8500, description: 'Tortilla tradicional española', isPromo: false },
          { name: 'Tortilla de Papa', price: 7500, description: 'Tortilla de papas casera', isPromo: false },
          { name: 'Tortilla de Jamón y Queso', price: 9000, description: 'Tortilla con jamón y queso', isPromo: false },
          { name: 'Tortilla de Verduras', price: 8000, description: 'Tortilla con verduras frescas', isPromo: false },
          { name: 'Tortilla de Atún', price: 9500, description: 'Tortilla con atún y cebolla', isPromo: false }
        ]
      },
      {
        name: 'ENSALADAS',
        items: [
          { name: 'Ensalada César', price: 7000, description: 'Ensalada César con pollo', isPromo: false },
          { name: 'Ensalada Mixta', price: 6000, description: 'Ensalada mixta fresca', isPromo: false },
          { name: 'Ensalada de Rúcula', price: 7500, description: 'Rúcula con parmesano', isPromo: false },
          { name: 'Ensalada Caprese', price: 8500, description: 'Tomate, mozzarella y albahaca', isPromo: false }
        ]
      },
      {
        name: 'POSTRES',
        items: [
          { name: 'Tiramisú', price: 4500, description: 'Tiramisú casero', isPromo: false },
          { name: 'Flan Casero', price: 3500, description: 'Flan de vainilla casero', isPromo: false },
          { name: 'Helado 3 Bolas', price: 4000, description: 'Helado artesanal 3 sabores', isPromo: false },
          { name: 'Brownie con Helado', price: 5000, description: 'Brownie caliente con helado', isPromo: false }
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
