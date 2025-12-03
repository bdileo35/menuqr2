import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  
  try {
    console.log(`🔍 Cargando menú para ID único: ${idUnico}`);

    const menu = await prisma.menu.findFirst({
      where: { restaurantId: idUnico }
    });

    if (!menu) {
      return NextResponse.json({
        success: false,
        error: 'Menú no encontrado'
      }, { status: 404 });
    }

    console.log(`✅ Menú encontrado: ${menu.restaurantName}`);

    const categories = await prisma.category.findMany({
      where: { menuId: menu.id },
      orderBy: { position: 'asc' }
    });

    console.log(`📋 Categorías: ${categories.length}`);

    // ✅ CARGAR TODOS LOS ITEMS DE UNA VEZ (sin map async)
    const allItems = await prisma.menuItem.findMany({
      where: { 
        OR: [
          { categoryId: { in: categories.map(c => c.id) } },
          { menuId: menu.id, categoryId: null }
        ]
      },
      orderBy: { name: 'asc' }
    });

    console.log(`📦 Items totales: ${allItems.length}`);

    // ✅ FILTRAR EN MEMORIA (sin async)
    const categoriesWithItems = categories.map(cat => {
      const items = allItems
        .filter(item => item.categoryId === cat.id)
        .map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl || '',
          isAvailable: true
        }));

      console.log(`  └─ ${cat.name}: ${items.length} items`);

      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        position: cat.position,
        isActive: cat.isActive,
        items
      };
    });

    const itemsWithoutCategory = allItems
      .filter(item => item.categoryId === null)
      .map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl || '',
        isAvailable: true
      }));

    const formattedMenu = {
      id: menu.id,
      idUnico: menu.restaurantId,
      restaurantName: menu.restaurantName,
      contactPhone: menu.contactPhone || '',
      contactAddress: menu.contactAddress || '',
      contactEmail: menu.contactEmail || '',
      socialInstagram: menu.socialInstagram || '',
      socialFacebook: menu.socialFacebook || '',
      logoUrl: menu.logoUrl || '',
      logoPublicId: menu.logoPublicId || '',
      description: menu.description || '',
      primaryColor: menu.primaryColor || '#2563eb',
      categories: [
        ...categoriesWithItems,
        ...(itemsWithoutCategory.length > 0 ? [{
          id: '__SIN_CATEGORIA__',
          name: 'Sin categoría',
          description: 'Platos sin categoría asignada',
          position: 9999,
          isActive: false,
          items: itemsWithoutCategory
        }] : [])
      ]
    };

    console.log(`✅ Menú cargado: ${categoriesWithItems.length} categorías, ${allItems.length} items`);
    
    return NextResponse.json({
      success: true,
      menu: formattedMenu
    });

  } catch (error) {
    console.error(`❌ Error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Error desconocido') : undefined
    }, { status: 500 });
  }
}