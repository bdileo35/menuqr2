// Script para activar PRO para un restaurante
// Uso: node scripts/activar-pro.js <restaurantId>
// Ejemplo: node scripts/activar-pro.js 5XJ1J37F

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const restaurantId = process.argv[2];
  
  if (!restaurantId) {
    console.error('❌ Error: Debes proporcionar un restaurantId');
    console.log('Uso: node scripts/activar-pro.js <restaurantId>');
    console.log('Ejemplo: node scripts/activar-pro.js 5XJ1J37F');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { restaurantId }
    });

    if (!user) {
      console.error(`❌ No se encontró usuario con restaurantId: ${restaurantId}`);
      process.exit(1);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { hasPro: true }
    });

    console.log(`✅ PRO activado para: ${user.restaurantName} (${restaurantId})`);
    console.log(`   El carrito PRO ahora estará visible en la carta`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

