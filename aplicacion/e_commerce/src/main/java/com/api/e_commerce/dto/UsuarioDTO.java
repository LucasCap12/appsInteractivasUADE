package com.api.e_commerce.dto;

import java.time.LocalDateTime;

import com.api.e_commerce.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuestas de Usuario
 * NO incluye password por seguridad
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String nombreUsuario;
    private String telefono;
    private String direccion;
    private LocalDateTime fechaRegistro;
    private Boolean activo;
    private Boolean darkMode;
    private Role role; // Cambiado de String a Role enum
}
