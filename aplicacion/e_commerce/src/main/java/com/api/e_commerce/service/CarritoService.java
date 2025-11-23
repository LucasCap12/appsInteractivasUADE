package com.api.e_commerce.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.CarritoDTO;
import com.api.e_commerce.dto.CarritoItemCreateDTO;
import com.api.e_commerce.dto.CarritoItemDTO;
import com.api.e_commerce.dto.ProductoSimpleDTO;
import com.api.e_commerce.exception.BusinessException;
import com.api.e_commerce.exception.InsufficientStockException;
import com.api.e_commerce.exception.ResourceNotFoundException;
import com.api.e_commerce.model.Carrito;
import com.api.e_commerce.model.CarritoItem;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.CarritoRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;

/**
 * Servicio para la gestión del carrito de compras
 */
@Service
@Transactional
public class CarritoService {
    
    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    
    public CarritoService(CarritoRepository carritoRepository,
                         ProductoRepository productoRepository,
                         UsuarioRepository usuarioRepository) {
        this.carritoRepository = carritoRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }
    
    /**
     * Obtiene el carrito del usuario autenticado
     * Si no existe, lo crea automáticamente
     */
    public CarritoDTO obtenerCarrito(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", emailUsuario));
        
        Carrito carrito = carritoRepository.findByUsuarioEmail(emailUsuario)
                .orElseGet(() -> crearCarritoParaUsuario(usuario));
        
        return convertirADTO(carrito);
    }
    
    /**
     * Agrega un item al carrito o actualiza la cantidad si ya existe
     */
    public CarritoDTO agregarItem(String emailUsuario, CarritoItemCreateDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", emailUsuario));
        
        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", dto.getProductoId()));
        
        if (!producto.getActivo()) {
            throw new ResourceNotFoundException("Producto", "id", dto.getProductoId());
        }
        
        // Validar que el usuario no esté comprando su propio producto
        if (producto.getUsuario().getId().equals(usuario.getId())) {
            throw new BusinessException("No puedes agregar tus propios productos al carrito");
        }
        
        // Validar stock disponible
        if (producto.getStock() < dto.getCantidad()) {
            throw new InsufficientStockException(
                producto.getNombre(),
                producto.getStock(),
                dto.getCantidad()
            );
        }
        
        Carrito carrito = carritoRepository.findByUsuarioEmail(emailUsuario)
                .orElseGet(() -> crearCarritoParaUsuario(usuario));
        
        // Buscar si el producto ya existe en el carrito
        Optional<CarritoItem> itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(dto.getProductoId()))
                .findFirst();
        
        if (itemExistente.isPresent()) {
            // Actualizar cantidad
            CarritoItem item = itemExistente.get();
            int nuevaCantidad = item.getCantidad() + dto.getCantidad();
            
            // Validar stock para nueva cantidad
            if (producto.getStock() < nuevaCantidad) {
                throw new InsufficientStockException(
                    producto.getNombre(),
                    producto.getStock(),
                    nuevaCantidad
                );
            }
            
            item.setCantidad(nuevaCantidad);
        } else {
            // Crear nuevo item
            CarritoItem nuevoItem = CarritoItem.builder()
                    .carrito(carrito)
                    .producto(producto)
                    .cantidad(dto.getCantidad())
                    .build();
            carrito.getItems().add(nuevoItem);
        }
        
        carrito.setFechaActualizacion(LocalDateTime.now());
        Carrito carritoGuardado = carritoRepository.save(carrito);
        return convertirADTO(carritoGuardado);
    }
    
    /**
     * Actualiza la cantidad de un item en el carrito
     */
    public CarritoDTO actualizarCantidad(String emailUsuario, Long itemId, Integer nuevaCantidad) {
        Carrito carrito = carritoRepository.findByUsuarioEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "usuario", emailUsuario));
        
        CarritoItem item = carrito.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CarritoItem", "id", itemId));
        
        // Validar stock
        if (item.getProducto().getStock() < nuevaCantidad) {
            throw new InsufficientStockException(
                item.getProducto().getNombre(),
                item.getProducto().getStock(),
                nuevaCantidad
            );
        }
        
        item.setCantidad(nuevaCantidad);
        carrito.setFechaActualizacion(LocalDateTime.now());
        Carrito carritoActualizado = carritoRepository.save(carrito);
        return convertirADTO(carritoActualizado);
    }
    
    /**
     * Elimina un item del carrito
     */
    public CarritoDTO eliminarItem(String emailUsuario, Long itemId) {
        Carrito carrito = carritoRepository.findByUsuarioEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "usuario", emailUsuario));
        
        carrito.getItems().removeIf(item -> item.getId().equals(itemId));
        carrito.setFechaActualizacion(LocalDateTime.now());
        Carrito carritoActualizado = carritoRepository.save(carrito);
        return convertirADTO(carritoActualizado);
    }
    
    /**
     * Vacía el carrito
     */
    public void vaciarCarrito(String emailUsuario) {
        Carrito carrito = carritoRepository.findByUsuarioEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "usuario", emailUsuario));
        
        carrito.getItems().clear();
        carrito.setFechaActualizacion(LocalDateTime.now());
        carritoRepository.save(carrito);
    }
    
    // ========================================
    // Métodos privados auxiliares
    // ========================================
    
    private Carrito crearCarritoParaUsuario(Usuario usuario) {
        Carrito nuevoCarrito = Carrito.builder()
                .usuario(usuario)
                .fechaCreacion(LocalDateTime.now())
                .fechaActualizacion(LocalDateTime.now())
                .build();
        return carritoRepository.save(nuevoCarrito);
    }
    
    private CarritoDTO convertirADTO(Carrito carrito) {
        List<CarritoItemDTO> itemsDTO = carrito.getItems().stream()
                .map(this::convertirItemADTO)
                .collect(Collectors.toList());
        
        return CarritoDTO.builder()
                .id(carrito.getId())
                .usuarioId(carrito.getUsuario().getId())
                .items(itemsDTO)
                .total(carrito.getTotal())
                .cantidadTotal(carrito.getCantidadTotal())
                .fechaActualizacion(carrito.getFechaActualizacion())
                .build();
    }
    
    private CarritoItemDTO convertirItemADTO(CarritoItem item) {
        Producto producto = item.getProducto();
        
        ProductoSimpleDTO productoDTO = ProductoSimpleDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .precio(producto.getPrecio())
                .imagenUrl(producto.getImagenUrl())
                .stock(producto.getStock())
                .envioGratis(producto.getEnvioGratis())
                .descuento(producto.getDescuento())
                .build();
        
        return CarritoItemDTO.builder()
                .id(item.getId())
                .producto(productoDTO)
                .cantidad(item.getCantidad())
                .subtotal(item.getSubtotal())
                .build();
    }
}
