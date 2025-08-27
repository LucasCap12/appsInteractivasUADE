// Componente ProductCard para mostrar productos
import React, { useState } from 'react';
import { Heart, Star, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, variant = 'default' }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const getDiscountedPrice = () => {
    if (product.discount) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Variante lista (para resultados de búsqueda)
  if (variant === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 flex-shrink-0">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
            )}
            <img
              src={product.image}
              alt={product.title}
              onLoad={() => setImageLoading(false)}
              className={`w-full h-full object-cover rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            />
            <button
              onClick={handleLike}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
            >
              <Heart 
                size={16} 
                className={isLiked ? 'text-red-500 fill-current' : 'text-gray-400'} 
              />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2">
              {product.title}
            </h3>
            
            <div className="flex items-center mb-2">
              {product.rating && (
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating} ({product.reviews || 0})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              {product.discount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(getDiscountedPrice())}
              </span>
              {product.discount && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              {product.freeShipping && (
                <div className="flex items-center">
                  <Truck size={16} className="text-green-600 mr-1" />
                  <span className="text-green-600">Envío gratis</span>
                </div>
              )}
              {product.fullRefund && (
                <div className="flex items-center">
                  <Shield size={16} className="text-blue-600 mr-1" />
                  <span className="text-blue-600">Devolución gratis</span>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Variante tarjeta (para grillas de productos)
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative">
        {imageLoading && (
          <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={product.image}
          alt={product.title}
          onLoad={() => setImageLoading(false)}
          className={`w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
        
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart 
            size={18} 
            className={isLiked ? 'text-red-500 fill-current' : 'text-gray-400'} 
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2">
          {product.title}
        </h3>
        
        {product.rating && (
          <div className="flex items-center mb-2">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        <div className="mb-2">
          {product.discount && (
            <span className="text-sm text-gray-500 line-through block">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(getDiscountedPrice())}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-600 mb-3">
          {product.freeShipping && (
            <div className="flex items-center">
              <Truck size={14} className="text-green-600 mr-1" />
              <span className="text-green-600">Envío gratis</span>
            </div>
          )}
          {product.fullRefund && (
            <div className="flex items-center">
              <Shield size={14} className="text-blue-600 mr-1" />
              <span className="text-blue-600">Devolución gratis</span>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
