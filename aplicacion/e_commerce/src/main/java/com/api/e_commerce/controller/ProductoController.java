package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.ProductoCreateDTO;
import com.api.e_commerce.dto.ProductoDTO;
import com.api.e_commerce.dto.StockUpdateDTO;
import com.api.e_commerce.service.ProductoService;

import jakarta.validation.Valid;

// @TASK: Controlador REST para gestión de productos (CRUD + búsquedas avanzadas)
// @AI_CONTEXT: REST API con endpoints públicos (GET) y protegidos (POST/PUT/DELETE)
// @AI_CONTEXT: Ownership validation - Solo el propietario puede modificar/eliminar sus productos
// @SECURITY: Authentication object obtiene usuario del JWT via SecurityContextHolder
// @SECURITY: endpoints POST/PUT/DELETE requieren JWT válido (configurado en SecurityConfig)
/**
 * Endpoints:
 * - GET /api/productos (público) - Listado con paginación/ordenamiento opcional
 * - GET /api/productos/{id} (público) - Detalle de producto
 * - POST /api/productos (autenticado) - Crear producto asociado al usuario
 * - PUT /api/productos/{id} (autenticado + ownership) - Actualizar solo si es propietario
 * - DELETE /api/productos/{id} (autenticado + ownership) - Soft delete (activo=false)
 * - PATCH /api/productos/{id}/stock (autenticado) - Actualizar stock
 * - GET /api/productos/buscar?termino={} (público) - Búsqueda por nombre/descripción
 * - GET /api/productos/categoria/{id} (público) - Productos por categoría
 * - GET /api/productos/marca/{marca} (público) - Productos por marca
 * - GET /api/productos/ofertas (público) - Productos con descuento
 */
@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // @SECURITY: CORS global. Mejor usar configuración de SecurityConfig
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;

    // @TASK: GET /api/productos - Lista productos activos con soporte para paginación y ordenamiento
    // @INPUT: page (Integer, optional) - Número de página (0-based)
    // @INPUT: size (Integer, optional) - Tamaño de página (default 20)
    // @INPUT: sortBy (String, default "nombre") - Campo de ordenamiento (nombre, precio, fechaCreacion)
    // @INPUT: sortDir (String, default "asc") - Dirección de ordenamiento (asc/desc)
    // @OUTPUT: List<ProductoDTO> (sin paginación) o Page<ProductoDTO> (con paginación)
    // @AI_CONTEXT: Endpoint público. Si page/size son null, retorna todos (sin paginación)
    @GetMapping
    public ResponseEntity<?> listarTodos(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "nombre") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        // STEP 1: Sin paginación - retornar todos los productos activos
        if (page == null || size == null) {
            List<ProductoDTO> productos = productoService.listarTodos();
            return ResponseEntity.ok(productos);
        }
        
        // STEP 2: Con paginación - construir Sort y Pageable
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductoDTO> productos = productoService.listarTodosPaginado(pageable);
        return ResponseEntity.ok(productos);
    }

    // @TASK: GET /api/productos/{id} - Obtiene detalle de un producto por ID
    // @INPUT: id (Long, path variable) - ID del producto
    // @OUTPUT: ProductoDTO (200 OK) o 404 Not Found si no existe
    // @AI_CONTEXT: Endpoint público. Retorna productos activos (activo=true)
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        ProductoDTO producto = productoService.obtenerPorId(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }

    // @TASK: POST /api/productos - Crear nuevo producto
    // @INPUT: dto (ProductoCreateDTO, validated) - Datos del producto (nombre, descripción, precio, etc.)
    // @INPUT: authentication (Authentication) - Usuario autenticado del JWT
    // @OUTPUT: ProductoDTO (201 CREATED) - Producto creado con ID generado
    // @AI_CONTEXT: Producto se asocia automáticamente al usuario del JWT (authentication.getName() = email)
    // @SECURITY: Requiere JWT válido. Usuario extraído del SecurityContext
    // @VALIDATION: @Valid activa Bean Validation (@NotNull, @Min, @Size en DTO)
    @PostMapping
    public ResponseEntity<ProductoDTO> crear(
            @Valid @RequestBody ProductoCreateDTO dto,
            Authentication authentication) {
        
        // STEP 1: Extraer email del usuario autenticado (JWT subject claim)
        String emailUsuario = authentication != null ? authentication.getName() : null;
        
        // STEP 2: Delegar creación al service (asocia producto a usuario por email)
        ProductoDTO nuevoProducto = productoService.crearProducto(dto, emailUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
    }

    // @TASK: PUT /api/productos/{id} - Actualizar producto existente
    // @INPUT: id (Long, path variable) - ID del producto a actualizar
    // @INPUT: dto (ProductoCreateDTO, validated) - Nuevos datos del producto
    // @INPUT: authentication (Authentication) - Usuario autenticado
    // @OUTPUT: ProductoDTO (200 OK) o 404 Not Found
    // @AI_CONTEXT: OWNERSHIP VALIDATION - Solo el propietario puede actualizar
    // @SECURITY: Service valida que authentication.getName() == producto.usuario.email
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoCreateDTO dto,
            Authentication authentication) {
        
        String emailUsuario = authentication != null ? authentication.getName() : null;
        ProductoDTO productoActualizado = productoService.actualizar(id, dto, emailUsuario);
        if (productoActualizado != null) {
            return ResponseEntity.ok(productoActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    // @TASK: DELETE /api/productos/{id} - Eliminar producto (soft delete)
    // @INPUT: id (Long, path variable) - ID del producto a eliminar
    // @INPUT: authentication (Authentication) - Usuario autenticado
    // @OUTPUT: 204 No Content (éxito) o 404 Not Found
    // @AI_CONTEXT: SOFT DELETE - Cambia activo=false, NO borra registro de BD
    // @AI_CONTEXT: OWNERSHIP VALIDATION - Solo el propietario puede eliminar
    // @SECURITY: Service valida que authentication.getName() == producto.usuario.email
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id,
            Authentication authentication) {
        
        String emailUsuario = authentication != null ? authentication.getName() : null;
        boolean eliminado = productoService.eliminar(id, emailUsuario);
        if (eliminado) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * PATCH /api/productos/{id}/stock
     * Actualiza el stock de un producto
     * 
     * @param id - ID del producto
     * @param dto - Nueva cantidad de stock
     * @return 200 OK si se actualizó correctamente
     */
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Void> actualizarStock(
            @PathVariable Long id,
            @Valid @RequestBody StockUpdateDTO dto) {
        
        boolean actualizado = productoService.actualizarStock(id, dto.getCantidad());
        if (actualizado) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * GET /api/productos/buscar?termino={termino}
     * Busca productos por nombre o descripción
     * Soporta paginación y ordenamiento
     * 
     * @param termino Término de búsqueda
     * @param page Número de página (opcional)
     * @param size Tamaño de página (opcional)
     * @param sortBy Campo de ordenamiento (default: nombre)
     * @param sortDir Dirección de ordenamiento (default: asc)
     * @return Lista de productos que coinciden con el término
     */
    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(
            @RequestParam String termino,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "nombre") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        // Sin paginación
        if (page == null || size == null) {
            List<ProductoDTO> productos = productoService.buscarProductos(termino);
            return ResponseEntity.ok(productos);
        }
        
        // Con paginación
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductoDTO> productos = productoService.buscarProductosPaginado(termino, pageable);
        return ResponseEntity.ok(productos);
    }

    /**
     * GET /api/productos/categoria/{categoriaId}
     * Obtiene productos por categoría
     * Soporta paginación y ordenamiento
     * 
     * @param categoriaId ID de la categoría
     * @param page Número de página (opcional)
     * @param size Tamaño de página (opcional)
     * @param sortBy Campo de ordenamiento (default: nombre)
     * @param sortDir Dirección de ordenamiento (default: asc)
     * @return Lista de productos de la categoría
     */
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<?> porCategoria(
            @PathVariable Long categoriaId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "nombre") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        // Sin paginación
        if (page == null || size == null) {
            List<ProductoDTO> productos = productoService.obtenerPorCategoria(categoriaId);
            return ResponseEntity.ok(productos);
        }
        
        // Con paginación
        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ProductoDTO> productos = productoService.obtenerPorCategoriaPaginado(categoriaId, pageable);
        return ResponseEntity.ok(productos);
    }

    /**
     * GET /api/productos/marca/{marca}
     * Obtiene productos por marca
     * 
     * @param marca - Nombre de la marca
     * @return Lista de productos de la marca
     */
    @GetMapping("/marca/{marca}")
    public ResponseEntity<List<ProductoDTO>> porMarca(@PathVariable String marca) {
        List<ProductoDTO> productos = productoService.obtenerPorMarca(marca);
        return ResponseEntity.ok(productos);
    }

    /**
     * GET /api/productos/envio-gratis
     * Obtiene productos con envío gratis
     * 
     * @return Lista de productos con envío gratis
     */
    @GetMapping("/envio-gratis")
    public ResponseEntity<List<ProductoDTO>> conEnvioGratis() {
        List<ProductoDTO> productos = productoService.obtenerConEnvioGratis();
        return ResponseEntity.ok(productos);
    }

    /**
     * GET /api/productos/ofertas
     * Obtiene productos con descuento (ofertas)
     * Ordenados por descuento descendente (mayor descuento primero)
     * 
     * @return Lista de productos en oferta
     */
    @GetMapping("/ofertas")
    public ResponseEntity<List<ProductoDTO>> ofertas() {
        List<ProductoDTO> productos = productoService.obtenerOfertas();
        return ResponseEntity.ok(productos);
    }

    /**
     * GET /api/productos/precio?min={min}&max={max}
     * Busca productos por rango de precio
     * 
     * @param min - Precio mínimo
     * @param max - Precio máximo
     * @return Lista de productos en el rango de precio
     */
    @GetMapping("/precio")
    public ResponseEntity<List<ProductoDTO>> porRangoPrecio(
            @RequestParam Double min,
            @RequestParam Double max) {
        List<ProductoDTO> productos = productoService.obtenerPorRangoPrecio(min, max);
        return ResponseEntity.ok(productos);
    }

    /**
     * GET /api/productos/usuario/{usuarioId}
     * Obtiene productos de un usuario específico (vendedor)
     * 
     * @param usuarioId - ID del usuario vendedor
     * @return Lista de productos del usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ProductoDTO>> porUsuario(@PathVariable Long usuarioId) {
        List<ProductoDTO> productos = productoService.obtenerPorUsuario(usuarioId);
        return ResponseEntity.ok(productos);
    }
}
