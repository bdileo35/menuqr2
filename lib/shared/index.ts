/**
 * 🔗 QR-SUITE SHARED LIBRARY
 * 
 * Módulo compartido entre QRing y MenuQR
 * 
 * Exporta:
 * - IDU Generator (generación de IDs únicos)
 * - Mercado Pago Service (pagos)
 * - QR Generator (generación de códigos QR)
 * - Planes (configuración de precios)
 */

// IDU Generator
export {
  generarIDU,
  validarIDU,
  generarIDUConPrefijo,
  iduExiste,
  generarIDUUnico,
} from './idu-generator';

// Mercado Pago
export {
  crearPreferencia,
  verificarPago,
  procesarWebhook,
  simularPreferencia,
  type PreferenciaData,
  type PreferenciaResponse,
} from './mercadopago';

// QR Generator
export {
  generarQR,
  generarQRConLogo,
  generarQRsBatch,
  validarURLParaQR,
  generarURLMenuQR,
  generarURLQRing,
  type QROptions,
} from './qr-generator';

// Planes
export {
  PLANES_MENUQR,
  PLANES_QRING,
  PLAN_SUITE,
  obtenerPlan,
  calcularPrecioConDescuento,
  formatearPrecio,
  type Plan,
} from './planes';
