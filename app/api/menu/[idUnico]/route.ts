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
        owner: {
          select: {
            whatsappPhone: true
          }
        },
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
    
    // Obtener items sin categoría
    const itemsWithoutCategory = await prisma.menuItem.findMany({
      where: {
        menuId: menu.id,
        categoryId: null
      },
      orderBy: {
        position: 'asc'
      }
    });

    const formattedMenu = {
      id: menu.id,
      idUnico: menu.restaurantId,
      restaurantName: menu.restaurantName,
      allowOrdering: menu.allowOrdering,
      deliveryEnabled: menu.deliveryEnabled,
      contactPhone: menu.contactPhone,
      contactAddress: menu.contactAddress,
      contactEmail: menu.contactEmail,
      socialInstagram: menu.socialInstagram,
      socialFacebook: menu.socialFacebook,
      logoUrl: menu.logoUrl,
      description: menu.description,
      whatsappPhone: menu.owner?.whatsappPhone || null,
      waiters: waitersArray,
      categories: [
        ...menu.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          position: cat.position,
          code: cat.code || '01',
          items: cat.items
            .filter(item => item.categoryId !== null) // Solo items con categoría
            .map(item => ({
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
        })),
        // Agregar categoría especial "Sin categoría" al final (solo si hay items)
        ...(itemsWithoutCategory.length > 0 ? [{
          id: '__SIN_CATEGORIA__',
          name: 'Sin categoría (No se muestran en CARTA)',
          description: 'Platos discontinuados temporalmente',
          position: 9999, // Al final
          code: '99',
          items: itemsWithoutCategory.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            imageUrl: item.imageUrl,
            isPopular: item.isPopular,
            isPromo: item.isPromo,
            isAvailable: item.isAvailable,
            code: item.code || '9999'
          }))
        }] : [])
      ]
    };

    console.log(`✅ Menú cargado exitosamente para ID: ${idUnico}`);
    return NextResponse.json({
      success: true,
      menu: formattedMenu
    });

  } catch (error) {
    console.error(`❌ Error cargando menú para ID ${idUnico}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Detalles del error:', { errorMessage, errorStack });
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.warn('Error al desconectar Prisma:', disconnectError);
    }
  }
}
