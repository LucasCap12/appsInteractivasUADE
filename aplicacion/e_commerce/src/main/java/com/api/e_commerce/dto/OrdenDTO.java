package com.api.e_commerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO completo para respuestas de Orden
 * Incluye items y datos del usuario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenDTO {
    private Long id;
    private LocalDateTime fecha;
    private String estado; // String para evitar problemas de serialización
    private BigDecimal total;
    private String direccionEnvio;
    private String metodoPago;
    private UsuarioSimpleDTO usuario;
    private List<OrdenItemDTO> items;
}
