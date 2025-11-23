import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, AlertCircle, ArrowLeft, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';
import { useAnnouncement } from '../context/AnnouncementContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { announce } = useAnnouncement();

  useEffect(() => {
    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        announce('Buscando productos...');
        
        if (!query.trim()) {
          // Si no hay término de búsqueda, mostrar todos los productos
          const allProducts = await productService.getAll();
          const sortedProducts = allProducts.sort((a, b) => 
            a.nombre.localeCompare(b.nombre)
          );
          setProducts(sortedProducts);
          announce(`${sortedProducts.length} productos encontrados`);
        } else {
          // Buscar productos por término
          const results = await productService.search(query);
          
          // Ordenar alfabéticamente según consigna TPO
          const sortedResults = results.sort((a, b) => 
            a.nombre.localeCompare(b.nombre)
          );
          
          setProducts(sortedResults);
          announce(`${sortedResults.length} productos encontrados para "${query}"`);
        }

      } catch (err) {
        console.error('Error searching products:', err);
        setError(err.message || 'Error al buscar productos');
        announce('Error al buscar productos');
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query, announce]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Buscando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2">Error en la búsqueda</h2>
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
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
            Resultados de búsqueda: "{query}"
          </h1>
          <p className="text-text-secondary dark:text-text-dark-secondary">
            {products.length} {products.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary dark:text-text-dark-secondary text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
