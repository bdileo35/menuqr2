# 🖨️ Configurar Impresora Térmica H22

## 📋 Resumen

- **Preview**: NO necesitas el driver, es solo visualización en el navegador
- **Impresión física**: SÍ necesitas el driver instalado (solo en Windows/PC)
- **Impresión desde Android**: ✅ **SÍ, funciona desde el celular de la mesera** (Bluetooth 4.0)
- **Ancho de impresión**: **48mm** (ancho del papel: 58mm)
- **Impresión directa**: Configura la H22 como impresora predeterminada

## 🔧 Pasos para Configuración

### 1. Instalar Driver de la H22 (Solo para Windows/PC)

**Para Windows:**
1. Descarga el driver desde el sitio del fabricante o desde el CD incluido
2. Instala el driver siguiendo las instrucciones del fabricante
3. Conecta la impresora por USB o Bluetooth
4. Verifica que Windows la reconozca en "Dispositivos e impresoras"

**Para Android (Celular de la Mesera):**
- ✅ **NO necesitas driver** - Android detecta la impresora automáticamente
- Solo necesitas emparejar por Bluetooth (ver sección Android)

### 2. Configurar como Impresora Predeterminada

**Windows:**
1. Ve a `Configuración` → `Dispositivos` → `Impresoras y escáneres`
2. Busca "H22" en la lista
3. Haz clic derecho → `Establecer como impresora predeterminada`

O desde el Panel de Control:
1. `Panel de Control` → `Dispositivos e impresoras`
2. Busca "H22"
3. Clic derecho → `Establecer como impresora predeterminada`

### 3. Configurar Propiedades de Impresión (Windows)

1. Clic derecho en "H22" → `Propiedades de impresora`
2. En `Opciones avanzadas`:
   - Tamaño de papel: **48mm x largo variable** (ancho de impresión: 48mm)
   - Calidad: **Normal** o **Alta**
3. Guarda los cambios

### 4. Configurar en Android (Celular de la Mesera)

**Emparejar por Bluetooth:**
1. En el celular Android: `Configuración` → `Bluetooth`
2. Activa Bluetooth si no está activado
3. Enciende la impresora H22
4. Busca "H22" en la lista de dispositivos disponibles
5. Toca para emparejar (puede pedir un código PIN, generalmente `0000` o `1234`)
6. Una vez emparejada, aparecerá como "Conectado"

**Nota importante:**
- La impresora debe estar encendida y en modo Bluetooth
- La distancia máxima es de 55 metros
- El formato del ticket está optimizado para 48mm (se ajusta automáticamente)

## ✅ Resultado

**En Windows (PC):**
- Al confirmar un pedido de **Salón**, se abrirá el diálogo de impresión
- La **H22** estará seleccionada automáticamente (si es predeterminada)
- Solo necesitas hacer clic en "Imprimir" (o Enter)
- El ticket se imprimirá directamente

**En Android (Celular de la Mesera):**
- Al confirmar un pedido de **Salón**, se abrirá el diálogo de impresión del navegador
- Selecciona "Guardar como PDF" o busca "H22" en la lista de impresoras disponibles
- Si la H22 está emparejada por Bluetooth, aparecerá en el diálogo
- Selecciona la H22 y toca "Imprimir"
- El ticket se imprimirá directamente desde el celular

## 🧪 Probar la Configuración

### En Windows (PC):
1. Abre la carta: `http://localhost:3000/carta/5XJ1J37F`
2. Agrega items al carrito
3. Selecciona modalidad **"Salón"**
4. Completa Mesa y Mesero/a
5. Haz clic en **"Confirmar"**
6. Revisa el preview
7. Haz clic en **"Confirmar e Imprimir"**
8. Verifica que la H22 esté seleccionada en el diálogo
9. Imprime

### En Android (Celular de la Mesera):
1. Abre la carta en el navegador del celular (Chrome o Firefox)
2. Agrega items al carrito
3. Selecciona modalidad **"Salón"**
4. Completa Mesa y Mesero/a
5. Haz clic en **"Confirmar"**
6. Revisa el preview
7. Haz clic en **"Confirmar e Imprimir"**
8. En el diálogo de impresión, selecciona "H22" (si está emparejada)
9. Toca "Imprimir"
10. El ticket se imprimirá directamente desde el celular

## 📝 Notas

- El formato está optimizado para **58mm** (ancho del papel de la H22)
- Ancho de impresión: **48mm** (área imprimible)
- Ancho del papel: **58mm** (57.5 +/- 0.5mm)
- La fuente es **Courier New** (monospace) para mejor alineación
- El ticket incluye todos los datos: comanda, fecha, mesa, mesero/a, items, total
- Compatible con papel térmico estándar de 58mm de ancho
- **Funciona desde Android**: La mesera puede imprimir directamente desde su celular
- **Preview ajustado**: El preview muestra el ancho real de 58mm para coincidir con el ticket impreso

## 📐 Especificaciones Técnicas

- **Ancho del papel**: 58mm (57.5 +/- 0.5mm)
- **Ancho de impresión**: 48mm (área imprimible)
- **Formato optimizado**: 58mm (coincide con el ancho real del papel)
- **Grosor del papel**: 0.048mm - 0.08mm
- **Velocidad**: hasta 90mm/s
- **Bluetooth**: 4.0 (compatible con Android)
- **Distancia Bluetooth**: hasta 55 metros
- **Temperatura de trabajo**: ≤ 45°C
- **Humedad**: ≤ 85%

## 🔗 Referencia

- Impresora: [H22 Bluetooth 4.0 + USB](https://www.mercadolibre.com.ar/impresora-termica-portatil-h22-bluetooth-40--cable-usb/up/MLAU366295133)
- Formato: 58mm (ancho del papel) x largo variable
- Área imprimible: 48mm
- Conexión: USB o Bluetooth 4.0 (SPP y BLE)
- Compatibilidad: Windows, Android

