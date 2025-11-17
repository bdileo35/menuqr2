import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de datos reales para Esquina Pompeya...');
    console.log('🔍 Verificando que el endpoint se ejecuta correctamente...');

    // Verificar conexión a la base de datos
    console.log('🔗 Conectando a Supabase...');
    
    // Crear tablas con nombres de columna correctos para Prisma
    console.log('🔧 Creando tablas con schema correcto...');
    
    // Limpiar datos existentes usando Prisma ORM (más seguro)
    console.log('🧹 Limpiando datos existentes...');
    try {
      await prisma.menuItem.deleteMany();
      await prisma.category.deleteMany();
      await prisma.menu.deleteMany();
      await prisma.user.deleteMany();
      console.log('✅ Datos limpiados exitosamente');
    } catch (error) {
      console.log('⚠️ Error limpiando datos, continuando...', error);
    }

    // Crear usuario usando Prisma ORM
    console.log('👤 Creando usuario...');
    const user = await prisma.user.create({
      data: {
        name: 'Esquina Pompeya',
        email: 'admin@esquinapompeya.com',
        password: 'esquina2024',
        restaurantId: '5XJ1J37F', // ID único para demo
        restaurantName: 'Esquina Pompeya',
        phone: '+54 11 4911-6666',
        address: 'Av. Fernández de la Cruz 1100, Buenos Aires',
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Usuario creado: ${user.email}`);

    // Crear menú usando Prisma ORM
    console.log('🍽️ Creando menú...');
    const menu = await prisma.menu.create({
      data: {
        restaurantName: 'Esquina Pompeya',
        restaurantId: '5XJ1J37F', // ID único para demo
        description: 'Restaurante tradicional argentino',
        contactPhone: '+54 11 4911-6666',
        contactAddress: 'Av. Fernández de la Cruz 1100, Buenos Aires',
        contactEmail: 'info@esquinapompeya.com',
        socialInstagram: '@esquinapompeya',
        ownerId: user.id,
        // @ts-ignore - waiters field exists in schema but may not be in generated types yet
        waiters: JSON.stringify(['Maria', 'Lucia', 'Carmen']), // Meseras por defecto
      } as any,
    });
    console.log(`✅ Menú creado: ${menu.restaurantName}`);

    // Crear TODAS las categorías del MD usando SQL directo
    console.log('📂 Creando categorías...');
    const categoriesData = [
      { name: 'Platos del Día', code: '01', position: 1 },
      { name: 'Promos de la Semana', code: '02', position: 2 },
      { name: 'Cocina', code: '03', position: 3 },
      { name: 'Parrilla', code: '04', position: 4 },
      { name: 'Pescados y Mariscos', code: '05', position: 5 },
      { name: 'ENSALADAS', code: '06', position: 6 },
      { name: 'ENSALADAS ESPECIALES', code: '07', position: 7 },
      { name: 'Entradas', code: '08', position: 8 },
      { name: 'Empanadas', code: '09', position: 9 },
      { name: 'FRITURAS', code: '10', position: 10 },
      { name: 'HELADOS', code: '11', position: 11 },
      { name: 'Omelets', code: '12', position: 12 },
      { name: 'PARRILLA', code: '13', position: 13 },
      { name: 'PLATOS FRÍOS DE MAR', code: '14', position: 14 },
      { name: 'POSTRES', code: '15', position: 15 },
      { name: 'PASTAS', code: '16', position: 16 },
      { name: 'SALSAS (porción)', code: '17', position: 17 },
      { name: 'Sandwiches Calientes', code: '18', position: 18 },
      { name: 'Sandwiches Fríos', code: '19', position: 19 },
      { name: 'Tortillas', code: '20', position: 20 }
    ];

    const createdCategories = [];
    for (const catData of categoriesData) {
      const category = await prisma.category.create({
        data: {
          name: catData.name,
          code: catData.code,
          position: catData.position,
          description: `Categoría de ${catData.name}`,
          menuId: menu.id,
          isActive: true,
        },
      });
      createdCategories.push(category);
      console.log(`📂 Categoría creada: ${category.name} (${category.code})`);
    }

    // Crear TODOS los platos del MD usando SQL directo
    console.log('🍽️ Creando platos...');
    const platosData = [
      // Platos del Día (8 platos)
      { name: 'Riñoncitos al jerez c/ puré', price: 9000, code: '0101', categoryCode: '01' },
      { name: 'Croquetas de carne c/ ensalada', price: 9000, code: '0102', categoryCode: '01' },
      { name: 'Chupín de merluza c/ papa natural', price: 10000, code: '0103', categoryCode: '01' },
      { name: 'Pechuga rellena c/ f. españolas', price: 12000, code: '0104', categoryCode: '01' },
      { name: 'Mejillones c/ fettuccinis', price: 12000, code: '0105', categoryCode: '01' },
      { name: 'Vacío a la parrilla c/ fritas', price: 14000, code: '0106', categoryCode: '01' },
      { name: 'Peceto al verdeo c/ puré', price: 15000, code: '0107', categoryCode: '01' },
      { name: 'Correntinos caseros a la Vangoli', price: 13000, code: '0108', categoryCode: '01' },
      
      // Promos de la Semana (2 platos)
      { name: 'Promo 1 (Entraña c/ arroz + postre + bebida)', price: 12000, code: '0201', categoryCode: '02' },
      { name: 'Promo 2 (Salpicón de ave + postre + bebida)', price: 12000, code: '0202', categoryCode: '02' },
      
      // Cocina (14 platos)
      { name: '1/4 Pollo al horno c/ papas', price: 9000, code: '0301', categoryCode: '03' },
      { name: '1/4 Pollo provenzal c/ fritas', price: 10000, code: '0302', categoryCode: '03' },
      { name: 'Matambre al verdeo c/ fritas', price: 12000, code: '0303', categoryCode: '03' },
      { name: 'Matambre a la pizza c/ fritas', price: 12000, code: '0304', categoryCode: '03' },
      { name: 'Bondiola al ajillo c/ fritas', price: 12000, code: '0305', categoryCode: '03' },
      { name: 'Bondiola al verdeo c/ papas', price: 12000, code: '0306', categoryCode: '03' },
      { name: 'Costillitas (2) a la riojana', price: 18000, code: '0307', categoryCode: '03' },
      { name: 'Vacío al horno c/ papas', price: 14000, code: '0308', categoryCode: '03' },
      { name: 'Vacío a la parrilla c/ guarnición (ensalada)', price: 15000, code: '0309', categoryCode: '03' },
      { name: 'Peceto horneado al vino c/ f. españolas', price: 15000, code: '0310', categoryCode: '03' },
      { name: 'Peceto al verdeo c/ puré', price: 15000, code: '0311', categoryCode: '03' },
      { name: 'Peceto al roquefort c/ f. españolas', price: 18000, code: '0312', categoryCode: '03' },
      { name: 'Tapa de asado al horno c/ papas', price: 12000, code: '0313', categoryCode: '03' },
      { name: 'Costillitas a la mostaza c/ fritas', price: 12000, code: '0314', categoryCode: '03' },
      
      // Pescados y Mariscos (18 platos)
      { name: 'Filet de merluza a la romana c/ g.', price: 8000, code: '0501', categoryCode: '05' },
      { name: 'Filet de merluza napolitano / capresse c/g', price: 10000, code: '0502', categoryCode: '05' },
      { name: 'Filet de merluza Suisse c/g.', price: 10000, code: '0503', categoryCode: '05' },
      { name: 'Filet brotola al verdeo c/g', price: 12000, code: '0504', categoryCode: '05' },
      { name: 'Trucha a la manteca negra c/ alcapparras', price: 25000, code: '0505', categoryCode: '05' },
      { name: 'Salmón rosado c/ crema de puerros', price: 30000, code: '0506', categoryCode: '05' },
      { name: 'Gambas al ajillo c/ fritas a la española', price: 20000, code: '0507', categoryCode: '05' },
      { name: 'Calamares a la leonesa', price: 18000, code: '0508', categoryCode: '05' },
      { name: 'Calamares con arroz', price: 12000, code: '0509', categoryCode: '05' },
      { name: 'Calamares con spaguettis', price: 13000, code: '0510', categoryCode: '05' },
      { name: 'Mejillones c/ arroz', price: 12000, code: '0511', categoryCode: '05' },
      { name: 'Mejillones c/ spaguettis', price: 13000, code: '0512', categoryCode: '05' },
      { name: 'Arroz con mariscos p/2', price: 25000, code: '0513', categoryCode: '05' },
      { name: 'Cazuela de mariscos', price: 25000, code: '0514', categoryCode: '05' },
      { name: 'Paella a la valenciana p/2', price: 30000, code: '0515', categoryCode: '05' },
      { name: 'Rabas a la romana c/ f. españolas', price: 18000, code: '0516', categoryCode: '05' },
      { name: 'Pulpo a la gallega', price: 60000, code: '0517', categoryCode: '05' },
      { name: 'Bacalao de Noruega a la gallega', price: 30000, code: '0518', categoryCode: '05' },
      { name: 'Bacalao a la vizcaína', price: 30000, code: '0519', categoryCode: '05' },
      
      // ENSALADAS (4 platos)
      { name: '1 Ingrediente', price: 4000, code: '0601', categoryCode: '06' },
      { name: '2 Ingrediente', price: 4500, code: '0602', categoryCode: '06' },
      { name: '3 Ingredientes', price: 5000, code: '0603', categoryCode: '06' },
      { name: '4 Ingredientes', price: 7000, code: '0604', categoryCode: '06' },
      
      // ENSALADAS ESPECIALES (10 platos)
      { name: 'Ens. rúcula y parmesano', price: 7000, code: '0701', categoryCode: '07' },
      { name: 'Ensalada Caesar', price: 9000, code: '0702', categoryCode: '07' },
      { name: 'Ensalada completa + JyQ', price: 10000, code: '0703', categoryCode: '07' },
      { name: 'Ensalada completa + atún', price: 12000, code: '0704', categoryCode: '07' },
      { name: 'Salpicón de ave', price: 9000, code: '0705', categoryCode: '07' },
      { name: 'Ensalada mixta', price: 5000, code: '0706', categoryCode: '07' },
      { name: 'Ensalada completa', price: 9000, code: '0707', categoryCode: '07' },
      { name: 'Ens. comp. + pollo', price: 11000, code: '0708', categoryCode: '07' },
      { name: 'Ens. comp + gambas', price: 15000, code: '0709', categoryCode: '07' },
      { name: 'Salpicón de atún', price: 10000, code: '0710', categoryCode: '07' },
      
      // Entradas (15 platos)
      { name: 'Picada para 1', price: 10000, code: '0801', categoryCode: '08' },
      { name: 'Matambre casero c/ rusa', price: 10000, code: '0802', categoryCode: '08' },
      { name: 'Lengua a la vinagreta c/ rusa', price: 9000, code: '0803', categoryCode: '08' },
      { name: 'Mayonesa de ave', price: 10000, code: '0804', categoryCode: '08' },
      { name: 'Mayonesa de atún', price: 10000, code: '0805', categoryCode: '08' },
      { name: 'Pechuga a la criolla c/ rusa', price: 11000, code: '0806', categoryCode: '08' },
      { name: 'Peceto a la criolla c/ rusa', price: 12000, code: '0807', categoryCode: '08' },
      { name: 'Picada para 2', price: 19000, code: '0808', categoryCode: '08' },
      { name: 'Jamón cocido c/ rusa', price: 15000, code: '0809', categoryCode: '08' },
      { name: 'Jamón crudo c/ rusa', price: 18000, code: '0810', categoryCode: '08' },
      { name: 'Jamón crudo c/ melón', price: 18000, code: '0811', categoryCode: '08' },
      { name: 'Salpicón de atún', price: 15000, code: '0812', categoryCode: '08' },
      { name: 'Langostinos c/ salsa golf', price: 15000, code: '0813', categoryCode: '08' },
      { name: 'Palmitos c/ salsa golf', price: 12000, code: '0814', categoryCode: '08' },
      { name: 'Empanadas Carne/Pollo/JyQ (c/u)', price: 1600, code: '08015', categoryCode: '08' },
      
      // Empanadas (1 plato)
      { name: 'Empanadas Atún (c/u)', price: 1800, code: '0901', categoryCode: '09' },
      
      // FRITURAS (15 platos)
      { name: 'Milanesa de ternera sola', price: 7000, code: '1001', categoryCode: '10' },
      { name: 'Milanesa c/ fritas', price: 9000, code: '1002', categoryCode: '10' },
      { name: 'Milanesa completa', price: 12000, code: '1003', categoryCode: '10' },
      { name: 'Milanesa Napolitana sola', price: 10000, code: '1004', categoryCode: '10' },
      { name: 'Milanesa Napolitana con fritas', price: 12000, code: '1005', categoryCode: '10' },
      { name: 'Milanesa de pollo', price: 7000, code: '1006', categoryCode: '10' },
      { name: 'Milanesa de pollo con fritas', price: 9000, code: '1007', categoryCode: '10' },
      { name: 'Milanesa de pollo napolitana c/ fritas', price: 12000, code: '1008', categoryCode: '10' },
      { name: 'Suprema sola', price: 9000, code: '1009', categoryCode: '10' },
      { name: 'Suprema c/ fritas', price: 11000, code: '1010', categoryCode: '10' },
      { name: 'Suprema completa', price: 14000, code: '1011', categoryCode: '10' },
      { name: 'Suprema Napolitana con fritas', price: 14000, code: '1012', categoryCode: '10' },
      { name: 'Suprema a la suiza c/ fritas', price: 20000, code: '1013', categoryCode: '10' },
      { name: 'Milanesa "ESQUINA" p/ 2 (queso timbo, jamón crudo, rúcula, parmesano, aceitunas)', price: 14000, code: '1014', categoryCode: '10' },
      
      // HELADOS (2 platos)
      { name: 'Bocha de helado', price: 4000, code: '1101', categoryCode: '11' },
      { name: 'Almendrado', price: 6000, code: '1102', categoryCode: '11' },
      
      // Omelets (4 platos)
      { name: 'Omelet c/ jamón', price: 7000, code: '1201', categoryCode: '12' },
      { name: 'Omelet c/ jamón y queso', price: 8000, code: '1202', categoryCode: '12' },
      { name: 'Omelet c/ jamón, queso y tomate', price: 9000, code: '1203', categoryCode: '12' },
      { name: 'Omelet de verdura', price: 7000, code: '1204', categoryCode: '12' },
      
      // PARRILLA (13 platos)
      { name: 'Asado de tira', price: 15000, code: '1301', categoryCode: '13' },
      { name: 'Bife de chorizo', price: 15000, code: '1302', categoryCode: '13' },
      { name: 'Bife c/ lomo', price: 15000, code: '1303', categoryCode: '13' },
      { name: 'Costillas cerdo (2)', price: 10000, code: '1304', categoryCode: '13' },
      { name: 'Riñones provenzal', price: 9000, code: '1305', categoryCode: '13' },
      { name: 'Provoletta', price: 9000, code: '1306', categoryCode: '13' },
      { name: 'Pechuga grillé', price: 10000, code: '1307', categoryCode: '13' },
      { name: 'Entraña', price: 15000, code: '1308', categoryCode: '13' },
      { name: 'Bife de lomo', price: 15000, code: '1309', categoryCode: '13' },
      { name: 'Bife cuadril', price: 15000, code: '1310', categoryCode: '13' },
      { name: 'Bondiola', price: 13000, code: '1311', categoryCode: '13' },
      { name: 'Hígado bife', price: 15000, code: '1312', categoryCode: '13' },
      { name: 'Provoletta Esquina', price: 15000, code: '1313', categoryCode: '13' },
      { name: 'Ojo de bife', price: 15000, code: '1314', categoryCode: '13' },
      
      // PLATOS FRÍOS DE MAR (5 platos)
      { name: 'Langostinos c/ salsa Golf', price: 18000, code: '1401', categoryCode: '14' },
      { name: 'Langostinos c/ salsa Golf + palmitos', price: 25000, code: '1402', categoryCode: '14' },
      { name: 'Pulpo a la Provenzal', price: 18000, code: '1403', categoryCode: '14' },
      { name: 'Calamares a la provenzal', price: 20000, code: '1404', categoryCode: '14' },
      { name: 'Atún + palmitos c/ salsa Golf', price: 25000, code: '1405', categoryCode: '14' },
      
      // POSTRES (20 platos)
      { name: 'Flan casero solo', price: 2000, code: '1501', categoryCode: '15' },
      { name: 'Flan casero c/ crema o dulce', price: 3000, code: '1502', categoryCode: '15' },
      { name: 'Flan casero mixto', price: 3500, code: '1503', categoryCode: '15' },
      { name: 'Budín de pan casero', price: 2000, code: '1504', categoryCode: '15' },
      { name: 'Budín de pan casero c/ crema o dulce', price: 3000, code: '1505', categoryCode: '15' },
      { name: 'Budín de pan mixto', price: 3500, code: '1506', categoryCode: '15' },
      { name: 'Duraznos en almíbar', price: 2500, code: '1507', categoryCode: '15' },
      { name: 'Duraznos c/ crema o dulce', price: 3000, code: '1508', categoryCode: '15' },
      { name: 'Duraznos mixtos', price: 3500, code: '1509', categoryCode: '15' },
      { name: 'Bananas c/ crema o dulce', price: 3500, code: '1510', categoryCode: '15' },
      { name: 'Ensalada de frutas', price: 4000, code: '1511', categoryCode: '15' },
      { name: 'Ensalada c/ crema', price: 5500, code: '1512', categoryCode: '15' },
      { name: 'Frutillas al jerez', price: 6000, code: '1513', categoryCode: '15' },
      { name: 'Frutillas c/ crema', price: 6000, code: '1514', categoryCode: '15' },
      { name: 'Panqueques duce de leche', price: 5500, code: '1515', categoryCode: '15' },
      { name: 'Queso y dulce', price: 3000, code: '1516', categoryCode: '15' },
      { name: 'Membrillo o batata, porción', price: 4000, code: '1517', categoryCode: '15' },
      { name: 'Queso cremoso, porción', price: 5000, code: '1518', categoryCode: '15' },
      { name: 'Queso Fimbo', price: 5000, code: '1519', categoryCode: '15' },
      { name: 'Queso Roquefort, porción', price: 6000, code: '1520', categoryCode: '15' },
      
      // PASTAS (20 platos)
      { name: 'Spaghettis c/ tuco', price: 6000, code: '1601', categoryCode: '16' },
      { name: 'Spaghettis c/ s. mixta', price: 7000, code: '1602', categoryCode: '16' },
      { name: 'Spaghettis al óleo', price: 6000, code: '1603', categoryCode: '16' },
      { name: 'Spaghettis a la manteca', price: 6000, code: '1604', categoryCode: '16' },
      { name: 'Spaghettis c/ bolognesa', price: 8000, code: '1605', categoryCode: '16' },
      { name: 'Spaghettis c/ estofado', price: 13000, code: '1606', categoryCode: '16' },
      { name: 'Spaghettis a la parissien', price: 12000, code: '1607', categoryCode: '16' },
      { name: 'Ñoquis caseros c/ tuco', price: 6000, code: '1608', categoryCode: '16' },
      { name: 'Ñoquis caseros c/ s. mixta', price: 7000, code: '1609', categoryCode: '16' },
      { name: 'Ñoquis caseros c/ bolognesa', price: 8000, code: '1610', categoryCode: '16' },
      { name: 'Ñoquis caseros c/ estofado', price: 9000, code: '1611', categoryCode: '16' },
      { name: 'Sorrentinos caseros c/ tuco', price: 10000, code: '1612', categoryCode: '16' },
      { name: 'Sorrentinos caseros c/ s. mixta', price: 12000, code: '1613', categoryCode: '16' },
      { name: 'Sorrentinos caseros c/ bolognesa', price: 13000, code: '1614', categoryCode: '16' },
      { name: 'Sorrentinos caseros c/ estofado', price: 15000, code: '1615', categoryCode: '16' },
      { name: 'Sorrentinos a la parissien', price: 15000, code: '1616', categoryCode: '16' },
      { name: 'Ravioles c/ tuco', price: 9000, code: '1617', categoryCode: '16' },
      { name: 'Ravioles c/ s. mixta', price: 10000, code: '1618', categoryCode: '16' },
      { name: 'Ravioles c/ bolognesa', price: 12000, code: '1619', categoryCode: '16' },
      { name: 'Ravioles c/ estofado', price: 15000, code: '1620', categoryCode: '16' },
      { name: 'Ravioles a la parissien', price: 15000, code: '1621', categoryCode: '16' },
      
      // SALSAS (8 platos)
      { name: 'Tuco', price: 6000, code: '1701', categoryCode: '17' },
      { name: 'Bolognesa', price: 8000, code: '1702', categoryCode: '17' },
      { name: 'Crema', price: 6000, code: '1703', categoryCode: '17' },
      { name: 'Pesto', price: 6000, code: '1704', categoryCode: '17' },
      { name: 'Parissien', price: 10000, code: '1705', categoryCode: '17' },
      { name: 'Putanesca', price: 10000, code: '1706', categoryCode: '17' },
      { name: 'Estofado de pollo', price: 10000, code: '1707', categoryCode: '17' },
      { name: 'Estofado de carne', price: 12000, code: '1708', categoryCode: '17' },
      
      // Sandwiches Calientes (14 platos)
      { name: 'Sw. milanesa simple', price: 5000, code: '1801', categoryCode: '18' },
      { name: 'Sw. milanesa LyT', price: 6000, code: '1802', categoryCode: '18' },
      { name: 'Sw. milanesa completo', price: 7000, code: '1803', categoryCode: '18' },
      { name: 'Sw. milanesa napolitana', price: 8000, code: '1804', categoryCode: '18' },
      { name: 'Sw. lomito solo simple', price: 8000, code: '1805', categoryCode: '18' },
      { name: 'Sw. lomito JyQ / LyT', price: 9000, code: '1806', categoryCode: '18' },
      { name: 'Sw. lomito completo', price: 10000, code: '1807', categoryCode: '18' },
      { name: 'Sw. bondiola simple', price: 8000, code: '1808', categoryCode: '18' },
      { name: 'Sw. bondiola JyQ / LyT', price: 9000, code: '1809', categoryCode: '18' },
      { name: 'Sw. bondiola completo', price: 10000, code: '1810', categoryCode: '18' },
      { name: 'Sw. pechuga simple', price: 8000, code: '1811', categoryCode: '18' },
      { name: 'Sw. pechuga JyQ / LyT', price: 9000, code: '1812', categoryCode: '18' },
      { name: 'Sw. pechuga completo', price: 10000, code: '1813', categoryCode: '18' },
      { name: 'Sw. de vacío', price: 10000, code: '1814', categoryCode: '18' },
      
      // Sandwiches Fríos (5 platos)
      { name: 'Francés jamón y queso', price: 6000, code: '1901', categoryCode: '19' },
      { name: 'Francés salame y queso', price: 6000, code: '1902', categoryCode: '19' },
      { name: 'Francés jamón crudo y queso', price: 7000, code: '1903', categoryCode: '19' },
      { name: 'Sandwich de matambre casero', price: 7000, code: '1904', categoryCode: '19' },
      
      // Tortillas (12 platos)
      { name: 'Papas', price: 8000, code: '2001', categoryCode: '20' },
      { name: 'Papas c/ cebolla', price: 9000, code: '2002', categoryCode: '20' },
      { name: 'Española', price: 10000, code: '2003', categoryCode: '20' },
      { name: 'Verdura', price: 8000, code: '2004', categoryCode: '20' },
      { name: 'Papas fritas porción', price: 6000, code: '2005', categoryCode: '20' },
      { name: 'Puré porción', price: 6000, code: '2006', categoryCode: '20' },
      { name: 'P. de papas fritas', price: 6000, code: '2007', categoryCode: '20' },
      { name: 'P. de puré de papas/calabaza', price: 6000, code: '2008', categoryCode: '20' },
      { name: 'P. de papas al horno', price: 7000, code: '2009', categoryCode: '20' },
      { name: 'Papas fritas c/ provenzal', price: 7000, code: '2010', categoryCode: '20' },
      { name: 'Papas fritas a caballo', price: 8000, code: '2011', categoryCode: '20' }
    ];

    for (const plato of platosData) {
      const category = createdCategories.find(cat => cat.code === plato.categoryCode);
      if (category) {
        await prisma.menuItem.create({
          data: {
            name: plato.name,
            price: plato.price,
            code: plato.code,
            description: `Delicioso ${plato.name.toLowerCase()}`,
            position: parseInt(plato.code.substring(2), 10),
            isAvailable: true,
            isPopular: false,
            isPromo: false,
            categoryId: category.id,
            menuId: menu.id,
          },
        });
        console.log(`  - Plato creado: ${plato.name} (${plato.code})`);
      }
    }

    console.log(`🚀 Datos de Esquina Pompeya poblados exitosamente con ${platosData.length} platos.`);

    return NextResponse.json({
      success: true,
      message: 'Datos de Esquina Pompeya creados exitosamente en Supabase',
      data: {
        menuId: menu.id,
        categoriesCount: categoriesData.length,
        itemsCount: platosData.length
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error en endpoint',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}