package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.OrdenCreateDTO;
import com.api.e_commerce.dto.OrdenDTO;
import com.api.e_commerce.model.EstadoOrden;
import com.api.e_commerce.service.OrdenService;

import jakarta.validation.Valid;

/**
 * Controlador REST para Órdenes
 * Maneja la creación y gestión de órdenes de compra
 */
@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "*") // Permite CORS para conexión con React
public class OrdenController {
    
    @Autowired
    private OrdenService ordenService;

    /**
     * GET /api/ordenes
     * Lista todas las órdenes del usuario autenticado
     * 
     * @param authentication - Usuario autenticado
     * @return Lista de órdenes del usuario
     */
    @GetMapping
    public ResponseEntity<List<OrdenDTO>> listarMisOrdenes(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String emailUsuario = authentication.getName();
        List<OrdenDTO> ordenes = ordenService.listarPorUsuario(emailUsuario);
        return ResponseEntity.ok(ordenes);
    }

    /**
     * GET /api/ordenes/{id}
     * Obtiene una orden por su ID
     * Solo el propietario puede ver su orden
     * 
     * @param id - ID de la orden
     * @return OrdenDTO con los datos de la orden
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrdenDTO> obtenerPorId(@PathVariable Long id) {
        OrdenDTO orden = ordenService.obtenerPorId(id);
        if (orden != null) {
            return ResponseEntity.ok(orden);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * POST /api/ordenes
     * Crea una nueva orden de compra
     * Requiere autenticación
     * Valida stock disponible y actualiza automáticamente
     * 
     * @param dto - Datos de la orden (items con productos y cantidades)
     * @param authentication - Usuario autenticado que crea la orden
     * @return OrdenDTO de la orden creada
     */
    @PostMapping
    public ResponseEntity<OrdenDTO> crear(
            @Valid @RequestBody OrdenCreateDTO dto,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String emailUsuario = authentication.getName();
        OrdenDTO nuevaOrden = ordenService.crearOrden(dto, emailUsuario);
        
        if (nuevaOrden != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOrden);
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * PUT /api/ordenes/{id}/estado
     * Actualiza el estado de una orden
     * Solo el propietario puede actualizar su orden
     * 
     * @param id - ID de la orden
     * @param nuevoEstado - Nuevo estado de la orden
     * @param authentication - Usuario autenticado
     * @return OrdenDTO de la orden actualizada
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<OrdenDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoOrden nuevoEstado,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String emailUsuario = authentication.getName();
        OrdenDTO ordenActualizada = ordenService.actualizarEstado(id, nuevoEstado, emailUsuario);
        
        if (ordenActualizada != null) {
            return ResponseEntity.ok(ordenActualizada);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * DELETE /api/ordenes/{id}
     * Cancela una orden
     * Solo se pueden cancelar órdenes en estado PENDIENTE o EN_PROCESO
     * Devuelve el stock a los productos
     * 
     * @param id - ID de la orden a cancelar
     * @param authentication - Usuario autenticado
     * @return 204 No Content si se canceló correctamente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String emailUsuario = authentication.getName();
        boolean cancelada = ordenService.cancelarOrden(id, emailUsuario);
        
        if (cancelada) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * GET /api/ordenes/estado/{estado}
     * Lista órdenes por estado
     * Solo para administradores o las órdenes propias
     * 
     * @param estado - Estado de las órdenes a buscar
     * @return Lista de órdenes con el estado especificado
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<OrdenDTO>> listarPorEstado(@PathVariable EstadoOrden estado) {
        List<OrdenDTO> ordenes = ordenService.listarPorEstado(estado);
        return ResponseEntity.ok(ordenes);
    }

    /**
     * GET /api/ordenes/usuario/{usuarioId}
     * Lista órdenes de un usuario específico (solo para admin)
     * 
     * @param estado - Estado de las órdenes a buscar
     * @param authentication - Usuario autenticado
     * @return Lista de órdenes del usuario con el estado especificado
     */
    @GetMapping("/mis-ordenes/estado/{estado}")
    public ResponseEntity<List<OrdenDTO>> listarMisOrdenesPorEstado(
            @PathVariable EstadoOrden estado,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String emailUsuario = authentication.getName();
        List<OrdenDTO> ordenes = ordenService.listarPorUsuarioYEstado(emailUsuario, estado);
        return ResponseEntity.ok(ordenes);
    }
}
