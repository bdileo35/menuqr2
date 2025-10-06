import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Verificando datos de "Platos del Día"...');
    
    // Buscar la categoría "Platos del Día"
    const categoria = await prisma.category.findFirst({
      where: { 
        name: { contains: 'Platos del Día' }
      },
      include: {
        items: {
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!categoria) {
      console.log('❌ No se encontró la categoría "Platos del Día"');
      return;
    }

    console.log(`✅ Categoría encontrada: "${categoria.name}"`);
    console.log(`📊 Total de items: ${categoria.items.length}`);
    
    console.log('\n📋 Items en "Platos del Día":');
    categoria.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - $${item.price} - Disponible: ${item.isAvailable}`);
    });

    // Verificar cuántos están disponibles vs no disponibles
    const disponibles = categoria.items.filter(item => item.isAvailable).length;
    const noDisponibles = categoria.items.filter(item => !item.isAvailable).length;
    
    console.log(`\n📊 Resumen:`);
    console.log(`✅ Disponibles: ${disponibles}`);
    console.log(`❌ No disponibles: ${noDisponibles}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
