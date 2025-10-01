import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar MercadoPago (mismo token que QRing por ahora)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'menuqr'
  }
});

const preference = new Preference(client);

// Precios de productos MenuQR
const PRECIOS = {
  'menuqr-basic': 1999,     // $19.99 mensual
  'menuqr-pro': 2999,       // $29.99 mensual  
  'menuqr-premium': 4999,   // $49.99 mensual
  'qring-basic': 2999,      // $29.99 mensual
  'qrcard-basic': 999       // $9.99 mensual
};

export async function POST(request: NextRequest) {
  try {
    const { productId, plan = 'monthly', userEmail } = await request.json();

    // Validar datos
    if (!productId || !PRECIOS[productId as keyof typeof PRECIOS]) {
      return NextResponse.json(
        { error: 'Producto no válido' },
        { status: 400 }
      );
    }

    const precio = PRECIOS[productId as keyof typeof PRECIOS];
    const idUnico = `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('🛒 CREANDO PREFERENCIA MP - MenuQR:', {
      productId,
      precio,
      plan,
      userEmail,
      idUnico,
      timestamp: new Date().toISOString()
    });

    // Nombres de productos para MercadoPago
    const productNames: Record<string, string> = {
      'menuqr-basic': 'MenuQR Básico - Cartas Digitales',
      'menuqr-pro': 'MenuQR Pro - Cartas + OCR + Analytics', 
      'menuqr-premium': 'MenuQR Premium - Suite Completa',
      'qring-basic': 'QRing - Timbres Inteligentes',
      'qrcard-basic': 'QRCard - Tarjetas Digitales'
    };

    // Crear preferencia de MercadoPago
    const preferenceData = {
      items: [
        {
          id: productId,
          title: productNames[productId],
          quantity: 1,
          unit_price: precio,
          currency_id: 'ARS'
        }
      ],
      external_reference: idUnico,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/shop/webhook`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/qr-shop/exito?ref=${idUnico}&product=${productId}&precio=${precio}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/qr-shop?error=payment_failed`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/qr-shop?status=pending`
      },
      payer: {
        email: userEmail || 'cliente@menuqr.com'
      }
    };

    const result = await preference.create({ body: preferenceData });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      productId,
      precio,
      idUnico,
      message: 'Preferencia MenuQR creada exitosamente'
    });

  } catch (error) {
    console.error('❌ ERROR CREANDO PREFERENCIA MenuQR:', error);
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 }
    );
  }
}