# =============================================================================
# SCRIPT DE INICIO RAPIDO - VAGRANT + DOCKER
# =============================================================================
# Levanta la VM y los contenedores Docker de forma minimalista
# Asume que Docker ya está instalado en la VM
# Ejecutar desde: c:\Users\lucas\Documents\AppInteract\Clase15-2doParcial
# =============================================================================

param(
    [switch]$SkipBrowser,
    [switch]$Verbose,
    [switch]$Rebuild
)

# Force UTF-8 encoding for console output
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Continue"

function Write-Step {
    param([string]$message, [string]$color = "Cyan")
    Write-Host ""
    Write-Host "▶ $message" -ForegroundColor $color
}

function Write-Success {
    param([string]$message)
    Write-Host "  [OK] $message" -ForegroundColor Green
}

function Write-Error {
    param([string]$message)
    Write-Host "  [X] $message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$message)
    Write-Host "  [!] $message" -ForegroundColor Yellow
}

function Wait-ForService {
    param([string]$url, [int]$timeoutSeconds = 30)
    $elapsed = 0
    $interval = 2
    while ($elapsed -lt $timeoutSeconds) {
        try {
            $response = Invoke-WebRequest -Uri $url -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
            return $true
        } catch {
            Start-Sleep -Seconds $interval
            $elapsed += $interval
        }
    }
    return $false
}

# =============================================================================
# BANNER
# =============================================================================
Clear-Host
Write-Host ""
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  INICIO RAPIDO - TP VAGRANT + DOCKER" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host ""

# Configurar PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# =============================================================================
# PASO 1: VERIFICAR Y LEVANTAR VM
# =============================================================================
Write-Step "Levantando VM..."
try {
    $vagrantVersion = vagrant --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Vagrant no está instalado"
        exit 1
    }
    Write-Success "Vagrant detectado: $vagrantVersion"
} catch {
    Write-Error "Vagrant no está instalado"
    exit 1
}

# Verificar estado y levantar si es necesario
$status = vagrant status 2>&1 | Out-String
if ($status -match "running") {
    Write-Success "VM ya está corriendo"
} elseif ($status -match "poweroff" -or $status -match "saved") {
    Write-Warning "VM detenida. Levantando..."
    vagrant up 2>&1 | Out-Null
    Write-Success "VM levantada"
} else {
    Write-Error "Estado desconocido de la VM"
    exit 1
}

# =============================================================================
# PASO 2: VERIFICAR DOCKER EN LA VM
# =============================================================================
Write-Step "Verificando Docker en la VM..."
$dockerVersion = vagrant ssh -c "docker --version" 2>&1
if ($dockerVersion -match "Docker version") {
    Write-Success "Docker detectado: $($dockerVersion.Trim())"
} else {
    Write-Error "Docker no está instalado en la VM"
    exit 1
}

# =============================================================================
# PASO 3: LEVANTAR CONTENEDORES
# =============================================================================
Write-Step "Iniciando contenedores Docker..."
Write-Host "  - Verificando contenedores existentes..." -ForegroundColor Gray

$buildFlag = if ($Rebuild) { "--build" } else { "" }
if ($Rebuild) {
    Write-Host "  - Modo Rebuild activado (recompilando imagenes)..." -ForegroundColor Yellow
}

$deployOutput = vagrant ssh -c "cd /home/vagrant/carpeta_compartida/aplicacion && docker compose up -d $buildFlag 2>&1" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Success "Contenedores iniciados/verificados"
} else {
    Write-Error "Error al iniciar contenedores"
    if ($Verbose) {
        Write-Host $deployOutput
    }
    exit 1
}

# =============================================================================
# PASO 4: ESPERAR A QUE LOS SERVICIOS ESTÉN LISTOS
# =============================================================================
Write-Step "Esperando a que los servicios estén listos..."
Write-Host "  Esperando Backend (http://192.168.56.2:8080)..." -ForegroundColor Gray

# Aumentar timeout si hay rebuild
$backendTimeout = if ($Rebuild) { 120 } else { 80 }
if (Wait-ForService "http://192.168.56.2:8080/actuator/health" $backendTimeout) {
    Write-Success "Backend listo"
} else {
    Write-Warning "Backend tardó mucho en responder (timeout ${backendTimeout}s)"
}

Write-Host "  Esperando Frontend (http://192.168.56.2)..." -ForegroundColor Gray
if (Wait-ForService "http://192.168.56.2" 60) {
    Write-Success "Frontend listo"
} else {
    Write-Warning "Frontend tardó mucho en responder"
}

# =============================================================================
# PASO 5: VERIFICACION RAPIDA
# =============================================================================
Write-Step "Verificación rápida..."
$containers = vagrant ssh -c "docker ps --format '{{.Names}}'" 2>&1
$containerCount = ($containers -split "`n" | Where-Object { $_ -match "ecommerce" }).Count

if ($containerCount -ge 3) {
    Write-Success "3 contenedores activos"
    if ($Verbose) {
        Write-Host ""
        vagrant ssh -c "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'" | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        Write-Host ""
    }
} else {
    Write-Warning "Menos de 3 contenedores detectados"
}

# Verificar páginas críticas
Write-Host "  Verificando páginas críticas..." -ForegroundColor Gray
$pages = @{
    "Home" = "http://192.168.56.2/"
    "Profile" = "http://192.168.56.2/perfil"
    "Checkout" = "http://192.168.56.2/checkout"
    "Historial" = "http://192.168.56.2/historial"
}
$pageOk = 0
foreach ($page in $pages.GetEnumerator()) {
    try {
        $resp = Invoke-WebRequest -Uri $page.Value -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        if ($resp.StatusCode -eq 200) { $pageOk++ }
        if ($Verbose) {
            Write-Host "    [OK] $($page.Key): $($resp.StatusCode)" -ForegroundColor Green
        }
    }
    catch {
        if ($Verbose) {
            Write-Host "    [X] $($page.Key): ERROR" -ForegroundColor Red
        }
    }
}
Write-Success "$pageOk/4 páginas respondiendo correctamente"

# =============================================================================
# RESUMEN Y ACCESO
# =============================================================================
Write-Host ""
Write-Host "===============================================================" -ForegroundColor Green
Write-Host "  APLICACION LISTA PARA USAR" -ForegroundColor Green
Write-Host "===============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Cyan
Write-Host "  Frontend:      http://192.168.56.2" -ForegroundColor White
Write-Host "  Backend API:   http://192.168.56.2:8080/api" -ForegroundColor White
Write-Host "  Health Check:  http://192.168.56.2:8080/actuator/health" -ForegroundColor White
Write-Host ""
Write-Host "Páginas implementadas:" -ForegroundColor Cyan
Write-Host "  /perfil        - Edición de perfil de usuario" -ForegroundColor White
Write-Host "  /checkout      - Proceso de compra (4 pasos)" -ForegroundColor White
Write-Host "  /historial     - Historial de navegación (últimos 10 productos)" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor Cyan
Write-Host "  Email: admin@market.com" -ForegroundColor Yellow
Write-Host "  Pass:  admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opciones de uso:" -ForegroundColor Cyan
Write-Host "  .\TEST-RAPIDO.ps1 -Rebuild        # Reconstruir imágenes si cambiaste código" -ForegroundColor Gray
Write-Host "  .\TEST-RAPIDO.ps1 -Verbose        # Ver detalles de cada verificación" -ForegroundColor Gray
Write-Host "  .\TEST-RAPIDO.ps1 -SkipBrowser    # No abrir navegador automáticamente" -ForegroundColor Gray
Write-Host "  .\DEMO-COMPLETA.ps1 -Menu         # Abrir menú interactivo de gestión" -ForegroundColor Gray
Write-Host ""

# Abrir navegador
if (-not $SkipBrowser) {
    Write-Host "Abriendo navegador..." -ForegroundColor Gray
    Start-Process "http://192.168.56.2"
    Write-Success "Navegador abierto"
}

Write-Host ""
Write-Host "===============================================================" -ForegroundColor Green
Write-Host ""
