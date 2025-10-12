const fetch = require('node-fetch');

const SYNC_URL = 'https://menuqrep.vercel.app/api/sync-schema';

async function syncSchema() {
  console.log('🔄 Sincronizando schema con Supabase...');
  console.log('📍 URL: ' + SYNC_URL);

  try {
    const response = await fetch(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const headers = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });

    console.log(`✅ Status: ${response.status}`);
    console.log('📊 Headers: ' + JSON.stringify(headers, null, 2));

    const data = await response.json();
    console.log('🎉 Respuesta: ' + JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error || 'Error desconocido al sincronizar schema');
    }

    console.log('🚀 Schema sincronizado exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

syncSchema();
