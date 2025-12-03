'use client';
import { useState } from 'react';
import { useAppTheme } from '../../../hooks/useAppTheme';

interface PanelLoginProps {
  idUnico: string;
  onLogin: (password: string) => void;
}

export default function PanelLogin({ idUnico, onLogin }: PanelLoginProps) {
  const { isDarkMode } = useAppTheme();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      alert('⚠️ Por favor ingresa la contraseña');
      return;
    }
    setLoading(true);
    await onLogin(password);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            🔐 Panel de Control
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ID Único: <span className="font-mono font-bold">{idUnico}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Usuario
            </label>
            <input
              type="text"
              value={idUnico}
              disabled
              className={`w-full p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-400'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              autoFocus
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              💡 Contraseña: <span className="font-mono font-bold">1234</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? '⏳ Verificando...' : '🚀 Ingresar al Panel'}
          </button>
        </form>

        <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-blue-800'}`}>
            <strong>ℹ️ Nota:</strong> Las rutas actuales (/editor, /datos-comercio, etc.) siguen funcionando normalmente.
            Este Panel es una nueva interfaz independiente.
          </p>
        </div>
      </div>
    </div>
  );
}

