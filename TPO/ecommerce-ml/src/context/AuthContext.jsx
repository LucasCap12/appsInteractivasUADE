import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Verificar si hay una sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('ml-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('ml-user');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Simulación de login - en producción sería una llamada a la API
      const response = await fetch('http://localhost:3002/usuarios');
      const usuarios = await response.json();
      
      const usuario = usuarios.find(u => u.email === email && u.password === password);
      
      if (usuario) {
        const userData = {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          nombreUsuario: usuario.nombreUsuario
        };
        
        setUser(userData);
        localStorage.setItem('ml-user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Verificar si el email ya existe
      const response = await fetch('http://localhost:3002/usuarios');
      const usuarios = await response.json();
      
      const existingUser = usuarios.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'El email ya está registrado' };
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        nombre: userData.nombre,
        apellido: userData.apellido,
        nombreUsuario: userData.nombreUsuario,
        email: userData.email,
        password: userData.password,
        fechaRegistro: new Date().toISOString(),
        activo: true
      };

      const createResponse = await fetch('http://localhost:3002/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (createResponse.ok) {
        const userForSession = {
          id: newUser.id,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          email: newUser.email,
          nombreUsuario: newUser.nombreUsuario
        };
        
        setUser(userForSession);
        localStorage.setItem('ml-user', JSON.stringify(userForSession));
        return { success: true };
      } else {
        return { success: false, error: 'Error al crear la cuenta' };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ml-user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
