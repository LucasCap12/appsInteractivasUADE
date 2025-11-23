import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { BrowsingHistoryProvider } from './context/BrowsingHistoryContext';
import { NotificationProvider } from './context/NotificationContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import { ThemeProvider } from './context/ThemeContext';

// Componentes de Layout
import Header from './components/Header';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ProductManagement from './pages/ProductManagement';
import CategoryProducts from './pages/CategoryProducts';
import SearchResults from './pages/SearchResults';
import Offers from './pages/Offers';
import Favorites from './pages/Favorites';
import AdminPanel from './pages/AdminPanel';
import OrderHistory from './pages/OrderHistory';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import BrowsingHistory from './pages/BrowsingHistory';
import ProductList from './pages/ProductList';

// Componente temporal para páginas no implementadas
const ComingSoon = ({ pageName }) => (
  <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center transition-colors duration-300">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-text-primary dark:text-text-dark-primary mb-4">
        {pageName}
      </h1>
      <p className="text-xl text-text-secondary dark:text-text-dark-secondary mb-8">
        Esta página está en desarrollo
      </p>
      <div className="animate-pulse bg-secondary w-32 h-2 rounded-full mx-auto"></div>
    </div>
  </div>
);

// Componente para manejar focus en cambio de ruta
const FocusManager = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Mover focus al main content cuando cambia la ruta
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AnnouncementProvider>
              <CartProvider>
                <FavoritesProvider>
                  <BrowsingHistoryProvider>
                  <div className="min-h-screen bg-gray-50">
                    {/* Skip link para navegación por teclado */}
                    <a 
                      href="#main-content"
                      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Saltar al contenido principal
                    </a>
              <Routes>
              {/* Rutas de autenticación sin header */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              
              {/* Rutas principales con header */}
              <Route path="/*" element={
                <>
                  <Header />
                  <FocusManager>
                    <main id="main-content" tabIndex="-1">
                      <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/productos" element={<ProductList />} />
                      <Route path="/producto/:id" element={<ProductDetail />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/categoria/:id" element={<CategoryProducts />} />
                      <Route path="/categorias" element={<Categories />} />
                      <Route path="/buscar" element={<SearchResults />} />
                      <Route path="/carrito" element={<Cart />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/orden-confirmada/:orderId" element={<OrderConfirmation />} />
                      <Route path="/ofertas" element={<Offers />} />
                      <Route path="/perfil" element={<Profile />} />
                      <Route path="/mis-compras" element={<OrderHistory />} />
                      <Route path="/ordenes" element={<OrderHistory />} />
                      <Route path="/favoritos" element={<Favorites />} />
                      <Route path="/historial" element={<BrowsingHistory />} />
                      <Route path="/ayuda" element={<ComingSoon pageName="Centro de Ayuda" />} />
                      <Route path="/vender" element={<ProductManagement />} />
                      <Route path="/productos/manage" element={<ProductManagement />} />
                      <Route path="/gestion-productos" element={<ProductManagement />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/admin/productos" element={<AdminPanel />} />
                      <Route path="/terminos" element={<ComingSoon pageName="Términos y Condiciones" />} />
                      <Route path="/privacidad" element={<ComingSoon pageName="Política de Privacidad" />} />
                      <Route path="/recuperar-password" element={<ComingSoon pageName="Recuperar Contraseña" />} />
                      
                      {/* Ruta 404 */}
                      <Route path="*" element={
                        <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center transition-colors duration-300">
                          <div className="text-center">
                            <h1 className="text-6xl font-bold text-primary dark:text-primary-light mb-4">404</h1>
                            <h2 className="text-2xl font-semibold text-text-primary dark:text-text-dark-primary mb-4">
                              Página no encontrada
                            </h2>
                            <p className="text-text-secondary dark:text-text-dark-secondary mb-8">
                              Lo sentimos, la página que buscás no existe.
                            </p>
                            <a 
                              href="/"
                              className="ml-button-primary inline-block"
                            >
                              Volver al inicio
                            </a>
                          </div>
                        </div>
                      } />
                      </Routes>
                    </main>
                  </FocusManager>
                </>
              } />
            </Routes>
              </div>
            </BrowsingHistoryProvider>
          </FavoritesProvider>
        </CartProvider>
      </AnnouncementProvider>
    </NotificationProvider>
  </ThemeProvider>
  </AuthProvider>
</Router>
  );
}

export default App;