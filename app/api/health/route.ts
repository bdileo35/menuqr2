import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Error de conexión a la base de datos',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      { status: 500 }
    );
  }
}