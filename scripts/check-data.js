const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  console.log('📊 VERIFICANDO DATOS EN LA BASE...\n');
  
  const users = await prisma.user.count();
  const menus = await prisma.menu.count();
  const categories = await prisma.category.count();
  const items = await prisma.menuItem.count();
  
  console.log('✅ Users:', users);
  console.log('✅ Menus:', menus);
  console.log('✅ Categories:', categories);
  console.log('✅ MenuItems:', items);
  
  if (users > 0) {
    console.log('\n📋 USUARIOS:');
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true, restaurantName: true }
    });
    allUsers.forEach(u => {
      console.log(`  - ${u.restaurantName} (${u.email})`);
    });
  }
  
  if (menus > 0) {
    console.log('\n📋 MENÚS:');
    const allMenus = await prisma.menu.findMany({
      select: { id: true, restaurantName: true, deliveryEnabled: true, deliveryFee: true }
    });
    allMenus.forEach(m => {
      console.log(`  - ${m.restaurantName}`);
      console.log(`    Delivery: ${m.deliveryEnabled ? 'Sí' : 'No'} | Fee: $${m.deliveryFee}`);
    });
  }
  
  if (categories > 0) {
    console.log('\n📋 CATEGORÍAS:');
    const allCategories = await prisma.category.findMany({
      select: { name: true, _count: { select: { items: true } } }
    });
    allCategories.forEach(c => {
      console.log(`  - ${c.name} (${c._count.items} items)`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (items === 0) {
    console.log('⚠️  BASE DE DATOS VACÍA - Necesitas ejecutar el seed');
  } else {
    console.log('✅ BASE DE DATOS CON DATOS');
    if (items < 80) {
      console.log('⚠️  Parece incompleta (esperados: ~80 items de Esquina Pompeya)');
    } else {
      console.log('✅ Datos completos de Esquina Pompeya cargados');
    }
  }
  
  await prisma.$disconnect();
}

checkData().catch(console.error);
