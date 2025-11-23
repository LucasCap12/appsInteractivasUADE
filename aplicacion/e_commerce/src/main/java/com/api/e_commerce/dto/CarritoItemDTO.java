package com.api.e_commerce.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para Item del Carrito
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarritoItemDTO {
    
    private Long id;
    private ProductoSimpleDTO producto;
    private Integer cantidad;
    private BigDecimal subtotal;
}
