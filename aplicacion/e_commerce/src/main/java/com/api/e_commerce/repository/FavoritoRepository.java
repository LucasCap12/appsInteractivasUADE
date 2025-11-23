package com.api.e_commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.api.e_commerce.model.Favorito;
import com.api.e_commerce.model.Usuario;

/**
 * Repositorio para la entidad Favorito
 * 
 * Proporciona métodos para gestionar los favoritos de usuarios,
 * incluyendo búsqueda, verificación y eliminación.
 */
@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    /**
     * Obtiene todos los favoritos de un usuario
     * Ordenados por fecha de agregado descendente (más recientes primero)
     */
    List<Favorito> findByUsuarioOrderByFechaAgregadoDesc(Usuario usuario);

    /**
     * Obtiene todos los favoritos de un usuario por ID
     */
    @Query("SELECT f FROM Favorito f WHERE f.usuario.id = :usuarioId ORDER BY f.fechaAgregado DESC")
    List<Favorito> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    /**
     * Verifica si existe un favorito para un usuario y producto específicos
     */
    @Query("SELECT f FROM Favorito f WHERE f.usuario.id = :usuarioId AND f.producto.id = :productoId")
    Optional<Favorito> findByUsuarioIdAndProductoId(@Param("usuarioId") Long usuarioId, 
                                                      @Param("productoId") Long productoId);

    /**
     * Verifica si un producto es favorito de un usuario
     */
    boolean existsByUsuarioIdAndProductoId(Long usuarioId, Long productoId);

    /**
     * Elimina un favorito específico de un usuario
     */
    void deleteByUsuarioIdAndProductoId(Long usuarioId, Long productoId);

    /**
     * Cuenta cuántos usuarios tienen un producto como favorito
     */
    @Query("SELECT COUNT(f) FROM Favorito f WHERE f.producto.id = :productoId")
    Long countByProductoId(@Param("productoId") Long productoId);
}
