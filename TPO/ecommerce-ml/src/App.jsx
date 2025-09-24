import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Componentes de Layout
import Header from './components/Header';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ProductManagement from './pages/ProductManagement';

// Componente temporal para páginas no implementadas
const ComingSoon = ({ pageName }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {pageName}
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Esta página está en desarrollo
      </p>
      <div className="animate-pulse bg-ml-yellow w-32 h-2 rounded-full mx-auto"></div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Rutas de autenticación sin header */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              
              {/* Rutas principales con header */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/productos" element={<ComingSoon pageName="Todos los Productos" />} />
                      <Route path="/producto/:id" element={<ProductDetail />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/categoria/:id" element={<ComingSoon pageName="Productos por Categoría" />} />
                      <Route path="/categorias" element={<ComingSoon pageName="Todas las Categorías" />} />
                      <Route path="/buscar" element={<ComingSoon pageName="Resultados de Búsqueda" />} />
                      <Route path="/carrito" element={<Cart />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<ComingSoon pageName="Finalizar Compra" />} />
                      <Route path="/ofertas" element={<ComingSoon pageName="Ofertas Especiales" />} />
                      <Route path="/perfil" element={<ComingSoon pageName="Mi Perfil" />} />
                      <Route path="/mis-compras" element={<ComingSoon pageName="Mis Compras" />} />
                      <Route path="/favoritos" element={<ComingSoon pageName="Mis Favoritos" />} />
                      <Route path="/historial" element={<ComingSoon pageName="Historial de Navegación" />} />
                      <Route path="/ayuda" element={<ComingSoon pageName="Centro de Ayuda" />} />
                      <Route path="/vender" element={<ProductManagement />} />
                      <Route path="/productos/manage" element={<ProductManagement />} />
                      <Route path="/gestion-productos" element={<ProductManagement />} />
                      <Route path="/terminos" element={<ComingSoon pageName="Términos y Condiciones" />} />
                      <Route path="/privacidad" element={<ComingSoon pageName="Política de Privacidad" />} />
                      <Route path="/recuperar-password" element={<ComingSoon pageName="Recuperar Contraseña" />} />
                      
                      {/* Ruta 404 */}
                      <Route path="*" element={
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-6xl font-bold text-ml-blue mb-4">404</h1>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                              Página no encontrada
                            </h2>
                            <p className="text-gray-600 mb-8">
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
                </>
              } />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
