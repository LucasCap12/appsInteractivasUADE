import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// @TASK: Carrusel dinámico para la sección Hero de la Home
// @INPUT: Ninguno (Maneja su propio estado y datos estáticos por ahora)
// @OUTPUT: Renderiza un slider con imágenes y CTAs condicionales
// @AI_CONTEXT: Reemplazo del banner estático para mejorar UX y engagement
// @ACCESSIBILITY: Soporte para navegación por teclado, aria-labels y contraste adecuado
const HeroCarousel = () => {
  const { user } = useContext(AuthContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
      title: "Bienvenido a E-Commerce",
      subtitle: "La mejor experiencia de compra online. Encuentra todo lo que buscas.",
      alt: "Persona comprando online con laptop",
      gradient: "from-primary/90 to-primary-dark/90" // Fallback overlay
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop",
      title: "Tecnología de Punta",
      subtitle: "Descubre las últimas novedades en smartphones y laptops.",
      alt: "Smartphone moderno sobre mesa",
      gradient: "from-blue-900/80 to-purple-900/80"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      title: "Moda y Estilo",
      subtitle: "Renueva tu guardarropa con nuestra colección de temporada.",
      alt: "Mujer con bolsas de compra",
      gradient: "from-pink-900/80 to-rose-900/80"
    }
  ];

  // Auto-play logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Ofertas destacadas"
      role="region"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          aria-hidden={index !== currentSlide}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Gradient for Contrast */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} mix-blend-multiply`} />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto animate-slide-up">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg mb-6">
                {slide.title}
              </h2>
              <p className="text-xl text-gray-100 mb-10 font-light drop-shadow-md max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
              
              {/* Conditional CTA */}
              <div className="flex justify-center gap-4">
                {user ? (
                  <>
                    <Link
                      to="/ofertas"
                      className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                    >
                      Ver Ofertas
                    </Link>
                    <Link
                      to="/mis-compras"
                      className="px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                    >
                      Mis Compras
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/productos"
                      className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                    >
                      Ver Productos
                    </Link>
                    <Link
                      to="/registro"
                      className="px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100 md:opacity-100"
        aria-label="Diapositiva anterior"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white opacity-0 group-hover:opacity-100 md:opacity-100"
        aria-label="Siguiente diapositiva"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
