package com.api.e_commerce.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad OrdenItem que representa un producto dentro de una orden
 * 
 * Esta es una tabla intermedia que conecta Orden y Producto
 * con información adicional (cantidad, precio al momento de la compra)
 * 
 * Relaciones:
 * - Muchos items pertenecen a una orden (@ManyToOne con Orden)
 * - Muchos items referencian a un producto (@ManyToOne con Producto)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orden_items")
public class OrdenItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Muchos items pertenecen a una orden
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_id", nullable = false)
    private Orden orden;

    // Relación: Muchos items referencian a un producto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    // Guardamos el precio al momento de la compra por si el producto cambia de precio después
    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario;

    /**
     * Calcula el subtotal del item (precio × cantidad)
     */
    public BigDecimal getSubtotal() {
        return precioUnitario.multiply(BigDecimal.valueOf(cantidad));
    }
}
