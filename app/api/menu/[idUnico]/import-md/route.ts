import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * API para importar menú desde archivo Markdown
 * Acepta el contenido del MD directamente (no requiere archivo en el servidor)
 * 
 * POST /api/menu/[idUnico]/import-md
 * Body: {
 *   mdContent: string,  // Contenido del archivo .md
 *   replaceExisting?: boolean  // Si true, reemplaza categorías/items existentes
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  
  try {
    console.log(`📄 Importando menú desde MD para IDU: ${idUnico}`);
    
    const body = await request.json();
    const { mdContent, replaceExisting = false } = body;
    
    if (!mdContent || typeof mdContent !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'mdContent es requerido y debe ser un string'
      }, { status: 400 });
    }
    
    // Buscar menú existente
    const menu = await prisma.menu.findFirst({
      where: { restaurantId: idUnico }
    });
    
    if (!menu) {
      return NextResponse.json({
        success: false,
        error: `No se encontró menú para IDU: ${idUnico}`
      }, { status: 404 });
    }
    
    // Parsear el MD
    const lines = mdContent.split('\n').filter(line => line.trim() && !line.startsWith('|---'));
    
    const categoriesMap = new Map<string, { name: string; items: any[] }>();
    const itemsWithoutCategory: any[] = [];
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
      let descripcion = '';
      let imagen = '';
      
      // Detectar formato
      if (parts.length >= 4) {
        // Formato completo: | Código | Categoría | Plato | Precio | Descripción? | Imagen? |
        if (parts[0].match(/^\d{4}$/)) {
          codigo = parts[0];
          categoria = parts[1] || '';
          plato = parts[2] || '';
          precioStr = parts[3] || '';
          descripcion = parts[4] || '';
          imagen = parts[5] || '';
        } else {
          // Formato corto: | Categoría | Plato | Precio | Descripción? | Imagen? |
          categoria = parts[0] || '';
          plato = parts[1] || '';
          precioStr = parts[2] || '';
          descripcion = parts[3] || '';
          imagen = parts[4] || '';
        }
      } else if (parts.length === 3) {
        // Formato mínimo: | Categoría | Plato | Precio |
        categoria = parts[0] || '';
        plato = parts[1] || '';
        precioStr = parts[2] || '';
      }
      
      // Si hay categoría nueva, actualizarla
      if (categoria && categoria.trim() && categoria !== currentCategory) {
        currentCategory = categoria.trim();
        if (!categoriesMap.has(currentCategory)) {
          categoriesMap.set(currentCategory, {
            name: currentCategory,
            items: []
          });
        }
      }
      
      // Agregar plato
      if (plato && precioStr) {
        const precio = parseFloat(precioStr.replace(/[^\d.]/g, '')) || 0;
        if (precio > 0) {
          const itemData = {
            code: codigo || null,
            name: plato.trim(),
            price: precio,
            description: descripcion.trim() || null,
            imageUrl: imagen.trim() || null
          };
          
          // Si tiene categoría, agregar a la categoría
          if (currentCategory && currentCategory.trim()) {
            categoriesMap.get(currentCategory)!.items.push(itemData);
          } else {
            // Si no tiene categoría, agregar a items sin categoría
            itemsWithoutCategory.push(itemData);
          }
        }
      }
    }
    
    console.log(`✅ Parseado: ${categoriesMap.size} categorías, ${itemsWithoutCategory.length} items sin categoría`);
    
    // Si replaceExisting, limpiar datos anteriores
    if (replaceExisting) {
      console.log('🗑️ Limpiando datos anteriores...');
      await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });
      await prisma.category.deleteMany({ where: { menuId: menu.id } });
    }
    
    let totalItems = 0;
    let position = 0;
    
    // Crear categorías y sus items
    for (const [catName, catData] of Array.from(categoriesMap.entries())) {
      console.log(`📁 Creando categoría: ${catData.name} (${catData.items.length} items)`);
      
      // Buscar categoría existente o crear nueva
      let category = await prisma.category.findFirst({
        where: {
          menuId: menu.id,
          name: catData.name
        }
      });
      
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: catData.name,
            code: null,
            position: position++,
            menuId: menu.id,
            isActive: true
          }
        });
      }
      
      // Crear items de la categoría
      for (let idx = 0; idx < catData.items.length; idx++) {
        const item = catData.items[idx];
        await prisma.menuItem.create({
          data: {
            name: item.name,
            price: item.price,
            description: item.description,
            code: item.code,
            imageUrl: item.imageUrl,
            position: idx,
            isAvailable: true,
            menuId: menu.id,
            categoryId: category.id
          }
        });
        totalItems++;
      }
    }
    
    // Crear items sin categoría (categoryId = null)
    if (itemsWithoutCategory.length > 0) {
      console.log(`📦 Creando ${itemsWithoutCategory.length} items sin categoría...`);
      for (let idx = 0; idx < itemsWithoutCategory.length; idx++) {
        const item = itemsWithoutCategory[idx];
        await prisma.menuItem.create({
          data: {
            name: item.name,
            price: item.price,
            description: item.description,
            code: item.code,
            imageUrl: item.imageUrl,
            position: idx,
            isAvailable: true,
            menuId: menu.id,
            categoryId: undefined // Sin categoría
          }
        });
        totalItems++;
      }
    }
    
    console.log(`🎉 Importación completada: ${categoriesMap.size} categorías, ${totalItems} items totales`);
    
    return NextResponse.json({
      success: true,
      message: 'Menú importado exitosamente',
      data: {
        menuId: menu.id,
        categoriesCount: categoriesMap.size,
        itemsWithCategory: totalItems - itemsWithoutCategory.length,
        itemsWithoutCategory: itemsWithoutCategory.length,
        totalItems
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error importando menú:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error al importar menú'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}



