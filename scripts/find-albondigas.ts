import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findAlbondigas() {
  const allProducts = await prisma.menuItem.findMany({
    select: { id: true, name: true }
  });
  
  console.log('\n🔍 Buscando productos con "alb", "bola", "carne"...\n');
  
  const matches = allProducts.filter(p => 
    p.name.toLowerCase().includes('alb') ||
    p.name.toLowerCase().includes('bola') ||
    p.name.toLowerCase().includes('pure')
  );
  
  if (matches.length > 0) {
    console.log('✅ Productos encontrados:');
    matches.forEach(p => console.log(`   - ${p.name} (${p.id})`));
  } else {
    console.log('❌ No se encontraron productos');
  }
  
  await prisma.$disconnect();
}

findAlbondigas();
