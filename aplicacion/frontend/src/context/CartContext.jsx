// @TASK: Context Provider para estado global del carrito de compras con persistencia por usuario
// @AI_CONTEXT: Observer Pattern - Componentes suscritos se re-renderizan cuando cartItems cambia
// @AI_CONTEXT: localStorage persistence PER USER - key 'ml-cart-{userId}' evita colisión entre usuarios
// @AI_CONTEXT: useCallback memoiza funciones para evitar re-renders innecesarios en componentes hijos
// @SECURITY: Carrito aislado por usuario (user.id del JWT). Limpiar carrito en logout
// @ACCESSIBILITY: Integrado con AnnouncementContext para notificaciones screen reader (aria-live)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useAnnouncement } from './AnnouncementContext';

const CartContext = createContext();

export { CartContext };

// @TASK: Custom Hook para consumir CartContext con validación
// @OUTPUT: Objeto con cartItems y métodos (addToCart, removeFromCart, updateQuantity, etc.)
// @AI_CONTEXT: Hook Pattern - Enforce uso dentro de Provider (throw error si contexto es null)
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

// @TASK: Provider Component - Envuelve árbol de componentes para proveer estado global del carrito
// @INPUT: children (ReactNode) - Componentes hijos que consumirán el contexto
// @AI_CONTEXT: Singleton Pattern per User - Un carrito por usuario, almacenado en localStorage
// @AI_CONTEXT: Dependency Injection - Inyecta user (AuthContext) y announce (AnnouncementContext)
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const { announce } = useAnnouncement();

  // @TASK: useEffect - Hydration del carrito desde localStorage al montar o cambiar usuario
  // @INPUT: Depende de [user] - Se ejecuta cuando usuario hace login/logout
  // @AI_CONTEXT: localStorage key pattern 'ml-cart-{userId}' permite múltiples usuarios en mismo navegador
  // @SECURITY: Carrito se limpia si user es null (logout). Evita mostrar carrito de usuario anterior
  useEffect(() => {
    if (user) {
      // STEP 1: Intentar cargar carrito guardado del usuario actual
      const savedCart = localStorage.getItem(`ml-cart-${user.id}`);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error al cargar carrito:', error);
          setCartItems([]);
        }
      }
    } else {
      // STEP 2: Si no hay usuario (logout), limpiar carrito
      setCartItems([]);
    }
  }, [user]);

  // @TASK: useEffect - Sincronización automática del carrito a localStorage
  // @INPUT: Depende de [cartItems, user] - Se ejecuta cada vez que el carrito cambia
  // @AI_CONTEXT: Persistence Strategy - Guardar en cada cambio (addToCart, removeFromCart, updateQuantity)
  useEffect(() => {
    if (user) {
      localStorage.setItem(`ml-cart-${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // @TASK: addToCart - Agregar producto al carrito o incrementar cantidad si ya existe
  // @INPUT: product (ProductDTO) - Objeto producto con id, nombre, precio, imagenUrl
  // @INPUT: quantity (number, default 1) - Cantidad a agregar
  // @OUTPUT: Actualiza cartItems state (trigger re-render en componentes suscritos)
  // @AI_CONTEXT: Immutable update pattern - Usar map/spread para mantener inmutabilidad de React state
  // @ACCESSIBILITY: announce() notifica cambios para screen readers (ARIA live region)
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      // STEP 1: Si producto ya existe, incrementar cantidad
      if (existingItem) {
        announce(`Cantidad actualizada: ${product.nombre || 'Producto'} (${existingItem.quantity + quantity})`);
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // STEP 2: Si es nuevo, agregar al final del array
      announce(`Producto agregado al carrito: ${product.nombre || 'Producto'}`);
      
      // Normalizar imagenUrl (backend puede enviar 'imagen' o 'imagenUrl')
      const cartItem = {
        ...product,
        imagenUrl: product.imagenUrl || product.imagen,
        quantity
      };
      
      return [...prevItems, cartItem];
    });
  }, [announce]);

  // @TASK: removeFromCart - Eliminar producto del carrito completamente
  // @INPUT: productId (number) - ID del producto a eliminar
  // @OUTPUT: Actualiza cartItems state (filter sin el producto eliminado)
  // @AI_CONTEXT: Immutable update - Array.filter() crea nuevo array sin el item
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(i => i.id === productId);
      if (item) {
        announce(`Producto eliminado del carrito: ${item.nombre || 'Producto'}`);
      }
      return prevItems.filter(i => i.id !== productId);
    });
  }, [announce]);

  // @TASK: updateQuantity - Actualizar cantidad de un producto en el carrito
  // @INPUT: productId (number) - ID del producto
  // @INPUT: newQuantity (number) - Nueva cantidad (si <= 0, elimina producto)
  // @OUTPUT: Actualiza cartItems state con nueva cantidad
  // @AI_CONTEXT: Validation logic - Cantidad <= 0 delega a removeFromCart (DRY principle)
  const updateQuantity = useCallback((productId, newQuantity) => {
    // STEP 1: Si cantidad es 0 o negativa, eliminar producto completamente
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // STEP 2: Actualizar cantidad (immutable update con map)
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          announce(`Cantidad actualizada: ${item.nombre || 'Producto'} (${newQuantity})`);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }, [removeFromCart, announce]);

  // @TASK: clearCart - Vaciar carrito completamente
  // @OUTPUT: Resetea cartItems a array vacío
  // @AI_CONTEXT: Usado en Checkout exitoso o cuando usuario cierra sesión
  const clearCart = useCallback(() => {
    announce('Carrito vaciado');
    setCartItems([]);
  }, [announce]);

  // @TASK: getCartTotal - Calcular precio total del carrito
  // @OUTPUT: number - Suma de (precio × cantidad) de todos los items
  // @AI_CONTEXT: Memoizado con useCallback (dependencia [cartItems]) - Evita recálculos innecesarios
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  }, [cartItems]);

  // @TASK: getCartItemsCount - Calcular cantidad total de items (suma de cantidades)
  // @OUTPUT: number - Total de unidades en carrito
  // @AI_CONTEXT: Usado en badge del header ("Carrito (3)")
  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // @TASK: getTotalItems - Alias de getCartItemsCount (duplicado por compatibilidad)
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // @TASK: getTotalPrice - Alias de getCartTotal (duplicado por compatibilidad)
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0);
  }, [cartItems]);

  // @TASK: isInCart - Verificar si un producto está en el carrito
  // @INPUT: productId (number) - ID del producto a verificar
  // @OUTPUT: boolean - true si producto está en carrito
  // @AI_CONTEXT: Usado para mostrar botón "Agregar" vs "Ya en carrito" en ProductCard
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);

  // @TASK: getItemQuantity - Obtener cantidad de un producto específico en carrito
  // @INPUT: productId (number) - ID del producto
  // @OUTPUT: number - Cantidad en carrito (0 si no está)
  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
