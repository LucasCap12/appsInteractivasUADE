package com.api.e_commerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.ProductoDTO;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.service.FavoritoService;

/**
 * Controlador REST para Favoritos
 * Maneja las operaciones CRUD de favoritos de usuarios
 */
@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*") // Permite CORS para conexión con React
public class FavoritoController {
    
    @Autowired
    private FavoritoService favoritoService;

    /**
     * GET /api/favoritos
     * Obtiene todos los favoritos del usuario autenticado
     * 
     * @param authentication - Información del usuario autenticado
     * @return Lista de productos favoritos
     */
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> obtenerFavoritos(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = (Usuario) authentication.getPrincipal();
        List<ProductoDTO> favoritos = favoritoService.obtenerFavoritosPorUsuario(usuario.getId());
        return ResponseEntity.ok(favoritos);
    }

    /**
     * POST /api/favoritos/{productoId}
     * Agrega un producto a los favoritos del usuario autenticado
     * 
     * @param productoId - ID del producto a agregar
     * @param authentication - Información del usuario autenticado
     * @return Mensaje de confirmación
     */
    @PostMapping("/{productoId}")
    public ResponseEntity<Map<String, Object>> agregarFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = (Usuario) authentication.getPrincipal();
        favoritoService.agregarFavorito(usuario.getId(), productoId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Producto agregado a favoritos");
        response.put("productoId", productoId);
        response.put("success", true);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * DELETE /api/favoritos/{productoId}
     * Elimina un producto de los favoritos del usuario autenticado
     * 
     * @param productoId - ID del producto a eliminar
     * @param authentication - Información del usuario autenticado
     * @return Mensaje de confirmación
     */
    @DeleteMapping("/{productoId}")
    public ResponseEntity<Map<String, Object>> eliminarFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = (Usuario) authentication.getPrincipal();
        favoritoService.eliminarFavorito(usuario.getId(), productoId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Producto eliminado de favoritos");
        response.put("productoId", productoId);
        response.put("success", true);
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/favoritos/check/{productoId}
     * Verifica si un producto es favorito del usuario autenticado
     * 
     * @param productoId - ID del producto a verificar
     * @param authentication - Información del usuario autenticado
     * @return Boolean indicando si es favorito
     */
    @GetMapping("/check/{productoId}")
    public ResponseEntity<Map<String, Object>> verificarFavorito(
            @PathVariable Long productoId,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = (Usuario) authentication.getPrincipal();
        boolean esFavorito = favoritoService.esFavorito(usuario.getId(), productoId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("esFavorito", esFavorito);
        response.put("productoId", productoId);
        
        return ResponseEntity.ok(response);
    }
}
