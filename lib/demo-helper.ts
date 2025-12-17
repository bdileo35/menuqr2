/**
 * Helper para manejar IDUs demo
 * Los IDUs demo no guardan datos en BD y se regeneran fácilmente
 */

import { getDemoMenuData, getDemoMenuDataLosToritos } from './demo-data';

const DEMO_IDU_PREFIX = 'DEMO';

/**
 * Genera un IDU demo único
 */
export function generateDemoIDU(): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `${DEMO_IDU_PREFIX}${timestamp}`;
}

/**
 * Verifica si un IDU es demo
 */
export function isDemoIDU(idUnico: string): boolean {
  return idUnico.startsWith(DEMO_IDU_PREFIX);
}

/**
 * Obtiene datos demo para un IDU demo
 * Si no hay datos específicos, retorna datos genéricos
 */
export function getDemoData(idUnico: string) {
  // Por ahora, todos los demos usan los mismos datos
  // En el futuro se puede personalizar por IDU
  return getDemoMenuData();
}

/**
 * Limpia datos demo del localStorage
 */
export function clearDemoData(idUnico: string): void {
  if (typeof window === 'undefined') return;
  
  // Limpiar datos del editor
  localStorage.removeItem('editor-menu-data');
  localStorage.removeItem(`editor-menu-data-${idUnico}`);
  
  // Limpiar pedidos demo
  localStorage.removeItem(`orders-${idUnico}`);
  
  // Limpiar setup
  localStorage.removeItem('setup-comercio-data');
  localStorage.removeItem(`setup-comercio-data-${idUnico}`);
}

/**
 * Regenera un IDU demo (limpia datos y genera nuevo)
 */
export function regenerateDemoIDU(): string {
  if (typeof window === 'undefined') return generateDemoIDU();
  
  // Limpiar todos los datos demo
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('editor-menu-data-DEMO') || 
        key.startsWith('orders-DEMO') || 
        key.startsWith('setup-comercio-data-DEMO')) {
      localStorage.removeItem(key);
    }
  });
  
  return generateDemoIDU();
}


