import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Contar total de menús
    const totalMenus = await prisma.menu.count();
    
    // Contar total de categorías
    const totalCategories = await prisma.category.count({
      where: { isActive: true }
    });
    
    // Contar total de items
    const totalItems = await prisma.menuItem.count({
      where: { isAvailable: true }
    });
    
    // Obtener menús con sus categorías e items
    const menus = await prisma.menu.findMany({
      select: {
        id: true,
        restaurantId: true,
        restaurantName: true,
        categories: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            code: true,
            items: {
              where: { isAvailable: true },
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      }
    });
    
    // Formatear respuesta
    const menusFormatted = menus.map(menu => ({
      idUnico: menu.restaurantId,
      nombre: menu.restaurantName,
      categorias: menu.categories.length,
      items: menu.categories.reduce((acc, cat) => acc + cat.items.length, 0),
      detalle: menu.categories.map(cat => ({
        categoria: cat.name,
        codigo: cat.code,
        items: cat.items.length,
        itemsList: cat.items.map(item => ({ nombre: item.name, codigo: item.code }))
      }))
    }));
    
    return NextResponse.json({
      success: true,
      resumen: {
        totalMenus,
        totalCategories,
        totalItems,
        formato: `${totalCategories}/${totalItems}`
      },
      menus: menusFormatted
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener estadísticas',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.warn('Error al desconectar Prisma:', disconnectError);
    }
  }
}

