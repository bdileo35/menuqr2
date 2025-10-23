import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, precio, descripcion, cantidadTimbres, idUnico } = body;

    console.log('🔔 Creando preferencia de pago:', { plan, precio, descripcion, cantidadTimbres, idUnico });

    // 🔧 TEMPORAL: Simular respuesta de Mercado Pago
    // En producción, aquí iría la integración real con MP
    const mockPreference = {
      id: `pref_${Date.now()}`,
      init_point: `/tienda/exito?plan=${plan}&precio=${precio}&idUnico=${idUnico || 'DEMO_ID'}&descripcion=${encodeURIComponent(descripcion)}`,
      // En producción sería: data.init_point (URL real de MP)
    };

    console.log('✅ Preferencia simulada creada:', mockPreference);

    return NextResponse.json({
      success: true,
      preference: mockPreference,
      init_point: mockPreference.init_point
    });

  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}