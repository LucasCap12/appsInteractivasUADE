package com.api.e_commerce.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

// @TASK: Servicio centralizado para gestión de tokens JWT (JSON Web Tokens)
// @AI_CONTEXT: Implementa Singleton Pattern via @Service de Spring. Un solo bean para toda la app
// @AI_CONTEXT: JWT Strategy - Autenticación stateless. Token contiene claims (subject=email, exp, iat)
// @SECURITY: Usa HMAC-SHA256 para firmar tokens. Secret key en application.properties (Base64)
// @SECURITY: Tokens expiran en 24h por defecto. Validación de expiración obligatoria
/**
 * Responsabilidades:
 * - Generar tokens JWT con información del usuario (email, roles en claims)
 * - Validar tokens JWT (verificar firma + expiración)
 * - Extraer información de los tokens (claims: subject, expiration, custom data)
 * - Verificar expiración de tokens contra timestamp actual
 * 
 * Basado en biblioteca io.jsonwebtoken:jjwt-api:0.11.5
 */
@Service
public class JwtService {

    // @SECURITY: Clave secreta Base64 para HMAC-SHA256. DEBE estar en application.properties
    // @AI_CONTEXT: Default value solo para desarrollo. Producción DEBE usar variable de entorno
    @Value("${jwt.secret:QD5jUmZValhuMnI1dTh4L0EzRkQoRytLQnBQZFNnVmtZcA==}")
    private String secretKey;

    // @AI_CONTEXT: Tiempo de vida del token = 24h (86400000ms). Configurable via application.properties
    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    // @TASK: Extrae el email (username) del claim 'subject' del token JWT
    // @INPUT: token (String) - JWT recibido en Authorization header (sin "Bearer " prefix)
    // @OUTPUT: String - Email del usuario (usado como username en Spring Security)
    // @AI_CONTEXT: Subject claim es estándar JWT. Se setea en buildToken() con userDetails.getUsername()
    // @SECURITY: No valida firma aquí. Usar isTokenValid() antes de confiar en este dato
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // @TASK: Extrae un claim específico usando Function Resolver (pattern Strategy)
    // @INPUT: token (String), claimsResolver (Function<Claims, T>) - Lambda para extraer claim deseado
    // @OUTPUT: T (Generic) - Claim extraído (puede ser String, Date, Long, etc.)
    // @AI_CONTEXT: Strategy Pattern - Permite extraer cualquier claim sin duplicar lógica de parseo
    // @SECURITY: Claims provienen de extractAllClaims() que valida la firma HMAC
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // @TASK: Genera token JWT con claims adicionales personalizados
    // @INPUT: extraClaims (Map<String, Object>) - Claims custom (ej: roles, permisos), userDetails (UserDetails)
    // @OUTPUT: String - Token JWT firmado con HMAC-SHA256
    // @AI_CONTEXT: Sobrecarga de método. Esta versión permite agregar claims adicionales (roles, metadata)
    // @SECURITY: Token firmado con secretKey. Frontend lo recibe y lo envía en header Authorization
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    // @TASK: Genera token JWT sin claims adicionales (solo subject + timestamps)
    // @INPUT: userDetails (UserDetails) - Usuario autenticado (email como username)
    // @OUTPUT: String - Token JWT firmado
    // @AI_CONTEXT: Método conveniente. Internamente llama a generateToken con HashMap vacío
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // @TASK: Construye el token JWT con todos los claims estándar y configuraciones
    // @INPUT: extraClaims (Map), userDetails (UserDetails), expiration (long millis)
    // @OUTPUT: String - Token JWT compactado y firmado (formato: header.payload.signature)
    // @AI_CONTEXT: Builder Pattern de jjwt. Fluent API para construir JWT
    // @SECURITY: CRITICAL - Firma con HMAC-SHA256. SignatureAlgorithm.HS256 es simétrico
    // @SECURITY: Claims: subject=email, iat=timestamp creación, exp=timestamp expiración
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration) {
        return Jwts
                .builder()
                .setClaims(extraClaims)                                      // STEP 1: Claims custom
                .setSubject(userDetails.getUsername())                       // STEP 2: Subject = email
                .setIssuedAt(new Date(System.currentTimeMillis()))           // STEP 3: iat (issued at)
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // STEP 4: exp
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)         // STEP 5: Firma HMAC
                .compact();                                                   // STEP 6: Serializar a String
    }

    // @TASK: Valida si el token JWT es válido para el usuario dado
    // @INPUT: token (String), userDetails (UserDetails) - Usuario del contexto de seguridad
    // @OUTPUT: Boolean - true si token válido (firma OK + no expirado + subject match)
    // @AI_CONTEXT: Validación de 2 factores: subject match + expiración. Firma validada en extractUsername
    // @SECURITY: CRITICAL - Este método DEBE retornar true antes de autorizar requests
    // @SECURITY: Verifica que el token pertenece al usuario correcto (evita token hijacking)
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Verifica si el token JWT ha expirado
     * 
     * @param token Token JWT a verificar
     * @return true si el token ha expirado, false en caso contrario
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrae la fecha de expiración del token JWT
     * 
     * @param token Token JWT
     * @return Fecha de expiración del token
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // @TASK: Parsea y extrae todos los claims del token JWT
    // @INPUT: token (String) - JWT recibido del cliente
    // @OUTPUT: Claims - Objeto con todos los claims (subject, exp, iat, custom)
    // @AI_CONTEXT: ParserBuilder valida firma automáticamente. Si firma inválida, lanza SignatureException
    // @SECURITY: CRITICAL - Validación de firma HMAC-SHA256. Token corrupto/modificado lanza Exception
    // @SECURITY: parseClaimsJws() verifica firma antes de retornar claims. NO usar parseClaimsJwt()
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())    // STEP 1: Configura key para validar firma
                .build()
                .parseClaimsJws(token)             // STEP 2: Parsea y VALIDA firma
                .getBody();                         // STEP 3: Retorna claims si firma OK
    }

    // @TASK: Convierte secret key (String Base64) a objeto Key para HMAC-SHA256
    // @INPUT: Ninguno (usa field secretKey)
    // @OUTPUT: Key - Objeto SecretKey para algoritmo HMAC
    // @AI_CONTEXT: jjwt requiere Key object, no String. Decodifica Base64 → bytes → SecretKey
    // @SECURITY: CRITICAL - Secret key DEBE tener mínimo 256 bits (32 bytes) para HMAC-SHA256
    // @SECURITY: Keys.hmacShaKeyFor() valida longitud. Key débil lanza WeakKeyException
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Obtiene el tiempo de expiración configurado
     * 
     * @return Tiempo de expiración en milisegundos
     */
    public long getExpirationTime() {
        return jwtExpiration;
    }
}
