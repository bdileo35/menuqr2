"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QRShopPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isDarkMode] = useState(true); // Modo oscuro por defecto
  const [loading, setLoading] = useState(false);

  // COMENTADO: Funcionalidad de MercadoPago temporalmente deshabilitada
  const handleComprar = async (productId: string) => {
    // setLoading(true);
    
    // Redirigir al flujo FUNCIONAL real (con sello "En Desarrollo")
    if (productId === 'menuqr') {
      router.push('/setup-comercio');
    } else {
      alert('Producto en desarrollo - ' + productId);
    }
    
    /* COMENTADO - MERCADOPAGO
    try {
      const response = await fetch('/api/shop/crear-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: `${productId}-basic`,
          plan: 'monthly',
          userEmail: 'cliente@menuqr.com' // Por ahora fijo
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert('Error: ' + data.error);
        return;
      }

      console.log('🛒 Redirigiendo a MercadoPago:', data.initPoint);
      
      // Redireccionar a MercadoPago
      window.location.href = data.initPoint;

    } catch (error) {
      console.error('Error creando preferencia:', error);
      alert('Error procesando la compra. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
    */
  };

  const [period, setPeriod] = useState<'mensual' | 'anual'>('mensual');
  const [menuPlan, setMenuPlan] = useState<'basic' | 'pro'>('basic');
  const products = [
    {
      id: 'qring',
      name: 'QRing',
      subtitle: 'Sistema de Timbres Inteligentes',
      price: '$29.99/mes',
      description: 'Transforma cualquier edificio en un sistema de portero eléctrico inteligente',
      features: ['Timbres virtuales por WhatsApp', 'Panel de administración', 'Múltiples edificios', 'Reportes en tiempo real'],
      color: 'from-blue-600 to-blue-700',
      demo: '/demo/qring',
      icon: '🏢'
    },
    {
      id: 'menuqr',
      name: 'MenuQR',
      subtitle: 'Cartas Digitales + Scanner OCR',
      priceBasicMonthly: 13999,
      priceBasicYearly: 139990,
      priceProMonthly: 17999,
      priceProYearly: 179990,
      description: 'Digitaliza tu carta y crea menús digitales profesionales',
      featuresBasic: ['Scanner OCR automático', 'Menús responsivos', 'Pedidos por WhatsApp', 'Panel de gestión'],
      featuresPro: ['Carrito centralizado', 'Delivery/Retiro', 'Pago Mercado Pago', 'Ticket por WhatsApp'],
      color: 'from-emerald-600 to-emerald-700',
      demo: '/carta/5XJ1J37F',
      icon: '🍽️'
    },
    {
      id: 'qrcard',
      name: 'QRCard',
      subtitle: 'Tarjetas Personales Digitales',
      price: '$9.99/mes',
      description: 'Crea tarjetas de presentación digitales profesionales con QR',
      features: ['Diseños personalizables', 'Múltiples templates', 'Analytics de contactos', 'Integración redes sociales'],
      color: 'from-purple-600 to-purple-700',
      demo: '/demo/qrcard',
      icon: '💳'
    }
  ];

  const bundles = [
    {
      name: 'QR Shop Completo',
      price: '$49.99/mes',
      originalPrice: '$59.97/mes',
      savings: 'Ahorra $9.98/mes',
      products: ['QRing', 'MenuQR', 'QRCard'],
      popular: true
    },
    {
      name: 'Business Pack',
      price: '$39.99/mes', 
      originalPrice: '$49.98/mes',
      savings: 'Ahorra $9.99/mes',
      products: ['QRing', 'MenuQR'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🚀 <span className="text-blue-300">QR Shop</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Elige tu solución QR
          </p>
          <div className="text-lg text-blue-200">
            Timbres inteligentes • Cartas digitales • Tarjetas personales
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Productos individuales */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Elige tu solución QR
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="bg-gray-800 border border-gray-700 rounded-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Header del producto */}
                <div className={`bg-gradient-to-r ${product.color} text-white p-6 text-center`}>
                  <div className="text-4xl mb-2">{product.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                  <p className="text-sm opacity-90">{product.subtitle}</p>
                  {product.id !== 'menuqr' ? (
                    <div className="mt-4 text-3xl font-bold">{product.price}</div>
                  ) : (
                    <div className="mt-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <button onClick={()=>setMenuPlan('basic')} className={`px-3 py-1 rounded ${menuPlan==='basic'?'bg-white text-emerald-700':'bg-emerald-700 text-white/90'}`}>MenuQR</button>
                        <button onClick={()=>setMenuPlan('pro')} className={`px-3 py-1 rounded ${menuPlan==='pro'?'bg-white text-emerald-700':'bg-emerald-700 text-white/90'}`}>Pro</button>
                        <div className="mx-2"/>
                        <button onClick={()=>setPeriod('mensual')} className={`px-3 py-1 rounded ${period==='mensual'?'bg-black/20':'bg-black/10'}`}>Mensual</button>
                        <button onClick={()=>setPeriod('anual')} className={`px-3 py-1 rounded ${period==='anual'?'bg-black/20':'bg-black/10'}`}>Anual</button>
                      </div>
                      <div className="text-3xl font-bold">
                        {menuPlan==='basic' ? (
                          period==='mensual' ? `$${(product as any).priceBasicMonthly.toLocaleString('es-AR')}/mes` : `$${(product as any).priceBasicYearly.toLocaleString('es-AR')}/año`
                        ) : (
                          period==='mensual' ? `$${(product as any).priceProMonthly.toLocaleString('es-AR')}/mes` : `$${(product as any).priceProYearly.toLocaleString('es-AR')}/año`
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Contenido */}
                <div className="p-6">
                  {product.id !== 'menuqr' ? (
                    <p className="text-gray-300 mb-4">{product.description}</p>
                  ) : (
                    <div className="text-gray-300 mb-6">
                      {/* Comparativa MenuQR vs Pro */}
                      <div className="overflow-x-auto">
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
                        <div className="text-xs text-gray-400 mt-2">
                          Mensual: ${ (product as any).priceBasicMonthly.toLocaleString('es-AR') } (MenuQR) / ${ (product as any).priceProMonthly.toLocaleString('es-AR') } (Pro) — Anual: ${ (product as any).priceBasicYearly.toLocaleString('es-AR') } / ${ (product as any).priceProYearly.toLocaleString('es-AR') } — Pagás 10 meses, ahorrás 2.
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {product.id !== 'menuqr' && (
                    <ul className="space-y-2 mb-6">
                      {(product as any).features?.map((feature:string, index:number) => (
                        <li key={index} className="flex items-center text-sm text-gray-300">
                          <span className="text-green-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="space-y-2">
                    {product.id!=='menuqr' ? (
                      <>
                        <button onClick={() => router.push(product.demo)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200">🎯 Ver Demo</button>
                        <button onClick={() => handleComprar(product.id)} disabled={loading} className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-4 rounded-lg transition-all duration-200">{loading ? '⏳ Procesando...' : '💳 Comprar'}</button>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button onClick={() => router.push('/carta/5XJ1J37F')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200">🎯 Demo MenuQR</button>
                        <button onClick={() => router.push('/carta/5XJ1J37F?pro=1')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200">🎯 Demo Pro</button>
                        <button onClick={() => handleComprar('menuqr')} disabled={loading} className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-4 rounded-lg transition-all duration-200">{loading?'⏳':'💳 Comprar MenuQR'}</button>
                        <button onClick={() => handleComprar('menuqrpro')} disabled={loading} className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-4 rounded-lg transition-all duration-200">{loading?'⏳':'💳 Comprar Pro'}</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* CTA Final */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda para elegir?</h2>
          <p className="mb-6 text-blue-100">
            Nuestro equipo te ayuda a encontrar la solución perfecta para tu negocio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/1234567890', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              💬 Consultar por WhatsApp
            </button>
            <button
              onClick={() => window.open('mailto:info@qrshop.com', '_blank')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              📧 Enviar Email
            </button>
          </div>
        </div>

      </div>

      {/* Modal de compra (básico) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Comprar: {selectedProduct}</h3>
            <p className="text-slate-600 mb-6">
              Te redirigiremos al proceso de compra seguro
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="btn-qring-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Aquí iría la integración con Stripe/MercadoPago
                  alert('Redirigiendo al checkout...');
                  setSelectedProduct(null);
                }}
                className="btn-qring-primary flex-1"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}