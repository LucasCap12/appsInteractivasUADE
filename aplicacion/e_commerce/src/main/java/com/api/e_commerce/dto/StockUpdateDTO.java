package com.api.e_commerce.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para actualizar el stock de un producto
 * La cantidad representa un delta (cambio) que se suma al stock actual
 * Puede ser positivo (agregar stock) o negativo (restar stock)
 */
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockUpdateDTO {
    
    @NotNull(message = "La cantidad es obligatoria")
    private Integer cantidad;
}
