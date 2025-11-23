package com.api.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.AuthResponse;
import com.api.e_commerce.dto.LoginRequest;
import com.api.e_commerce.dto.RegistroRequest;
import com.api.e_commerce.service.AuthService;

import jakarta.validation.Valid;

/**
 * Controlador REST para Autenticación
 * Maneja el registro y login de usuarios
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite CORS para conexión con React
public class AuthController {
    
    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Registra un nuevo usuario en el sistema
     * 
     * @param request - Datos del usuario a registrar (nombre, email, password, etc.)
     * @return AuthResponse con datos del usuario registrado y mensaje de éxito
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        AuthResponse response = authService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Autentica un usuario existente
     * 
     * @param request - Credenciales del usuario (email y password)
     * @return AuthResponse con datos del usuario y token de autenticación
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/auth/exists?email={email}
     * Verifica si existe un usuario con el email proporcionado
     * 
     * @param email - Email a verificar
     * @return true si el usuario existe, false en caso contrario
     */
    @GetMapping("/exists")
    public ResponseEntity<Boolean> existeUsuario(@RequestParam String email) {
        boolean existe = authService.existeEmail(email);
        return ResponseEntity.ok(existe);
    }
}
