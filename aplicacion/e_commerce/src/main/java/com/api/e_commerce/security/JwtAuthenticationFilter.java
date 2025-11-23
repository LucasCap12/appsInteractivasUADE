package com.api.e_commerce.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filtro de autenticación JWT que intercepta cada request HTTP
 * 
 * Responsabilidades:
 * - Extraer el token JWT del header Authorization
 * - Validar el token JWT
 * - Establecer la autenticación en el SecurityContext
 * 
 * Extiende OncePerRequestFilter para garantizar que se ejecute una sola vez por request
 * 
 * Flujo:
 * 1. Extrae el token JWT del header "Authorization: Bearer TOKEN"
 * 2. Extrae el email del usuario del token
 * 3. Valida que el usuario exista y el token sea válido
 * 4. Establece la autenticación en SecurityContextHolder
 * 5. Continúa con la cadena de filtros
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. Obtener el header Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Verificar que el header exista y comience con "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraer el token JWT (después de "Bearer ")
        jwt = authHeader.substring(7);
        
        try {
            // 4. Extraer el email del usuario del token
            userEmail = jwtService.extractUsername(jwt);

            // 5. Si el email existe y no hay autenticación en el contexto
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // 6. Cargar los detalles del usuario desde la base de datos
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // 7. Validar el token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // 8. Crear el token de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    
                    // 9. Establecer detalles adicionales del request
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // 10. Establecer la autenticación en el SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Si hay error al procesar el token, simplemente continuar sin autenticar
            // El endpoint protegido rechazará la solicitud
            logger.error("Error processing JWT token: " + e.getMessage());
        }

        // 11. Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
