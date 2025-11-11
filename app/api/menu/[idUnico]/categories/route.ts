import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Obtener categorías por idUnico
export async function GET(
  request: NextRequest,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  try {
    const menu = await prisma.menu.findFirst({
      where: { restaurantId: idUnico },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
          include: { items: true }
        }
      }
    });

    if (!menu) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      categories: menu.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        code: cat.code,
        position: cat.position,
        itemCount: cat.items.length
      }))
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Crear nueva categoría
export async function POST(
  request: NextRequest,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const menu = await prisma.menu.findFirst({
      where: { restaurantId: idUnico },
      include: { categories: { where: { isActive: true }, orderBy: { position: 'asc' } } }
    });

    if (!menu) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }

    const categoryCode = generateCategoryCode(name.trim(), menu.categories.length);
    const nextPosition = menu.categories.length > 0
      ? Math.max(...menu.categories.map(c => c.position || 0)) + 1
      : 0;

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        code: categoryCode,
        position: nextPosition,
        isActive: true,
        menuId: menu.id
      }
    });

    return NextResponse.json({
      success: true,
      category: {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        code: newCategory.code,
        position: newCategory.position
      }
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creando categoría:', error);
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Actualizar categoría existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de categoría es obligatorio' }, { status: 400 });
    }
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null
      }
    });

    return NextResponse.json({
      success: true,
      category: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
        code: updatedCategory.code,
        position: updatedCategory.position
      }
    });
  } catch (error) {
    console.error('❌ Error actualizando categoría:', error);
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Eliminar categoría (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de categoría es obligatorio' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id }, include: { items: true } });
    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }
    if (category.items.length > 0) {
      return NextResponse.json({
        error: 'No se puede eliminar una categoría con platos. Elimina primero los platos.'
      }, { status: 400 });
    }

    await prisma.category.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error eliminando categoría:', error);
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function generateCategoryCode(categoryName: string, currentCount: number): string {
  const fixedCategories = [
    { name: 'Platos del Día', code: '01' },
    { name: 'Promociones', code: '02' },
    { name: 'Cocina', code: '03' },
    { name: 'Parrilla', code: '04' }
  ];
  const fixedCategory = fixedCategories.find(cat =>
    categoryName.toLowerCase().includes(cat.name.toLowerCase())
  );
  if (fixedCategory) return fixedCategory.code;
  return String(currentCount + 5).padStart(2, '0');
}






