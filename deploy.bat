@echo off
echo ========================================
echo    QR-Suite - MenuQR Deploy Script
echo ========================================
echo.

echo [1/4] Agregando archivos al git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Error agregando archivos
    pause
    exit /b 1
)
echo ✅ Archivos agregados

echo.
echo [2/4] Haciendo commit...
git commit -m "Fix: Mostrar platos no disponibles en carta-menu

- Removido filtro isAvailable: true de API /menu/[restaurantId]
- Agregado mapeo de isAvailable en editor loadMenuFromAPI
- Ahora carta-menu muestra todos los platos (disponibles y no disponibles)
- Platos no disponibles aparecen grises/deshabilitados
- Editor persiste cambios de disponibilidad correctamente"
if %errorlevel% neq 0 (
    echo ❌ Error haciendo commit
    pause
    exit /b 1
)
echo ✅ Commit realizado

echo.
echo [3/4] Subiendo a GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Error subiendo a GitHub
    pause
    exit /b 1
)
echo ✅ Push a GitHub completado

echo.
echo [4/4] Desplegando en Vercel...
echo ✅ Vercel deploy automático iniciado
echo.
echo ========================================
echo    🚀 Deploy completado exitosamente!
echo ========================================
echo.
echo 📋 Resumen de cambios:
echo    • API ahora envía todos los platos
echo    • Carta-menu muestra platos deshabilitados
echo    • Editor persiste cambios correctamente
echo.
echo 🌐 Tu app estará disponible en:
echo    https://menuqr-next.vercel.app
echo.
echo ⏱️  Vercel puede tardar 1-2 minutos en desplegar
echo.
pause

