# =============================================================================
# DOCKERFILE MULTI-STAGE PARA SPRING BOOT 3.2 + JAVA 17
# =============================================================================
# Implementación según Clase 13 - Docker y Deployment
#
# Ventajas del multi-stage build:
# - Imagen final más liviana (~280MB vs ~800MB)
# - Solo contiene el runtime necesario (JRE)
# - Más seguro (sin herramientas de build)
# - Builds reproducibles
# =============================================================================

# =============================================================================
# STAGE 1: BUILD (Construcción con Maven + JDK)
# =============================================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

# Metadata
LABEL stage=builder
LABEL description="Etapa de construcción con Maven"

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración Maven primero (aprovecha cache de Docker)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Descargar dependencias (se cachean si pom.xml no cambia)
RUN ./mvnw dependency:go-offline

# Copiar código fuente
COPY src ./src

# Compilar y empaquetar (skip tests para build más rápido)
RUN ./mvnw clean package -DskipTests

# =============================================================================
# STAGE 2: RUNTIME (Ejecución con JRE optimizado)
# =============================================================================
FROM eclipse-temurin:17-jre-alpine

# Metadata
LABEL maintainer="Lucas Cap - UADE Apps Interactivas"
LABEL description="E-Commerce Backend - Spring Boot 3.2 + MySQL"
LABEL version="2.0.0"

# Crear usuario no-root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring

# Directorio de trabajo
WORKDIR /app

# Copiar JAR desde stage de build
COPY --from=build /app/target/tpo-se-0.0.1-SNAPSHOT.jar app.jar

# Cambiar propietario del JAR
RUN chown spring:spring app.jar

# Cambiar a usuario no-root
USER spring:spring

# Puerto de la aplicación
EXPOSE 8080

# Variables de entorno por defecto (pueden sobrescribirse en docker-compose)
ENV SPRING_PROFILES_ACTIVE=prod
ENV TZ=America/Argentina/Buenos_Aires

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Comando de inicio
ENTRYPOINT ["java", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", \
    "app.jar"]