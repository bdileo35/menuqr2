'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  uniqueId: string;
  restaurantName: string;
}

export default function QRGenerator({ uniqueId, restaurantName }: QRGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = `https://menuqr-nine.vercel.app/${uniqueId}`;
        const qrCodeDataURL = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        setQrCodeUrl(qrCodeDataURL);
      } catch (error) {
        console.error('Error generando QR:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [uniqueId]);

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `QR-${restaurantName.replace(/\s+/g, '-')}-${uniqueId}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const copyUrl = () => {
    const url = `https://menuqr-nine.vercel.app/${uniqueId}`;
    navigator.clipboard.writeText(url);
    alert('✅ URL copiada al portapapeles!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Generando QR...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        QR Code - {restaurantName}
      </h2>
      
      <div className="text-center mb-4">
        <img 
          src={qrCodeUrl} 
          alt="QR Code" 
          className="mx-auto border-2 border-gray-200 rounded-lg"
        />
      </div>

      <div className="space-y-3">
        <button
          onClick={downloadQR}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          📥 Descargar QR
        </button>
        
        <button
          onClick={copyUrl}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          📋 Copiar URL
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <strong>URL:</strong><br />
          <span className="text-xs break-all">
            https://menuqr-nine.vercel.app/{uniqueId}
          </span>
        </p>
      </div>
    </div>
  );
}
