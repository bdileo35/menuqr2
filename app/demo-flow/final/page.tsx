'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Final() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con navegación */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <button 
          onClick={() => router.push('/demo-flow/page5')}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          ← Volver al Paso 5
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold">🎉 ¡MenuQR Completado!</h1>
          <p className="text-gray-300">Resultado Final - Esquina Pompeya</p>
        </div>

        <button 
          onClick={() => router.push('/menu/esquina-pompeya')}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors"
        >
          Abrir Menú Funcional →
        </button>
      </div>

      {/* Contenido principal - Imagen */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <Image
            src="/final.jpg"
            alt="Resultado Final: Carta Digital Esquina Pompeya"
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg shadow-2xl border-2 border-green-500"
          />
        </div>
      </div>

      {/* Navegación inferior */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-green-400 font-semibold">✅ Demo Completada</div>
          <div className="flex space-x-2">
            <div className="w-8 h-2 bg-green-500 rounded"></div>
            <div className="w-8 h-2 bg-green-500 rounded"></div>
            <div className="w-8 h-2 bg-green-500 rounded"></div>
            <div className="w-8 h-2 bg-green-500 rounded"></div>
            <div className="w-8 h-2 bg-green-500 rounded"></div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => router.push('/demo-flow/page1')}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            🔄 Reiniciar Demo
          </button>
          <button 
            onClick={() => router.push('/menu/esquina-pompeya')}
            className="px-6 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors font-semibold"
          >
            🚀 Abrir Menú Real →
          </button>
        </div>
      </div>
    </div>
  );
}