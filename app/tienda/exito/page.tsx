'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QRGenerator from '../../components/QRGenerator';

export default function TiendaExitoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [idUnico, setIdUnico] = useState<string>('');
  const [plan, setPlan] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');

  useEffect(() => {
    // Obtener parámetros de la URL
    const idUnicoParam = searchParams.get('idUnico') || '';
    const planParam = searchParams.get('plan') || '';
    const precioParam = searchParams.get('precio') || '';
    const descripcionParam = searchParams.get('descripcion') || '';

    setIdUnico(idUnicoParam);
    setPlan(planParam);
    setPrecio(precioParam);
    setDescripcion(decodeURIComponent(descripcionParam));

    // Generar ID único si no viene en los parámetros
    if (!idUnicoParam) {
      const nuevoIdUnico = generarIdUnico();
      setIdUnico(nuevoIdUnico);
      console.log('🆔 ID único generado:', nuevoIdUnico);
    }
  }, [searchParams]);

  const generarIdUnico = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const qrUrl = `https://menuqrep.vercel.app/carta-menu/${idUnico}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    alert('¡Link copiado al portapapeles!');
  };

  const handleTestLink = () => {
    window.open(qrUrl, '_blank');
  };

  const handleGoToMenu = () => {
    router.push(`/carta-menu/${idUnico}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Card principal */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Header verde de éxito */}
          <div className="bg-green-600 p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-green-100 text-sm">
              Tu {descripcion || 'MenuQR'} está listo
            </p>
          </div>

          {/* Contenido principal */}
          <div className="p-6 bg-gray-800">
            
            {/* Información del plan */}
            <div className="mb-6">
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">📋 Detalles del pedido:</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="text-green-400 font-medium">{plan || 'Mensual'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio:</span>
                    <span className="text-green-400 font-medium">${precio || '14,999'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID Único:</span>
                    <span className="text-blue-400 font-mono text-xs">{idUnico}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3 text-center">🔗 Tu QR Code:</h3>
              <div className="flex justify-center mb-4">
                <QRGenerator 
                  value={qrUrl} 
                  size={200}
                  className="border-2 border-gray-600 rounded-lg"
                />
              </div>
              
              <div className="bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-400 mb-2">URL del menú:</p>
                <p className="text-xs text-blue-400 break-all font-mono">
                  {qrUrl}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>📋</span>
                <span>Copiar Link</span>
              </button>
              
              <button
                onClick={handleTestLink}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>🔗</span>
                <span>Probar Link</span>
              </button>
              
              <button
                onClick={handleGoToMenu}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>🍽️</span>
                <span>Ver Mi Menú</span>
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 mb-2">
                💡 Guarda este QR para acceder a tu menú digital
              </p>
              <p className="text-xs text-gray-400">
                Puedes personalizar tu menú desde el editor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}