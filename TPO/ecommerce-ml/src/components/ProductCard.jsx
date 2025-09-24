import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, Truck, Shield } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { formatPrice, calculateDiscount } from '../services/api';

const ProductCard = ({ product, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirigir al login si no está autenticado
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const discount = calculateDiscount(product.precioOriginal, product.precio);
  const hasDiscount = discount > 0;

  return (
    <div className={`ml-card group ${className}`}>
      <Link to={`/producto/${product.id}`} className="block">
        {/* Imagen del producto */}
        <div className="relative overflow-hidden">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Badge de descuento */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              {discount}% OFF
            </div>
          )}

          {/* Botón de favoritos */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Badge de envío gratis */}
          {product.envioGratis && (
            <div className="absolute bottom-2 left-2 bg-ml-green text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
              <Truck className="w-3 h-3 mr-1" />
              Envío gratis
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-4">
          {/* Título */}
          <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-ml-blue transition-colors">
            {product.nombre}
          </h3>

          {/* Precios */}
          <div className="mb-2">
            {hasDiscount && (
              <span className="text-xs text-gray-500 line-through mr-2">
                {formatPrice(product.precioOriginal)}
              </span>
            )}
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(product.precio)}
            </span>
          </div>

          {/* Calificación */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-3 h-3 ${
                    index < Math.floor(product.calificacion)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.valoraciones})
            </span>
          </div>

          {/* Características adicionales */}
          <div className="flex items-center space-x-2 mb-3 text-xs text-gray-600">
            {product.mercadoLiderPlus && (
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1 text-ml-blue" />
                <span>ML Plus</span>
              </div>
            )}
            
            {product.stock > 0 ? (
              <span className="text-ml-green">
                {product.stock > 10 ? 'Disponible' : `Últimos ${product.stock}`}
              </span>
            ) : (
              <span className="text-red-500">Sin stock</span>
            )}
          </div>

          {/* Vendedor */}
          <div className="text-xs text-gray-500 mb-3">
            por {product.vendedor}
          </div>

          {/* Botón de agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading || product.stock === 0}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isLoading
                ? 'bg-ml-blue opacity-75 text-white cursor-wait'
                : 'ml-button-primary'
            }`}
          >
            {isLoading ? 'Agregando...' : product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
