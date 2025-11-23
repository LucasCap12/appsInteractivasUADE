import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import { productService, categoryService } from '../services/api';
import { useAnnouncement } from '../context/AnnouncementContext';
import { getCategoryIconComponent } from '../utils/constants';

// @TASK: Página principal (Landing Page) que muestra categorías, productos destacados y ofertas
// @AI_CONTEXT: Container Component que orquesta la carga de datos inicial (Parallel Fetching)
// @SECURITY: No requiere autenticación (Acceso público)
// @ACCESSIBILITY: Uso de aria-labels en enlaces y botones. Soporte de navegación por teclado.
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { announce } = useAnnouncement();

  // @TASK: Carga inicial de datos (Productos, Categorías)
  // @AI_CONTEXT: Promise.all para optimizar tiempo de carga (Parallel Execution)
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        announce('Cargando productos...');
        
        // Cargar datos en paralelo
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getAll({ limit: 12 }),
          categoryService.getActive()
        ]);

        // Ordenar productos alfabéticamente según consigna TPO
        const sortedProducts = productsResponse.sort((a, b) => 
          a.nombre.localeCompare(b.nombre)
        );

        setFeaturedProducts(sortedProducts);
        setCategories(categoriesResponse);
        
        // Filtrar productos con descuento para la sección de ofertas
        const productsWithDiscount = sortedProducts.filter(
          product => product.precioOriginal && product.precioOriginal > product.precio
        );
        setOffers(productsWithDiscount.slice(0, 6));
        
        announce(`${sortedProducts.length} productos cargados`);

      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Error al cargar los datos');
        announce('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [announce]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Categorías Populares
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = getCategoryIconComponent(category.nombre);
            return (
              <Link
                to={`/categoria/${category.id}`}
                key={category.id}
                className="bg-surface dark:bg-surface-dark rounded-lg shadow-card hover:shadow-card-hover p-6 transition-all duration-300 cursor-pointer block group border border-transparent hover:border-primary/20"
                aria-label={`Ver productos de la categoría ${category.nombre}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {/* Icon placeholder or dynamic icon */}
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300 transform group-hover:translate-x-1" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-2 group-hover:text-primary transition-colors">{category.nombre}</h3>
                <p className="text-text-secondary dark:text-text-dark-secondary text-sm">{category.productos?.length || 0} productos</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-surface dark:bg-surface-dark py-12 transition-colors duration-300 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary flex items-center gap-2">
              <Star className="w-6 h-6 text-secondary" fill="currentColor" />
              Productos Destacados
            </h2>
            <Link to="/productos" className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-text-secondary dark:text-text-dark-secondary">
              No se encontraron productos destacados.
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-background dark:bg-background-dark py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary dark:bg-primary-dark text-white rounded-lg p-8 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none"></div>
            <h2 className="text-3xl font-bold mb-4 relative z-10">¡Suscríbete a nuestro newsletter!</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto relative z-10">
              Recibe las mejores ofertas y novedades directamente en tu correo electrónico.
            </p>
            <div className="max-w-md mx-auto flex gap-4 relative z-10">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-md text-text-primary dark:text-text-dark-primary bg-surface dark:bg-surface-dark border border-transparent focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
              />
              <button className="bg-secondary hover:bg-secondary-dark text-text-primary font-bold px-6 py-3 rounded-md transition-colors shadow-md">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
