import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los items de un menú
export async function GET(request: NextRequest) {
  try {
    const menu = await prisma.menu.findFirst({
      where: { restaurantId: '5XJ1J37F' },
      include: {
        categories: {
          include: {
            items: true
          }
        }
      }
    });

    if (!menu) {
      return NextResponse.json({ success: false, error: 'Menú no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      menu: {
        restaurantName: menu.restaurantName,
        categories: menu.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          items: cat.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            isAvailable: item.isAvailable,
            code: item.code
          }))
        }))
      }
    });
  } catch (error) {
    console.error('Error obteniendo items:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

// POST - Crear nuevo item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, description, categoryId, isAvailable, code, imageFileName } = body;

    // Obtener el menú primero
    const menu = await prisma.menu.findFirst({
      where: { restaurantId: '5XJ1J37F' }
    });

    if (!menu) {
      return NextResponse.json({ success: false, error: 'Menú no encontrado' }, { status: 404 });
    }

    // Crear el item
    const newItem = await prisma.menuItem.create({
      data: {
        name,
        price: parseFloat(price.toString().replace(/[^0-9.]/g, '')),
        description,
        menuId: menu.id,
        categoryId,
        isAvailable: isAvailable !== false,
        code,
        imageUrl: imageFileName ? `/platos/${imageFileName}` : null
      }
    });

    return NextResponse.json({ 
      success: true, 
      item: {
        id: newItem.id,
        name: newItem.name,
        price: newItem.price,
        description: newItem.description,
        isAvailable: newItem.isAvailable,
        code: newItem.code
      }
    });
  } catch (error) {
    console.error('Error creando item:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

// PUT - Actualizar item existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, name, price, description, isAvailable, code, imageFileName, categoryId } = body;

    // Actualizar el item
    const updateData: any = {
      name,
      price: parseFloat(price.toString().replace(/[^0-9.]/g, '')),
      description,
      isAvailable: isAvailable !== false,
      code,
      imageUrl: imageFileName ? `/platos/${imageFileName}` : undefined
    };

    // Si se proporciona categoryId, actualizar la categoría
    if (categoryId) {
      updateData.categoryId = categoryId;
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      item: {
        id: updatedItem.id,
        name: updatedItem.name,
        price: updatedItem.price,
        description: updatedItem.description,
        isAvailable: updatedItem.isAvailable,
        code: updatedItem.code
      }
    });
  } catch (error) {
    console.error('Error actualizando item:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Eliminar item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ success: false, error: 'ID de item requerido' }, { status: 400 });
    }

    await prisma.menuItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando item:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
