package com.api.e_commerce.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Producto que representa un artículo en venta
 * 
 * Relaciones:
 * - Un producto puede pertenecer a muchas categorías (@ManyToMany con Categoria)
 * - Un producto pertenece a un usuario vendedor (@ManyToOne con Usuario)
 * - Un producto puede estar en muchos items de orden (@OneToMany con OrdenItem)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(length = 2000)
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "precio_original", precision = 10, scale = 2)
    private BigDecimal precioOriginal;

    @Column
    private Integer descuento;

    @Column(name = "imagen_url", length = 2000000)
    private String imagenUrl;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(length = 100)
    private String marca;

    @Column
    private Double rating;

    @Column
    private Integer reviews = 0;

    @Column(name = "envio_gratis", nullable = false)
    private Boolean envioGratis = false;

    @Column(name = "cuotas_sin_interes")
    private Integer cuotasSinInteres = 0;

    @Column
    private Integer vendido = 0;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private Boolean activo = true;

    // Relación: Muchos productos pueden tener muchas categorías
    // Esta es la parte "dueña" de la relación (tiene @JoinTable)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "producto_categoria",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private List<Categoria> categorias = new ArrayList<>();

    // Relación: Muchos productos pertenecen a un usuario (vendedor)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Relación: Un producto puede estar en muchos items de orden
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrdenItem> ordenItems;

    /**
     * Método auxiliar para agregar una categoría al producto
     */
    public void agregarCategoria(Categoria categoria) {
        if (categorias == null) {
            categorias = new ArrayList<>();
        }
        categorias.add(categoria);
    }

    /**
     * Calcula el precio con descuento si hay descuento aplicado
     */
    public BigDecimal getPrecioConDescuento() {
        if (descuento != null && descuento > 0 && precioOriginal != null) {
            BigDecimal descuentoDecimal = BigDecimal.valueOf(descuento).divide(BigDecimal.valueOf(100));
            return precioOriginal.multiply(BigDecimal.ONE.subtract(descuentoDecimal));
        }
        return precio;
    }
}
