package com.api.e_commerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO completo para respuestas de Producto
 * Incluye información de categorías y vendedor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private BigDecimal precioOriginal;
    private Integer descuento;
    private String imagenUrl;
    private Integer stock;
    private String marca;
    private Double rating;
    private Integer reviews;
    private Boolean envioGratis;
    private Integer cuotasSinInteres;
    private Integer vendido;
    private LocalDateTime fechaCreacion;
    private Boolean activo;
    private BigDecimal precioFinal;
    
    // Información de relaciones
    private List<CategoriaSimpleDTO> categorias;
    private UsuarioSimpleDTO vendedor;
}
