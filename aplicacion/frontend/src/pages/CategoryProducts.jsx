import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService, categoryService } from '../services/api';

const CategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar categoría y productos en paralelo
        const [categoryData, productsData] = await Promise.all([
          categoryService.getById(id),
          productService.getByCategory(id)
        ]);

        setCategory(categoryData);
        
        // Ordenar productos alfabéticamente según consigna TPO
        const sortedProducts = productsData.sort((a, b) => 
          a.nombre.localeCompare(b.nombre)
        );
        
        setProducts(sortedProducts);

      } catch (err) {
        console.error('Error loading category products:', err);
        setError(err.message || 'Error al cargar los productos de la categoría');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCategoryProducts();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2">Error al cargar</h2>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Reintentar
            </button>
            <Link
              to="/"
              className="bg-secondary hover:bg-secondary-dark text-text-primary font-bold py-2 px-4 rounded transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      {/* Header de categoría */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-secondary mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          
          <div className="flex items-center gap-6">
            {category?.imagenUrl && (
              <div className="bg-surface dark:bg-surface-dark rounded-2xl p-4 shadow-lg transition-colors duration-300">
                <img
                  src={category.imagenUrl || category.imagen}
                  alt={category.nombre}
                  className="w-24 h-24 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
            
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {category?.nombre || 'Categoría'}
              </h1>
              <p className="text-blue-100 dark:text-blue-200 text-lg">
                {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
              No hay productos en esta categoría
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-8 text-lg">
              Explorá otras categorías o volvé al inicio
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/categorias"
                className="bg-secondary hover:bg-secondary-dark text-text-primary font-bold py-2 px-4 rounded transition-colors"
              >
                Ver todas las categorías
              </Link>
              <Link
                to="/"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">
                  Resultados
                </h2>
                <p className="text-text-secondary dark:text-text-dark-secondary mt-1">
                  Mostrando {products.length} productos
                </p>
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
                    className="h-full shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary"
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

export default CategoryProducts;
