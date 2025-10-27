'use client';
import { useRouter } from 'next/navigation';
import QRGenerator from './QRGenerator';

interface QRWithActionsProps {
  qrUrl: string;
  isDarkMode?: boolean;
}

export default function QRWithActions({ qrUrl, isDarkMode = true }: QRWithActionsProps) {
  const router = useRouter();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    alert('¡Link copiado al portapapeles!');
  };

  const handleTestLink = () => {
    window.open(qrUrl, '_blank');
  };

  const handleGoToMenu = () => {
    // Extraer el idUnico de la URL
    const match = qrUrl.match(/\/carta-menu\/([A-Z0-9]+)/);
    if (match) {
      router.push(`/carta-menu/${match[1]}`);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center md:items-start">
        {/* QR Code */}
        <div className="flex-shrink-0">
          <QRGenerator 
            value={qrUrl} 
            size={200}
            className={`border-2 rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
          />
        </div>
        
        {/* Botones de acción - ocupando toda la altura del QR */}
        <div className="flex flex-col gap-2 flex-1 w-full md:w-auto md:h-[200px]">
          <button
            onClick={handleCopyLink}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>📋</span>
            <span>Copiar</span>
          </button>
          
          <button
            onClick={handleTestLink}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>🔗</span>
            <span>Probar</span>
          </button>
          
          <button
            onClick={handleGoToMenu}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>🍽️</span>
            <span>Ver Menú</span>
          </button>
        </div>
      </div>
      
      {/* URL del menú */}
      <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <p className={`text-xs break-all font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {qrUrl}
        </p>
      </div>
    </div>
  );
}
