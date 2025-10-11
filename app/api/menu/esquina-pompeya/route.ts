import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Buscando menú de Esquina Pompeya...');
    
    // Verificar si las tablas existen
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('menus', 'categories', 'menu_items')
    `;
    console.log('📋 Tablas existentes:', tableCheck);
    
    // Buscar el menú de Esquina Pompeya usando SQL directo
    const menuResult = await prisma.$queryRaw`
      SELECT * FROM menus WHERE restaurant_id = 'esquina-pompeya' LIMIT 1
    `;
    console.log('📊 Resultado de búsqueda de menú:', menuResult);
    
    if (!menuResult || (menuResult as any[]).length === 0) {
      console.log('❌ Menú no encontrado');
      return NextResponse.json(
        { error: 'Menú no encontrado' },
        { status: 404 }
      );
    }

    const menu = (menuResult as any[])[0];

    // Buscar categorías del menú
    const categoriesResult = await prisma.$queryRaw`
      SELECT * FROM categories 
      WHERE menu_id = ${menu.id} AND is_active = true 
      ORDER BY position ASC
    `;
    
    const categories = categoriesResult as any[];

    // Buscar items de cada categoría
    const categoriesWithItems = await Promise.all(
      categories.map(async (category) => {
        const itemsResult = await prisma.$queryRaw`
          SELECT * FROM menu_items 
          WHERE category_id = ${category.id} 
          ORDER BY position ASC
        `;
        
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          position: category.position,
          items: (itemsResult as any[]).map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            imageUrl: item.image_url,
            isPopular: item.is_popular,
            isPromo: item.is_promo,
            isAvailable: item.is_available
          }))
        };
      })
    );

    // Formatear respuesta para el frontend
    const formattedMenu = {
      id: menu.id,
      restaurantName: menu.restaurant_name,
      restaurantId: menu.restaurant_id,
      description: menu.description,
      logoUrl: menu.logo_url,
      
      // Info de contacto
      contactPhone: menu.contact_phone,
      contactAddress: menu.contact_address,
      contactEmail: menu.contact_email,
      socialInstagram: menu.social_instagram,
      
      // Configuración de delivery (valores por defecto)
      deliveryEnabled: false,
      deliveryFee: 0,
      deliveryMinOrder: 0,
      
      // Owner info (simplificado)
      owner: {
        name: 'Esquina Pompeya',
        phone: menu.contact_phone,
        address: menu.contact_address
      },
      
      // Categorías con items
      categories: categoriesWithItems
    };

    return NextResponse.json({
      success: true,
      menu: formattedMenu
    });

  } catch (error) {
    console.error('Error obteniendo menú de Esquina Pompeya:', error);
    return NextResponse.json(
      { error: 'Error al obtener el menú' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
