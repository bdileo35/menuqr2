'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { hasValidToken, saveAdminToken, requireAuth } from '@/lib/auth';

interface AuthGuardProps {
  idUnico: string;
  children: React.ReactNode;
}

/**
 * Componente que protege páginas administrativas
 * Si no hay token válido, redirige al editor
 */
export default function AuthGuard({ idUnico, children }: AuthGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Verificar si viene de una redirección por falta de auth
    const authRequired = searchParams?.get('auth_required');
    
    // Verificar token
    const auth = requireAuth(idUnico);
    
    if (!auth.isAuthenticated) {
      // Si no hay token, redirigir al editor
      // El editor generará el token automáticamente
      if (auth.redirectTo) {
        router.push(auth.redirectTo);
      }
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
    
    setIsChecking(false);
  }, [idUnico, router, searchParams]);
  
  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, no renderizar (ya redirigió)
  if (!isAuthenticated) {
    return null;
  }
  
  // Renderizar contenido protegido
  return <>{children}</>;
}

