'use client';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function AyudaPage() {
  const params = useParams();
  const idUnico = params?.idUnico as string;
  const { isDarkMode } = useAppTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 pb-24">
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ❓ Ayuda
        </h1>
        
        <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-6`}>
          <div>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              📖 Guía Rápida
            </h2>
            <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• <strong>Datos:</strong> Configura los datos básicos de tu comercio</li>
              <li>• <strong>Editor:</strong> Administra tu menú, categorías y platos</li>
              <li>• <strong>QR:</strong> Genera y descarga tu código QR</li>
              <li>• <strong>Pedidos:</strong> Gestiona los pedidos de tus clientes</li>
              <li>• <strong>Config:</strong> Ajustes adicionales del sistema</li>
            </ul>
          </div>

          <div>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              💡 Consejos
            </h2>
            <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Sube imágenes de tus platos para hacer el menú más atractivo</li>
              <li>• Organiza tus platos en categorías para facilitar la navegación</li>
              <li>• Mantén los precios actualizados</li>
              <li>• Comparte tu QR con tus clientes</li>
            </ul>
          </div>

          <div>
            <h2 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              📞 Soporte
            </h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Si necesitas ayuda adicional, contacta a nuestro equipo de soporte.
            </p>
          </div>
        </div>
      </div>
      
      <NavBar idUnico={idUnico} />
    </div>
  );
}

