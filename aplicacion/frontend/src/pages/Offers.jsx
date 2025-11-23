import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, ArrowLeft, Tag, Percent } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

const Offers = () => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const offersData = await productService.getOffers();
        
        // Ya vienen ordenados por descuento descendente desde el backend
        setProducts(offersData);

      } catch (err) {
        console.error('Error loading offers:', err);
        setError(err.message || 'Error al cargar las ofertas');
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error al cargar ofertas</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="ml-button-primary"
            >
              Reintentar
            </button>
            <Link
              to="/"
              className="ml-button-secondary"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header de ofertas */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-blue-200 mb-6 transition-colors duration-200"
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          
          <div className="flex items-center gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
              <TrendingUp className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">
                  Ofertas Especiales
                </h1>
                <Tag className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
              <p className="text-blue-100 dark:text-blue-200 text-lg">
                {products.length} {products.length === 1 ? 'producto en oferta' : 'productos en oferta'}
              </p>
              <p className="text-blue-200 text-sm mt-1 font-medium">
                ¡Aprovechá los mejores descuentos!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos en oferta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Percent className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No hay ofertas disponibles
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              Por el momento no tenemos productos en oferta
            </p>
            <p className="text-gray-500 dark:text-gray-500 mb-8">
              Volvé pronto para descubrir nuevas promociones
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/categorias"
                className="ml-button-secondary"
              >
                Ver categorías
              </Link>
              <Link
                to="/"
                className="ml-button-primary"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Productos destacados
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Ordenados por mayor descuento
                </p>
              </div>
              
              <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-full px-4 py-2">
                <p className="text-blue-700 dark:text-blue-300 font-bold flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  {products.length} ofertas activas
                </p>
              </div>
            </div>

            {/* Stats de ofertas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Descuento máximo</p>
                    <p className="text-3xl font-bold mt-1">
                      {products.length > 0 ? Math.round(products[0].descuento) : 0}%
                    </p>
                  </div>
                  <Percent className="w-12 h-12 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total de ofertas</p>
                    <p className="text-3xl font-bold mt-1">{products.length}</p>
                  </div>
                  <Tag className="w-12 h-12 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-teal-500 dark:from-green-700 dark:to-teal-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Ahorrá hasta</p>
                    <p className="text-3xl font-bold mt-1">
                      ${products.length > 0 && products[0].precioOriginal 
                        ? Math.round(products[0].precioOriginal - products[0].precio).toLocaleString('es-AR')
                        : 0}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-200" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <ProductCard
                    product={product}
                    className="h-full shadow-xl border-2 border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Offers;
