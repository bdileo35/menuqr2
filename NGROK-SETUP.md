# 🌐 Compartir MenuQR con ngrok

## Pasos para enviar link a Esquina Pompeya:

### 1. Instalar ngrok (si no lo tienes):
```bash
# Descargar desde: https://ngrok.com/download
# O instalar con npm:
npm install -g ngrok
```

### 2. Crear túnel público:
```bash
# En terminal separado (mientras corre npm run dev):
ngrok http 3000
```

### 3. Obtienes URLs como:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### 4. Enviar al dueño de EP:
**Link principal**: `https://abc123.ngrok.io/menu/esquina-pompeya`

**WhatsApp mensaje sugerido**:
```
🍽️ ¡Hola! Te comparto el menú digital de Esquina Pompeya:\\\\\\\\\\\

👉 https://abc123.ngrok.io/menu/esquina-pompeya

✨ Características:
- Carta digitalizada con OCR
- Fotos de platos 
- Pedidos directo por WhatsApp
- Responsive (celular/tablet)
- Sin apps, solo navegador

¡Probalo desde tu celular y decime qué te parece! 📱
```

### 5. Otras páginas para mostrar:
- **Scanner OCR**: `https://abc123.ngrok.io/scanner`
- **Landing**: `https://abc123.ngrok.io/`
- **QR-Shop**: `https://abc123.ngrok.io/qr-shop`

### ⚠️ Importante:
- El link ngrok funciona mientras tengas el servidor corriendo
- Se genera nuevo link cada vez que reinicias ngrok
- Es perfecto para demos y testing