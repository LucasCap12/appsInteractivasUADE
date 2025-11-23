# =============================================================================
# E-COMMERCE - SCRIPT DE DESPLIEGUE AUTOMATIZADO
# =============================================================================
# Automatiza el despliegue completo de la aplicación E-Commerce
# Fecha: Noviembre 2025
# Proyecto: Portfolio Personal
# =============================================================================

param(
    [switch]$Menu,
    [switch]$SkipDemo
)

# Force UTF-8 encoding for console output
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Continue"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# =============================================================================
# FUNCIONES AUXILIARES
# =============================================================================

function Show-Banner {
    param([string]$title, [string]$color = "Cyan")
    Write-Host ""
    Write-Host ("=" * 80) -ForegroundColor $color
    Write-Host "  $title" -ForegroundColor $color
    Write-Host ("=" * 80) -ForegroundColor $color
    Write-Host ""
}

function Show-Step {
    param([string]$step, [string]$description)
    Write-Host ""
    Write-Host "[$step] $description" -ForegroundColor Yellow
    Write-Host ("-" * 80) -ForegroundColor DarkGray
}

function Test-VagrantCommand {
    try {
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        $null = vagrant --version 2>&1
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

function Wait-ForKeypress {
    param([string]$message = "Presiona Enter para continuar...")
    Write-Host ""
    Write-Host $message -ForegroundColor Cyan
    Read-Host
}

function Show-Menu {
    # Refrescar PATH para asegurar que vagrant esté disponible
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    while ($true) {
        Show-Banner "MENU INTERACTIVO OPTIMIZADO" "Cyan"
        
        Write-Host "  [1] Ver Estado y Logs (Contenedores, Backend, MySQL)" -ForegroundColor White
        Write-Host "  [2] Ejecutar Pruebas (Health, API, Paginas, Rate Limit)" -ForegroundColor White
        Write-Host "  [3] Abrir Frontend en navegador" -ForegroundColor White
        Write-Host "  [4] Reiniciar aplicacion" -ForegroundColor White
        Write-Host "  [5] Detener aplicacion" -ForegroundColor White
        Write-Host "  [6] Opciones Avanzadas (SSH, Rebuild)" -ForegroundColor Magenta
        Write-Host "  [0] Salir" -ForegroundColor Red
        Write-Host ""
        
        $choice = Read-Host "Selecciona una opcion"
        
        switch ($choice) {
            "1" {
                Write-Host "--- ESTADO DE CONTENEDORES ---" -ForegroundColor Yellow
                $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
                vagrant ssh -c "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
                
                Write-Host "`n--- LOGS BACKEND (Ultimas 20 lineas) ---" -ForegroundColor Yellow
                vagrant ssh -c "docker logs --tail 20 ecommerce-backend"
                
                Write-Host "`n--- LOGS MYSQL (Ultimas 10 lineas) ---" -ForegroundColor Yellow
                vagrant ssh -c "docker logs --tail 10 ecommerce-mysql"
                
                Wait-ForKeypress
            }
            "2" {
                Write-Host "--- HEALTH CHECK ---" -ForegroundColor Yellow
                try {
                    $r = Invoke-RestMethod "http://192.168.56.2:8080/actuator/health"
                    Write-Host "[OK] Backend UP - Status: $($r.status)" -ForegroundColor Green
                } catch { Write-Host "[X] Backend no responde" -ForegroundColor Red }

                Write-Host "`n--- API CATEGORIAS ---" -ForegroundColor Yellow
                try {
                    $cats = Invoke-RestMethod "http://192.168.56.2:8080/api/categorias"
                    Write-Host "[OK] $($cats.Count) categorias encontradas" -ForegroundColor Green
                } catch { Write-Host "[X] Error API" -ForegroundColor Red }

                Write-Host "`n--- PAGINAS CRITICAS ---" -ForegroundColor Yellow
                $pages = @{ "Home"="http://192.168.56.2/"; "Checkout"="http://192.168.56.2/checkout" }
                foreach ($p in $pages.GetEnumerator()) {
                    try { 
                        $c = (Invoke-WebRequest $p.Value -UseBasicParsing -TimeoutSec 5).StatusCode
                        Write-Host "  [OK] $($p.Key): $c" -ForegroundColor Green
                    } catch { Write-Host "  [X] $($p.Key): Error" -ForegroundColor Red }
                }

                Write-Host "`n--- RATE LIMITING (429 Errors) ---" -ForegroundColor Yellow
                $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
                $errs = vagrant ssh -c "docker logs ecommerce-backend --since 10m 2>&1 | grep -c '429'" 2>&1
                if ($errs -match '^\d+$') { 
                    $color = if ($errs -eq 0) { "Green" } else { "Yellow" }
                    Write-Host "  Errores 429 (10m): $errs" -ForegroundColor $color 
                }
                
                Wait-ForKeypress
            }
            "3" {
                Start-Process "http://192.168.56.2"
                Write-Host "[OK] Navegador abierto" -ForegroundColor Green
                Wait-ForKeypress
            }
            "4" {
                Write-Host "Reiniciando aplicacion..." -ForegroundColor Yellow
                $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
                vagrant ssh -c "cd /home/vagrant/carpeta_compartida/aplicacion; docker compose restart"
                Write-Host "[OK] Aplicacion reiniciada" -ForegroundColor Green
                Wait-ForKeypress
            }
            "5" {
                Write-Host "Deteniendo aplicacion..." -ForegroundColor Yellow
                $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
                vagrant ssh -c "cd /home/vagrant/carpeta_compartida/aplicacion; docker compose down"
                Write-Host "[OK] Aplicacion detenida" -ForegroundColor Green
                Wait-ForKeypress
            }
            "6" {
                Write-Host "  [1] Conectar por SSH"
                Write-Host "  [2] Rebuild Backend"
                $sub = Read-Host "Selecciona opcion"
                if ($sub -eq "1") { vagrant ssh }
                elseif ($sub -eq "2") {
                    Write-Host "Rebuilding backend..." -ForegroundColor Yellow
                    vagrant ssh -c "cd /home/vagrant/carpeta_compartida/aplicacion; docker compose stop backend; docker compose build backend; docker compose up -d backend"
                    Wait-ForKeypress
                }
            }
            "0" {
                Write-Host "Saliendo..." -ForegroundColor Cyan
                return
            }
            default {
                Write-Host "Opcion invalida" -ForegroundColor Red
                Start-Sleep -Seconds 1
            }
        }
    }
}

# =============================================================================
# INICIO DE LA DEMOSTRACION
# =============================================================================

# Si se invoca con -Menu, abrir directamente el menú
if ($Menu) {
    Clear-Host
    Show-Menu
    exit 0
}

Clear-Host
Show-Banner "E-COMMERCE: DESPLIEGUE COMPLETO DE STACK CON VAGRANT Y DOCKER" "Green"

Write-Host "Este script automatiza el despliegue completo de la aplicación:" -ForegroundColor White
Write-Host "  [OK] Provision de VM con Vagrant" -ForegroundColor Gray
Write-Host "  [OK] Instalacion de Docker en Linux" -ForegroundColor Gray
Write-Host "  [OK] Despliegue de aplicacion 3 capas (Frontend + Backend + MySQL)" -ForegroundColor Gray
Write-Host "  [OK] Verificacion desde Windows" -ForegroundColor Gray
Write-Host ""
Write-Host "Para acceder al menu de gestion: .\DEMO-COMPLETA.ps1 -Menu" -ForegroundColor Cyan
Write-Host ""

if (-not $SkipDemo) {
    $continuar = Read-Host "Deseas continuar con la demo completa? (S/N)"
    if ($continuar -ne "S" -and $continuar -ne "s") {
        Write-Host "Demo cancelada. Usa -Menu para gestion rapida." -ForegroundColor Yellow
        exit 0
    }
}

# =============================================================================
# FASE 1: PROVISION Y CONFIGURACION DEL SERVIDOR (75 minutos)
# =============================================================================

Show-Banner "FASE 1: PROVISION Y CONFIGURACION DEL SERVIDOR" "Cyan"

# -----------------------------------------------------------------------------
# Paso 1: Levantamiento de la VM
# -----------------------------------------------------------------------------
Show-Step "1/8" "LEVANTAMIENTO DE LA VM CON VAGRANT"

if (-not (Test-VagrantCommand)) {
    Write-Host "ERROR: Vagrant no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor, instala Vagrant con: choco install -y vagrant" -ForegroundColor Yellow
    Wait-ForKeypress "Presiona Enter para salir..."
    exit 1
}

Write-Host "[OK] Vagrant detectado" -ForegroundColor Green

# Verificar estado de la VM
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$vagrantStatus = vagrant status 2>&1 | Out-String

if ($vagrantStatus -match "running") {
    Write-Host "[OK] VM ya esta corriendo" -ForegroundColor Green
    $recrear = Read-Host "Deseas recrear la VM desde cero? (S/N)"
    if ($recrear -eq "S" -or $recrear -eq "s") {
        Write-Host "Destruyendo VM existente..." -ForegroundColor Yellow
        vagrant destroy -f
        Write-Host "Levantando VM nuevamente..." -ForegroundColor Yellow
        vagrant up
    }
}
elseif ($vagrantStatus -match "not created") {
    Write-Host "Levantando VM por primera vez (puede tomar varios minutos)..." -ForegroundColor Yellow
    vagrant up
}
else {
    Write-Host "Iniciando VM..." -ForegroundColor Yellow
    vagrant up
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo levantar la VM" -ForegroundColor Red
    Wait-ForKeypress
    exit 1
}

Write-Host "[OK] VM levantada exitosamente" -ForegroundColor Green
Wait-ForKeypress

# -----------------------------------------------------------------------------
# Paso 2: Acceso e Inspeccion
# -----------------------------------------------------------------------------
Show-Step "2/8" "ACCESO E INSPECCION DE LA VM"

Write-Host "Verificando carpeta compartida..." -ForegroundColor Gray
$checkFolder = vagrant ssh -c "ls -la /home/vagrant/carpeta_compartida" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Carpeta compartida montada correctamente" -ForegroundColor Green
    Write-Host $checkFolder -ForegroundColor DarkGray
}
else {
    Write-Host "[!] Advertencia: Problema con carpeta compartida" -ForegroundColor Yellow
}

Wait-ForKeypress

# -----------------------------------------------------------------------------
# Paso 3: Instalacion de Docker
# -----------------------------------------------------------------------------
Show-Step "3/8" "INSTALACION DE DOCKER Y DOCKER COMPOSE"

Write-Host "Verificando si Docker esta instalado..." -ForegroundColor Gray
$dockerCheck = vagrant ssh -c "docker --version" 2>&1

if ($dockerCheck -match "Docker version") {
    Write-Host "[OK] Docker ya esta instalado: $dockerCheck" -ForegroundColor Green
    $reinstalar = Read-Host "Deseas reinstalar Docker? (S/N)"
    if ($reinstalar -eq "S" -or $reinstalar -eq "s") {
        Write-Host "Reinstalando Docker..." -ForegroundColor Yellow
        vagrant ssh -c "bash /home/vagrant/carpeta_compartida/scripts/install_docker.sh"
    }
}
else {
    Write-Host "Instalando Docker en la VM (puede tomar 5-10 minutos)..." -ForegroundColor Yellow
    vagrant ssh -c "bash /home/vagrant/carpeta_compartida/scripts/install_docker.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Docker instalado exitosamente" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Fallo la instalacion de Docker" -ForegroundColor Red
        Wait-ForKeypress
        exit 1
    }
}

# Verificar versiones
Write-Host ""
Write-Host "Versiones instaladas:" -ForegroundColor Cyan
vagrant ssh -c "docker --version; docker compose version"
Write-Host ""

Wait-ForKeypress

# =============================================================================
# FASE 2: DESPLIEGUE DE LA APLICACION (90 minutos)
# =============================================================================

Show-Banner "FASE 2: DESPLIEGUE DE LA APLICACION" "Cyan"

# -----------------------------------------------------------------------------
# Paso 4: Preparacion del Despliegue
# -----------------------------------------------------------------------------
Show-Step "4/8" "PREPARACION DEL DESPLIEGUE"

Write-Host "Revisando configuracion de docker-compose.yml..." -ForegroundColor Gray
vagrant ssh -c "cat /home/vagrant/carpeta_compartida/aplicacion/docker-compose.yml | grep -A 5 'environment:' | head -20"

Write-Host ""
Write-Host "Verificando archivo .env del backend..." -ForegroundColor Gray
$envCheck = vagrant ssh -c "test -f /home/vagrant/carpeta_compartida/aplicacion/e_commerce/.env && echo 'EXISTS' || echo 'NOT_FOUND'" 2>&1

if ($envCheck -match "EXISTS") {
    Write-Host "[OK] Archivo .env encontrado" -ForegroundColor Green
}
else {
    Write-Host "[!] Archivo .env no encontrado, se usarán valores por defecto" -ForegroundColor Yellow
}

Wait-ForKeypress

# -----------------------------------------------------------------------------
# Paso 5: Despliegue del Stack Completo
# -----------------------------------------------------------------------------
Show-Step "5/8" "DESPLIEGUE DEL STACK COMPLETO (Frontend + Backend + MySQL)"

Write-Host "Limpiando contenedores anteriores..." -ForegroundColor Gray
vagrant ssh -c "cd /home/vagrant/carpeta_compartida/aplicacion; docker compose down -v" 2>&1 | Out-Null

Write-Host "Construyendo y levantando contenedores (esto puede tomar 10-15 minutos)..." -ForegroundColor Yellow
Write-Host "  - Descargando imágenes base" -ForegroundColor DarkGray
Write-Host "  - Compilando Backend (Spring Boot)" -ForegroundColor DarkGray
Write-Host "  - Compilando Frontend (React + Vite)" -ForegroundColor DarkGray
Write-Host ""

# Paso 5.1: Levantar MySQL primero
Write-Host "[1/3] Iniciando MySQL y esperando que esté listo..." -ForegroundColor Cyan
$deployOutput = vagrant ssh -c "cd /home/vagrant/carpeta_compartida/aplicacion; docker compose up -d mysql 2>&1" 2>&1
Write-Host $deployOutput

# Esperar a que MySQL esté healthy (máximo 60 segundos)
Write-Host "[2/3] Esperando a que MySQL esté completamente listo..." -ForegroundColor Cyan
$maxWait = 60
$waited = 0
$mysqlReady = $false

while ($waited -lt $maxWait -and -not $mysqlReady) {
    Start-Sleep -Seconds 5
    $waited += 5
    $healthCheck = vagrant ssh -c "docker inspect --format='{{.State.Health.Status}}' ecommerce-mysql 2>&1" 2>&1
    
    if ($healthCheck -match "healthy") {
        $mysqlReady = $true
        Write-Host "  [OK] MySQL está listo después de $waited segundos" -ForegroundColor Green
    }
    else {
        Write-Host "  Esperando... ($waited/$maxWait segundos)" -ForegroundColor Gray
    }
}

if (-not $mysqlReady) {
    Write-Host "  [!] MySQL tardó más de lo esperado, continuando de todos modos..." -ForegroundColor Yellow
}

# Paso 5.2: Construir y levantar Backend y Frontend
Write-Host "[3/3] Construyendo e iniciando Backend y Frontend..." -ForegroundColor Cyan
$deployOutput = vagrant ssh -c "cd /home/vagrant/carpeta_compartida/aplicacion; docker compose up -d --build backend frontend 2>&1" 2>&1
Write-Host $deployOutput

if ($deployOutput -match "Started" -or $deployOutput -match "Running" -or $deployOutput -match "Healthy") {
    Write-Host ""
    Write-Host "[OK] Todos los contenedores desplegados exitosamente" -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "[!] Revisa la salida anterior para verificar errores" -ForegroundColor Yellow
}

Wait-ForKeypress

# =============================================================================
# FASE 3: VALIDACION, RED Y ENTREGA (75 minutos)
# =============================================================================

Show-Banner "FASE 3: VALIDACION Y VERIFICACION" "Cyan"

# -----------------------------------------------------------------------------
# Paso 6: Verificacion Interna
# -----------------------------------------------------------------------------
Show-Step "6/8" "VERIFICACION INTERNA - ESTADO DE CONTENEDORES"

Write-Host "Esperando 30 segundos adicionales para que Backend termine de iniciar..." -ForegroundColor Gray
Start-Sleep -Seconds 30

Write-Host "Estado de los contenedores:" -ForegroundColor Cyan
vagrant ssh -c "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"

Write-Host ""
Write-Host "Verificando logs del Backend..." -ForegroundColor Cyan
Write-Host "(Buscando mensajes de inicializacion y conexion a DB)" -ForegroundColor DarkGray
vagrant ssh -c "docker logs ecommerce-backend --tail 30 2>&1 | grep -E 'Started|COMPLETADA|Tomcat|error'" 

Write-Host ""
Write-Host "Verificando logs de MySQL..." -ForegroundColor Cyan
vagrant ssh -c "docker logs ecommerce-mysql --tail 15 2>&1 | grep -E 'ready|MySQL|Version'"

Wait-ForKeypress

# -----------------------------------------------------------------------------
# Paso 7: Acceso desde Windows (Host)
# -----------------------------------------------------------------------------
Show-Step "7/8" "ACCESO DESDE WINDOWS - PRUEBAS DE CONECTIVIDAD"

$vmIP = "192.168.56.2"

Write-Host "Probando conectividad con el Backend..." -ForegroundColor Cyan
Write-Host "(Esperando 15 segundos adicionales para Spring Boot...)" -ForegroundColor DarkGray
Start-Sleep -Seconds 15
try {
    $response = Invoke-RestMethod -Uri "http://${vmIP}:8080/actuator/health" -TimeoutSec 10
    Write-Host "[OK] Backend responde correctamente" -ForegroundColor Green
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
}
catch {
    Write-Host "[X] Backend no responde" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor DarkRed
}

Write-Host ""
Write-Host "Probando conectividad con el Frontend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://${vmIP}:80" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Frontend responde correctamente (HTML recibido)" -ForegroundColor Green
    }
}
catch {
    Write-Host "[X] Frontend no responde" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor DarkRed
}

Write-Host ""
Write-Host "Probando endpoint de categorias..." -ForegroundColor Cyan
try {
    $categorias = Invoke-RestMethod -Uri "http://${vmIP}:8080/api/categorias" -TimeoutSec 5
    Write-Host "[OK] API funcionando - $($categorias.Count) categorias encontradas" -ForegroundColor Green
    $categorias | ForEach-Object { Write-Host "    - $($_.nombre)" -ForegroundColor DarkGray }
}
catch {
    Write-Host "[!] No se pudieron obtener categorias (puede ser problema de autenticacion)" -ForegroundColor Yellow
}

Wait-ForKeypress

# -----------------------------------------------------------------------------
# Paso 8: Apertura del Navegador
# -----------------------------------------------------------------------------
Show-Step "8/8" "APERTURA DEL NAVEGADOR - DEMOSTRACION VISUAL"

Write-Host "Abriendo navegador en http://${vmIP}" -ForegroundColor Cyan
Start-Process "http://${vmIP}"

Write-Host ""
Write-Host "[OK] Navegador abierto" -ForegroundColor Green
Write-Host ""
Write-Host "Puedes interactuar con la aplicacion:" -ForegroundColor White
Write-Host "  - Ver catalogo de productos" -ForegroundColor Gray
Write-Host "  - Registrar nuevo usuario" -ForegroundColor Gray
Write-Host "  - Iniciar sesion con:" -ForegroundColor Gray
Write-Host "      Email: admin@market.com" -ForegroundColor Yellow
Write-Host "      Pass:  admin123" -ForegroundColor Yellow
Write-Host "  - Agregar productos al carrito" -ForegroundColor Gray
Write-Host "  - Gestionar inventario (admin)" -ForegroundColor Gray

Wait-ForKeypress

# =============================================================================
# RESUMEN FINAL Y COMANDOS UTILES
# =============================================================================

Show-Banner "DEMOSTRACION COMPLETADA EXITOSAMENTE" "Green"

Write-Host "[RESUMEN] RESUMEN DEL DESPLIEGUE:" -ForegroundColor Cyan
Write-Host ""
Write-Host "[OK] VM Ubuntu 22.04 corriendo en VirtualBox" -ForegroundColor Green
Write-Host "[OK] Docker y Docker Compose instalados" -ForegroundColor Green
Write-Host "[OK] 3 contenedores desplegados:" -ForegroundColor Green
Write-Host "    - ecommerce-frontend (React + Nginx)" -ForegroundColor Gray
Write-Host "    - ecommerce-backend (Spring Boot)" -ForegroundColor Gray
Write-Host "    - ecommerce-mysql (MySQL 8.0)" -ForegroundColor Gray
Write-Host ""

Write-Host "[URLs] URLS DE ACCESO:" -ForegroundColor Cyan
Write-Host "  Frontend:    http://192.168.56.2" -ForegroundColor White
Write-Host "  Backend API: http://192.168.56.2:8080/api" -ForegroundColor White
Write-Host "  Health:      http://192.168.56.2:8080/actuator/health" -ForegroundColor White
Write-Host ""

Write-Host "[CREDENCIALES] CREDENCIALES:" -ForegroundColor Cyan
Write-Host "  Admin:   admin@market.com / admin123" -ForegroundColor Yellow
Write-Host "  Usuario: juan@market.com / password123" -ForegroundColor Yellow
Write-Host ""

Write-Host "[COMANDOS] COMANDOS UTILES:" -ForegroundColor Cyan
Write-Host "  # Conectar a la VM" -ForegroundColor DarkGray
Write-Host "  vagrant ssh" -ForegroundColor White
Write-Host ""
Write-Host "  # Ver logs de contenedores (dentro de VM)" -ForegroundColor DarkGray
Write-Host "  cd /home/vagrant/carpeta_compartida/aplicacion" -ForegroundColor White
Write-Host "  docker logs -f ecommerce-backend" -ForegroundColor White
Write-Host "  docker logs -f ecommerce-mysql" -ForegroundColor White
Write-Host ""
Write-Host "  # Detener aplicacion" -ForegroundColor DarkGray
Write-Host "  docker compose down" -ForegroundColor White
Write-Host ""
Write-Host "  # Reiniciar aplicacion" -ForegroundColor DarkGray
Write-Host "  docker compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "  # Detener VM (desde Windows)" -ForegroundColor DarkGray
Write-Host "  vagrant halt" -ForegroundColor White
Write-Host ""

Write-Host "Para gestionar el proyecto, ejecuta el menu interactivo:" -ForegroundColor White
Write-Host "  .\DEMO-COMPLETA.ps1 -Menu" -ForegroundColor Cyan
Write-Host ""

$menuChoice = Read-Host "Deseas abrir el menu interactivo ahora? (S/N)"
if ($menuChoice -eq "S" -or $menuChoice -eq "s") {
    Clear-Host
    Show-Menu
}

Write-Host ""
Write-Host "Gracias por usar este script de demostracion." -ForegroundColor Cyan
Write-Host "Espero te haya gustado mi trabajo" -ForegroundColor Green
Write-Host ""

