import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, Truck, Shield, AlertCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { productService } from '../services/api';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount 
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    try {
      // Verificar stock disponible
      const product = await productService.getById(itemId);
      if (newQuantity > product.stock) {
        alert(`Solo hay ${product.stock} unidades disponibles`);
        return;
      }
      
      updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error al actualizar cantidad');
    }
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este producto del carrito?')) {
      removeFromCart(itemId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que querés vaciar todo el carrito?')) {
      clearCart();
    }
  };

  const validateStock = async () => {
    try {
      for (const item of cartItems) {
        const product = await productService.getById(item.id);
        if (product.stock < item.quantity) {
          throw new Error(`No hay suficiente stock de "${item.nombre}". Stock disponible: ${product.stock}`);
        }
      }
      return true;
    } catch (error) {
      setCheckoutError(error.message);
      return false;
    }
  };

  const updateProductStock = async (productId, quantityToSubtract) => {
    try {
      const product = await productService.getById(productId);
      const newStock = product.stock - quantityToSubtract;
      
      await productService.update(productId, {
        ...product,
        stock: Math.max(0, newStock)
      });
      
      return true;
    } catch (error) {
      console.error(`Error updating stock for product ${productId}:`, error);
      return false;
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // 1. Validar stock
      const stockValid = await validateStock();
      if (!stockValid) {
        setIsCheckingOut(false);
        return;
      }

      // 2. Crear orden (simulada)
      const order = {
        id: Date.now(),
        userId: user.id,
        items: cartItems.map(item => ({
          productId: item.id,
          nombre: item.nombre,
          precio: item.precio,
          quantity: item.quantity,
          subtotal: item.precio * item.quantity
        })),
        total: getCartTotal(),
        fecha: new Date().toISOString(),
        estado: 'confirmada'
      };

      // 3. Descontar stock de cada producto
      for (const item of cartItems) {
        const stockUpdated = await updateProductStock(item.id, item.quantity);
        if (!stockUpdated) {
          throw new Error(`Error al actualizar stock de ${item.nombre}`);
        }
      }

      // 4. Limpiar carrito
      clearCart();

      // 5. Mostrar mensaje de éxito y redirigir
      alert(`¡Compra realizada con éxito! 
Total: ${formatPrice(order.total)}
Número de orden: ${order.id}

Los productos se descontaron del stock.`);
      
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'Error al procesar la compra');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header mejorado */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Carrito de compras
              </h1>
              <Link
                to="/"
                className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* Carrito vacío mejorado */}
          <div className="text-center py-20">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-8 w-32 h-32 mx-auto mb-8 shadow-lg">
                <ShoppingBag className="w-16 h-16 text-purple-500 mx-auto" />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 -z-10"></div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              Tu carrito está vacío
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
              ¡Descubrí nuestros increíbles productos y comenzá a comprar!
            </p>
            <Link
              to="/"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Explorar productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 5000; // Envío gratis para compras > $50.000
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header mejorado */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Carrito de compras
              </h1>
              <p className="text-lg text-gray-600 mt-2 font-medium">
                {getCartItemsCount()} producto{getCartItemsCount() !== 1 ? 's' : ''} seleccionado{getCartItemsCount() !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleClearCart}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Vaciar carrito
              </button>
              <Link
                to="/"
                className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Error de checkout mejorado */}
        {checkoutError && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="bg-red-500 rounded-full p-2">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-800 mb-2">
                  Error en el checkout
                </h3>
                <p className="text-red-700 font-medium">
                  {checkoutError}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Lista de productos mejorada */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
              {cartItems.map((item, index) => (
                <div key={item.id} className={`p-8 ${index !== cartItems.length - 1 ? 'border-b-2 border-gray-100' : ''} hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300`}>
                  <div className="flex items-center">
                    {/* Imagen del producto mejorada */}
                    <div className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Imagen+no+disponible';
                        }}
                      />
                    </div>

                    {/* Información del producto mejorada */}
                    <div className="ml-8 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            <Link 
                              to={`/product/${item.id}`}
                              className="hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:bg-clip-text hover:text-transparent transition-all duration-200"
                            >
                              {item.nombre}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 font-medium">
                            {item.categoria || 'Sin categoría'}
                          </p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            {formatPrice(item.precio)}
                          </p>
                        </div>

                        {/* Controles de cantidad mejorados */}
                        <div className="flex items-center ml-8">
                          <div className="flex items-center border-2 border-purple-200 rounded-2xl bg-white shadow-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-4 py-3 text-purple-600 hover:text-purple-800 hover:bg-purple-50 disabled:text-gray-400 rounded-l-2xl transition-all duration-200"
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                            <span className="px-6 py-3 border-x-2 border-purple-200 text-center min-w-[80px] font-bold text-lg text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-4 py-3 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-r-2xl transition-all duration-200"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-4 p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-lg"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal mejorado */}
                      <div className="mt-6 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-700">
                          Subtotal: 
                        </span>
                        <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          {formatPrice(item.precio * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de compra mejorado */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sticky top-8 border border-white/20">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
                Resumen de compra
              </h2>

              {/* Desglose de precios mejorado */}
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-lg text-gray-700 font-medium">Subtotal:</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-lg text-gray-700 font-medium">Envío:</span>
                  <span className={`text-xl font-bold ${shipping === 0 ? 'bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-green-700 text-center">
                      🎉 ¡Envío gratis por compra superior a $50.000!
                    </p>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Beneficios mejorados */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center text-sm font-medium p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="bg-green-500 rounded-full p-1 mr-3">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-green-700">Envío a domicilio</span>
                </div>
                <div className="flex items-center text-sm font-medium p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="bg-blue-500 rounded-full p-1 mr-3">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-700">Compra protegida</span>
                </div>
                <div className="flex items-center text-sm font-medium p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="bg-purple-500 rounded-full p-1 mr-3">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-purple-700">Múltiples medios de pago</span>
                </div>
              </div>

              {/* Botón de checkout mejorado */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-xl"
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Procesando compra...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6 mr-3" />
                    Finalizar compra
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
                Al continuar, aceptás nuestros términos y condiciones de compra segura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
