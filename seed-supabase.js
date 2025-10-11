// Script simple para poblar Supabase
const https = require('https');

const postData = JSON.stringify({});

const options = {
  hostname: 'menuqrep.vercel.app',
  port: 443,
  path: '/api/seed-demo',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🌱 Poblando base de datos en Supabase...');
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
        console.log('✅ ¡Base de datos poblada exitosamente!');
        console.log(`📂 ${response.data.categoriesCount} categorías creadas`);
        console.log(`🍽️ ${response.data.itemsCount} platos creados`);
        console.log('🚀 Ahora ve a: https://menuqrep.vercel.app/carta-menu');
      } else {
        console.log('❌ Error:', response.error);
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
