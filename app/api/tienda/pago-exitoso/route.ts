import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idUnico = searchParams.get('idUnico');
    const plan = searchParams.get('plan');
    const monto = searchParams.get('monto');

    if (!idUnico) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/comprar?error=id_no_encontrado`);
    }

    // Buscar o crear el menú con el ID único
    let menu = await prisma.menu.findFirst({
      where: { restaurantId: idUnico }
    });

    if (!menu) {
      // Crear un nuevo menú con el ID único
      const user = await prisma.user.findFirst({
        where: { restaurantId: idUnico }
      });

      if (!user) {
        // Crear usuario básico
        const newUser = await prisma.user.create({
          data: {
            name: 'Usuario Demo',
            email: `demo-${idUnico}@menuqr.com`,
            password: 'demo123',
            restaurantId: idUnico,
            restaurantName: 'Restaurante Demo',
            role: 'ADMIN'
          }
        });

        // Crear menú
        menu = await prisma.menu.create({
          data: {
            restaurantId: idUnico,
            restaurantName: 'Restaurante Demo',
            ownerId: newUser.id
          }
        });
      } else {
        // Crear menú para usuario existente
        menu = await prisma.menu.create({
          data: {
            restaurantId: idUnico,
            restaurantName: user.restaurantName,
            ownerId: user.id
          }
        });
      }
    }

    // Redirigir al editor con el ID único
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/editor?success=true&idUnico=${idUnico}&plan=${plan}`);

  } catch (error) {
    console.error('Error procesando pago exitoso:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/comprar?error=error_procesando_pago`);
  }
}
