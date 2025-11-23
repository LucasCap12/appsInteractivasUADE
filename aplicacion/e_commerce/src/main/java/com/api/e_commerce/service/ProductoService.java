package com.api.e_commerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.CategoriaSimpleDTO;
import com.api.e_commerce.dto.ProductoCreateDTO;
import com.api.e_commerce.dto.ProductoDTO;
import com.api.e_commerce.dto.ProductoSimpleDTO;
import com.api.e_commerce.dto.UsuarioSimpleDTO;
import com.api.e_commerce.exception.InsufficientStockException;
import com.api.e_commerce.exception.ResourceNotFoundException;
import com.api.e_commerce.model.Categoria;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.CategoriaRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;

/**
 * Servicio para la gestión de productos
 * 
 * Implementa la lógica de negocio para:
 * - Crear productos con categorías
 * - Obtener productos (completos y simples)
 * - Listar y buscar productos
 * - Filtrar por categoría, marca, etc.
 * - Actualizar productos
 * - Gestionar stock y actividad
 */
@Service
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Constructor con inyección de dependencias
     */
    public ProductoService(ProductoRepository productoRepository, 
                          CategoriaRepository categoriaRepository,
                          UsuarioRepository usuarioRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Crea un nuevo producto
     * 
     * @param dto Datos del producto a crear
     * @param emailUsuario Email del usuario que crea el producto
     * @return DTO del producto creado, o null si el usuario no existe
     */
    @CacheEvict(value = {"productos", "producto", "productosPorCategoria", "busquedaProductos", "ofertas"}, allEntries = true)
    public ProductoDTO crearProducto(ProductoCreateDTO dto, String emailUsuario) {
        // Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario).orElse(null);
        if (usuario == null) {
            return null;
        }

        // Crear producto
        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setPrecioOriginal(dto.getPrecioOriginal());
        producto.setDescuento(dto.getDescuento());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setStock(dto.getStock());
        producto.setMarca(dto.getMarca());
        producto.setEnvioGratis(dto.getEnvioGratis() != null ? dto.getEnvioGratis() : false);
        producto.setCuotasSinInteres(dto.getCuotasSinInteres() != null ? dto.getCuotasSinInteres() : 0);
        producto.setFechaCreacion(LocalDateTime.now());
        producto.setActivo(true);
        producto.setRating(0.0);
        producto.setReviews(0);
        producto.setVendido(0);
        producto.setUsuario(usuario);

        // Asociar categorías
        if (dto.getCategoriaIds() != null && !dto.getCategoriaIds().isEmpty()) {
            List<Categoria> categorias = new ArrayList<>();
            for (Long categoriaId : dto.getCategoriaIds()) {
                Categoria categoria = categoriaRepository.findById(categoriaId).orElse(null);
                if (categoria != null && categoria.getActiva()) {
                    categorias.add(categoria);
                }
            }
            producto.setCategorias(categorias);
        }

        Producto productoGuardado = productoRepository.save(producto);
        return convertirADTO(productoGuardado);
    }

    /**
     * Obtiene un producto por ID
     * 
     * @param id ID del producto
     * @return DTO del producto
     * @throws ResourceNotFoundException si el producto no existe
     */
    @Cacheable(value = "producto", key = "#id")
    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        return convertirADTO(producto);
    }

    /**
     * Obtiene un producto simple por ID
     * 
     * @param id ID del producto
     * @return DTO simple del producto
     * @throws ResourceNotFoundException si el producto no existe
     */
    public ProductoSimpleDTO obtenerSimplePorId(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        return convertirASimpleDTO(producto);
    }

    /**
     * Lista todos los productos activos (sin paginar)
     * 
     * @return Lista de DTOs de productos
     */
    @Cacheable("productos")
    public List<ProductoDTO> listarTodos() {
        List<Producto> productos = productoRepository.findByActivoTrue();
        return convertirListaADTO(productos);
    }
    
    /**
     * Lista todos los productos activos con paginación
     * 
     * @param pageable Configuración de paginación y ordenamiento
     * @return Página de DTOs de productos
     */
    public Page<ProductoDTO> listarTodosPaginado(Pageable pageable) {
        Page<Producto> productos = productoRepository.findByActivoTrue(pageable);
        return productos.map(this::convertirADTO);
    }

    /**
     * Busca productos por nombre o descripción
     * 
     * @param termino Término de búsqueda
     * @return Lista de DTOs de productos que coinciden
     */
    public List<ProductoDTO> buscarProductos(String termino) {
        List<Producto> productos = productoRepository.buscarProductos(termino);
        return convertirListaADTO(productos);
    }
    
    /**
     * Busca productos por nombre o descripción con paginación
     * 
     * @param termino Término de búsqueda
     * @param pageable Configuración de paginación y ordenamiento
     * @return Página de DTOs de productos que coinciden
     */
    public Page<ProductoDTO> buscarProductosPaginado(String termino, Pageable pageable) {
        Page<Producto> productos = productoRepository.buscarProductos(termino, pageable);
        return productos.map(this::convertirADTO);
    }

    /**
     * Obtiene productos por categoría
     * 
     * @param categoriaId ID de la categoría
     * @return Lista de DTOs de productos de la categoría
     */
    public List<ProductoDTO> obtenerPorCategoria(Long categoriaId) {
        List<Producto> productos = productoRepository.findByCategoria(categoriaId);
        return convertirListaADTO(productos);
    }
    
    /**
     * Obtiene productos por categoría con paginación
     * 
     * @param categoriaId ID de la categoría
     * @param pageable Configuración de paginación y ordenamiento
     * @return Página de DTOs de productos de la categoría
     */
    public Page<ProductoDTO> obtenerPorCategoriaPaginado(Long categoriaId, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByCategoria(categoriaId, pageable);
        return productos.map(this::convertirADTO);
    }

    /**
     * Obtiene productos por marca
     * 
     * @param marca Marca a buscar
     * @return Lista de DTOs de productos de la marca
     */
    public List<ProductoDTO> obtenerPorMarca(String marca) {
        List<Producto> productos = productoRepository.findByMarca(marca);
        List<Producto> productosActivos = new ArrayList<>();
        
        for (Producto producto : productos) {
            if (producto.getActivo()) {
                productosActivos.add(producto);
            }
        }
        
        return convertirListaADTO(productosActivos);
    }

    /**
     * Obtiene productos con envío gratis
     * 
     * @return Lista de DTOs de productos con envío gratis
     */
    public List<ProductoDTO> obtenerConEnvioGratis() {
        List<Producto> productos = productoRepository.findByEnvioGratisTrue();
        List<Producto> productosActivos = new ArrayList<>();
        
        for (Producto producto : productos) {
            if (producto.getActivo()) {
                productosActivos.add(producto);
            }
        }
        
        return convertirListaADTO(productosActivos);
    }

    /**
     * Obtiene productos con descuento (ofertas)
     * Ordenados por descuento descendente (mayor descuento primero)
     * 
     * @return Lista de DTOs de productos en oferta
     */
    @Cacheable("ofertas")
    public List<ProductoDTO> obtenerOfertas() {
        // Buscar productos con descuento > 0 (Top 10)
        List<Producto> productos = productoRepository.findTop10ByDescuentoGreaterThanAndActivoTrueOrderByDescuentoDesc(0);
        return convertirListaADTO(productos);
    }

    /**
     * Obtiene productos por rango de precio
     * 
     * @param precioMin Precio mínimo
     * @param precioMax Precio máximo
     * @return Lista de DTOs de productos en el rango
     */
    public List<ProductoDTO> obtenerPorRangoPrecio(Double precioMin, Double precioMax) {
        List<Producto> productos = productoRepository.findByPrecioBetween(BigDecimal.valueOf(precioMin), BigDecimal.valueOf(precioMax));
        List<Producto> productosActivos = new ArrayList<>();
        
        for (Producto producto : productos) {
            if (producto.getActivo()) {
                productosActivos.add(producto);
            }
        }
        
        return convertirListaADTO(productosActivos);
    }

    /**
     * Obtiene productos de un usuario
     * 
     * @param usuarioId ID del usuario
     * @return Lista de DTOs de productos del usuario
     */
    public List<ProductoDTO> obtenerPorUsuario(Long usuarioId) {
        List<Producto> productos = productoRepository.findByUsuarioId(usuarioId);
        return convertirListaADTO(productos);
    }

    /**
     * Actualiza un producto existente
     * 
     * @param id ID del producto a actualizar
     * @param dto Nuevos datos del producto
     * @param emailUsuario Email del usuario que actualiza
     * @return DTO del producto actualizado, o null si no existe o no es el propietario
     */
    @CacheEvict(value = {"productos", "producto", "productosPorCategoria", "busquedaProductos", "ofertas"}, allEntries = true)
    public ProductoDTO actualizar(Long id, ProductoCreateDTO dto, String emailUsuario) {
        Producto producto = productoRepository.findById(id).orElse(null);
        
        if (producto == null) {
            return null;
        }
        
        // Verificar que el usuario sea el propietario
        if (!producto.getUsuario().getEmail().equals(emailUsuario)) {
            return null; // No autorizado
        }
        
        // Actualizar datos
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setPrecioOriginal(dto.getPrecioOriginal());
        producto.setDescuento(dto.getDescuento());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setStock(dto.getStock());
        producto.setMarca(dto.getMarca());
        producto.setEnvioGratis(dto.getEnvioGratis() != null ? dto.getEnvioGratis() : false);

        // Actualizar categorías
        if (dto.getCategoriaIds() != null && !dto.getCategoriaIds().isEmpty()) {
            List<Categoria> categorias = new ArrayList<>();
            for (Long categoriaId : dto.getCategoriaIds()) {
                Categoria categoria = categoriaRepository.findById(categoriaId).orElse(null);
                if (categoria != null && categoria.getActiva()) {
                    categorias.add(categoria);
                }
            }
            producto.setCategorias(categorias);
        }

        Producto productoActualizado = productoRepository.save(producto);
        return convertirADTO(productoActualizado);
    }

    /**
     * Actualiza el stock de un producto
     * 
     * @param id ID del producto
     * @param cantidad Cantidad a sumar (negativo para restar)
     * @return true si se actualizó correctamente, false si no existe o stock insuficiente
     */
    @CacheEvict(value = {"productos", "producto", "productosPorCategoria", "busquedaProductos", "ofertas"}, allEntries = true)
    public boolean actualizarStock(Long id, Integer cantidad) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        int nuevoStock = producto.getStock() + cantidad;
        if (nuevoStock < 0) {
            throw new InsufficientStockException(
                producto.getNombre(),
                producto.getStock(),
                Math.abs(cantidad)
            );
        }
        
        producto.setStock(nuevoStock);
        productoRepository.save(producto);
        return true;
    }

    /**
     * Elimina un producto (soft delete)
     * 
     * @param id ID del producto
     * @param emailUsuario Email del usuario que elimina
     * @return true si se eliminó correctamente, false si no existe o no es el propietario
     */
    @CacheEvict(value = {"productos", "producto", "productosPorCategoria", "busquedaProductos", "ofertas"}, allEntries = true)
    public boolean eliminar(Long id, String emailUsuario) {
        Producto producto = productoRepository.findById(id).orElse(null);
        
        if (producto == null) {
            return false;
        }
        
        // Verificar que el usuario sea el propietario
        if (!producto.getUsuario().getEmail().equals(emailUsuario)) {
            return false; // No autorizado
        }
        
        producto.setActivo(false);
        productoRepository.save(producto);
        return true;
    }

    // ========================================
    // Métodos privados de conversión
    // ========================================

    /**
     * Convierte una entidad Producto a DTO completo
     */
    public ProductoDTO convertirADTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setPrecioOriginal(producto.getPrecioOriginal());
        dto.setDescuento(producto.getDescuento());
        dto.setImagenUrl(producto.getImagenUrl());
        dto.setStock(producto.getStock());
        dto.setMarca(producto.getMarca());
        dto.setRating(producto.getRating());
        dto.setReviews(producto.getReviews());
        dto.setEnvioGratis(producto.getEnvioGratis());
        dto.setCuotasSinInteres(producto.getCuotasSinInteres());
        dto.setVendido(producto.getVendido());
        dto.setFechaCreacion(producto.getFechaCreacion());
        dto.setActivo(producto.getActivo());

        // Calcular precio final con descuento aplicado
        BigDecimal precioFinal = producto.getPrecio();
        if (producto.getDescuento() != null && producto.getDescuento() > 0) {
            BigDecimal descuentoDecimal = BigDecimal.valueOf(producto.getDescuento()).divide(BigDecimal.valueOf(100));
            precioFinal = producto.getPrecio().multiply(BigDecimal.ONE.subtract(descuentoDecimal));
        }
        dto.setPrecioFinal(precioFinal);

        // Convertir categorías
        List<CategoriaSimpleDTO> categoriasDTO = new ArrayList<>();
        if (producto.getCategorias() != null) {
            for (Categoria categoria : producto.getCategorias()) {
                CategoriaSimpleDTO categoriaDTO = new CategoriaSimpleDTO();
                categoriaDTO.setId(categoria.getId());
                categoriaDTO.setNombre(categoria.getNombre());
                categoriaDTO.setDescripcion(categoria.getDescripcion());
                categoriasDTO.add(categoriaDTO);
            }
        }
        dto.setCategorias(categoriasDTO);

        // Convertir vendedor
        if (producto.getUsuario() != null) {
            UsuarioSimpleDTO vendedorDTO = new UsuarioSimpleDTO();
            vendedorDTO.setId(producto.getUsuario().getId());
            vendedorDTO.setNombre(producto.getUsuario().getNombre());
            vendedorDTO.setApellido(producto.getUsuario().getApellido());
            vendedorDTO.setNombreUsuario(producto.getUsuario().getNombreUsuario());
            dto.setVendedor(vendedorDTO);
        }

        return dto;
    }

    /**
     * Convierte una entidad Producto a DTO simple
     */
    private ProductoSimpleDTO convertirASimpleDTO(Producto producto) {
        ProductoSimpleDTO dto = new ProductoSimpleDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        dto.setImagenUrl(producto.getImagenUrl());
        dto.setEnvioGratis(producto.getEnvioGratis());
        dto.setDescuento(producto.getDescuento());
        dto.setRating(producto.getRating());
        return dto;
    }

    /**
     * Convierte una lista de productos a lista de DTOs
     */
    private List<ProductoDTO> convertirListaADTO(List<Producto> productos) {
        List<ProductoDTO> dtos = new ArrayList<>();
        for (Producto producto : productos) {
            dtos.add(convertirADTO(producto));
        }
        return dtos;
    }

    // ========== MÉTODOS DE ADMINISTRACIÓN ==========

    /**
     * Obtiene TODOS los productos (incluyendo inactivos)
     * Solo para uso administrativo
     */
    public List<ProductoDTO> obtenerTodosProductosAdmin() {
        List<Producto> productos = productoRepository.findAll();
        return convertirListaADTO(productos);
    }

    /**
     * Alterna el estado activo/inactivo de un producto
     * Invalida todas las cachés relacionadas
     */
    @CacheEvict(value = {"productos", "producto", "productosPorCategoria", "busquedaProductos", "ofertas"}, allEntries = true)
    public ProductoDTO toggleActivoProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        producto.setActivo(!producto.getActivo());
        
        Producto productoActualizado = productoRepository.save(producto);
        return convertirADTO(productoActualizado);
    }

    /**
     * Elimina permanentemente un producto
     * Invalida todas las cachés relacionadas
     */
    @CacheEvict(value = {"productos", "producto", "productosPorCategoria", "busquedaProductos", "ofertas"}, allEntries = true)
    public void eliminarProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        productoRepository.delete(producto);
    }
}
