package com.api.e_commerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.ProductoDTO;
import com.api.e_commerce.exception.ResourceNotFoundException;
import com.api.e_commerce.model.Favorito;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.FavoritoRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;

/**
 * Servicio para la gestión de favoritos
 * 
 * Implementa la lógica de negocio para:
 * - Obtener favoritos de un usuario
 * - Agregar productos a favoritos
 * - Eliminar productos de favoritos
 * - Verificar si un producto es favorito
 */
@Service
@Transactional
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoService productoService;

    /**
     * Constructor con inyección de dependencias
     */
    public FavoritoService(FavoritoRepository favoritoRepository, 
                          ProductoRepository productoRepository,
                          UsuarioRepository usuarioRepository,
                          ProductoService productoService) {
        this.favoritoRepository = favoritoRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoService = productoService;
    }

    /**
     * Obtiene todos los favoritos de un usuario
     * Retorna los productos en formato DTO
     */
    @Cacheable(value = "favoritos", key = "#usuarioId")
    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerFavoritosPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioId));

        List<Favorito> favoritos = favoritoRepository.findByUsuarioOrderByFechaAgregadoDesc(usuario);
        
        return favoritos.stream()
            .map(favorito -> productoService.convertirADTO(favorito.getProducto()))
            .collect(Collectors.toList());
    }

    /**
     * Agrega un producto a los favoritos del usuario
     * Si ya existe, no hace nada y retorna el favorito existente
     */
    @CacheEvict(value = "favoritos", key = "#usuarioId")
    public Favorito agregarFavorito(Long usuarioId, Long productoId) {
        // Verificar si ya existe
        var favoritoExistente = favoritoRepository.findByUsuarioIdAndProductoId(usuarioId, productoId);
        if (favoritoExistente.isPresent()) {
            return favoritoExistente.get();
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioId));

        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + productoId));

        Favorito favorito = Favorito.builder()
            .usuario(usuario)
            .producto(producto)
            .fechaAgregado(LocalDateTime.now())
            .build();

        return favoritoRepository.save(favorito);
    }

    /**
     * Elimina un producto de los favoritos del usuario
     */
    @CacheEvict(value = "favoritos", key = "#usuarioId")
    public void eliminarFavorito(Long usuarioId, Long productoId) {
        Favorito favorito = favoritoRepository.findByUsuarioIdAndProductoId(usuarioId, productoId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Favorito no encontrado para usuario " + usuarioId + " y producto " + productoId));

        favoritoRepository.delete(favorito);
    }

    /**
     * Verifica si un producto es favorito de un usuario
     */
    @Transactional(readOnly = true)
    public boolean esFavorito(Long usuarioId, Long productoId) {
        return favoritoRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId);
    }

    /**
     * Obtiene la cantidad de usuarios que tienen un producto como favorito
     */
    @Transactional(readOnly = true)
    public Long contarFavoritosPorProducto(Long productoId) {
        return favoritoRepository.countByProductoId(productoId);
    }
}
