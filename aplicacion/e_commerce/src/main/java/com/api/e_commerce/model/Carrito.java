package com.api.e_commerce.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Carrito de Compras
 * Representa el carrito persistente de un usuario
 */
@Entity
@Table(name = "carritos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Carrito {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Usuario propietario del carrito
     * Relación One-to-One: Un usuario tiene un carrito
     */
    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;
    
    /**
     * Items en el carrito
     * Relación One-to-Many con CarritoItem
     */
    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CarritoItem> items = new ArrayList<>();
    
    /**
     * Fecha de última actualización
     */
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    /**
     * Fecha de creación del carrito
     */
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
    
    /**
     * Calcula el total del carrito
     */
    public BigDecimal getTotal() {
        return items.stream()
                .map(CarritoItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Obtiene la cantidad total de items
     */
    public Integer getCantidadTotal() {
        return items.stream()
                .mapToInt(CarritoItem::getCantidad)
                .sum();
    }
}
