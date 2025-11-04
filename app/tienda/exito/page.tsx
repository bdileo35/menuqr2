'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QRWithActions from '../../components/QRWithActions';

function TiendaExitoContent() {
  const searchParams = useSearchParams();
  const [idUnico, setIdUnico] = useState<string>('');
  const [plan, setPlan] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [mpPaymentId, setMpPaymentId] = useState<string>('');
  const [mpStatus, setMpStatus] = useState<string>('');
  const [waPhone, setWaPhone] = useState<string>(process.env.NEXT_PUBLIC_ORDER_WHATSAPP || '5491165695648');

  useEffect(() => {
    // Obtener parámetros de la URL
    const idUnicoParam = searchParams?.get('idUnico') || '';
    const planParam = searchParams?.get('plan') || '';
    const precioParam = searchParams?.get('precio') || '';
    const descripcionParam = searchParams?.get('descripcion') || '';
    const paymentId = searchParams?.get('payment_id') || '';
    const paymentStatus = searchParams?.get('status') || '';
    const wa = searchParams?.get('wa') || '';
    const auto = searchParams?.get('auto') || '';

    setIdUnico(idUnicoParam);
    setPlan(planParam);
    setPrecio(precioParam);
    setDescripcion(decodeURIComponent(descripcionParam));
    setMpPaymentId(paymentId);
    setMpStatus(paymentStatus);
    if (wa) setWaPhone(wa);

    // Generar ID único si no viene en los parámetros
    if (!idUnicoParam) {
      const nuevoIdUnico = generarIdUnico();
      setIdUnico(nuevoIdUnico);
      console.log('🆔 ID único generado:', nuevoIdUnico);
    }

    // Auto-WhatsApp de demo si viene auto=1 y hay datos de MP
    if ((paymentId || paymentStatus) && auto === '1') {
      try {
        const text = encodeURIComponent(`Pago recibido\nIDU: ${idUnicoParam || '-'}\nMP: ${paymentId || '-'} ${paymentStatus ? `(${paymentStatus})` : ''}\nPlan: ${planParam || '-'}\nMonto: $${precioParam || '-'}`);
        window.open(`https://wa.me/${wa || waPhone}?text=${text}`, '_blank');
      } catch {}
    }
  }, [searchParams]);

  const generarIdUnico = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const baseUrl = (typeof window !== 'undefined' && window.location?.origin) || process.env.NEXT_PUBLIC_APP_URL || 'https://menuqrep.vercel.app';
  const qrUrl = `${baseUrl}/carta/${idUnico}`;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Card principal */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Header verde de éxito */}
          <div className="bg-green-600 p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🎉</span>
              <h1 className="text-2xl font-bold text-white">
                ¡Pago Exitoso!
              </h1>
            </div>
            <p className="text-green-100 text-sm">
              Tu {descripcion || 'MenuQR'} está listo
            </p>
          </div>

          {/* Contenido principal */}
          <div className="p-6 bg-gray-800">
            
            {/* Información del plan */}
            <div className="mb-6">
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <h3 className="text-white font-semibold mb-2">📋 Detalles del Plan:</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="text-green-400 font-medium">{plan || 'Mensual'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio:</span>
                    <span className="text-green-400 font-medium">${precio || '14,999'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID Único:</span>
                    <span className="text-blue-400 font-mono text-xs">{idUnico}</span>
                  </div>
                  {(mpPaymentId || mpStatus) && (
                    <div className="flex justify-between">
                      <span>MP:</span>
                      <span className="text-green-300 font-mono text-xs">{mpPaymentId || '-'} {mpStatus ? `(${mpStatus})` : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QR Code y Botones lado a lado */}
            <div className="mb-6">
              <QRWithActions qrUrl={qrUrl} isDarkMode={true} />
            </div>

            {/* Enviar comprobante por WhatsApp (si hay MP) */}
            {(mpPaymentId || mpStatus) && (
              <div className="mb-4 text-center">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Pago recibido\nIDU: ${idUnico}\nMP: ${mpPaymentId || '-'} ${mpStatus ? `(${mpStatus})` : ''}\nPlan: ${plan || '-'}\nMonto: $${precio || '-'}`);
                    window.open(`https://wa.me/${waPhone}?text=${text}`, '_blank');
                  }}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                >
                  Enviar comprobante por WhatsApp
                </button>
              </div>
            )}

            {/* Información adicional */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 mb-2">
                💡 Guarda este QR para acceder a tu menú digital
              </p>
              <p className="text-xs text-gray-400">
                Puedes personalizar tu menú desde el editor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TiendaExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    }>
      <TiendaExitoContent />
    </Suspense>
  );
}