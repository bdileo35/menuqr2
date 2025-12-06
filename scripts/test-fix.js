const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

// Crear carpeta temporal si no existe
const tempDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('✅ Carpeta temporal creada:', tempDir);
}

// Configurar variables de entorno para SQLite
process.env.TMPDIR = tempDir;
process.env.TEMP = tempDir;
process.env.TMP = tempDir;

console.log('📁 Configuración:');
console.log('   CWD:', process.cwd());
console.log('   TMPDIR:', process.env.TMPDIR);

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
console.log('   DB Path:', dbPath);
console.log('   Existe:', fs.existsSync(dbPath) ? '✅' : '❌');

if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log('   Tamaño:', stats.size, 'bytes');
}

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: `file:${dbPath}`
    }
  }
});

async function main() {
  try {
    console.log('\n🔗 Intentando conectar con ruta absoluta...');
    const menus = await prisma.menu.findMany();
    console.log(`✅ ÉXITO! Encontrados ${menus.length} menús`);
    
    menus.forEach(m => {
      console.log(`   📋 ${m.restaurantId} - ${m.restaurantName}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error);