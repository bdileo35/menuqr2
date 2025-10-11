// Script para parsear el MD y crear datos para Supabase
import { PrismaClient, Role } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface MenuRow {
  codigo?: string;
  categoria: string;
  plato: string;
  precio: number;
  imagen?: string;
}

async function parseMarkdownToSupabase() {
  try {
    console.log('📖 Leyendo archivo MD...');
    
    const mdPath = path.join(process.cwd(), 'Docs', 'Menu_Esquina_Pompeya.md');
    const mdContent = fs.readFileSync(mdPath, 'utf-8');
    
    console.log('✅ Archivo MD leído');
    
    // Parsear líneas del MD
    const lines = mdContent.split('\n');
    const menuRows: MenuRow[] = [];
    
    for (const line of lines) {
      // Buscar líneas que empiecen con |
      if (line.trim().startsWith('|') && line.includes('|') && !line.includes('---')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p);
        
        if (parts.length >= 4) {
          const codigo = parts[0] || undefined;
          const categoria = parts[1] || '';
          const plato = parts[2] || '';
          const precio = parseInt(parts[3]) || 0;
          const imagen = parts[4] || undefined;
          
          if (categoria && plato && precio > 0) {
            menuRows.push({ codigo, categoria, plato, precio, imagen });
          }
        }
      }
    }
    
    console.log(`📊 ${menuRows.length} platos encontrados en el MD`);
    
    // Agrupar por categorías
    const categoriesMap = new Map<string, MenuRow[]>();
    
    for (const row of menuRows) {
      const catName = row.categoria;
      if (!categoriesMap.has(catName)) {
        categoriesMap.set(catName, []);
      }
      categoriesMap.get(catName)!.push(row);
    }
    
    console.log(`📂 ${categoriesMap.size} categorías encontradas`);
    
    // Crear usuario
    console.log('👤 Creando usuario...');
    const user = await prisma.user.create({
      data: {
        name: 'Esquina Pompeya',
        email: 'admin@esquinapompeya.com',
        password: 'esquina2024',
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya',
        phone: '+54 11 4911-6666',
        address: 'Av. Fernández de la Cruz 1100, Buenos Aires',
        role: Role.ADMIN
      }
    });
    
    // Crear menú
    console.log('🍽️ Creando menú...');
    const menu = await prisma.menu.create({
      data: {
        restaurantName: 'Esquina Pompeya',
        restaurantId: 'esquina-pompeya',
        description: 'Restaurante tradicional argentino',
        contactPhone: '+54 11 4911-6666',
        contactAddress: 'Av. Fernández de la Cruz 1100, Buenos Aires',
        contactEmail: 'info@esquinapompeya.com',
        socialInstagram: '@esquinapompeya',
        ownerId: user.id
      }
    });
    
    // Función para generar código de categoría
    const getCategoryCode = (categoryName: string, index: number): string => {
      const fixedCategories = [
        { name: 'Platos del Día', code: '01' },
        { name: 'Promos de la Semana', code: '02' },
        { name: 'Cocina', code: '03' },
        { name: 'Parrilla', code: '04' },
        { name: 'Pescados y Mariscos', code: '05' }
      ];
      
      const fixedCategory = fixedCategories.find(cat => 
        categoryName.toLowerCase().includes(cat.name.toLowerCase())
      );
      
      if (fixedCategory) {
        return fixedCategory.code;
      }
      
      return String(index + 6).padStart(2, '0');
    };
    
    // Crear categorías y platos
    let totalItems = 0;
    let categoryIndex = 1;
    
    for (const [categoryName, items] of categoriesMap) {
      const categoryCode = getCategoryCode(categoryName, categoryIndex);
      
      console.log(`📂 Creando categoría: ${categoryName} (${categoryCode})`);
      
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          code: categoryCode,
          position: categoryIndex,
          description: `Categoría ${categoryName}`,
          menuId: menu.id,
          isActive: true
        }
      });
      
      // Crear platos de esta categoría
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemCode = item.codigo || `${categoryCode}${String(i + 1).padStart(2, '0')}`;
        
        await prisma.menuItem.create({
          data: {
            name: item.plato,
            price: item.precio,
            description: `Delicioso ${item.plato.toLowerCase()}`,
            code: itemCode,
            position: i + 1,
            isAvailable: true,
            isPopular: categoryCode === '01', // Platos del día son populares
            isPromo: categoryCode === '02', // Promos son promociones
            imageUrl: item.imagen || null,
            categoryId: category.id,
            menuId: menu.id
          }
        });
        
        totalItems++;
      }
      
      categoryIndex++;
    }
    
    console.log(`✅ Seed completado:`);
    console.log(`👤 Usuario: ${user.email}`);
    console.log(`🍽️ Menú: ${menu.restaurantName}`);
    console.log(`📂 Categorías: ${categoriesMap.size}`);
    console.log(`🍽️ Platos: ${totalItems}`);
    
    return {
      success: true,
      data: {
        userId: user.id,
        menuId: menu.id,
        categoriesCount: categoriesMap.size,
        itemsCount: totalItems
      }
    };
    
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  parseMarkdownToSupabase().then(result => {
    console.log('🎉 Resultado:', result);
    process.exit(result.success ? 0 : 1);
  });
}

export { parseMarkdownToSupabase };
