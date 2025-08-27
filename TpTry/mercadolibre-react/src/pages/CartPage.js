// Página del carrito de compras
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  Shield, 
  Truck,
  ChevronRight 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();
  
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Datos mockup para direcciones
  const addresses = [
    {
      id: 'home',
      label: 'Casa',
      address: 'Av. Corrientes 1234, Apt 4B',
      city: 'CABA, Buenos Aires',
      isDefault: true
    },
    {
      id: 'work',
      label: 'Trabajo',
      address: 'Av. Santa Fe 5678, Piso 10',
      city: 'CABA, Buenos Aires',
      isDefault: false
    }
  ];

  // Costos de envío mockup
  const shippingCost = getTotalPrice() > 150000 ? 0 : 5999; // Envío gratis en compras > $150k
  const discount = appliedPromo ? getTotalPrice() * 0.1 : 0; // 10% de descuento

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'descuento10') {
      setAppliedPromo({
        code: promoCode,
        discount: 0.1,
        description: '10% de descuento'
      });
      setPromoCode('');
    } else {
      alert('Código promocional inválido');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 mb-6">
              <ShoppingBag size={80} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              ¡Empezá un carrito de compras y agregá productos!
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Descubrir productos
              </Link>
              <div>
                <Link
                  to="/login"
                  className="text-primary hover:text-blue-600 font-medium"
                >
                  Iniciá sesión para ver tu carrito guardado
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Carrito ({getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'})
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Productos en el carrito */}
          <div className="lg:col-span-2 space-y-4">
            {/* Acciones del carrito */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Shield size={20} className="text-green-600" />
                  <span className="text-sm text-gray-700">
                    Compra Protegida. Recibí el producto que esperabas o te devolvemos tu dinero.
                  </span>
                </div>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* Lista de productos */}
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex gap-6">
                  {/* Imagen del producto */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-4">
                      {item.freeShipping && (
                        <div className="flex items-center text-green-600 text-sm">
                          <Truck size={16} className="mr-1" />
                          Envío gratis
                        </div>
                      )}
                      {item.fullRefund && (
                        <div className="flex items-center text-blue-600 text-sm">
                          <Shield size={16} className="mr-1" />
                          Devolución gratis
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Controles de cantidad */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price)} c/u
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="space-y-6">
            {/* Dirección de envío */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Dirección de envío
              </h3>
              
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label key={address.id} className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddress === address.id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-1" />
                        <span className="font-medium text-gray-900">{address.label}</span>
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {address.address}<br />
                        {address.city}
                      </div>
                    </div>
                  </label>
                ))}
                
                <button className="text-primary hover:text-blue-600 text-sm font-medium">
                  + Agregar nueva dirección
                </button>
              </div>
            </div>

            {/* Código promocional */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Código promocional
              </h3>
              
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      {appliedPromo.code}
                    </div>
                    <div className="text-xs text-green-600">
                      {appliedPromo.description}
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Ingresá tu código"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              )}
            </div>

            {/* Resumen de costos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Resumen de compra
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Productos ({getTotalItems()})
                  </span>
                  <span className="font-medium">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                    {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                  </span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({appliedPromo.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(getTotalPrice() + shippingCost - discount)}</span>
                </div>
                
                {shippingCost > 0 && (
                  <div className="text-sm text-gray-600">
                    Te faltan {formatPrice(150000 - getTotalPrice())} para envío gratis
                  </div>
                )}
              </div>
              
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors mt-6 flex items-center justify-center"
              >
                Continuar compra
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>

            {/* Seguir comprando */}
            <div className="text-center">
              <Link
                to="/"
                className="text-primary hover:text-blue-600 font-medium"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
