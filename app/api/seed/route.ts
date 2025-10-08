import { PrismaClient, Role } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🌱 Iniciando seed de datos desde API...');

    // Limpiar datos existentes
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.menu.deleteMany();
    await prisma.user.deleteMany();

    // Crear el usuario propietario
    const user = await prisma.user.create({
      data: {
        name: 'Esquina Pompeya',
        email: 'admin@esquinapompeya.com',
        password: 'hashedpassword123',
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya Restaurant Bar',
        phone: '+54 11 2857-9746',
        address: 'Av. Fernández de la Cruz 1100',
        role: Role.OWNER
      }
    });

    // Crear el menú principal
    const menu = await prisma.menu.create({
      data: {
        restaurantId: 'esquina-pompeya',
        restaurantName: 'Esquina Pompeya Restaurant Bar',
        contactAddress: 'Av. Fernández de la Cruz 1100',
        contactPhone: '+54 11 2857-9746',
        ownerId: user.id
      }
    });

    // Definir todas las categorías con sus platos
    const categoriesData = [
      {
        name: 'PLATOS DEL DÍA',
        items: [
          { name: 'Milanesa de Pollo con Papas', price: 8500, description: 'Milanesa de pechuga de pollo empanada con papas fritas', isAvailable: true, isPromo: false },
          { name: 'Milanesa de Carne con Puré', price: 9000, description: 'Milanesa de carne empanada con puré de papas', isAvailable: true, isPromo: false },
          { name: 'Milanesa Napolitana con Ensalada', price: 9500, description: 'Milanesa con jamón, queso y tomate, acompañada de ensalada', isAvailable: true, isPromo: false },
          { name: 'Pollo a la Plancha con Arroz', price: 8000, description: 'Pechuga de pollo a la plancha con arroz blanco', isAvailable: true, isPromo: false },
          { name: 'Bife de Chorizo con Papas', price: 12000, description: 'Bife de chorizo a la parrilla con papas fritas', isAvailable: true, isPromo: false },
          { name: 'Entraña con Chimichurri', price: 13000, description: 'Entraña a la parrilla con chimichurri casero', isAvailable: true, isPromo: false },
          { name: 'Lomo a la Plancha con Verduras', price: 11000, description: 'Lomo de res a la plancha con verduras salteadas', isAvailable: true, isPromo: false },
          { name: 'Pescado a la Plancha con Limón', price: 10000, description: 'Filet de merluza a la plancha con limón y hierbas', isAvailable: true, isPromo: false }
        ]
      },
      {
        name: 'PROMOCIONES',
        items: [
          { name: 'Promo 1: Entraña c/ arroz + postre + bebida', price: 15000, description: 'Entraña con arroz, postre a elección y bebida', isAvailable: true, isPromo: true },
          { name: 'Promo 2: Salpicón de ave + postre + bebida', price: 12000, description: 'Salpicón de pollo con verduras, postre y bebida', isAvailable: true, isPromo: true },
          { name: 'Promo 3: Milanesa completa + bebida', price: 10000, description: 'Milanesa napolitana con papas y bebida', isAvailable: true, isPromo: true },
          { name: 'Promo 4: Pollo a la parrilla + ensalada + bebida', price: 11000, description: 'Medio pollo a la parrilla con ensalada y bebida', isAvailable: true, isPromo: true },
          { name: 'Promo 5: Bife de chorizo + papas + bebida', price: 14000, description: 'Bife de chorizo con papas fritas y bebida', isAvailable: true, isPromo: true }
        ]
      },
      {
        name: 'DE MAR: PESCADOS Y MARISCOS',
        items: [
          { name: 'Filet de Merluza a la Romana', price: 8000, description: 'Filet de merluza empanado con papas', isAvailable: true, isPromo: false },
          { name: 'Filet de Merluza Napolitano', price: 9000, description: 'Filet de merluza con salsa napolitana', isAvailable: true, isPromo: false },
          { name: 'Filet de Merluza Suisse', price: 9500, description: 'Filet de merluza con salsa suisse', isAvailable: true, isPromo: false },
          { name: 'Filet Brotola al Verdeo', price: 10000, description: 'Filet de brotola con salsa al verdeo', isAvailable: true, isPromo: false },
          { name: 'Calamar a la Plancha', price: 8500, description: 'Calamar a la plancha con limón', isAvailable: true, isPromo: false },
          { name: 'Camarones al Ajillo', price: 12000, description: 'Camarones salteados al ajillo', isAvailable: true, isPromo: false },
          { name: 'Paella de Mariscos', price: 15000, description: 'Paella con mariscos frescos', isAvailable: true, isPromo: false },
          { name: 'Rabas a la Provenzal', price: 11000, description: 'Rabas fritas con ajo y perejil', isAvailable: true, isPromo: false }
        ]
      },
      {
        name: 'ENSALADAS',
        items: [
          { name: 'Ensalada César', price: 6000, description: 'Lechuga, crutones, parmesano y aderezo césar', isAvailable: true, isPromo: false },
          { name: 'Ensalada Mixta', price: 5500, description: 'Lechuga, tomate, cebolla y huevo duro', isAvailable: true, isPromo: false },
          { name: 'Ensalada de Pollo', price: 7000, description: 'Ensalada mixta con pollo grillé', isAvailable: true, isPromo: false },
          { name: 'Ensalada Caprese', price: 6500, description: 'Tomate, mozzarella y albahaca fresca', isAvailable: true, isPromo: false },
          { name: 'Ensalada de Atún', price: 7000, description: 'Ensalada mixta con atún en lata', isAvailable: true, isPromo: false },
          { name: 'Ensalada de Palta', price: 6500, description: 'Lechuga, palta, tomate y cebolla morada', isAvailable: true, isPromo: false }
        ]
      },
      {
        name: 'POSTRES',
        items: [
          { name: 'Flan Casero', price: 2500, description: 'Flan casero con dulce de leche', isAvailable: true, isPromo: false },
          { name: 'Tiramisu', price: 3000, description: 'Tiramisu casero', isAvailable: true, isPromo: false },
          { name: 'Cheesecake', price: 2800, description: 'Cheesecake de frutos rojos', isAvailable: true, isPromo: false },
          { name: 'Brownie con Helado', price: 3200, description: 'Brownie con helado de vainilla', isAvailable: true, isPromo: false },
          { name: 'Profiteroles', price: 3000, description: 'Profiteroles con dulce de leche', isAvailable: true, isPromo: false }
        ]
      }
    ];

    // Crear categorías y sus items
    for (let i = 0; i < categoriesData.length; i++) {
      const categoryData = categoriesData[i];
      
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          position: i,
          menuId: menu.id
        }
      });

      // Crear items para esta categoría
      for (let j = 0; j < categoryData.items.length; j++) {
        const itemData = categoryData.items[j];
        
        await prisma.menuItem.create({
          data: {
            name: itemData.name,
            price: itemData.price,
            description: itemData.description,
            position: j,
            isAvailable: itemData.isAvailable,
            isPromo: itemData.isPromo,
            categoryId: category.id,
            menuId: menu.id
          }
        });
      }
    }

    // Contar totales
    const totalCategories = await prisma.category.count();
    const totalItems = await prisma.menuItem.count();

    return NextResponse.json({
      success: true,
      message: 'Seed completado exitosamente!',
      data: {
        totalCategories,
        totalItems,
        restaurantName: menu.restaurantName
      }
    });

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
