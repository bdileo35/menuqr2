/**
 * Script para crear el comercio "Los Toritos" desde Menu_los_toritos.md
 * 
 * Ejecutar: node scripts/crear-los-toritos.js
 * Requiere Node.js 18+ (fetch nativo)
 */

const COMERCIO_DATA = {
  nombreArchivo: 'Menu_los_toritos.md',
  nombreComercio: 'Pizzeria Rotiseria Los Toritos',
  email: 'admin@lostoritos.com',
  telefono: '+54 11 3840-2399',
  direccion: 'Zañartu 1547 - CABA (CLUB PEÑAROL)',
  instagram: 'pizzeria.lostoritos',
  facebook: 'Pizzeria Los Toritos',
  descripcion: 'Elaborado y Atendido por sus Dueños!!! - El saber de lo Artesanal',
  horario: 'Lunes a Lunes DE 18 a 24HS'
};

async function crearComercio() {
  try {
    console.log('🚀 Iniciando creación de comercio Los Toritos...\n');
    
    // Determinar la URL base
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/seed-comercio`;
    
    console.log(`📡 Enviando request a: ${url}`);
    console.log('📋 Datos del comercio:');
    console.log(JSON.stringify(COMERCIO_DATA, null, 2));
    console.log('\n');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(COMERCIO_DATA),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ ¡Comercio creado exitosamente!\n');
      console.log('📊 Resumen:');
      console.log(`   - ID Único: ${result.data.restaurantId}`);
      console.log(`   - Categorías: ${result.data.categoriesCount}`);
      console.log(`   - Items: ${result.data.itemsCount}`);
      console.log('\n🔗 URLs:');
      console.log(`   - Carta pública: ${baseUrl}${result.data.url}`);
      console.log(`   - Editor: ${baseUrl}${result.data.editorUrl}`);
      console.log('\n🎉 ¡Sistema multitenant funcionando correctamente!');
    } else {
      console.error('❌ Error al crear comercio:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

crearComercio();

