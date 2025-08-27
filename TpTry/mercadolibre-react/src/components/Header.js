// Componente Header principal con navegación y búsqueda
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  MapPin,
  ChevronDown 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import LoginModal from './LoginModal';

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Vehículos',
    'Inmuebles', 
    'Supermercado',
    'Tecnología',
    'Hogar y Muebles',
    'Electrodomésticos',
    'Herramientas',
    'Construcción',
    'Deportes y Fitness',
    'Accesorios para Vehículos'
  ];

  const handleUserClick = () => {
    if (user) {
      setShowUserMenu(!showUserMenu);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Header principal */}
      <div className="bg-primary py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="text-white md:hidden" size={24} />
            <Link to="/" className="text-white font-bold text-xl">
              MercadoLibre
            </Link>
          </div>

          {/* Barra de búsqueda principal */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <SearchBar />
          </div>

          {/* Iconos de navegación */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <Link to="/cart" className="relative text-white hover:text-gray-200">
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Usuario */}
            <div className="relative">
              <button 
                onClick={handleUserClick}
                className="text-white hover:text-gray-200 flex items-center space-x-1"
              >
                <User size={24} />
                {user && <ChevronDown size={16} />}
              </button>

              {/* Menú desplegable de usuario */}
              {showUserMenu && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link 
                    to="/account" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mi cuenta
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mis compras
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Favoritos
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda móvil */}
      <div className="md:hidden px-4 py-3 bg-white">
        <SearchBar />
      </div>

      {/* Navegación secundaria */}
      <div className="bg-white border-b px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Ubicación */}
          <div className="relative">
            <button 
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary"
            >
              <MapPin size={16} />
              <span>Enviar a Buenos Aires</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Links adicionales */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/categories" className="text-gray-600 hover:text-primary">
              Categorías
            </Link>
            <Link to="/offers" className="text-gray-600 hover:text-primary">
              Ofertas
            </Link>
            <Link to="/supermarket" className="text-gray-600 hover:text-primary">
              Supermercado
            </Link>
            <Link to="/history" className="text-gray-600 hover:text-primary">
              Historial
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-primary">
              Ayuda
            </Link>
          </div>
        </div>
      </div>

      {/* Navegación de categorías */}
      <div className="bg-white border-b px-4 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-6 text-sm whitespace-nowrap">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-600 hover:text-primary py-2"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
};

export default Header;
