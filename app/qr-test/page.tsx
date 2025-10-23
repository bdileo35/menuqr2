'use client';
import { useState } from 'react';
import QRGenerator from '../components/QRGenerator';

export default function QRTestPage() {
  const [idUnico, setIdUnico] = useState('5XJ1J37F');
  const [baseUrl, setBaseUrl] = useState('menuqrep.vercel.app');
  
  const qrValue = `https://${baseUrl}/carta-menu/${idUnico}`;
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 Test QR Generator</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Configuración QR</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base URL
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="menuqrep.vercel.app"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Único
              </label>
              <input
                type="text"
                value={idUnico}
                onChange={(e) => setIdUnico(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5XJ1J37F"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">URL del QR:</p>
            <code className="text-blue-600 font-mono break-all">{qrValue}</code>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">QR Code Preview</h2>
          
          <div className="flex justify-center">
            <QRGenerator value={qrValue} size={200} />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              Este QR llevará a: <strong>{qrValue}</strong>
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(qrValue);
                  alert('URL copiada al portapapeles!');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📋 Copiar URL
              </button>
              
              <a
                href={qrValue}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🔗 Probar Link
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">📝 Notas del Test:</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• Este es un simulacro para probar el flujo QR</li>
            <li>• El QR apunta a: <code>menuqrep.vercel.app/carta-menu/{idUnico}</code></li>
            <li>• Una vez funcional, se integrará al Shop con Mercado Pago</li>
            <li>• El IDUnico se generará después del pago exitoso</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
