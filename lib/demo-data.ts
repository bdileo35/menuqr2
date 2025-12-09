// Datos demo completos para desarrollo local
export interface MenuItem {
  id?: string;
  name: string;
  price: string;
  description?: string;
  isAvailable?: boolean;
  code?: string;
}

export interface MenuCategory {
  id?: string;
  name: string;
  items: MenuItem[];
  code?: string;
}

export interface RestaurantData {
  restaurantName: string;
  categories: MenuCategory[];
}

export function getDemoMenuData(): RestaurantData {
  return {
    restaurantName: 'Esquina Pompeya',
    categories: [
      {
        id: 'platos-dia',
        name: 'Platos del Día',
        code: '01',
        items: [
          { id: '1', name: 'Riñoncitos al jerez c/ puré', price: '$9000', description: 'Deliciosos riñones en salsa jerez', isAvailable: true, code: '0101' },
          { id: '2', name: 'Croquetas de carne c/ ensalada', price: '$9000', description: 'Croquetas caseras con ensalada fresca', isAvailable: true, code: '0102' },
          { id: '3', name: 'Chupín de merluza c/ papa natural', price: '$10000', description: 'Pescado fresco con papas naturales', isAvailable: true, code: '0103' },
          { id: '4', name: 'Pechuga rellena c/ f. españolas', price: '$12000', description: 'Pechuga rellena con papas españolas', isAvailable: true, code: '0104' },
          { id: '5', name: 'Mejillones c/ fettuccinis', price: '$12000', description: 'Mejillones con pasta fresca', isAvailable: true, code: '0105' },
          { id: '6', name: 'Vacío a la parrilla c/ fritas', price: '$14000', description: 'Corte premium con papas fritas', isAvailable: false, code: '0106' },
          { id: '7', name: 'Peceto al verdeo c/ puré', price: '$15000', description: 'Carne tierna con puré de papas', isAvailable: true, code: '0107' },
          { id: '8', name: 'Correntinos caseros a la Vangoli', price: '$13000', description: 'Especialidad casera con salsa especial', isAvailable: true, code: '0108' }
        ]
      },
      {
        id: 'promos',
        name: 'Promociones',
        code: '02',
        items: [
          { id: '9', name: 'Milanesa Completa', price: '$2500', description: 'Milanesa con papas, huevo y ensalada', isAvailable: true, code: '0201' },
          { id: '10', name: 'Vacio con Papas', price: '$3000', description: 'Corte de vacío con papas fritas', isAvailable: true, code: '0202' },
          { id: '11', name: 'Rabas', price: '$2800', description: 'Rabas frescas con limón', isAvailable: true, code: '0203' }
        ]
      },
      {
        id: 'cocina',
        name: 'Cocina',
        code: '03',
        items: [
          { id: '12', name: 'Albóndigas con papas', price: '$2200', description: 'Albóndigas caseras con papas', isAvailable: true, code: '0301' },
          { id: '13', name: 'Pollo al horno', price: '$1800', description: 'Pollo entero al horno', isAvailable: true, code: '0302' },
          { id: '14', name: 'Vacío al horno c/ papas', price: '$14000', description: 'Corte premium al horno', isAvailable: true, code: '0303' }
        ]
      },
      {
        id: 'parrilla',
        name: 'Parrilla',
        code: '04',
        items: [
          { id: '15', name: 'Bife de chorizo', price: '$15000', description: 'Bife de chorizo a la parrilla', isAvailable: true, code: '0401' },
          { id: '16', name: 'Ojo de bife', price: '$11600', description: 'Ojo de bife premium', isAvailable: true, code: '0402' },
          { id: '17', name: 'Provoletta Esquina', price: '$12000', description: 'Provoleta especial de la casa', isAvailable: true, code: '0403' }
        ]
      },
      {
        id: 'pescados',
        name: 'Pescados y Mariscos',
        code: '05',
        items: [
          { id: '18', name: 'Filet de merluza a la romana', price: '$8000', description: 'Filet de merluza rebozado', isAvailable: true, code: '0501' },
          { id: '19', name: 'Salmón rosado c/ crema de puerros', price: '$30000', description: 'Salmón con crema de puerros', isAvailable: true, code: '0502' },
          { id: '20', name: 'Gambas al ajillo', price: '$20000', description: 'Gambas al ajillo españolas', isAvailable: true, code: '0503' }
        ]
      },
      {
        id: 'ensaladas',
        name: 'Ensaladas',
        code: '06',
        items: [
          { id: '21', name: 'Ensalada Caesar', price: '$9000', description: 'Ensalada Caesar clásica', isAvailable: true, code: '0601' },
          { id: '22', name: 'Ensalada Mixta', price: '$5000', description: 'Ensalada mixta fresca', isAvailable: true, code: '0602' },
          { id: '23', name: 'Ensalada Completa', price: '$9000', description: 'Ensalada completa con ingredientes variados', isAvailable: true, code: '0603' }
        ]
      }
    ]
  };
}

// Datos demo para Los Toritos (5XJ1J39E)
export function getDemoMenuDataLosToritos(): RestaurantData {
  return {
    restaurantName: 'Los Toritos 🐃',
    categories: [
      {
        id: 'especiales',
        name: 'Especiales',
        code: '01',
        items: [
          { id: '1', name: 'Especial los toritos 🐃', price: '$12500', description: '1/4 panceta + huevo frito, 1/4 salchicha con mostaza, 1/4 papas fritas, 1/4 calabresa. Caos controlado.', isAvailable: true, code: '0101' }
        ]
      },
      {
        id: 'pizzas',
        name: 'Pizzas',
        code: '02',
        items: [
          { id: '2', name: 'Muzza', price: '$8500', description: 'Mozzarella clásica', isAvailable: true, code: '0201' },
          { id: '3', name: 'Napolitana', price: '$9500', description: 'Muzza, tomate, ajo, albahaca', isAvailable: true, code: '0202' },
          { id: '4', name: 'Calabresa', price: '$10500', description: 'Muzza, calabresa, morrón', isAvailable: true, code: '0203' }
        ]
      },
      {
        id: 'empanadas',
        name: 'Empanadas',
        code: '03',
        items: [
          { id: '5', name: 'Carne', price: '$800', description: 'Empanada de carne casera', isAvailable: true, code: '0301' },
          { id: '6', name: 'Pollo', price: '$800', description: 'Empanada de pollo', isAvailable: true, code: '0302' },
          { id: '7', name: 'Jamón y Queso', price: '$800', description: 'Empanada de jamón y queso', isAvailable: true, code: '0303' }
        ]
      },
      {
        id: 'promos',
        name: 'Promos de la Semana',
        code: '04',
        items: [
          { id: '8', name: 'PROMO 1: 2 muzza + 6 empanadas', price: '$20000', description: '2 pizzas muzza + 6 empanadas a elección', isAvailable: true, code: '0401' },
          { id: '9', name: 'PROMO 2: 1 calzone + 4 empanadas', price: '$15000', description: '1 calzone a elección + 4 empanadas', isAvailable: true, code: '0402' }
        ]
      }
    ]
  };
}