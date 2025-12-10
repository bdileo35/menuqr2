'use client';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function PedidosPage() {
  const params = useParams();
  const idUnico = params?.idUnico as string;
  const { isDarkMode } = useAppTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 pb-24">
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🍽️ Pedidos
        </h1>
        
        <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            Sistema de gestión de pedidos
          </p>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <h2 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🍳 Cocina
              </h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Ver pedidos pendientes y en preparación
              </p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                En desarrollo...
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h2 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                💰 Caja
              </h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Ver pedidos listos para cobro
              </p>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                En desarrollo...
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <NavBar idUnico={idUnico} />
    </div>
  );
}

