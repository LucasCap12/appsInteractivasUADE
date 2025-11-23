#!/bin/bash
# =============================================================================
# SCRIPT DE INSTALACIÓN DE DOCKER Y DOCKER COMPOSE
# =============================================================================
# Para Ubuntu 22.04 (Jammy Jellyfish)
# Automatiza la instalación completa de Docker Engine y Docker Compose Plugin
# =============================================================================

set -e  # Detener en caso de error

echo "=========================================="
echo "🐳 INSTALACIÓN DE DOCKER"
echo "=========================================="
echo ""

# =============================================================================
# 1. DESINSTALAR VERSIONES ANTIGUAS
# =============================================================================
echo "📦 Paso 1: Eliminando versiones antiguas de Docker..."
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do 
    sudo apt-get remove -y $pkg 2>/dev/null || true
done
echo "✅ Versiones antiguas eliminadas"
echo ""

# =============================================================================
# 2. ACTUALIZAR SISTEMA
# =============================================================================
echo "📦 Paso 2: Actualizando repositorios del sistema..."
sudo apt-get update
echo "✅ Repositorios actualizados"
echo ""

# =============================================================================
# 3. INSTALAR DEPENDENCIAS
# =============================================================================
echo "📦 Paso 3: Instalando dependencias..."
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
echo "✅ Dependencias instaladas"
echo ""

# =============================================================================
# 4. AGREGAR GPG KEY DE DOCKER
# =============================================================================
echo "🔑 Paso 4: Agregando clave GPG oficial de Docker..."
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "✅ Clave GPG agregada"
echo ""

# =============================================================================
# 5. CONFIGURAR REPOSITORIO DE DOCKER
# =============================================================================
echo "📦 Paso 5: Configurando repositorio oficial de Docker..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$UBUNTU_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
echo "✅ Repositorio configurado"
echo ""

# =============================================================================
# 6. INSTALAR DOCKER ENGINE
# =============================================================================
echo "🐳 Paso 6: Instalando Docker Engine..."
sudo apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin
echo "✅ Docker Engine instalado"
echo ""

# =============================================================================
# 7. CONFIGURAR PERMISOS DE USUARIO
# =============================================================================
echo "👤 Paso 7: Configurando permisos de usuario..."
sudo usermod -aG docker $USER
echo "✅ Usuario agregado al grupo docker"
echo ""

# =============================================================================
# 8. HABILITAR E INICIAR SERVICIO
# =============================================================================
echo "⚙️  Paso 8: Habilitando e iniciando servicio Docker..."
sudo systemctl enable docker
sudo systemctl start docker
echo "✅ Servicio Docker iniciado"
echo ""

# =============================================================================
# 9. VERIFICAR INSTALACIÓN
# =============================================================================
echo "=========================================="
echo "🔍 VERIFICACIÓN DE INSTALACIÓN"
echo "=========================================="
echo ""

# Verificar versión de Docker
echo "📌 Versión de Docker:"
docker --version
echo ""

# Verificar versión de Docker Compose
echo "📌 Versión de Docker Compose:"
docker compose version
echo ""

# Verificar servicio
echo "📌 Estado del servicio Docker:"
sudo systemctl status docker --no-pager | head -3
echo ""

# Verificar grupo de usuario
echo "📌 Grupos del usuario actual:"
groups
echo ""

# =============================================================================
# 10. TEST FINAL
# =============================================================================
echo "=========================================="
echo "🧪 PRUEBA FINAL"
echo "=========================================="
echo ""
echo "Ejecutando contenedor de prueba..."

# Intentar ejecutar hello-world con sudo primero
if sudo docker run --rm hello-world > /dev/null 2>&1; then
    echo "✅ Docker funciona correctamente con sudo"
else
    echo "⚠️  Error al ejecutar contenedor de prueba"
fi

echo ""
echo "=========================================="
echo "✅ INSTALACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. IMPORTANTE: Debes RELOGUEARTE para aplicar permisos del grupo docker:"
echo "   exit"
echo "   vagrant ssh"
echo ""
echo "2. Después de reloguearte, verifica que docker funcione sin sudo:"
echo "   docker run --rm hello-world"
echo ""
echo "3. Si todo funciona, despliega la aplicación:"
echo "   cd /home/vagrant/carpeta_compartida/aplicacion"
echo "   docker compose up -d --build"
echo ""
echo "=========================================="
