package com.api.e_commerce.service;

import com.api.e_commerce.dto.*;
import com.api.e_commerce.exception.DuplicateResourceException;
import com.api.e_commerce.exception.InvalidCredentialsException;
import com.api.e_commerce.model.Role;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.UsuarioRepository;
import com.api.e_commerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Servicio de Autenticación
 * Gestiona el registro de nuevos usuarios y el login con JWT
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Registra un nuevo usuario en el sistema
     * 
     * @param request Datos del usuario a registrar
     * @return AuthResponse con el token JWT y datos del usuario
     * @throws DuplicateResourceException si el email o nombre de usuario ya existen
     */
    @Transactional
    public AuthResponse registrar(RegistroRequest request) {
        // Validar que el email no esté en uso
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Usuario", "email", request.getEmail());
        }

        // Validar que el nombre de usuario no esté en uso
        if (usuarioRepository.findByNombreUsuario(request.getNombreUsuario()).isPresent()) {
            throw new DuplicateResourceException("Usuario", "nombreUsuario", request.getNombreUsuario());
        }

        // Crear nuevo usuario
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .nombreUsuario(request.getNombreUsuario())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .role(Role.USER) // Por defecto, todos los usuarios tienen rol USER
                .activo(true)
                .fechaRegistro(LocalDateTime.now())
                .build();

        // Guardar usuario en la base de datos
        usuario = usuarioRepository.save(usuario);

        // Generar token JWT
        String token = jwtService.generateToken(usuario);

        // Preparar respuesta
        return AuthResponse.builder()
                .success(true)
                .message("Usuario registrado exitosamente")
                .token(token)
                .usuario(convertirAUsuarioDTO(usuario))
                .build();
    }

    /**
     * Autentica un usuario y genera un token JWT
     * 
     * @param request Credenciales de login (email y password)
     * @return AuthResponse con el token JWT y datos del usuario
     * @throws InvalidCredentialsException si las credenciales son incorrectas
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            // Autenticar con Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException();
        }

        // Si la autenticación fue exitosa, buscar el usuario
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        // Verificar que el usuario esté activo
        if (!usuario.getActivo()) {
            throw new InvalidCredentialsException();
        }

        // Generar token JWT
        String token = jwtService.generateToken(usuario);

        // Preparar respuesta
        return AuthResponse.builder()
                .success(true)
                .message("Login exitoso")
                .token(token)
                .usuario(convertirAUsuarioDTO(usuario))
                .build();
    }

    /**
     * Convierte una entidad Usuario a UsuarioDTO
     * 
     * @param usuario Entidad Usuario
     * @return UsuarioDTO con los datos del usuario
     */
    private UsuarioDTO convertirAUsuarioDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .nombreUsuario(usuario.getNombreUsuario())
                .telefono(usuario.getTelefono())
                .direccion(usuario.getDireccion())
                .role(usuario.getRole())
                .fechaRegistro(usuario.getFechaRegistro())
                .activo(usuario.getActivo())
                .build();
    }

    /**
     * Verifica si un email ya está registrado
     * 
     * @param email Email a verificar
     * @return true si el email existe, false en caso contrario
     */
    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }

    /**
     * Verifica si un nombre de usuario ya está registrado
     * 
     * @param nombreUsuario Nombre de usuario a verificar
     * @return true si el nombre existe, false en caso contrario
     */
    @Transactional(readOnly = true)
    public boolean existeNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario).isPresent();
    }
}
