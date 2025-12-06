const { PrismaClient } = require('@prisma/client');

console.log('🔗 Probando conexión a la base de datos...\n');
console.log('DATABASE_URL:', process.env.DATABASE_URL || 'file:./prisma/dev.db');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function main() {
  try {
    console.log('📊 Consultando menús...');
    const menus = await prisma.menu.findMany({
      select: {
        id: true,
        restaurantId: true,
        restaurantName: true,
      }
    });
    
    console.log(`✅ Encontrados ${menus.length} menús:\n`);
    menus.forEach(menu => {
      console.log(`   📋 ${menu.restaurantId} - ${menu.restaurantName}`);
    });

    // Probar consulta específica
    console.log('\n🔍 Buscando menú 5XJ1J37F...');
    const menuEspecifico = await prisma.menu.findFirst({
      where: { restaurantId: '5XJ1J37F' }
    });

    if (menuEspecifico) {
      console.log('✅ Encontrado:', menuEspecifico.restaurantName);
    } else {
      console.log('❌ No encontrado');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nStack:', error.stack);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n✅ Conexión cerrada correctamente');
  })
  .catch(async (e) => {
    console.error('❌ Error fatal:', e);
    await prisma.$disconnect();
    process.exit(1);
  });