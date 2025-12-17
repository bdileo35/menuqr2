/**
 * Sistema de autenticación simple basado en tokens
 * Los tokens se generan al acceder al editor y se validan en las demás páginas
 */

const TOKEN_KEY = 'admin_token';
const TOKEN_EXPIRY_KEY = 'admin_token_expiry';
const TOKEN_DURATION = 24 * 60 * 60 * 1000; // 24 horas

// IDUs que requieren autenticación (acceso restringido)
const RESTRICTED_IDUS = [
  '5XJ1J37F', // Esquina Pompeya - restringido
  // Agregar aquí los nuevos IDUs que se generen
];

// IDU demo (no requiere autenticación, no guarda en BD)
const DEMO_IDU = 'DEMO1234';

/**
 * Verifica si un IDU está restringido
 */
export function isRestrictedIDU(idUnico: string): boolean {
  return RESTRICTED_IDUS.includes(idUnico);
}

/**
 * Verifica si un IDU es demo
 */
export function isDemoIDU(idUnico: string): boolean {
  return idUnico === DEMO_IDU || idUnico.startsWith('DEMO');
}

/**
 * Verifica si un IDU requiere autenticación
 */
export function requiresAuth(idUnico: string): boolean {
  // Los IDUs demo no requieren auth
  if (isDemoIDU(idUnico)) return false;
  
  // Los IDUs restringidos requieren auth
  if (isRestrictedIDU(idUnico)) return true;
  
  // Por defecto, los nuevos IDUs requieren auth
  // (cualquier IDU que no sea demo se considera restringido)
  return true;
}

/**
 * Genera un token único para el idUnico
 */
export function generateAdminToken(idUnico: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${idUnico}_${timestamp}_${random}`;
}

/**
 * Guarda el token en localStorage y cookie
 */
export function saveAdminToken(idUnico: string): string {
  const token = generateAdminToken(idUnico);
  const expiry = Date.now() + TOKEN_DURATION;
  
  // Guardar en localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    localStorage.setItem('admin_idUnico', idUnico);
    
    // Guardar en cookie (para middleware)
    document.cookie = `admin_token=${token}; path=/; max-age=${TOKEN_DURATION / 1000}; SameSite=Lax`;
  }
  
  return token;
}

/**
 * Verifica si hay un token válido
 */
export function hasValidToken(idUnico?: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  const storedIdUnico = localStorage.getItem('admin_idUnico');
  
  if (!token || !expiry) return false;
  
  // Verificar expiración
  if (Date.now() > parseInt(expiry)) {
    clearAdminToken();
    return false;
  }
  
  // Si se proporciona idUnico, verificar que coincida
  if (idUnico && storedIdUnico !== idUnico) {
    return false;
  }
  
  return true;
}

/**
 * Obtiene el token actual
 */
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Limpia el token
 */
export function clearAdminToken(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem('admin_idUnico');
  
  // Eliminar cookie
  document.cookie = 'admin_token=; path=/; max-age=0';
}

/**
 * Hook para verificar autenticación en componentes
 */
export function requireAuth(idUnico: string): { isAuthenticated: boolean; redirectTo?: string } {
  // Si es IDU demo, siempre permitir acceso
  if (isDemoIDU(idUnico)) {
    return { isAuthenticated: true };
  }
  
  // Si el IDU requiere autenticación y no hay token válido
  if (requiresAuth(idUnico) && !hasValidToken(idUnico)) {
    return {
      isAuthenticated: false,
      redirectTo: `/editor/${idUnico}?auth_required=true`
    };
  }
  
  return { isAuthenticated: true };
}

