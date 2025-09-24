import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Truck, Shield, RefreshCw, AlertTriangle } from 'lucide-react';
import { productService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getById(id);
        setProduct(productData);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock < quantity) {
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product, quantity);
      
      // Mostrar mensaje de éxito
      alert(`¡${product.nombre} agregado al carrito!`);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error al agregar al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
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
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Producto no encontrado'}</p>
          <button 
            onClick={() => navigate('/')}
            className="ml-button-primary"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.precioOriginal && product.precioOriginal > product.precio;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.precioOriginal - product.precio) / product.precioOriginal) * 100)
    : 0;

  const images = product.imagenes || [product.imagen];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navegación */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <img
                src={images[selectedImage]}
                alt={product.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=Imagen+no+disponible';
                }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? 'border-ml-blue' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.nombre} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Título y precio */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.nombre}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({product.reviews || Math.floor(Math.random() * 1000) + 100} opiniones)
                </span>
              </div>

              {/* Precio */}
              <div className="mb-4">
                {hasDiscount && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.precioOriginal)}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      {discountPercentage}% OFF
                    </span>
                  </div>
                )}
                <div className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.precio)}
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Stock disponible</h3>
                <span className={`text-lg font-semibold ${
                  product.stock > 10 ? 'text-green-600' : 
                  product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {product.stock > 0 ? `${product.stock} unidades` : 'Sin stock'}
                </span>
              </div>

              {product.stock === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-800 font-medium">
                      Producto sin stock disponible
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Selector de cantidad y botones */}
            {product.stock > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 text-center min-w-[60px]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    (máximo {product.stock})
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="w-full bg-ml-blue text-white py-4 px-6 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {addingToCart ? 'Comprando...' : 'Comprar ahora'}
                  </button>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full border border-ml-blue text-ml-blue py-4 px-6 rounded-md font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            )}

            {/* Beneficios */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-2 text-green-600" />
                  Envío gratis a todo el país
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-blue-600" />
                  Compra protegida
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <RefreshCw className="w-4 h-4 mr-2 text-orange-600" />
                  Devolución gratis
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción detallada */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Descripción del producto
          </h2>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className={`text-gray-700 leading-relaxed ${
              !showFullDescription ? 'line-clamp-6' : ''
            }`}>
              {product.descripcion || 'Descripción no disponible para este producto.'}
            </div>
            
            {product.descripcion && product.descripcion.length > 300 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-4 text-ml-blue hover:text-blue-700 font-medium"
              >
                {showFullDescription ? 'Ver menos' : 'Ver descripción completa'}
              </button>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del producto
            </h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Categoría:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.categoria || 'Sin categoría'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">SKU:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.sku || product.id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Estado:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {product.estado || 'Nuevo'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vendedor
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-ml-blue rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {(product.vendedor || 'ML')[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {product.vendedor || 'ML Marketplace'}
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-600">
                    Vendedor confiable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
