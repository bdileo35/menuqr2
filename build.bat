@echo off
echo ========================================
echo   MenuQR-Next - Build para Deploy
echo ========================================
echo.

echo [1/3] Generando cliente Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Fallo en prisma generate
    pause
    exit /b 1
)

echo.
echo [2/3] Creando build de produccion...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo en build
    pause
    exit /b 1
)

echo.
echo [3/3] Build completado exitosamente!
echo ========================================
echo    Listo para deploy en Vercel
echo ========================================
echo Comandos utiles:
echo - vercel --prod (deploy a produccion)
echo - npm start (servidor produccion local)
echo.
pause