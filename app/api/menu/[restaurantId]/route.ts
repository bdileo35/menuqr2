import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;

    // Buscar el menú con todas sus relaciones
    const menu = await prisma.menu.findFirst({
      where: {
        restaurantId: restaurantId
      },
      include: {
        categories: {
          where: {
            isActive: true
          },
          orderBy: {
            position: 'asc'
          },
          include: {
            items: {
              where: {
                isAvailable: true
              },
              orderBy: {
                position: 'asc'
              }
            }
          }
        },
        owner: {
          select: {
            name: true,
            phone: true,
            address: true
          }
        }
      }
    });

    if (!menu) {
      return NextResponse.json(
        { error: 'Menú no encontrado' },
        { status: 404 }
      );
    }

    // Formatear respuesta para el frontend
    const formattedMenu = {
      id: menu.id,
      restaurantName: menu.restaurantName,
      restaurantId: menu.restaurantId,
      description: menu.description,
      logoUrl: menu.logoUrl,
      
      // Info de contacto
      contactPhone: menu.contactPhone,
      contactAddress: menu.contactAddress,
      contactEmail: menu.contactEmail,
      socialInstagram: menu.socialInstagram,
      
      // Configuración de delivery (valores por defecto hasta que se agreguen al schema)
      deliveryEnabled: false,
      deliveryFee: 0,
      deliveryMinOrder: 0,
      
      // Owner info
      owner: menu.owner,
      
      // Categorías con items
      categories: menu.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        position: cat.position,
        items: cat.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          isPopular: item.isPopular,
          isPromo: item.isPromo,
          isAvailable: item.isAvailable
        }))
      }))
    };

    return NextResponse.json({
      success: true,
      menu: formattedMenu
    });

  } catch (error) {
    console.error('Error obteniendo menú:', error);
    return NextResponse.json(
      { error: 'Error al obtener el menú' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
