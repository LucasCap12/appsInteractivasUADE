package com.api.e_commerce.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.CarritoDTO;
import com.api.e_commerce.dto.CarritoItemCreateDTO;
import com.api.e_commerce.service.CarritoService;

import jakarta.validation.Valid;

/**
 * Controlador REST para Carrito de Compras
 * Maneja las operaciones del carrito persistente en backend
 */
@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {
    
    private final CarritoService carritoService;
    
    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }
    
    /**
     * GET /api/carrito
     * Obtiene el carrito del usuario autenticado
     */
    @GetMapping
    public ResponseEntity<CarritoDTO> obtenerCarrito(Authentication authentication) {
        String emailUsuario = authentication.getName();
        CarritoDTO carrito = carritoService.obtenerCarrito(emailUsuario);
        return ResponseEntity.ok(carrito);
    }
    
    /**
     * POST /api/carrito/items
     * Agrega un producto al carrito o actualiza cantidad si ya existe
     */
    @PostMapping("/items")
    public ResponseEntity<CarritoDTO> agregarItem(
            @Valid @RequestBody CarritoItemCreateDTO dto,
            Authentication authentication) {
        
        String emailUsuario = authentication.getName();
        CarritoDTO carrito = carritoService.agregarItem(emailUsuario, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(carrito);
    }
    
    /**
     * PUT /api/carrito/items/{itemId}
     * Actualiza la cantidad de un item en el carrito
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CarritoDTO> actualizarCantidad(
            @PathVariable Long itemId,
            @RequestParam Integer cantidad,
            Authentication authentication) {
        
        String emailUsuario = authentication.getName();
        CarritoDTO carrito = carritoService.actualizarCantidad(emailUsuario, itemId, cantidad);
        return ResponseEntity.ok(carrito);
    }
    
    /**
     * DELETE /api/carrito/items/{itemId}
     * Elimina un item del carrito
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CarritoDTO> eliminarItem(
            @PathVariable Long itemId,
            Authentication authentication) {
        
        String emailUsuario = authentication.getName();
        CarritoDTO carrito = carritoService.eliminarItem(emailUsuario, itemId);
        return ResponseEntity.ok(carrito);
    }
    
    /**
     * DELETE /api/carrito
     * Vacía completamente el carrito
     */
    @DeleteMapping
    public ResponseEntity<Void> vaciarCarrito(Authentication authentication) {
        String emailUsuario = authentication.getName();
        carritoService.vaciarCarrito(emailUsuario);
        return ResponseEntity.noContent().build();
    }
}
