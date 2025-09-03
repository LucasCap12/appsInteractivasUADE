// ProductList.jsx - Componente que lista productos y permite agregarlos al carrito
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ProductList = () => {
  // Estados locales usando useState
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener función para agregar al carrito del contexto
  const { addToCart } = useCart();

  // useEffect para cargar productos desde la API al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Llamada a la API usando fetch
        const response = await fetch('http://localhost:3001/productos');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProductos(data);
        
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Asegúrate de que json-server esté ejecutándose.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); // Array vacío significa que se ejecuta solo al montar el componente

  // Función para manejar la adición al carrito
  const handleAddToCart = (producto) => {
    addToCart(producto);
  };

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>⚠️ Error</h3>
        <p>{error}</p>
        <p>Para ejecutar el servidor: <code>npm run server</code></p>
      </div>
    );
  }

  if (productos.length === 0) {
    return <div className="loading">No hay productos disponibles</div>;
  }

  return (
    <div className="products-section">
      <h2 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
        Catálogo de Productos ({productos.length} productos)
      </h2>
      
      <div className="products-grid">
        {productos.map(producto => (
          <div key={producto.id} className="product-card">
            <img 
              src={producto.imagen} 
              alt={producto.nombre}
              className="product-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
              }}
            />
            
            <div className="product-info">
              <h3 className="product-name">{producto.nombre}</h3>
              
              <p className="product-description">{producto.descripcion}</p>
              
              <div className="product-price">${producto.precio.toFixed(2)}</div>
              
              <p className="product-stock">
                Stock disponible: {producto.stock} unidades
              </p>
              
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(producto)}
                disabled={producto.stock === 0}
              >
                {producto.stock > 0 ? '🛒 Agregar al Carrito' : 'Sin Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
