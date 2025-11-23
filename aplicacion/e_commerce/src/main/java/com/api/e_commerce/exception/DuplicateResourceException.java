package com.api.e_commerce.exception;

/**
 * Excepción lanzada cuando se intenta crear un recurso que ya existe.
 * Ejemplo: Email duplicado en registro, nombre de categoría duplicado, etc.
 * 
 * Esta excepción se captura en GlobalExceptionHandler y retorna HTTP 409 (Conflict).
 */
public class DuplicateResourceException extends RuntimeException {
    
    public DuplicateResourceException(String message) {
        super(message);
    }
    
    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s ya existe con %s: %s", resourceName, fieldName, fieldValue));
    }
}
