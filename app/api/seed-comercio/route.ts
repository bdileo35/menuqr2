import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { generarIDUUnico } from '@/lib/shared/idu-generator';
import { Role } from '@prisma/client';

interface ComercioData {
  nombreArchivo: string; // ej: "Menu_los_toritos.md"
  nombreComercio: string;
  email: string;
  telefono: string;
  direccion: string;
  instagram?: string;
  facebook?: string;
  descripcion?: string;
  horario?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ComercioData = await request.json();
    const {
      nombreArchivo,
      nombreComercio,
      email,
      telefono,
      direccion,
      instagram,
      facebook,
      descripcion,
      horario
    } = body;

    // Validaciones básicas
    if (!nombreArchivo || !nombreComercio || !email || !telefono || !direccion) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Faltan campos requeridos: nombreArchivo, nombreComercio, email, telefono, direccion' 
        },
        { status: 400 }
      );
    }

    console.log(`📄 Creando comercio: ${nombreComercio} desde ${nombreArchivo}...`);

    // Leer el archivo MD
    const mdPath = path.join(process.cwd(), 'Docs', nombreArchivo);
    
    if (!fs.existsSync(mdPath)) {
      return NextResponse.json(
        { success: false, error: `Archivo no encontrado: ${nombreArchivo}` },
        { status: 404 }
      );
    }

    const mdContent = fs.readFileSync(mdPath, 'utf-8');

    // Generar ID único garantizado
    console.log('🔑 Generando ID único...');
    const restaurantId = await generarIDUUnico(async (id) => {
      const existe = await prisma.user.findUnique({
        where: { restaurantId: id }
      });
      return existe !== null;
    });
    console.log(`✅ ID único generado: ${restaurantId}`);

    // Verificar si el email ya existe
    const userExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (userExistente) {
      return NextResponse.json(
        { success: false, error: `El email ${email} ya está registrado` },
        { status: 400 }
      );
    }

    // Crear usuario
    console.log('👤 Creando usuario...');
    const user = await prisma.user.create({
      data: {
        email,
        password: 'temp_password_' + Date.now(), // Password temporal
        name: nombreComercio,
        restaurantId,
        restaurantName: nombreComercio,
        phone: telefono,
        address: direccion,
        plan: 'pro',
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Usuario creado: ${user.email}`);

    // Crear menú
    console.log('📋 Creando menú...');
    const menu = await prisma.menu.create({
      data: {
        restaurantId,
        restaurantName: nombreComercio,
        description: descripcion || `Menú de ${nombreComercio}`,
        ownerId: user.id,
        allowOrdering: true,
        deliveryEnabled: true,
        contactPhone: telefono,
        contactAddress: direccion,
        socialInstagram: instagram,
        socialFacebook: facebook,
      },
    });
    console.log(`✅ Menú creado: ${menu.restaurantName}`);

    // Parsear el MD
    console.log('📊 Parseando categorías y platos...');
    const lines = mdContent.split('\n').filter(line => line.trim() && !line.startsWith('|---'));
    
    const categoriesMap = new Map<string, { name: string; items: any[] }>();
    let currentCategory = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.startsWith('|')) continue;
      
      const parts = line.split('|').map(p => p.trim()).filter(p => p);
      if (parts.length < 3) continue;
      
      let codigo = '';
      let categoria = '';
      let plato = '';
      let precioStr = '';
      
      // Detectar formato de la línea
      if (parts.length >= 4) {
        // Formato completo: | Código | Categoría | Plato | Precio | Imagen? |
        if (parts[0].match(/^\d{4}$/)) {
          codigo = parts[0];
          categoria = parts[1];
          plato = parts[2];
          precioStr = parts[3];
        } else {
          // Formato corto: | Categoría | Plato | Precio |
          categoria = parts[0];
          plato = parts[1];
          precioStr = parts[2];
        }
      } else if (parts.length === 3) {
        // Formato corto: | Categoría | Plato | Precio |
        categoria = parts[0];
        plato = parts[1];
        precioStr = parts[2];
      }
      
      // Si hay categoría nueva, actualizarla
      if (categoria && categoria !== currentCategory) {
        currentCategory = categoria;
        if (!categoriesMap.has(currentCategory)) {
          categoriesMap.set(currentCategory, {
            name: currentCategory,
            items: []
          });
        }
      }
      
      // Agregar plato a la categoría actual
      if (plato && precioStr && currentCategory) {
        const precio = parseFloat(precioStr.replace(/[^\d]/g, '')) || 0;
        if (precio > 0) {
          categoriesMap.get(currentCategory)!.items.push({
            code: codigo || null,
            name: plato,
            price: precio
          });
        }
      }
    }

    console.log(`✅ Encontradas ${categoriesMap.size} categorías`);

    // Crear categorías e items
    let totalItems = 0;
    let position = 0;

    for (const [catName, catData] of Array.from(categoriesMap.entries())) {
      console.log(`📁 Creando categoría: ${catData.name} (${catData.items.length} items)`);
      
      const category = await prisma.category.create({
        data: {
          name: catData.name,
          code: null,
          position: position++,
          menuId: menu.id
        }
      });

      for (let idx = 0; idx < catData.items.length; idx++) {
        const item = catData.items[idx];
        await prisma.menuItem.create({
          data: {
            name: item.name,
            price: item.price,
            code: item.code,
            position: idx,
            isAvailable: true,
            menuId: menu.id,
            categoryId: category.id
          }
        });
        totalItems++;
      }
    }

    console.log(`🎉 Comercio creado exitosamente!`);
    console.log(`   - ID Único: ${restaurantId}`);
    console.log(`   - Categorías: ${categoriesMap.size}`);
    console.log(`   - Items: ${totalItems}`);

    return NextResponse.json({
      success: true,
      message: `Comercio ${nombreComercio} creado exitosamente`,
      data: {
        restaurantId,
        menuId: menu.id,
        userId: user.id,
        categoriesCount: categoriesMap.size,
        itemsCount: totalItems,
        url: `/carta/${restaurantId}`,
        editorUrl: `/editor/${restaurantId}`
      }
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

