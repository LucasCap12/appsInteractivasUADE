package com.api.e_commerce.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.CategoriaCreateDTO;
import com.api.e_commerce.dto.CategoriaDTO;
import com.api.e_commerce.dto.CategoriaSimpleDTO;
import com.api.e_commerce.dto.ProductoSimpleDTO;
import com.api.e_commerce.model.Categoria;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.repository.CategoriaRepository;

/**
 * Servicio para la gestión de categorías
 * 
 * Implementa la lógica de negocio para:
 * - Crear categorías
 * - Obtener categorías (con y sin productos)
 * - Listar todas las categorías
 * - Actualizar categorías
 * - Activar/desactivar categorías
 */
@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    /**
     * Constructor con inyección de dependencias
     * Spring recomienda constructor injection sobre @Autowired
     */
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Crea una nueva categoría
     * 
     * @param dto Datos de la categoría a crear
     * @return DTO de la categoría creada
     */
    @CacheEvict(value = "categorias", allEntries = true)
    public CategoriaDTO crearCategoria(CategoriaCreateDTO dto) {
        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());
        categoria.setActiva(true);

        Categoria categoriaGuardada = categoriaRepository.save(categoria);
        return convertirADTO(categoriaGuardada);
    }

    /**
     * Obtiene una categoría por ID con sus productos
     * 
     * @param id ID de la categoría
     * @return DTO de la categoría con productos, o null si no existe
     */
    public CategoriaDTO obtenerPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id).orElse(null);
        
        if (categoria == null) {
            return null;
        }
        
        return convertirADTO(categoria);
    }

    /**
     * Obtiene una categoría simple por ID (sin productos)
     * 
     * @param id ID de la categoría
     * @return DTO simple de la categoría, o null si no existe
     */
    public CategoriaSimpleDTO obtenerSimplePorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id).orElse(null);
        
        if (categoria == null) {
            return null;
        }
        
        return convertirASimpleDTO(categoria);
    }

    /**
     * Lista todas las categorías con sus productos
     * 
     * @return Lista de DTOs de categorías
     */
    @Cacheable("categorias")
    public List<CategoriaDTO> listarTodas() {
        List<Categoria> categorias = categoriaRepository.findAll();
        List<CategoriaDTO> dtos = new ArrayList<>();
        
        for (Categoria categoria : categorias) {
            dtos.add(convertirADTO(categoria));
        }
        
        return dtos;
    }

    /**
     * Lista solo las categorías activas
     * 
     * @return Lista de DTOs de categorías activas
     */
    public List<CategoriaDTO> listarActivas() {
        List<Categoria> categorias = categoriaRepository.findByActivaTrue();
        List<CategoriaDTO> dtos = new ArrayList<>();
        
        for (Categoria categoria : categorias) {
            dtos.add(convertirADTO(categoria));
        }
        
        return dtos;
    }

    /**
     * Actualiza una categoría existente
     * 
     * @param id ID de la categoría a actualizar
     * @param dto Nuevos datos de la categoría
     * @return DTO de la categoría actualizada, o null si no existe
     */
    public CategoriaDTO actualizar(Long id, CategoriaCreateDTO dto) {
        Categoria categoria = categoriaRepository.findById(id).orElse(null);
        
        if (categoria == null) {
            return null;
        }
        
        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());
        
        Categoria categoriaActualizada = categoriaRepository.save(categoria);
        return convertirADTO(categoriaActualizada);
    }

    /**
     * Cambia el estado de una categoría (activa/inactiva)
     * 
     * @param id ID de la categoría
     * @param activa Nuevo estado
     * @return true si se actualizó correctamente, false si no existe
     */
    public boolean cambiarEstado(Long id, Boolean activa) {
        Categoria categoria = categoriaRepository.findById(id).orElse(null);
        
        if (categoria == null) {
            return false;
        }
        
        categoria.setActiva(activa);
        categoriaRepository.save(categoria);
        return true;
    }

    /**
     * Elimina una categoría (soft delete)
     * En lugar de eliminar, se marca como inactiva
     * 
     * @param id ID de la categoría
     * @return true si se eliminó correctamente, false si no existe
     */
    public boolean eliminar(Long id) {
        return cambiarEstado(id, false);
    }

    // ========================================
    // Métodos privados de conversión
    // ========================================

    /**
     * Convierte una entidad Categoria a DTO completo (con productos)
     * 
     * @param categoria Entidad a convertir
     * @return DTO de la categoría
     */
    private CategoriaDTO convertirADTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        dto.setImagenUrl(categoria.getImagenUrl());
        dto.setActiva(categoria.getActiva());
        
        // Convertir productos a ProductoSimpleDTO
        List<ProductoSimpleDTO> productosDTO = new ArrayList<>();
        if (categoria.getProductos() != null) {
            for (Producto producto : categoria.getProductos()) {
                if (producto.getActivo()) { // Solo productos activos
                    ProductoSimpleDTO productoDTO = new ProductoSimpleDTO();
                    productoDTO.setId(producto.getId());
                    productoDTO.setNombre(producto.getNombre());
                    productoDTO.setPrecio(producto.getPrecio());
                    productoDTO.setStock(producto.getStock());
                    productoDTO.setImagenUrl(producto.getImagenUrl());
                    productoDTO.setEnvioGratis(producto.getEnvioGratis());
                    productoDTO.setDescuento(producto.getDescuento());
                    productoDTO.setRating(producto.getRating());
                    productosDTO.add(productoDTO);
                }
            }
        }
        dto.setProductos(productosDTO);
        
        return dto;
    }

    /**
     * Convierte una entidad Categoria a DTO simple (sin productos)
     * 
     * @param categoria Entidad a convertir
     * @return DTO simple de la categoría
     */
    private CategoriaSimpleDTO convertirASimpleDTO(Categoria categoria) {
        CategoriaSimpleDTO dto = new CategoriaSimpleDTO();
        dto.setId(categoria.getId());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        return dto;
    }
}
