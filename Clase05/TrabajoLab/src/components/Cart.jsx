// Cart.jsx - Componente que muestra el carrito de compras
import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  // Obtener estado y funciones del carrito desde el contexto
  const { 
    cartItems, 
    removeFromCart, 
    getTotalItems, 
    getTotalPrice, 
    clearCart 
  } = useCart();

  // Función para manejar la eliminación de un producto
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  // Función para manejar el vaciado del carrito
  const handleClearCart = () => {
    if (cartItems.length > 0) {
      const confirmed = window.confirm('¿Estás seguro de que quieres vaciar el carrito?');
      if (confirmed) {
        clearCart();
      }
    }
  };

  return (
    <div className="cart-sidebar">
      <div className="cart-container">
        <div className="cart-header">
          <span>🛒</span>
          <h3>Carrito de Compras</h3>
        </div>
        
        <div className="cart-content">
          {/* Resumen del carrito */}
          <div className="cart-summary">
            <div className="cart-count">
              Items: {getTotalItems()}
            </div>
            <div className="cart-total">
              Total: ${getTotalPrice().toFixed(2)}
            </div>
          </div>

          {/* Lista de productos en el carrito */}
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              El carrito está vacío
            </div>
          ) : (
            <>
              <ul className="cart-items">
                {cartItems.map(item => (
                  <li key={item.id} className="cart-item">
                    <div className="item-info">
                      <div className="item-name">
                        {item.nombre}
                        {item.quantity > 1 && (
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: '#666', 
                            marginLeft: '0.5rem' 
                          }}>
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="item-price">
                        ${(item.precio * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Eliminar del carrito"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              
              {/* Botón para vaciar carrito */}
              <button 
                onClick={handleClearCart}
                style={{
                  width: '100%',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginTop: '1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#c0392b'}
                onMouseOut={(e) => e.target.style.background = '#e74c3c'}
              >
                🗑️ Vaciar Carrito
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
