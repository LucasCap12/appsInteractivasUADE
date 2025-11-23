package com.api.e_commerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.api.e_commerce.repository.UsuarioRepository;
import com.api.e_commerce.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import java.util.Arrays;

// @TASK: Configuración central de seguridad con Spring Security + JWT
// @AI_CONTEXT: Implementa Strategy Pattern - Diferentes estrategias de autenticación (JWT vs Basic Auth)
// @AI_CONTEXT: Configuración declarativa con @Bean. Spring IoC gestiona el ciclo de vida
// @SECURITY: Configuración stateless - NO usa HttpSession. JWT en header Authorization
// @SECURITY: CORS configurado para permitir frontends específicos (localhost:3000, 5173, 4200, 8081)
/**
 * Implementa:
 * - Autenticación JWT con JwtAuthenticationFilter personalizado
 * - Autorización basada en roles (USER, ADMIN) via @hasRole()
 * - Protección de endpoints según permisos (requestMatchers)
 * - Configuración stateless (SessionCreationPolicy.STATELESS)
 * - CORS para SPA en diferentes puertos
 * 
 * Basado en Spring Security 6.x (Spring Boot 3.2.0)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UsuarioRepository usuarioRepository;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(UsuarioRepository usuarioRepository, @Lazy JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.usuarioRepository = usuarioRepository;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // @TASK: Bean UserDetailsService - Carga usuario desde BD para autenticación
    // @INPUT: username (String) - Email del usuario (usado como username)
    // @OUTPUT: UserDetails - Usuario con credenciales y roles (throws UsernameNotFoundException si no existe)
    // @AI_CONTEXT: Functional Interface (lambda). Spring Security llama a loadUserByUsername(email)
    // @SECURITY: Usuario implementa UserDetails. Email es unique constraint en BD
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    // @TASK: Bean AuthenticationProvider - Estrategia de autenticación con BD + BCrypt
    // @INPUT: Ninguno (usa userDetailsService y passwordEncoder beans)
    // @OUTPUT: AuthenticationProvider - DaoAuthenticationProvider configurado
    // @AI_CONTEXT: DAO Pattern - Delega carga de usuario a UserDetailsService, password check a PasswordEncoder
    // @SECURITY: BCrypt password matching. DaoAuthenticationProvider compara hash automáticamente
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // @TASK: Bean AuthenticationManager - Gestor central de autenticación
    // @INPUT: config (AuthenticationConfiguration) - Auto-inyectado por Spring
    // @OUTPUT: AuthenticationManager - Manager configurado con AuthenticationProvider
    // @AI_CONTEXT: Facade Pattern - Simplifica interacción con múltiples AuthenticationProviders
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // @TASK: Bean PasswordEncoder - Codificador BCrypt para passwords
    // @OUTPUT: PasswordEncoder - BCryptPasswordEncoder con strength 10 (default)
    // @AI_CONTEXT: Singleton Bean. Un solo encoder para toda la app. BCrypt es one-way (no reversible)
    // @SECURITY: CRITICAL - BCrypt genera salt automático. Mismo password = hashes diferentes
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // @TASK: Bean CorsConfigurationSource - Configuración CORS para permitir SPA de diferentes orígenes
    // @OUTPUT: CorsConfigurationSource - Configuración aplicada a todos los endpoints (/**)
    // @AI_CONTEXT: CORS Policy - Navegadores bloquean requests cross-origin por seguridad. Esto permite excepciones
    // @SECURITY: AllowedOrigins especificado explícitamente (NO usar "*" con credentials=true)
    // @SECURITY: Credentials=true permite enviar cookies/Authorization headers en requests CORS
    /**
     * Permite que frontends en diferentes puertos/dominios accedan a la API:
     * - localhost:3000 (React dev server)
     * - localhost:5173 (Vite dev server)
     * - localhost:4200 (Angular dev server)
     * - localhost:8081 (Vue/otros dev servers)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // STEP 1: Orígenes permitidos (frontends)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:4200",
            "http://localhost:8081"
        ));
        
        // STEP 2: Métodos HTTP permitidos (incluye OPTIONS para preflight)
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // STEP 3: Headers permitidos ("*" permite todos, incluido Authorization)
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // STEP 4: Permitir credenciales (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // STEP 5: Aplicar configuración a todos los endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    // @TASK: Bean SecurityFilterChain - Cadena de filtros de seguridad y reglas de autorización
    // @INPUT: http (HttpSecurity) - Builder fluent para configurar seguridad
    // @OUTPUT: SecurityFilterChain - Cadena de filtros configurada
    // @AI_CONTEXT: Builder Pattern - HttpSecurity usa API fluent para configuración declarativa
    // @AI_CONTEXT: Chain of Responsibility Pattern - Requests pasan por filtros secuencialmente
    // @SECURITY: CRITICAL - Define quién puede acceder a qué endpoints. Orden de requestMatchers importa
    // @SECURITY: JwtAuthenticationFilter se ejecuta ANTES de UsernamePasswordAuthenticationFilter
    /**
     * Define:
     * - Endpoints públicos (permitAll) y protegidos (authenticated/hasRole)
     * - Reglas de autorización por rol (ADMIN para gestión, USER para operaciones básicas)
     * - Configuración stateless (SessionCreationPolicy.STATELESS - NO HttpSession)
     * - Integración del filtro JWT personalizado en la cadena
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // STEP 1: Deshabilitar CSRF (no necesario para APIs REST stateless con JWT)
                // @SECURITY: CSRF protection inútil en APIs stateless. Cookies no usadas
                .csrf(csrf -> csrf.disable())
                
                // STEP 2: Configurar CORS con la configuración personalizada
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // Configurar autorización de requests
                .authorizeHttpRequests(auth -> auth
                        // ========================================
                        // ENDPOINTS PÚBLICOS (no requieren autenticación)
                        // ========================================
                        
                        // Autenticación: registro y login
                        .requestMatchers("/api/auth/**").permitAll()
                        
                        // Productos: ver listados y detalles
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        
                        // Categorías: ver listados
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                        
                        // Recursos estáticos: imágenes servidas desde /images/**
                        .requestMatchers("/images/**").permitAll()
                        
                        // Actuator: health checks y monitoreo
                        .requestMatchers("/actuator/**").permitAll()
                        
                        // H2 Console (solo desarrollo)
                        .requestMatchers("/h2-console/**").permitAll()
                        
                        // ========================================
                        // ENDPOINTS ADMINISTRATIVOS (solo ADMIN)
                        // ========================================
                        
                        // Panel de administración
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // Gestión de categorías (crear, editar, eliminar)
                        .requestMatchers(HttpMethod.POST, "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/categorias/**").hasRole("ADMIN")
                        
                        // ========================================
                        // ENDPOINTS AUTENTICADOS (requieren login)
                        // ========================================
                        
                        // Productos: crear, editar, eliminar (verificación adicional de propietario en controller)
                        .requestMatchers(HttpMethod.POST, "/api/productos").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/productos/**").authenticated()
                        
                        // Órdenes: todas las operaciones requieren autenticación
                        .requestMatchers("/api/ordenes/**").authenticated()
                        
                        // Cualquier otro endpoint requiere autenticación
                        .anyRequest().authenticated()
                )
                
                // Configuración stateless: no usar sesiones HTTP
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                // Deshabilitar frameOptions para H2 Console
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                
                // Establecer el AuthenticationProvider
                .authenticationProvider(authenticationProvider())
                
                // Agregar el filtro JWT antes del filtro de autenticación estándar
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
