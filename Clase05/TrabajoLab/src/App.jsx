// App.jsx - Componente principal de la aplicación
import React from 'react';
import { CartProvider } from './context/CartContext';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  return (
    // Envolvemos toda la aplicación con el CartProvider para compartir el estado del carrito
    <CartProvider>
      <div className="App">
        {/* Header de la aplicación */}
        <header className="header">
          <div className="container">
            <h1>🛍️ E-Commerce Lab</h1>
            <p>Trabajo de Laboratorio - React Hooks (useState, useEffect, useContext)</p>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="container">
          <div className="main-content">
            {/* Lista de productos - Usa useState y useEffect para cargar datos */}
            <ProductList />
            
            {/* Carrito de compras - Usa useContext para acceder al estado global */}
            <Cart />
          </div>
        </main>

        {/* Footer informativo */}
        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem 0', 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e9ecef',
          color: '#6c757d'
        }}>
          <div className="container">
            <p>
              <strong>Tecnologías utilizadas:</strong> React • useState • useEffect • useContext • JSON Server
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Aplicaciones Interactivas - Ingeniería en Informática
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
