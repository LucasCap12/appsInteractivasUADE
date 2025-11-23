package com.api.e_commerce.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

// @TASK: Manejo centralizado de excepciones con respuestas DTO consistentes para toda la API REST
// @AI_CONTEXT: @ControllerAdvice - Intercepta excepciones de TODOS los controllers automáticamente
// @AI_CONTEXT: AOP Pattern (Aspect-Oriented Programming) - Cross-cutting concern (manejo errores)
// @AI_CONTEXT: Strategy Pattern - Cada @ExceptionHandler define una estrategia de respuesta por tipo de error
// @SECURITY: UsernameNotFoundException retorna mensaje genérico (no revelar si email existe en BD)
/**
 * Beneficios de centralización:
 * - Respuestas de error consistentes en toda la API (mismo formato DTO)
 * - Separación de responsabilidades (controllers sin try-catch explícitos)
 * - Facilita testing y mantenimiento (un solo lugar para cambiar formato de error)
 * - Mejora UX con mensajes claros y estructurados
 * 
 * Formato respuesta error (ErrorDTO):
 * {
 *   "timestamp": "2025-01-07T10:30:00",
 *   "status": 400,
 *   "error": "Bad Request",
 *   "message": "Email ya registrado",
 *   "path": "/api/auth/register",
 *   "errors": ["email: Email duplicado"] // Solo en MethodArgumentNotValidException
 * }
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    // @TASK: Handler para recursos no encontrados (404 Not Found)
    // @INPUT: ex (ResourceNotFoundException) - Excepción custom con mensaje descriptivo
    // @INPUT: request (WebRequest) - Contexto de la petición HTTP (para extraer path)
    // @OUTPUT: ResponseEntity<Object> - DTO con código 404 y detalles del error
    // @AI_CONTEXT: ResourceNotFoundException lanzada por Services cuando findById() no encuentra registro
    // Ejemplos de uso: Producto no encontrado, Categoría inexistente, Orden no encontrada
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(
            ResourceNotFoundException ex, 
            WebRequest request) {
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.NOT_FOUND.value());
        errorResponse.put("error", HttpStatus.NOT_FOUND.getReasonPhrase());
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // @TASK: Handler para recursos duplicados (409 Conflict)
    // @INPUT: ex (DuplicateResourceException) - Excepción custom con mensaje de conflicto
    // @OUTPUT: ResponseEntity<Object> - DTO con código 409 y detalles del error
    // @AI_CONTEXT: DuplicateResourceException lanzada cuando unique constraint falla en BD
    // Ejemplos de uso: Email ya registrado (usuario), Nombre de categoría duplicado
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Object> handleDuplicateResourceException(
            DuplicateResourceException ex, 
            WebRequest request) {
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.CONFLICT.value());
        errorResponse.put("error", HttpStatus.CONFLICT.getReasonPhrase());
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    /**
     * Maneja excepciones de stock insuficiente (400 Bad Request).
     * Se lanza cuando no hay suficiente stock para completar una orden.
     */
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<Object> handleInsufficientStockException(
            InsufficientStockException ex, 
            WebRequest request) {
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones de reglas de negocio (400 Bad Request).
     * Se lanza cuando se intenta realizar una operación que viola una regla de negocio.
     * Ejemplo: Vendedor intenta comprar su propio producto.
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Object> handleBusinessException(
            BusinessException ex, 
            WebRequest request) {
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // @TASK: Handler para credenciales inválidas (401 Unauthorized)
    // @INPUT: ex (InvalidCredentialsException | BadCredentialsException) - Múltiples tipos de excepción
    // @OUTPUT: ResponseEntity<Object> - DTO con código 401 y mensaje genérico
    // @AI_CONTEXT: Lanzada en login cuando password BCrypt no coincide (AuthenticationProvider.authenticate() falla)
    // @SECURITY: Mensaje genérico "Email o contraseña incorrectos" (no revelar cuál campo es incorrecto)
    @ExceptionHandler({InvalidCredentialsException.class, BadCredentialsException.class})
    public ResponseEntity<Object> handleInvalidCredentialsException(
            Exception ex, 
            WebRequest request) {
        
        // Normalizar mensaje a genérico (evitar revelar información)
        String message = ex instanceof InvalidCredentialsException 
            ? ex.getMessage() 
            : "Email o contraseña incorrectos";
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.UNAUTHORIZED.value());
        errorResponse.put("error", HttpStatus.UNAUTHORIZED.getReasonPhrase());
        errorResponse.put("message", message);
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    // @TASK: Handler para usuario no encontrado (401 Unauthorized)
    // @INPUT: ex (UsernameNotFoundException) - Lanzada por UserDetailsService.loadUserByUsername()
    // @OUTPUT: ResponseEntity<Object> - DTO con código 401 y mensaje genérico
    // @AI_CONTEXT: Spring Security lanza UsernameNotFoundException cuando email no existe en BD
    // @SECURITY: CRITICAL - Retornar mensaje genérico "Email o contraseña incorrectos" (NO revelar si email existe)
    // @SECURITY: Evita ataques de enumeración de usuarios (probar emails válidos antes de password)
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Object> handleUsernameNotFoundException(
            UsernameNotFoundException ex, 
            WebRequest request) {
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.UNAUTHORIZED.value());
        errorResponse.put("error", HttpStatus.UNAUTHORIZED.getReasonPhrase());
        errorResponse.put("message", "Email o contraseña incorrectos"); // @SECURITY: Mensaje genérico siempre
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    // @TASK: Handler para errores de validación de @Valid en DTOs (400 Bad Request)
    // @INPUT: ex (MethodArgumentNotValidException) - Lanzada cuando @Valid falla en @RequestBody
    // @OUTPUT: ResponseEntity<Object> - DTO con código 400 y lista de errores de validación
    // @AI_CONTEXT: Bean Validation API - Activa validaciones @NotNull, @Size, @Email, @Min, @Max en DTOs
    // @AI_CONTEXT: Retorna lista de errores campo por campo (formato "nombreCampo: mensaje")
    // Ejemplos de validación: Email inválido, campos requeridos faltantes, formato incorrecto
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            WebRequest request) {
        
        // STEP 1: Extraer todos los errores de validación (getBindingResult().getFieldErrors())
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        
        // STEP 2: Construir respuesta con lista de errores (campo errors adicional)
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorResponse.put("message", "Errores de validación en los datos enviados");
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        errorResponse.put("errors", errors); // Lista de strings: ["email: Email inválido", "precio: Debe ser mayor a 0"]
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones de argumento ilegal (400 Bad Request).
     * Ejemplo: Parámetros inválidos, formato incorrecto.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(
            IllegalArgumentException ex, 
            WebRequest request) {
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // @TASK: Handler catch-all para excepciones no contempladas (500 Internal Server Error)
    // @INPUT: ex (Exception) - Cualquier excepción no manejada por handlers específicos
    // @OUTPUT: ResponseEntity<Object> - DTO con código 500 y mensaje genérico
    // @AI_CONTEXT: Catch-all - Debe ser monitoreado en logs (indica bugs no contemplados)
    // @SECURITY: CRITICAL - NO revelar detalles internos del error al cliente (stack trace, clases Java, etc.)
    // @SECURITY: En producción usar logger apropiado (SLF4J, Logback) en lugar de System.err
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(
            Exception ex, 
            WebRequest request) {
        
        // Log del error para debugging (en producción usar un logger apropiado)
        // TODO: Reemplazar con logger.error("Error no controlado", ex);
        System.err.println("Error no controlado: " + ex.getClass().getName());
        System.err.println("Mensaje: " + ex.getMessage());
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponse.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        errorResponse.put("message", "Ha ocurrido un error interno en el servidor"); // @SECURITY: Mensaje genérico siempre
        errorResponse.put("path", request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
