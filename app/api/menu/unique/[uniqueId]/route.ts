import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener menú por ID único
export async function GET(
  request: NextRequest,
  { params }: { params: { uniqueId: string } }
) {
  try {
    const { uniqueId } = params;

    // Buscar menú por restaurantId (que será el uniqueId)
    const menu = await prisma.menu.findFirst({
      where: { restaurantId: uniqueId },
      include: {
        categories: {
          include: {
            items: {
              where: {
                isAvailable: true // Solo items disponibles
              }
            }
          }
        }
      }
    });

    if (!menu) {
      return NextResponse.json({ 
        success: false, 
        error: 'Menú no encontrado' 
      }, { status: 404 });
    }

    // Formatear respuesta
    const formattedMenu = {
      restaurantName: menu.restaurantName,
      categories: menu.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        code: cat.code,
        items: cat.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          isAvailable: item.isAvailable,
          code: item.code,
          imageUrl: item.imageUrl
        }))
      }))
    };

    return NextResponse.json({ 
      success: true, 
      menu: formattedMenu 
    });
  } catch (error) {
    console.error('Error obteniendo menú por ID único:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno' 
    }, { status: 500 });
  }
}
