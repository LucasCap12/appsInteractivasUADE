package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.api.e_commerce.model.EstadoOrden;
import com.api.e_commerce.model.Orden;

/**
 * Repositorio para la entidad Orden
 */
@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {

    /**
     * Busca todas las órdenes de un usuario
     */
    List<Orden> findByUsuarioId(Long usuarioId);

    /**
     * Busca órdenes por estado
     */
    List<Orden> findByEstado(EstadoOrden estado);

    /**
     * Busca órdenes de un usuario por estado
     */
    List<Orden> findByUsuarioIdAndEstado(Long usuarioId, EstadoOrden estado);

    /**
     * Obtiene las órdenes de un usuario ordenadas por fecha descendente
     */
    List<Orden> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    /**
     * Consulta para obtener el total de ventas de un usuario
     */
    @Query("SELECT SUM(o.total) FROM Orden o WHERE o.usuario.id = :usuarioId AND o.estado = :estado")
    Double calcularTotalVentas(@Param("usuarioId") Long usuarioId, @Param("estado") EstadoOrden estado);
}
