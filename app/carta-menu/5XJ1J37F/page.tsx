'use client';
import { useEffect, useState } from 'react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { getDemoMenuData } from '../../../lib/demo-data';

interface MenuItem {
  id?: string;
  name: string;
  price: string;
  description?: string;
  isAvailable?: boolean;
}

interface MenuCategory {
  id?: string;
  name: string;
  items: MenuItem[];
}

interface RestaurantData {
  restaurantName: string;
  address: string;
  phone: string;
  categories: MenuCategory[];
}

export default function EsquinaPompeyaPage() {
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useAppTheme();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        // Intentar cargar desde API real
        const response = await fetch('/api/menu/5XJ1J37F');
        const data = await response.json();
        
        if (data.success && data.menu) {
          console.log('✅ Menú cargado desde API real');
          const restaurantInfo: RestaurantData = {
            restaurantName: data.menu.restaurantName,
            address: data.menu.contactAddress || 'Av. Corrientes 1234, Buenos Aires',
            phone: data.menu.contactPhone || '+54 11 1234-5678',
            categories: data.menu.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              items: cat.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: `$${item.price}`,
                description: item.description,
                isAvailable: item.isAvailable
              }))
            }))
          };
          setMenuData(restaurantInfo);
        } else {
          throw new Error('No se pudo cargar desde API');
        }
      } catch (error) {
        console.error('❌ Error cargando desde API, usando demo:', error);
        // Fallback a datos demo
        const demoData = getDemoMenuData();
        const restaurantInfo: RestaurantData = {
          restaurantName: 'Esquina Pompeya',
          address: 'Av. Corrientes 1234, Buenos Aires',
          phone: '+54 11 1234-5678',
          categories: demoData.categories
        };
        setMenuData(restaurantInfo);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando carta digital...</p>
          <p className="text-gray-400 text-sm mt-2">Esquina Pompeya</p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">⚠️ Menú no encontrado</h1>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className={`border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 pt-1 pb-2">
          
          {/* LÍNEA 1: Título Panel de Control */}
          <div className="flex items-center justify-between mb-3">
            
            {/* IZQUIERDA: Logo + Título */}
            <div className="flex items-center gap-3">
              <img 
                src="/demo-images/logo.png?v=2" 
                alt="Logo Esquina Pompeya"
                className="w-12 h-12 rounded-lg object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/demo-images/Logo.jpg?v=2';
                }}
              />
              <div>
                <h1 className="text-lg font-bold">Esquina Pompeya</h1>
                <p className="text-sm text-gray-500">Carta Digital</p>
              </div>
            </div>

            {/* DERECHA: Botones de Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Información del Restaurante */}
        <div className={`rounded-lg p-4 mb-6 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-3">Información del Restaurante</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nombre:</span> {menuData.restaurantName}
            </div>
            <div>
              <span className="font-medium">Dirección:</span> {menuData.address}
            </div>
            <div>
              <span className="font-medium">Teléfono:</span> {menuData.phone}
            </div>
            <div>
              <span className="font-medium">ID Único:</span> <span className="text-blue-500 font-mono">5XJ1J37F</span>
            </div>
          </div>
        </div>

        {/* Categorías del Menú */}
        <div className={`rounded-lg p-4 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold mb-4">Categorías del Menú</h2>
          
          {menuData.categories.map((category, categoryIndex) => (
            <div key={category.id || categoryIndex} className="mb-6">
              <h3 className="text-base font-semibold mb-2 text-blue-600">
                {category.name} ({category.items.length} productos)
              </h3>
              
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <div key={item.id || itemIndex} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                      )}
                    </div>
                    <div className="text-blue-600 font-semibold">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
