import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 10000
  }
});

// Verificar que estamos en modo de pruebas
console.log('🔍 MP Config:', {
  token: process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20) + '...',
  isTest: process.env.MERCADOPAGO_ACCESS_TOKEN?.includes('TEST') || 
          process.env.MERCADOPAGO_ACCESS_TOKEN?.includes('APP_USR'),
  appUrl: process.env.NEXT_PUBLIC_APP_URL
});

const preference = new Preference(client);

// Función para generar ID único alfanumérico de 8 caracteres (como QRing)
function generateIdUnico(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { plan, precio, descripcion, idUnico } = await request.json();

    // Validar datos
    if (!plan || !precio) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Generar ID único si no se proporciona
    const finalIdUnico = idUnico || generateIdUnico();

    console.log('🔍 CREANDO PREFERENCIA MP REAL:', {
      plan,
      precio,
      finalIdUnico,
      timestamp: new Date().toISOString()
    });

    // Crear preferencia real de MercadoPago
    const preferenceData = {
      items: [
        {
          id: `menuqr-${plan}`,
          title: `MenuQR - Plan ${plan === 'mensual' ? 'Mensual' : 'Anual'}`,
          quantity: 1,
          unit_price: precio,
          currency_id: 'ARS'
        }
      ],
      external_reference: finalIdUnico,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tienda/webhook`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tienda/exito?idUnico=${finalIdUnico}&plan=${plan}&monto=${precio}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/comprar?error=payment_failed`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/comprar?status=pending`
      }
    };

    const result = await preference.create({ body: preferenceData });

    return NextResponse.json({
      preferenceId: result.id,
      init_point: result.init_point,
      simulation: false,
      message: 'Preferencia MP creada exitosamente',
      idUnico: finalIdUnico,
      montoTotal: precio,
      plan
    });

  } catch (error: any) {
    console.error('❌ ERROR CREANDO PREFERENCIA MP:', {
      message: error.message,
      details: error.message,
      status: error.status
    });
    
    return NextResponse.json(
      { 
        error: 'Error al crear preferencia de pago',
        details: error.message,
        status: error.status
      },
      { status: 500 }
    );
  }
}
