import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { restaurantId } = params;

    console.log(`🔍 Buscando usuario para restaurantId: ${restaurantId}`);

    // Buscar el usuario por restaurantId
    const user = await prisma.user.findUnique({
      where: { restaurantId },
      select: {
        id: true,
        name: true,
        restaurantName: true,
        uniqueId: true,
        email: true,
        phone: true,
        address: true
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    console.log(`✅ Usuario encontrado: ${user.restaurantName} (${user.uniqueId})`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        restaurantName: user.restaurantName,
        uniqueId: user.uniqueId,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener usuario'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
