import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TEMPORALMENTE DESHABILITADO PARA FIX DE VERCEL BUILD
// TODO: Arreglar schema de Prisma para incluir campo phone en User
// Este script está comentado porque el modelo User en Prisma no incluye el campo 'phone'
// que se intentaba usar en la línea de creación del usuario

async function seedEsquinaPompeya() {
  console.log('⚠️ Seed temporalmente deshabilitado - usando datos de ejemplo desde localStorage');
  console.log('💡 Para habilitar este seed, actualizar prisma/schema.prisma agregando campo phone al modelo User');
  return;
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  seedEsquinaPompeya()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedEsquinaPompeya;
