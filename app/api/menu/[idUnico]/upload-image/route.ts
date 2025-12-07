import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  
  try {
    const body = await request.json();
    const { imageBase64, itemName } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Imagen base64 es requerida' },
        { status: 400 }
      );
    }

    // Validar que es base64 de imagen
    const base64Match = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      return NextResponse.json(
        { error: 'Formato de imagen inválido. Debe ser base64.' },
        { status: 400 }
      );
    }

    const imageType = base64Match[1]; // jpeg, png, etc.
    const base64Data = base64Match[2];

    // Generar nombre de archivo único
    const timestamp = Date.now();
    const sanitizedName = (itemName || 'item')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 30);
    const fileName = `${sanitizedName}-${timestamp}.${imageType === 'jpeg' ? 'jpg' : imageType}`;

    // Ruta del directorio: public/platos/{idUnico}
    const uploadDir = path.join(process.cwd(), 'public', 'platos', idUnico);
    
    // Crear directorio si no existe
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Ruta completa del archivo
    const filePath = path.join(uploadDir, fileName);

    // Convertir base64 a buffer y guardar
    const imageBuffer = Buffer.from(base64Data, 'base64');
    await writeFile(filePath, imageBuffer);

    // URL relativa para usar en el frontend
    const imageUrl = `/platos/${idUnico}/${fileName}`;

    console.log(`✅ Imagen guardada: ${imageUrl}`);

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
    });
  } catch (error: any) {
    console.error('❌ Error subiendo imagen:', error);
    return NextResponse.json(
      {
        error: 'Error al subir imagen',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

