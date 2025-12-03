'use client';
import { useState } from 'react';
import { useAppTheme } from '../../../hooks/useAppTheme';
import PanelNavBar from './PanelNavBar';
import PanelDatos from './sections/PanelDatos';
// Los otros componentes se crearán después
// import PanelEditor from './sections/PanelEditor';
// import PanelQR from './sections/PanelQR';
// import PanelConfig from './sections/PanelConfig';

interface PanelContentProps {
  idUnico: string;
  user: any;
  onLogout: () => void;
}

type PanelSection = 'datos' | 'editor' | 'qr' | 'config';

export default function PanelContent({ idUnico, user, onLogout }: PanelContentProps) {
  const { isDarkMode } = useAppTheme();
  const [currentSection, setCurrentSection] = useState<PanelSection>('datos');

  const renderSection = () => {
    switch (currentSection) {
      case 'datos':
        return <PanelDatos idUnico={idUnico} />;
      case 'editor':
        return <div className="p-6">Editor (próximamente)</div>;
      case 'qr':
        return <div className="p-6">QR (próximamente)</div>;
      case 'config':
        return <div className="p-6">Config (próximamente)</div>;
      default:
        return <PanelDatos idUnico={idUnico} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🎛️ Panel de Control
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.restaurantName || idUnico}
            </p>
          </div>
          <button
            onClick={onLogout}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🚪 Salir
          </button>
        </div>
      </header>

      {/* Contenedor principal con NavBar */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Contenido de la sección actual */}
        <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          {renderSection()}
        </div>
      </div>

      {/* NavBar fijo en la parte inferior */}
      <PanelNavBar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
    </div>
  );
}



