import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, Truck, Shield } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNotification } from '../context/NotificationContext';
import { formatPrice, calculateDiscount } from '../services/api';

const ProductCard = ({ product, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { success, warning } = useNotification();
  const navigate = useNavigate();

  const productIsFavorite = isFavorite(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirigir al login si no está autenticado
      navigate('/login');
      return;
    }

    // Validar que el usuario no esté comprando sus propios productos
    if (product.vendedor?.id === user.id) {
      warning('No puedes comprar tus propios productos');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product);
      success(`${product.nombre} agregado al carrito`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirigir al login si no está autenticado
      navigate('/login');
      return;
    }

    setIsFavoriteLoading(true);
    try {
      await toggleFavorite(product.id);
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // Usar precioFinal del backend si está disponible, sino calcular
  const precioFinal = product.precioFinal || product.precio;
  const precioOriginal = product.precio;
  const hasDiscount = product.descuento && product.descuento > 0;

  return (
    <div className={`ml-card group flex flex-col h-full ${className}`}>
      <Link to={`/producto/${product.id}`} className="flex flex-col flex-grow">
        {/* Imagen del producto */}
        <div className="relative overflow-hidden aspect-square bg-white dark:bg-gray-700 rounded-t-lg flex-shrink-0">
          <img
            src={product.imagenUrl || product.imagen}
            alt={`Imagen de ${product.nombre}`}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/placeholder.svg';
              e.target.alt = 'Imagen no disponible';
            }}
          />
          
          {/* Badge de descuento */}
          {hasDiscount ? (
            <div className="absolute top-2 left-2 bg-secondary text-text-primary px-2 py-1 rounded text-xs font-bold shadow-sm z-10">
              {product.descuento}% OFF
            </div>
          ) : null}

          {/* Badge de cuotas sin interés */}
          {product.cuotasSinInteres > 0 ? (
            <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded text-xs font-bold shadow-sm z-10" style={{ top: hasDiscount ? '2.5rem' : '0.5rem' }}>
              {product.cuotasSinInteres}x sin interés
            </div>
          ) : null}

          {/* Botón de favoritos */}
          <button
            onClick={handleToggleFavorite}
            disabled={isFavoriteLoading}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 z-20 ${
              productIsFavorite 
                ? 'bg-white text-red-500 shadow-md scale-110' 
                : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-md'
            } ${isFavoriteLoading ? 'opacity-50 cursor-wait' : ''}`}
            title={productIsFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-label={productIsFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`w-5 h-5 ${productIsFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>

          {/* Badge de envío gratis */}
          {product.envioGratis ? (
            <div className="absolute bottom-2 left-2 bg-accent/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold flex items-center shadow-sm z-10">
              <Truck className="w-3 h-3 mr-1 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">Envío gratis</span>
            </div>
          ) : null}
        </div>

        {/* Información del producto */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Título */}
          <h3 className="text-sm font-normal text-text-primary dark:text-text-dark-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors h-10">
            {product.nombre}
          </h3>

          {/* Precios */}
          <div className="mb-1 flex flex-col">
            {hasDiscount ? (
              <span className="text-xs text-text-secondary dark:text-text-dark-secondary line-through mb-0.5">
                {formatPrice(precioOriginal)}
              </span>
            ) : <div className="h-4"></div>}
            <div className="flex items-center gap-2">
              <span className="text-xl font-light text-text-primary dark:text-text-dark-primary">
                {formatPrice(precioFinal)}
              </span>
              {hasDiscount ? (
                <span className="text-sm text-accent font-medium">
                  {product.descuento}% OFF
                </span>
              ) : null}
            </div>
          </div>

          {/* Cuotas sin interés */}
          {product.cuotasSinInteres > 0 ? (
            <div className="text-xs text-accent font-medium mb-2">
              Mismo precio en {product.cuotasSinInteres} cuotas
            </div>
          ) : <div className="h-4 mb-2"></div>}

          {/* Calificación */}
          {(product.rating > 0 || product.calificacion > 0) ? (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-3 h-3 ${
                      index < Math.floor(product.rating || product.calificacion || 0)
                        ? 'text-primary fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-xs text-text-secondary dark:text-text-dark-secondary ml-1">
                ({product.reviews || product.valoraciones || 0})
              </span>
            </div>
          ) : <div className="h-3 mb-3"></div>}

          {/* Vendedor */}
          {product.vendedor ? (
            <div className="text-xs text-text-secondary dark:text-text-dark-secondary mb-3 mt-auto">
              Por {typeof product.vendedor === 'string' 
                ? product.vendedor 
                : `${product.vendedor.nombre} ${product.vendedor.apellido}`}
            </div>
          ) : null}
        </div>
      </Link>
      
      {/* Botón de agregar al carrito - Fuera del Link para evitar anidamiento ilegal */}
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={isLoading || product.stock === 0}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            product.stock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : isLoading
              ? 'bg-primary/70 text-white cursor-wait'
              : 'ml-button-primary'
          }`}
          aria-label={`Agregar ${product.nombre} al carrito`}
        >
          {isLoading ? 'Agregando...' : product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
