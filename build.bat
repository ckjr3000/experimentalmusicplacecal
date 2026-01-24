@echo off

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed.
    echo Please install it from https://nodejs.org (download the LTS version)
    exit /b 1
)

:: Run the build
node build.js

echo.
echo Done! Open dist\index.html in your browser to preview.
