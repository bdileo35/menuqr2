/**
 * 🍽️ SCRIPT AUTOMATIZADO PARA CREAR NUEVOS RESTAURANTES
 * 
 * Este script simplifica el proceso de crear un nuevo restaurante
 * desde un archivo Markdown con el menú.
 * 
 * Uso:
 *   npm run crear-restaurante -- --nombre "Mi Restaurante" --archivo "Menu_mi_restaurante.md"
 * 
 * O interactivo:
 *   npm run crear-restaurante
 */

import { PrismaClient, Role } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { generarIDUUnico } from '../lib/shared/idu-generator';

const prisma = new PrismaClient();

interface RestauranteConfig {
  nombreArchivo: string;
  nombreComercio: string;
  email: string;
  telefono: string;
  direccion: string;
  instagram?: string;
  facebook?: string;
  descripcion?: string;
  horario?: string;
}

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step: number, message: string) {
  log(`\n${step}. ${message}`, colors.cyan);
}

function logSuccess(message: string) {
  log(`✅ ${message}`, colors.green);
}

function logError(message: string) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, colors.blue);
}

/**
 * Parsea un archivo MD con formato de tabla
 */
function parsearMenuMD(mdPath: string): Map<string, { name: string; items: any[] }> {
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const lines = mdContent.split('\n').filter(line => line.trim() && !line.startsWith('|---'));
  
  const categoriesMap = new Map<string, { name: string; items: any[] }>();
  let currentCategory = '';
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;
    
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    if (parts.length < 3) continue;
    
    let codigo = '';
    let categoria = '';
    let plato = '';
    let precioStr = '';
    
    // Detectar formato
    if (parts.length >= 4) {
      if (parts[0].match(/^\d{4}$/)) {
        codigo = parts[0];
        categoria = parts[1];
        plato = parts[2];
        precioStr = parts[3];
      } else {
        categoria = parts[0];
        plato = parts[1];
        precioStr = parts[2];
      }
    } else if (parts.length === 3) {
      categoria = parts[0];
      plato = parts[1];
      precioStr = parts[2];
    }
    
    if (categoria && categoria !== currentCategory) {
      currentCategory = categoria;
      if (!categoriesMap.has(currentCategory)) {
        categoriesMap.set(currentCategory, {
          name: currentCategory,
          items: []
        });
      }
    }
    
    if (plato && precioStr && currentCategory) {
      const precio = parseFloat(precioStr.replace(/[^\d]/g, '')) || 0;
      if (precio > 0) {
        categoriesMap.get(currentCategory)!.items.push({
          code: codigo || null,
          name: plato,
          price: precio
        });
      }
    }
  }
  
  return categoriesMap;
}

/**
 * Crea un nuevo restaurante completo
 */
async function crearRestaurante(config: RestauranteConfig) {
  try {
    log('\n' + '='.repeat(60), colors.bright);
    log('🍽️  CREANDO NUEVO RESTAURANTE', colors.bright);
    log('='.repeat(60), colors.bright);

    // 1. Validar archivo
    logStep(1, 'Validando archivo del menú');
    const mdPath = path.join(process.cwd(), 'Docs', config.nombreArchivo);
    
    if (!fs.existsSync(mdPath)) {
      logError(`Archivo no encontrado: ${config.nombreArchivo}`);
      logInfo(`Ruta esperada: ${mdPath}`);
      process.exit(1);
    }
    logSuccess(`Archivo encontrado: ${config.nombreArchivo}`);

    // 2. Parsear menú
    logStep(2, 'Parseando menú desde Markdown');
    const categoriesMap = parsearMenuMD(mdPath);
    logSuccess(`Encontradas ${categoriesMap.size} categorías`);
    categoriesMap.forEach((cat, name) => {
      logInfo(`  - ${name}: ${cat.items.length} items`);
    });

    // 3. Generar ID único
    logStep(3, 'Generando ID único para el restaurante');
    const restaurantId = await generarIDUUnico(async (id) => {
      const existe = await prisma.user.findUnique({
        where: { restaurantId: id }
      });
      return existe !== null;
    });
    logSuccess(`ID único generado: ${restaurantId}`);

    // 4. Verificar email
    logStep(4, 'Verificando email');
    const userExistente = await prisma.user.findUnique({
      where: { email: config.email }
    });

    if (userExistente) {
      logError(`El email ${config.email} ya está registrado`);
      logWarning('Usa un email diferente o elimina el usuario existente');
      process.exit(1);
    }
    logSuccess(`Email disponible: ${config.email}`);

    // 5. Crear usuario
    logStep(5, 'Creando usuario administrador');
    const user = await prisma.user.create({
      data: {
        email: config.email,
        password: 'temp_password_' + Date.now(),
        name: config.nombreComercio,
        restaurantId,
        restaurantName: config.nombreComercio,
        phone: config.telefono,
        address: config.direccion,
        plan: 'pro',
        role: Role.ADMIN,
        isActive: true,
      },
    });
    logSuccess(`Usuario creado: ${user.email}`);

    // 6. Crear menú
    logStep(6, 'Creando menú del restaurante');
    const menu = await prisma.menu.create({
      data: {
        restaurantId,
        restaurantName: config.nombreComercio,
        description: config.descripcion || `Menú de ${config.nombreComercio}`,
        ownerId: user.id,
        allowOrdering: true,
        deliveryEnabled: true,
        contactPhone: config.telefono,
        contactAddress: config.direccion,
        socialInstagram: config.instagram,
        socialFacebook: config.facebook,
      },
    });
    logSuccess(`Menú creado: ${menu.restaurantName}`);

    // 7. Crear categorías e items
    logStep(7, 'Creando categorías e items del menú');
    let totalItems = 0;
    let position = 0;

    for (const [catName, catData] of Array.from(categoriesMap.entries())) {
      const category = await prisma.category.create({
        data: {
          name: catData.name,
          description: null,
          code: null,
          position: position++,
          menuId: menu.id
        }
      });

      for (let idx = 0; idx < catData.items.length; idx++) {
        const item = catData.items[idx];
        await prisma.menuItem.create({
          data: {
            name: item.name,
            price: item.price,
            code: item.code,
            position: idx,
            isAvailable: true,
            menuId: menu.id,
            categoryId: category.id
          }
        });
        totalItems++;
      }
    }

    logSuccess(`Categorías creadas: ${categoriesMap.size}`);
    logSuccess(`Items creados: ${totalItems}`);

    // 8. Resumen final
    log('\n' + '='.repeat(60), colors.bright);
    log('🎉 ¡RESTAURANTE CREADO EXITOSAMENTE!', colors.bright);
    log('='.repeat(60), colors.bright);
    
    log('\n📊 RESUMEN:', colors.cyan);
    log(`   Nombre: ${config.nombreComercio}`, colors.reset);
    log(`   ID Único: ${restaurantId}`, colors.reset);
    log(`   Email: ${config.email}`, colors.reset);
    log(`   Categorías: ${categoriesMap.size}`, colors.reset);
    log(`   Items: ${totalItems}`, colors.reset);

    log('\n🔗 URLs:', colors.cyan);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    log(`   📄 Carta pública: ${baseUrl}/carta/${restaurantId}`, colors.green);
    log(`   ✏️  Editor: ${baseUrl}/editor/${restaurantId}`, colors.green);
    log(`   ⚙️  Configuración: ${baseUrl}/configuracion/${restaurantId}`, colors.green);

    log('\n💡 PRÓXIMOS PASOS:', colors.yellow);
    log('   1. Cambia la contraseña del usuario desde el panel de administración', colors.reset);
    log('   2. Personaliza el menú desde el editor', colors.reset);
    log('   3. Agrega imágenes a los platos si lo deseas', colors.reset);
    log('   4. Configura el tema y colores del restaurante', colors.reset);

    return {
      restaurantId,
      menuId: menu.id,
      userId: user.id,
      categoriesCount: categoriesMap.size,
      itemsCount: totalItems
    };

  } catch (error: any) {
    logError(`Error al crear restaurante: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Modo interactivo
async function modoInteractivo() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const pregunta = (query: string): Promise<string> => {
    return new Promise(resolve => readline.question(query, resolve));
  };

  log('\n🍽️  MODO INTERACTIVO - Crear Nuevo Restaurante\n', colors.bright);

  const config: RestauranteConfig = {
    nombreArchivo: await pregunta('📄 Nombre del archivo MD (ej: Menu_mi_restaurante.md): '),
    nombreComercio: await pregunta('🏪 Nombre del restaurante: '),
    email: await pregunta('📧 Email del administrador: '),
    telefono: await pregunta('📱 Teléfono: '),
    direccion: await pregunta('📍 Dirección: '),
  };

  const tieneInstagram = await pregunta('📸 ¿Tienes Instagram? (s/n): ');
  if (tieneInstagram.toLowerCase() === 's') {
    config.instagram = await pregunta('   Instagram (@usuario): ');
  }

  const tieneFacebook = await pregunta('👥 ¿Tienes Facebook? (s/n): ');
  if (tieneFacebook.toLowerCase() === 's') {
    config.facebook = await pregunta('   Facebook: ');
  }

  const tieneDescripcion = await pregunta('📝 ¿Agregar descripción? (s/n): ');
  if (tieneDescripcion.toLowerCase() === 's') {
    config.descripcion = await pregunta('   Descripción: ');
  }

  readline.close();

  await crearRestaurante(config);
}

// Modo con argumentos
async function modoArgumentos() {
  const args = process.argv.slice(2);
  const config: Partial<RestauranteConfig> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    
    if (key && value) {
      (config as any)[key] = value;
    }
  }

  // Validar campos requeridos
  const requeridos = ['nombreArchivo', 'nombreComercio', 'email', 'telefono', 'direccion'];
  const faltantes = requeridos.filter(campo => !config[campo as keyof RestauranteConfig]);

  if (faltantes.length > 0) {
    logError(`Faltan campos requeridos: ${faltantes.join(', ')}`);
    logInfo('\nUso: npm run crear-restaurante -- --nombreArchivo "Menu.md" --nombreComercio "Mi Resto" --email "admin@resto.com" --telefono "+5411..." --direccion "Calle 123"');
    process.exit(1);
  }

  await crearRestaurante(config as RestauranteConfig);
}

// Ejecutar
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--interactivo') || args.includes('-i')) {
    await modoInteractivo();
  } else {
    await modoArgumentos();
  }

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    logError(`Error: ${e.message}`);
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

