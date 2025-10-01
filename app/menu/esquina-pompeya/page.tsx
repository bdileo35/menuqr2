"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  hasImage: boolean;
  imageUrl?: string;
  isPromo?: boolean;
  isSpecial?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  priority: number;
  items: MenuItem[];
  color?: string;
}

export default function EsquinaPompeyaMenu() {
  const router = useRouter();
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    console.log('🔍 Cargando menú estático de Esquina Pompeya');
    
    const mockMenuData: MenuCategory[] = [
      {
        id: 'platos-dia',
        name: 'PLATOS DEL DÍA',
        priority: 1,
        items: [
          { id: '1', name: 'Milanesas al horno c/ Puré', price: '$9000', hasImage: false },
          { id: '2', name: 'Croquetas de carne c/ensalada', price: '$8000', hasImage: false },
          { id: '3', name: 'Chuleta de merluza c/rusa gatura', price: '$10000', hasImage: false },
          { id: '4', name: 'Pechuga rellena c/ f. españolas', price: '$12000', hasImage: false },
          { id: '5', name: 'Mejillones c/ fetuccinis', price: '$14000', hasImage: false },
          { id: '6', name: 'Vacio a la parrilla c/fritas', price: '$15000', hasImage: false },
          { id: '7', name: 'Peceto al verdeo c/ Puré', price: '$15000', hasImage: false },
          { id: '8', name: 'Bife de chorizo c/ guarnición', price: '$18000', hasImage: false }
        ]
      },
      {
        id: 'promos',
        name: 'PROMOS - Incluyen bebida y postre',
        priority: 2,
        items: [
          { id: 'p1', name: 'PROMO 1: Milanesa Completa', price: '$12000', hasImage: false, isPromo: true },
          { id: 'p2', name: 'PROMO 2: Selección de Ave', price: '$12000', hasImage: false, isPromo: true },
          { id: 'p3', name: 'PROMO 3: Parrilla Mixta', price: '$15000', hasImage: false, isPromo: true },
          { id: 'p4', name: 'PROMO 4: Pescado del Día', price: '$14000', hasImage: false, isPromo: true },
          { id: 'p5', name: 'PROMO 5: Vegetariana', price: '$10000', hasImage: false, isPromo: true }
        ]
      },
      {
        id: 'cocina',
        name: 'COCINA',
        priority: 3,
        items: [
          { id: 'c1', name: 'Milanesas de carne', price: '$8000', hasImage: false },
          { id: 'c2', name: 'Milanesas de pollo', price: '$8000', hasImage: false },
          { id: 'c3', name: 'Suprema a la plancha', price: '$8000', hasImage: false },
          { id: 'c4', name: 'Suprema rellena', price: '$9000', hasImage: false },
          { id: 'c5', name: 'Bife de lomo', price: '$12000', hasImage: false },
          { id: 'c6', name: 'Bife de chorizo', price: '$10000', hasImage: false },
          { id: 'c7', name: 'Parrillada completa', price: '$15000', hasImage: false },
          { id: 'c8', name: 'Pescado a la plancha', price: '$11000', hasImage: false },
          { id: 'c9', name: 'Pasta con salsa', price: '$7000', hasImage: false },
          { id: 'c10', name: 'Risotto de mariscos', price: '$13000', hasImage: false }
        ]
      },
      {
        id: 'tortillas',
        name: 'TORTILLAS',
        priority: 4,
        items: [
          { id: 't1', name: 'Tortilla española', price: '$6000', hasImage: false },
          { id: 't2', name: 'Tortilla de papa', price: '$5500', hasImage: false },
          { id: 't3', name: 'Tortilla de verdura', price: '$6500', hasImage: false },
          { id: 't4', name: 'Tortilla mixta', price: '$7000', hasImage: false },
          { id: 't5', name: 'Tortilla de jamón y queso', price: '$6800', hasImage: false }
        ]
      },
      {
        id: 'omelets',
        name: 'OMELETS',
        priority: 5,
        items: [
          { id: 'o1', name: 'Omelet natural', price: '$4000', hasImage: false },
          { id: 'o2', name: 'Omelet de jamón y queso', price: '$5500', hasImage: false },
          { id: 'o3', name: 'Omelet de verduras', price: '$5000', hasImage: false },
          { id: 'o4', name: 'Omelet completo', price: '$6500', hasImage: false }
        ]
      },
      {
        id: 'sandwiches',
        name: 'SÁNDWICHES',
        priority: 6,
        items: [
          { id: 's1', name: 'Sw. tostado simple', price: '$4000', hasImage: false },
          { id: 's2', name: 'Sw. tostado completo', price: '$5000', hasImage: false },
          { id: 's3', name: 'Sw. milanesa simple', price: '$5000', hasImage: false },
          { id: 's4', name: 'Sw. milanesa LyT', price: '$6000', hasImage: false },
          { id: 's5', name: 'Sw. milanesa completo', price: '$7000', hasImage: false },
          { id: 's6', name: 'Sw. lomito solo simple', price: '$8000', hasImage: false },
          { id: 's7', name: 'Sw. lomito completo', price: '$10000', hasImage: false },
          { id: 's8', name: 'Sw. bondiola completo', price: '$10000', hasImage: false },
          { id: 's9', name: 'Sw. hamburguesa simple', price: '$6000', hasImage: false },
          { id: 's10', name: 'Sw. hamburguesa completa', price: '$8000', hasImage: false }
        ]
      },
      {
        id: 'entradas',
        name: 'ENTRADAS',
        priority: 7,
        items: [
          { id: 'e1', name: 'Picada para 1', price: '$10000', hasImage: false },
          { id: 'e2', name: 'Picada para 2', price: '$19000', hasImage: false },
          { id: 'e3', name: 'Matambre casero c/ rusa', price: '$10000', hasImage: false }
        ]
      },
      {
        id: 'empanadas',
        name: 'EMPANADAS',
        priority: 8,
        items: [
          { id: 'emp1', name: 'Carne - Pollo - J y Q', price: '$600', description: 'Docena', hasImage: false },
          { id: 'emp2', name: 'Atún, Chía', price: '$800', description: 'Docena', hasImage: false }
        ]
      }
    ];

    console.log('📋 Total categorías cargadas:', mockMenuData.length);
    console.log('📋 Total productos:', mockMenuData.reduce((total, cat) => total + cat.items.length, 0));
    
    setTimeout(() => {
      setMenuData(mockMenuData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-slate-50'
      }`}>
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <div className={`text-xl transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>Cargando menú...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      
      {/* Header compacto */}
      <div className={`sticky top-0 z-40 border-b shadow-sm transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className={`border px-3 py-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-300 bg-white'
              }`}>
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>🍽️ ESQUINA POMPEYA</h1>
              </div>
            </div>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`ml-3 p-2 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-white hover:bg-gray-100 text-gray-600'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-2">

        {/* MENÚ DINÁMICO - TODAS LAS CATEGORÍAS */}
        {menuData.map((category) => (
          <div key={category.id} className={`rounded-lg border-2 mb-3 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
          }`}>
            
            {/* Header de Categoría */}
            <div className={`border-b px-3 py-2 rounded-t-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
            }`}>
              <h2 className={`text-sm font-bold text-center transition-colors duration-300 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>{category.name}</h2>
            </div>
            
            {/* Items de la Categoría */}
            <div className="p-2 space-y-1">
              {category.items.map((item) => (
                <div 
                  key={item.id}
                  className={`flex justify-between items-center p-1.5 border rounded transition-colors duration-300 ${
                    isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-xs">📷</span>
                    <div className="flex-1">
                      <h3 className={`font-medium text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>⭐ {item.name}</h3>
                      {item.description && (
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded border transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-200 bg-gray-800 border-blue-600' : 'text-blue-800 bg-white border-blue-300'
                  }`}>
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}