import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  };

  // 1. Verificar DATABASE_URL
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  diagnostics.checks.databaseUrl = {
    exists: hasDatabaseUrl,
    preview: hasDatabaseUrl 
      ? `${process.env.DATABASE_URL.substring(0, 30)}...` 
      : 'NO CONFIGURADA'
  };

  // 2. Verificar formato de DATABASE_URL
  if (hasDatabaseUrl) {
    const dbUrl = process.env.DATABASE_URL;
    diagnostics.checks.databaseUrlFormat = {
      startsWithPostgres: dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'),
      hasSSL: dbUrl.includes('sslmode=require'),
      hasHost: dbUrl.includes('@') && dbUrl.includes(':'),
      format: 'OK'
    };
  }

  // 3. Intentar conectar a la base de datos
  try {
    await prisma.$connect();
    const testQuery = await prisma.$queryRaw`SELECT 1 as test`;
    diagnostics.checks.databaseConnection = {
      status: 'SUCCESS',
      canQuery: true
    };

    // 4. Verificar si hay menús en la BD
    try {
      const menus = await prisma.menu.findMany({
        select: { restaurantId: true, restaurantName: true },
        take: 10
      });
      diagnostics.checks.databaseData = {
        status: 'SUCCESS',
        menusFound: menus.length,
        menus: menus.map(m => ({ id: m.restaurantId, name: m.restaurantName }))
      };
    } catch (e: any) {
      diagnostics.checks.databaseData = {
        status: 'ERROR',
        error: e.message
      };
    }

    await prisma.$disconnect();
  } catch (error: any) {
    diagnostics.checks.databaseConnection = {
      status: 'ERROR',
      error: error.message,
      code: error.code,
      meta: error.meta
    };
  }

  // 5. Verificar Prisma Client
  try {
    const prismaVersion = await prisma.$queryRaw`SELECT version()`;
    diagnostics.checks.prismaClient = {
      status: 'OK',
      canQuery: true
    };
  } catch (e: any) {
    diagnostics.checks.prismaClient = {
      status: 'ERROR',
      error: e.message
    };
  }

  return NextResponse.json({
    success: true,
    diagnostics
  });
}

