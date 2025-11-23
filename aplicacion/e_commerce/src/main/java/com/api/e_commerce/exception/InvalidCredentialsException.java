package com.api.e_commerce.exception;

/**
 * Excepción lanzada cuando las credenciales de autenticación son inválidas.
 * Se usa en el login cuando email o password son incorrectos.
 * 
 * Esta excepción se captura en GlobalExceptionHandler y retorna HTTP 401 (Unauthorized).
 */
public class InvalidCredentialsException extends RuntimeException {
    
    public InvalidCredentialsException(String message) {
        super(message);
    }
    
    public InvalidCredentialsException() {
        super("Email o contraseña incorrectos");
    }
}
