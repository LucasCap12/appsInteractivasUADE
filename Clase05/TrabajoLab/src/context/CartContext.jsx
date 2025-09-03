// CartContext.jsx - Contexto para manejar el estado global del carrito
import React, { useState, useContext, createContext } from 'react';

// 1. CREACIÓN DEL CONTEXTO
// Creamos el contexto que compartirá la información del carrito entre componentes
const CartContext = createContext();

// 2. CUSTOM HOOK para consumir el contexto
// Este hook facilita el uso del contexto en otros componentes
export function useCart() {
  const context = useContext(CartContext);
  
  // Validación de seguridad: el hook solo puede usarse dentro del Provider
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  
  return context;
}

// 3. PROVIDER COMPONENT
// Este componente envuelve la aplicación y provee el estado del carrito
export function CartProvider({ children }) {
  // Estado del carrito usando useState
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Verificar si el producto ya existe en el carrito
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si existe, incrementar la cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    console.log(`${product.nombre} agregado al carrito!`);
  };

  // Función para remover un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    console.log('Producto removido del carrito');
  };

  // Función para obtener el total de items en el carrito
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Función para obtener el precio total del carrito
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    setCartItems([]);
    console.log('Carrito limpiado');
  };

  // Valor que se compartirá con todos los componentes consumidores
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    clearCart
  };

  // Renderizar el Provider con el valor compartido
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
