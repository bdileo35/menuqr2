import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// API para autenticación del Panel
// Usuario: idUnico, Password: nombre del restaurante (ej: "esquina_pompeye")

export async function POST(request: NextRequest) {
  try {
    const { idUnico, password } = await request.json();

    if (!idUnico || !password) {
      return NextResponse.json(
        { success: false, error: 'ID único y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por restaurantId
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { restaurantId: idUnico },
        include: {
          menus: {
            take: 1
          }
        }
      });
    } catch (dbError: any) {
      console.error('❌ Error consultando BD:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error de conexión a la base de datos',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: `ID único "${idUnico}" no encontrado en la base de datos`,
          hint: 'Asegúrate de que el usuario existe. Puedes cargar datos demo con: POST /api/seed-demo'
        },
        { status: 404 }
      );
    }

    // Verificar password: acepta "1234" o el nombre del restaurante en minúsculas sin espacios
    const expectedPassword = user.restaurantName.toLowerCase().replace(/\s+/g, '_');
    const providedPassword = password.toLowerCase().trim();

    // Aceptar "1234" como contraseña por defecto, o el nombre del restaurante, o la contraseña guardada
    if (providedPassword !== '1234' && 
        providedPassword !== expectedPassword && 
        providedPassword !== user.password) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Autenticación exitosa
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error: any) {
    console.error('❌ Error en autenticación:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al autenticar',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignorar errores de desconexión
    }
  }
}

