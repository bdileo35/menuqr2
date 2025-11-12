/**
 * 💳 MERCADO PAGO SERVICE
 * 
 * Servicio compartido entre QRing y MenuQR
 * para gestionar pagos con Mercado Pago
 */

export interface PreferenciaData {
  titulo: string;
  precio: number;
  descripcion: string;
  metadata?: Record<string, any>;
  autoReturn?: 'approved' | 'all';
  backUrls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
}

export interface PreferenciaResponse {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

/**
 * Crea una preferencia de pago en Mercado Pago
 * @param {PreferenciaData} data - Datos de la preferencia
 * @returns {Promise<PreferenciaResponse>} Respuesta de MP
 */
export async function crearPreferencia(
  data: PreferenciaData
): Promise<PreferenciaResponse> {
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  
  if (!MP_ACCESS_TOKEN) {
    throw new Error('MP_ACCESS_TOKEN no configurado en variables de entorno');
  }
  
  const preferencia = {
    items: [
      {
        title: data.titulo,
        unit_price: data.precio,
        quantity: 1,
        description: data.descripcion,
      }
    ],
    back_urls: data.backUrls,
    auto_return: data.autoReturn || 'approved',
    metadata: data.metadata || {},
    notification_url: process.env.MP_WEBHOOK_URL,
  };
  
  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(preferencia),
  });
  
  if (!response.ok) {
    throw new Error(`Error creando preferencia MP: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Verifica el estado de un pago en Mercado Pago
 * @param {string} paymentId - ID del pago
 * @returns {Promise<any>} Datos del pago
 */
export async function verificarPago(paymentId: string): Promise<any> {
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
    }
  });
  
  if (!response.ok) {
    throw new Error(`Error verificando pago MP: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Procesa webhook de Mercado Pago
 * @param {any} body - Body del webhook
 * @returns {Promise<any>} Datos del pago si es válido
 */
export async function procesarWebhook(body: any): Promise<any | null> {
  // Webhook de tipo "payment"
  if (body.type === 'payment') {
    const paymentId = body.data?.id;
    
    if (!paymentId) {
      console.warn('Webhook sin payment ID');
      return null;
    }
    
    // Verificar pago
    const payment = await verificarPago(paymentId);
    
    // Solo procesar pagos aprobados
    if (payment.status === 'approved') {
      return {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.transaction_amount,
        email: payment.payer?.email,
        metadata: payment.metadata,
      };
    }
  }
  
  return null;
}

/**
 * Simula respuesta de MP para testing (modo puenteado)
 * @param {PreferenciaData} data - Datos de la preferencia
 * @returns {PreferenciaResponse} Respuesta simulada
 */
export function simularPreferencia(data: PreferenciaData): PreferenciaResponse {
  const mockId = `MOCK_${Date.now()}`;
  
  return {
    id: mockId,
    init_point: data.backUrls?.success || '/tienda/exito',
    sandbox_init_point: data.backUrls?.success || '/tienda/exito',
  };
}
