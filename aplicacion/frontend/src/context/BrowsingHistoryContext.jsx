import { createContext, useState, useEffect, useCallback } from 'react';

export const BrowsingHistoryContext = createContext();

export const BrowsingHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  // Cargar historial desde localStorage al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem('browsingHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error al cargar historial:', error);
        setHistory([]);
      }
    }
  }, []);

  // Agregar producto al historial
  const addToHistory = useCallback((product) => {
    if (!product || !product.id) return;

    setHistory(prevHistory => {
      // Remover producto si ya existe (para evitar duplicados)
      const filteredHistory = prevHistory.filter(item => item.id !== product.id);
      
      // Agregar producto al inicio
      const newHistory = [
        {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          imagen: product.imagenUrl || product.imagen || (product.imagenes && product.imagenes[0]) || '',
          categoria: product.categoria?.nombre || '',
          vendedor: product.vendedor?.nombre || product.vendedor?.username || '',
          visitedAt: new Date().toISOString()
        },
        ...filteredHistory
      ];

      // Limitar a últimos 10 productos
      const limitedHistory = newHistory.slice(0, 10);

      // Guardar en localStorage
      try {
        localStorage.setItem('browsingHistory', JSON.stringify(limitedHistory));
      } catch (error) {
        console.error('Error al guardar historial:', error);
      }

      return limitedHistory;
    });
  }, []); // Sin dependencias - función estable

  // Limpiar todo el historial
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('browsingHistory');
  }, []);

  // Remover un producto específico del historial
  const removeFromHistory = useCallback((productId) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== productId);
      
      try {
        localStorage.setItem('browsingHistory', JSON.stringify(newHistory));
      } catch (error) {
        console.error('Error al actualizar historial:', error);
      }

      return newHistory;
    });
  }, []);

  return (
    <BrowsingHistoryContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        removeFromHistory
      }}
    >
      {children}
    </BrowsingHistoryContext.Provider>
  );
};
