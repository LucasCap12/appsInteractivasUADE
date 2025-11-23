package com.api.e_commerce.config;

import java.util.Arrays;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de caché para mejorar performance
 * 
 * Cachés configurados:
 * - productos: Lista completa de productos activos
 * - categorias: Lista de categorías
 * - producto: Producto individual por ID
 * - productosPorCategoria: Productos filtrados por categoría
 * - favoritos: Favoritos por usuario
 * - ofertas: Productos con descuento
 */
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
            new ConcurrentMapCache("productos"),
            new ConcurrentMapCache("categorias"),
            new ConcurrentMapCache("producto"),
            new ConcurrentMapCache("productosPorCategoria"),
            new ConcurrentMapCache("busquedaProductos"),
            new ConcurrentMapCache("favoritos"),
            new ConcurrentMapCache("ofertas")
        ));
        return cacheManager;
    }
}
