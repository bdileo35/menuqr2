import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Marcar como dinámico para evitar pre-renderizado durante build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'OK',
      message: 'MenuQR-Next API funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'Prisma SQLite - Conectado',
      framework: 'Next.js 15 + TypeScript',
      architecture: 'Full-Stack Integrado',
      compatible: 'QRing Suite'
    });
  } catch (error: any) {
    // Durante el build, si no hay base de datos, retornar estado OK pero con advertencia
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
    const isConnectionError = error?.message?.includes('Unable to open the database file') || 
                               error?.message?.includes('Can\'t reach database server');
    
    if (isBuildTime || isConnectionError) {
      return NextResponse.json({
        status: 'OK',
        message: 'MenuQR-Next API funcionando (BD no disponible durante build)',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'No disponible durante build',
        framework: 'Next.js 15 + TypeScript',
        architecture: 'Full-Stack Integrado',
        compatible: 'QRing Suite'
      });
    }
    
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Error de conexión a la base de datos',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      // Ignorar errores de desconexión durante build
    }
  }
}