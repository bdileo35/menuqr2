import { NextRequest, NextResponse } from 'next/server';
import { parseMarkdownToSupabase } from '../../scripts/parse-md-to-supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Iniciando seed de datos reales para Esquina Pompeya...');

    // Usar el parser del MD
    const result = await parseMarkdownToSupabase();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Datos reales de Esquina Pompeya creados exitosamente',
        data: result.data
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error creando datos reales',
          details: result.error
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error en seed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error creando datos reales',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
