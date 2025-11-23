package com.api.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuestas de autenticación
 * Incluye token JWT y datos del usuario
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Boolean success;
    private String message;
    private String token;
    private UsuarioDTO usuario;
    
    // Constructor para respuestas simples (sin token aún)
    public AuthResponse(String message, UsuarioDTO usuario) {
        this.success = true;
        this.message = message;
        this.usuario = usuario;
    }
}
