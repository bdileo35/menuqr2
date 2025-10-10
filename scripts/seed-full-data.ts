import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos con datos completos...');

  // Limpiar datos existentes
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
      password: 'password123', // En un entorno real, usar hash
      restaurantId: 'esquina-pompeya',
      restaurantName: 'Esquina Pompeya',
      role: 'ADMIN',
    },
  });
  console.log(`👤 Usuario creado: ${user.email}`);

  // Crear menú
  const menu = await prisma.menu.create({
    data: {
      restaurantId: 'esquina-pompeya',
      restaurantName: 'Esquina Pompeya',
      description: 'El mejor lugar para comer en Pompeya',
      contactPhone: '+54 11 2857-9746',
      contactAddress: 'Av. Fernández de la Cruz 1100',
      logoUrl: '/demo-images/Logo.jpg',
      ownerId: user.id,
      deliveryEnabled: true,
      deliveryFee: 500,
      deliveryMinOrder: 8000
    }
  });
  console.log(`🍽️ Menú creado: ${menu.restaurantName}`);

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
        { name: 'Arroz integral con vegetales', price: 11000, description: 'Arroz integral con vegetales frescos', isAvailable: true, isPromo: false },
        { name: 'Riñoncitos al jerez c/ puré', price: 9000, description: 'Riñones al jerez con puré de papa', isAvailable: true, isPromo: false },
        { name: 'Chupín de merluza c/ papa natural', price: 10000, description: 'Chupín de merluza con papas', isAvailable: true, isPromo: false },
        { name: 'Correntinos caseros a la Vangoli', price: 13000, description: 'Correntinos caseros estilo Vangoli', isAvailable: true, isPromo: false },
        { name: 'Lomo saltado', price: 15000, description: 'Lomo saltado con papas', isAvailable: true, isPromo: false },
        { name: 'Pollo al Curry', price: 13000, description: 'Pollo con curry y arroz', isAvailable: true, isPromo: false },
        { name: 'Cazuela de Cordero', price: 19000, description: 'Cazuela de cordero con verduras', isAvailable: true, isPromo: false },
        { name: 'Rabas a la Romana', price: 12000, description: 'Rabas empanizadas a la romana', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'PROMOCIONES DE LA SEMANA',
      items: [
        { name: 'Milanesa Completa', price: 12000, description: 'Milanesa + Papas + Bebida', isAvailable: true, isPromo: true },
        { name: 'Salpicón de Ave', price: 12000, description: 'Ensalada + Bebida + Postre', isAvailable: true, isPromo: true },
        { name: 'Parrilla Especial', price: 15000, description: 'Carne + Guarnición + Postre', isAvailable: true, isPromo: true },
        { name: 'Promo Entraña c/ arroz + postre + bebida', price: 12000, description: 'Entraña con arroz + postre + bebida', isAvailable: true, isPromo: true },
        { name: 'Promo Pollo + Papas + Bebida', price: 11000, description: '1/4 Pollo + Papas + Bebida', isAvailable: true, isPromo: true },
        { name: 'Promo Milanesa + Ensalada + Postre', price: 13000, description: 'Milanesa + Ensalada + Postre', isAvailable: true, isPromo: true }
      ]
    },
    {
      name: 'COCINA',
      items: [
        { name: '1/4 Pollo al horno c/ papas', price: 9000, description: 'Cuarto de pollo al horno con papas', isAvailable: true, isPromo: false },
        { name: '1/4 Pollo provenzal c/ fritas', price: 10000, description: 'Cuarto de pollo provenzal con papas fritas', isAvailable: true, isPromo: false },
        { name: 'Matambre al verdeo c/ fritas', price: 12000, description: 'Matambre al verdeo con papas fritas', isAvailable: true, isPromo: false },
        { name: 'Matambre a la pizza c/ fritas', price: 12000, description: 'Matambre a la pizza con papas fritas', isAvailable: true, isPromo: false },
        { name: 'Bondiola al ajillo c/ fritas', price: 12000, description: 'Bondiola al ajillo con papas fritas', isAvailable: true, isPromo: false },
        { name: 'Bondiola al verdeo c/ papas', price: 12000, description: 'Bondiola al verdeo con papas', isAvailable: true, isPromo: false },
        { name: 'Costillitas (2) a la riojana', price: 18000, description: 'Dos costillitas a la riojana', isAvailable: true, isPromo: false },
        { name: 'Vacío al horno c/ papas', price: 14000, description: 'Vacío al horno con papas', isAvailable: true, isPromo: false },
        { name: 'Arepa de Pollo', price: 7500, description: 'Arepa rellena con pollo desmenuzado', isAvailable: true, isPromo: false },
        { name: 'Arepa de Carne', price: 8000, description: 'Arepa con carne molida', isAvailable: true, isPromo: false },
        { name: 'Arepa de Queso', price: 6500, description: 'Arepa con queso fresco', isAvailable: true, isPromo: false },
        { name: 'Arepa Mixta', price: 9000, description: 'Arepa con pollo y carne', isAvailable: true, isPromo: false },
        { name: 'Casuela de Mariscos', price: 16000, description: 'Casuela con mariscos frescos', isAvailable: true, isPromo: false },
        { name: 'Pollo al Curry', price: 13000, description: 'Pollo con curry y arroz', isAvailable: true, isPromo: false },
        { name: 'Lomo Saltado', price: 15000, description: 'Lomo saltado con papas', isAvailable: true, isPromo: false },
        { name: 'Churrasco c/ Chimichurri', price: 17000, description: 'Churrasco con chimichurri casero', isAvailable: true, isPromo: false },
        { name: 'Rabas a la Romana', price: 12000, description: 'Rabas empanizadas a la romana', isAvailable: true, isPromo: false },
        { name: 'Cazuela de Cordero', price: 19000, description: 'Cazuela de cordero con verduras', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'PARRILLA',
      items: [
        { name: 'Asado de tira (300gr)', price: 14000, description: 'Asado de tira 300 gramos', isAvailable: true, isPromo: false },
        { name: 'Bife de chorizo (300gr)', price: 16000, description: 'Bife de chorizo 300 gramos', isAvailable: true, isPromo: false },
        { name: 'Vacío (300gr)', price: 15000, description: 'Vacío 300 gramos', isAvailable: true, isPromo: false },
        { name: 'Entraña (250gr)', price: 14000, description: 'Entraña 250 gramos', isAvailable: true, isPromo: false },
        { name: 'Parrillada para 2', price: 28000, description: 'Parrillada completa para dos personas', isAvailable: true, isPromo: false },
        { name: 'Parrillada para 4', price: 52000, description: 'Parrillada completa para cuatro personas', isAvailable: true, isPromo: false },
        { name: 'Chorizo parrillero', price: 8000, description: 'Chorizo a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Morcilla parrillera', price: 7000, description: 'Morcilla a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Mollejas', price: 12000, description: 'Mollejas a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Riñones', price: 11000, description: 'Riñones a la parrilla', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'TORTILLAS',
      items: [
        { name: 'Tortilla Española', price: 8500, description: 'Tortilla tradicional española', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Papa', price: 7500, description: 'Tortilla de papas casera', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Jamón y Queso', price: 9000, description: 'Tortilla con jamón y queso', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Verduras', price: 8000, description: 'Tortilla con verduras frescas', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Atún', price: 9500, description: 'Tortilla con atún y cebolla', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Espinaca', price: 8200, description: 'Tortilla de espinaca fresca', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Cebolla', price: 7800, description: 'Tortilla de cebolla caramelizada', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'ENSALADAS',
      items: [
        { name: 'Ensalada César', price: 7000, description: 'Ensalada César con pollo', isAvailable: true, isPromo: false },
        { name: 'Ensalada Mixta', price: 6000, description: 'Ensalada mixta fresca', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Rúcula', price: 7500, description: 'Rúcula con parmesano', isAvailable: true, isPromo: false },
        { name: 'Ensalada Caprese', price: 8500, description: 'Tomate, mozzarella y albahaca', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Palta', price: 8000, description: 'Ensalada con palta fresca', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Remolacha', price: 7200, description: 'Ensalada de remolacha con queso de cabra', isAvailable: true, isPromo: false },
        { name: 'Ensalada Griega', price: 8800, description: 'Ensalada griega tradicional', isAvailable: true, isPromo: false },
        { name: 'Ensalada Waldorf', price: 8200, description: 'Ensalada Waldorf con manzana y nueces', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'PASTAS',
      items: [
        { name: 'Spaghetti a la Bolognesa', price: 11000, description: 'Spaghetti con salsa bolognesa', isAvailable: true, isPromo: false },
        { name: 'Fettuccine Alfredo', price: 12000, description: 'Fettuccine con salsa alfredo', isAvailable: true, isPromo: false },
        { name: 'Ravioles de Ricotta', price: 13000, description: 'Ravioles de ricotta con salsa de tomate', isAvailable: true, isPromo: false },
        { name: 'Canelones de Espinaca', price: 12500, description: 'Canelones de espinaca con bechamel', isAvailable: true, isPromo: false },
        { name: 'Lasagna de Carne', price: 14000, description: 'Lasagna de carne con queso', isAvailable: true, isPromo: false },
        { name: 'Penne Arrabiata', price: 10500, description: 'Penne con salsa arrabiata', isAvailable: true, isPromo: false },
        { name: 'Gnocchi de Papa', price: 12000, description: 'Gnocchi de papa con salsa de tomate', isAvailable: true, isPromo: false },
        { name: 'Sorrentinos de Jamón y Queso', price: 13500, description: 'Sorrentinos de jamón y queso', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'PIZZAS',
      items: [
        { name: 'Pizza Margherita', price: 8500, description: 'Pizza con tomate, mozzarella y albahaca', isAvailable: true, isPromo: false },
        { name: 'Pizza Napolitana', price: 9500, description: 'Pizza napolitana tradicional', isAvailable: true, isPromo: false },
        { name: 'Pizza de Jamón y Morrones', price: 10000, description: 'Pizza con jamón y morrones', isAvailable: true, isPromo: false },
        { name: 'Pizza de Calabresa', price: 10500, description: 'Pizza con calabresa y cebolla', isAvailable: true, isPromo: false },
        { name: 'Pizza de Rúcula y Parmesano', price: 11000, description: 'Pizza con rúcula y parmesano', isAvailable: true, isPromo: false },
        { name: 'Pizza de Champiñones', price: 9800, description: 'Pizza con champiñones frescos', isAvailable: true, isPromo: false },
        { name: 'Pizza de Palmitos', price: 12000, description: 'Pizza con palmitos y salsa golf', isAvailable: true, isPromo: false },
        { name: 'Pizza de Anchoas', price: 11500, description: 'Pizza con anchoas y aceitunas', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'SANDWICHES',
      items: [
        { name: 'Sandwich de Milanesa', price: 8000, description: 'Sandwich de milanesa con lechuga y tomate', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Pollo', price: 7500, description: 'Sandwich de pollo grillado', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Lomo', price: 9000, description: 'Sandwich de lomo completo', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Bondiola', price: 8500, description: 'Sandwich de bondiola con chimichurri', isAvailable: true, isPromo: false },
        { name: 'Sandwich Veggie', price: 7000, description: 'Sandwich vegetariano', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Atún', price: 7800, description: 'Sandwich de atún con mayonesa', isAvailable: true, isPromo: false },
        { name: 'Sandwich Club', price: 9200, description: 'Sandwich club triple', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'BEBIDAS',
      items: [
        { name: 'Coca Cola', price: 1500, description: 'Coca Cola 500ml', isAvailable: true, isPromo: false },
        { name: 'Sprite', price: 1500, description: 'Sprite 500ml', isAvailable: true, isPromo: false },
        { name: 'Agua Mineral', price: 1200, description: 'Agua mineral 500ml', isAvailable: true, isPromo: false },
        { name: 'Jugo de Naranja', price: 1800, description: 'Jugo de naranja natural', isAvailable: true, isPromo: false },
        { name: 'Cerveza Quilmes', price: 2500, description: 'Cerveza Quilmes 473ml', isAvailable: true, isPromo: false },
        { name: 'Cerveza Stella Artois', price: 2800, description: 'Cerveza Stella Artois 330ml', isAvailable: true, isPromo: false },
        { name: 'Vino Tinto de la Casa', price: 4500, description: 'Vino tinto de la casa por copa', isAvailable: true, isPromo: false },
        { name: 'Vino Blanco de la Casa', price: 4500, description: 'Vino blanco de la casa por copa', isAvailable: true, isPromo: false },
        { name: 'Café', price: 800, description: 'Café expreso', isAvailable: true, isPromo: false },
        { name: 'Té', price: 600, description: 'Té de hierbas', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'POSTRES',
      items: [
        { name: 'Tiramisú', price: 4500, description: 'Tiramisú casero', isAvailable: true, isPromo: false },
        { name: 'Flan Casero', price: 3500, description: 'Flan de vainilla casero', isAvailable: true, isPromo: false },
        { name: 'Helado 3 Bolas', price: 4000, description: 'Helado artesanal 3 sabores', isAvailable: true, isPromo: false },
        { name: 'Brownie con Helado', price: 5000, description: 'Brownie caliente con helado', isAvailable: true, isPromo: false },
        { name: 'Cheesecake', price: 4800, description: 'Cheesecake de frutos rojos', isAvailable: true, isPromo: false },
        { name: 'Profiteroles', price: 4200, description: 'Profiteroles con dulce de leche', isAvailable: true, isPromo: false },
        { name: 'Mousse de Chocolate', price: 3800, description: 'Mousse de chocolate negro', isAvailable: true, isPromo: false },
        { name: 'Panqueques con Dulce de Leche', price: 3600, description: 'Panqueques con dulce de leche', isAvailable: true, isPromo: false }
      ]
    }
  ];

  let totalItems = 0;
  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        menuId: menu.id,
        items: {
          create: (categoryData.items || []).map((item, index) => ({
            name: item.name,
            description: item.description,
            price: item.price,
            position: index,
            isAvailable: item.isAvailable ?? true,
            isPromo: item.isPromo ?? false,
            menu: { connect: { id: menu.id } }, 
          })),
        },
      },
    });
    console.log(`📂 Categoría creada: ${category.name} (${categoryData.items.length} items)`);
    totalItems += categoryData.items.length;
  }
  
  console.log(`🍽️ Total items: ${totalItems}`);
  console.log(`📊 Total categorías: ${categories.length}`);
  console.log('✅ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

