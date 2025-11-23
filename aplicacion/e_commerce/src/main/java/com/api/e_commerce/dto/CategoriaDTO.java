package com.api.e_commerce.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuestas de Categoría
 * Incluye lista simple de productos asociados
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String imagenUrl;
    private Boolean activa;
    private List<ProductoSimpleDTO> productos;
}
