import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  MapPin, 
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';
import { orderService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      
      // Ordenar por fecha descendente (más reciente primero)
      const sortedOrders = (data || []).sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha)
      );
      
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Error al cargar el historial de órdenes');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDIENTE':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'EN_PROCESO':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'ENVIADO':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'ENTREGADO':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELADO':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDIENTE':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'EN_PROCESO':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'ENVIADO':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'ENTREGADO':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'CANCELADO':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN_PROCESO':
        return 'En Proceso';
      case 'ENVIADO':
        return 'Enviado';
      case 'ENTREGADO':
        return 'Entregado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.estado?.toUpperCase() === filterStatus.toUpperCase());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando historial de órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary flex items-center">
                <ShoppingBag className="w-8 h-8 mr-3 text-primary" />
                Historial de Órdenes
              </h1>
              <p className="text-text-secondary dark:text-text-dark-secondary mt-2">
                Consulta el estado de tus compras y detalles de cada orden
              </p>
            </div>
          </div>

          {/* Filter by status */}
          <div className="flex items-center space-x-4 bg-surface dark:bg-surface-dark p-4 rounded-lg shadow-sm transition-colors duration-300">
            <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">Filtrar por estado:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary transition-colors"
            >
              <option value="all">Todas las órdenes</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="ENVIADO">Enviadas</option>
              <option value="ENTREGADO">Entregadas</option>
              <option value="CANCELADO">Canceladas</option>
            </select>
            <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'orden' : 'órdenes'}
            </span>
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-300 font-medium">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm p-12 text-center transition-colors duration-300">
            <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary mb-2">
              {filterStatus === 'all' ? 'No tienes órdenes aún' : 'No hay órdenes con este estado'}
            </h3>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
              {filterStatus === 'all' 
                ? '¡Comienza a comprar para ver tus órdenes aquí!'
                : 'Prueba cambiando el filtro para ver otras órdenes'}
            </p>
            {filterStatus === 'all' && (
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explorar Productos
              </Link>
            )}
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              {/* Order header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
                        Orden #{order.id}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.estado)}`}>
                        {getStatusIcon(order.estado)}
                        <span className="ml-2">{getStatusText(order.estado)}</span>
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-text-secondary dark:text-text-dark-secondary space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(order.fecha)}
                      </div>
                      {order.metodoPago && (
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {order.metodoPago}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'producto' : 'productos'}
                    </p>
                  </div>
                </div>

                {order.direccionEnvio && (
                  <div className="flex items-start text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{order.direccionEnvio}</span>
                  </div>
                )}

                {/* Toggle details button */}
                <button
                  onClick={() => toggleOrderDetails(order.id)}
                  className="w-full flex items-center justify-center py-2 text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <span className="font-medium mr-2">
                    {expandedOrder === order.id ? 'Ocultar detalles' : 'Ver detalles'}
                  </span>
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Order details (collapsible) */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <h4 className="font-semibold text-text-primary dark:text-text-dark-primary mb-4">Productos en esta orden:</h4>
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center justify-between bg-surface dark:bg-surface-dark p-4 rounded-lg transition-colors duration-300"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          {item.producto?.imagenUrl ? (
                            <img
                              src={item.producto.imagenUrl}
                              alt={`Imagen de ${item.producto.nombre} en pedido`}
                              className="w-16 h-16 object-cover rounded-md"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f3f4f6" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="24"%3E?%3C/text%3E%3C/svg%3E';
                                e.target.alt = 'Imagen no disponible';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <Link
                              to={`/productos/${item.producto?.id}`}
                              className="font-medium text-text-primary dark:text-text-dark-primary hover:text-primary"
                            >
                              {item.producto?.nombre || 'Producto'}
                            </Link>
                            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                              Cantidad: {item.cantidad} × {formatPrice(item.precioUnitario)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-text-primary dark:text-text-dark-primary">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order total */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">Total de la orden:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
