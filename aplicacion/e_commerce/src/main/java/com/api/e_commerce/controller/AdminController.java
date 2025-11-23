package com.api.e_commerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.ProductoDTO;
import com.api.e_commerce.service.ProductoService;

/**
 * Controlador REST para funciones de administración
 * Solo accesible por usuarios con rol ADMIN
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private ProductoService productoService;
    
    /**
     * Obtiene TODOS los productos (incluyendo inactivos)
     * Solo accesible por administradores
     */
    @GetMapping("/productos")
    public ResponseEntity<List<ProductoDTO>> obtenerTodosProductos() {
        List<ProductoDTO> productos = productoService.obtenerTodosProductosAdmin();
        return ResponseEntity.ok(productos);
    }
    
    /**
     * Alterna el estado activo/inactivo de un producto
     */
    @PatchMapping("/productos/{id}/toggle-activo")
    public ResponseEntity<Map<String, Object>> toggleActivoProducto(@PathVariable Long id) {
        ProductoDTO producto = productoService.toggleActivoProducto(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", producto.getActivo() ? "Producto activado" : "Producto desactivado");
        response.put("producto", producto);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Elimina un producto permanentemente
     */
    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Map<String, String>> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Producto eliminado exitosamente");
        
        return ResponseEntity.ok(response);
    }
}
