import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Star, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService, categoryService } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        
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

      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ml-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="ml-button-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Banner principal mejorado */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300 opacity-5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-200 to-pink-200">
              Bienvenido a ML Marketplace
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Descubrí millones de productos con la mejor calidad y precios. Tu destino de compras online más confiable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/categorias"
                className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explorar categorías
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-200 backdrop-blur-sm">
                Ver Ofertas Especiales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Categorías populares
          </h2>
          <Link
            to="/categorias"
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center bg-purple-50 px-4 py-2 rounded-full hover:bg-purple-100 transition-all duration-200"
          >
            Ver todas
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              to={`/categoria/${category.id}`}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-purple-200 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="relative">
                  <img
                    src={category.imagen}
                    alt={category.nombre}
                    className="w-16 h-16 mx-auto mb-4 object-cover rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                  {category.nombre}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ofertas del día */}
      {offers.length > 0 && (
        <section className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 py-16 border-y border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full p-3 mr-4 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Ofertas del día
                  </h2>
                  <p className="text-orange-600 font-medium">¡No te las pierdas!</p>
                </div>
              </div>
              <Link
                to="/ofertas"
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center bg-orange-100 px-4 py-2 rounded-full hover:bg-orange-200 transition-all duration-200"
              >
                Ver todas las ofertas
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {offers.map((product) => (
                <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard
                    product={product}
                    className="h-full shadow-xl border-2 border-orange-200 hover:border-orange-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-3 mr-4 shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Productos destacados
              </h2>
              <p className="text-blue-600 font-medium">Los más populares</p>
            </div>
          </div>
          <Link
            to="/productos"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all duration-200"
          >
            Ver todos
            <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredProducts.slice(0, 8).map((product) => (
            <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
              <ProductCard
                product={product}
                className="h-full shadow-lg hover:shadow-2xl border border-gray-200 hover:border-blue-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Sección de beneficios */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 opacity-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-purple-200">
              ¿Por qué elegir ML Marketplace?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              La mejor experiencia de compra online con beneficios únicos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-200">Mejores precios</h3>
              <p className="text-blue-100 leading-relaxed">
                Comparamos precios para ofrecerte las mejores ofertas del mercado con descuentos exclusivos
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-200">Calidad garantizada</h3>
              <p className="text-blue-100 leading-relaxed">
                Todos nuestros vendedores están verificados y los productos tienen garantía de calidad
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-200">Envío rápido</h3>
              <p className="text-blue-100 leading-relaxed">
                Recibí tus productos en tiempo récord con nuestro sistema de envíos express
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
