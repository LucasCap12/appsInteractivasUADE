import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/api';
import { Tag, Package, TrendingUp, AlertCircle, Loader } from 'lucide-react';

/**
 * Página de Todas las Categorías
 * Muestra un grid completo de todas las categorías disponibles con contadores de productos
 */
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getActive();
      setCategories(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('No se pudieron cargar las categorías. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Iconos por categoría (se pueden personalizar según el nombre)
  const getCategoryIcon = (nombre) => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('tecnología') || nombreLower.includes('electrónica')) {
      return '💻';
    } else if (nombreLower.includes('deporte') || nombreLower.includes('fitness')) {
      return '⚽';
    } else if (nombreLower.includes('hogar') || nombreLower.includes('muebles')) {
      return '🏠';
    } else if (nombreLower.includes('moda') || nombreLower.includes('ropa')) {
      return '👕';
    } else if (nombreLower.includes('libro') || nombreLower.includes('educación')) {
      return '📚';
    } else if (nombreLower.includes('juguete') || nombreLower.includes('niños')) {
      return '🧸';
    } else if (nombreLower.includes('salud') || nombreLower.includes('belleza')) {
      return '💄';
    } else if (nombreLower.includes('alimento') || nombreLower.includes('comida')) {
      return '🍕';
    }
    return '📦';
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-md p-8 max-w-md w-full text-center transition-colors duration-300">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2">Error</h2>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-6">{error}</p>
          <button
            onClick={loadCategories}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center p-4 transition-colors duration-300">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
            No hay categorías disponibles
          </h2>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
            Por el momento no hay categorías para mostrar.
          </p>
          <Link to="/" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Tag className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary">
              Todas las Categorías
            </h1>
          </div>
          <p className="text-text-secondary dark:text-text-dark-secondary">
            Explora nuestra amplia variedad de categorías y encuentra lo que buscas
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary to-primary-dark dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-md p-6 mb-8 text-white transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total de categorías</p>
              <p className="text-4xl font-bold">{categories.length}</p>
            </div>
            <TrendingUp className="w-16 h-16 text-blue-200 opacity-50" />
          </div>
        </div>

        {/* Grid de Categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categoria/${category.id}`}
              className="group bg-surface dark:bg-surface-dark rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary dark:hover:border-primary"
            >
              <div className="p-6">
                {/* Icono de Categoría */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-full group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-gray-600 dark:group-hover:to-gray-500 transition-colors duration-300">
                  <span className="text-4xl">{getCategoryIcon(category.nombre)}</span>
                </div>

                {/* Nombre de Categoría */}
                <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary text-center mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300">
                  {category.nombre}
                </h3>

                {/* Descripción (si existe) */}
                {category.descripcion && (
                  <p className="text-text-secondary dark:text-text-dark-secondary text-sm text-center mb-4 line-clamp-2">
                    {category.descripcion}
                  </p>
                )}

                {/* Botón de Acción */}
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center text-sm font-medium text-primary dark:text-primary-light group-hover:text-primary-dark dark:group-hover:text-blue-300 transition-colors duration-300">
                    Explorar
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Línea decorativa inferior */}
              <div className="h-1 bg-gradient-to-r from-primary via-purple-600 to-primary-dark dark:from-blue-500 dark:via-purple-500 dark:to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-surface dark:bg-surface-dark rounded-lg shadow-md p-8 text-center transition-colors duration-300">
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
            ¿No encontrás lo que buscás?
          </h2>
          <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
            Usá nuestra barra de búsqueda o explorá todas nuestras ofertas
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors">
              Volver al inicio
            </Link>
            <Link to="/ofertas" className="bg-secondary hover:bg-secondary-dark text-text-primary font-bold py-2 px-4 rounded transition-colors">
              Ver ofertas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
