import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAnnouncement } from './AnnouncementContext';
import { favoritesService } from '../services/api';

const FavoritesContext = createContext();

export { FavoritesContext };

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user, isInitialized } = useAuth();
  const { announce } = useAnnouncement();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar favoritos desde el backend cuando el usuario está autenticado
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isInitialized) return;
      
      if (user) {
        setIsLoading(true);
        try {
          const data = await favoritesService.getFavorites();
          // El backend retorna ProductoDTO[], extraer solo los IDs
          const favoriteIds = data.map(product => product.id);
          setFavorites(favoriteIds);
        } catch (error) {
          console.error('Error al cargar favoritos:', error);
          setFavorites([]);
        } finally {
          setIsLoading(false);
          setIsInitialLoad(false);
        }
      } else {
        // Usuario no autenticado, limpiar favoritos
        setFavorites([]);
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadFavorites();
  }, [user, isInitialized]);

  /**
   * Verifica si un producto es favorito
   */
  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  /**
   * Agrega un producto a favoritos
   */
  const addFavorite = async (productId) => {
    if (!user) {
      console.warn('Usuario no autenticado');
      return { success: false, error: 'Debes iniciar sesión para agregar favoritos' };
    }

    // Optimistic update
    setFavorites(prev => [...prev, productId]);
    announce('Agregado a favoritos');

    try {
      await favoritesService.addFavorite(productId);
      return { success: true };
    } catch (error) {
      // Revertir en caso de error
      setFavorites(prev => prev.filter(id => id !== productId));
      announce('Error al agregar a favoritos');
      console.error('Error al agregar favorito:', error);
      return { success: false, error: error.message || 'Error al agregar favorito' };
    }
  };

  /**
   * Elimina un producto de favoritos
   */
  const removeFavorite = async (productId) => {
    if (!user) {
      console.warn('Usuario no autenticado');
      return { success: false, error: 'Debes iniciar sesión' };
    }

    // Optimistic update
    setFavorites(prev => prev.filter(id => id !== productId));
    announce('Eliminado de favoritos');

    try {
      await favoritesService.removeFavorite(productId);
      return { success: true };
    } catch (error) {
      // Revertir en caso de error
      setFavorites(prev => [...prev, productId]);
      announce('Error al eliminar de favoritos');
      console.error('Error al eliminar favorito:', error);
      return { success: false, error: error.message || 'Error al eliminar favorito' };
    }
  };

  /**
   * Toggle favorito (agregar o eliminar)
   */
  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      return await removeFavorite(productId);
    } else {
      return await addFavorite(productId);
    }
  };

  /**
   * Recarga los favoritos desde el backend
   */
  const refreshFavorites = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await favoritesService.getFavorites();
      const favoriteIds = data.map(product => product.id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error al recargar favoritos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    favorites,
    isLoading,
    isInitialLoad,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
