import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, Truck, Shield, AlertCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { productService, orderService } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount 
  } = useContext(CartContext);
  const { user, isLoading } = useContext(AuthContext);
  const { success, error: showError, confirm } = useNotification();
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
        showError(`Solo hay ${product.stock} unidades disponibles`);
        return;
      }
      
      updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError('Error al actualizar cantidad');
    }
  };

  const handleRemoveItem = async (itemId) => {
    const confirmed = await confirm('¿Estás seguro de que querés eliminar este producto del carrito?');
    if (confirmed) {
      removeFromCart(itemId);
    }
  };

  const handleClearCart = async () => {
    const confirmed = await confirm('¿Estás seguro de que querés vaciar todo el carrito?');
    if (confirmed) {
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
      // Backend expects a delta (change), not absolute value
      // Send negative quantity to subtract from current stock
      await productService.updateStock(productId, -quantityToSubtract);
      
      return true;
    } catch (error) {
      console.error(`Error updating stock for product ${productId}:`, error);
      return false;
    }
  };

  const handleProceedToCheckout = () => {
    if (isLoading) return;
    
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
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

      // 2. Crear orden en el backend
      const ordenData = {
        items: cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.precio
        })),
        direccionEnvio: 'Dirección pendiente',
        metodoPago: 'Efectivo'
      };

      const ordenCreada = await orderService.create(ordenData);

      // 3. Limpiar carrito
      clearCart();

      // 4. Mostrar mensaje de éxito y redirigir a historial de compras
      success(`¡Compra realizada con éxito! Orden #${ordenCreada.id}`, 6000);
      
      navigate('/mis-compras', { replace: true });

    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'Error al procesar la compra');
      showError('Error al procesar la compra. Por favor, intenta nuevamente.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-text-secondary dark:text-text-dark-secondary" />
            <h3 className="mt-2 text-sm font-medium text-text-primary dark:text-text-dark-primary">El carrito está vacío</h3>
            <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary">¡Empieza a comprar para llenar tu carrito!</p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Ir a comprar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 5000; // Envío gratis para compras > $50.000
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-8">Tu Carrito</h1>

        <div className="bg-surface dark:bg-surface-dark rounded-lg shadow overflow-hidden transition-colors duration-300">
          <div className="p-6 border-b border-border dark:border-border-dark">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary">
                Productos ({cartItems.length})
              </h3>
              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary">
                Envío gratis en compras superiores a $20,000
              </p>
            </div>
          </div>

          <ul className="divide-y divide-border dark:divide-border-dark">
            {cartItems.map((item) => (
              <li key={item.id} className="p-6 flex items-center hover:bg-background dark:hover:bg-background-dark transition-colors duration-150">
                <img
                  src={item.imagenUrl || 'https://via.placeholder.com/150'}
                  alt={item.nombre}
                  className="h-24 w-24 object-cover rounded-md border border-border dark:border-border-dark"
                />
                <div className="ml-6 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-text-primary dark:text-text-dark-primary">
                        {item.nombre}
                      </h4>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
                        {item.descripcion?.substring(0, 100)}...
                      </p>
                    </div>
                    <p className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
                      ${item.precio}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-border dark:border-border-dark rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-background dark:hover:bg-background-dark text-text-secondary dark:text-text-dark-secondary disabled:opacity-50 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1 text-text-primary dark:text-text-dark-primary font-medium border-x border-border dark:border-border-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-background dark:hover:bg-background-dark text-text-secondary dark:text-text-dark-secondary disabled:opacity-50 transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm flex items-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="bg-background dark:bg-background-dark p-6 transition-colors duration-300">
            <div className="flex justify-between text-base font-medium text-text-primary dark:text-text-dark-primary mb-4">
              <p>Subtotal</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            <p className="mt-0.5 text-sm text-text-secondary dark:text-text-dark-secondary mb-6">
              Impuestos y envío calculados al finalizar la compra.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleProceedToCheckout}
                disabled={isLoading}
                className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verificando sesión...' : 'Proceder al pago'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
