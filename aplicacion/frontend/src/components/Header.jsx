import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Heart, Bell, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

// @TASK: Componente de navegación principal (Header)
// @AI_CONTEXT: Implementa Responsive Design (Mobile Menu) y Theme Toggling
// @SECURITY: Renderizado condicional basado en estado de autenticación (user object)
// @ACCESSIBILITY: Gestión de foco y eventos de teclado (Escape) para menús desplegables
const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);
  const { darkMode, toggleTheme } = useTheme();

  // Refs para cerrar menus al hacer click fuera
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // @TASK: Gestión de eventos globales para cerrar menús
  // @AI_CONTEXT: Event Listeners en document para UX (Click Outside / Escape)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isUserMenuOpen) setIsUserMenuOpen(false);
        if (isMenuOpen) setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isMenuOpen]);

  // @TASK: Redirección a página de búsqueda
  // @INPUT: Evento de formulario (e)
  // @OUTPUT: Navegación a /buscar con query param
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const totalItems = getTotalItems();

  return (
    <header className="bg-secondary dark:bg-secondary-dark shadow-md sticky top-0 z-50 transition-colors duration-300">
      {/* Barra superior */}
      <div className="bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <nav aria-label="Navegación secundaria" className="hidden sm:flex items-center space-x-4 text-text-secondary dark:text-text-dark-secondary">
              <Link to="/categorias" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                Categorías
              </Link>
              <Link to="/ofertas" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                Ofertas
              </Link>
              <Link to="/historial" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                Historial
              </Link>
            </nav>
            
            <nav aria-label="Navegación de ayuda y ventas" className="flex items-center space-x-4 text-text-secondary dark:text-text-dark-secondary">
              <Link to="/ayuda" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                Ayuda
              </Link>
              <span>|</span>
              <Link to="/gestion-productos" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                Vender
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="Ir al inicio">
              <div className="text-2xl font-bold text-primary dark:text-primary-light">
                E-Commerce
              </div>
            </Link>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-4 md:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <label htmlFor="search-input" className="sr-only">
                Buscar productos
              </label>
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos, marcas y más..."
                className="w-full px-4 py-2 pl-4 pr-12 text-sm border border-gray-300 dark:border-gray-600 rounded-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
              />
              <button
                type="submit"
                aria-label="Realizar búsqueda"
                className="absolute right-0 top-0 h-full px-4 bg-surface dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 border-l border-gray-300 dark:border-gray-600 rounded-r-sm transition-colors"
              >
                <Search aria-hidden="true" className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </form>
          </div>

          {/* Menú usuario y carrito */}
          <div className="flex items-center space-x-4">
            {/* Botón Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white/20 dark:bg-black/20 
                         hover:bg-white/30 dark:hover:bg-black/30 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                         transition-all duration-200 min-w-[44px] min-h-[44px]
                         flex items-center justify-center backdrop-blur-sm"
              aria-label={darkMode ? "Activar tema claro" : "Activar tema oscuro"}
              aria-pressed={darkMode}
              title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              type="button"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-secondary" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-text-primary" aria-hidden="true" />
              )}
            </button>

            {/* Usuario */}
            <div className="relative">
              {user ? (
                <div ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-white/20 dark:hover:bg-black/20 rounded-md transition-colors"
                    aria-label="Menú de usuario"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-controls="user-menu-dropdown"
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:block font-medium">
                      Hola, {user.nombre}
                    </span>
                  </button>

                  {/* Menú desplegable usuario */}
                  {isUserMenuOpen && (
                    <div 
                      id="user-menu-dropdown"
                      className="absolute right-0 mt-2 w-48 bg-surface dark:bg-surface-dark rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 animate-fade-in" 
                      role="menu" 
                      aria-label="Menú de usuario"
                    >
                      <div className="py-1">
                        <Link
                          to="/perfil"
                          className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                          role="menuitem"
                        >
                          Mi perfil
                        </Link>
                        <Link
                          to="/mis-compras"
                          className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                          role="menuitem"
                        >
                          Mis compras
                        </Link>
                        <Link
                          to="/favoritos"
                          className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                          role="menuitem"
                        >
                          Favoritos
                        </Link>
                        <Link
                          to="/gestion-productos"
                          className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                          role="menuitem"
                        >
                          Mis productos
                        </Link>
                        {user.rol === 'ADMIN' && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                            role="menuitem"
                          >
                            Panel Admin
                          </Link>
                        )}
                        <div className="border-t border-gray-100 dark:border-gray-700"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          role="menuitem"
                        >
                          Salir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-white/20 dark:hover:bg-black/20 rounded-md transition-colors font-medium"
                  >
                    Ingresá
                  </Link>
                  <Link
                    to="/registro"
                    className="px-3 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-white/20 dark:hover:bg-black/20 rounded-md transition-colors font-medium"
                  >
                    Creá tu cuenta
                  </Link>
                </div>
              )}
            </div>

            {/* Notificaciones */}
            {user && (
              <button 
                className="p-2 text-text-primary dark:text-text-dark-primary hover:bg-white/20 dark:hover:bg-black/20 rounded-md transition-colors"
                aria-label="Ver notificaciones"
              >
                <Bell className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            {/* Favoritos */}
            {user && (
              <Link
                to="/favoritos"
                className="p-2 text-text-primary dark:text-text-dark-primary hover:bg-white/20 dark:hover:bg-black/20 rounded-md transition-colors"
                aria-label="Ver favoritos"
              >
                <Heart className="w-5 h-5" aria-hidden="true" />
              </Link>
            )}

            {/* Carrito */}
            <Link
              to="/carrito"
              className="relative text-text-primary dark:text-text-dark-primary hover:text-primary dark:hover:text-primary-light transition-colors"
              aria-label={totalItems > 0 ? `Carrito (${totalItems} producto${totalItems !== 1 ? 's' : ''})` : 'Carrito vacío'}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium shadow-sm"
                  aria-hidden="true"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-text-primary dark:text-text-dark-primary hover:bg-white/20 dark:hover:bg-black/20 rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="sm:hidden bg-surface dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 mt-2 rounded-md shadow-lg animate-slide-up">
            <div className="py-2">
              <Link
                to="/categorias"
                className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link
                to="/ofertas"
                className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ofertas
              </Link>
              <Link
                to="/historial"
                className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Historial
              </Link>
              <Link
                to="/ayuda"
                className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ayuda
              </Link>
              <Link
                to="/vender"
                className="block px-4 py-2 text-sm text-text-primary dark:text-text-dark-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Vender
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

