// Página de inicio principal
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  // Categorías principales
  const mainCategories = [
    {
      id: 1,
      name: 'Tecnología',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      path: '/category/tecnologia'
    },
    {
      id: 2,
      name: 'Hogar y Muebles',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      path: '/category/hogar'
    },
    {
      id: 3,
      name: 'Moda',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      path: '/category/moda'
    },
    {
      id: 4,
      name: 'Deportes',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      path: '/category/deportes'
    }
  ];

  // Productos destacados
  const featuredProducts = [
    {
      id: 1,
      title: 'iPhone 13 Pro 128GB',
      price: 899999,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      reviews: 2847,
      freeShipping: true,
      fullRefund: true
    },
    {
      id: 2,
      title: 'Samsung Galaxy S21 Ultra',
      price: 749999,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.6,
      reviews: 1924,
      freeShipping: true,
      fullRefund: false
    },
    {
      id: 3,
      title: 'MacBook Pro 13" M2',
      price: 1299999,
      discount: 10,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.9,
      reviews: 3521,
      freeShipping: true,
      fullRefund: true
    },
    {
      id: 4,
      title: 'AirPods Pro 2da Gen',
      price: 249999,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.7,
      reviews: 1683,
      freeShipping: true,
      fullRefund: true
    },
    {
      id: 5,
      title: 'Sony WH-1000XM4',
      price: 349999,
      discount: 30,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.5,
      reviews: 892,
      freeShipping: true,
      fullRefund: false
    },
    {
      id: 6,
      title: 'iPad Air 5ta Gen',
      price: 599999,
      discount: 18,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      reviews: 2156,
      freeShipping: true,
      fullRefund: true
    }
  ];

  // Ofertas especiales
  const specialOffers = [
    {
      title: 'Hasta 50% OFF en Tecnología',
      subtitle: 'Las mejores marcas al mejor precio',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cta: 'Ver ofertas',
      link: '/category/tecnologia?sort=discount'
    },
    {
      title: 'Envío Gratis en toda la Argentina',
      subtitle: 'En compras mayores a $15.000',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cta: 'Comprar ahora',
      link: '/categories'
    }
  ];

  // Beneficios
  const benefits = [
    {
      icon: <Truck size={24} />,
      title: 'Envío gratis',
      description: 'En millones de productos desde $15.000'
    },
    {
      icon: <Shield size={24} />,
      title: 'Compra Protegida',
      description: 'Recibe el producto que esperabas o te devolvemos tu dinero'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Cuotas sin interés',
      description: 'Con tarjeta de crédito en productos seleccionados'
    },
    {
      icon: <Headphones size={24} />,
      title: 'Atención al cliente',
      description: 'Te ayudamos 24/7 por teléfono, chat o email'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner principal */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Encontrá lo que buscás
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Descubrí millones de productos con envío gratis
            </p>
            <Link 
              to="/categories"
              className="inline-flex items-center bg-white text-primary px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Explorar categorías
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ofertas especiales */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {specialOffers.map((offer, index) => (
              <Link
                key={index}
                to={offer.link}
                className="relative overflow-hidden rounded-lg shadow-lg group"
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-lg mb-4">{offer.subtitle}</p>
                    <span className="inline-block bg-white text-primary px-6 py-2 rounded-lg font-bold">
                      {offer.cta}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías principales */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Categorías principales</h2>
            <Link 
              to="/categories"
              className="text-primary hover:text-blue-600 font-medium flex items-center"
            >
              Ver todas
              <ChevronRight size={20} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mainCategories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white text-lg font-bold text-center">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Productos destacados</h2>
            <Link 
              to="/search?featured=true"
              className="text-primary hover:text-blue-600 font-medium flex items-center"
            >
              Ver todos
              <ChevronRight size={20} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            ¿Por qué elegir MercadoLibre?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recibí las mejores ofertas
          </h2>
          <p className="text-gray-600 mb-8">
            Suscribite a nuestro newsletter y no te pierdas ninguna promoción
          </p>
          
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
