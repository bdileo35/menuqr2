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

    // Normalizar acentos y caracteres especiales
    const normalizeString = (str: string) => {
      return str
        .normalize('NFD') // Descompone caracteres con acentos
        .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Elimina caracteres especiales excepto espacios
        .replace(/\s+/g, '-') // Reemplaza espacios con guiones
        .replace(/-+/g, '-') // Elimina guiones múltiples
        .replace(/^-|-$/g, ''); // Elimina guiones al inicio/final
    };
    
    // Generar nombre base más corto (máximo 25 caracteres)
    const sanitizedName = normalizeString(itemName || 'item').substring(0, 25);
    
    // Ruta del directorio: public/platos/{idUnico}
    const uploadDir = path.join(process.cwd(), 'public', 'platos', idUnico);
    
    // Crear directorio si no existe
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Verificar si ya existe un archivo con el mismo nombre base
    const { readdir } = await import('fs/promises');
    const existingFiles = await readdir(uploadDir).catch(() => []);
    const baseFileName = sanitizedName;
    const fileExtension = imageType === 'jpeg' ? 'jpg' : imageType;
    
    // Buscar archivo existente con el mismo nombre base
    let fileName = `${baseFileName}.${fileExtension}`;
    let filePath = path.join(uploadDir, fileName);
    
    // Si el archivo ya existe, agregar timestamp solo si es necesario
    if (existingFiles.some(f => f.startsWith(baseFileName) && f.endsWith(`.${fileExtension}`))) {
      // Archivo existe, usar timestamp para evitar sobrescribir
      const timestamp = Date.now();
      fileName = `${baseFileName}-${timestamp}.${fileExtension}`;
      filePath = path.join(uploadDir, fileName);
    }

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

