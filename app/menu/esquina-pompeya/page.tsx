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
    const mockMenuData: MenuCategory[] = [
      {
        id: '1',
        name: 'PLATOS DEL DIA',
        priority: 1,
        items: [
          { id: '1', name: 'Milanesas al horno c/ Puré', price: '$9000', hasImage: true, isSpecial: true },
          { id: '2', name: 'Croquetas de carne c/ensalada', price: '$8000', hasImage: true, isSpecial: true },
          { id: '3', name: 'Chuleta de merluza c/rusa gatura', price: '$10000', hasImage: true, isSpecial: true },
          { id: '4', name: 'Pechuga rellena c/ f. españolas', price: '$12000', hasImage: true, isSpecial: true },
          { id: '5', name: 'Mejillones c/ fetuccinis', price: '$14000', hasImage: true, isSpecial: true },
          { id: '6', name: 'Vacío a la parrilla c/fritas', price: '$15000', hasImage: true, isSpecial: true },
          { id: '7', name: 'Peceto al verdeo c/ Puré', price: '$15000', hasImage: true, isSpecial: true }
        ]
      },
      {
        id: '2', 
        name: 'PROMOS',
        priority: 2,
        items: [
          { id: '8', name: 'PROMO 1: Milanesa Completa', price: '$12000', hasImage: true, isPromo: true },
          { id: '9', name: 'PROMO 2: Salpicón de Ave', price: '$12000', hasImage: true, isPromo: true }
        ]
      },
      {
        id: '3',
        name: 'EMPANADAS',
        priority: 3,
        items: [
          { id: '10', name: 'Carne - Pollo - J y Q', price: '$600', description: 'Docena', hasImage: true },
          { id: '11', name: 'Atún, Chía', price: '$800', description: 'Docena', hasImage: true }
        ]
      }
    ];

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

      <div className="max-w-6xl mx-auto px-4 py-3">
        
        {/* PLATOS DEL DIA */}
        <div className={`rounded-lg border-2 mb-4 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-blue-600' : 'bg-white border-blue-300'
        }`}>
          <div className={`border-b px-4 py-2 rounded-t-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-100 border-blue-200'
          }`}>
            <h2 className={`text-lg font-bold text-center transition-colors duration-300 ${
              isDarkMode ? 'text-blue-200' : 'text-blue-900'
            }`}>PLATOS DEL DIA</h2>
          </div>
          
          <div className="p-2">
            {menuData.find(cat => cat.name === 'PLATOS DEL DIA')?.items.map((item) => (
              <div 
                key={item.id}
                className={`flex justify-between items-center p-2 mb-1 border rounded transition-colors duration-300 ${
                  isDarkMode ? 'border-blue-700 bg-blue-900/30' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors duration-300 ${
                    isDarkMode ? 'bg-blue-800' : 'bg-blue-200'
                  }`}>
                    <span className="text-xs">📷</span>
                  </div>
                  <h3 className={`font-semibold text-sm flex-1 transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-100' : 'text-blue-900'
                  }`}>⭐ {item.name}</h3>
                  <div className={`text-base font-bold px-2 py-1 rounded border transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-200 bg-gray-800 border-blue-600' : 'text-blue-800 bg-white border-blue-300'
                  }`}>
                    {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROMOS */}
        <div className={`rounded-lg border-2 mb-4 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-slate-600' : 'bg-white border-slate-300'
        }`}>
          <div className={`border-b px-4 py-2 rounded-t-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}>
            <h2 className={`text-lg font-bold text-center transition-colors duration-300 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>PROMOS • Incluyen bebida y postre</h2>
          </div>
          
          <div className="p-3">
            <div className="grid grid-cols-2 gap-3">
              {menuData.find(cat => cat.name === 'PROMOS')?.items.map((item) => (
                <div 
                  key={item.id}
                  className={`border rounded-lg p-3 transition-colors duration-300 ${
                    isDarkMode ? 'border-slate-600 bg-slate-800/50' : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="w-full h-24 rounded-lg mx-auto mb-2">
                    <div className={`w-full h-full rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                    }`}>
                      <span className="text-sm">📷</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className={`font-semibold text-xs mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>🎯 {item.name}</h3>
                    <div className={`text-lg font-bold py-1 rounded border transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-200 bg-gray-800 border-slate-600' : 'text-slate-700 bg-white border-slate-300'
                    }`}>
                      {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EMPANADAS */}
        <div className={`rounded-lg border-2 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          <div className={`border-b-2 px-4 py-2 rounded-t-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
          }`}>
            <h2 className={`text-base font-bold text-center transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>EMPANADAS</h2>
          </div>
          
          <div className="p-2">
            {menuData.find(cat => cat.name === 'EMPANADAS')?.items.map((item) => (
              <div 
                key={item.id}
                className={`flex justify-between items-center p-2 mb-1 border rounded transition-colors duration-300 ${
                  isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors duration-300 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <span className="text-xs">📷</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>{item.name}</h3>
                    {item.description && (
                      <p className={`text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{item.description}</p>
                    )}
                  </div>
                  <div className={`text-xs font-bold px-1 py-1 rounded border transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300 bg-gray-800 border-gray-600' : 'text-gray-700 bg-white border-gray-300'
                  }`}>
                    {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}