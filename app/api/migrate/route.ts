import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Ejecutando migraciones en Supabase...');

    // Ejecutar migraciones de Prisma
    const { execSync } = require('child_process');
    
    // Generar cliente Prisma
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Cliente Prisma generado');

    // Ejecutar migraciones
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Migraciones ejecutadas');

    return NextResponse.json({
      success: true,
      message: 'Migraciones ejecutadas exitosamente en Supabase'
    });

  } catch (error) {
    console.error('❌ Error en migraciones:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error ejecutando migraciones',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
