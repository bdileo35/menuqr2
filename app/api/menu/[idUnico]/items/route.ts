import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST - Crear nuevo item
export async function POST(
  request: NextRequest,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  try {
    const body = await request.json();
    const { name, description, price, code, categoryId, imageUrl, isAvailable, isPopular, isPromo } = body;

    // Validaciones
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }
    if (!price || isNaN(parseFloat(price))) {
      return NextResponse.json({ error: 'El precio es obligatorio y debe ser un número' }, { status: 400 });
    }
    // Buscar menú
    const menu = await prisma.menu.findFirst({
      where: { restaurantId: idUnico }
    });

    if (!menu) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }

    // Si tiene categoryId, validar que existe
    let category = null;
    let nextPosition = 0;
    let itemCode = code?.trim() || '';

    if (categoryId) {
      category = await prisma.category.findFirst({
        where: { 
          id: categoryId, 
          menuId: menu.id,
          isActive: true 
        }
      });

      if (!category) {
        return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
      }

      // Obtener posición siguiente en la categoría
      const existingItems = await prisma.menuItem.findMany({
        where: { categoryId: category.id },
        orderBy: { position: 'desc' },
        take: 1
      });
      nextPosition = existingItems.length > 0 ? (existingItems[0].position || 0) + 1 : 0;

      // Generar código si no viene
      if (!itemCode) {
        const categoryCode = category.code || '01';
        const itemCount = existingItems.length;
        itemCode = `${categoryCode}${String(itemCount + 1).padStart(2, '0')}`;
      }
    } else {
      // Sin categoría - obtener posición siguiente de items sin categoría
      const existingItems = await prisma.menuItem.findMany({
        where: { 
          menuId: menu.id,
          categoryId: null
        },
        orderBy: { position: 'desc' },
        take: 1
      });
      nextPosition = existingItems.length > 0 ? (existingItems[0].position || 0) + 1 : 0;

      // Generar código genérico si no viene
      if (!itemCode) {
        itemCode = `9999${String(nextPosition + 1).padStart(2, '0')}`;
      }
    }

    // Convertir precio a número
    const priceNumber = parseFloat(price.toString().replace(/[$,\s]/g, ''));

    // Crear item
    const newItem = await prisma.menuItem.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: priceNumber,
        code: itemCode,
        position: nextPosition,
        categoryId: category?.id || null, // Permite null para items sin categoría
        menuId: menu.id,
        imageUrl: imageUrl || null,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        isPopular: isPopular || false,
        isPromo: isPromo || false
      }
    });

    return NextResponse.json({
      success: true,
      item: {
        id: newItem.id,
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        code: newItem.code,
        imageUrl: newItem.imageUrl,
        isAvailable: newItem.isAvailable,
        isPopular: newItem.isPopular,
        isPromo: newItem.isPromo
      }
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creando item:', error);
    return NextResponse.json({ error: 'Error al crear item' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Actualizar item existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, price, code, categoryId, imageUrl, isAvailable, isPopular, isPromo } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de item es obligatorio' }, { status: 400 });
    }
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    // Buscar item actual
    const currentItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!currentItem) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
    }

    // Si cambió de categoría, actualizar posición
    let updateData: any = {
      name: name.trim(),
      description: description?.trim() || null,
      imageUrl: imageUrl || null,
      isAvailable: isAvailable !== undefined ? isAvailable : currentItem.isAvailable,
      isPopular: isPopular !== undefined ? isPopular : currentItem.isPopular,
      isPromo: isPromo !== undefined ? isPromo : currentItem.isPromo
    };

    // Actualizar precio si viene
    if (price !== undefined) {
      const priceNumber = parseFloat(price.toString().replace(/[$,\s]/g, ''));
      if (!isNaN(priceNumber)) {
        updateData.price = priceNumber;
      }
    }

    // Actualizar código si viene
    if (code && code.trim()) {
      updateData.code = code.trim();
    }

    // Si cambió de categoría (o se quitó la categoría)
    // Comparar considerando null y undefined como equivalentes
    const currentCategoryId = currentItem.categoryId || null;
    const newCategoryId = (categoryId && categoryId !== '' && categoryId !== 'null') ? categoryId : null;
    
    if (newCategoryId !== currentCategoryId) {
      if (newCategoryId) {
        // Mover a otra categoría
        const newCategory = await prisma.category.findUnique({
          where: { id: newCategoryId }
        });
        if (!newCategory) {
          return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
        }

        // Obtener nueva posición en la categoría destino
        const existingItems = await prisma.menuItem.findMany({
          where: { categoryId: newCategoryId },
          orderBy: { position: 'desc' },
          take: 1
        });
        const nextPosition = existingItems.length > 0 ? (existingItems[0].position || 0) + 1 : 0;

        updateData.categoryId = newCategoryId;
        updateData.position = nextPosition;
      } else {
        // Mover a "Sin categoría" (categoryId = null)
        const itemsWithoutCategory = await prisma.menuItem.findMany({
          where: { 
            menuId: currentItem.menuId,
            categoryId: null
          },
          orderBy: { position: 'desc' },
          take: 1
        });
        const newPosition = itemsWithoutCategory.length > 0 ? (itemsWithoutCategory[0].position || 0) + 1 : 0;
        updateData.categoryId = null;
        updateData.position = newPosition;
      }
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      item: {
        id: updatedItem.id,
        name: updatedItem.name,
        description: updatedItem.description,
        price: updatedItem.price,
        code: updatedItem.code,
        imageUrl: updatedItem.imageUrl,
        isAvailable: updatedItem.isAvailable,
        isPopular: updatedItem.isPopular,
        isPromo: updatedItem.isPromo
      }
    });
  } catch (error) {
    console.error('❌ Error actualizando item:', error);
    return NextResponse.json({ error: 'Error al actualizar item' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Eliminar item (soft delete: isAvailable = false)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de item es obligatorio' }, { status: 400 });
    }

    const item = await prisma.menuItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
    }

    // Soft delete: marcar como no disponible
    await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false }
    });

    return NextResponse.json({ success: true, message: 'Item eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error eliminando item:', error);
    return NextResponse.json({ error: 'Error al eliminar item' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

