// Página de resultados de búsqueda
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Grid, List, ChevronDown, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/SearchFilters';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    price: { min: '', max: '' },
    brands: [],
    condition: [],
    locations: [],
    features: []
  });

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const itemsPerPage = 20;

  // Productos mockup para demostración
  const mockProducts = [
    {
      id: 1,
      title: 'iPhone 13 Pro 128GB Azul Sierra',
      price: 899999,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      reviews: 2847,
      freeShipping: true,
      fullRefund: true,
      brand: 'Apple',
      condition: 'new',
      location: 'Capital Federal'
    },
    {
      id: 2,
      title: 'Samsung Galaxy S21 Ultra 256GB Phantom Black',
      price: 749999,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.6,
      reviews: 1924,
      freeShipping: true,
      fullRefund: false,
      brand: 'Samsung',
      condition: 'new',
      location: 'Buenos Aires'
    },
    {
      id: 3,
      title: 'Xiaomi Redmi Note 11 Pro 128GB',
      price: 299999,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.4,
      reviews: 3521,
      freeShipping: true,
      fullRefund: true,
      brand: 'Xiaomi',
      condition: 'new',
      location: 'Córdoba'
    },
    {
      id: 4,
      title: 'Motorola Edge 30 Pro 256GB',
      price: 549999,
      discount: 18,
      image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.3,
      reviews: 892,
      freeShipping: false,
      fullRefund: true,
      brand: 'Motorola',
      condition: 'new',
      location: 'Rosario'
    },
    {
      id: 5,
      title: 'Google Pixel 6 Pro 128GB',
      price: 679999,
      discount: 12,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.7,
      reviews: 1456,
      freeShipping: true,
      fullRefund: false,
      brand: 'Google',
      condition: 'new',
      location: 'Mendoza'
    },
    {
      id: 6,
      title: 'OnePlus 9 Pro 256GB Morning Mist',
      price: 599999,
      discount: 22,
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.5,
      reviews: 1123,
      freeShipping: true,
      fullRefund: true,
      brand: 'OnePlus',
      condition: 'new',
      location: 'Capital Federal'
    }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Más relevantes' },
    { value: 'price_asc', label: 'Menor precio' },
    { value: 'price_desc', label: 'Mayor precio' },
    { value: 'newest', label: 'Más nuevos' },
    { value: 'best_seller', label: 'Más vendidos' },
    { value: 'rating', label: 'Mejor calificados' }
  ];

  // Simular carga de productos
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      // Aplicar filtros
      if (filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.brands.includes(product.brand)
        );
      }
      
      if (filters.condition.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.condition.includes(product.condition)
        );
      }
      
      if (filters.features.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
          return filters.features.every(feature => {
            switch (feature) {
              case 'freeShipping': return product.freeShipping;
              case 'fullRefund': return product.fullRefund;
              default: return true;
            }
          });
        });
      }
      
      // Aplicar filtros de precio
      if (filters.price.min) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= parseInt(filters.price.min)
        );
      }
      
      if (filters.price.max) {
        filteredProducts = filteredProducts.filter(product => 
          product.price <= parseInt(filters.price.max)
        );
      }
      
      // Aplicar ordenamiento
      switch (sortBy) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'best_seller':
          filteredProducts.sort((a, b) => b.reviews - a.reviews);
          break;
        default:
          // relevance - mantener orden original
          break;
      }
      
      setProducts(filteredProducts);
      setTotalResults(filteredProducts.length);
      setIsLoading(false);
    }, 800);
  }, [query, category, filters, sortBy]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      price: { min: '', max: '' },
      brands: [],
      condition: [],
      locations: [],
      features: []
    });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Inicio', path: '/' }
    ];
    
    if (category) {
      breadcrumbs.push({ label: category, path: `/category/${category}` });
    }
    
    if (query) {
      breadcrumbs.push({ label: `"${query}"`, path: null });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                {crumb.path ? (
                  <button
                    onClick={() => navigate(crumb.path)}
                    className="text-primary hover:text-blue-600"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-gray-600">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Header de resultados */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Resultados para "${query}"` : 'Todos los productos'}
              </h1>
              <p className="text-gray-600">
                {isLoading ? 'Buscando...' : `${totalResults.toLocaleString()} resultados`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Selector de vista */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Ordenamiento */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>

              {/* Botón filtros móvil */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
              >
                <SlidersHorizontal size={20} />
                Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filtros laterales */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Resultados */}
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    variant={viewMode === 'list' ? 'list' : 'default'}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Grid size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No encontramos productos
                </h3>
                <p className="text-gray-600 mb-6">
                  Probá con otros términos de búsqueda o modificá los filtros
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Paginación */}
            {products.length > 0 && totalResults > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {[...Array(Math.ceil(totalResults / itemsPerPage))].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === index + 1
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
