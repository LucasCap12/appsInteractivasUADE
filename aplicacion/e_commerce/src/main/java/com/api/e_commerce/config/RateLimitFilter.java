package com.api.e_commerce.config;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtro para implementar rate limiting simple
 * 
 * Limita el número de peticiones por IP en un período de tiempo:
 * - 100 peticiones por minuto por IP
 * - Responde con HTTP 429 (Too Many Requests) si se excede el límite
 * 
 * NOTA: Esta implementación es básica y en memoria.
 * Para producción se recomienda usar Redis o similar para distribuir el límite entre instancias.
 */
@Component
@Order(1)
public class RateLimitFilter implements Filter {

    private static final int MAX_REQUESTS_PER_MINUTE = 200;
    private static final Duration WINDOW_DURATION = Duration.ofMinutes(1);
    
    // Map: IP -> RateLimitData
    private final Map<String, RateLimitData> requestCounts = new ConcurrentHashMap<>();
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String clientIp = getClientIP(httpRequest);
        
        // Limpiar datos antiguos periódicamente
        cleanupOldEntries();
        
        // Obtener o crear datos de rate limit para esta IP
        RateLimitData rateLimitData = requestCounts.computeIfAbsent(clientIp, k -> new RateLimitData());
        
        // Verificar si se excedió el límite
        if (rateLimitData.isLimitExceeded()) {
            httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write(
                String.format("{\"error\": \"Rate limit exceeded\", \"message\": \"Maximum %d requests per minute. Try again later.\"}", 
                    MAX_REQUESTS_PER_MINUTE)
            );
            return;
        }
        
        // Incrementar contador de peticiones
        rateLimitData.incrementRequests();
        
        // Continuar con la cadena de filtros
        chain.doFilter(request, response);
    }
    
    /**
     * Obtiene la IP del cliente considerando proxies
     */
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
    
    /**
     * Limpia entradas antiguas para evitar memory leaks
     */
    private void cleanupOldEntries() {
        long now = System.currentTimeMillis();
        requestCounts.entrySet().removeIf(entry -> 
            now - entry.getValue().getWindowStart() > WINDOW_DURATION.toMillis() * 2
        );
    }
    
    /**
     * Clase interna para almacenar datos de rate limiting
     */
    private static class RateLimitData {
        private long windowStart;
        private int requestCount;
        
        public RateLimitData() {
            this.windowStart = System.currentTimeMillis();
            this.requestCount = 0;
        }
        
        public synchronized boolean isLimitExceeded() {
            resetIfNewWindow();
            return requestCount >= MAX_REQUESTS_PER_MINUTE;
        }
        
        public synchronized void incrementRequests() {
            resetIfNewWindow();
            requestCount++;
        }
        
        private void resetIfNewWindow() {
            long now = System.currentTimeMillis();
            if (now - windowStart > WINDOW_DURATION.toMillis()) {
                windowStart = now;
                requestCount = 0;
            }
        }
        
        public long getWindowStart() {
            return windowStart;
        }
    }
}
