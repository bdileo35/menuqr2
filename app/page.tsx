"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueId] = useState("5XJ1J37F"); // Demo

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Card MenuQR con comparativa y precios */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-green-600 p-6 text-center">
            <div className="text-4xl mb-2">🍽️</div>
            <h1 className="text-2xl font-bold text-white mb-1">MenuQR</h1>
            <p className="text-green-100 text-sm mb-3">Cartas Digitales + Scanner OCR</p>
            <div className="text-white font-bold">
              <div className="text-3xl">$13999/mes</div>
              <div className="text-lg text-green-100">$139990/año • pagás 10 meses, ahorrás 2</div>
            </div>
          </div>
          <div className="p-6 bg-gray-800">
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-gray-100">
                    <th className="text-left px-3 py-2">Función</th>
                    <th className="px-3 py-2">MenuQR</th>
                    <th className="px-3 py-2">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {[
                    { f: 'Menús responsivos', b: true, p: true },
                    { f: 'Scanner OCR automático', b: true, p: true },
                    { f: 'Pedidos por WhatsApp', b: true, p: true },
                    { f: 'Panel de gestión', b: true, p: true },
                    { f: 'Carrito centralizado', b: false, p: true },
                    { f: 'Delivery / Retiro', b: false, p: true },
                    { f: 'Pago Mercado Pago', b: false, p: true },
                    { f: 'Ticket por WhatsApp', b: true, p: true },
                  ].map((row, i) => (
                    <tr key={i} className="bg-gray-800">
                      <td className="px-3 py-2 text-gray-300 text-left">{row.f}</td>
                      <td className="px-3 py-2 text-center">{row.b ? '✔️' : '—'}</td>
                      <td className="px-3 py-2 text-center">{row.p ? '✔️' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => router.push('/carta/5XJ1J37F')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">🎯 Demo MenuQR</button>
              <button onClick={() => router.push('/carta/5XJ1J37F?pro=1')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">🎯 Demo Pro</button>
              <button onClick={() => router.push('/comprar')} className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all duration-200">💳 Comprar</button>
              <button onClick={() => router.push('/qr-shop')} className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all duration-200">🛍️ Ver QR Shop</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}