import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  
  try {
    console.log(`🔍 Cargando menú para ID único: ${idUnico}`);

    const menu = await prisma.menu.findFirst({
      where: {
        idUnico: idUnico
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

    // Formatear respuesta
    const formattedMenu = {
      id: menu.id,
      idUnico: menu.idUnico,
      restaurantName: menu.restaurantName,
      contactPhone: menu.contactPhone,
      contactAddress: menu.contactAddress,
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
