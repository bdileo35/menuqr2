// Script para verificar qué datos hay en la BD
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Verificando datos en BD...\n');
    
    // Verificar usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        restaurantId: true,
        restaurantName: true,
        hasPro: true
      }
    });
    
    console.log(`👤 Usuarios encontrados: ${users.length}`);
    users.forEach(u => {
      console.log(`   - ${u.restaurantName} (${u.restaurantId}) - PRO: ${u.hasPro}`);
    });
    
    // Verificar menús
    const menus = await prisma.menu.findMany({
      select: {
        id: true,
        restaurantId: true,
        restaurantName: true
      }
    });
    
    console.log(`\n🍽️ Menús encontrados: ${menus.length}`);
    menus.forEach(m => {
      console.log(`   - ${m.restaurantName} (${m.restaurantId})`);
    });
    
    // Verificar categorías e items
    for (const menu of menus) {
      const categories = await prisma.category.findMany({
        where: { menuId: menu.id }
      });
      
      const items = await prisma.menuItem.findMany({
        where: { menuId: menu.id }
      });
      
      console.log(`\n📊 ${menu.restaurantName}:`);
      console.log(`   - Categorías: ${categories.length}`);
      console.log(`   - Items: ${items.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

