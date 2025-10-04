import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addImagesToProducts() {
  try {
    console.log('🔍 Buscando productos para agregar imágenes...\n');

    // Mapeo de imágenes a productos (búsqueda flexible por nombre)
    const imageMap = [
      { 
        search: ['albóndiga', 'albondiga'], 
        image: '/demo-images/albondigas.jpg',
        name: 'Albóndigas'
      },
      { 
        search: ['milanesa completa', 'milanesa c/'], 
        image: '/demo-images/milanesa-completa.jpg',
        name: 'Milanesa completa'
      },
      { 
        search: ['raba'], 
        image: '/demo-images/rabas.jpg',
        name: 'Rabas'
      },
      { 
        search: ['vacío', 'vacio', 'parrilla'], 
        image: '/demo-images/vacio-papas.jpg',
        name: 'Vacío a la parrilla'
      }
    ];

    let updated = 0;

    for (const mapping of imageMap) {
      console.log(`📸 Buscando productos de: ${mapping.name}...`);
      
      // Buscar todos los productos y filtrar manualmente (SQLite no soporta mode: 'insensitive')
      const allProducts = await prisma.menuItem.findMany();
      
      const products = allProducts.filter(product => 
        mapping.search.some(term => 
          product.name.toLowerCase().includes(term.toLowerCase())
        )
      );

      if (products.length > 0) {
        console.log(`   ✓ Encontrados ${products.length} producto(s)`);
        
        for (const product of products) {
          await prisma.menuItem.update({
            where: { id: product.id },
            data: { 
              imageUrl: mapping.image,
              hasImage: true
            }
          });
          
          console.log(`   ✅ Imagen agregada a: "${product.name}"`);
          updated++;
        }
      } else {
        console.log(`   ⚠️ No se encontraron productos`);
      }
      console.log('');
    }

    console.log(`\n🎉 Proceso completado: ${updated} productos actualizados con imágenes\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addImagesToProducts();
