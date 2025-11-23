package com.api.e_commerce.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO simple de Producto
 * Usado en listas y para evitar referencias circulares
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoSimpleDTO {
    private Long id;
    private String nombre;
    private BigDecimal precio;
    private Integer stock;
    private String imagenUrl;
    private Boolean envioGratis;
    private Integer descuento;
    private Double rating;
}
