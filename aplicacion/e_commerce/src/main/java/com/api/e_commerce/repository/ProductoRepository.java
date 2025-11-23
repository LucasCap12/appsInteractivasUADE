package com.api.e_commerce.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.api.e_commerce.model.Producto;

/**
 * Repositorio para la entidad Producto
 * 
 * Incluye métodos de consulta personalizados siguiendo la convención
 * de nombres de Spring Data JPA
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Busca productos por nombre (insensible a mayúsculas)
     * Busca coincidencias parciales (LIKE %nombre%)
     */
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Busca productos por marca
     */
    List<Producto> findByMarca(String marca);

    /**
     * Busca productos activos
     */
    List<Producto> findByActivoTrue();
    
    /**
     * Busca productos activos con paginación
     */
    Page<Producto> findByActivoTrue(Pageable pageable);

    /**
     * Busca productos por categoría
     * Como la relación es @ManyToMany, necesitamos una consulta JPQL
     */
    @Query("SELECT p FROM Producto p JOIN p.categorias c WHERE c.id = :categoriaId AND p.activo = true")
    List<Producto> findByCategoria(@Param("categoriaId") Long categoriaId);
    
    /**
     * Busca productos por categoría con paginación
     */
    @Query("SELECT p FROM Producto p JOIN p.categorias c WHERE c.id = :categoriaId AND p.activo = true")
    Page<Producto> findByCategoria(@Param("categoriaId") Long categoriaId, Pageable pageable);

    /**
     * Busca productos con stock disponible
     */
    List<Producto> findByStockGreaterThan(Integer stock);

    /**
     * Busca productos con envío gratis
     */
    List<Producto> findByEnvioGratisTrue();

    /**
     * Busca productos por rango de precios
     */
    List<Producto> findByPrecioBetween(BigDecimal precioMin, BigDecimal precioMax);

    /**
     * Busca productos por usuario (vendedor)
     */
    List<Producto> findByUsuarioId(Long usuarioId);

    /**
     * Búsqueda avanzada de productos con filtros
     * Retorna productos activos que contengan el término en el nombre o descripción
     */
    @Query("SELECT p FROM Producto p WHERE " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))) AND " +
           "p.activo = true")
    List<Producto> buscarProductos(@Param("termino") String termino);
    
    /**
     * Búsqueda avanzada de productos con filtros y paginación
     */
    @Query("SELECT p FROM Producto p WHERE " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))) AND " +
           "p.activo = true")
    Page<Producto> buscarProductos(@Param("termino") String termino, Pageable pageable);

    /**
     * Busca productos con descuento (ofertas)
     * Ordenados por descuento descendente (mayor descuento primero)
     * LIMITADO A TOP 10
     */
    List<Producto> findTop10ByDescuentoGreaterThanAndActivoTrueOrderByDescuentoDesc(Integer descuento);
}
