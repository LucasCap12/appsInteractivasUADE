package com.api.e_commerce.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear productos con validaciones
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoCreateDTO {
    
    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(min = 2, max = 200, message = "El nombre debe tener entre 2 y 200 caracteres")
    private String nombre;
    
    @Size(max = 2000, message = "La descripción no puede exceder 2000 caracteres")
    private String descripcion;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal precio;
    
    @DecimalMin(value = "0.01", message = "El precio original debe ser mayor a 0")
    private BigDecimal precioOriginal;
    
    @Min(value = 0, message = "El descuento no puede ser negativo")
    private Integer descuento;
    
    @Size(max = 2000000, message = "La imagen no puede exceder 2MB (base64 o URL)")
    private String imagenUrl;
    
    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
    
    @Size(max = 100, message = "La marca no puede exceder 100 caracteres")
    private String marca;
    
    private Boolean envioGratis = false;
    
    @Min(value = 0, message = "Las cuotas sin interés no pueden ser negativas")
    private Integer cuotasSinInteres = 0;
    
    @NotNull(message = "Debe especificar al menos una categoría")
    @Size(min = 1, message = "Debe especificar al menos una categoría")
    private List<Long> categoriaIds;
}
