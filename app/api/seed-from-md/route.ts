import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('📄 Cargando datos desde Menu_Esquina_Pompeya.md...');

    // Leer el archivo MD
    const mdPath = path.join(process.cwd(), 'Docs', 'Menu_Esquina_Pompeya.md');
    const mdContent = fs.readFileSync(mdPath, 'utf-8');

    // Parsear el MD
    const lines = mdContent.split('\n').filter(line => line.trim() && !line.startsWith('|---'));
    
    // Buscar user/menu existente
    let user = await prisma.user.findFirst({
      where: { restaurantId: '5XJ1J37F' }
    });

    if (!user) {
      console.log('👤 Creando usuario Esquina Pompeya...');
      user = await prisma.user.create({
        data: {
          email: 'admin@esquinapompeya.com',
          password: 'temp_password',
          name: 'Esquina Pompeya',
          restaurantId: '5XJ1J37F',
          restaurantName: 'Esquina Pompeya',
          phone: '+54 11 4567-8900',
          plan: 'pro'
        }
      });
    }

    let menu = await prisma.menu.findFirst({
      where: { restaurantId: '5XJ1J37F' }
    });

    if (!menu) {
      console.log('📋 Creando menú...');
      menu = await prisma.menu.create({
        data: {
          restaurantId: '5XJ1J37F',
          restaurantName: 'Esquina Pompeya',
          ownerId: user.id,
          allowOrdering: true,
          deliveryEnabled: true,
          contactPhone: '+54 11 4567-8900',
          contactAddress: 'Av. Fernández de la Cruz 1100, CABA'
        }
      });
    }

    console.log('🗑️ Limpiando datos anteriores...');
    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });
    await prisma.category.deleteMany({ where: { menuId: menu.id } });

    console.log('📊 Parseando categorías y platos...');
    
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
        categoriesMap.get(currentCategory)!.items.push({
          code: codigo || null,
          name: plato,
          price: precio
        });
      }
    }

    console.log(`✅ Encontradas ${categoriesMap.size} categorías`);

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

    console.log(`🎉 Datos cargados: ${categoriesMap.size} categorías, ${totalItems} platos`);

    return NextResponse.json({
      success: true,
      message: 'Datos cargados exitosamente desde Menu_Esquina_Pompeya.md',
      data: {
        menuId: menu.id,
        categoriesCount: categoriesMap.size,
        itemsCount: totalItems
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
