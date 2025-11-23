package com.api.e_commerce.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para items de orden
 * Incluye información del producto
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenItemDTO {
    private Long id;
    private ProductoSimpleDTO producto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
