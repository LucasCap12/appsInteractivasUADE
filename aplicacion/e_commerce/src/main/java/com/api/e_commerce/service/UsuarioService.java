package com.api.e_commerce.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.UsuarioDTO;
import com.api.e_commerce.dto.UsuarioSimpleDTO;
import com.api.e_commerce.model.Role;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.UsuarioRepository;

/**
 * Servicio para la gestión de usuarios
 * 
 * Implementa UserDetailsService para integración con Spring Security
 * 
 * Funcionalidades:
 * - Cargar usuarios por email (Spring Security)
 * - Obtener información de usuarios
 * - Actualizar perfil de usuario
 * - Gestionar estado de usuarios
 */
@Service
@Transactional
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Constructor con inyección de dependencias
     */
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Carga un usuario por email (requerido por Spring Security)
     * 
     * @param email Email del usuario
     * @return UserDetails del usuario
     * @throws UsernameNotFoundException si el usuario no existe
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
        
        if (!usuario.getActivo()) {
            throw new UsernameNotFoundException("Usuario inactivo: " + email);
        }
        
        return usuario;
    }

    /**
     * Obtiene un usuario por ID (DTO completo)
     * 
     * @param id ID del usuario
     * @return DTO del usuario, o null si no existe
     */
    public UsuarioDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        
        if (usuario == null) {
            return null;
        }
        
        return convertirADTO(usuario);
    }

    /**
     * Obtiene un usuario simple por ID
     * 
     * @param id ID del usuario
     * @return DTO simple del usuario, o null si no existe
     */
    public UsuarioSimpleDTO obtenerSimplePorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        
        if (usuario == null) {
            return null;
        }
        
        return convertirASimpleDTO(usuario);
    }

    /**
     * Obtiene un usuario por email
     * 
     * @param email Email del usuario
     * @return DTO del usuario, o null si no existe
     */
    public UsuarioDTO obtenerPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        
        if (usuario == null) {
            return null;
        }
        
        return convertirADTO(usuario);
    }

    /**
     * Obtiene el perfil del usuario autenticado por email
     * Usado por el endpoint /api/usuarios/perfil
     * 
     * @param email Email del usuario (del JWT)
     * @return DTO del usuario
     * @throws com.api.e_commerce.exception.ResourceNotFoundException si no existe
     */
    public UsuarioDTO obtenerPerfilPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        
        return convertirADTO(usuario);
    }

    /**
     * Verifica si existe un usuario con el email dado
     * 
     * @param email Email a verificar
     * @return true si existe, false si no
     */
    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    /**
     * Verifica si existe un usuario con el nombre de usuario dado
     * 
     * @param nombreUsuario Nombre de usuario a verificar
     * @return true si existe, false si no
     */
    public boolean existePorNombreUsuario(String nombreUsuario) {
        return usuarioRepository.existsByNombreUsuario(nombreUsuario);
    }

    /**
     * Lista todos los usuarios activos
     * 
     * @return Lista de DTOs de usuarios
     */
    public List<UsuarioDTO> listarTodos() {
        List<Usuario> usuarios = usuarioRepository.findByActivoTrue();
        return convertirListaADTO(usuarios);
    }

    /**
     * Actualiza el perfil de un usuario
     * 
     * @param email Email del usuario a actualizar
     * @param nombre Nuevo nombre
     * @param apellido Nuevo apellido
     * @param telefono Nuevo teléfono
     * @param direccion Nueva dirección
     * @return DTO del usuario actualizado, o null si no existe
     */
    public UsuarioDTO actualizarPerfil(String email, String nombre, String apellido, 
                                       String telefono, String direccion) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        
        if (usuario == null) {
            return null;
        }
        
        if (nombre != null && !nombre.isBlank()) {
            usuario.setNombre(nombre);
        }
        if (apellido != null && !apellido.isBlank()) {
            usuario.setApellido(apellido);
        }
        if (telefono != null) {
            usuario.setTelefono(telefono);
        }
        if (direccion != null) {
            usuario.setDireccion(direccion);
        }
        
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioActualizado);
    }

    /**
     * Actualiza el perfil del usuario usando un DTO
     * Usado por el endpoint /api/usuarios/perfil
     * 
     * @param email Email del usuario (extraído del JWT)
     * @param usuarioDTO DTO con los datos a actualizar
     * @return DTO del usuario actualizado
     * @throws RuntimeException si el usuario no existe
     */
    public UsuarioDTO actualizarPerfil(String email, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
        
        if (usuarioDTO.getNombre() != null && !usuarioDTO.getNombre().isBlank()) {
            usuario.setNombre(usuarioDTO.getNombre());
        }
        if (usuarioDTO.getApellido() != null && !usuarioDTO.getApellido().isBlank()) {
            usuario.setApellido(usuarioDTO.getApellido());
        }
        if (usuarioDTO.getTelefono() != null) {
            usuario.setTelefono(usuarioDTO.getTelefono());
        }
        if (usuarioDTO.getDireccion() != null) {
            usuario.setDireccion(usuarioDTO.getDireccion());
        }
        if (usuarioDTO.getDarkMode() != null) {
            usuario.setDarkMode(usuarioDTO.getDarkMode());
        }
        
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioActualizado);
    }

    /**
     * Cambia la contraseña de un usuario
     * 
     * @param email Email del usuario
     * @param passwordActual Contraseña actual
     * @param passwordNueva Nueva contraseña
     * @return true si se cambió correctamente, false si la contraseña actual es incorrecta
     */
    public boolean cambiarPassword(String email, String passwordActual, String passwordNueva) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        
        if (usuario == null) {
            return false;
        }
        
        // Verificar contraseña actual
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            return false;
        }
        
        // Establecer nueva contraseña
        usuario.setPassword(passwordEncoder.encode(passwordNueva));
        usuarioRepository.save(usuario);
        return true;
    }

    /**
     * Cambia el estado activo/inactivo de un usuario (soft delete)
     * 
     * @param id ID del usuario
     * @param activo Nuevo estado
     * @return true si se cambió correctamente, false si no existe
     */
    public boolean cambiarEstado(Long id, boolean activo) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        
        if (usuario == null) {
            return false;
        }
        
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
        return true;
    }

    // ========================================
    // Métodos privados de conversión
    // ========================================

    /**
     * Convierte una entidad Usuario a DTO completo
     */
    private UsuarioDTO convertirADTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setNombreUsuario(usuario.getNombreUsuario());
        dto.setTelefono(usuario.getTelefono());
        dto.setDireccion(usuario.getDireccion());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        dto.setRole(usuario.getRole());
        dto.setActivo(usuario.getActivo());
        dto.setDarkMode(usuario.getDarkMode());
        return dto;
    }

    /**
     * Convierte una entidad Usuario a DTO simple
     */
    private UsuarioSimpleDTO convertirASimpleDTO(Usuario usuario) {
        UsuarioSimpleDTO dto = new UsuarioSimpleDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setNombreUsuario(usuario.getNombreUsuario());
        return dto;
    }

    /**
     * Convierte una lista de usuarios a lista de DTOs
     */
    private List<UsuarioDTO> convertirListaADTO(List<Usuario> usuarios) {
        List<UsuarioDTO> dtos = new ArrayList<>();
        for (Usuario usuario : usuarios) {
            dtos.add(convertirADTO(usuario));
        }
        return dtos;
    }
}
