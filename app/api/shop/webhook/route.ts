import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔔 WEBHOOK MP MENUQR RECIBIDO:', body);

    // Verificar que sea un pago aprobado
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id;
      
      console.log('✅ PAGO MENUQR APROBADO:', paymentId);
      
      // Aquí puedes hacer lógica adicional como:
      // - Crear usuario en MenuQR
      // - Activar plan
      // - Enviar email de bienvenida
      // - etc.
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ ERROR EN WEBHOOK MenuQR:', error);
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}