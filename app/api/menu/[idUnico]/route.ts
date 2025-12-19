import { NextResponse } from 'next/server';
import prisma, { withRetry } from '@/lib/prisma';
import { getDemoMenuData, getDemoMenuDataLosToritos } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { idUnico: string } }
) {
  const { idUnico } = params;
  
  try {
    const startTime = Date.now();
    console.log(`🔍 [${new Date().toISOString()}] Cargando menú para ID único: ${idUnico}`);
    console.log(`🔍 [${new Date().toISOString()}] DATABASE_URL configurada: ${process.env.DATABASE_URL ? 'SÍ' : 'NO'}`);
    console.log(`🔍 [${new Date().toISOString()}] DATABASE_URL preview: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NO CONFIGURADA'}`);
    
    // Usar retry para queries críticas
    const allMenus = await withRetry(async () => {
      const queryStart = Date.now();
      const result = await prisma.menu.findMany({
        select: { restaurantId: true, restaurantName: true }
      });
      console.log(`⏱️ [${new Date().toISOString()}] Query findMany(menu) tomó ${Date.now() - queryStart}ms`);
      return result;
    });
    console.log(`📋 [${new Date().toISOString()}] Menús disponibles en BD:`, allMenus.map(m => `${m.restaurantName} (${m.restaurantId})`));

    const menu = await withRetry(async () => {
      const queryStart = Date.now();
      const result = await prisma.menu.findFirst({
        where: { restaurantId: idUnico },
        include: { 
          owner: {
            select: {
              id: true,
              hasPro: true,
              restaurantName: true
            }
          }
        }
      });
      console.log(`⏱️ [${new Date().toISOString()}] Query findFirst(menu) tomó ${Date.now() - queryStart}ms`);
      return result;
    });

    if (!menu) {
      console.log(`❌ No se encontró menú para: ${idUnico}`);
      console.log(`   Menús disponibles: ${allMenus.map(m => m.restaurantId).join(', ')}`);
      return NextResponse.json({
        success: false,
        error: 'Menú no encontrado'
      }, { status: 404 });
    }

    console.log(`✅ [${new Date().toISOString()}] Menú encontrado: ${menu.restaurantName}`);
    console.log(`🔍 [${new Date().toISOString()}] Owner incluido:`, menu.owner ? `Sí (hasPro: ${menu.owner.hasPro})` : 'No');
    console.log(`⏱️ [${new Date().toISOString()}] Tiempo total hasta encontrar menú: ${Date.now() - startTime}ms`);

    const categories = await withRetry(async () => {
      return await prisma.category.findMany({
        where: { menuId: menu.id },
        orderBy: { position: 'asc' }
      });
    });

    console.log(`📋 Categorías: ${categories.length}`);

    // ✅ CARGAR TODOS LOS ITEMS DE UNA VEZ (sin map async) - con retry
    const allItems = await withRetry(async () => {
      return await prisma.menuItem.findMany({
        where: { 
          OR: [
            { categoryId: { in: categories.map(c => c.id) } },
            { menuId: menu.id, categoryId: null }
          ]
        },
        orderBy: { name: 'asc' }
      });
    });

    console.log(`📦 Items totales: ${allItems.length}`);
    
    // 🔍 DEBUG: Verificar qué devuelve Prisma directamente (sin filtros)
    const itemsConImagen = allItems.filter(item => item.imageUrl && item.imageUrl.trim() !== '');
    console.log(`🖼️ Items con imageUrl en BD: ${itemsConImagen.length}`);
    if (itemsConImagen.length > 0) {
      console.log(`📸 Primeros 3 items con imagen:`, itemsConImagen.slice(0, 3).map(item => ({
        nombre: item.name,
        imageUrl: item.imageUrl,
        tipo: typeof item.imageUrl
      })));
    }
    
    // 🔍 DEBUG: Verificar items específicos que sabemos que tienen imagen
    const itemsEspecificos = allItems.filter(item => 
      item.name.includes('Vacío') || 
      item.name.includes('Entraña') || 
      item.name.includes('Peceto') ||
      item.name.includes('Coca') ||
      item.name.includes('Chupin') ||
      item.name.includes('Croquetas')
    );
    console.log(`🔍 Items específicos encontrados: ${itemsEspecificos.length}`);
    itemsEspecificos.forEach(item => {
      console.log(`  - "${item.name}": imageUrl =`, item.imageUrl, `(tipo: ${typeof item.imageUrl}, esNull: ${item.imageUrl === null}, esUndefined: ${item.imageUrl === undefined})`);
    });

    // ✅ FILTRAR EN MEMORIA (sin async)
    const categoriesWithItems = categories.map(cat => {
      const items = allItems
        .filter(item => item.categoryId === cat.id)
        .map(item => {
          // Debug: verificar imageUrl ANTES de mapear (para items con imágenes o específicos)
          if (item.imageUrl || item.name.includes('Entraña') || item.name.includes('Peceto') || item.name.includes('Chupin') || item.name.includes('Croquetas') || item.name.includes('Coca')) {
            console.log(`🔍 API - Item "${item.name}":`, {
              imageUrl: item.imageUrl,
              tipo: typeof item.imageUrl,
              esNull: item.imageUrl === null,
              esUndefined: item.imageUrl === undefined,
              esString: typeof item.imageUrl === 'string',
              longitud: typeof item.imageUrl === 'string' ? item.imageUrl.length : 'N/A'
            });
          }
          
          // Normalizar imageUrl: si es string vacío o null, devolver null; si tiene valor, devolverlo
          const normalizedImageUrl = (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim() !== '') 
            ? item.imageUrl.trim() 
            : null;
          
          return {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            // IMPORTANTE: Devolver null en lugar de string vacío para que el editor lo maneje correctamente
            imageUrl: normalizedImageUrl,
            isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
            isPopular: item.isPopular || false,
            isPromo: item.isPromo || false,
            code: item.code || null
          };
        });

      console.log(`  └─ ${cat.name}: ${items.length} items`);

      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        position: cat.position,
        isActive: cat.isActive,
        items
      };
    });

    const itemsWithoutCategory = allItems
      .filter(item => item.categoryId === null)
      .map(item => {
        // Normalizar imageUrl igual que en categoriesWithItems
        const normalizedImageUrl = (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim() !== '') 
          ? item.imageUrl.trim() 
          : null;
        
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          // IMPORTANTE: Devolver null en lugar de string vacío
          imageUrl: normalizedImageUrl,
          isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
          isPopular: item.isPopular || false,
          isPromo: item.isPromo || false,
          code: item.code || null
        };
      });

    const formattedMenu = {
      id: menu.id,
      idUnico: menu.restaurantId,
      restaurantName: menu.restaurantName,
      contactPhone: menu.contactPhone || '',
      contactAddress: menu.contactAddress || '',
      contactEmail: menu.contactEmail || '',
      socialInstagram: menu.socialInstagram || '',
      socialFacebook: menu.socialFacebook || '',
      logoUrl: menu.logoUrl || '',
      // googleMapsUrl: (menu as any).googleMapsUrl || '', // TODO: Descomentar cuando se agreguen columnas en Supabase
      // googleReviewsUrl: (menu as any).googleReviewsUrl || '', // TODO: Descomentar cuando se agreguen columnas en Supabase
      description: menu.description || '',
      waiters: (menu as any).waiters || '',
      hasPro: menu.owner?.hasPro || false,  // Si el usuario tiene PRO
      categories: [
        ...categoriesWithItems,
        ...(itemsWithoutCategory.length > 0 ? [{
          id: '__SIN_CATEGORIA__',
          name: 'Sin categoría',
          description: 'Platos sin categoría asignada',
          position: 9999,
          isActive: false,
          items: itemsWithoutCategory
        }] : [])
      ]
    };
    
    console.log(`🔍 hasPro para ${menu.restaurantName}:`, menu.owner?.hasPro, '→', formattedMenu.hasPro);

    const totalTime = Date.now() - startTime;
    console.log(`✅ [${new Date().toISOString()}] Menú cargado: ${categoriesWithItems.length} categorías, ${allItems.length} items`);
    console.log(`⏱️ [${new Date().toISOString()}] Tiempo total de la request: ${totalTime}ms`);
    
    return NextResponse.json({
      success: true,
      menu: formattedMenu,
      _debug: {
        loadTime: totalTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error(`❌ Error:`, error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    
    // Verificar si es error de conexión
    const isConnectionError = error?.message?.includes('Can\'t reach database') || 
                              error?.message?.includes('P1001') ||
                              error?.message?.includes('connection') ||
                              error?.code === 'P1001';
    
    // FALLBACK: Si hay error de conexión, intentar servir datos demo para IDUs conocidos
    if (isConnectionError) {
      console.log(`⚠️ Error de conexión detectado. Intentando fallback con datos demo para ${idUnico}`);
      
      try {
        // IDUs conocidos con datos demo disponibles
        if (idUnico === '5XJ1J37F') {
          console.log('📦 Usando datos demo de Esquina Pompeya');
          const demoData = getDemoMenuData();
          return NextResponse.json({
            success: true,
            menu: demoData,
            fallback: true // Indicar que son datos de fallback
          });
        } else if (idUnico === '5XJ1J39E' || idUnico === 'LOS-TORITOS') {
          console.log('📦 Usando datos demo de Los Toritos');
          const demoData = getDemoMenuDataLosToritos();
          return NextResponse.json({
            success: true,
            menu: demoData,
            fallback: true // Indicar que son datos de fallback
          });
        }
      } catch (fallbackError) {
        console.error('❌ Error en fallback de datos demo:', fallbackError);
      }
    }
    
    return NextResponse.json({
      success: false,
      error: isConnectionError 
        ? 'Error de conexión a la base de datos. Verifica DATABASE_URL en Vercel.'
        : 'Error interno del servidor',
      details: error?.message || 'Error desconocido',
      type: isConnectionError ? 'CONNECTION_ERROR' : 'UNKNOWN_ERROR'
    }, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // Ignorar errores de desconexión
    }
  }
}