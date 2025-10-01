'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Page4() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con navegación */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <button 
          onClick={() => router.push('/demo-flow/page3')}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          ← Anterior
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold">MenuQR Demo</h1>
          <p className="text-gray-300">Paso 4 de 5</p>
        </div>

        <button 
          onClick={() => router.push('/demo-flow/page5')}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors"
        >
          Siguiente →
        </button>
      </div>

      {/* Contenido principal - Imagen */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <Image
            src="/page4.jpg"
            alt="Paso 4: Personalización"
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      </div>

      {/* Navegación inferior */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-8 h-2 bg-gray-600 rounded"></div>
          <div className="w-8 h-2 bg-gray-600 rounded"></div>
          <div className="w-8 h-2 bg-gray-600 rounded"></div>
          <div className="w-8 h-2 bg-blue-500 rounded"></div>
          <div className="w-8 h-2 bg-gray-600 rounded"></div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => router.push('/demo-flow/page3')}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            ← Anterior
          </button>
          <button 
            onClick={() => router.push('/demo-flow/page5')}
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors font-semibold"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}