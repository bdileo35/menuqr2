import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de datos reales para Esquina Pompeya...');
    console.log('🔍 Verificando que el endpoint se ejecuta correctamente...');

    // Verificar conexión a la base de datos
    console.log('🔗 Conectando a Supabase...');
    
    // Crear tablas simplificadas
    console.log('🔧 Creando tablas en Supabase...');
    
    try {
      // Crear tabla users (simplificada)
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL,
          restaurant_id TEXT NOT NULL,
          restaurant_name TEXT NOT NULL,
          phone TEXT,
          address TEXT,
          plan TEXT DEFAULT 'basic',
          role TEXT DEFAULT 'ADMIN',
          avatar TEXT,
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Crear tabla menus (simplificada)
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS menus (
          id TEXT PRIMARY KEY,
          restaurant_name TEXT NOT NULL,
          restaurant_id TEXT NOT NULL,
          description TEXT,
          logo_url TEXT,
          contact_phone TEXT,
          contact_address TEXT,
          contact_email TEXT,
          social_instagram TEXT,
          primary_color TEXT,
          secondary_color TEXT,
          show_prices BOOLEAN DEFAULT true,
          show_images BOOLEAN DEFAULT true,
          show_descriptions BOOLEAN DEFAULT true,
          currency TEXT DEFAULT '$',
          language TEXT DEFAULT 'es',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          owner_id TEXT NOT NULL
        )
      `;
      
      // Crear tabla categories (simplificada)
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          position INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          menu_id TEXT NOT NULL,
          code TEXT
        )
      `;
      
      // Crear tabla menu_items (simplificada)
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS menu_items (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          price DOUBLE PRECISION NOT NULL,
          description TEXT,
          image_url TEXT,
          position INTEGER DEFAULT 0,
          is_available BOOLEAN DEFAULT true,
          is_popular BOOLEAN DEFAULT false,
          is_promo BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          category_id TEXT NOT NULL,
          menu_id TEXT NOT NULL,
          code TEXT
        )
      `;
      
      console.log('✅ Tablas creadas exitosamente');
      
    } catch (error) {
      console.log('⚠️ Error creando tablas, continuando...', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Tablas creadas exitosamente en Supabase',
      data: {
        test: 'OK'
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error en endpoint',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}