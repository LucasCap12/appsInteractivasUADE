import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Package, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { productService, categoryService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProductManagement = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precioOriginal: '',
    stock: '',
    categoria: '',
    imagen: '',
    estado: 'nuevo'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getByUser(user.id), // Productos del usuario
        categoryService.getActive()
      ]);
      
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      precioOriginal: '',
      stock: '',
      categoria: '',
      imagen: '',
      estado: 'nuevo'
    });
    setFormErrors({});
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precio: product.precio?.toString() || '',
      precioOriginal: product.precioOriginal?.toString() || '',
      stock: product.stock?.toString() || '',
      categoria: product.categoria || '',
      imagen: product.imagen || '',
      estado: product.estado || 'nuevo'
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este producto?')) {
      return;
    }

    try {
      await productService.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      alert('Producto eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error al eliminar el producto');
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es requerida';
    }

    if (!formData.precio || isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      errors.precio = 'El precio debe ser un número mayor a 0';
    }

    if (formData.precioOriginal && (isNaN(formData.precioOriginal) || parseFloat(formData.precioOriginal) <= 0)) {
      errors.precioOriginal = 'El precio original debe ser un número mayor a 0';
    }

    if (formData.precioOriginal && parseFloat(formData.precioOriginal) <= parseFloat(formData.precio)) {
      errors.precioOriginal = 'El precio original debe ser mayor al precio actual';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (!formData.categoria) {
      errors.categoria = 'La categoría es requerida';
    }

    if (!formData.imagen.trim()) {
      errors.imagen = 'La imagen es requerida';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        precioOriginal: formData.precioOriginal ? parseFloat(formData.precioOriginal) : null,
        stock: parseInt(formData.stock),
        categoria: formData.categoria,
        imagen: formData.imagen.trim(),
        estado: formData.estado,
        vendedor: user.nombreUsuario || user.nombre,
        vendedorId: user.id,
        fechaCreacion: new Date().toISOString()
      };

      if (editingProduct) {
        // Actualizar producto existente
        await productService.update(editingProduct.id, productData);
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
        ));
        alert('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        const newProduct = await productService.create(productData);
        setProducts([newProduct, ...products]);
        alert('Producto creado exitosamente');
      }

      resetForm();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ml-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Productos
              </h1>
              <p className="text-gray-600 mt-1">
                Administrá tus productos publicados
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al inicio
              </Link>
              <button
                onClick={() => setShowForm(true)}
                className="bg-ml-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Producto
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario de producto */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del producto *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue ${
                        formErrors.nombre ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ej: iPhone 15 Pro Max"
                    />
                    {formErrors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.nombre}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue ${
                        formErrors.descripcion ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Descripción detallada del producto..."
                    />
                    {formErrors.descripcion && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.descripcion}</p>
                    )}
                  </div>

                  {/* Precios */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue ${
                          formErrors.precio ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {formErrors.precio && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.precio}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Original (Opcional)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precioOriginal}
                        onChange={(e) => setFormData({ ...formData, precioOriginal: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue ${
                          formErrors.precioOriginal ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {formErrors.precioOriginal && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.precioOriginal}</p>
                      )}
                    </div>
                  </div>

                  {/* Stock y Categoría */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue ${
                          formErrors.stock ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      {formErrors.stock && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue ${
                          formErrors.categoria ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.nombre}>
                            {category.nombre}
                          </option>
                        ))}
                      </select>
                      {formErrors.categoria && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.categoria}</p>
                      )}
                    </div>
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado del producto
                    </label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="usado">Usado</option>
                      <option value="reacondicionado">Reacondicionado</option>
                    </select>
                  </div>

                  {/* Imagen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la imagen *
                    </label>
                    <input
                      type="url"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue ${
                        formErrors.imagen ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {formErrors.imagen && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.imagen}</p>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-ml-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingProduct ? 'Actualizar' : 'Crear'} Producto
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No tenés productos publicados
            </h2>
            <p className="text-gray-600 mb-8">
              ¡Comenzá a vender publicando tu primer producto!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center bg-ml-blue text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Publicar primer producto
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12">
                            <img
                              className="w-12 h-12 rounded-md object-cover"
                              src={product.imagen}
                              alt={product.nombre}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48x48?text=N/A';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.categoria}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(product.precio)}
                        </div>
                        {product.precioOriginal && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.precioOriginal)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-ml-blue hover:text-blue-700 p-2"
                            title="Editar producto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700 p-2"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
