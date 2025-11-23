package com.api.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.api.e_commerce.model.Carrito;

/**
 * Repositorio para la entidad Carrito
 */
@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    
    /**
     * Busca el carrito de un usuario por su ID
     */
    Optional<Carrito> findByUsuarioId(Long usuarioId);
    
    /**
     * Busca el carrito de un usuario por su email
     */
    Optional<Carrito> findByUsuarioEmail(String email);
}
