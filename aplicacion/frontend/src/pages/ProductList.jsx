import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService, categoryService, formatPrice } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useNotification } from '../context/NotificationContext';

const ProductList = () => {
  const { error: showError } = useNotification();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 2000000], // Ajustado para incluir productos premium (hasta 2M ARS)
  });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getActive()
      ]);
      
      setProducts(productsData || []);
      setFilteredProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      showError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filtro por categorías
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        product.categorias?.some(cat => filters.categories.includes(cat.id))
      );
    }

    // Filtro por rango de precio (usando precioFinal)
    filtered = filtered.filter(product => {
      const price = product.precioFinal || product.precio;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset a primera página al aplicar filtros
  };

  const handleCategoryToggle = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 2000000],
    });
  };

  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      {/* Header */}
      <div className="bg-surface dark:bg-surface-dark shadow transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">Productos</h1>
            <span className="text-text-secondary dark:text-text-dark-secondary">({products.length} resultados)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-surface dark:bg-surface-dark p-4 rounded-lg shadow transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary dark:text-text-dark-primary">Filtros</h3>
                <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">Precio</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange[1])}
                  />
                  <span className="text-gray-500 dark:text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">Categoría</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-text-primary dark:text-text-dark-primary">{category.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {currentProducts.length === 0 ? (
                <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-md p-12 text-center transition-colors duration-300 col-span-full">
                  <p className="text-xl text-text-primary dark:text-text-dark-primary mb-2">No se encontraron productos</p>
                  <p className="text-text-secondary dark:text-text-dark-secondary mb-6">Prueba ajustar los filtros</p>
                  <button
                    onClick={handleClearFilters}
                    className="ml-button-primary"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                currentProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                  />
                ))
              )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-md p-4 flex items-center justify-between transition-colors duration-300 mt-6">
                <div className="text-sm text-text-secondary dark:text-text-dark-secondary">
                  Página {currentPage} de {totalPages}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-text-dark-primary hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-text-dark-primary hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-gray-400 dark:text-gray-500">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-text-dark-primary hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
