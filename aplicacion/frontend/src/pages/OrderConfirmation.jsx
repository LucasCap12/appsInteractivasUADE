import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getById(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Error al cargar orden:', err);
      setError('No se pudo cargar la información del pedido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-lg p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-4">Error</h1>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-6">{error}</p>
            <Link
              to="/"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <div className="text-white text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ¡Compra realizada con éxito!
            </h1>
            <p className="text-white text-opacity-90">
              Tu pedido ha sido registrado correctamente
            </p>
          </div>

          <div className="px-8 py-6 bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800">
            <div className="text-center">
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-1">Número de pedido</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">#{order?.id}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-6">Detalles del pedido</h2>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-3">Productos</h3>
            <div className="space-y-3">
              {order?.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-text-primary dark:text-text-dark-primary">
                      {item.producto?.nombre || 'Producto'}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                      Cantidad: {item.cantidad} × ${item.precioUnitario?.toFixed(2)}
                    </p>
                  </div>
                  <div className="font-semibold text-primary">
                    ${(item.cantidad * item.precioUnitario).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          {order?.direccionEnvio && (
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2">Dirección de envío</h3>
              <p className="text-text-secondary dark:text-text-dark-secondary text-sm whitespace-pre-line">
                {order.direccionEnvio}
              </p>
            </div>
          )}

          {/* Payment Method */}
          {order?.metodoPago && (
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2">Método de pago</h3>
              <p className="text-text-secondary dark:text-text-dark-secondary text-sm">{order.metodoPago}</p>
            </div>
          )}

          {/* Order Status */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-text-primary dark:text-text-dark-primary mb-2">Estado del pedido</h3>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              order?.estado === 'COMPLETADO' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                : order?.estado === 'CANCELADO'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
            }`}>
              {order?.estado || 'PENDIENTE'}
            </span>
          </div>

          {/* Total */}
          <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">Total pagado:</span>
              <span className="text-3xl font-bold text-primary">
                ${order?.total?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">📧 ¿Qué sigue?</h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>• Recibirás un email de confirmación con todos los detalles</li>
            <li>• Te notificaremos cuando tu pedido sea enviado</li>
            <li>• Puedes seguir el estado de tu pedido en "Mis compras"</li>
            <li>• Si tienes consultas, contacta a nuestro soporte</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/mis-compras"
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-200"
          >
            Ver mis compras
          </Link>
          <Link
            to="/"
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-200"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
