// Script para ejecutar el seed desde terminal
const fetch = require('node-fetch');

async function runSeed() {
  console.log('🌱 Ejecutando seed...');
  
  try {
    const response = await fetch('http://localhost:3000/api/seed-demo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('✅ Resultado:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runSeed();
