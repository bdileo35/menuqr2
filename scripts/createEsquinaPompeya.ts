import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createEsquinaPompeyaMenu() {
  console.log('🍽️ Creando menú digital de Esquina Pompeya...');
  
  try {
    // Eliminar datos existentes si los hay
    await prisma.menuItem.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.menu.deleteMany({});
    await prisma.user.deleteMany({});

    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('esquina123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Administrador Esquina Pompeya',
        email: 'admin@esquinapompeya.com',
        password: hashedPassword,
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        phone: '4918-8815',
        address: 'Av. Fernandez de la Cruz 1100',
        role: 'ADMIN',
        whatsappPhone: '1128579746',
        whatsappEnabled: true
      }
    });

    // Crear menú principal
    const menu = await prisma.menu.create({
      data: {
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        description: 'Restobar & Parrilla - Especialidad en parrilla, pastas y platos caseros',
        ownerId: user.id,
        primaryColor: '#8B4513',
        secondaryColor: '#D2691E', 
        backgroundColor: '#FFF8DC',
        textColor: '#2F1B14',
        contactPhone: '4918-8815',
        contactAddress: 'Av. Fernandez de la Cruz 1100',
        currency: '$',
        showPrices: true,
        showImages: true,
        showDescriptions: true
      }
    });

    // Categorías con productos (PLATOS DEL DIA y PROMOS primero, como en el menú físico)
    const categories = [
      {
        name: 'PLATOS DEL DIA',
        description: '🍽️ Especialidades frescas del día - Cocina casera',
        items: [
          { name: 'Milanesas al horno c/ Puré', price: 9000, description: 'Milanesas de carne al horno con puré de papas casero', isPopular: true },
          { name: 'Croquetas de carne c/ensalada', price: 8000, description: 'Croquetas de carne caseras con ensalada mixta' },
          { name: 'Chuleta de merluza c/rusa gatura', price: 10000, description: 'Chuleta de merluza grillada con ensalada rusa' },
          { name: 'Pechuga rellena c/ f. españolas', price: 12000, description: 'Pechuga de pollo rellena con papas españolas' },
          { name: 'Mejillones c/ fetuccinis', price: 14000, description: 'Mejillones frescos con pasta fetuccini' },
          { name: 'Vacío a la parrilla c/fritas', price: 15000, description: 'Vacío a la parrilla con papas fritas caseras', isPopular: true },
          { name: 'Peceto al verdeo c/ Puré', price: 15000, description: 'Peceto al verdeo con puré de papas' }
        ]
      },
      {
        name: 'PROMOS DE LA SEMANA',
        description: '🎯 Ofertas especiales - Combos completos',
        items: [
          { name: 'PROMO 1: Milanesa c/Papas + Postre', price: 12000, description: 'Milanesa con papas + postre + bebida', isPopular: true, tag: 'PROMO' },
          { name: 'PROMO 2: Salpicón de Ave + Postre + Bebida', price: 12000, description: 'Salpicón de ave completo + postre + bebida', isPopular: true, tag: 'PROMO' }
        ]
      },
      {
        name: 'EMPANADAS',
        description: 'Empanadas caseras recién horneadas',
        items: [
          { name: 'Carne - Pollo - J y Q', price: 600, description: 'Empanadas de carne, pollo, jamón y queso (por docena)' },
          { name: 'Atún, Chía', price: 800, description: 'Empanadas de atún y chía (por docena)' }
        ]
      },
      {
        name: 'TORTILLAS',
        description: 'Tortillas caseras en sus diferentes variedades',
        items: [
          { name: 'Papas', price: 8000, description: 'Tortilla de papas tradicional' },
          { name: 'Papas c/ cebolla', price: 9000, description: 'Tortilla de papas con cebolla caramelizada' },
          { name: 'Española', price: 10000, description: 'Tortilla española clásica' },
          { name: 'Verdura', price: 8000, description: 'Tortilla de verduras de estación' },
          { name: 'Papas fritas porción', price: 6000, description: 'Porción de papas fritas caseras' },
          { name: 'Puré porción', price: 6000, description: 'Puré de papas cremoso' }
        ]
      },
      {
        name: 'OMELETS',
        description: 'Omelets esponjosos con ingredientes frescos',
        items: [
          { name: 'Omelet c/ jamón', price: 7000, description: 'Omelet con jamón cocido' },
          { name: 'Omelet c/ jamón y queso', price: 8000, description: 'Omelet completo con jamón y queso' },
          { name: 'Omelet c/ jamón, queso y tomate', price: 9000, description: 'Omelet completo con tomate fresco' },
          { name: 'Omelet de verdura', price: 7000, description: 'Omelet con verduras salteadas' }
        ]
      },
      {
        name: 'COCINA',
        description: 'Platos de cocina casera y especialidades de la casa',
        items: [
          { name: '1/4 Pollo al horno c/ papas', price: 9000, description: 'Cuarto de pollo al horno con papas', isPopular: true },
          { name: '1/4 Pollo provenzal c/ fritas', price: 10000, description: 'Pollo a la provenzal con papas fritas' },
          { name: 'Matambre al verdeo c/ fritas', price: 19000, description: 'Matambre relleno al verdeo' },
          { name: 'Matambre a la pizza c/ fritas', price: 19000, description: 'Matambre a la pizza con queso y tomate' },
          { name: 'Bondiola al ajillo c/ fritas', price: 19000, description: 'Bondiola al ajillo con guarnición' },
          { name: 'Bondiola al verdeo c/ papas', price: 19000, description: 'Bondiola al verdeo con papas' },
          { name: 'Costillitas (2) a la riojana', price: 18000, description: 'Costillitas de cerdo a la riojana' },
          { name: 'Vacío al horno c/ papas', price: 14000, description: 'Vacío al horno con papas' },
          { name: 'Vacío a la parrilla c/g', price: 15000, description: 'Vacío a la parrilla con guarnición', tag: 'ENSALADA' },
          { name: 'Peceto horneado al vino c/f. españolas', price: 15000, description: 'Peceto al vino con papas españolas' },
          { name: 'Peceto al verde c/ puré', price: 15000, description: 'Peceto en salsa verde' },
          { name: 'Peceto al roquefort c/ f. españolas', price: 18400, description: 'Peceto con salsa roquefort' },
          { name: 'Tapa de asado al horno c/ papas', price: 12000, description: 'Tapa de asado al horno' },
          { name: 'Costillitas a la mostaza c/ fritas', price: 12000, description: 'Costillitas con salsa mostaza' }
        ]
      },
      {
        name: 'SANDWICHES FRÍOS',
        description: 'Sandwiches fríos con ingredientes frescos',
        items: [
          { name: 'Francés Jamón y queso', price: 6000, description: 'Sandwich de jamón y queso en pan francés' },
          { name: 'Francés salame y queso', price: 6000, description: 'Sandwich de salame y queso' },
          { name: 'Francés J. crudo y queso', price: 7000, description: 'Jamón crudo y queso' },
          { name: 'Sw de matambre casero', price: 7000, description: 'Sandwich de matambre casero' },
          { name: 'Pebete', price: 5000, description: 'Pebete clásico' },
          { name: 'Sumale por $1000 a tus sandwichs', price: 1000, description: '(manteca, queso, crema, tomate, rúcula o lechuga)', tag: 'EXTRA' }
        ]
      },
      {
        name: 'SANDWICHES CALIENTES',
        description: 'Sandwiches calientes recién hechos',
        items: [
          { name: 'Sw. Milanesa simple', price: 5000, description: 'Sandwich de milanesa simple' },
          { name: 'Sw. Milanesa LyT', price: 6000, description: 'Milanesa con lechuga y tomate' },
          { name: 'Sw. Milanesa completo', price: 7000, description: 'Milanesa completa con todos los agregados' },
          { name: 'Sw. Milanesa napolitana', price: 8000, description: 'Milanesa napolitana' },
          { name: 'Sw. lomito solo simple', price: 8000, description: 'Lomito simple' },
          { name: 'Sw. lomito JyQ / LyT', price: 9000, description: 'Lomito con jamón y queso o lechuga y tomate' },
          { name: 'Sw. lomito completo', price: 10000, description: 'Lomito completo', isPopular: true },
          { name: 'Sw. bondiola simple', price: 8000, description: 'Bondiola simple' },
          { name: 'Sw. bondiola JyQ / LyT', price: 9000, description: 'Bondiola con agregados' },
          { name: 'Sw. bondiola completo', price: 10000, description: 'Bondiola completa' },
          { name: 'Sw. pechuga simple', price: 6000, description: 'Pechuga de pollo simple' },
          { name: 'Sw. pechuga JyQ / LyT', price: 8000, description: 'Pechuga con agregados' },
          { name: 'Sw. pechuga completo', price: 10000, description: 'Pechuga completa' },
          { name: 'Sw. de vacío', price: 10000, description: 'Sandwich de vacío' },
          { name: 'Hamburguesa simple', price: 10000, description: 'Hamburguesa casera simple' },
          { name: 'Hamburguesa Completa', price: 12000, description: 'Hamburguesa completa con todos los agregados' }
        ]
      },
      {
        name: 'ENTRADAS',
        description: 'Entradas para compartir',
        items: [
          { name: 'Picada para 1', price: 10000, description: 'Picada individual' },
          { name: 'Matambre casero c/ rusa', price: 10000, description: 'Matambre casero con ensalada rusa' },
          { name: 'Lengua a la vinagreta c/ rusa', price: 9000, description: 'Lengua a la vinagreta' },
          { name: 'Mayonesa de ave', price: 10000, description: 'Mayonesa de pollo casera' },
          { name: 'Mayonesa de atún', price: 10000, description: 'Mayonesa de atún' },
          { name: 'Pechuga a la criolla c/ rusa', price: 11000, description: 'Pechuga a la criolla' },
          { name: 'Peceto a la criolla c/ rusa', price: 18000, description: 'Peceto a la criolla' },
          { name: 'Picada Para 2', price: 12000, description: 'Picada para compartir entre dos' },
          { name: 'J. cocido c/rusa', price: 15000, description: 'Jamón cocido con ensalada rusa' },
          { name: 'J. crudo c/rusa', price: 16000, description: 'Jamón crudo con ensalada rusa' },
          { name: 'J. crudo c/ melón', price: 16000, description: 'Jamón crudo con melón' },
          { name: 'Salpicón de atún', price: 15000, description: 'Salpicón de atún fresco' },
          { name: 'Langost. c/ s. Golf', price: 12000, description: 'Langostinos con salsa golf' },
          { name: 'Palm.c/ s.Golf', price: 12000, description: 'Palmitos con salsa golf' }
        ]
      },
      {
        name: 'PARRILLA',
        description: 'Carnes a la parrilla - Todos los precios son con guarnición: FRITAS',
        items: [
          { name: 'Asado de tira', price: 15000, description: 'Asado de tira a la parrilla' },
          { name: 'Bife de chorizo', price: 15600, description: 'Bife de chorizo jugoso' },
          { name: 'Bife c/ lomo', price: 15000, description: 'Bife con lomo' },
          { name: 'Costillas cerdo (2)', price: 10000, description: 'Dos costillas de cerdo' },
          { name: 'Riñones provenzal', price: 9000, description: 'Riñones a la provenzal' },
          { name: 'Provoletta', price: 10000, description: 'Provoleta a la parrilla' },
          { name: 'Pechuga grillé', price: 10000, description: 'Pechuga de pollo grillé' },
          { name: 'Entrañas', price: 15000, description: 'Entraña jugosa' },
          { name: 'Bife de lomo', price: 15600, description: 'Bife de lomo tierno' },
          { name: 'Bife cuadril', price: 15000, description: 'Bife de cuadril' },
          { name: 'Bondiola', price: 15000, description: 'Bondiola a la parrilla' },
          { name: 'Hígado bife', price: 12000, description: 'Hígado a la plancha' },
          { name: 'Provoletta Esquina', price: 12000, description: 'Provoleta especial de la casa', isPopular: true },
          { name: 'Ojo de bife', price: 11600, description: 'Ojo de bife a la parrilla' }
        ]
      },
      {
        name: 'DE MAR - PESCADOS Y MARISCOS',
        description: 'Especialidades del mar',
        items: [
          { name: 'Filet de merluza a la romana c/ g.', price: 8000, description: 'Filet de merluza rebozado' },
          { name: 'Filet de merluza napolitano / capresse c/g', price: 10000, description: 'Merluza napolitana o caprese' },
          { name: 'Filet de merluza Suisse c/g.', price: 10000, description: 'Merluza a la suiza' },
          { name: 'Filet brotola al verdeo c/g', price: 12000, description: 'Brotola al verdeo' },
          { name: 'Trucha a la manteca negra c/ alcaparras', price: 26000, description: 'Trucha a la manteca negra' },
          { name: 'Salmón rosado c/ crema de puerros', price: 30000, description: 'Salmón con crema de puerros' },
          { name: 'Gambas al ajillo c/ fritas a la española', price: 20000, description: 'Gambas al ajillo españolas' },
          { name: 'Calamares a la leonesa', price: 18000, description: 'Calamares a la leonesa' },
          { name: 'Calamares con arroz', price: 19000, description: 'Calamares con arroz' },
          { name: 'Calamares con spaghettis', price: 13000, description: 'Calamares con pasta' },
          { name: 'Mejillones c/ arroz', price: 19000, description: 'Mejillones con arroz' },
          { name: 'Mejillones c/ spaghettis', price: 13000, description: 'Mejillones con pasta' },
          { name: 'Arroz con mariscos p/2', price: 25000, description: 'Arroz con mariscos para dos personas' },
          { name: 'Cazuela de mariscos', price: 25000, description: 'Cazuela de mariscos variados' },
          { name: 'Paella a la valenciana p/2', price: 30000, description: 'Paella valenciana para dos' },
          { name: 'Rabas a la romana c/ f. españolas', price: 16000, description: 'Rabas con papas españolas' },
          { name: 'Pulpo a la gallega', price: 60000, description: 'Pulpo a la gallega tradicional' },
          { name: 'Bacalao de Noruega a la gallega', price: 30000, description: 'Bacalao noruego' },
          { name: 'Bacalao a la vizcaína', price: 30000, description: 'Bacalao a la vizcaína' }
        ]
      },
      {
        name: 'PASTAS',
        description: 'Pastas caseras con salsas tradicionales',
        items: [
          { name: 'Spaghettis c/ tuco', price: 6000, description: 'Spaghettis con salsa de tomate' },
          { name: 'Spaghettis c/ s. mixta', price: 7000, description: 'Spaghettis con salsa mixta' },
          { name: 'Spaghettis al óleo', price: 6000, description: 'Spaghettis al aceite y ajo' },
          { name: 'Spaghettis a la manteca', price: 6000, description: 'Spaghettis a la manteca' },
          { name: 'Spaghettis c/ bolognesa', price: 8000, description: 'Spaghettis con salsa bolognesa' },
          { name: 'Spaghettis c/ estofado', price: 19000, description: 'Spaghettis con estofado' },
          { name: 'Spaghettis a la parissien', price: 19000, description: 'Spaghettis a la parisién' },
          { name: 'Ñoquis caseros c/ tuco', price: 6000, description: 'Ñoquis caseros con tuco' },
          { name: 'Ñoquis caseros c/ s. mixta', price: 7800, description: 'Ñoquis con salsa mixta' },
          { name: 'Ñoquis caseros c/ bolognesa', price: 9000, description: 'Ñoquis con bolognesa' },
          { name: 'Ñoquis caseros c/ estofado', price: 9600, description: 'Ñoquis con estofado' },
          { name: 'Sorrentinos caseros c/ tuco', price: 17000, description: 'Sorrentinos caseros' },
          { name: 'Sorrentinos caseros c/ s. mixta', price: 12000, description: 'Sorrentinos con salsa mixta' },
          { name: 'Sorrentinos caseros c/ bolognesa', price: 14000, description: 'Sorrentinos con bolognesa' },
          { name: 'Sorrentinos caseros c/ estofado', price: 15000, description: 'Sorrentinos con estofado' },
          { name: 'Sorrentinos a la parissien', price: 15000, description: 'Sorrentinos a la parisién' },
          { name: 'Ravioles c/ tuco', price: 9000, description: 'Ravioles con tuco' },
          { name: 'Ravioles c/ s. mixta', price: 10000, description: 'Ravioles con salsa mixta' },
          { name: 'Ravioles c/ bolognesa', price: 12000, description: 'Ravioles con bolognesa' },
          { name: 'Ravioles c/ estofado', price: 15000, description: 'Ravioles con estofado' },
          { name: 'Ravioles a la parissien', price: 15000, description: 'Ravioles a la parisién' }
        ]
      },
      {
        name: 'POSTRES',
        description: 'Postres caseros y helados',
        items: [
          { name: 'Flan casero solo', price: 2000, description: 'Flan casero tradicional' },
          { name: 'Flan casero c/ crema o dulce', price: 3000, description: 'Flan con crema o dulce de leche' },
          { name: 'Flan casero mixto', price: 3500, description: 'Flan con crema y dulce' },
          { name: 'Budín de pan casero', price: 2000, description: 'Budín de pan casero' },
          { name: 'Budín de pan casero c/ crema o dulce', price: 3000, description: 'Budín con crema o dulce' },
          { name: 'Budín de pan mixto', price: 3500, description: 'Budín con crema y dulce' },
          { name: 'Duraznos en almíbar', price: 2500, description: 'Duraznos al natural' },
          { name: 'Duraznos c/ crema o dulce', price: 3000, description: 'Duraznos con crema o dulce' },
          { name: 'Duraznos mixtos', price: 3500, description: 'Duraznos con crema y dulce' },
          { name: 'Bananas c/ crema o dulce', price: 3500, description: 'Bananas con crema o dulce' },
          { name: 'Ensalada de frutas', price: 4000, description: 'Ensalada de frutas de estación' },
          { name: 'Ensalada c/ crema', price: 5500, description: 'Ensalada de frutas con crema' },
          { name: 'Frutillas al jerez', price: 6000, description: 'Frutillas al jerez' },
          { name: 'Frutillas c/ crema', price: 6500, description: 'Frutillas con crema' },
          { name: 'Panqueques dulce de leche', price: 6000, description: 'Panqueques con dulce de leche' },
          { name: 'Queso y dulce', price: 5500, description: 'Queso y dulce de batata o membrillo' },
          { name: 'Membrillo o batata, porción', price: 3000, description: 'Porción de dulce' },
          { name: 'Queso cremoso, porción', price: 4000, description: 'Porción de queso cremoso' },
          { name: 'Queso Fimbo', price: 5000, description: 'Queso Fimbo' },
          { name: 'Queso Roquefort, porción', price: 6000, description: 'Porción de roquefort' }
        ]
      },
      {
        name: 'HELADOS',
        description: 'Helados artesanales',
        items: [
          { name: 'Bocha de helado', price: 4000, description: 'Una bocha de helado artesanal' },
          { name: 'Almendrado', price: 6000, description: 'Helado almendrado casero' }
        ]
      }
    ];

    // Crear categorías con sus items
    for (let i = 0; i < categories.length; i++) {
      const categoryData = categories[i];
      
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
          position: i,
          menuId: menu.id
        }
      });

      // Crear items de la categoría
      for (let j = 0; j < categoryData.items.length; j++) {
        const item = categoryData.items[j];
        
        await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            position: j,
            isPopular: item.isPopular || false,
            tags: item.tag || '',
            categoryId: category.id,
            menuId: menu.id,
            isAvailable: true
          }
        });
      }
      
      console.log(`✅ Categoría "${categoryData.name}" creada con ${categoryData.items.length} items`);
    }

    console.log('🎉 ¡Menú de Esquina Pompeya creado exitosamente!');
    console.log('📱 URL del menú: http://localhost:3000/menu/esquina-pompeya');
    console.log('🔑 Admin login: admin@esquinapompeya.com / esquina123');
    
  } catch (error) {
    console.error('❌ Error creando menú:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createEsquinaPompeyaMenu();
}

export default createEsquinaPompeyaMenu;