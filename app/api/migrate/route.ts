import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Ejecutando migraciones en Supabase...');

    // Verificar conexión
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexión a Supabase establecida');

    // Ejecutar migraciones usando execSync
    const { execSync } = require('child_process');
    
    try {
      // Generar cliente Prisma
      console.log('🔄 Generando cliente Prisma...');
      execSync('npx prisma generate', { stdio: 'pipe' });
      console.log('✅ Cliente Prisma generado');

      // Ejecutar db push para crear tablas
      console.log('🔄 Ejecutando db push...');
      execSync('npx prisma db push --force-reset', { stdio: 'pipe' });
      console.log('✅ Tablas creadas en Supabase');

      return NextResponse.json({
        success: true,
        message: 'Migraciones ejecutadas exitosamente en Supabase'
      });

    } catch (execError) {
      console.error('❌ Error ejecutando comandos:', execError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error ejecutando comandos de migración',
          details: execError instanceof Error ? execError.message : 'Error desconocido'
        },
        { status: 500 }
      );
    }

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
