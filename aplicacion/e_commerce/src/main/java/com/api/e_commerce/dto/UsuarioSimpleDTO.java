package com.api.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO simple de Usuario
 * Usado para evitar referencias circulares y proteger datos sensibles
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSimpleDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String nombreUsuario;
}
