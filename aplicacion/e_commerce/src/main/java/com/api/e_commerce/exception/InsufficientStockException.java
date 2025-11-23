package com.api.e_commerce.exception;

/**
 * Excepción lanzada cuando no hay suficiente stock de un producto para realizar una operación.
 * Se usa en la creación de órdenes y actualización de stock.
 * 
 * Esta excepción se captura en GlobalExceptionHandler y retorna HTTP 400 (Bad Request).
 */
public class InsufficientStockException extends RuntimeException {
    
    public InsufficientStockException(String message) {
        super(message);
    }
    
    public InsufficientStockException(String productName, Integer available, Integer requested) {
        super(String.format("Stock insuficiente para producto '%s'. Disponible: %d, Solicitado: %d", 
            productName, available, requested));
    }
}
