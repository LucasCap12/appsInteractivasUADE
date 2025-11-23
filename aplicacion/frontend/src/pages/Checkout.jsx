import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderService, userService } from '../services/api';

// --- Sub-components extracted to prevent re-renders and focus loss ---

const ReviewStep = ({ cartItems, getCartTotal }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">Revisión del pedido</h2>
    
    <div className="bg-background dark:bg-background-dark rounded-lg p-6 space-y-4 transition-colors duration-300">
      {cartItems.map(item => (
        <div key={item.id} className="flex items-center gap-4 bg-surface dark:bg-surface-dark p-4 rounded-lg transition-colors duration-300">
          <img
            src={item.imagen || '/placeholder.svg'}
            alt={item.nombre}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary dark:text-text-dark-primary">{item.nombre}</h3>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Cantidad: {item.quantity}</p>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Precio unitario: ${item.precio?.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">
              ${(item.precio * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-6">
      <div className="flex justify-between items-center text-lg">
        <span className="font-semibold text-text-primary dark:text-text-dark-primary">Total:</span>
        <span className="font-bold text-2xl text-primary">
          ${getCartTotal().toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

const ShippingStep = ({ shippingData, handleShippingChange, prefillUserData }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">Información de envío</h2>
        <button
            onClick={prefillUserData}
            className="text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-md transition-colors"
        >
            Usar mis datos guardados
        </button>
    </div>
    
    <div className="space-y-4">
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2">
          Dirección completa *
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={shippingData.direccion}
          onChange={handleShippingChange}
          required
          aria-required="true"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
          placeholder="Calle, número, piso, departamento"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ciudad" className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2">
            Ciudad *
          </label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={shippingData.ciudad}
            onChange={handleShippingChange}
            required
            aria-required="true"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
            placeholder="Ej: Buenos Aires"
          />
        </div>

        <div>
          <label htmlFor="provincia" className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2">
            Provincia *
          </label>
          <input
            type="text"
            id="provincia"
            name="provincia"
            value={shippingData.provincia}
            onChange={handleShippingChange}
            required
            aria-required="true"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
            placeholder="Ej: Buenos Aires"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="codigo-postal" className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2">
            Código Postal *
          </label>
          <input
            type="text"
            id="codigo-postal"
            name="codigoPostal"
            value={shippingData.codigoPostal}
            onChange={handleShippingChange}
            required
            aria-required="true"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
            placeholder="Ej: 1426"
          />
        </div>

        <div>
          <label htmlFor="telefono-envio" className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2">
            Teléfono de contacto *
          </label>
          <input
            type="tel"
            id="telefono-envio"
            name="telefono"
            value={shippingData.telefono}
            onChange={handleShippingChange}
            required
            aria-required="true"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
            placeholder="Ej: +54 11 1234-5678"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notas-envio" className="block text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-2">
          Notas adicionales (opcional)
        </label>
        <textarea
          id="notas-envio"
          name="notas"
          value={shippingData.notas}
          onChange={handleShippingChange}
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
          placeholder="Instrucciones de entrega, horarios preferidos, etc."
        />
      </div>
    </div>
  </div>
);

const PaymentStep = ({ paymentMethod, setPaymentMethod }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">Método de pago</h2>
    
    <fieldset className="space-y-4">
      <legend className="sr-only">Seleccione un método de pago</legend>
      
      <label className="flex items-start gap-4 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors duration-300">
        <input
          type="radio"
          id="pago-credito"
          name="payment"
          value="Tarjeta de Crédito"
          checked={paymentMethod === 'Tarjeta de Crédito'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          aria-label="Pagar con Tarjeta de Crédito"
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-semibold text-text-primary dark:text-text-dark-primary">Tarjeta de Crédito</div>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Visa, Mastercard, American Express</p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">Hasta 12 cuotas sin interés</p>
        </div>
      </label>

      <label className="flex items-start gap-4 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors duration-300">
        <input
          type="radio"
          id="pago-debito"
          name="payment"
          value="Tarjeta de Débito"
          checked={paymentMethod === 'Tarjeta de Débito'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          aria-label="Pagar con Tarjeta de Débito"
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-semibold text-text-primary dark:text-text-dark-primary">Tarjeta de Débito</div>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Pago inmediato desde tu cuenta</p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">5% de descuento</p>
        </div>
      </label>

      <label className="flex items-start gap-4 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors duration-300">
        <input
          type="radio"
          id="pago-transferencia"
          name="payment"
          value="Transferencia Bancaria"
          checked={paymentMethod === 'Transferencia Bancaria'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          aria-label="Pagar con Transferencia Bancaria"
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-semibold text-text-primary dark:text-text-dark-primary">Transferencia Bancaria</div>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">CBU/CVU o alias</p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">10% de descuento</p>
        </div>
      </label>

      <label className="flex items-start gap-4 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors duration-300">
        <input
          type="radio"
          id="pago-efectivo"
          name="payment"
          value="Efectivo"
          checked={paymentMethod === 'Efectivo'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          aria-label="Pagar en Efectivo"
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-semibold text-text-primary dark:text-text-dark-primary">Efectivo</div>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Pago contra entrega</p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">Disponible en CABA y GBA</p>
        </div>
      </label>

      <label className="flex items-start gap-4 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors duration-300">
        <input
          type="radio"
          id="pago-mercadopago"
          name="payment"
          value="MercadoPago"
          checked={paymentMethod === 'MercadoPago'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          aria-label="Pagar con MercadoPago"
          className="mt-1"
        />
        <div className="flex-1">
          <div className="font-semibold text-text-primary dark:text-text-dark-primary">MercadoPago</div>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Pago con tu cuenta de MercadoPago</p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">Protección al comprador</p>
        </div>
      </label>
    </fieldset>
  </div>
);

const ConfirmationStep = ({ cartItems, shippingData, paymentMethod, getCartTotal }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">Confirmar pedido</h2>
    
    <div className="bg-background dark:bg-background-dark rounded-lg p-6 space-y-6 transition-colors duration-300">
      {/* Productos */}
      <div>
        <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-3">Productos ({cartItems.length})</h3>
        <div className="space-y-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-text-secondary dark:text-text-dark-secondary">
                {item.nombre} x{item.quantity}
              </span>
              <span className="font-medium text-text-primary dark:text-text-dark-primary">
                ${(item.precio * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dirección de envío */}
      <div>
        <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2">Dirección de envío</h3>
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
          {shippingData.direccion}<br />
          {shippingData.ciudad}, {shippingData.provincia}<br />
          CP: {shippingData.codigoPostal}<br />
          Tel: {shippingData.telefono}
          {shippingData.notas && (
            <>
              <br />
              <span className="italic">Notas: {shippingData.notas}</span>
            </>
          )}
        </p>
      </div>

      {/* Método de pago */}
      <div>
        <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2">Método de pago</h3>
        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">{paymentMethod}</p>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">Total a pagar:</span>
          <span className="text-2xl font-bold text-primary">
            ${getCartTotal().toFixed(2)}
          </span>
        </div>
      </div>
    </div>

    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 transition-colors duration-300">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        ⚠️ Al confirmar la compra, aceptas nuestros términos y condiciones. 
        Recibirás un email con los detalles de tu pedido.
      </p>
    </div>
  </div>
);

const ProgressIndicator = ({ step }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors duration-300 ${
            step >= s 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
          }`}>
            {s}
          </div>
          {s < 4 && (
            <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${
              step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
            }`} />
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-2 text-xs text-text-secondary dark:text-text-dark-secondary">
      <span className={step === 1 ? 'font-semibold text-primary' : ''}>Revisión</span>
      <span className={step === 2 ? 'font-semibold text-primary' : ''}>Envío</span>
      <span className={step === 3 ? 'font-semibold text-primary' : ''}>Pago</span>
      <span className={step === 4 ? 'font-semibold text-primary' : ''}>Confirmar</span>
    </div>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user, isLoading } = useContext(AuthContext);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingData, setShippingData] = useState({
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    telefono: '',
    notas: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (isLoading) return;

    // Redirigir si no está autenticado
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Redirigir si el carrito está vacío
    if (!cartItems || cartItems.length === 0) {
      navigate('/carrito');
    }
  }, [user, isLoading, cartItems, navigate]);

  // Pre-fill user data if available
  const prefillUserData = async () => {
    try {
        const userProfile = await userService.getProfile();
        if (userProfile) {
            setShippingData(prev => ({
                ...prev,
                direccion: userProfile.direccion || prev.direccion,
                telefono: userProfile.telefono || prev.telefono
                // Note: Ciudad, Provincia, CP are not stored in the user profile in the backend
            }));
        }
    } catch (error) {
        console.error("Error fetching user profile", error);
    }
  };

  // Defensive check for rendering
  if (isLoading || !cartItems) {
    return <div className="min-h-screen pt-24 text-center">Cargando checkout...</div>;
  }

  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen pt-24 text-center">
            <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
             <p>Redirigiendo...</p>
        </div>
    );
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateShipping = () => {
    if (!shippingData.direccion.trim()) {
      setError('La dirección es obligatoria');
      return false;
    }
    if (!shippingData.ciudad.trim()) {
      setError('La ciudad es obligatoria');
      return false;
    }
    if (!shippingData.provincia.trim()) {
      setError('La provincia es obligatoria');
      return false;
    }
    if (!shippingData.codigoPostal.trim()) {
      setError('El código postal es obligatorio');
      return false;
    }
    if (!shippingData.telefono.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');

    if (step === 2) {
      if (!validateShipping()) return;
    }

    if (step === 3) {
      if (!paymentMethod) {
        setError('Debe seleccionar un método de pago');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleFinalizePurchase = async () => {
    try {
      setLoading(true);
      setError('');

      const orderData = {
        items: cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.precio
        })),
        direccionEnvio: `${shippingData.direccion}, ${shippingData.ciudad}, ${shippingData.provincia}, CP: ${shippingData.codigoPostal}. Tel: ${shippingData.telefono}${shippingData.notas ? '. Notas: ' + shippingData.notas : ''}`,
        metodoPago: paymentMethod
      };

      const orden = await orderService.create(orderData);
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a historial de compras con mensaje de éxito
      navigate('/mis-compras', { 
        replace: true, 
        state: { 
          successMessage: `¡Orden #${orden.id} creada exitosamente! Gracias por tu compra.` 
        } 
      });
    } catch (err) {
      console.error('Error al crear orden:', err);
      setError(err.response?.data?.message || 'Error al procesar la compra. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <section aria-label="Proceso de compra" className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-8">Finalizar Compra</h1>
        <div className="bg-surface dark:bg-surface-dark shadow-lg rounded-lg p-8 transition-colors duration-300">
          <ProgressIndicator step={step} />

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {step === 1 && <ReviewStep cartItems={cartItems} getCartTotal={getCartTotal} />}
          {step === 2 && <ShippingStep shippingData={shippingData} handleShippingChange={handleShippingChange} prefillUserData={prefillUserData} />}
          {step === 3 && <PaymentStep paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />}
          {step === 4 && <ConfirmationStep cartItems={cartItems} shippingData={shippingData} paymentMethod={paymentMethod} getCartTotal={getCartTotal} />}

          {/* Botones de navegación */}
          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <button
                onClick={handlePrevStep}
                disabled={loading}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
              >
                Anterior
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={handleNextStep}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleFinalizePurchase}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Confirmar Compra'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;