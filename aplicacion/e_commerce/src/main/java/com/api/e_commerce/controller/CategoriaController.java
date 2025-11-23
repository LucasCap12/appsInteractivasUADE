package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.CategoriaCreateDTO;
import com.api.e_commerce.dto.CategoriaDTO;
import com.api.e_commerce.service.CategoriaService;

import jakarta.validation.Valid;

/**
 * Controlador REST para Categorías
 * Maneja las operaciones CRUD de categorías de productos
 */
@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*") // Permite CORS para conexión con React
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;

    /**
     * GET /api/categorias
     * Obtiene todas las categorías activas
     * 
     * @return Lista de todas las categorías activas
     */
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listarTodas() {
        List<CategoriaDTO> categorias = categoriaService.listarActivas();
        return ResponseEntity.ok(categorias);
    }

    /**
     * GET /api/categorias/all
     * Obtiene todas las categorías (incluidas inactivas)
     * 
     * @return Lista de todas las categorías
     */
    @GetMapping("/all")
    public ResponseEntity<List<CategoriaDTO>> listarTodasIncluyendoInactivas() {
        List<CategoriaDTO> categorias = categoriaService.listarTodas();
        return ResponseEntity.ok(categorias);
    }

    /**
     * GET /api/categorias/{id}
     * Obtiene una categoría por su ID
     * 
     * @param id - ID de la categoría
     * @return CategoriaDTO con los datos de la categoría
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> obtenerPorId(@PathVariable Long id) {
        CategoriaDTO categoria = categoriaService.obtenerPorId(id);
        if (categoria != null) {
            return ResponseEntity.ok(categoria);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * POST /api/categorias
     * Crea una nueva categoría
     * 
     * @param dto - Datos de la nueva categoría
     * @return CategoriaDTO de la categoría creada
     */
    @PostMapping
    public ResponseEntity<CategoriaDTO> crear(@Valid @RequestBody CategoriaCreateDTO dto) {
        CategoriaDTO nuevaCategoria = categoriaService.crearCategoria(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria);
    }

    /**
     * PUT /api/categorias/{id}
     * Actualiza una categoría existente
     * 
     * @param id - ID de la categoría a actualizar
     * @param dto - Nuevos datos de la categoría
     * @return CategoriaDTO de la categoría actualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> actualizar(
            @PathVariable Long id, 
            @Valid @RequestBody CategoriaCreateDTO dto) {
        CategoriaDTO categoriaActualizada = categoriaService.actualizar(id, dto);
        if (categoriaActualizada != null) {
            return ResponseEntity.ok(categoriaActualizada);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * DELETE /api/categorias/{id}
     * Elimina una categoría (soft delete - cambia activa a false)
     * 
     * @param id - ID de la categoría a eliminar
     * @return 204 No Content si se eliminó correctamente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminada = categoriaService.eliminar(id);
        if (eliminada) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * PATCH /api/categorias/{id}/estado
     * Cambia el estado activo/inactivo de una categoría
     * 
     * @param id - ID de la categoría
     * @param activa - Nuevo estado (true/false)
     * @return 200 OK si se cambió correctamente
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(
            @PathVariable Long id, 
            @RequestParam Boolean activa) {
        boolean cambiado = categoriaService.cambiarEstado(id, activa);
        if (cambiado) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
