'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import QRGenerator from './QRGenerator';

interface QRWithActionsProps {
  qrUrl: string;
  isDarkMode?: boolean;
  title?: string;            // Nombre del comercio
  showTitle?: boolean;       // Mostrar título arriba del QR
  showLegend?: boolean;      // Mostrar leyenda debajo del QR
  legendText?: string;       // Texto de la leyenda
  variant?: 'plain' | 'framed';
}

export default function QRWithActions({
  qrUrl,
  isDarkMode = true,
  title,
  showTitle = false,
  showLegend = true,
  legendText = 'Escanear para ver la Carta'
  ,variant = 'plain'
}: QRWithActionsProps) {
  const router = useRouter();
  const qrWrapperRef = useRef<HTMLButtonElement | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Copiar link (fallback final)
  const handleCopyLink = () => navigator.clipboard.writeText(qrUrl);

  const handleTestLink = () => {
    window.open(qrUrl, '_blank');
  };

  const handleGoToMenu = () => {
    // Extraer el idUnico de la URL (acepta /carta o /carta-menu)
    const match = qrUrl.match(/\/(?:carta|carta-menu)\/([A-Za-z0-9\-_.]+)/);
    if (match) {
      router.push(`/carta/${match[1]}`);
    }
  };

  const handleShareOrSave = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: title || 'Carta', url: qrUrl, text: 'Escanear para ver la carta' });
        return;
      }
    } catch (_) {}

    try {
      // Fallback: descargar imagen del QR
      const canvas = qrWrapperRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qr-carta${title ? '-' + title.replace(/\s+/g, '-') : ''}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
    } catch (_) {}

    try {
      // Último recurso: copiar link
      await navigator.clipboard.writeText(qrUrl);
      alert('Link copiado al portapapeles');
    } catch (_) {}
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center md:items-start">
        {/* QR Code */}
        <button
          onClick={handleTestLink}
          title="Abrir carta"
          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          ref={qrWrapperRef}
        >
          {showTitle && (
            <div className={`text-center mb-2 text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </div>
          )}
          {variant === 'plain' ? (
            <div className={`rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <QRGenerator value={qrUrl} size={240} bare margin={false} />
            </div>
          ) : (
            <div className="relative" style={{ width: 300 }}>
              {/* Laptop base */}
              <div className="mx-auto" style={{ width: 300, height: 220 }}>
                {/* Pantalla */}
                <div
                  className="mx-auto rounded-md"
                  style={{
                    width: 280,
                    height: 180,
                    border: `6px solid #000`,
                    background: '#ffffff'
                  }}
                >
                  {/* Área blanca segura para QR */}
                  <div className="flex items-center justify-center w-full h-full">
                    <QRGenerator value={qrUrl} size={175} bare margin={false} />
                  </div>
                </div>
                {/* Base */}
                <div className="mx-auto rounded-b-lg" style={{ width: 280, height: 12, background: '#000' }} />
                {/* Soporte */}
                <div className="mx-auto mt-1" style={{ width: 170, height: 12, background: '#000', borderRadius: 9999 }} />
              </div>
            </div>
          )}
          {showLegend && (
            <div className={`mt-2 text-center text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {legendText}
            </div>
          )}
        </button>
        
        {/* Botones */}
        <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>🖼️</span>
            <span>Vista previa</span>
          </button>
          
          <button
            onClick={handleShareOrSave}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>📤</span>
            <span>Compartir/Guardar</span>
          </button>
        </div>
      </div>
      {/* Modal vista previa */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          {/* Etiqueta según variante */}
          {variant === 'framed' ? (
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Encabezado estrecho */}
              <div className="px-4 py-2 border-b bg-gray-100 text-center">
                {title && <div className="text-base font-bold text-gray-800">{title}</div>}
              </div>
              {/* Cuerpo: QR en soporte */}
              <div className="p-4 flex items-center justify-center">
                <div className="relative" style={{ width: 300 }}>
                  <div className="mx-auto" style={{ width: 300, height: 220 }}>
                    <div className="mx-auto rounded-md" style={{ width: 280, height: 180, border: '6px solid #000', background: '#ffffff' }}>
                      <div className="flex items-center justify-center w-full h-full">
                        <QRGenerator value={qrUrl} size={175} bare margin={false} />
                      </div>
                    </div>
                    <div className="mx-auto rounded-b-lg" style={{ width: 280, height: 12, background: '#000' }} />
                    <div className="mx-auto mt-1" style={{ width: 170, height: 12, background: '#000', borderRadius: 9999 }} />
                  </div>
                </div>
              </div>
              {showLegend && (
                <div className="px-4 py-2 border-t bg-gray-100 text-center text-xs text-gray-600">{legendText}</div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[260px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-4 py-2 border-b bg-gray-100 text-center">
                {title && <div className="text-base font-bold text-gray-800">{title}</div>}
              </div>
              <div className="p-3 flex items-center justify-center">
                <QRGenerator value={qrUrl} size={200} bare margin={false} />
              </div>
              {showLegend && (
                <div className="px-4 py-2 border-t bg-gray-100 text-center text-xs text-gray-600">{legendText}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
