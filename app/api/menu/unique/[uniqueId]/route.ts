import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { uniqueId: string } }
) {
  try {
    const { uniqueId } = params;

    console.log(`🔍 Buscando menú para uniqueId: ${uniqueId}`);

    // Buscar el usuario por uniqueId
    const user = await prisma.user.findUnique({
      where: { uniqueId },
      include: {
        menus: {
          include: {
            categories: {
              where: { isActive: true },
              include: {
                items: {
                  where: { isActive: true },
                  orderBy: { position: 'asc' }
                }
              },
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Restaurante no encontrado'
      }, { status: 404 });
    }

    const menu = user.menus[0]; // Tomar el primer menú

    if (!menu) {
      return NextResponse.json({
        success: false,
        error: 'Menú no encontrado'
      }, { status: 404 });
    }

    // Formatear los datos como espera el frontend
    const formattedMenu = {
      id: menu.id,
      restaurantId: menu.restaurantId,
      restaurantName: menu.restaurantName,
      contactAddress: menu.contactAddress,
      contactPhone: menu.contactPhone,
      categories: menu.categories.map(category => ({
        id: category.id,
        name: category.name,
        items: category.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          isAvailable: item.isAvailable,
          isPromo: item.isPromo,
          imageUrl: item.imageUrl
        }))
      }))
    };

    console.log(`✅ Menú encontrado: ${formattedMenu.restaurantName} con ${formattedMenu.categories.length} categorías`);

    return NextResponse.json({
      success: true,
      menu: formattedMenu
    });

  } catch (error) {
    console.error('❌ Error al obtener menú por uniqueId:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener menú'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
