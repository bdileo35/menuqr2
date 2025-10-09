'use client';

import { useState, useEffect } from 'react';
import QRGenerator from '../components/QRGenerator';

interface UserData {
  uniqueId: string;
  restaurantName: string;
}

export default function QRGeneratorPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Buscar el usuario de Esquina Pompeya para obtener el uniqueId
        const response = await fetch('/api/user/esquina-pompeya');
        const data = await response.json();
        
        if (data.success && data.user) {
          setUserData({
            uniqueId: data.user.uniqueId,
            restaurantName: data.user.restaurantName
          });
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del restaurante...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">❌ No se encontraron datos del restaurante</p>
          <p className="text-gray-600">Asegúrate de que el seed se haya ejecutado correctamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Generador de QR Code
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Generator */}
          <div>
            <QRGenerator 
              uniqueId={userData.uniqueId}
              restaurantName={userData.restaurantName}
            />
          </div>

          {/* Instrucciones */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📋 Instrucciones
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800">1. Descargar QR</h3>
                <p className="text-sm">Haz clic en "Descargar QR" para guardar la imagen</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">2. Imprimir</h3>
                <p className="text-sm">Imprime el QR en tamaño 10x10 cm o más grande</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">3. Colocar</h3>
                <p className="text-sm">Pega el QR en mesas, mostrador o donde los clientes puedan escanearlo</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">4. Modalidades</h3>
                <p className="text-sm">Los clientes podrán elegir entre:</p>
                <ul className="text-sm ml-4 mt-2 space-y-1">
                  <li>• 📱 Pedido por WhatsApp</li>
                  <li>• 🏪 Pedido en Mostrador</li>
                  <li>• 🚚 Delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
