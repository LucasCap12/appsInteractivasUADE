import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const { error: showError } = useNotification();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (user && user.rol !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  // Cargar todos los productos
  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrar productos según búsqueda y estado
  useEffect(() => {
    let filtered = products;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm)
      );
    }

    // Filtro por estado
    if (statusFilter === 'active') {
      filtered = filtered.filter(p => p.activo);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(p => !p.activo);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, statusFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = JSON.parse(localStorage.getItem('ml-user'));
      const token = userData?.token;
      const response = await fetch('/api/admin/productos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('No tienes permisos de administrador');
        }
        throw new Error('Error al cargar productos');
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (productId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('ml-user'));
      const token = userData?.token;
      const response = await fetch(
        `/api/admin/productos/${productId}/toggle-activo`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cambiar estado del producto');
      }

      // Recargar productos
      await loadProducts();
    } catch (err) {
      console.error('Error toggling product:', err);
      showError('Error al cambiar estado del producto');
    }
  };

  const handleDelete = async (productId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('ml-user'));
      const token = userData?.token;
      const response = await fetch(
        `/api/admin/productos/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }

      // Cerrar confirmación y recargar
      setDeleteConfirm(null);
      await loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showError('Error al eliminar producto');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!user || user.rol !== 'ADMIN') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      {/* Header */}
      <div className="bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary mr-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </button>
              <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">
                Panel de Administración
              </h1>
            </div>
            <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
              {filteredProducts.length} de {products.length} productos
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm p-6 mb-6 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary dark:text-text-dark-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-text-secondary dark:placeholder-text-dark-secondary transition-colors"
              />
            </div>

            {/* Filtro de estado */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary dark:text-text-dark-secondary w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary transition-colors"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo activos</option>
                <option value="inactive">Solo inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-border-dark">
              <caption className="sr-only">
                Listado de productos del sistema con información de ID, imagen, nombre, vendedor, precio, stock, estado y acciones disponibles
              </caption>
              <thead className="bg-background dark:bg-background-dark">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Imagen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border dark:divide-border-dark">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-background dark:hover:bg-background-dark transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-dark-primary">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.imagenUrl || product.imagen}
                        alt={product.nombre}
                        className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder.svg';
                          }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                        {product.nombre}
                      </div>
                      <div className="text-sm text-text-secondary dark:text-text-dark-secondary truncate max-w-xs">
                        {product.descripcion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary dark:text-text-dark-primary">
                      {product.vendedor 
                        ? `${product.vendedor.nombre} ${product.vendedor.apellido}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-text-dark-primary">
                      {formatPrice(product.precio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        product.stock > 10 ? 'text-green-600 dark:text-green-400' : 
                        product.stock > 0 ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.activo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          title="Ver producto"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(product.id)}
                          className={`${
                            product.activo 
                              ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300' 
                              : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'
                          }`}
                          title={product.activo ? 'Desactivar' : 'Activar'}
                        >
                          {product.activo ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            <CheckCircle className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mensaje si no hay productos */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary dark:text-text-dark-secondary">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface dark:bg-surface-dark rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transition-colors duration-300">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
                Confirmar eliminación
              </h3>
            </div>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
              ¿Estás seguro de que deseas eliminar el producto <strong>{deleteConfirm.nombre}</strong>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-border dark:border-border-dark rounded-md text-text-secondary dark:text-text-dark-secondary hover:bg-background dark:hover:bg-background-dark transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
