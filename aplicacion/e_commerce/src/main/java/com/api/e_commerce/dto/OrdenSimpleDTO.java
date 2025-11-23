package com.api.e_commerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO simple de Orden sin items
 * Usado para listados
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenSimpleDTO {
    private Long id;
    private LocalDateTime fecha;
    private String estado; // String para evitar problemas de serialización
    private BigDecimal total;
    private Integer cantidadItems;
}
