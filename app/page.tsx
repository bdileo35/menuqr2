"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full card-qring">
        
        {/* Header estilo QRing profesional */}
        <div className="card-qring-header">
          <div className="border-2 border-white/20 border-dashed p-4 rounded-lg backdrop-blur-sm">
            <h1 className="text-2xl font-bold mb-2 text-white">
              🍽️ MenuQR
            </h1>
            <p className="text-blue-100 font-medium">
              DIGITALIZACIÓN INTELIGENTE
            </p>
            <p className="text-sm text-blue-200 mt-1">
              Cartas Digitales & Scanner OCR
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          
          {/* Sección PLATOS DEL DIA - Estilo QRing sobrio */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-slate-50 border-l-4 border-blue-600 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2 text-center">
              📅 PLATOS DEL DIA
            </h2>
            <p className="text-sm text-blue-700 text-center">
              Especialidades frescas y promociones diarias
            </p>
          </div>

          {/* Sección PROMOS - Estilo QRing sobrio */}
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-slate-50 border-l-4 border-emerald-600 rounded-lg">
            <h2 className="text-lg font-semibold text-emerald-900 mb-2 text-center">
              🎯 PROMOS DE LA SEMANA
            </h2>
            <div className="text-sm text-emerald-700 space-y-1">
              <p className="text-center font-medium">PROMO 1: Milanesa c/Papas + Postre</p>
              <p className="text-center font-medium">PROMO 2: Salpicón de Ave + Postre + Bebida</p>
            </div>
          </div>

          {/* Botones de navegación - Estilo QRing */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/menu/esquina-pompeya')}
              className="btn-qring-primary w-full"
              disabled={isLoading}
            >
              🍽️ Ver Menú Digital - Esquina Pompeya
            </button>

            <button
              onClick={() => router.push('/scanner')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border-2 border-blue-500"
              disabled={isLoading}
            >
              📷 Digitalizar Mi Carta (OCR Scanner)
            </button>

            <button
              onClick={() => router.push('/admin/login')}
              className="btn-qring-secondary w-full"
              disabled={isLoading}
            >
              🔑 Panel de Control
            </button>

            <button
              onClick={() => router.push('/admin/register')}
              className="btn-qring-outline w-full"
              disabled={isLoading}
            >
              ✨ Crear Mi Restaurante
            </button>

            <button
              onClick={() => router.push('/qr-shop')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              disabled={isLoading}
            >
              🛒 QR-Shop • Ver Toda la Suite
            </button>
          </div>

          {/* Footer con características - Estilo QRing */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 text-center">🚀 Características MenuQR:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center space-x-1">
                <span className="text-blue-600">✅</span>
                <span>Scanner OCR Automático</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-600">✅</span>
                <span>Pedidos por WhatsApp</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-600">✅</span>
                <span>Panel de Control</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-600">✅</span>
                <span>QR Codes Dinámicos</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-600">✅</span>
                <span>Diseño Personalizable</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-600">✅</span>
                <span>Compatible QRing Suite</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}