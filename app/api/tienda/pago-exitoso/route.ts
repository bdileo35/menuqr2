import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Marcar como dinámico porque usa request.url
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idUnico = searchParams.get('idUnico');
    const plan = searchParams.get('plan');
    const monto = searchParams.get('monto');

    if (!idUnico) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/comprar?error=id_no_encontrado`);
    }

    // Buscar usuario
    let user = await prisma.user.findFirst({
      where: { restaurantId: idUnico }
    });

    // Si el plan es PRO, activar hasPro
    if (plan === 'pro' || plan === 'PRO') {
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { hasPro: true, plan: 'pro' }
        });
        console.log(`✅ PRO activado para: ${user.restaurantName} (${idUnico})`);
      } else {
        // Crear usuario con PRO
        user = await prisma.user.create({
          data: {
            name: 'Usuario Demo',
            email: `demo-${idUnico}@menuqr.com`,
            password: 'demo123',
            restaurantId: idUnico,
            restaurantName: 'Restaurante Demo',
            role: 'ADMIN',
            hasPro: true,
            plan: 'pro'
          }
        });
      }
    }

    // Buscar o crear el menú con el ID único
    let menu = await prisma.menu.findFirst({
      where: { restaurantId: idUnico }
    });

    if (!menu) {
      if (!user) {
        // Crear usuario básico
        user = await prisma.user.create({
          data: {
            name: 'Usuario Demo',
            email: `demo-${idUnico}@menuqr.com`,
            password: 'demo123',
            restaurantId: idUnico,
            restaurantName: 'Restaurante Demo',
            role: 'ADMIN'
          }
        });
      }

      // Crear menú
      menu = await prisma.menu.create({
        data: {
          restaurantId: idUnico,
          restaurantName: user.restaurantName,
          ownerId: user.id
        }
      });
    }

    // Redirigir al editor con el ID único
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/editor?success=true&idUnico=${idUnico}&plan=${plan}`);

  } catch (error) {
    console.error('Error procesando pago exitoso:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/comprar?error=error_procesando_pago`);
  }
}
