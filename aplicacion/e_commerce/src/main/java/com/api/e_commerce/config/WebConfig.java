package com.api.e_commerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de recursos estáticos para Spring Boot
 * 
 * @AI_CONTEXT: STATIC RESOURCE SERVING
 * @PURPOSE: Servir imágenes desde /images/** mapeadas a classpath:/static/images/
 * @REASON: DataInitializer usa URLs relativas (/images/*.png) que deben resolverse
 * @ALTERNATIVE: Sin esta config, Spring Boot no sirve /images/** por defecto
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Registra handler para servir archivos estáticos desde /images/**
     * 
     * @AI_CONTEXT: RESOURCE HANDLER
     * @MAPPING: /images/** (URL path) → classpath:/static/images/ (filesystem)
     * @EXAMPLE: GET /images/producto.png → src/main/resources/static/images/producto.png
     * @CACHING: Spring Boot agrega cache headers automáticamente
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCachePeriod(3600); // Cache 1 hora para optimizar performance
    }
}
