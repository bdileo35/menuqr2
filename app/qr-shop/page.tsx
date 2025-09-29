"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QRShopPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

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
      price: '$19.99/mes',
      description: 'Digitaliza tu carta física automáticamente y crea menús digitales profesionales',
      features: ['Scanner OCR automático', 'Menús digitales responsivos', 'Pedidos por WhatsApp', 'Panel de gestión'],
      color: 'from-emerald-600 to-emerald-700',
      demo: '/menu/esquina-pompeya',
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
      name: 'QR-Suite Completa',
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
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🚀 <span className="text-blue-300">QR-Suite</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            La suite completa de soluciones QR para tu negocio
          </p>
          <div className="text-lg text-blue-200">
            Timbres inteligentes • Cartas digitales • Tarjetas personales
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Productos individuales */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Elige tu solución QR
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                className="card-qring hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Header del producto */}
                <div className={`bg-gradient-to-r ${product.color} text-white p-6 text-center`}>
                  <div className="text-4xl mb-2">{product.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                  <p className="text-sm opacity-90">{product.subtitle}</p>
                  <div className="mt-4 text-3xl font-bold">{product.price}</div>
                </div>
                
                {/* Contenido */}
                <div className="p-6">
                  <p className="text-slate-600 mb-4">{product.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="text-blue-600 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => router.push(product.demo)}
                      className="btn-qring-primary w-full"
                    >
                      🎯 Ver Demo
                    </button>
                    <button
                      onClick={() => setSelectedProduct(product.id)}
                      className="btn-qring-outline w-full"
                    >
                      💳 Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paquetes/Bundles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-4">
            Paquetes con descuento
          </h2>
          <p className="text-slate-600 text-center mb-12">
            Combina productos y ahorra más
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {bundles.map((bundle, index) => (
              <div 
                key={index}
                className={`card-qring relative ${bundle.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {bundle.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      🔥 Más Popular
                    </div>
                  </div>
                )}
                
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{bundle.name}</h3>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-blue-600">{bundle.price}</div>
                    <div className="text-sm text-slate-500 line-through">{bundle.originalPrice}</div>
                    <div className="text-sm text-emerald-600 font-medium">{bundle.savings}</div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-2">Incluye:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {bundle.products.map((product) => (
                        <span key={product} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedProduct(bundle.name)}
                    className={bundle.popular ? 'btn-qring-primary w-full' : 'btn-qring-outline w-full'}
                  >
                    🛒 Comprar Paquete
                  </button>
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
              onClick={() => window.open('mailto:info@qr-suite.com', '_blank')}
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