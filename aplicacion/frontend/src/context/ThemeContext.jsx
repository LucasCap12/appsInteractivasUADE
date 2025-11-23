// @TASK: Theme Context Provider - Gestión global de preferencia de tema oscuro
// @AI_CONTEXT: Implementa Observer Pattern para dark mode con auto-activación
// @ACCESSIBILITY: Mantiene contraste WCAG 2.1 AA en ambos temas
// @PERSISTENCE: localStorage (anónimos) + backend (autenticados)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/api';

const ThemeContext = createContext();

export { ThemeContext };

// @TASK: Custom Hook para acceder al contexto de tema
// @OUTPUT: { darkMode, toggleTheme }
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

// @TASK: Provider Component - Proveedor de contexto de tema para árbol de componentes
// @INPUT: children (React.ReactNode)
// @OUTPUT: Context Provider con estado y función de toggle
// @AI_CONTEXT: Boolean simple (true = dark, false = light) con auto-activación
export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  // @TASK: Estado del tema - true = oscuro, false = claro
  const [darkMode, setDarkMode] = useState(false);

  // @TASK: Effect Hook para auto-activar tema al montar o cambiar usuario
  // @AI_CONTEXT: AUTO-ACTIVACIÓN sin input del usuario
  // STEP 1: Usuario autenticado → usar user.darkMode del backend
  // STEP 2: Usuario NO autenticado → usar localStorage
  useEffect(() => {
    if (user?.darkMode !== undefined) {
      // Usuario autenticado: cargar preferencia del backend
      setDarkMode(user.darkMode);
      applyTheme(user.darkMode);
    } else {
      // Usuario NO autenticado: cargar localStorage
      const savedTheme = localStorage.getItem('ml-dark-mode');
      const isDark = savedTheme === 'true';
      setDarkMode(isDark);
      applyTheme(isDark);
    }
  }, [user]);

  // @TASK: Aplicar tema al documento HTML
  // @INPUT: isDark (Boolean) - true para oscuro, false para claro
  // @OUTPUT: Agrega/remueve clase 'dark' en <html>
  // @AI_CONTEXT: Tailwind usa clase .dark para activar variantes dark:
  const applyTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // @TASK: Toggle de tema - Solo cuando usuario hace click en botón
  // @OUTPUT: Cambia estado, actualiza localStorage, guarda en backend si autenticado
  // @ACCESSIBILITY: Mantiene contraste WCAG AA en ambos temas
  const toggleTheme = async () => {
    const newDarkMode = !darkMode;
    
    // STEP 1: Actualizar estado local
    setDarkMode(newDarkMode);
    applyTheme(newDarkMode);
    
    // STEP 2: Persistir en localStorage (para usuarios no autenticados)
    localStorage.setItem('ml-dark-mode', String(newDarkMode));
    
    // STEP 3: Guardar en backend si usuario está autenticado
    if (user) {
      try {
        await userService.updateProfile({ darkMode: newDarkMode });
      } catch (error) {
        console.error('Error al guardar preferencia de tema:', error);
        // No mostramos error al usuario, fallback a localStorage funciona
      }
    }
  };

  // @TASK: Value object del Context Provider
  const value = {
    darkMode,      // Estado actual (Boolean)
    toggleTheme    // Función para cambiar tema (Function)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
