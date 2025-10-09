/**
 * Genera un ID único corto para URLs públicas
 * @returns ID único de 6 caracteres (ej: "32I4MPZ")
 */
export function generateUniqueId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Valida si un ID único tiene el formato correcto
 * @param id - ID a validar
 * @returns true si es válido
 */
export function isValidUniqueId(id: string): boolean {
  return /^[A-Z0-9]{6}$/.test(id);
}
