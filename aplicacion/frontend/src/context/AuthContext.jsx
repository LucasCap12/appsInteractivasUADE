// @TASK: Authentication Context Provider - Gestión global de estado de autenticación
// @AI_CONTEXT: Implementa Observer Pattern mediante React Context API para notificar cambios de autenticación a toda la app
// @SECURITY: Almacena JWT en localStorage con validación de formato, proporciona capa de abstracción para auth
// @ACCESSIBILITY: Maneja estados de carga (isLoading) para feedback visual a usuarios
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// @AI_CONTEXT: Context object siguiendo pattern Provider/Consumer de React
const AuthContext = createContext();

export { AuthContext };

// @TASK: Custom Hook para acceder al contexto de autenticación
// @INPUT: Ninguno
// @OUTPUT: { user, login, register, logout, isLoading, isInitialized, isAdmin }
// @AI_CONTEXT: Enforce Pattern - Previene uso fuera de Provider con error descriptivo
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// @TASK: Provider Component - Proveedor de contexto de autenticación para árbol de componentes
// @INPUT: children (React.ReactNode) - Componentes hijos que tendrán acceso al contexto
// @OUTPUT: Context Provider con estado y funciones de autenticación
// @AI_CONTEXT: Implementa Singleton Pattern - Un solo estado de autenticación compartido en toda la app
export const AuthProvider = ({ children }) => {
  // @TASK: Estado del usuario autenticado
  // @AI_CONTEXT: null = no autenticado, Object = usuario con datos + JWT token
  const [user, setUser] = useState(null);
  
  // @TASK: Estado de carga para operaciones asíncronas (login/register) y verificación inicial
  const [isLoading, setIsLoading] = useState(true);
  
  // @TASK: Flag de inicialización para evitar renders prematuros
  // @AI_CONTEXT: Previene flash de contenido no autenticado durante hydration desde localStorage
  const [isInitialized, setIsInitialized] = useState(false);

  // @TASK: Effect Hook para restaurar sesión desde localStorage al montar
  // @INPUT: Ninguno (ejecuta solo en mount)
  // @OUTPUT: Restaura user state si existe token válido en localStorage
  // @AI_CONTEXT: Persistencia de sesión entre recargas de página
  // @SECURITY: Valida formato del token antes de restaurar (previene datos corruptos)
  useEffect(() => {
    const savedUser = localStorage.getItem('ml-user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // STEP 1: Verificar que tenga token (formato del backend Spring Boot)
        if (userData.token) {
          setUser(userData);
        } else {
          // STEP 2: Formato antiguo o corrupto, limpiar localStorage
          localStorage.removeItem('ml-user');
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        // STEP 3: JSON inválido, limpiar localStorage
        localStorage.removeItem('ml-user');
      }
    }
    setIsInitialized(true);
    setIsLoading(false);
  }, []);

  // @TASK: Función de autenticación (Login)
  // @INPUT: email (String), password (String) - Credenciales del usuario
  // @OUTPUT: { success: Boolean, error?: String } - Resultado de la operación
  // @AI_CONTEXT: Comunicación con backend Spring Boot /api/auth/login
  // @SECURITY: Password nunca se almacena, solo se envía encriptado via HTTPS. JWT recibido se guarda en localStorage
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // STEP 1: Llamar al backend Spring Boot
      const response = await authService.login(email, password);
      
      if (response.success && response.token) {
        // STEP 2: Mapear respuesta del backend a formato frontend
        // @AI_CONTEXT: Backend usa 'role', frontend normaliza a 'rol'
        const userData = {
          id: response.usuario.id,
          nombre: response.usuario.nombre,
          apellido: response.usuario.apellido,
          email: response.usuario.email,
          nombreUsuario: response.usuario.nombreUsuario,
          rol: response.usuario.role || response.usuario.rol, // Mapeo: backend usa 'role'
          darkMode: response.usuario.darkMode || false,
          token: response.token
        };
        
        // STEP 3: Actualizar estado global y persistir en localStorage
        setUser(userData);
        localStorage.setItem('ml-user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Error en el login' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message || 'Error de conexión con el servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  // @TASK: Función de registro de nuevo usuario
  // @INPUT: userData (Object) - { nombre, apellido, email, password, nombreUsuario }
  // @OUTPUT: { success: Boolean, error?: String } - Resultado de la operación
  // @AI_CONTEXT: Comunicación con backend Spring Boot /api/auth/register, auto-login tras registro exitoso
  // @SECURITY: Password se envía una sola vez y backend lo hashea con BCrypt antes de persistir
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // STEP 1: Llamar al backend Spring Boot
      const response = await authService.register(userData);
      
      if (response.success && response.token) {
        // STEP 2: Login automático después del registro
        const userForSession = {
          id: response.usuario.id,
          nombre: response.usuario.nombre,
          apellido: response.usuario.apellido,
          email: response.usuario.email,
          nombreUsuario: response.usuario.nombreUsuario,
          rol: response.usuario.role || response.usuario.rol, // Mapeo: backend usa 'role'
          darkMode: response.usuario.darkMode || false,
          token: response.token
        };
        
        // STEP 3: Actualizar estado global y persistir
        setUser(userForSession);
        localStorage.setItem('ml-user', JSON.stringify(userForSession));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Error al crear la cuenta' };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message || 'Error de conexión con el servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  // @TASK: Función de cierre de sesión (Logout)
  // @INPUT: Ninguno
  // @OUTPUT: Ninguno (side effects: limpia estado y localStorage)
  // @AI_CONTEXT: Limpieza de sesión local, no requiere llamada a backend (JWT stateless)
  // @SECURITY: Elimina JWT de localStorage inmediatamente
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ml-user');
  };

  // @TASK: Helper para verificar si el usuario actual es administrador
  // @INPUT: Ninguno (usa estado interno user)
  // @OUTPUT: Boolean - true si rol es 'ADMIN'
  // @AI_CONTEXT: Usado para conditional rendering de UI administrativa
  const isAdmin = () => {
    return user && user.rol === 'ADMIN';
  };

  // @TASK: Value object del Context Provider
  // @AI_CONTEXT: Todos los componentes hijos pueden consumir estas propiedades/funciones
  const value = {
    user,              // Estado actual del usuario (null | Object)
    login,             // Función de autenticación
    register,          // Función de registro
    logout,            // Función de cierre de sesión
    isLoading,         // Estado de carga (Boolean)
    isInitialized,     // Flag de inicialización (Boolean)
    isAdmin            // Helper de verificación de rol (Function)
  };

  // @TASK: Renderiza el Provider con el value para consumo de children
  // @AI_CONTEXT: Observer Pattern - Todos los children se re-renderizan cuando value cambia
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
