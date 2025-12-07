// scripts/seed-los-toritos.ts

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Crear usuario (dueño)
  const user = await prisma.user.upsert({
    where: { email: 'lostoritos@gmail.com' },
    update: {},
    create: {
      name: 'Los Toritos',
      email: 'lostoritos@gmail.com',
      password: '$2b$10$Kq5K5J0Q8N/4R4VxV4X4VuK5K5J0Q8N/4R4VxV4X4Vu', // bcrypt de "toritos2025"
      restaurantName: 'Los Toritos 🐃',
      phone: '+54 11 3840-2399',
      address: 'Zañartu 1547, CABA (CLUB PEÑAROL)',
      role: Role.ADMIN,
      restaurantId: '5XJ1J39E', // ID único correcto
    },
  });

  // 2. Crear menú
  const menu = await prisma.menu.upsert({
    where: { restaurantId: '5XJ1J39E' },
    update: {},
    create: {
      restaurantId: '5XJ1J39E', // ID único correcto
      restaurantName: 'Los Toritos 🐃',
      description: 'El sabor de lo artesanal',
      contactPhone: '+54 11 3840-2399',
      contactAddress: 'Zañartu 1547, CABA (CLUB PEÑAROL)',
      socialInstagram: 'pizzeria.lostoritos',
      socialFacebook: 'Pizzeria Los Toritos',
      deliveryEnabled: true,
      deliveryFee: 1500,
      allowOrdering: true,
      ownerId: user.id,
    },
  });

  // Limpiar categorías e items existentes
  console.log('🧹 Limpiando datos anteriores...');
  await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });
  await prisma.category.deleteMany({ where: { menuId: menu.id } });

  // 3. Categorías (actualizado: "Platos del Día" -> "Especiales")
  const categories = [
    { name: 'Especiales', position: 0, description: 'Pizzas especiales con los mejores ingredientes' },
    { name: 'Promos de la Semana', position: 1, description: 'Promociones especiales para compartir' },
    { name: 'Pizzas', position: 2, description: 'Pizzas artesanales a la piedra' },
    { name: 'Empanadas', position: 3, description: 'Empanadas caseras rellenas' },
    { name: 'Calzones', position: 4, description: 'Probá nuestras INCREIBLES CALZONES' },
    { name: 'Hamburguesas', position: 5, description: 'Todas salen con Fritas' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        description: cat.description,
        position: cat.position,
        menuId: menu.id,
      },
    });
    categoryMap[cat.name] = created.id;
  }

  // 4. Productos con descripción
  const items = [
    // === PIZZAS ===
    { name: 'Muzzarela', price: 10000, cat: 'Pizzas', desc: 'Clásica de muzza fundida, sin vueltas.' },
    { name: 'Muzzarella al ajillo', price: 11300, cat: 'Pizzas', desc: 'Muzza + ajo dorado en aceite de oliva. ¡Peligroso de rico!' },
    { name: 'Cancha', price: 10000, cat: 'Pizzas', desc: 'Sola, cruda, sin nada. Para los puristas.' },
    { name: 'Calabressa', price: 11500, cat: 'Pizzas', desc: 'Muzza + salchicha de calabresa picante.' },
    { name: 'Calabressa c/huevo', price: 12000, cat: 'Pizzas', desc: 'Calabresa + huevo frito al horno. ¿Se puede pedir más?' },
    { name: 'Jamón', price: 11000, cat: 'Pizzas', desc: 'Muzza + jamón cocido. Simple pero poderoso.' },
    { name: 'Jamón y morrones', price: 12000, cat: 'Pizzas', desc: 'Jamón + morrones asados. Un clásico argentino.' },
    { name: 'Muzza c/morrón', price: 11500, cat: 'Pizzas', desc: 'Muzza + morrones asados. Dulce y salado.' },
    { name: '2 Quesos (muzza y roque)', price: 12000, cat: 'Pizzas', desc: 'Muzza + roquefort. Para los que se atreven.' },
    { name: '2 Quesos (muzza y cheddar)', price: 12000, cat: 'Pizzas', desc: 'Muzza + cheddar. Cremosidad doble.' },
    { name: 'Primavera', price: 12500, cat: 'Pizzas', desc: 'Jamón, huevo duro, morrones, aceitunas. ¡Una fiesta!' },
    { name: 'Napolitana (ajo opcional)', price: 11500, cat: 'Pizzas', desc: 'Salsa de tomate + ajo + orégano. Tradición napolitana.' },
    { name: 'Napolitana c/jamón (ajo opcional)', price: 12000, cat: 'Pizzas', desc: 'Napolitana + jamón cocido. Lo mejor de dos mundos.' },
    { name: 'Fugazza', price: 10000, cat: 'Pizzas', desc: 'Cebolla caramelizada + muzza. Sin salsa, con alma.' },
    { name: 'Fugazzeta', price: 11500, cat: 'Pizzas', desc: 'Fugazza rellena de muzza. Doble capa de felicidad.' },
    { name: 'Fugazzeta rellena', price: 12500, cat: 'Pizzas', desc: 'Fugazzeta con relleno extra de muzza. Para los valientes.' },
    { name: 'Faina (porción)', price: 1200, cat: 'Pizzas', desc: 'Porción de faina artesanal. Ideal para picar.' },
    { name: 'Súper fugazzetta rellena explotada de muzza', price: 14000, cat: 'Pizzas', desc: 'Fugazzeta con tanta muzza que no entra en la caja. ¡No apta para celíacos del corazón!' },

    // === PIZZAS ESPECIALES ===
    { name: 'Especial los toritos 🐃', price: 12500, cat: 'Especiales', desc: '1/4 panceta + huevo frito, 1/4 salchicha con mostaza, 1/4 papas fritas, 1/4 calabresa. Caos controlado.' },
    { name: '4 estaciones', price: 12500, cat: 'Especiales', desc: '1/4 jamón y morrones, 1/4 napolitana, 1/4 calabresa, 1/4 fugazzeta. Para indecisos.' },
    { name: 'Solo para entendidos', price: 12200, cat: 'Especiales', desc: 'Salsa, muzza, panceta y huevos fritos. Si no entendés, no lo pidas.' },
    { name: 'Cristian Gómez (puro huevo)', price: 13000, cat: 'Especiales', desc: 'Salsa, muzza, panceta y 8 huevos fritos a la plancha. Sí, leíste bien: 8.' },
    { name: 'La Renga', price: 11500, cat: 'Especiales', desc: 'Salsa, muzza, cheddar, papas, aceituna, orégano. ¡Rock and roll en tu boca!' },
    { name: 'Diego Maradona', price: 12000, cat: 'Especiales', desc: 'Salsa, muzza, fritas, papas, huevos a la plancha, cheddar, aceituna, orégano. Un homenaje campeón.' },
    { name: 'La Chanchita', price: 12500, cat: 'Especiales', desc: 'Salsa, muzza, cheddar, panceta, fritas, huevos a la plancha, aceituna, orégano. Cerdito feliz.' },
    { name: 'Pizza 4 gustos a elección', price: 13500, cat: 'Especiales', desc: 'Elegí 4 gustos y armá tu propia obra maestra.' },

    // === EMPANADAS ===
    { name: 'Empanadas Carne (c/u)', price: 1800, cat: 'Empanadas', desc: 'Carne, cebolla, papa, huevo duro, aceituna. Hecha como la abuela.' },
    { name: 'Empanadas Jamón y queso (c/u)', price: 1800, cat: 'Empanadas', desc: 'Jamón cocido + queso derretido. Clásica y reconfortante.' },
    { name: 'Empanadas Roquefort (c/u)', price: 1800, cat: 'Empanadas', desc: 'Queso roquefort cremoso. Para los amantes del fuerte.' },
    { name: 'Empanadas Calabresa (c/u)', price: 1800, cat: 'Empanadas', desc: 'Salchicha de calabresa picante. Con un toque ahumado.' },
    { name: 'Empanadas Cebolla y queso (c/u)', price: 1800, cat: 'Empanadas', desc: 'Cebolla caramelizada + queso. Dulce y salado.' },
    { name: 'Empanadas Napolitana (c/u)', price: 1800, cat: 'Empanadas', desc: 'Salsa de tomate + queso + orégano. Estilo pizza en empanada.' },
    { name: 'Media docena empanadas', price: 10000, cat: 'Empanadas', desc: '6 empanadas a elección.' },
    { name: 'Docena empanadas', price: 19000, cat: 'Empanadas', desc: '12 empanadas a elección. Para llevar y compartir.' },

    // === CALZONES ===
    { name: 'Napolitano', price: 10000, cat: 'Calzones', desc: 'Muzza, tomate, jamón, ajo. Doblado y al horno.' },
    { name: 'Calabreza', price: 10000, cat: 'Calzones', desc: 'Muzza, calabresa, orégano. Picante por dentro.' },
    { name: 'Fugazzeta', price: 9500, cat: 'Calzones', desc: 'Muzza, cebolla, orégano. Sin tomate, con actitud.' },
    { name: 'Primavera', price: 10500, cat: 'Calzones', desc: 'Muzza, jamón, huevo duro, orégano. Fresco y llenador.', imageUrl: '/platos/los-toritos/calzone-primavera.jpg', hasImage: true },
    { name: 'El calzón de león', price: 11000, cat: 'Calzones', desc: 'Muzza, cheddar, panceta, huevo a la plancha, verdeo. Para los que no tienen miedo.' },

    // === HAMBURGUESAS ===
    { name: 'Combo 1: Hamburguesa casera 180g', price: 9000, cat: 'Hamburguesas', desc: '180g carne vacuna, jamón, queso, lechuga y tomate. Clásica y poderosa.' },
    { name: 'Combo 2: 180g, jamón, queso, lechuga, tomate, huevo', price: 9400, cat: 'Hamburguesas', desc: 'La clásica + huevo frito. Porque sí.' },
    { name: 'Combo 3: Doble cheddar, panceta, huevo, cebolla', price: 9000, cat: 'Hamburguesas', desc: 'Doble cheddar, panceta crujiente, huevo a la plancha, cebolla caramelizada, salsa barbacoa.' },
    { name: 'Combo 4: Muzza, panceta, huevo, cebolla', price: 9300, cat: 'Hamburguesas', desc: 'Muzza derretida, panceta, huevo y cebolla. Fusión italo-argentina.' },
    { name: 'Combo 5: Jamón, queso, tomate, huevo', price: 9000, cat: 'Hamburguesas', desc: 'Jamón, queso, tomate y huevo a la plancha. La favorita del barrio.' },
    { name: 'Combo 6: Doble hamburguesa, doble cheddar, panceta', price: 9500, cat: 'Hamburguesas', desc: 'Doble carne, doble cheddar, doble panceta. Para los que no creen en el arrepentimiento.' },
    { name: 'Combo 7: Doble hamburguesa, doble jamón, doble queso', price: 9500, cat: 'Hamburguesas', desc: 'Doble de todo. Si no alcanza, pedí otro.' },

    // === PROMOS ===
    { name: 'PROMO 1: 3 pizzas de muzza', price: 26000, cat: 'Promos de la Semana', desc: '3 pizzas muzzarela. Ideal para compartir (o no).' },
    { name: 'PROMO 2: 2 muzza + 6 empanadas', price: 27000, cat: 'Promos de la Semana', desc: '2 muzzarelas + 6 empanadas a elección.' },
    { name: 'PROMO 3: 2 muzza + coca cola 2.25', price: 24000, cat: 'Promos de la Semana', desc: '2 muzzarelas + 1 botella Coca-Cola 2.25L.' },
    { name: 'PROMO 4: 1 muzza + 1 napolitana + 1 fugazzetta', price: 29000, cat: 'Promos de la Semana', desc: 'Una de cada: muzza, napolitana y fugazzetta.' },
    { name: 'PROMO 5: 1 de muzza + 6 empanadas', price: 19000, cat: 'Promos de la Semana', desc: '1 muzzarela + 6 empanadas a elección.' },
    { name: 'PROMO 6: 1 pizza jamón + 12 empanadas', price: 26000, cat: 'Promos de la Semana', desc: '1 pizza jamón + docena de empanadas.' },
    { name: 'PROMO 7: 2 burger número 1', price: 17000, cat: 'Promos de la Semana', desc: '2 combos 1. ¡Amigos para siempre!' },
    { name: 'PROMO 8: 2 burger número 5', price: 17000, cat: 'Promos de la Semana', desc: '2 combos 5. La clásica con huevo, duplicada.' },
    { name: 'PROMO 9: 3 burger a elección', price: 24000, cat: 'Promos de la Semana', desc: '3 hamburguesas a elección (excluye combos 6 y 7).' },
    { name: 'PROMO 10: 2 calzone a elección', price: 19000, cat: 'Promos de la Semana', desc: '2 calzones a elección. Calentitos y rellenos.' },
  ];

  // Insertar items
  console.log('📦 Creando items...');
  for (const item of items) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.desc,
        price: item.price,
        isAvailable: true,
        menuId: menu.id,
        categoryId: categoryMap[item.cat],
        imageUrl: (item as any).imageUrl || null,
      },
    });
  }

  console.log('✅ Seed "Los Toritos" completado con descripciones y promos.');
  console.log(`📊 Resumen:`);
  console.log(`   - Categorías: ${categories.length}`);
  console.log(`   - Items: ${items.length}`);
  console.log(`   - Restaurant ID: 5XJ1J39E`);
  console.log(`   - URL: /carta/5XJ1J39E`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

