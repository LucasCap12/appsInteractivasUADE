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
import { useNotification } from '../context/NotificationContext';
import { useModalFocus } from '../hooks/useModalFocus';

const ProductManagement = () => {
  const { user } = useContext(AuthContext);
  const { success, error: showError, warning, confirm } = useNotification();
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
    descuento: '',
    stock: '',
    categorias: [], // Array de IDs de categorías
    imagen: '',
    imagenFile: null,
    cuotasSinInteres: '',
    envioGratis: false
  });
  const [formErrors, setFormErrors] = useState({});

  // Focus trap para el formulario
  const formModalRef = useModalFocus(showForm);

  // Cerrar formulario con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showForm) {
        handleCloseForm();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showForm]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getByUser(user.id), // Productos del usuario vendedor
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
      descuento: '',
      stock: '',
      categorias: [],
      imagen: '',
      imagenFile: null,
      cuotasSinInteres: '',
      envioGratis: false
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
      descuento: product.descuento?.toString() || '',
      stock: product.stock?.toString() || '',
      categorias: product.categorias ? product.categorias.map(cat => cat.id) : [],
      imagen: product.imagenUrl || '',
      imagenFile: null,
      cuotasSinInteres: product.cuotasSinInteres?.toString() || '',
      envioGratis: product.envioGratis || false
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    const confirmed = await confirm('¿Estás seguro de que querés eliminar este producto?');
    if (!confirmed) {
      return;
    }

    try {
      await productService.delete(productId);
      setProducts(products.filter(p => p.id !== productId));
      success('Producto eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting product:', err);
      showError('Error al eliminar el producto');
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

    if (formData.descuento && (isNaN(formData.descuento) || parseInt(formData.descuento) < 0 || parseInt(formData.descuento) > 100)) {
      errors.descuento = 'El descuento debe ser un número entre 0 y 100';
    }

    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (!formData.categorias || formData.categorias.length === 0) {
      errors.categorias = 'Debe seleccionar al menos una categoría';
    }

    if (!formData.imagen.trim() && !formData.imagenFile) {
      errors.imagen = 'Debes proporcionar una imagen (URL o archivo)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        warning('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        warning('La imagen es muy grande. Tamaño máximo: 5MB');
        return;
      }

      // Leer archivo y convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ 
          ...formData, 
          imagenFile: file,
          imagen: reader.result // base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const id = parseInt(categoryId);
    setFormData(prev => {
      const currentCategories = prev.categorias || [];
      if (currentCategories.includes(id)) {
        return { ...prev, categorias: currentCategories.filter(c => c !== id) };
      } else {
        return { ...prev, categorias: [...currentCategories, id] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // El precio ingresado es el precio ORIGINAL
      const precio = parseFloat(formData.precio);
      const descuento = formData.descuento ? parseInt(formData.descuento) : 0;
      const cuotasSinInteres = formData.cuotasSinInteres ? parseInt(formData.cuotasSinInteres) : 0;

      const productData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: precio, // Ahora precio es el ORIGINAL
        precioOriginal: null, // No se usa más
        descuento: descuento > 0 ? descuento : null,
        stock: parseInt(formData.stock),
        imagenUrl: formData.imagen.trim(),
        categoriaIds: formData.categorias.map(id => parseInt(id)),
        marca: null,
        envioGratis: formData.envioGratis,
        cuotasSinInteres: cuotasSinInteres
      };

      if (editingProduct) {
        // Actualizar producto existente
        await productService.update(editingProduct.id, productData);
        success('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        await productService.create(productData);
        success('Producto creado exitosamente');
      }

      // Refrescar lista completa desde el backend
      // Esto asegura que tengamos los datos actualizados con IDs correctos
      // y respeta el @CacheEvict del backend
      await loadData();
      
      resetForm();
    } catch (err) {
      console.error('Error saving product:', err);
      const errorMessage = err.message || 'Error desconocido';
      showError(`Error al guardar el producto: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">Gestión de Productos</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                categoria: '',
                imagenUrl: ''
              });
              setShowForm(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg mb-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={product.imagenUrl || 'https://via.placeholder.com/40'} 
                          alt="" 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                          {product.nombre}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.descripcion?.substring(0, 30)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-primary dark:text-text-dark-primary">
                      {formatPrice(product.precio)}
                    </div>
                    {product.descuento > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {product.descuento}% OFF
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {product.stock > 0 ? `${product.stock} unid.` : 'Sin Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.categorias?.map(c => c.nombre).join(', ') || 'Sin categoría'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulario de producto */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div 
              ref={formModalRef}
              className="bg-surface dark:bg-surface-dark rounded-lg max-w-2xl w-full p-6 transition-colors duration-300"
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-title"
              tabIndex="-1"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 id="form-title" className="text-xl font-bold text-text-primary dark:text-text-dark-primary">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Cerrar formulario"
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary">Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      name="precio"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">Categorías</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-surface dark:bg-surface-dark">
                      {categories.map(cat => (
                        <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.categorias?.includes(cat.id) ?? false}
                            onChange={() => handleCategoryChange(cat.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-text-primary dark:text-text-dark-primary">{cat.nombre}</span>
                        </label>
                      ))}
                    </div>
                    {formErrors.categorias && <p className="mt-1 text-xs text-red-500">{formErrors.categorias}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary">Descuento (%)</label>
                    <input
                      type="number"
                      name="descuento"
                      min="0"
                      max="100"
                      value={formData.descuento}
                      onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary">Cuotas s/interés</label>
                    <select
                      name="cuotasSinInteres"
                      value={formData.cuotasSinInteres}
                      onChange={(e) => setFormData({ ...formData, cuotasSinInteres: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary"
                    >
                      <option value="">Ninguna</option>
                      <option value="3">3 Cuotas</option>
                      <option value="6">6 Cuotas</option>
                      <option value="12">12 Cuotas</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.envioGratis}
                        onChange={(e) => setFormData({ ...formData, envioGratis: e.target.checked })}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-5 w-5"
                      />
                      <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">Envío Gratis</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary">Imagen del Producto</label>
                  <div className="mt-1 space-y-3">
                    {/* Opción 1: Subir Archivo */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click para subir</span> o arrastrar</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 1MB)</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    </div>

                    {/* Opción 2: URL (Fallback) */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">O pegar URL:</span>
                      <input
                        type="url"
                        name="imagenUrl"
                        value={formData.imagenUrl}
                        onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-xs bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Preview */}
                    {formData.imagen && (
                      <div className="mt-2 relative w-24 h-24">
                        <img
                          src={formData.imagen}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imagen: '', imagenFile: null, imagenUrl: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-text-primary dark:text-text-dark-primary hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
