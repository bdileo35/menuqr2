/**
 * 📦 PLANES Y PRECIOS
 * 
 * Configuración compartida de planes entre QRing y MenuQR
 */

export interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: 'mensual' | 'anual' | 'unico';
  features: string[];
  destacado?: boolean;
  app: 'qring' | 'menuqr' | 'suite';
}

/**
 * Planes de MenuQR
 */
export const PLANES_MENUQR: Plan[] = [
  {
    id: 'menuqr-mensual',
    nombre: 'MenuQR Mensual',
    descripcion: 'Carta digital QR con pedidos online',
    precio: 13999,
    duracion: 'mensual',
    app: 'menuqr',
    features: [
      'Carta digital QR ilimitada',
      'Editor de menú en tiempo real',
      'Carrito PRO con pedidos',
      'WhatsApp Business integrado',
      'Personalización de tema',
      'Soporte prioritario',
    ],
    destacado: false,
  },
  {
    id: 'menuqr-anual',
    nombre: 'MenuQR Anual',
    descripcion: 'Carta digital QR - Ahorrá 2 meses',
    precio: 139990,
    duracion: 'anual',
    app: 'menuqr',
    features: [
      'Todos los features del plan mensual',
      '10 meses al precio de 12',
      'Ahorrás $27,980 por año',
      'Actualizaciones garantizadas',
      'Soporte premium',
    ],
    destacado: true,
  },
];

/**
 * Planes de QRing
 */
export const PLANES_QRING: Plan[] = [
  {
    id: 'qring-basico',
    nombre: 'QRing Básico',
    descripcion: 'Generador de QR y landing pages',
    precio: 9999,
    duracion: 'mensual',
    app: 'qring',
    features: [
      'Generador QR ilimitado',
      'Landing pages personalizadas',
      'Analytics básico',
      'QR descargable en PNG/SVG',
      'Soporte por email',
    ],
  },
  {
    id: 'qring-pro',
    nombre: 'QRing Pro',
    descripcion: 'QR avanzado con analytics',
    precio: 19999,
    duracion: 'mensual',
    app: 'qring',
    features: [
      'Todos los features del Básico',
      'QR dinámico (editable después de impreso)',
      'Analytics avanzado',
      'Dominio personalizado',
      'Soporte prioritario',
    ],
    destacado: true,
  },
];

/**
 * Plan Suite (QRing + MenuQR)
 */
export const PLAN_SUITE: Plan = {
  id: 'suite-combo',
  nombre: 'QR Suite Completo',
  descripcion: 'QRing + MenuQR en un solo paquete',
  precio: 29999,
  duracion: 'mensual',
  app: 'suite',
  features: [
    'Todos los features de MenuQR',
    'Todos los features de QRing Pro',
    'Integración completa entre apps',
    'Dashboard unificado',
    'Ahorrás $3,999 por mes',
    'Soporte VIP 24/7',
  ],
  destacado: true,
};

/**
 * Obtiene un plan por ID
 */
export function obtenerPlan(planId: string): Plan | undefined {
  const todosLosPlanes = [
    ...PLANES_MENUQR,
    ...PLANES_QRING,
    PLAN_SUITE,
  ];
  
  return todosLosPlanes.find(p => p.id === planId);
}

/**
 * Calcula precio con descuento
 */
export function calcularPrecioConDescuento(
  precio: number,
  descuento: number
): number {
  return Math.round(precio * (1 - descuento / 100));
}

/**
 * Formatea precio en pesos argentinos
 */
export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(precio);
}
