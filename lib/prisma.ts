import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Configuración optimizada para Supabase y Vercel
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'query'] : ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Función helper para ejecutar queries con retry
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Solo reintentar si es error de conexión
      const isConnectionError = 
        error?.message?.includes('Can\'t reach database') ||
        error?.message?.includes('P1001') ||
        error?.code === 'P1001' ||
        error?.message?.includes('connection');
      
      if (!isConnectionError || i === maxRetries - 1) {
        throw error;
      }
      
      console.log(`⚠️ Reintento ${i + 1}/${maxRetries} después de error de conexión...`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw lastError || new Error('Error desconocido');
}

export default prisma;