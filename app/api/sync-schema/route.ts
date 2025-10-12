import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Sincronizando schema de Prisma con Supabase...');

    // Ejecutar prisma db push
    const { execSync } = require('child_process');
    
    try {
      // Generar cliente Prisma
      console.log('🔄 Generando cliente Prisma...');
      execSync('npx prisma generate', { stdio: 'pipe' });
      console.log('✅ Cliente Prisma generado');

      // Ejecutar db push para sincronizar schema
      console.log('🔄 Ejecutando db push...');
      execSync('npx prisma db push', { stdio: 'pipe' });
      console.log('✅ Schema sincronizado con Supabase');

      return NextResponse.json({
        success: true,
        message: 'Schema sincronizado exitosamente con Supabase'
      });

    } catch (execError) {
      console.error('❌ Error ejecutando comandos:', execError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error sincronizando schema',
          details: execError instanceof Error ? execError.message : 'Error desconocido'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error en sync-schema:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error en sync-schema',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
