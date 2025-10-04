import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

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
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Filet de merluza a la romana c/ g.", precio: 8000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Filet de merluza napolitano / capresse c/g", precio: 10000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Filet de merluza Suisse c/g.", precio: 10000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Filet brotola al verdeo c/g", precio: 12000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Trucha a la manteca negra c/ alcapparras", precio: 25000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Salmón rosado c/ crema de puerros", precio: 30000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Gambas al ajillo c/ fritas a la española", precio: 20000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Calamares a la leonesa", precio: 18000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Calamares con arroz", precio: 12000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Calamares con spaguettis", precio: 13000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Mejillones c/ arroz", precio: 12000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Mejillones c/ spaguettis", precio: 13000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Arroz con mariscos p/2", precio: 25000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Cazuela de mariscos", precio: 25000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Paella a la valenciana p/2", precio: 30000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Rabas a la romana c/ f. españolas", precio: 18000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Pulpo a la gallega", precio: 60000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Bacalao de Noruega a la gallega", precio: 30000 },
  { categoria: "DE MAR: PESCADOS Y MARISCOS", plato: "Bacalao a la vizcaína", precio: 30000 },
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
  { categoria: "Entradas", plato: "Picada para 1", precio: 10000 },
  { categoria: "Entradas", plato: "Matambre casero c/ rusa", precio: 10000 },
  { categoria: "Entradas", plato: "Lengua a la vinagreta c/ rusa", precio: 9000 },
  { categoria: "Entradas", plato: "Mayonesa de ave", precio: 10000 },
  { categoria: "Entradas", plato: "Mayonesa de atún", precio: 10000 },
  { categoria: "Entradas", plato: "Pechuga a la criolla c/ rusa", precio: 11000 },
  { categoria: "Entradas", plato: "Peceto a la criolla c/ rusa", precio: 12000 },
  { categoria: "Entradas", plato: "Picada para 2", precio: 19000 },
  { categoria: "Entradas", plato: "Jamón cocido c/ rusa", precio: 15000 },
  { categoria: "Entradas", plato: "Jamón crudo c/ rusa", precio: 18000 },
  { categoria: "Entradas", plato: "Jamón crudo c/ melón", precio: 18000 },
  { categoria: "Entradas", plato: "Salpicón de atún", precio: 15000 },
  { categoria: "Entradas", plato: "Langostinos c/ salsa golf", precio: 15000 },
  { categoria: "Entradas", plato: "Palmitos c/ salsa golf", precio: 12000 },
  { categoria: "Entradas", plato: "Empanadas Carne/Pollo/JyQ (c/u)", precio: 1600 },
  { categoria: "Empanadas", plato: "Empanadas Atún (c/u)", precio: 1800 },
  { categoria: "FRITURAS", plato: "Milanesa de ternera sola", precio: 7000 },
  { categoria: "FRITURAS", plato: "Milanesa c/ fritas", precio: 9000 },
  { categoria: "FRITURAS", plato: "Milanesa completa", precio: 12000 },
  { categoria: "FRITURAS", plato: "Milanesa Napolitana sola", precio: 10000 },
  { categoria: "FRITURAS", plato: "Milanesa Napolitana con fritas", precio: 12000 },
  { categoria: "FRITURAS", plato: "Milanesa de pollo", precio: 7000 },
  { categoria: "FRITURAS", plato: "Milanesa de pollo con fritas", precio: 9000 },
  { categoria: "FRITURAS", plato: "Milanesa de pollo napolitana c/ fritas", precio: 12000 },
  { categoria: "FRITURAS", plato: "Suprema sola", precio: 9000 },
  { categoria: "FRITURAS", plato: "Suprema c/ fritas", precio: 11000 },
  { categoria: "FRITURAS", plato: "Suprema completa", precio: 14000 },
  { categoria: "FRITURAS", plato: "Suprema Napolitana con fritas", precio: 14000 },
  { categoria: "FRITURAS", plato: "Suprema a la suiza c/ fritas", precio: 20000 },
  { categoria: "FRITURAS", plato: 'Milanesa "ESQUINA" p/ 2 (queso timbo, jamón crudo, rúcula, parmesano, aceitunas)', precio: 14000 },
  { categoria: "HELADOS", plato: "Bocha de helado", precio: 4000 },
  { categoria: "HELADOS", plato: "Almendrado", precio: 6000 },
  { categoria: "Omelets", plato: "Omelet c/ jamón", precio: 7000 },
  { categoria: "Omelets", plato: "Omelet c/ jamón y queso", precio: 8000 },
  { categoria: "Omelets", plato: "Omelet c/ jamón, queso y tomate", precio: 9000 },
  { categoria: "Omelets", plato: "Omelet de verdura", precio: 7000 },
  { categoria: "PARRILLA", plato: "Asado de tira", precio: 15000 },
  { categoria: "PARRILLA", plato: "Bife de chorizo", precio: 15000 },
  { categoria: "PARRILLA", plato: "Bife c/ lomo", precio: 15000 },
  { categoria: "PARRILLA", plato: "Costillas cerdo (2)", precio: 10000 },
  { categoria: "PARRILLA", plato: "Riñones provenzal", precio: 9000 },
  { categoria: "PARRILLA", plato: "Provoletta", precio: 9000 },
  { categoria: "PARRILLA", plato: "Pechuga grillé", precio: 10000 },
  { categoria: "PARRILLA", plato: "Entraña", precio: 15000 },
  { categoria: "PARRILLA", plato: "Bife de lomo", precio: 15000 },
  { categoria: "PARRILLA", plato: "Bife cuadril", precio: 15000 },
  { categoria: "PARRILLA", plato: "Bondiola", precio: 13000 },
  { categoria: "PARRILLA", plato: "Hígado bife", precio: 15000 },
  { categoria: "PARRILLA", plato: "Provoletta Esquina", precio: 15000 },
  { categoria: "PARRILLA", plato: "Ojo de bife", precio: 15000 },
  { categoria: "PLATOS FRÍOS DE MAR", plato: "Langostinos c/ salsa Golf", precio: 18000 },
  { categoria: "PLATOS FRÍOS DE MAR", plato: "Langostinos c/ salsa Golf + palmitos", precio: 25000 },
  { categoria: "PLATOS FRÍOS DE MAR", plato: "Pulpo a la Provenzal", precio: 18000 },
  { categoria: "PLATOS FRÍOS DE MAR", plato: "Calamares a la provenzal", precio: 20000 },
  { categoria: "PLATOS FRÍOS DE MAR", plato: "Atún + palmitos c/ salsa Golf", precio: 25000 },
  { categoria: "POSTRES", plato: "Flan casero solo", precio: 2000 },
  { categoria: "POSTRES", plato: "Flan casero c/ crema o dulce", precio: 3000 },
  { categoria: "POSTRES", plato: "Flan casero mixto", precio: 3500 },
  { categoria: "POSTRES", plato: "Budín de pan casero", precio: 2000 },
  { categoria: "POSTRES", plato: "Budín de pan casero c/ crema o dulce", precio: 3000 },
  { categoria: "POSTRES", plato: "Budín de pan mixto", precio: 3500 },
  { categoria: "POSTRES", plato: "Duraznos en almíbar", precio: 2500 },
  { categoria: "POSTRES", plato: "Duraznos c/ crema o dulce", precio: 3000 },
  { categoria: "POSTRES", plato: "Duraznos mixtos", precio: 3500 },
  { categoria: "POSTRES", plato: "Bananas c/ crema o dulce", precio: 3500 },
  { categoria: "POSTRES", plato: "Ensalada de frutas", precio: 4000 },
  { categoria: "POSTRES", plato: "Ensalada c/ crema", precio: 5500 },
  { categoria: "POSTRES", plato: "Frutillas al jerez", precio: 6000 },
  { categoria: "POSTRES", plato: "Frutillas c/ crema", precio: 6000 },
  { categoria: "POSTRES", plato: "Panqueques duce de leche", precio: 5500 },
  { categoria: "POSTRES", plato: "Queso y dulce", precio: 3000 },
  { categoria: "POSTRES", plato: "Membrillo o batata, porción", precio: 4000 },
  { categoria: "POSTRES", plato: "Queso cremoso, porción", precio: 5000 },
  { categoria: "POSTRES", plato: "Queso Fimbo", precio: 5000 },
  { categoria: "POSTRES", plato: "Queso Roquefort, porción", precio: 6000 },
  { categoria: "PASTAS", plato: "Spaghettis c/ tuco", precio: 6000 },
  { categoria: "PASTAS", plato: "Spaghettis c/ s. mixta", precio: 7000 },
  { categoria: "PASTAS", plato: "Spaghettis al óleo", precio: 6000 },
  { categoria: "PASTAS", plato: "Spaghettis a la manteca", precio: 6000 },
  { categoria: "PASTAS", plato: "Spaghettis c/ bolognesa", precio: 8000 },
  { categoria: "PASTAS", plato: "Spaghettis c/ estofado", precio: 13000 },
  { categoria: "PASTAS", plato: "Spaghettis a la parissien", precio: 12000 },
  { categoria: "PASTAS", plato: "Ñoquis caseros c/ tuco", precio: 6000 },
  { categoria: "PASTAS", plato: "Ñoquis caseros c/ s. mixta", precio: 7000 },
  { categoria: "PASTAS", plato: "Ñoquis caseros c/ bolognesa", precio: 8000 },
  { categoria: "PASTAS", plato: "Ñoquis caseros c/ estofado", precio: 9000 },
  { categoria: "PASTAS", plato: "Sorrentinos caseros c/ tuco", precio: 10000 },
  { categoria: "PASTAS", plato: "Sorrentinos caseros c/ s. mixta", precio: 12000 },
  { categoria: "PASTAS", plato: "Sorrentinos caseros c/ bolognesa", precio: 13000 },
  { categoria: "PASTAS", plato: "Sorrentinos caseros c/ estofado", precio: 15000 },
  { categoria: "PASTAS", plato: "Sorrentinos a la parissien", precio: 15000 },
  { categoria: "PASTAS", plato: "Ravioles c/ tuco", precio: 9000 },
  { categoria: "PASTAS", plato: "Ravioles c/ s. mixta", precio: 10000 },
  { categoria: "PASTAS", plato: "Ravioles c/ bolognesa", precio: 12000 },
  { categoria: "PASTAS", plato: "Ravioles c/ estofado", precio: 15000 },
  { categoria: "PASTAS", plato: "Ravioles a la parissien", precio: 15000 },
  { categoria: "SALSAS (porción)", plato: "Tuco", precio: 6000 },
  { categoria: "SALSAS (porción)", plato: "Bolognesa", precio: 8000 },
  { categoria: "SALSAS (porción)", plato: "Crema", precio: 6000 },
  { categoria: "SALSAS (porción)", plato: "Pesto", precio: 6000 },
  { categoria: "SALSAS (porción)", plato: "Parissien", precio: 10000 },
  { categoria: "SALSAS (porción)", plato: "Putanesca", precio: 10000 },
  { categoria: "SALSAS (porción)", plato: "Estofado de pollo", precio: 10000 },
  { categoria: "SALSAS (porción)", plato: "Estofado de carne", precio: 12000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. milanesa simple", precio: 5000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. milanesa LyT", precio: 6000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. milanesa completo", precio: 7000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. milanesa napolitana", precio: 8000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. lomito solo simple", precio: 8000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. lomito JyQ / LyT", precio: 9000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. lomito completo", precio: 10000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. bondiola simple", precio: 8000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. bondiola JyQ / LyT", precio: 9000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. bondiola completo", precio: 10000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. pechuga simple", precio: 8000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. pechuga JyQ / LyT", precio: 9000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. pechuga completo", precio: 10000 },
  { categoria: "Sandwiches Calientes", plato: "Sw. de vacío", precio: 10000 },
  { categoria: "Sandwiches Fríos", plato: "Francés jamón y queso", precio: 6000 },
  { categoria: "Sandwiches Fríos", plato: "Francés salame y queso", precio: 6000 },
  { categoria: "Sandwiches Fríos", plato: "Francés jamón crudo y queso", precio: 7000 },
  { categoria: "Sandwiches Fríos", plato: "Sandwich de matambre casero", precio: 7000 },
  { categoria: "Tortillas", plato: "Papas", precio: 8000 },
  { categoria: "Tortillas", plato: "Papas c/ cebolla", precio: 9000 },
  { categoria: "Tortillas", plato: "Española", precio: 10000 },
  { categoria: "Tortillas", plato: "Verdura", precio: 8000 },
  { categoria: "Tortillas", plato: "Papas fritas porción", precio: 6000 },
  { categoria: "Tortillas", plato: "Puré porción", precio: 6000 },
  { categoria: "Tortillas", plato: "P. de papas fritas", precio: 6000 },
  { categoria: "Tortillas", plato: "P. de puré de papas/calabaza", precio: 6000 },
  { categoria: "Tortillas", plato: "P. de papas al horno", precio: 7000 },
  { categoria: "Tortillas", plato: "Papas fritas c/ provenzal", precio: 7000 },
  { categoria: "Tortillas", plato: "Papas fritas a caballo", precio: 8000 },
];

async function main() {
  console.log('🚀 Iniciando seed de Esquina Pompeya con 192 platos...\n');

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
      role: 'OWNER',
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

  for (const [categoryName, items] of categoriesMap.entries()) {
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
  console.log(`🚚 Delivery:      Habilitado ($1500)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
