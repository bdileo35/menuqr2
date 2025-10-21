'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id?: string;
  name: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
  code?: string;
  imageUrl?: string;
}

interface MenuCategory {
  id?: string;
  name: string;
  items: MenuItem[];
  code?: string;
}

interface RestaurantData {
  restaurantName: string;
  categories: MenuCategory[];
}

export default function MenuByUniqueId({ params }: { params: { uniqueId: string } }) {
  const router = useRouter();
  const [menuData, setMenuData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/menu/unique/${params.uniqueId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.menu) {
            setMenuData(data.menu);
          } else {
            setError('No se pudo cargar el menú');
          }
        } else {
          setError('Menú no encontrado');
        }
      } catch (error) {
        console.error('Error cargando menú:', error);
        setError('Error al cargar el menú');
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [params.uniqueId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Cargando menú...</p>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-2">Menú no encontrado</h1>
          <p className="text-gray-300 mb-4">El ID único "{params.uniqueId}" no existe</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="mb-4 text-white/80 hover:text-white transition-colors"
          >
            ← Volver
          </button>
          <h1 className="text-2xl font-bold">{menuData.restaurantName}</h1>
          <p className="text-blue-100">ID: {params.uniqueId}</p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto p-4">
        {menuData.categories.map((category) => (
          <div key={category.id || category.name} className="mb-8">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-bold text-blue-400 mb-2">
                {category.code && <span className="text-gray-400 mr-2">{category.code}</span>}
                {category.name}
              </h2>
            </div>

            <div className="grid gap-3">
              {category.items.map((item, itemIndex) => (
                <div
                  key={item.id || itemIndex}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {item.code && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                            {item.code}
                          </span>
                        )}
                        <h3 className="font-semibold text-white">{item.name}</h3>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                      )}
                      
                      <div className="text-blue-400 font-bold">
                        ${item.price}
                      </div>
                    </div>

                    {item.imageUrl && (
                      <div className="ml-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                    )}
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
