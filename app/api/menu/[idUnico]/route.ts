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
      where: {
        restaurantId: idUnico
      },
      include: {
        categories: {
          include: {
            items: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    if (!menu) {
      console.log(`⚠️ No se encontró menú para ID único: ${idUnico}`);
      return NextResponse.json({
        success: false,
        error: 'Menú no encontrado para el ID proporcionado'
      }, { status: 404 });
    }

    // Formatear respuesta - Manejar waiters de forma segura
    let waitersArray: string[] = ['Maria', 'Lucia', 'Carmen']; // Valores por defecto
    try {
      // Acceder a waiters de forma segura (puede no existir si la migración no se aplicó)
      const menuAny = menu as any;
      if (menuAny?.waiters) {
        if (typeof menuAny.waiters === 'string' && menuAny.waiters.trim()) {
          const parsed = JSON.parse(menuAny.waiters);
          if (Array.isArray(parsed) && parsed.length > 0) {
            waitersArray = parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Error parseando waiters, usando valores por defecto:', e);
      // Ya tiene valores por defecto
    }
    
    const formattedMenu = {
      id: menu.id,
      idUnico: menu.restaurantId,
      restaurantName: menu.restaurantName,
      allowOrdering: menu.allowOrdering,
      deliveryEnabled: menu.deliveryEnabled,
      contactPhone: menu.contactPhone,
      contactAddress: menu.contactAddress,
      waiters: waitersArray,
      categories: menu.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        position: cat.position,
        code: cat.code || '01',
        items: cat.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          isPopular: item.isPopular,
          isPromo: item.isPromo,
          isAvailable: item.isAvailable,
          code: item.code || '0101'
        }))
      }))
    };

    console.log(`✅ Menú cargado exitosamente para ID: ${idUnico}`);
    return NextResponse.json({
      success: true,
      menu: formattedMenu
    });

  } catch (error) {
    console.error(`❌ Error cargando menú para ID ${idUnico}:`, error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
