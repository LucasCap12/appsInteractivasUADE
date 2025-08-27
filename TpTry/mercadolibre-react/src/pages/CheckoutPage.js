// Página de checkout con múltiples pasos
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Check, 
  CreditCard, 
  MapPin, 
  User, 
  Shield,
  Lock,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    // Datos personales
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    documentType: 'dni',
    documentNumber: '',

    // Dirección
    street: '',
    streetNumber: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    references: '',

    // Método de pago
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Datos personales', icon: <User size={20} /> },
    { id: 2, title: 'Dirección', icon: <MapPin size={20} /> },
    { id: 3, title: 'Método de pago', icon: <CreditCard size={20} /> },
    { id: 4, title: 'Confirmación', icon: <Check size={20} /> }
  ];

  const paymentMethods = [
    { id: 'credit_card', name: 'Tarjeta de crédito', icon: '💳' },
    { id: 'debit_card', name: 'Tarjeta de débito', icon: '💳' },
    { id: 'transfer', name: 'Transferencia bancaria', icon: '🏦' },
    { id: 'cash', name: 'Efectivo (Pago Fácil/Rapipago)', icon: '💵' }
  ];

  const installmentOptions = [
    { value: '1', label: '1 pago sin interés' },
    { value: '3', label: '3 cuotas sin interés' },
    { value: '6', label: '6 cuotas sin interés' },
    { value: '12', label: '12 cuotas con interés' },
    { value: '18', label: '18 cuotas con interés' }
  ];

  const shippingCost = getTotalPrice() > 150000 ? 0 : 5999;
  const total = getTotalPrice() + shippingCost;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'Nombre requerido';
        if (!formData.lastName) newErrors.lastName = 'Apellido requerido';
        if (!formData.email) newErrors.email = 'Email requerido';
        if (!formData.phone) newErrors.phone = 'Teléfono requerido';
        if (!formData.documentNumber) newErrors.documentNumber = 'Documento requerido';
        break;

      case 2:
        if (!formData.street) newErrors.street = 'Calle requerida';
        if (!formData.streetNumber) newErrors.streetNumber = 'Número requerido';
        if (!formData.city) newErrors.city = 'Ciudad requerida';
        if (!formData.state) newErrors.state = 'Provincia requerida';
        if (!formData.zipCode) newErrors.zipCode = 'Código postal requerido';
        break;

      case 3:
        if (formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') {
          if (!formData.cardNumber) newErrors.cardNumber = 'Número de tarjeta requerido';
          if (!formData.cardName) newErrors.cardName = 'Nombre en tarjeta requerido';
          if (!formData.expiryDate) newErrors.expiryDate = 'Fecha de vencimiento requerida';
          if (!formData.cvv) newErrors.cvv = 'CVV requerido';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinishOrder = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);
    
    try {
      // Simular procesamiento del pago
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a confirmación
      navigate('/order-confirmation', {
        state: {
          orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
          total,
          items: items.length
        }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Datos personales</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de documento
                </label>
                <select
                  value={formData.documentType}
                  onChange={(e) => handleInputChange('documentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="dni">DNI</option>
                  <option value="passport">Pasaporte</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de documento *
                </label>
                <input
                  type="text"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.documentNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.documentNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dirección de envío</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calle *
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.street ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número *
                </label>
                <input
                  type="text"
                  value={formData.streetNumber}
                  onChange={(e) => handleInputChange('streetNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.streetNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.streetNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.streetNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Piso/Depto
                </label>
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.state ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar provincia</option>
                  <option value="CABA">CABA</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Tucumán">Tucumán</option>
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencias (opcional)
                </label>
                <textarea
                  value={formData.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  placeholder="Información adicional para el envío"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Método de pago</h2>
            
            {/* Métodos de pago */}
            <div className="grid md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.paymentMethod === method.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Formulario de tarjeta */}
            {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-4">
                  <Lock size={16} className="text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    Tu información está protegida con encriptación SSL
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de tarjeta *
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre en la tarjeta *
                  </label>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.cardName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.cardName && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vencimiento *
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM/AA"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="123"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.cvv ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                {formData.paymentMethod === 'credit_card' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cuotas
                    </label>
                    <select
                      value={formData.installments}
                      onChange={(e) => handleInputChange('installments', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {installmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Confirmar pedido</h2>
            
            {/* Resumen del pedido */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Resumen del pedido</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Productos ({getTotalItems()})</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Datos de entrega */}
            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Truck size={20} className="text-primary mr-2" />
                <h3 className="text-lg font-bold">Datos de entrega</h3>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Nombre:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Dirección:</strong> {formData.street} {formData.streetNumber}</p>
                <p><strong>Ciudad:</strong> {formData.city}, {formData.state}</p>
                <p><strong>Teléfono:</strong> {formData.phone}</p>
              </div>
            </div>

            {/* Método de pago */}
            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <CreditCard size={20} className="text-primary mr-2" />
                <h3 className="text-lg font-bold">Método de pago</h3>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>{paymentMethods.find(m => m.id === formData.paymentMethod)?.name}</p>
                {formData.cardNumber && (
                  <p>Tarjeta terminada en {formData.cardNumber.slice(-4)}</p>
                )}
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-center text-sm text-gray-600">
              <Shield size={16} className="text-green-600 mr-2" />
              <span>
                Al hacer clic en "Finalizar compra" aceptás nuestros{' '}
                <button className="text-primary hover:text-blue-600">
                  términos y condiciones
                </button>
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? <Check size={20} /> : step.icon}
                </div>
                <div className={`ml-3 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-gray-600'
                  }`}>
                    Paso {step.id}
                  </div>
                  <div className="text-xs text-gray-500">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderStepContent()}

          {/* Botones de navegación */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anterior
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleFinishOrder}
                disabled={isProcessing}
                className="bg-green-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock size={16} className="mr-2" />
                    Finalizar compra ({formatPrice(total)})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
