/**
 * 🎨 QR GENERATOR SERVICE
 * 
 * Servicio compartido entre QRing y MenuQR
 * para generar códigos QR personalizados
 */

import QRCode from 'qrcode';

export interface QROptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  logo?: string;
  format?: 'png' | 'svg' | 'dataURL';
}

/**
 * Genera un código QR
 * @param {string} url - URL a codificar
 * @param {QROptions} options - Opciones de personalización
 * @returns {Promise<string>} QR generado (base64 o SVG)
 */
export async function generarQR(
  url: string,
  options: QROptions = {}
): Promise<string> {
  const defaultOptions = {
    width: options.size || 300,
    margin: options.margin || 2,
    color: {
      dark: options.color?.dark || '#000000',
      light: options.color?.light || '#FFFFFF',
    },
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
  };

  try {
    if (options.format === 'svg') {
      return await QRCode.toString(url, {
        ...defaultOptions,
        type: 'svg',
      });
    }

    // Por defecto: data URL (base64)
    return await QRCode.toDataURL(url, defaultOptions);
  } catch (error) {
    console.error('Error generando QR:', error);
    throw new Error('No se pudo generar el código QR');
  }
}

/**
 * Genera QR con logo centrado
 * @param {string} url - URL a codificar
 * @param {string} logoUrl - URL del logo
 * @param {QROptions} options - Opciones adicionales
 * @returns {Promise<string>} QR con logo (base64)
 */
export async function generarQRConLogo(
  url: string,
  logoUrl: string,
  options: QROptions = {}
): Promise<string> {
  // Generar QR base con alta corrección de errores (para logo)
  const qrBase = await generarQR(url, {
    ...options,
    errorCorrectionLevel: 'H', // Alta corrección para soportar logo
  });

  // TODO: Implementar overlay de logo usando canvas
  // Por ahora devolvemos el QR sin logo
  return qrBase;
}

/**
 * Genera múltiples QRs en batch
 * @param {Array<{url: string, filename: string}>} items - Items a generar
 * @param {QROptions} options - Opciones compartidas
 * @returns {Promise<Array<{filename: string, qr: string}>>}
 */
export async function generarQRsBatch(
  items: Array<{ url: string; filename: string }>,
  options: QROptions = {}
): Promise<Array<{ filename: string; qr: string }>> {
  const results = await Promise.all(
    items.map(async (item) => ({
      filename: item.filename,
      qr: await generarQR(item.url, options),
    }))
  );

  return results;
}

/**
 * Valida si una URL es válida para QR
 * @param {string} url - URL a validar
 * @returns {boolean}
 */
export function validarURLParaQR(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Genera URL completa para QR (MenuQR)
 * @param {string} baseUrl - URL base (ej: https://menuqr.app)
 * @param {string} idu - ID único
 * @param {string} tipo - Tipo de QR (carta, mesa, delivery)
 * @returns {string}
 */
export function generarURLMenuQR(
  baseUrl: string,
  idu: string,
  tipo: 'carta' | 'mesa' | 'delivery' = 'carta'
): string {
  switch (tipo) {
    case 'mesa':
      return `${baseUrl}/carta/${idu}?mesa=`;
    case 'delivery':
      return `${baseUrl}/carta/${idu}?modalidad=delivery`;
    default:
      return `${baseUrl}/carta/${idu}`;
  }
}

/**
 * Genera URL completa para QR (QRing)
 * @param {string} baseUrl - URL base
 * @param {string} idu - ID único
 * @returns {string}
 */
export function generarURLQRing(baseUrl: string, idu: string): string {
  return `${baseUrl}/r/${idu}`;
}
