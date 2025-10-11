import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Datos del menú desde la tabla MD
const menuData = [
  { categoria: "Platos del Día", plato: "Riñoncitos al jerez c/ puré", precio: 9000 },
  { categoria: "Platos del Día", plato: "Croquetas de carne c/ ensalada", precio: 9000 },
  { categoria: "Platos del Día", plato: "Chupín de merluza c/ papa natural", precio: 10000 },
  { categoria: "Platos del Día", plato: "Pechuga rellena c/ f. españolas", precio: 12000 },
  { categoria: "Platos del Día", plato: "Mejillones c/ fettuccinis", precio: 12000 },
  { categoria: "Platos del Día", plato: "Vacío a la parrilla c/ fritas", precio: 14000 },
  { categoria: "Platos del Día", plato: "Peceto al verdeo c/ puré", precio: 15000 },
  { categoria: "Platos del Día", plato: "Correntinos caseros a la Vangoli", precio: 13000 },
  { categoria: "Promos de la Semana", plato: "Promo 1 (Entraña c/ arroz + postre + bebida)", precio: 12000 },
  { categoria: "Promos de la Semana", plato: "Promo 2 (Salpicón de ave + postre + bebida)", precio: 12000 },
  { categoria: "Cocina", plato: "1/4 Pollo al horno c/ papas", precio: 9000 },
  { categoria: "Cocina", plato: "1/4 Pollo provenzal c/ fritas", precio: 10000 },
  { categoria: "Cocina", plato: "Matambre al verdeo c/ fritas", precio: 12000 },
  { categoria: "Cocina", plato: "Matambre a la pizza c/ fritas", precio: 12000 },
  { categoria: "Cocina", plato: "Bondiola al ajillo c/ fritas", precio: 12000 },
  { categoria: "Cocina", plato: "Bondiola al verdeo c/ papas", precio: 12000 },
  { categoria: "Cocina", plato: "Costillitas (2) a la riojana", precio: 18000 },
  { categoria: "Cocina", plato: "Vacío al horno c/ papas", precio: 14000 },
  { categoria: "Cocina", plato: "Vacío a la parrilla c/ guarnición (ensalada)", precio: 15000 },
  { categoria: "Cocina", plato: "Peceto horneado al vino c/ f. españolas", precio: 15000 },
  { categoria: "Cocina", plato: "Peceto al verdeo c/ puré", precio: 15000 },
  { categoria: "Cocina", plato: "Peceto al roquefort c/ f. españolas", precio: 18000 },
  { categoria: "Cocina", plato: "Tapa de asado al horno c/ papas", precio: 12000 },
  { categoria: "Cocina", plato: "Costillitas a la mostaza c/ fritas", precio: 12000 },
  { categoria: "Pescados y Mariscos", plato: "Filet de merluza a la romana c/ g.", precio: 8000 },
  { categoria: "Pescados y Mariscos", plato: "Filet de merluza napolitano / capresse c/g", precio: 10000 },
  { categoria: "Pescados y Mariscos", plato: "Filet de merluza Suisse c/g.", precio: 10000 },
  { categoria: "Pescados y Mariscos", plato: "Filet brotola al verdeo c/g", precio: 12000 },
  { categoria: "Pescados y Mariscos", plato: "Trucha a la manteca negra c/ alcapparras", precio: 25000 },
  { categoria: "Pescados y Mariscos", plato: "Salmón rosado c/ crema de puerros", precio: 30000 },
  { categoria: "Pescados y Mariscos", plato: "Gambas al ajillo c/ fritas a la española", precio: 20000 },
  { categoria: "Pescados y Mariscos", plato: "Calamares a la leonesa", precio: 18000 },
  { categoria: "Pescados y Mariscos", plato: "Calamares con arroz", precio: 12000 },
  { categoria: "Pescados y Mariscos", plato: "Calamares con spaguettis", precio: 13000 },
  { categoria: "Pescados y Mariscos", plato: "Mejillones c/ arroz", precio: 12000 },
  { categoria: "Pescados y Mariscos", plato: "Mejillones c/ spaguettis", precio: 13000 },
  { categoria: "Pescados y Mariscos", plato: "Arroz con mariscos p/2", precio: 25000 },
  { categoria: "Pescados y Mariscos", plato: "Cazuela de mariscos", precio: 25000 },
  { categoria: "Pescados y Mariscos", plato: "Paella a la valenciana p/2", precio: 30000 },
  { categoria: "Pescados y Mariscos", plato: "Rabas a la romana c/ f. españolas", precio: 18000 },
  { categoria: "Pescados y Mariscos", plato: "Pulpo a la gallega", precio: 60000 },
  { categoria: "Pescados y Mariscos", plato: "Bacalao de Noruega a la gallega", precio: 30000 },
  { categoria: "Pescados y Mariscos", plato: "Bacalao a la vizcaína", precio: 30000 },
  { categoria: "ENSALADAS", plato: "1 Ingrediente", precio: 4000 },
  { categoria: "ENSALADAS", plato: "2 Ingredientes", precio: 4500 },
  { categoria: "ENSALADAS", plato: "3 Ingredientes", precio: 5000 },
  { categoria: "ENSALADAS", plato: "4 Ingredientes", precio: 7000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ens. rúcula y parmesano", precio: 7000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ensalada Caesar", precio: 9000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ensalada completa + JyQ", precio: 10000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ensalada completa + atún", precio: 12000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Salpicón de ave", precio: 9000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ensalada mixta", precio: 5000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ensalada completa", precio: 9000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ens. comp. + pollo", precio: 11000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ens. comp + gambas", precio: 15000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Salpicón de atún", precio: 10000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ensalada completa", precio: 9000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ens. comp. + pollo", precio: 11000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Ens. comp + gambas", precio: 15000 },
  { categoria: "ENSALADAS ESPECIALES", plato: "Salpicón de atún", precio: 10000 }
];

async function main() {
  console.log('🚀 Iniciando seed de Esquina Pompeya con datos de demo...\n');

  // 1. Limpiar datos existentes
  console.log('🗑️  Limpiando datos antiguos...');
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Datos antiguos eliminados\n');

  // 2. Crear usuario owner
  console.log('👤 Creando usuario owner...');
  const hashedPassword = await bcrypt.hash('esquina2024', 10);
  
  const owner = await prisma.user.create({
    data: {
      name: 'Esquina Pompeya',
      email: 'esquina@pompeya.com',
      password: hashedPassword,
      restaurantId: 'esquina-pompeya',
      restaurantName: 'Esquina Pompeya',
      phone: '+54 11 4911-6666',
      address: 'Av. Fernández de la Cruz 1100, Buenos Aires',
      role: Role.OWNER,
      isActive: true,
    },
  });
  console.log(`✅ Usuario creado: ${owner.email}\n`);

  // 3. Crear menú principal
  console.log('📋 Creando menú...');
  const menu = await prisma.menu.create({
    data: {
      restaurantId: 'esquina-pompeya',
      restaurantName: 'Esquina Pompeya',
      description: 'Restaurante tradicional con cocina argentina y especialidades del mar',
      ownerId: owner.id,
      contactPhone: '+54 11 4911-6666',
      contactAddress: 'Av. Fernández de la Cruz 1100, Buenos Aires',
      contactEmail: 'esquina@pompeya.com',
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      showPrices: true,
      showImages: true,
      showDescriptions: true,
      currency: '$',
      language: 'es',
    },
  });
  console.log(`✅ Menú creado: ${menu.restaurantName}\n`);

  // 4. Agrupar platos por categoría
  console.log('📦 Organizando categorías...');
  const categoriesMap = new Map<string, Array<{ categoria: string; plato: string; precio: number; }>>();
  
  menuData.forEach(item => {
    if (!categoriesMap.has(item.categoria)) {
      categoriesMap.set(item.categoria, []);
    }
    categoriesMap.get(item.categoria)!.push(item);
  });

  console.log(`✅ ${categoriesMap.size} categorías encontradas\n`);

  // 5. Crear categorías y productos
  let categoryPosition = 0;
  let totalItems = 0;

  for (const [categoryName, items] of Array.from(categoriesMap.entries())) {
    console.log(`📁 Creando categoría: ${categoryName} (${items.length} items)...`);
    
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        menuId: menu.id,
        position: categoryPosition++,
        isActive: true,
      },
    });

    // Crear items de esta categoría
    let itemPosition = 0;
    for (const item of items) {
      await prisma.menuItem.create({
        data: {
          name: item.plato,
          price: item.precio,
          menuId: menu.id,
          categoryId: category.id,
          position: itemPosition++,
          isAvailable: true,
          isPopular: false,
          isPromo: categoryName === 'Promos de la Semana',
        },
      });
      totalItems++;
    }

    console.log(`   ✅ ${items.length} items creados`);
  }

  console.log(`\n✨ SEED COMPLETADO CON ÉXITO ✨`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`👤 Usuario:       esquina@pompeya.com`);
  console.log(`🔑 Password:      esquina2024`);
  console.log(`📋 Menú:          Esquina Pompeya`);
  console.log(`📁 Categorías:    ${categoriesMap.size}`);
  console.log(`🍽️  Productos:     ${totalItems}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




  // 3. Crear menú principal

  console.log('📋 Creando menú...');

  const menu = await prisma.menu.create({

    data: {

      restaurantId: 'esquina-pompeya',

      restaurantName: 'Esquina Pompeya',

      description: 'Restaurante tradicional con cocina argentina y especialidades del mar',

      ownerId: owner.id,

      contactPhone: '+54 11 4911-6666',

      contactAddress: 'Av. Fernández de la Cruz 1100, Buenos Aires',

      contactEmail: 'esquina@pompeya.com',

      primaryColor: '#2563eb',

      secondaryColor: '#64748b',

      showPrices: true,

      showImages: true,

      showDescriptions: true,

      currency: '$',

      language: 'es',

    },

  });

  console.log(`✅ Menú creado: ${menu.restaurantName}\n`);



  // 4. Agrupar platos por categoría

  console.log('📦 Organizando categorías...');

  const categoriesMap = new Map<string, Array<{ categoria: string; plato: string; precio: number; }>>();
  

  menuData.forEach(item => {

    if (!categoriesMap.has(item.categoria)) {

      categoriesMap.set(item.categoria, []);

    }

    categoriesMap.get(item.categoria)!.push(item);

  });



  console.log(`✅ ${categoriesMap.size} categorías encontradas\n`);



  // 5. Crear categorías y productos

  let categoryPosition = 0;

  let totalItems = 0;



  for (const [categoryName, items] of Array.from(categoriesMap.entries())) {
    console.log(`📁 Creando categoría: ${categoryName} (${items.length} items)...`);

    

    const category = await prisma.category.create({

      data: {

        name: categoryName,

        menuId: menu.id,

        position: categoryPosition++,

        isActive: true,

      },

    });



    // Crear items de esta categoría

    let itemPosition = 0;

    for (const item of items) {

      await prisma.menuItem.create({

        data: {

          name: item.plato,

          price: item.precio,

          menuId: menu.id,

          categoryId: category.id,

          position: itemPosition++,

          isAvailable: true,

          isPopular: false,

          isPromo: categoryName === 'Promos de la Semana',

        },

      });

      totalItems++;

    }



    console.log(`   ✅ ${items.length} items creados`);

  }



  console.log(`\n✨ SEED COMPLETADO CON ÉXITO ✨`);

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  console.log(`👤 Usuario:       esquina@pompeya.com`);

  console.log(`🔑 Password:      esquina2024`);

  console.log(`📋 Menú:          Esquina Pompeya`);

  console.log(`📁 Categorías:    ${categoriesMap.size}`);

  console.log(`🍽️  Productos:     ${totalItems}`);

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

}



main()

  .catch((e) => {

    console.error(e);
    process.exit(1);

  })

  .finally(async () => {

    await prisma.$disconnect();

  });


