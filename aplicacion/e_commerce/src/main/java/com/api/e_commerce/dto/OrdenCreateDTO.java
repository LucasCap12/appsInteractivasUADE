package com.api.e_commerce.dto;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear órdenes
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenCreateDTO {
    
    @NotNull(message = "Debe incluir al menos un item")
    @Size(min = 1, message = "Debe incluir al menos un item")
    private List<OrdenItemCreateDTO> items;
    
    @NotNull(message = "La dirección de envío es obligatoria")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String direccionEnvio;
    
    @NotNull(message = "El método de pago es obligatorio")
    @Size(min = 2, max = 50, message = "El método de pago debe tener entre 2 y 50 caracteres")
    private String metodoPago;
}
