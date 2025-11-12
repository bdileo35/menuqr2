/**
 * 🔑 GENERADOR DE IDU (ID Único)
 * 
 * Servicio compartido entre QRing y MenuQR
 * para generar identificadores únicos de 8 caracteres
 * 
 * Formato: XXXXXXXX (ej: 5XJ1J37F)
 * Caracteres: A-Z, 0-9 (excluye vocales para evitar palabras)
 * Colisiones: 1 en 36^8 ≈ 2.8 billones
 */

const CHARS = 'BCDFGHJKLMNPQRSTVWXYZ0123456789'; // Sin vocales
const IDU_LENGTH = 8;

/**
 * Genera un IDU único de 8 caracteres
 * @returns {string} IDU generado (ej: "5XJ1J37F")
 */
export function generarIDU(): string {
  let result = '';
  for (let i = 0; i < IDU_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

/**
 * Valida si un IDU tiene el formato correcto
 * @param {string} idu - IDU a validar
 * @returns {boolean} true si es válido
 */
export function validarIDU(idu: string): boolean {
  if (!idu || idu.length !== IDU_LENGTH) return false;
  return /^[BCDFGHJKLMNPQRSTVWXYZ0-9]{8}$/.test(idu);
}

/**
 * Genera un IDU con prefijo personalizado (para testing)
 * @param {string} prefix - Prefijo de 1-3 caracteres
 * @returns {string} IDU con prefijo
 */
export function generarIDUConPrefijo(prefix: string): string {
  const remainingLength = IDU_LENGTH - prefix.length;
  let result = prefix.toUpperCase();
  
  for (let i = 0; i < remainingLength; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  
  return result;
}

/**
 * Verifica si un IDU ya existe en la base de datos
 * @param {string} idu - IDU a verificar
 * @param {Function} checkFn - Función de verificación async
 * @returns {Promise<boolean>} true si existe
 */
export async function iduExiste(
  idu: string, 
  checkFn: (idu: string) => Promise<boolean>
): Promise<boolean> {
  return await checkFn(idu);
}

/**
 * Genera un IDU único garantizado (sin colisiones)
 * @param {Function} checkFn - Función que verifica si existe en DB
 * @param {number} maxRetries - Máximo de reintentos
 * @returns {Promise<string>} IDU único garantizado
 */
export async function generarIDUUnico(
  checkFn: (idu: string) => Promise<boolean>,
  maxRetries: number = 10
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const idu = generarIDU();
    const existe = await checkFn(idu);
    
    if (!existe) {
      return idu;
    }
  }
  
  throw new Error('No se pudo generar un IDU único después de múltiples intentos');
}
