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
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel: number;
  allergens?: string;
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
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchMenu = async () => {
      if (!restaurantId) return;

      try {
        const response = await fetch(`/api/menus/restaurant/${restaurantId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setMenu(data.menu);
          if (data.menu.categories.length > 0) {
            setSelectedCategory(data.menu.categories[0].id);
          }
        } else {
          setError(data.error || 'Menú no encontrado');
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Error al cargar el menú');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Menú no encontrado
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'El restaurante que buscas no existe o no está disponible.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const selectedCategoryData = menu.categories.find(cat => cat.id === selectedCategory);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: menu.backgroundColor,
        color: menu.textColor 
      }}
    >
      {/* Header del restaurante */}
      <div 
        className="text-white p-6 text-center"
        style={{ backgroundColor: menu.primaryColor }}
      >
        {menu.logoUrl && (
          <img 
            src={menu.logoUrl} 
            alt={menu.restaurantName}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <h1 className="text-2xl font-bold">{menu.restaurantName}</h1>
        {menu.description && (
          <p className="mt-2 text-blue-100">{menu.description}</p>
        )}
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Navegación de categorías */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          {menu.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={
                selectedCategory === category.id
                  ? { backgroundColor: menu.primaryColor }
                  : {}
              }
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Items de la categoría seleccionada */}
        {selectedCategoryData && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">{selectedCategoryData.name}</h2>
            
            {selectedCategoryData.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      {item.isPopular && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                      {item.isVegetarian && <span className="text-green-600">🌱</span>}
                      {item.isVegan && <span className="text-green-600">🌿</span>}
                      {item.spicyLevel > 0 && (
                        <span className="text-red-500">
                          {'🌶️'.repeat(item.spicyLevel)}
                        </span>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    )}
                    
                    {item.allergens && (
                      <p className="text-xs text-gray-500 mb-2">
                        <strong>Alérgenos:</strong> {item.allergens}
                      </p>
                    )}
                    
                    {menu.showPrices && (
                      <div className="flex items-center space-x-2">
                        <span 
                          className="font-bold text-lg"
                          style={{ color: menu.primaryColor }}
                        >
                          {menu.currency}{item.price}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-gray-500 line-through text-sm">
                            {menu.currency}{item.originalPrice}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {item.preparationTime && (
                      <p className="text-xs text-gray-500 mt-1">
                        ⏰ {item.preparationTime} min
                      </p>
                    )}
                  </div>
                  
                  {menu.showImages && item.imageUrl && (
                    <img 
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover ml-4"
                    />
                  )}
                </div>
              </div>
            ))}
            
            {selectedCategoryData.items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No hay items disponibles en esta categoría</p>
              </div>
            )}
          </div>
        )}

        {/* Footer con información de contacto */}
        {(menu.contactPhone || menu.contactEmail || menu.contactAddress) && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold text-gray-800 mb-3">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {menu.contactPhone && (
                <p>📞 <a href={`tel:${menu.contactPhone}`}>{menu.contactPhone}</a></p>
              )}
              {menu.contactEmail && (
                <p>✉️ <a href={`mailto:${menu.contactEmail}`}>{menu.contactEmail}</a></p>
              )}
              {menu.contactAddress && (
                <p>📍 {menu.contactAddress}</p>
              )}
            </div>
          </div>
        )}

        {/* Footer branding */}
        <div className="text-center mt-8 py-4 text-gray-500 text-sm">
          <p>🍽️ Powered by <strong>MenuQR</strong></p>
          <p>Menú digital creado con ❤️</p>
        </div>
      </div>
    </div>
  );
}