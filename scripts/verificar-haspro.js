// Script para verificar hasPro en BD
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { restaurantId: '5XJ1J37F' },
      select: {
        restaurantName: true,
        hasPro: true
      }
    });
    
    console.log('🔍 Usuario en BD:', user);
    
    if (user && !user.hasPro) {
      console.log('❌ hasPro está en false, activando...');
      await prisma.user.update({
        where: { restaurantId: '5XJ1J37F' },
        data: { hasPro: true }
      });
      console.log('✅ hasPro activado');
    } else {
      console.log('✅ hasPro ya está en true');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

