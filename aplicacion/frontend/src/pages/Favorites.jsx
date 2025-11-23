import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { favoritesService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useAuth();
  const { favorites, favoritesCount, isLoading: contextLoading, refreshFavorites } = useFavorites();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!user) {
      navigate('/login');
      return;
    }

    const loadFavorites = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await favoritesService.getFavorites();
        setProducts(data);
      } catch (err) {
        console.error('Error al cargar favoritos:', err);
        setError(err.message || 'Error al cargar los favoritos');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user, navigate, favorites.length]); // Recargar cuando cambie la cantidad de favoritos

  // Estado de carga
  if (isLoading || contextLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary dark:text-text-dark-secondary">Cargando favoritos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center transition-colors duration-300">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Estado vacío
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" />
              <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary">Mis Favoritos</h1>
            </div>
            <p className="text-text-secondary dark:text-text-dark-secondary">
              Guarda tus productos favoritos para acceder a ellos rápidamente
            </p>
          </div>

          {/* Empty state */}
          <div className="bg-surface dark:bg-surface-dark shadow-card rounded-lg p-6 text-center py-16 transition-colors duration-300">
            <Heart className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary mb-2">
              No tienes favoritos aún
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
              Explora nuestros productos y marca tus favoritos con el ícono de corazón
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors inline-flex items-center"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Explorar productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      <section aria-label="Lista de productos favoritos" className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" />
              <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary">Mis Favoritos</h1>
            </div>
            <div className="text-sm text-text-secondary dark:text-text-dark-secondary">
              {favoritesCount} {favoritesCount === 1 ? 'producto' : 'productos'}
            </div>
          </div>
          <p className="text-text-secondary dark:text-text-dark-secondary">
            Tus productos guardados están aquí
          </p>
        </div>

        {/* Stats card */}
        {products.length > 0 && (
          <div className="bg-surface dark:bg-surface-dark shadow-card rounded-lg p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-red-100 dark:border-red-800 mb-8 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-1">Total de favoritos</p>
                <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">{favoritesCount}</p>
              </div>
              <Sparkles className="w-12 h-12 text-red-500" />
            </div>
          </div>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Info adicional */}
        <div className="mt-12 bg-surface dark:bg-surface-dark shadow-card rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-100 dark:border-blue-800 transition-colors duration-300">
          <div className="flex items-start">
            <Heart className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2">
                ¿Sabías que...?
              </h3>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                Tus favoritos se guardan automáticamente en tu cuenta y puedes acceder a ellos desde cualquier dispositivo.
                Recibe notificaciones cuando los productos en tu lista de favoritos tengan descuentos especiales.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Favorites;
