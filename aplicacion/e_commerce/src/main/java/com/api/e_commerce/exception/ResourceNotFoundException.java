package com.api.e_commerce.exception;

/**
 * Excepción lanzada cuando no se encuentra un recurso solicitado en la base de datos.
 * Ejemplos: Producto no encontrado, Categoría no encontrada, Usuario no encontrado, etc.
 * 
 * Esta excepción se captura en GlobalExceptionHandler y retorna HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceName, Long id) {
        super(String.format("%s con ID %d no encontrado", resourceName, id));
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s no encontrado con %s: %s", resourceName, fieldName, fieldValue));
    }
}
