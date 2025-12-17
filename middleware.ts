import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas (no requieren autenticación)
const publicRoutes = [
  '/carta',
  '/comprar',
  '/qr-shop',
  '/tienda',
  '/scanner',
  '/api',
];

// Rutas administrativas (requieren autenticación)
const adminRoutes = [
  '/editor',
  '/datos-comercio',
  '/opciones-qr',
  '/pedidos',
  '/configuracion',
  '/ayuda',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir rutas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Permitir página raíz
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // Verificar si es una ruta administrativa
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  if (isAdminRoute) {
    // Verificar token en cookie o header
    const token = request.cookies.get('admin_token')?.value || 
                  request.headers.get('x-admin-token');
    
    // Si no hay token, permitir acceso pero el componente verificará
    // Esto permite que el cliente maneje la redirección
    if (!token) {
      // No bloquear aquí, dejar que el componente decida
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


