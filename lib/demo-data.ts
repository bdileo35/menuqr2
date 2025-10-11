// Datos de demo para Esquina Pompeya - Compartido entre carta-menu y editor2
export const DEMO_MENU_DATA = {
  restaurantName: 'Esquina Pompeya',
  address: 'Av. Fernández de la Cruz 1100, Buenos Aires',
  phone: '+54 11 4911-6666',
  categories: [
    {
      id: 'platos-del-dia',
      name: 'Platos del Día',
      items: [
        { id: '1', name: 'Riñoncitos al jerez c/ puré', price: '$9000', description: 'Riñones de ternera al jerez con puré de papas', isAvailable: true },
        { id: '2', name: 'Croquetas de carne c/ ensalada', price: '$9000', description: 'Croquetas caseras con ensalada mixta', isAvailable: true },
        { id: '3', name: 'Chupín de merluza c/ papa natural', price: '$10000', description: 'Merluza en salsa de tomate con papas', isAvailable: true },
        { id: '4', name: 'Pechuga rellena c/ f. españolas', price: '$12000', description: 'Pechuga rellena con papas españolas', isAvailable: true },
        { id: '5', name: 'Mejillones c/ fettuccinis', price: '$12000', description: 'Mejillones con fettuccini casero', isAvailable: true },
        { id: '6', name: 'Vacío a la parrilla c/ fritas', price: '$14000', description: 'Vacío a la parrilla con papas fritas', isAvailable: true },
        { id: '7', name: 'Peceto al verdeo c/ puré', price: '$15000', description: 'Peceto con salsa verdeo y puré', isAvailable: true },
        { id: '8', name: 'Correntinos caseros a la Vangoli', price: '$13000', description: 'Pasta casera con salsa Vangoli', isAvailable: true }
      ]
    },
    {
      id: 'promos-semana',
      name: 'Promos de la Semana',
      items: [
        { id: '9', name: 'Promo 1 (Entraña c/ arroz + postre + bebida)', price: '$12000', description: 'Entraña con arroz, postre y bebida', isAvailable: true, isPromo: true },
        { id: '10', name: 'Promo 2 (Salpicón de ave + postre + bebida)', price: '$12000', description: 'Salpicón de ave con postre y bebida', isAvailable: true, isPromo: true }
      ]
    },
    {
      id: 'cocina',
      name: 'Cocina',
      items: [
        { id: '11', name: '1/4 Pollo al horno c/ papas', price: '$9000', description: 'Cuarto de pollo al horno con papas', isAvailable: true },
        { id: '12', name: '1/4 Pollo provenzal c/ fritas', price: '$10000', description: 'Cuarto de pollo provenzal con fritas', isAvailable: true },
        { id: '13', name: 'Matambre al verdeo c/ fritas', price: '$12000', description: 'Matambre con salsa verdeo y fritas', isAvailable: true },
        { id: '14', name: 'Matambre a la pizza c/ fritas', price: '$12000', description: 'Matambre estilo pizza con fritas', isAvailable: true },
        { id: '15', name: 'Bondiola al ajillo c/ fritas', price: '$12000', description: 'Bondiola al ajillo con papas fritas', isAvailable: true },
        { id: '16', name: 'Bondiola al verdeo c/ papas', price: '$12000', description: 'Bondiola con salsa verdeo y papas', isAvailable: true },
        { id: '17', name: 'Costillitas (2) a la riojana', price: '$18000', description: 'Dos costillitas estilo riojano', isAvailable: true },
        { id: '18', name: 'Vacío al horno c/ papas', price: '$14000', description: 'Vacío al horno con papas', isAvailable: true },
        { id: '19', name: 'Vacío a la parrilla c/ guarnición', price: '$15000', description: 'Vacío a la parrilla con ensalada', isAvailable: true },
        { id: '20', name: 'Peceto horneado al vino c/ f. españolas', price: '$15000', description: 'Peceto al vino con papas españolas', isAvailable: true },
        { id: '21', name: 'Peceto al verdeo c/ puré', price: '$15000', description: 'Peceto con salsa verdeo y puré', isAvailable: true },
        { id: '22', name: 'Peceto al roquefort c/ f. españolas', price: '$18000', description: 'Peceto con salsa roquefort y papas españolas', isAvailable: true },
        { id: '23', name: 'Tapa de asado al horno c/ papas', price: '$12000', description: 'Tapa de asado al horno con papas', isAvailable: true },
        { id: '24', name: 'Costillitas a la mostaza c/ fritas', price: '$12000', description: 'Costillitas con mostaza y fritas', isAvailable: true }
      ]
    },
    {
      id: 'pescados-mariscos',
      name: 'DEL MAR: PESCADOS Y MARISCOS',
      items: [
        { id: '25', name: 'Rabas (porción)', price: '$18000', description: 'Porción de rabas fritas', isAvailable: true },
        { id: '26', name: 'Rabas (media docena)', price: '$11000', description: 'Media docena de rabas', isAvailable: true },
        { id: '27', name: 'Langostinos c/ salsa golf', price: '$15000', description: 'Langostinos con salsa golf', isAvailable: true },
        { id: '28', name: 'Merluza a la romana c/ papas', price: '$12000', description: 'Merluza empanada con papas', isAvailable: true },
        { id: '29', name: 'Merluza a la plancha c/ ensalada', price: '$11000', description: 'Merluza a la plancha con ensalada', isAvailable: true },
        { id: '30', name: 'Salmón a la plancha c/ ensalada', price: '$18000', description: 'Salmón a la plancha con ensalada', isAvailable: true },
        { id: '31', name: 'Corvina a la plancha c/ ensalada', price: '$15000', description: 'Corvina a la plancha con ensalada', isAvailable: true },
        { id: '32', name: 'Calamares a la romana c/ papas', price: '$12000', description: 'Calamares empanados con papas', isAvailable: true },
        { id: '33', name: 'Calamares en su tinta c/ arroz', price: '$14000', description: 'Calamares en su tinta con arroz', isAvailable: true },
        { id: '34', name: 'Paella para 2 personas', price: '$25000', description: 'Paella tradicional para dos', isAvailable: true },
        { id: '35', name: 'Risotto de mariscos', price: '$18000', description: 'Risotto cremoso con mariscos', isAvailable: true },
        { id: '36', name: 'Lenguado a la meuniere c/ papas', price: '$16000', description: 'Lenguado meuniere con papas', isAvailable: true },
        { id: '37', name: 'Atún a la plancha c/ ensalada', price: '$18000', description: 'Atún a la plancha con ensalada', isAvailable: true },
        { id: '38', name: 'Pulpo a la gallega', price: '$16000', description: 'Pulpo estilo gallego', isAvailable: true },
        { id: '39', name: 'Cazuela de mariscos', price: '$20000', description: 'Cazuela de mariscos variados', isAvailable: true },
        { id: '40', name: 'Sushi roll de salmón', price: '$12000', description: 'Roll de sushi con salmón', isAvailable: true },
        { id: '41', name: 'Sashimi de atún', price: '$15000', description: 'Sashimi fresco de atún', isAvailable: true },
        { id: '42', name: 'Ceviche de pescado', price: '$13000', description: 'Ceviche fresco de pescado', isAvailable: true },
        { id: '43', name: 'Brócoli c/ salsa holandesa', price: '$8000', description: 'Brócoli con salsa holandesa', isAvailable: true }
      ]
    },
    {
      id: 'ensaladas',
      name: 'ENSALADAS',
      items: [
        { id: '44', name: 'Ensalada mixta', price: '$8000', description: 'Ensalada de lechuga, tomate y cebolla', isAvailable: true },
        { id: '45', name: 'Ensalada de lechuga y tomate', price: '$6000', description: 'Ensalada simple de lechuga y tomate', isAvailable: true },
        { id: '46', name: 'Ensalada César', price: '$10000', description: 'Ensalada César con pollo', isAvailable: true },
        { id: '47', name: 'Ensalada de pollo', price: '$12000', description: 'Ensalada con pollo grillé', isAvailable: true }
      ]
    },
    {
      id: 'ensaladas-especiales',
      name: 'ENSALADAS ESPECIALES',
      items: [
        { id: '48', name: 'Ensalada de salmón ahumado', price: '$15000', description: 'Ensalada con salmón ahumado y rúcula', isAvailable: true },
        { id: '49', name: 'Ensalada de langostinos', price: '$16000', description: 'Ensalada con langostinos frescos', isAvailable: true },
        { id: '50', name: 'Ensalada de atún', price: '$14000', description: 'Ensalada con atún fresco', isAvailable: true },
        { id: '51', name: 'Ensalada griega', price: '$12000', description: 'Ensalada griega tradicional', isAvailable: true },
        { id: '52', name: 'Ensalada de quinoa', price: '$13000', description: 'Ensalada de quinoa con vegetales', isAvailable: true },
        { id: '53', name: 'Ensalada de espinaca y nueces', price: '$11000', description: 'Espinaca con nueces y queso', isAvailable: true },
        { id: '54', name: 'Ensalada de rúcula y parmesano', price: '$12000', description: 'Rúcula con queso parmesano', isAvailable: true },
        { id: '55', name: 'Ensalada de tomate y mozzarella', price: '$10000', description: 'Caprese con tomate y mozzarella', isAvailable: true },
        { id: '56', name: 'Ensalada de palta y camarones', price: '$15000', description: 'Ensalada con palta y camarones', isAvailable: true },
        { id: '57', name: 'Ensalada de pollo y aguacate', price: '$13000', description: 'Ensalada con pollo y aguacate', isAvailable: true },
        { id: '58', name: 'Ensalada de atún y garbanzos', price: '$14000', description: 'Ensalada con atún y garbanzos', isAvailable: true },
        { id: '59', name: 'Ensalada de quinoa y vegetales', price: '$12000', description: 'Quinoa con vegetales asados', isAvailable: true },
        { id: '60', name: 'Ensalada de espinaca y fresas', price: '$13000', description: 'Espinaca con fresas y vinagreta', isAvailable: true },
        { id: '61', name: 'Ensalada de remolacha y queso de cabra', price: '$14000', description: 'Remolacha con queso de cabra', isAvailable: true }
      ]
    }
  ]
};

// Función helper para obtener datos de demo
export const getDemoMenuData = () => {
  return {
    ...DEMO_MENU_DATA,
    // Agregar metadatos adicionales si es necesario
    totalItems: DEMO_MENU_DATA.categories.reduce((total, cat) => total + cat.items.length, 0),
    totalCategories: DEMO_MENU_DATA.categories.length
  };
};
