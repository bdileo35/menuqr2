"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIAS_DEFAULT = [
  {
    id: 'principales',
    name: 'PLATOS PRINCIPALES',
    icon: '🍽️',
    items: []
  },
  {
    id: 'empanadas',
    name: 'EMPANADAS',
    icon: '🥟',
    items: []
  },
  {
    id: 'bebidas',
    name: 'BEBIDAS',
    icon: '🥤',
    items: []
  },
  {
    id: 'postres',
    name: 'POSTRES',
    icon: '🍰',
    items: []
  }
];

export default function GeneradorPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState(CATEGORIAS_DEFAULT);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header con borde verde */}
      <div className="border-2 border-green-500 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Generador de tu Carta/Menu
          </h1>
          
          {/* Categorías */}
          <div className="space-y-6">
            {categorias.map((categoria) => (
              <div 
                key={categoria.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{categoria.icon}</span>
                  <h2 className="text-xl font-bold">{categoria.name}</h2>
                </div>
                
                {/* Contenido de la categoría - vacío por ahora */}
                <div className="bg-gray-700 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
                  <p className="text-gray-400 text-sm">
                    Los elementos aparecerán aquí después del procesamiento OCR
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push('/scanner')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              📷 Digitalizar Carta
            </button>
            <button
              onClick={() => router.push('/demo/carta-final')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              ✨ Ver Demo Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
