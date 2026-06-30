@echo off
echo Instalando dependencias del portafolio mrmerlo.com...
cd /d "%~dp0"
npm install
echo.
echo Listo! Ejecuta "npm run dev" para iniciar en localhost:3000
pause
