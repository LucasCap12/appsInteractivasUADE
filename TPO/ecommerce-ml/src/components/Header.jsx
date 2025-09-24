import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Heart, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const { getTotalItems } = useContext(CartContext);

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
    <header className="bg-ml-yellow shadow-md sticky top-0 z-50">
      {/* Barra superior */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="hidden sm:flex items-center space-x-4 text-gray-600">
              <Link to="/categorias" className="hover:text-ml-blue">
                Categorías
              </Link>
              <Link to="/ofertas" className="hover:text-ml-blue">
                Ofertas
              </Link>
              <Link to="/historial" className="hover:text-ml-blue">
                Historial
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-600">
              <Link to="/ayuda" className="hover:text-ml-blue">
                Ayuda
              </Link>
              <span>|</span>
              <Link to="/gestion-productos" className="hover:text-ml-blue">
                Vender
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-ml-blue">
                ML
              </div>
              <span className="hidden sm:block ml-2 text-xl font-semibold text-gray-800">
                Marketplace
              </span>
            </Link>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos, marcas y más..."
                className="w-full px-4 py-2 pl-4 pr-12 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-ml-blue focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-white hover:bg-gray-50 border-l border-gray-300 rounded-r-sm"
              >
                <Search className="w-4 h-4 text-gray-500" />
              </button>
            </form>
          </div>

          {/* Menú usuario y carrito */}
          <div className="flex items-center space-x-4">
            {/* Usuario */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-md"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">
                      Hola, {user.nombre}
                    </span>
                  </button>

                  {/* Menú desplegable usuario */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <Link
                          to="/perfil"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Mi perfil
                        </Link>
                        <Link
                          to="/mis-compras"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Mis compras
                        </Link>
                        <Link
                          to="/favoritos"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Favoritos
                        </Link>
                        <Link
                          to="/gestion-productos"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Mis productos
                        </Link>
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-md"
                  >
                    Ingresá
                  </Link>
                  <Link
                    to="/registro"
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-md"
                  >
                    Creá tu cuenta
                  </Link>
                </div>
              )}
            </div>

            {/* Notificaciones */}
            {user && (
              <button className="p-2 text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-md">
                <Bell className="w-5 h-5" />
              </button>
            )}

            {/* Favoritos */}
            {user && (
              <Link
                to="/favoritos"
                className="p-2 text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-md"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Carrito */}
            <Link
              to="/carrito"
              className="relative p-2 text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-md"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-gray-700 hover:bg-white hover:bg-opacity-50 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200 mt-2 rounded-md shadow-lg">
            <div className="py-2">
              <Link
                to="/categorias"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link
                to="/ofertas"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Ofertas
              </Link>
              <Link
                to="/historial"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Historial
              </Link>
              <Link
                to="/ayuda"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Ayuda
              </Link>
              <Link
                to="/vender"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
