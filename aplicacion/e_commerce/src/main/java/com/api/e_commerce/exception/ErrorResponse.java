package com.api.e_commerce.exception;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase que representa la estructura de respuesta de error de la API.
 * Se usa para retornar información detallada cuando ocurre una excepción.
 * 
 * Campos:
 * - timestamp: Fecha y hora del error
 * - status: Código HTTP (400, 404, 409, 500, etc.)
 * - error: Nombre del error HTTP (Bad Request, Not Found, etc.)
 * - message: Mensaje descriptivo del error
 * - path: Endpoint donde ocurrió el error
 * - errors: Lista de errores de validación (opcional, para @Valid)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> errors; // Para errores de validación múltiples
}
