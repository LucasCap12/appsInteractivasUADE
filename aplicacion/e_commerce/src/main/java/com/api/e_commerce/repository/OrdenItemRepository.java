package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.api.e_commerce.model.OrdenItem;

/**
 * Repositorio para la entidad OrdenItem
 */
@Repository
public interface OrdenItemRepository extends JpaRepository<OrdenItem, Long> {

    /**
     * Busca todos los items de una orden específica
     */
    List<OrdenItem> findByOrdenId(Long ordenId);

    /**
     * Busca todos los items que contienen un producto específico
     */
    List<OrdenItem> findByProductoId(Long productoId);
}
