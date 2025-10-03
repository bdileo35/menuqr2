import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los items de un menú
export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;

    const menu = await prisma.menu.findFirst({
      where: { restaurantId },
      include: {
        categories: {
          include: {
            items: {
              orderBy: { position: 'asc' }
            }
          },
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

    return NextResponse.json({
      success: true,
      menu
    });

  } catch (error) {
    console.error('Error obteniendo items:', error);
    return NextResponse.json(
      { error: 'Error al obtener items' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Crear nuevo item
export async function POST(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;
    const body = await request.json();
    
    const { name, price, description, categoryId } = body;

    // Validar campos requeridos
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, price, categoryId' },
        { status: 400 }
      );
    }

    // Buscar el menú
    const menu = await prisma.menu.findFirst({
      where: { restaurantId }
    });

    if (!menu) {
      return NextResponse.json(
        { error: 'Menú no encontrado' },
        { status: 404 }
      );
    }

    // Obtener la posición más alta actual
    const lastItem = await prisma.menuItem.findFirst({
      where: { categoryId },
      orderBy: { position: 'desc' }
    });

    const newPosition = (lastItem?.position || 0) + 1;

    // Crear el item
    const newItem = await prisma.menuItem.create({
      data: {
        name,
        price: parseFloat(price.toString().replace(/[^0-9.]/g, '')),
        description: description || null,
        menuId: menu.id,
        categoryId,
        position: newPosition,
        isAvailable: true
      }
    });

    return NextResponse.json({
      success: true,
      item: newItem,
      message: 'Producto creado exitosamente'
    });

  } catch (error) {
    console.error('Error creando item:', error);
    return NextResponse.json(
      { error: 'Error al crear item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Actualizar item existente
export async function PUT(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const body = await request.json();
    const { itemId, name, price, description } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId es requerido' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        ...(name && { name }),
        ...(price && { price: parseFloat(price.toString().replace(/[^0-9.]/g, '')) }),
        ...(description !== undefined && { description })
      }
    });

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: 'Producto actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando item:', error);
    return NextResponse.json(
      { error: 'Error al actualizar item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Eliminar item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId es requerido' },
        { status: 400 }
      );
    }

    await prisma.menuItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando item:', error);
    return NextResponse.json(
      { error: 'Error al eliminar item' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
