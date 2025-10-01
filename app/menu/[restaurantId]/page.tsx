"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  isPopular: boolean;
  isPromo: boolean;
  isAvailable: boolean;
  spicyLevel: number;
  tags?: string;
  preparationTime?: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

interface Menu {
  id: string;
  restaurantId: string;
  restaurantName: string;
  description?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  showPrices: boolean;
  showImages: boolean;
  currency: string;
  categories: Category[];
}

export default function MenuPage() {
  const params = useParams();
  const restaurantId = params?.restaurantId as string;
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Loading menu for:', restaurantId);
    
    // FORZAR DATOS NUEVOS - limpiamos cache
    localStorage.removeItem('editor-menu-data');
    localStorage.removeItem('setup-comercio-data');
    
    // Cargar datos del localStorage (del editor)
    const savedMenu = localStorage.getItem('editor-menu-data');
    const setupData = localStorage.getItem('setup-comercio-data');
    
    console.log('📦 Saved menu (debería ser null):', savedMenu);
    console.log('⚙️ Setup data (debería ser null):', setupData);
    
    if (savedMenu) {
      const categories = JSON.parse(savedMenu);
      const setup = setupData ? JSON.parse(setupData) : {};
      
      setMenuData({
        restaurantName: setup.nombreComercio || 'ESQUINA POMPEYA',
        description: setup.descripcion || 'Restaurante de comidas caseras y parrilla argentina',
        address: setup.direccion || 'Av. Corrientes 1234, CABA',
        phone: setup.telefono || '+54 11 1234-5678',
        categories: categories
      });
    } else {
      // Datos REALES del Editor - 8 categorías, 63 productos
      setMenuData({
        restaurantName: 'ESQUINA POMPEYA',
        description: 'Restaurante de comidas caseras y parrilla argentina',
        address: 'Av. Corrientes 1234, CABA', 
        phone: '+54 11 1234-5678',
        categories: [
          {
            name: 'PLATOS DEL DÍA',
            items: [
              { name: 'Milanesas al horno c/ Puré', price: '$9000' },
              { name: 'Croquetas de carne c/ensalada', price: '$8000' },
              { name: 'Chuleta de merluza c/rusa gatura', price: '$10000' },
              { name: 'Pechuga rellena c/ f. españolas', price: '$12000' },
              { name: 'Mejillones c/ fetuccinis', price: '$14000' },
              { name: 'Vacío a la parrilla c/fritas', price: '$15000' },
              { name: 'Peceto al verdeo c/ Puré', price: '$15000' },
              { name: 'Arroz integral con vegetales', price: '$11000' }
            ]
          },
          {
            name: 'PROMOS DE LA SEMANA',
            items: [
              { name: 'PROMO 1: Milanesa Completa', price: '$12000', description: 'Milanesa c/Papas + Postre + Bebida' },
              { name: 'PROMO 2: Salpicón de Ave', price: '$12000', description: 'Salpicón + Postre + Bebida' },
              { name: 'PROMO 3: Hamburguesa + Papas + Bebida', price: '$10000' },
              { name: 'PROMO 4: Pizza + Faina + Bebida', price: '$14000' },
              { name: 'PROMO 5: Parrillada + Ensalada + Postre', price: '$25000' }
            ]
          },
          {
            name: 'COCINA',
            items: [
              { name: '1/4 Pollo al horno c/ papas', price: '$9000' },
              { name: '1/4 Pollo provenzal c/ fritas', price: '$10000' },
              { name: 'Matambre al verdeo c/ fritas', price: '$12000' },
              { name: 'Matambre a la pizza c/ fritas', price: '$12000' },
              { name: 'Bondiola al ajillo c/ fritas', price: '$12000' },
              { name: 'Bondiola al verdeo c/ papas', price: '$12000' },
              { name: 'Costillitas (2) a la riojana', price: '$18000' },
              { name: 'Vacío al horno c/ papas', price: '$14000' },
              { name: 'Vacío a la parrilla c/ guarnición', price: '$15000' },
              { name: 'Peceto horneado al vino c/ f. españolas', price: '$15000' }
            ]
          },
          {
            name: 'TORTILLAS',
            items: [
              { name: 'Papas', price: '$8000' },
              { name: 'Papas c/ cebolla', price: '$9000' },
              { name: 'Española', price: '$10000' },
              { name: 'Verdura', price: '$8000' },
              { name: 'Papas fritas porción', price: '$6000' }
            ]
          },
          {
            name: 'OMELETS',
            items: [
              { name: 'Omelet c/ jamón', price: '$7000' },
              { name: 'Omelet c/ jamón y queso', price: '$8000' },
              { name: 'Omelet c/ jamón, queso y tomate', price: '$9000' },
              { name: 'Omelet de verdura', price: '$7000' }
            ]
          },
          {
            name: 'SÁNDWICHES',
            items: [
              { name: 'Francés jamón y queso', price: '$6000' },
              { name: 'Francés salame y queso', price: '$6000' },
              { name: 'Francés jamón crudo y queso', price: '$7000' },
              { name: 'Sandwich de matambre casero', price: '$7000' },
              { name: 'Sw. milanesa simple', price: '$5000' },
              { name: 'Sw. milanesa LyT', price: '$6000' },
              { name: 'Sw. milanesa completo', price: '$7000' },
              { name: 'Sw. lomito solo simple', price: '$8000' },
              { name: 'Sw. lomito completo', price: '$10000' },
              { name: 'Sw. bondiola completo', price: '$10000' }
            ]
          },
          {
            name: 'ENTRADAS',
            items: [
              { name: 'Picada para 1', price: '$10000' },
              { name: 'Picada para 2', price: '$19000' },
              { name: 'Matambre casero c/ rusa', price: '$10000' }
            ]
          },
          {
            name: 'EMPANADAS',
            items: [
              { name: 'Empanadas Carne/Pollo/JyQ', price: '$1600', description: 'c/u' },
              { name: 'Empanadas Atún', price: '$1800', description: 'c/u' }
            ]
          }
        ]
      });
    }
    setLoading(false);
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo - Lado Izquierdo */}
            <div className="flex-shrink-0">
              <img 
                src="/demo-images/Logo.jpg" 
                alt="Logo Esquina Pompeya"
                className="h-16 w-24 rounded-lg object-cover border-2 border-gray-600"
              />
            </div>

            {/* Info del Comercio - Lado Derecho */}
            <div className="flex-1 ml-6 text-right">
              {/* Línea 1: Nombre del Comercio */}
              <h1 className="text-2xl font-bold text-white mb-1">
                {menuData.restaurantName}
              </h1>
              
              {/* Línea 2: Dirección con link a Google Maps */}
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(menuData.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-end mb-1"
              >
                <span className="mr-1">📍</span>
                {menuData.address}
              </a>
              
              {/* Línea 3: WhatsApp con link */}
              <a 
                href={`https://wa.me/${menuData.phone.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-green-400 hover:text-green-300 transition-colors flex items-center justify-end"
              >
                <span className="mr-1">📱</span>
                {menuData.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        
        {/* Categories and Menu Items */}
        {menuData.categories.map((category: any, categoryIndex: number) => (
          <div key={categoryIndex} className="mb-4">
            
            {/* Category Header */}
            <div className="bg-gray-800 rounded-t-lg p-2 border-b-2 border-blue-500">
              <h2 className="text-base font-bold text-white text-center tracking-wider">
                {category.name}
              </h2>
            </div>

            {/* Menu Items - ULTRA COMPACTOS */}
            <div className="bg-gray-800 rounded-b-lg p-2 space-y-1">
              {category.items.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="flex items-center justify-between p-1.5 rounded border border-gray-600 hover:bg-gray-700 transition-colors">
                  
                  {/* Item Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 text-xs">⭐</span>
                      <h3 className="font-medium text-white text-xs">
                        {item.name}
                      </h3>
                    </div>
                    
                    {item.description && (
                      <p className="text-xs text-gray-400">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right ml-2">
                    <div className="text-xs font-bold text-blue-400 border border-blue-400 px-1.5 py-0.5 rounded">
                      {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Info Footer */}
        <div className="bg-gray-800 rounded-lg p-6 text-center mt-8">
          <h3 className="text-lg font-bold text-white mb-3">Información de Contacto</h3>
          <p className="text-gray-300 mb-2">📞 {menuData.phone}</p>
          <p className="text-gray-300">📍 {menuData.address}</p>
        </div>
      </div>
    </div>
  );
}