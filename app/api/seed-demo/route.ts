import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de datos reales para Esquina Pompeya...');
    console.log('🔍 Verificando que el endpoint se ejecuta correctamente...');

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
      
      // Verificar si las tablas existen
      const tableCheck = await prisma.$queryRaw`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name IN ('users', 'menus', 'categories', 'menu_items')
      `;
      console.log('📋 Tablas existentes:', tableCheck);
      
      // Limpiar datos existentes (usando nombres de tabla correctos)
      try {
        await prisma.$executeRaw`DELETE FROM menu_items`;
        await prisma.$executeRaw`DELETE FROM categories`;
        await prisma.$executeRaw`DELETE FROM menus`;
        await prisma.$executeRaw`DELETE FROM users`;
        console.log('🧹 Datos limpiados');
      } catch (cleanError) {
        console.log('⚠️ Error limpiando datos (normal si las tablas están vacías):', cleanError);
      }
      
    } catch (error) {
      console.log('⚠️ Error creando tablas, continuando...', error);
    }

    // Crear usuario usando SQL directo
    console.log('👤 Creando usuario...');
    const userId = 'user_' + Date.now();
    await prisma.$executeRaw`
      INSERT INTO users (id, name, email, password, restaurant_id, restaurant_name, phone, address, role, is_active, created_at, updated_at)
      VALUES (${userId}, 'Esquina Pompeya', 'admin@esquinapompeya.com', 'esquina2024', 'esquina-pompeya', 'Esquina Pompeya', '+54 11 4911-6666', 'Av. Fernández de la Cruz 1100, Buenos Aires', 'ADMIN', true, NOW(), NOW())
    `;
    console.log(`✅ Usuario creado: admin@esquinapompeya.com`);

    // Crear menú usando SQL directo
    console.log('🍽️ Creando menú...');
    const menuId = 'menu_' + Date.now();
    await prisma.$executeRaw`
      INSERT INTO menus (id, restaurant_name, restaurant_id, description, contact_phone, contact_address, contact_email, social_instagram, owner_id, created_at, updated_at)
      VALUES (${menuId}, 'Esquina Pompeya', 'esquina-pompeya', 'Restaurante tradicional argentino', '+54 11 4911-6666', 'Av. Fernández de la Cruz 1100, Buenos Aires', 'info@esquinapompeya.com', '@esquinapompeya', ${userId}, NOW(), NOW())
    `;
    console.log(`✅ Menú creado: Esquina Pompeya`);

    // Crear categorías principales usando SQL directo
    console.log('📂 Creando categorías...');
    const categories = [
      { name: 'Platos del Día', code: '01', position: 1 },
      { name: 'Promos de la Semana', code: '02', position: 2 },
      { name: 'Cocina', code: '03', position: 3 },
      { name: 'Parrilla', code: '04', position: 4 },
      { name: 'Pescados y Mariscos', code: '05', position: 5 }
    ];

    const categoryIds = {};
    for (const catData of categories) {
      const categoryId = 'cat_' + catData.code;
      await prisma.$executeRaw`
        INSERT INTO categories (id, name, code, position, description, menu_id, is_active, created_at, updated_at)
        VALUES (${categoryId}, ${catData.name}, ${catData.code}, ${catData.position}, ${`Categoría de ${catData.name}`}, ${menuId}, true, NOW(), NOW())
      `;
      categoryIds[catData.code] = categoryId;
      console.log(`📂 Categoría creada: ${catData.name} (${catData.code})`);
    }

    // Crear algunos platos de ejemplo usando SQL directo
    console.log('🍽️ Creando platos...');
    const platos = [
      // Platos del Día
      { name: 'Riñoncitos al jerez c/ puré', price: 9000, code: '0101', categoryCode: '01' },
      { name: 'Croquetas de carne c/ ensalada', price: 9000, code: '0102', categoryCode: '01' },
      { name: 'Vacío a la parrilla c/ fritas', price: 14000, code: '0103', categoryCode: '01' },
      
      // Cocina
      { name: '1/4 Pollo al horno c/ papas', price: 9000, code: '0301', categoryCode: '03' },
      { name: 'Vacío al horno c/ papas', price: 14000, code: '0302', categoryCode: '03' },
      { name: 'Peceto al verdeo c/ puré', price: 15000, code: '0303', categoryCode: '03' },
      
      // Pescados y Mariscos
      { name: 'Filet de merluza a la romana c/ g.', price: 8000, code: '0501', categoryCode: '05' },
      { name: 'Gambas al ajillo c/ fritas a la española', price: 20000, code: '0502', categoryCode: '05' },
      { name: 'Rabas a la romana c/ f. españolas', price: 18000, code: '0503', categoryCode: '05' }
    ];

    for (const plato of platos) {
      const itemId = 'item_' + plato.code;
      await prisma.$executeRaw`
        INSERT INTO menu_items (id, name, price, code, description, category_id, menu_id, is_available, is_popular, is_promo, position, created_at, updated_at)
        VALUES (${itemId}, ${plato.name}, ${plato.price}, ${plato.code}, ${`Delicioso ${plato.name.toLowerCase()}`}, ${categoryIds[plato.categoryCode]}, ${menuId}, true, false, false, ${parseInt(plato.code.substring(2), 10)}, NOW(), NOW())
      `;
      console.log(`  - Plato creado: ${plato.name} (${plato.code})`);
    }

    console.log(`🚀 Datos de Esquina Pompeya poblados exitosamente con ${platos.length} platos.`);

    return NextResponse.json({
      success: true,
      message: 'Datos de Esquina Pompeya creados exitosamente en Supabase',
      data: {
        menuId: menuId,
        categoriesCount: categories.length,
        itemsCount: platos.length
      }
    });

  } catch (error) {
    console.error('❌ Error creando datos reales:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error creando datos reales',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}