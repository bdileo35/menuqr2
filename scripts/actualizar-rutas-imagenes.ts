// scripts/actualizar-rutas-imagenes.ts
// Script para actualizar rutas de imágenes cuando se mueven archivos de carpeta

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdatePathsOptions {
  restaurantId: string;
  oldPath: string;  // ej: '/platos/los-toritos'
  newPath: string;  // ej: '/platos/5XJ1J37F'
}

async function actualizarRutasImagenes({ restaurantId, oldPath, newPath }: UpdatePathsOptions) {
  try {
    console.log(`🔄 Actualizando rutas de imágenes para restaurante: ${restaurantId}`);
    console.log(`   De: ${oldPath}`);
    console.log(`   A: ${newPath}`);
    console.log('');

    // Buscar el menú del restaurante
    const menu = await prisma.menu.findFirst({
      where: { restaurantId },
      include: {
        categories: {
          include: {
            items: true
          }
        }
      }
    });

    if (!menu) {
      console.error(`❌ No se encontró menú para restaurante: ${restaurantId}`);
      return;
    }

    let itemsActualizados = 0;
    let categoriasActualizadas = 0;

    // Actualizar items del menú
    for (const category of menu.categories) {
      for (const item of category.items) {
        if (item.imageUrl && item.imageUrl.includes(oldPath)) {
          const nuevaRuta = item.imageUrl.replace(oldPath, newPath);
          await prisma.menuItem.update({
            where: { id: item.id },
            data: { imageUrl: nuevaRuta }
          });
          console.log(`   ✅ Item "${item.name}": ${item.imageUrl} → ${nuevaRuta}`);
          itemsActualizados++;
        }
      }

      // Actualizar categorías (si tienen imagen)
      if (category.imageUrl && category.imageUrl.includes(oldPath)) {
        const nuevaRuta = category.imageUrl.replace(oldPath, newPath);
        await prisma.category.update({
          where: { id: category.id },
          data: { imageUrl: nuevaRuta }
        });
        console.log(`   ✅ Categoría "${category.name}": ${category.imageUrl} → ${nuevaRuta}`);
        categoriasActualizadas++;
      }
    }

    // Actualizar logo del menú (si tiene)
    if (menu.logoUrl && menu.logoUrl.includes(oldPath)) {
      const nuevaRuta = menu.logoUrl.replace(oldPath, newPath);
      await prisma.menu.update({
        where: { id: menu.id },
        data: { logoUrl: nuevaRuta }
      });
      console.log(`   ✅ Logo del menú: ${menu.logoUrl} → ${nuevaRuta}`);
    }

    console.log('');
    console.log(`✅ Actualización completada:`);
    console.log(`   - Items actualizados: ${itemsActualizados}`);
    console.log(`   - Categorías actualizadas: ${categoriasActualizadas}`);
    console.log('');
    console.log(`📝 No olvides actualizar también:`);
    console.log(`   1. El script seed-los-toritos.ts (línea 117)`);
    console.log(`   2. Mover los archivos físicos a la nueva carpeta`);

  } catch (error) {
    console.error('❌ Error actualizando rutas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('📖 Uso:');
    console.log('   npx tsx scripts/actualizar-rutas-imagenes.ts <restaurantId> <ruta-vieja> <ruta-nueva>');
    console.log('');
    console.log('📝 Ejemplo (mover imágenes de los-toritos a Esquina Pompeya):');
    console.log('   npx tsx scripts/actualizar-rutas-imagenes.ts 5XJ1J37F "/platos/los-toritos" "/platos/5XJ1J37F"');
    process.exit(1);
  }

  const [restaurantId, oldPath, newPath] = args;
  
  actualizarRutasImagenes({
    restaurantId,
    oldPath,
    newPath
  }).then(() => {
    console.log('✅ Proceso completado');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { actualizarRutasImagenes };

