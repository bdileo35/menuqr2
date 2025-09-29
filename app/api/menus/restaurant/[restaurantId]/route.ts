import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'ID de restaurante requerido' },
        { status: 400 }
      );
    }

    // Buscar el menú por restaurantId (ruta pública)
    const menu = await prisma.menu.findFirst({
      where: {
        restaurantId,
        isActive: true
      },
      include: {
        owner: {
          select: {
            name: true,
            restaurantName: true
          }
        },
        categories: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          include: {
            items: {
              where: { isAvailable: true },
              orderBy: { position: 'asc' }
            }
          }
        },
        items: {
          where: { isAvailable: true },
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!menu) {
      return NextResponse.json(
        { error: 'Menú no encontrado' },
        { status: 404 }
      );
    }

    // Organizar items por categoría para la respuesta
    const menuWithItems = {
      ...menu,
      categoriesWithItems: menu.categories.map(category => ({
        ...category,
        items: category.items
      }))
    };

    return NextResponse.json({
      success: true,
      menu: menuWithItems
    });

  } catch (error) {
    console.error('Error obteniendo menú por restaurantId:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}