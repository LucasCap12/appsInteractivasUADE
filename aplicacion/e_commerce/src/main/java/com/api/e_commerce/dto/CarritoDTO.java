package com.api.e_commerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para Carrito de Compras
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarritoDTO {
    
    private Long id;
    private Long usuarioId;
    private List<CarritoItemDTO> items;
    private BigDecimal total;
    private Integer cantidadTotal;
    private LocalDateTime fechaActualizacion;
}
