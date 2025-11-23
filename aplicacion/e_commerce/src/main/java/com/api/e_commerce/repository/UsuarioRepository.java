package com.api.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.api.e_commerce.model.Usuario;

/**
 * Repositorio para la entidad Usuario
 * 
 * Spring Data JPA genera automáticamente la implementación
 * de los métodos CRUD básicos (save, findById, findAll, delete, etc.)
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su email
     * Spring Data JPA genera la consulta automáticamente:
     * SELECT * FROM usuarios WHERE email = ?
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el email dado
     * Spring Data JPA genera la consulta automáticamente:
     * SELECT COUNT(*) > 0 FROM usuarios WHERE email = ?
     */
    Boolean existsByEmail(String email);

    /**
     * Busca un usuario por su nombre de usuario
     */
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    /**
     * Verifica si existe un usuario con el nombre de usuario dado
     */
    Boolean existsByNombreUsuario(String nombreUsuario);

    /**
     * Busca todos los usuarios activos
     */
    java.util.List<Usuario> findByActivoTrue();
}
