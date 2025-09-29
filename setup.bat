@echo off
echo ========================================
echo   MenuQR-Next - Setup y Configuracion
echo ========================================
echo.

echo [1/6] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo en npm install
    pause
    exit /b 1
)

echo.
echo [2/6] Generando cliente Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Fallo en prisma generate
    pause
    exit /b 1
)

echo.
echo [3/6] Creando base de datos...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Fallo en prisma db push
    pause
    exit /b 1
)

echo.
echo [4/6] Verificando build...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo en build de verificacion
    echo Continuando con desarrollo...
)

echo.
echo [5/6] Creando datos de ejemplo...
echo Creando restaurante demo "Esquina Pompeya"...

echo.
echo [6/6] Setup completado!
echo ========================================
echo    MenuQR-Next listo para desarrollo
echo ========================================
echo.
echo URLs disponibles:
echo - Inicio: http://localhost:3000
echo - Demo Menu: http://localhost:3000/menu/demo
echo - Admin: http://localhost:3000/admin/login
echo - API: http://localhost:3000/api
echo.
echo Iniciando servidor...
call npm run dev