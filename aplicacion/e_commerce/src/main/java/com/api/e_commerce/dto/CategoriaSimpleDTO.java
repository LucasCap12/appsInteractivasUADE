package com.api.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO simple de Categoría sin productos
 * Usado para evitar referencias circulares
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaSimpleDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String imagenUrl;
}
