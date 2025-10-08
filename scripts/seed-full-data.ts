import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos completos...');

  // Limpiar datos existentes
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.menu.deleteMany();

  // Crear el menú principal
  const menu = await prisma.menu.create({
    data: {
      restaurantId: 'esquina-pompeya',
      restaurantName: 'Esquina Pompeya Restaurant Bar',
      contactAddress: 'Av. Fernández de la Cruz 1100',
      contactPhone: '+54 11 2857-9746'
    }
  });

  console.log('✅ Menú creado:', menu.restaurantName);

  // Definir todas las categorías con sus platos
  const categoriesData = [
    {
      name: 'PLATOS DEL DÍA',
      items: [
        { name: 'Milanesa de Pollo con Papas', price: 8500, description: 'Milanesa de pechuga de pollo empanada con papas fritas', isAvailable: true, isPromo: false },
        { name: 'Milanesa de Carne con Puré', price: 9000, description: 'Milanesa de carne empanada con puré de papas', isAvailable: true, isPromo: false },
        { name: 'Milanesa Napolitana con Ensalada', price: 9500, description: 'Milanesa con jamón, queso y tomate, acompañada de ensalada', isAvailable: true, isPromo: false },
        { name: 'Pollo a la Plancha con Arroz', price: 8000, description: 'Pechuga de pollo a la plancha con arroz blanco', isAvailable: true, isPromo: false },
        { name: 'Bife de Chorizo con Papas', price: 12000, description: 'Bife de chorizo a la parrilla con papas fritas', isAvailable: true, isPromo: false },
        { name: 'Entraña con Chimichurri', price: 13000, description: 'Entraña a la parrilla con chimichurri casero', isAvailable: true, isPromo: false },
        { name: 'Lomo a la Plancha con Verduras', price: 11000, description: 'Lomo de res a la plancha con verduras salteadas', isAvailable: true, isPromo: false },
        { name: 'Pescado a la Plancha con Limón', price: 10000, description: 'Filet de merluza a la plancha con limón y hierbas', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'PROMOCIONES',
      items: [
        { name: 'Promo 1: Entraña c/ arroz + postre + bebida', price: 15000, description: 'Entraña con arroz, postre a elección y bebida', isAvailable: true, isPromo: true },
        { name: 'Promo 2: Salpicón de ave + postre + bebida', price: 12000, description: 'Salpicón de pollo con verduras, postre y bebida', isAvailable: true, isPromo: true },
        { name: 'Promo 3: Milanesa completa + bebida', price: 10000, description: 'Milanesa napolitana con papas y bebida', isAvailable: true, isPromo: true },
        { name: 'Promo 4: Pollo a la parrilla + ensalada + bebida', price: 11000, description: 'Medio pollo a la parrilla con ensalada y bebida', isAvailable: true, isPromo: true },
        { name: 'Promo 5: Bife de chorizo + papas + bebida', price: 14000, description: 'Bife de chorizo con papas fritas y bebida', isAvailable: true, isPromo: true }
      ]
    },
    {
      name: 'COCINA',
      items: [
        { name: 'Asado de Tira', price: 14000, description: 'Asado de tira a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Vacío a la Parrilla', price: 15000, description: 'Vacío de res a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Matambre de Cerdo', price: 13000, description: 'Matambre de cerdo a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Pechito de Cerdo', price: 12000, description: 'Pechito de cerdo a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Chorizo Parrillero', price: 8000, description: 'Chorizo parrillero casero', isAvailable: true, isPromo: false },
        { name: 'Morcilla Casera', price: 7500, description: 'Morcilla casera a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Riñones al Vino', price: 11000, description: 'Riñones salteados al vino tinto', isAvailable: true, isPromo: false },
        { name: 'Hígado a la Plancha', price: 9000, description: 'Hígado encebollado a la plancha', isAvailable: true, isPromo: false },
        { name: 'Costillas de Cerdo', price: 12500, description: 'Costillas de cerdo a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Bife de Lomo', price: 16000, description: 'Bife de lomo a la parrilla', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'TORTILLAS',
      items: [
        { name: 'Tortilla Española', price: 7000, description: 'Tortilla española tradicional con papas', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Verdura', price: 6500, description: 'Tortilla de espinaca y acelga', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Jamón y Queso', price: 8000, description: 'Tortilla con jamón cocido y queso', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Chorizo', price: 7500, description: 'Tortilla con chorizo colorado', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Cebolla', price: 7000, description: 'Tortilla con cebolla caramelizada', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Papa', price: 6500, description: 'Tortilla clásica de papas', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Choclo', price: 7000, description: 'Tortilla de choclo fresco', isAvailable: true, isPromo: false },
        { name: 'Tortilla de Zapallito', price: 6500, description: 'Tortilla de zapallito verde', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'ENSALADAS',
      items: [
        { name: 'Ensalada César', price: 6000, description: 'Lechuga, crutones, parmesano y aderezo césar', isAvailable: true, isPromo: false },
        { name: 'Ensalada Mixta', price: 5500, description: 'Lechuga, tomate, cebolla y huevo duro', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Pollo', price: 7000, description: 'Ensalada mixta con pollo grillé', isAvailable: true, isPromo: false },
        { name: 'Ensalada Caprese', price: 6500, description: 'Tomate, mozzarella y albahaca fresca', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Atún', price: 7000, description: 'Ensalada mixta con atún en lata', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Palta', price: 6500, description: 'Lechuga, palta, tomate y cebolla morada', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Remolacha', price: 5500, description: 'Remolacha, lechuga y queso fresco', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Zanahoria', price: 5000, description: 'Zanahoria rallada con limón y aceite', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'DE MAR: PESCADOS Y MARISCOS',
      items: [
        { name: 'Filet de Merluza a la Romana', price: 8000, description: 'Filet de merluza empanado con papas', isAvailable: true, isPromo: false },
        { name: 'Filet de Merluza Napolitano', price: 9000, description: 'Filet de merluza con salsa napolitana', isAvailable: true, isPromo: false },
        { name: 'Filet de Merluza Suisse', price: 9500, description: 'Filet de merluza con salsa suisse', isAvailable: true, isPromo: false },
        { name: 'Filet Brotola al Verdeo', price: 10000, description: 'Filet de brotola con salsa al verdeo', isAvailable: true, isPromo: false },
        { name: 'Calamar a la Plancha', price: 8500, description: 'Calamar a la plancha con limón', isAvailable: true, isPromo: false },
        { name: 'Camarones al Ajillo', price: 12000, description: 'Camarones salteados al ajillo', isAvailable: true, isPromo: false },
        { name: 'Paella de Mariscos', price: 15000, description: 'Paella con mariscos frescos', isAvailable: true, isPromo: false },
        { name: 'Rabas a la Provenzal', price: 11000, description: 'Rabas fritas con ajo y perejil', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'ENSALADAS ESPECIALES',
      items: [
        { name: 'Ensalada Griega', price: 7500, description: 'Tomate, pepino, aceitunas, queso feta y oregano', isAvailable: true, isPromo: false },
        { name: 'Ensalada Waldorf', price: 7000, description: 'Manzana, apio, nueces y mayonesa', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Quinoa', price: 8000, description: 'Quinoa con verduras frescas', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Salmón', price: 12000, description: 'Ensalada mixta con salmón ahumado', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Rúcula', price: 6500, description: 'Rúcula con tomate cherry y parmesano', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Endivias', price: 7000, description: 'Endivias con nueces y queso azul', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Espinaca', price: 6000, description: 'Espinaca fresca con aderezo de mostaza', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Frutos Secos', price: 7500, description: 'Mezcla de lechugas con frutos secos', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'SANDWICHES',
      items: [
        { name: 'Sandwich de Milanesa', price: 7000, description: 'Sandwich de milanesa con lechuga y tomate', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Pollo', price: 6500, description: 'Sandwich de pollo grillé con vegetales', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Jamón y Queso', price: 5500, description: 'Sandwich clásico de jamón y queso', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Lomo', price: 8000, description: 'Sandwich de lomo con papas fritas', isAvailable: true, isPromo: false },
        { name: 'Sandwich Vegetariano', price: 6000, description: 'Sandwich con vegetales frescos', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Atún', price: 6500, description: 'Sandwich de atún con lechuga y tomate', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Bondiola', price: 7500, description: 'Sandwich de bondiola con cebolla', isAvailable: true, isPromo: false },
        { name: 'Sandwich de Chorizo', price: 7000, description: 'Sandwich de chorizo parrillero', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'PASTAS',
      items: [
        { name: 'Spaghetti a la Bolognesa', price: 7500, description: 'Spaghetti con salsa bolognesa casera', isAvailable: true, isPromo: false },
        { name: 'Fettuccine Alfredo', price: 7000, description: 'Fettuccine con salsa alfredo', isAvailable: true, isPromo: false },
        { name: 'Ravioles de Ricotta', price: 8000, description: 'Ravioles de ricotta con salsa de tomate', isAvailable: true, isPromo: false },
        { name: 'Lasaña de Carne', price: 9000, description: 'Lasaña tradicional de carne', isAvailable: true, isPromo: false },
        { name: 'Ñoquis de Papa', price: 6500, description: 'Ñoquis de papa con salsa a elección', isAvailable: true, isPromo: false },
        { name: 'Canelones de Espinaca', price: 8000, description: 'Canelones de espinaca con salsa blanca', isAvailable: true, isPromo: false },
        { name: 'Penne a la Vodka', price: 7500, description: 'Penne con salsa a la vodka', isAvailable: true, isPromo: false },
        { name: 'Sorrentinos de Jamón y Queso', price: 8500, description: 'Sorrentinos de jamón y queso', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'PIZZAS',
      items: [
        { name: 'Pizza Margherita', price: 6000, description: 'Pizza con salsa de tomate, mozzarella y albahaca', isAvailable: true, isPromo: false },
        { name: 'Pizza Napolitana', price: 7000, description: 'Pizza con jamón, tomate y mozzarella', isAvailable: true, isPromo: false },
        { name: 'Pizza de Jamón y Morrones', price: 7500, description: 'Pizza con jamón, morrones y mozzarella', isAvailable: true, isPromo: false },
        { name: 'Pizza de Fugazzeta', price: 8000, description: 'Pizza con cebolla y mozzarella', isAvailable: true, isPromo: false },
        { name: 'Pizza de Calabresa', price: 7500, description: 'Pizza con longaniza y mozzarella', isAvailable: true, isPromo: false },
        { name: 'Pizza de Rúcula y Jamón Crudo', price: 9000, description: 'Pizza con rúcula y jamón crudo', isAvailable: true, isPromo: false },
        { name: 'Pizza de Palmitos', price: 8000, description: 'Pizza con palmitos y salsa golf', isAvailable: true, isPromo: false },
        { name: 'Pizza de Anchoas', price: 8500, description: 'Pizza con anchoas y mozzarella', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'EMPANADAS',
      items: [
        { name: 'Empanada de Carne', price: 800, description: 'Empanada de carne picada con cebolla', isAvailable: true, isPromo: false },
        { name: 'Empanada de Pollo', price: 800, description: 'Empanada de pollo con cebolla', isAvailable: true, isPromo: false },
        { name: 'Empanada de Jamón y Queso', price: 800, description: 'Empanada de jamón y queso', isAvailable: true, isPromo: false },
        { name: 'Empanada de Cebolla y Queso', price: 800, description: 'Empanada de cebolla y queso', isAvailable: true, isPromo: false },
        { name: 'Empanada de Choclo', price: 800, description: 'Empanada de choclo con salsa blanca', isAvailable: true, isPromo: false },
        { name: 'Empanada de Verdura', price: 800, description: 'Empanada de verdura fresca', isAvailable: true, isPromo: false },
        { name: 'Empanada de Atún', price: 800, description: 'Empanada de atún con cebolla', isAvailable: true, isPromo: false },
        { name: 'Empanada de Bondiola', price: 800, description: 'Empanada de bondiola con cebolla', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'PARRILLAS',
      items: [
        { name: 'Parrilla para 2', price: 25000, description: 'Asado de tira, chorizo, morcilla, pollo y ensalada', isAvailable: true, isPromo: false },
        { name: 'Parrilla para 4', price: 45000, description: 'Asado de tira, vacío, chorizo, morcilla, pollo y ensaladas', isAvailable: true, isPromo: false },
        { name: 'Parrilla Familiar', price: 65000, description: 'Parrilla completa para 6 personas', isAvailable: true, isPromo: false },
        { name: 'Medio Pollo a la Parrilla', price: 6000, description: 'Medio pollo a la parrilla con limón', isAvailable: true, isPromo: false },
        { name: 'Pollo Completo a la Parrilla', price: 11000, description: 'Pollo completo a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Costillas de Cerdo', price: 12500, description: 'Costillas de cerdo a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Matambre de Cerdo', price: 13000, description: 'Matambre de cerdo a la parrilla', isAvailable: true, isPromo: false },
        { name: 'Chorizo Parrillero', price: 8000, description: 'Chorizo parrillero casero', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'ACOMPAÑAMIENTOS',
      items: [
        { name: 'Papas Fritas', price: 2500, description: 'Papas fritas caseras', isAvailable: true, isPromo: false },
        { name: 'Papas a la Crema', price: 3000, description: 'Papas con crema y queso', isAvailable: true, isPromo: false },
        { name: 'Puré de Papas', price: 2500, description: 'Puré de papas casero', isAvailable: true, isPromo: false },
        { name: 'Arroz Blanco', price: 2000, description: 'Arroz blanco cocido', isAvailable: true, isPromo: false },
        { name: 'Arroz con Pollo', price: 3500, description: 'Arroz con pollo y verduras', isAvailable: true, isPromo: false },
        { name: 'Ensalada Mixta', price: 2500, description: 'Ensalada de lechuga, tomate y cebolla', isAvailable: true, isPromo: false },
        { name: 'Verduras Salteadas', price: 3000, description: 'Verduras frescas salteadas', isAvailable: true, isPromo: false },
        { name: 'Papas al Horno', price: 3000, description: 'Papas al horno con especias', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'BEBIDAS',
      items: [
        { name: 'Coca Cola 500ml', price: 1200, description: 'Coca Cola 500ml', isAvailable: true, isPromo: false },
        { name: 'Sprite 500ml', price: 1200, description: 'Sprite 500ml', isAvailable: true, isPromo: false },
        { name: 'Fanta 500ml', price: 1200, description: 'Fanta 500ml', isAvailable: true, isPromo: false },
        { name: 'Agua Mineral 500ml', price: 800, description: 'Agua mineral 500ml', isAvailable: true, isPromo: false },
        { name: 'Agua Saborizada', price: 1000, description: 'Agua saborizada 500ml', isAvailable: true, isPromo: false },
        { name: 'Jugo de Naranja', price: 1500, description: 'Jugo de naranja natural', isAvailable: true, isPromo: false },
        { name: 'Cerveza Nacional 473ml', price: 2000, description: 'Cerveza nacional 473ml', isAvailable: true, isPromo: false },
        { name: 'Cerveza Importada 355ml', price: 2500, description: 'Cerveza importada 355ml', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'POSTRES',
      items: [
        { name: 'Flan Casero', price: 2500, description: 'Flan casero con dulce de leche', isAvailable: true, isPromo: false },
        { name: 'Tiramisu', price: 3000, description: 'Tiramisu casero', isAvailable: true, isPromo: false },
        { name: 'Cheesecake', price: 2800, description: 'Cheesecake de frutos rojos', isAvailable: true, isPromo: false },
        { name: 'Brownie con Helado', price: 3200, description: 'Brownie con helado de vainilla', isAvailable: true, isPromo: false },
        { name: 'Profiteroles', price: 3000, description: 'Profiteroles con dulce de leche', isAvailable: true, isPromo: false },
        { name: 'Mousse de Chocolate', price: 2500, description: 'Mousse de chocolate negro', isAvailable: true, isPromo: false },
        { name: 'Helado 3 Sabores', price: 2000, description: 'Helado de 3 sabores a elección', isAvailable: true, isPromo: false },
        { name: 'Ensalada de Frutas', price: 2200, description: 'Ensalada de frutas frescas', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'VINOS',
      items: [
        { name: 'Vino Tinto Malbec', price: 8000, description: 'Vino tinto Malbec por copa', isAvailable: true, isPromo: false },
        { name: 'Vino Blanco Chardonnay', price: 7500, description: 'Vino blanco Chardonnay por copa', isAvailable: true, isPromo: false },
        { name: 'Vino Rosé', price: 7000, description: 'Vino rosé por copa', isAvailable: true, isPromo: false },
        { name: 'Champagne', price: 12000, description: 'Champagne por copa', isAvailable: true, isPromo: false },
        { name: 'Botella Vino Tinto', price: 25000, description: 'Botella de vino tinto', isAvailable: true, isPromo: false },
        { name: 'Botella Vino Blanco', price: 22000, description: 'Botella de vino blanco', isAvailable: true, isPromo: false },
        { name: 'Vino de la Casa', price: 5000, description: 'Vino de la casa por copa', isAvailable: true, isPromo: false },
        { name: 'Sangría', price: 4000, description: 'Sangría casera', isAvailable: true, isPromo: false }
      ]
    },
    {
      name: 'COCTELES',
      items: [
        { name: 'Fernet con Coca', price: 3000, description: 'Fernet Branca con Coca Cola', isAvailable: true, isPromo: false },
        { name: 'Cuba Libre', price: 3500, description: 'Ron con Coca Cola y limón', isAvailable: true, isPromo: false },
        { name: 'Caipirinha', price: 4000, description: 'Caipirinha de cachaça', isAvailable: true, isPromo: false },
        { name: 'Mojito', price: 3800, description: 'Mojito de ron blanco', isAvailable: true, isPromo: false },
        { name: 'Piña Colada', price: 4200, description: 'Piña colada con ron y coco', isAvailable: true, isPromo: false },
        { name: 'Margarita', price: 4000, description: 'Margarita de tequila', isAvailable: true, isPromo: false },
        { name: 'Daiquiri', price: 3800, description: 'Daiquiri de ron', isAvailable: true, isPromo: false },
        { name: 'Cosmopolitan', price: 4500, description: 'Cosmopolitan de vodka', isAvailable: true, isPromo: false }
      ]
    }
  ];

  // Crear categorías y sus items
  for (let i = 0; i < categoriesData.length; i++) {
    const categoryData = categoriesData[i];
    
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        position: i,
        menuId: menu.id
      }
    });

    console.log(`✅ Categoría creada: ${category.name}`);

    // Crear items para esta categoría
    for (let j = 0; j < categoryData.items.length; j++) {
      const itemData = categoryData.items[j];
      
      await prisma.menuItem.create({
        data: {
          name: itemData.name,
          price: itemData.price,
          description: itemData.description,
          position: j,
          isAvailable: itemData.isAvailable,
          isPromo: itemData.isPromo,
          categoryId: category.id
        }
      });
    }

    console.log(`✅ ${categoryData.items.length} items creados para ${category.name}`);
  }

  // Contar totales
  const totalCategories = await prisma.category.count();
  const totalItems = await prisma.menuItem.count();

  console.log('🎉 Seed completado exitosamente!');
  console.log(`📊 Total categorías: ${totalCategories}`);
  console.log(`📊 Total items: ${totalItems}`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });