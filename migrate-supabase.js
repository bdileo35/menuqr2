// Script para ejecutar migraciones en Supabase
const https = require('https');

const postData = JSON.stringify({});

const options = {
  hostname: 'menuqrep.vercel.app',
  port: 443,
  path: '/api/migrate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔧 Ejecutando migraciones en Supabase...');
console.log('📍 URL:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`📊 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('🎉 Respuesta:', response);
      
      if (response.success) {
        console.log('✅ ¡Migraciones ejecutadas exitosamente!');
        console.log('🚀 Ahora puedes ejecutar: node seed-supabase.js');
      } else {
        console.log('❌ Error en migraciones:', response.error);
      }
    } catch (e) {
      console.log('📄 Respuesta raw:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
});

req.write(postData);
req.end();
