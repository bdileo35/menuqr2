"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [menuPlan, setMenuPlan] = useState<'standard' | 'pro'>('standard');

  // Precios anuales únicos
  const priceStandard = 140000;
  const pricePro = 190000;

  const handleDemo = () => {
    // TODO: Implementar creación de trial de 7 días
    router.push('/trial/start');
  };

  const handleComprar = () => {
    router.push(`/comprar?plan=${menuPlan}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        
        {/* Card MenuQR - Unificado con QR_Shop */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
          {/* Header del producto */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 text-center">
            <div className="text-4xl mb-2">🍽️</div>
            <h3 className="text-2xl font-bold mb-1">MenuQR</h3>
            <p className="text-sm opacity-90 mb-4">Cartas Digitales + Scanner OCR</p>
            
            {/* Selector de plan */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <button 
                onClick={() => setMenuPlan('standard')} 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  menuPlan === 'standard'
                    ? 'bg-white text-emerald-700'
                    : 'bg-emerald-700/50 text-white/90 hover:bg-emerald-700/70'
                }`}
              >
                Standard
              </button>
              <button 
                onClick={() => setMenuPlan('pro')} 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  menuPlan === 'pro'
                    ? 'bg-white text-emerald-700'
                    : 'bg-emerald-700/50 text-white/90 hover:bg-emerald-700/70'
                }`}
              >
                PRO
              </button>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="p-6">
            {/* Comparativa Standard vs Pro */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-gray-700 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-gray-100">
                    <th className="text-left px-3 py-2">Función</th>
                    <th className="px-3 py-2">Standard</th>
                    <th className="px-3 py-2">PRO</th>
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
                    { f: 'Ticket por WhatsApp', b: false, p: true },
                    { f: 'Precio Anual', b: `$${priceStandard.toLocaleString('es-AR')}`, p: `$${pricePro.toLocaleString('es-AR')}` },
                  ].map((row, i) => (
                    <tr key={i} className={`bg-gray-800 ${i === 8 ? 'border-t-2 border-gray-600' : ''}`}>
                      <td className={`px-3 py-2 text-left ${i === 8 ? 'font-bold text-white' : 'text-gray-300'}`}>
                        {row.f}
                      </td>
                      <td className={`px-3 py-2 text-center ${i === 8 ? 'font-bold text-white' : ''}`}>
                        {typeof row.b === 'boolean' ? (row.b ? '✔️' : '—') : row.b}
                      </td>
                      <td className={`px-3 py-2 text-center ${i === 8 ? 'font-bold text-white' : ''}`}>
                        {typeof row.p === 'boolean' ? (row.p ? '✔️' : '—') : row.p}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Botones simplificados */}
            <div className="space-y-3">
              <button 
                onClick={handleDemo}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                🎯 Probar gratis 7 días
              </button>
              <button 
                onClick={handleComprar}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                💳 Comprar {menuPlan === 'pro' ? 'PRO' : 'Standard'} - ${menuPlan === 'standard' ? priceStandard.toLocaleString('es-AR') : pricePro.toLocaleString('es-AR')}/año
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}