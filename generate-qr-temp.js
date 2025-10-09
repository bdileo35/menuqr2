const QRCode = require('qrcode');

async function generateTempQR() {
  try {
    const url = 'https://menuqr-nine.vercel.app/carta-menu';
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log('✅ QR generado para:', url);
    console.log('📱 QR Code (Data URL):');
    console.log(qrCodeDataURL);
    console.log('\n🎯 Para la demo:');
    console.log('1. Copia la URL: https://menuqr-nine.vercel.app/carta-menu');
    console.log('2. Usa cualquier generador de QR online');
    console.log('3. O usa la data URL para mostrar la imagen');
    
  } catch (error) {
    console.error('❌ Error generando QR:', error);
  }
}

generateTempQR();
