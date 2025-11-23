package com.api.e_commerce.exception;

/**
 * Excepción lanzada cuando se intenta realizar una operación que viola una regla de negocio.
 * Ejemplos: vendedor intenta comprar su propio producto, usuario intenta acceder a recurso no autorizado, etc.
 * 
 * Esta excepción se captura en GlobalExceptionHandler y retorna HTTP 400 (Bad Request).
 */
public class BusinessException extends RuntimeException {
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
