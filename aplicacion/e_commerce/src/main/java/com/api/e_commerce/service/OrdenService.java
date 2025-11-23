package com.api.e_commerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.OrdenCreateDTO;
import com.api.e_commerce.dto.OrdenDTO;
import com.api.e_commerce.dto.OrdenItemCreateDTO;
import com.api.e_commerce.dto.OrdenItemDTO;
import com.api.e_commerce.dto.OrdenSimpleDTO;
import com.api.e_commerce.dto.ProductoSimpleDTO;
import com.api.e_commerce.dto.UsuarioSimpleDTO;
import com.api.e_commerce.exception.InsufficientStockException;
import com.api.e_commerce.exception.ResourceNotFoundException;
import com.api.e_commerce.model.EstadoOrden;
import com.api.e_commerce.model.Orden;
import com.api.e_commerce.model.OrdenItem;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.OrdenRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;

/**
 * Servicio para la gestión de órdenes
 * 
 * Implementa la lógica de negocio para:
 * - Crear órdenes con validación de stock
 * - Obtener órdenes (completas y simples)
 * - Listar órdenes por usuario y estado
 * - Actualizar estado de órdenes
 * - Calcular totales
 */
@Service
@Transactional
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Constructor con inyección de dependencias
     */
    public OrdenService(OrdenRepository ordenRepository,
                        ProductoRepository productoRepository,
                        UsuarioRepository usuarioRepository) {
        this.ordenRepository = ordenRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Crea una nueva orden
     * 
     * @param dto Datos de la orden a crear
     * @param emailUsuario Email del usuario que crea la orden
     * @return DTO de la orden creada, o null si hay errores
     */
    public OrdenDTO crearOrden(OrdenCreateDTO dto, String emailUsuario) {
        // Buscar usuario
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario).orElse(null);
        if (usuario == null) {
            return null;
        }

        // Crear orden
        Orden orden = new Orden();
        orden.setUsuario(usuario);
        orden.setFecha(LocalDateTime.now());
        orden.setEstado(EstadoOrden.PENDIENTE);
        orden.setDireccionEnvio(dto.getDireccionEnvio());
        orden.setMetodoPago(dto.getMetodoPago());

        // Crear items y validar stock
        List<OrdenItem> items = new ArrayList<>();
        BigDecimal totalCalculado = BigDecimal.ZERO;

        for (OrdenItemCreateDTO itemDTO : dto.getItems()) {
            Producto producto = productoRepository.findById(itemDTO.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", itemDTO.getProductoId()));
            
            if (!producto.getActivo()) {
                throw new ResourceNotFoundException("Producto", "id", itemDTO.getProductoId());
            }

            if (producto.getStock() < itemDTO.getCantidad()) {
                throw new InsufficientStockException(
                    producto.getNombre(),
                    producto.getStock(),
                    itemDTO.getCantidad()
                );
            }

            // Crear item
            OrdenItem item = new OrdenItem();
            item.setProducto(producto);
            item.setPrecioUnitario(producto.getPrecio());
            item.setCantidad(itemDTO.getCantidad());
            item.setOrden(orden);
            items.add(item);

            // Calcular subtotal
            totalCalculado = totalCalculado.add(producto.getPrecio().multiply(BigDecimal.valueOf(itemDTO.getCantidad())));

            // Actualizar stock del producto
            producto.setStock(producto.getStock() - itemDTO.getCantidad());
            producto.setVendido(producto.getVendido() + itemDTO.getCantidad());
            productoRepository.save(producto);
        }

        orden.setItems(items);
        orden.setTotal(totalCalculado);

        Orden ordenGuardada = ordenRepository.save(orden);
        return convertirADTO(ordenGuardada);
    }

    /**
     * Obtiene una orden por ID (DTO completo)
     * 
     * @param id ID de la orden
     * @return DTO de la orden
     */
    public OrdenDTO obtenerPorId(Long id) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden", "id", id));
        
        return convertirADTO(orden);
    }

    /**
     * Obtiene una orden simple por ID
     * 
     * @param id ID de la orden
     * @return DTO simple de la orden
     */
    public OrdenSimpleDTO obtenerSimplePorId(Long id) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden", "id", id));
        
        return convertirASimpleDTO(orden);
    }

    /**
     * Lista todas las órdenes de un usuario
     * 
     * @param emailUsuario Email del usuario
     * @return Lista de DTOs de órdenes
     */
    public List<OrdenDTO> listarPorUsuario(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario).orElse(null);
        
        if (usuario == null) {
            return new ArrayList<>();
        }
        
        List<Orden> ordenes = ordenRepository.findByUsuarioId(usuario.getId());
        return convertirListaADTO(ordenes);
    }

    /**
     * Lista órdenes por estado
     * 
     * @param estado Estado de las órdenes
     * @return Lista de DTOs de órdenes
     */
    public List<OrdenDTO> listarPorEstado(EstadoOrden estado) {
        List<Orden> ordenes = ordenRepository.findByEstado(estado);
        return convertirListaADTO(ordenes);
    }

    /**
     * Lista órdenes de un usuario por estado
     * 
     * @param emailUsuario Email del usuario
     * @param estado Estado de las órdenes
     * @return Lista de DTOs de órdenes
     */
    public List<OrdenDTO> listarPorUsuarioYEstado(String emailUsuario, EstadoOrden estado) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario).orElse(null);
        
        if (usuario == null) {
            return new ArrayList<>();
        }
        
        List<Orden> ordenes = ordenRepository.findByUsuarioIdAndEstado(usuario.getId(), estado);
        return convertirListaADTO(ordenes);
    }

    /**
     * Actualiza el estado de una orden
     * 
     * @param id ID de la orden
     * @param nuevoEstado Nuevo estado
     * @param emailUsuario Email del usuario que actualiza
     * @return DTO de la orden actualizada, o null si no existe o no es el propietario
     */
    public OrdenDTO actualizarEstado(Long id, EstadoOrden nuevoEstado, String emailUsuario) {
        Orden orden = ordenRepository.findById(id).orElse(null);
        
        if (orden == null) {
            return null;
        }
        
        // Verificar que el usuario sea el propietario
        if (!orden.getUsuario().getEmail().equals(emailUsuario)) {
            return null; // No autorizado
        }
        
        orden.setEstado(nuevoEstado);
        Orden ordenActualizada = ordenRepository.save(orden);
        return convertirADTO(ordenActualizada);
    }

    /**
     * Cancela una orden (solo si está en PENDIENTE o EN_PROCESO)
     * 
     * @param id ID de la orden
     * @param emailUsuario Email del usuario que cancela
     * @return true si se canceló correctamente, false si no se pudo
     */
    public boolean cancelarOrden(Long id, String emailUsuario) {
        Orden orden = ordenRepository.findById(id).orElse(null);
        
        if (orden == null) {
            return false;
        }
        
        // Verificar que el usuario sea el propietario
        if (!orden.getUsuario().getEmail().equals(emailUsuario)) {
            return false; // No autorizado
        }
        
        // Solo se puede cancelar si está PENDIENTE o EN_PROCESO
        if (orden.getEstado() != EstadoOrden.PENDIENTE && orden.getEstado() != EstadoOrden.EN_PROCESO) {
            return false;
        }
        
        // Devolver stock a los productos
        for (OrdenItem item : orden.getItems()) {
            Producto producto = item.getProducto();
            producto.setStock(producto.getStock() + item.getCantidad());
            producto.setVendido(producto.getVendido() - item.getCantidad());
            productoRepository.save(producto);
        }
        
        orden.setEstado(EstadoOrden.CANCELADA);
        ordenRepository.save(orden);
        return true;
    }

    // ========================================
    // Métodos privados de conversión
    // ========================================

    /**
     * Convierte una entidad Orden a DTO completo
     */
    private OrdenDTO convertirADTO(Orden orden) {
        OrdenDTO dto = new OrdenDTO();
        dto.setId(orden.getId());
        dto.setFecha(orden.getFecha());
        dto.setEstado(orden.getEstado().name());
        dto.setTotal(orden.getTotal());
        dto.setDireccionEnvio(orden.getDireccionEnvio());
        dto.setMetodoPago(orden.getMetodoPago());

        // Convertir usuario
        if (orden.getUsuario() != null) {
            UsuarioSimpleDTO usuarioDTO = new UsuarioSimpleDTO();
            usuarioDTO.setId(orden.getUsuario().getId());
            usuarioDTO.setNombre(orden.getUsuario().getNombre());
            usuarioDTO.setApellido(orden.getUsuario().getApellido());
            usuarioDTO.setNombreUsuario(orden.getUsuario().getNombreUsuario());
            dto.setUsuario(usuarioDTO);
        }

        // Convertir items
        List<OrdenItemDTO> itemsDTO = new ArrayList<>();
        if (orden.getItems() != null) {
            for (OrdenItem item : orden.getItems()) {
                OrdenItemDTO itemDTO = new OrdenItemDTO();
                itemDTO.setId(item.getId());
                itemDTO.setCantidad(item.getCantidad());
                itemDTO.setPrecioUnitario(item.getPrecioUnitario());

                // Convertir producto
                if (item.getProducto() != null) {
                    ProductoSimpleDTO productoDTO = new ProductoSimpleDTO();
                    productoDTO.setId(item.getProducto().getId());
                    productoDTO.setNombre(item.getProducto().getNombre());
                    productoDTO.setPrecio(item.getProducto().getPrecio());
                    productoDTO.setStock(item.getProducto().getStock());
                    productoDTO.setImagenUrl(item.getProducto().getImagenUrl());
                    productoDTO.setEnvioGratis(item.getProducto().getEnvioGratis());
                    productoDTO.setDescuento(item.getProducto().getDescuento());
                    productoDTO.setRating(item.getProducto().getRating());
                    itemDTO.setProducto(productoDTO);
                }

                itemsDTO.add(itemDTO);
            }
        }
        dto.setItems(itemsDTO);

        return dto;
    }

    /**
     * Convierte una entidad Orden a DTO simple
     */
    private OrdenSimpleDTO convertirASimpleDTO(Orden orden) {
        OrdenSimpleDTO dto = new OrdenSimpleDTO();
        dto.setId(orden.getId());
        dto.setFecha(orden.getFecha());
        dto.setEstado(orden.getEstado().name());
        dto.setTotal(orden.getTotal());
        dto.setCantidadItems(orden.getItems() != null ? orden.getItems().size() : 0);
        return dto;
    }

    /**
     * Convierte una lista de órdenes a lista de DTOs
     */
    private List<OrdenDTO> convertirListaADTO(List<Orden> ordenes) {
        List<OrdenDTO> dtos = new ArrayList<>();
        for (Orden orden : ordenes) {
            dtos.add(convertirADTO(orden));
        }
        return dtos;
    }
}
