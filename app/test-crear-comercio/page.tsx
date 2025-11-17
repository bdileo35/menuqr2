"use client";

import { useState } from 'react';

export default function TestCrearComercio() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const crearLosToritos = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seed-comercio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreArchivo: 'Menu_los_toritos.md',
          nombreComercio: 'Pizzeria Rotiseria Los Toritos',
          email: 'admin@lostoritos.com',
          telefono: '+54 11 3840-2399',
          direccion: 'Zañartu 1547 - CABA (CLUB PEÑAROL)',
          instagram: 'pizzeria.lostoritos',
          facebook: 'Pizzeria Los Toritos',
          descripcion: 'Elaborado y Atendido por sus Dueños!!! - El saber de lo Artesanal',
          horario: 'Lunes a Lunes DE 18 a 24HS'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Error desconocido');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear comercio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        🍕 Crear Comercio: Los Toritos
      </h1>
      
      <button
        onClick={crearLosToritos}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? '⏳ Creando...' : '🚀 Crear Comercio Los Toritos'}
      </button>

      {error && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          color: '#991b1b',
          marginBottom: '20px'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{
          padding: '20px',
          backgroundColor: '#d1fae5',
          border: '1px solid #86efac',
          borderRadius: '8px',
          color: '#065f46'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>
            ✅ ¡Comercio creado exitosamente!
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            <strong>ID Único:</strong> {result.data.restaurantId}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <strong>Categorías:</strong> {result.data.categoriesCount}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <strong>Items:</strong> {result.data.itemsCount}
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #86efac' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>🔗 URLs:</h3>
            <div style={{ marginBottom: '8px' }}>
              <a 
                href={result.data.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#059669', textDecoration: 'underline' }}
              >
                📄 Ver Carta Pública
              </a>
            </div>
            <div>
              <a 
                href={result.data.editorUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#059669', textDecoration: 'underline' }}
              >
                ✏️ Editor de Menú
              </a>
            </div>
          </div>

          <div style={{ 
            marginTop: '24px', 
            padding: '12px', 
            backgroundColor: '#a7f3d0', 
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            🎉 <strong>¡Sistema multitenant funcionando correctamente!</strong>
          </div>
        </div>
      )}
    </div>
  );
}

