"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueId, setUniqueId] = useState("5XJ1J37F"); // Demo ID para Esquina Pompeya

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Card principal */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Header verde */}
          <div className="bg-green-600 p-6 text-center">
            <div className="text-4xl mb-2">🍽️</div>
            <h1 className="text-2xl font-bold text-white mb-1">
              MenuQR
            </h1>
            <p className="text-green-100 text-sm mb-3">
              Cartas Digitales + Scanner OCR
            </p>
            <p className="text-3xl font-bold text-white">
              $14999/mes
            </p>
            <p className="text-lg text-green-100">
              $149990/año
            </p>
          </div>

          {/* Contenido principal */}
          <div className="p-6 bg-gray-800">
            
            {/* Descripción */}
            <p className="text-white text-center mb-6">
              Digitaliza tu carta física automáticamente y crea menús digitales profesionales
            </p>

            {/* Características */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✅</span>
                <span className="text-white text-sm">Scanner OCR automático</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✅</span>
                <span className="text-white text-sm">Menús digitales responsivos</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✅</span>
                <span className="text-white text-sm">Pedidos por WhatsApp</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-500">✅</span>
                <span className="text-white text-sm">Panel de gestión</span>
              </div>
            </div>

            {/* ID único en una línea */}
            <div className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  placeholder="Ingresa tu ID único (ej: 5XJ1J37F)"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => router.push('/editor')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ir
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/carta-menu')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                <span>💎</span>
                <span>Ver Demo Carta/Menu</span>
              </button>

              <button
                onClick={() => router.push('/comprar')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-500"
                disabled={isLoading}
              >
                <span>💳</span>
                <span>Comprar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}