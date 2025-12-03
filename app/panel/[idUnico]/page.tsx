'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppTheme } from '../../hooks/useAppTheme';

// Componentes del Panel (se crearán después)
import PanelLogin from './components/PanelLogin';
import PanelContent from './components/PanelContent';

export default function PanelPage() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode } = useAppTheme();
  const idUnico = (params?.idUnico as string) || '';
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Verificar si hay sesión guardada
  useEffect(() => {
    const checkAuth = () => {
      const session = localStorage.getItem(`panel_session_${idUnico}`);
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          // Verificar que la sesión no haya expirado (24 horas)
          if (Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
            setIsAuthenticated(true);
            setUser(sessionData.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Sesión inválida
        }
      }
      setLoading(false);
    };

    if (idUnico) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [idUnico]);

  const handleLogin = async (password: string) => {
    try {
      const response = await fetch('/api/auth/panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUnico, password })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar sesión
        const sessionData = {
          user: data.user,
          timestamp: Date.now()
        };
        localStorage.setItem(`panel_session_${idUnico}`, JSON.stringify(sessionData));
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        alert(`❌ ${data.error || 'Error al autenticar'}`);
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('❌ Error de conexión');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`panel_session_${idUnico}`);
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!idUnico) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">❌ ID Único no encontrado</h1>
          <p className="text-gray-600 mb-4">La URL debe incluir un ID único válido</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PanelLogin idUnico={idUnico} onLogin={handleLogin} />;
  }

  return <PanelContent idUnico={idUnico} user={user} onLogout={handleLogout} />;
}



