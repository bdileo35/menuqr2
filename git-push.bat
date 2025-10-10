@echo off
echo === Subiendo MenuQR a GitHub ===
echo.

echo Agregando archivos...
git add .

echo Haciendo commit...
git commit -m "Actualizacion MenuQR"

echo Subiendo a GitHub...
git push origin master

echo.
echo LISTO! Tu codigo esta en GitHub
pause