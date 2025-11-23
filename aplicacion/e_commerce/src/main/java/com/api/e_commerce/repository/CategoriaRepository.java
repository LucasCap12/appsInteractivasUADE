package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.api.e_commerce.model.Categoria;

/**
 * Repositorio para la entidad Categoria
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    /**
     * Busca una categoría por su nombre
     */
    Categoria findByNombre(String nombre);

    /**
     * Busca categorías activas
     */
    List<Categoria> findByActivaTrue();

    /**
     * Busca categorías por nombre (coincidencia parcial)
     */
    List<Categoria> findByNombreContainingIgnoreCase(String nombre);
}
