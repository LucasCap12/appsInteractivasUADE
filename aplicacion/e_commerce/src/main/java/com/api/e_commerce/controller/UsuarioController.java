package com.api.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.UsuarioDTO;
import com.api.e_commerce.service.UsuarioService;

/**
 * Controlador REST para gestión de usuarios
 * Endpoints protegidos que requieren autenticación
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    /**
     * GET /api/usuarios/perfil
     * Obtiene el perfil del usuario autenticado
     * 
     * @param auth - Información de autenticación (inyectada por Spring Security)
     * @return UsuarioDTO con los datos del usuario
     */
    @GetMapping("/perfil")
    public ResponseEntity<UsuarioDTO> obtenerPerfil(Authentication auth) {
        String email = auth.getName(); // Email del JWT
        UsuarioDTO usuario = usuarioService.obtenerPerfilPorEmail(email);
        return ResponseEntity.ok(usuario);
    }
    
    /**
     * PUT /api/usuarios/perfil
     * Actualiza el perfil del usuario autenticado
     * 
     * @param auth - Información de autenticación
     * @param usuarioDTO - Datos a actualizar
     * @return UsuarioDTO con los datos actualizados
     */
    @PutMapping("/perfil")
    public ResponseEntity<UsuarioDTO> actualizarPerfil(
        Authentication auth,
        @RequestBody UsuarioDTO usuarioDTO
    ) {
        String email = auth.getName();
        UsuarioDTO usuarioActualizado = usuarioService.actualizarPerfil(email, usuarioDTO);
        return ResponseEntity.ok(usuarioActualizado);
    }
}
