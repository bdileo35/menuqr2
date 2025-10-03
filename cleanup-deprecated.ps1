# 🗑️ Script de Limpieza - Mover Archivos Deprecados
# Ejecutar desde: Z:\VSCode\QR-Suite\MenuQR

Write-Host "🧹 Iniciando limpieza de archivos deprecados..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-Not (Test-Path "app")) {
    Write-Host "❌ Error: Ejecuta este script desde la raíz de MenuQR" -ForegroundColor Red
    exit 1
}

# Crear estructura de carpetas en _deprecated
Write-Host "📁 Creando estructura en _deprecated..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "_deprecated\demo" -Force | Out-Null
New-Item -ItemType Directory -Path "_deprecated\demo-flow" -Force | Out-Null
New-Item -ItemType Directory -Path "_deprecated\generador" -Force | Out-Null
New-Item -ItemType Directory -Path "_deprecated\scripts" -Force | Out-Null

# Lista de archivos a mover
$archivosAMover = @(
    # Carpeta demo completa
    @{
        Origen = "app\demo"
        Destino = "_deprecated\demo"
        Tipo = "Carpeta"
        Razon = "Prototipos viejos de demos"
    },
    
    # Carpeta demo-flow completa
    @{
        Origen = "app\demo-flow"
        Destino = "_deprecated\demo-flow"
        Tipo = "Carpeta"
        Razon = "Prototipo viejo del wizard"
    },
    
    # Carpeta generador
    @{
        Origen = "app\generador"
        Destino = "_deprecated\generador"
        Tipo = "Carpeta"
        Razon = "Duplicado de /generar-qr"
    },
    
    # Scripts obsoletos
    @{
        Origen = "scripts\createEsquinaPompeya.mongoose.js"
        Destino = "_deprecated\scripts\createEsquinaPompeya.mongoose.js"
        Tipo = "Archivo"
        Razon = "Script MongoDB obsoleto"
    },
    
    @{
        Origen = "scripts\createEsquinaPompeya.prisma.js"
        Destino = "_deprecated\scripts\createEsquinaPompeya.prisma.js"
        Tipo = "Archivo"
        Razon = "Duplicado del .ts"
    }
)

Write-Host ""
Write-Host "📋 Archivos a mover:" -ForegroundColor Cyan
Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray

foreach ($item in $archivosAMover) {
    Write-Host "  • $($item.Origen)" -ForegroundColor White
    Write-Host "    → $($item.Destino)" -ForegroundColor DarkGray
    Write-Host "    Razón: $($item.Razon)" -ForegroundColor DarkYellow
    Write-Host ""
}

Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Confirmar con el usuario
$confirmacion = Read-Host "¿Proceder con el movimiento? (s/n)"

if ($confirmacion -ne "s") {
    Write-Host "❌ Operación cancelada" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Moviendo archivos..." -ForegroundColor Green
Write-Host ""

$exitosos = 0
$fallidos = 0

foreach ($item in $archivosAMover) {
    if (Test-Path $item.Origen) {
        try {
            # Crear directorio destino si no existe
            $dirDestino = Split-Path -Parent $item.Destino
            if (-Not (Test-Path $dirDestino)) {
                New-Item -ItemType Directory -Path $dirDestino -Force | Out-Null
            }
            
            # Mover archivo o carpeta
            Move-Item -Path $item.Origen -Destination $item.Destino -Force
            Write-Host "  ✅ Movido: $($item.Origen)" -ForegroundColor Green
            $exitosos++
        }
        catch {
            Write-Host "  ❌ Error al mover: $($item.Origen)" -ForegroundColor Red
            Write-Host "     $($_.Exception.Message)" -ForegroundColor DarkRed
            $fallidos++
        }
    }
    else {
        Write-Host "  ⚠️  No encontrado: $($item.Origen)" -ForegroundColor Yellow
        $fallidos++
    }
}

Write-Host ""
Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "  • Exitosos: $exitosos" -ForegroundColor Green
Write-Host "  • Fallidos: $fallidos" -ForegroundColor $(if ($fallidos -gt 0) { "Red" } else { "Gray" })
Write-Host "──────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

if ($exitosos -gt 0) {
    Write-Host "✨ Archivos movidos a: _deprecated/" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔍 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Verificar que la app sigue funcionando" -ForegroundColor White
    Write-Host "  2. Commit de los cambios" -ForegroundColor White
    Write-Host "  3. Si todo OK, eliminar _deprecated/ en el futuro" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Para revertir: mover archivos de vuelta desde _deprecated/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Limpieza completada" -ForegroundColor Green
