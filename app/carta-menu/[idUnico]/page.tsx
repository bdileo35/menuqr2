'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function CartaMenuByIdPage() {
  const params = useParams();
  const idUnico = params.idUnico as string;
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useAppTheme();

  useEffect(() => {
    const loadMenuById = async () => {
      console.log('🔍 Cargando menú para ID:', idUnico);
      
      try {
        // Llamar a la API dinámica con el ID único
        const response = await fetch(`/api/menu/${idUnico}`);
        const data = await response.json();
        
        if (data.success && data.menu) {
          console.log('✅ Menú cargado desde API:', data.menu);
          
          const restaurantInfo: RestaurantData = {
            restaurantName: data.menu.restaurantName,
            address: data.menu.contactAddress || 'Dirección no especificada',
            phone: data.menu.contactPhone || 'Teléfono no especificado',
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
          throw new Error('No se pudo cargar el menú desde la API');
        }
      } catch (error) {
        console.error('❌ Error cargando menú desde API:', error);
        
        // Fallback a datos demo si falla la API
        console.log('⚠️ Usando datos demo como fallback...');
        const demoData = getDemoMenuData();
        const restaurantInfo: RestaurantData = {
          restaurantName: `Restaurante Demo (${idUnico})`,
          address: 'Av. Corrientes 1234, Buenos Aires',
          phone: '+54 11 1234-5678',
          categories: demoData.categories
        };
        setMenuData(restaurantInfo);
      } finally {
        setLoading(false);
      }
    };

    if (idUnico) {
      loadMenuById();
    }
  }, [idUnico]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando carta digital...</p>
          <p className="text-gray-400 text-sm mt-2">ID: {idUnico}</p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">⚠️ Menú no encontrado</h1>
          <p className="text-gray-400 mb-6">ID: {idUnico}</p>
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {menuData.restaurantName}
              </h1>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                ID Único: {idUnico}
              </p>
            </div>
            
            <button 
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Información del Restaurante</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Nombre:</p>
              <p className="font-medium text-gray-900">{menuData.restaurantName}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Dirección:</p>
              <p className="font-medium text-gray-900">{menuData.address}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Teléfono:</p>
              <p className="font-medium text-gray-900">{menuData.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">ID Único:</p>
              <p className="font-medium text-blue-600 font-mono">{idUnico}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🍽️ Categorías del Menú</h2>
          <div className="space-y-4">
            {menuData.categories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{category.items.length} productos</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.items.slice(0, 4).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-1">
                      <span className="text-gray-800 text-sm">{item.name}</span>
                      <span className="text-blue-600 font-medium text-sm">{item.price}</span>
                    </div>
                  ))}
                  {category.items.length > 4 && (
                    <div className="text-gray-500 text-sm italic">
                      ... y {category.items.length - 4} productos más
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-4">
            Esta es una vista previa del menú para el ID único: <strong>{idUnico}</strong>
          </p>
          <p className="text-gray-500 text-xs">
            En la versión completa, aquí se mostraría el menú completo con funcionalidades de pedido
          </p>
        </div>
      </div>
    </div>
  );
}
