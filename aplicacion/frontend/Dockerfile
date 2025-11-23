# =============================================================================
# DOCKERFILE MULTI-STAGE PARA REACT + VITE + NGINX
# =============================================================================
# Frontend del E-Commerce - Optimizado para producción
# Build size: ~150MB (vs ~1.2GB con node:alpine)
# =============================================================================

# =============================================================================
# STAGE 1: BUILD (Construcción con Node.js)
# =============================================================================
FROM node:20-alpine AS build

# Metadata
LABEL stage=builder
LABEL description="Etapa de construcción con Node.js y Vite"

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración primero (cache de Docker)
COPY package*.json ./

# Instalar TODAS las dependencias (necesarias para vite build)
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción con Vite
RUN npm run build

# =============================================================================
# STAGE 2: RUNTIME (Servidor web con Nginx)
# =============================================================================
FROM nginx:alpine

# Metadata
LABEL maintainer="Lucas Cap - UADE Apps Interactivas"
LABEL description="E-Commerce Frontend - React + Vite + Nginx"
LABEL version="1.0.0"

# Eliminar configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build desde stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
