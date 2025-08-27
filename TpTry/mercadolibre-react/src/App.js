// Componente principal de la aplicación
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import LoginModal from './components/LoginModal';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Componente para el bottom navigation móvil
const BottomNavigation = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        <a href="/" className="flex flex-col items-center justify-center gap-1 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
          </svg>
          <span className="text-xs font-medium">Inicio</span>
        </a>
        
        <a href="/categories" className="flex flex-col items-center justify-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path>
          </svg>
          <span className="text-xs font-medium">Categorías</span>
        </a>
        
        <a href="/favorites" className="flex flex-col items-center justify-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
          </svg>
          <span className="text-xs font-medium">Favoritos</span>
        </a>
        
        <a href="/cart" className="flex flex-col items-center justify-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z"></path>
          </svg>
          <span className="text-xs font-medium">Carrito</span>
        </a>
        
        <a href="/account" className="flex flex-col items-center justify-center gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
          </svg>
          <span className="text-xs font-medium">Cuenta</span>
        </a>
      </div>
    </div>
  );
};

// Páginas adicionales básicas
const CategoriesPage = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Todas las categorías</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {['Tecnología', 'Hogar', 'Moda', 'Deportes', 'Libros', 'Juguetes', 'Automotriz', 'Belleza'].map((category) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-medium text-gray-900">{category}</h3>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const OrderConfirmationPage = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-2xl mx-auto px-4 text-center">
      <div className="bg-white rounded-lg shadow-sm border p-12">
        <div className="text-green-600 mb-6">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Compra exitosa!</h1>
        <p className="text-gray-600 mb-8">Tu pedido ha sido procesado correctamente. Te enviaremos un email con los detalles.</p>
        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
          >
            Seguir comprando
          </button>
          <div>
            <button 
              onClick={() => window.location.href = '/orders'}
              className="text-primary hover:text-blue-600 font-medium"
            >
              Ver mis pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
            
            <main className="pb-16 md:pb-0">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<LoginPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/category/:category" element={<SearchPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/account" element={<HomePage />} />
                <Route path="/favorites" element={<HomePage />} />
                <Route path="/orders" element={<HomePage />} />
                <Route path="/help" element={<HomePage />} />
              </Routes>
            </main>

            <BottomNavigation />
            
            <LoginModal 
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
