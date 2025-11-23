/**
 * @AI_CONTEXT ProductDetail Component - Product Detail Page
 * 
 * ARCHITECTURE PATTERNS:
 * - Container Component Pattern: Manages state, API calls, business logic
 * - Presentational Sub-components: Image gallery, pricing, actions
 * - Context API Integration: Cart, Auth, BrowsingHistory, Notification contexts
 * 
 * STATE MANAGEMENT STRATEGY:
 * - Local State (useState): UI state (loading, error, selectedImage, quantity, etc.)
 * - Context State: Cross-component state (cart, user, history, notifications)
 * - Derived State: hasDiscount, discountPercentage calculated from product data
 * 
 * DATA FETCHING FLOW:
 * STEP 1: useParams() extracts product ID from URL (/products/:id)
 * STEP 2: useEffect dependency [id] triggers loadProduct() on mount/route change
 * STEP 3: productService.getById(id) fetches data from backend /api/productos/{id}
 * STEP 4: addToHistory(productData) tracks user browsing for recommendations
 * 
 * IMAGE GALLERY LOGIC:
 * - images array: product.imagenes || [fallback image] (handles single/multiple images)
 * - selectedImage state: Index-based selection (0-n) for thumbnail navigation
 * - Conditional rendering: Gallery only shown if images.length > 1
 * 
 * ADD-TO-CART FLOW:
 * @TASK handleAddToCart()
 * @INPUT product object, quantity number
 * @OUTPUT Adds product to CartContext, shows notification, handles errors
 * STEP 1: Validate stock availability (product.stock >= quantity)
 * STEP 2: Call addToCart(product, quantity) from CartContext (Observer Pattern triggers re-render)
 * STEP 3: Show success notification with product name
 * STEP 4: Handle errors gracefully with error notification
 * 
 * @SECURITY Ownership Validation (prevents self-purchase):
 * - Checks if user.id === product.vendedor.id
 * - Shows AlertTriangle warning if user tries to buy own product
 * - Disables "Comprar ahora" and "Agregar al carrito" buttons
 * 
 * @ACCESSIBILITY ARIA Labels:
 * - nav aria-label for product navigation
 * - sr-only h1 for screen readers (product name)
 * - aria-label on interactive buttons (Volver, Favoritos, Compartir, quantity controls)
 * - aria-hidden on decorative icons (Lucide icons)
 * - Image alt text with context: "{product.nombre} - Imagen principal"
 * 
 * UX ENHANCEMENTS:
 * - Sticky navigation bar (top-0 z-10) for quick return to previous page
 * - Loading skeleton with animated spinner (animate-spin Tailwind class)
 * - Optimistic UI: Shows "Agregando..." button text while processing
 * - Image error handling: onError fallback to /placeholder.svg
 * - Quantity controls with disabled states (min 1, max stock)
 * - Conditional rendering: Stock warnings (Sin stock, self-purchase)
 */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Truck, Shield, RefreshCw, AlertTriangle, AlertCircle } from 'lucide-react';
import { productService } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { BrowsingHistoryContext } from '../context/BrowsingHistoryContext';
import { useNotification } from '../context/NotificationContext';

const ProductDetail = () => {
  // @AI_CONTEXT URL Parameter Extraction - React Router useParams() hook
  // Extracts dynamic :id segment from route /products/:id
  const { id } = useParams();
  const navigate = useNavigate();
  
  // @AI_CONTEXT Context API Integration (Dependency Injection Pattern)
  // CartContext: addToCart() function to update global cart state
  // AuthContext: user object for ownership validation (prevent self-purchase)
  // BrowsingHistoryContext: addToHistory() tracks viewed products for recommendations
  // NotificationContext: success/error functions for toast notifications
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToHistory } = useContext(BrowsingHistoryContext);
  const { success, error: showError } = useNotification();
  
  // @AI_CONTEXT Local State Management (useState Pattern)
  // product: Full product object from API (null until loaded)
  // loading: Boolean flag for skeleton UI rendering
  // error: Error message string for error state display
  // selectedImage: Index (0-n) for image gallery navigation
  // quantity: User-selected quantity (validated against product.stock)
  // addingToCart: Loading state for optimistic UI button feedback
  // isFavorite: Toggle state for favorite icon (not persisted - demo only)
  // showFullDescription: Expand/collapse for long descriptions
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // @AI_CONTEXT useEffect Data Fetching Pattern
  // @TASK Load product data from backend API on component mount or route change
  // @INPUT id from URL params, addToHistory callback from context
  // @OUTPUT Updates product state, adds to browsing history, handles loading/error states
  // 
  // DEPENDENCY ARRAY [id, addToHistory]:
  // - id: Re-fetch if user navigates to different product (/products/1 → /products/2)
  // - addToHistory: React warns if omitted (ESLint exhaustive-deps rule)
  // 
  // STEP 1: Set loading=true to show skeleton UI
  // STEP 2: Call productService.getById(id) → GET /api/productos/{id}
  // STEP 3: setProduct(productData) with API response
  // STEP 4: addToHistory(productData) tracks product in BrowsingHistoryContext
  // STEP 5: setLoading(false) hides skeleton, reveals content
  // STEP 6: Catch errors → setError('Error al cargar el producto')
  // 
  // @SECURITY No authentication required (public endpoint) - productService.getById() has skipAuth=true
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getById(id);
        setProduct(productData);
        
        // Agregar al historial de navegación
        addToHistory(productData);
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
  }, [id, addToHistory]);

  // @TASK handleAddToCart - Add product to cart with validation
  // @INPUT product object (with stock), quantity number
  // @OUTPUT Calls CartContext.addToCart(), shows notification, updates UI
  // 
  // @AI_CONTEXT Observer Pattern Trigger:
  // - addToCart(product, quantity) updates CartContext state
  // - All components subscribed to CartContext automatically re-render (Header cart count, Cart page)
  // 
  // VALIDATION FLOW:
  // STEP 1: Check product exists and has sufficient stock (product.stock >= quantity)
  // STEP 2: Set addingToCart=true (optimistic UI - button shows "Agregando...")
  // STEP 3: await addToCart(product, quantity) - async operation may involve API call
  // STEP 4: success() notification shows toast: "¡{product.nombre} agregado al carrito!"
  // STEP 5: Error handling with showError() if addToCart fails
  // STEP 6: setAddingToCart=false in finally block (re-enables button)
  // 
  // @ACCESSIBILITY Screen reader announcement via NotificationContext (ARIA live region)
  const handleAddToCart = async () => {
    if (!product || product.stock < quantity) {
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product, quantity);
      
      // Mostrar mensaje de éxito
      success(`¡${product.nombre} agregado al carrito!`);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      showError('Error al agregar al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  // @TASK handleBuyNow - Express checkout flow
  // @INPUT None (uses current product and quantity state)
  // @OUTPUT Adds to cart, navigates to /cart
  // 
  // @AI_CONTEXT Composite Action Pattern:
  // STEP 1: Call handleAddToCart() to add product to cart
  // STEP 2: navigate('/cart') immediately after (no wait for notification)
  // User sees success toast on cart page (NotificationContext persists across routes)
  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  // @TASK handleQuantityChange - Validate and update quantity
  // @INPUT newQuantity number
  // @OUTPUT Updates quantity state if within bounds [1, product.stock]
  // 
  // @VALIDATION Business Rule: Prevent quantity < 1 or > available stock
  // Enforces constraints before updating state (no invalid state possible)
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // @AI_CONTEXT Intl.NumberFormat - Native browser API for i18n formatting
  // Uses es-AR locale for Argentine Peso formatting (ARS)
  // minimumFractionDigits: 0 removes cents (.00) for cleaner display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  // @AI_CONTEXT Loading State UI - Skeleton Pattern
  // Rendered while loading=true (before product data arrives)
  // animate-spin Tailwind class creates infinite rotation animation
  // border-b-2 creates spinner effect (only bottom border visible)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // @AI_CONTEXT Error State UI - Graceful Degradation
  // Rendered if error string is set or product is null after loading
  // Provides navigation escape route (Volver al inicio button)
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Producto no encontrado'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // @AI_CONTEXT Derived State - Calculated from product data (not stored in useState)
  // hasDiscount: Boolean check if original price exists and is higher than current price
  // discountPercentage: Math.round(((original - current) / original) * 100)
  // images: Array fallback pattern (product.imagenes || [single image])
  const hasDiscount = product.precioOriginal && product.precioOriginal > product.precio;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.precioOriginal - product.precio) / product.precioOriginal) * 100)
    : 0;

  // @AI_CONTEXT Image Array Normalization
  // Backend may return:
  // - product.imagenes: Array of image URLs (preferred)
  // - product.imagenUrl or product.imagen: Single URL (legacy/fallback)
  // Wrap single URL in array to unify gallery logic (images.map works for both cases)
  const images = product.imagenes || [product.imagenUrl || product.imagen];

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark dark:text-text-dark-primary">
      {/* @AI_CONTEXT Sticky Navigation Bar - UX Pattern for quick return to previous page
          position: sticky keeps nav visible during scroll
          top-0 z-10 ensures nav stays above content (z-index 10)
          navigate(-1) uses browser history API (back button behavior)
      */}
      <nav aria-label="Navegación del producto" className="bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary"
              aria-label="Volver a la página anterior"
            >
              <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
              Volver
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
              </button>
              <button 
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Compartir producto"
              >
                <Share2 className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* @ACCESSIBILITY sr-only h1 for screen readers (product name announced first)
            Visual h1 exists later in hierarchy, but semantic h1 comes first for a11y
        */}
        <h1 className="sr-only">{product.nombre}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* @AI_CONTEXT Image Gallery Component
              ARCHITECTURE: Main image + thumbnail strip (index-based navigation)
              STATE: selectedImage (0-n) controls which image displays in main view
              CONDITIONAL RENDERING: Thumbnails only shown if images.length > 1
              ERROR HANDLING: onError fallback to /placeholder.svg
              ACCESSIBILITY: Alt text with context ("{product.nombre} - Imagen principal")
          */}
          <section aria-label="Galería de imágenes" className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square bg-surface dark:bg-surface-dark rounded-lg overflow-hidden border dark:border-gray-700">
              <img
                src={images[selectedImage]}
                alt={`${product.nombre} - Imagen principal`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder.svg';
                  e.target.alt = 'Imagen no disponible';
                }}
              />
            </div>

            {/* @AI_CONTEXT Thumbnail Navigation - Index-based Image Gallery
                PATTERN: Button array with conditional styling (selected image has border-primary)
                STATE UPDATE: setSelectedImage(index) on click
                ACCESSIBILITY: Alt text includes position context "Vista {index + 1} de {images.length}"
                CONDITIONAL: Only rendered if images.length > 1 (no gallery for single image)
            */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.nombre} - Vista ${index + 1} de ${images.length}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* @AI_CONTEXT Product Information Section
              LAYOUT: Stacked divs with space-y-6 (24px vertical spacing)
              COMPONENTS:
              - Title + Rating (Star icons with fill-current for filled stars)
              - Pricing (conditional discount badge, line-through original price)
              - Stock availability (color-coded: green > 10, yellow > 0, red = 0)
              - Quantity selector (disabled - button when min/max reached)
              - Action buttons (Comprar ahora, Agregar al carrito)
              - Benefits (Truck, Shield, RefreshCw icons)
          */}
          <div className="space-y-6">
            {/* Título y precio */}
            <div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
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
                          ? 'text-secondary fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-text-secondary dark:text-text-dark-secondary">
                  ({product.reviews || Math.floor(Math.random() * 1000) + 100} opiniones)
                </span>
              </div>

              {/* Precio */}
              <div className="mb-4">
                {hasDiscount && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(product.precioOriginal)}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      {discountPercentage}% OFF
                    </span>
                  </div>
                )}
                <div className="text-4xl font-bold text-text-primary dark:text-text-dark-primary">
                  {formatPrice(product.precio)}
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary">Stock disponible</h3>
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

              {/* Stock warning */}
              {product.stock < 5 && product.stock > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        ¡Últimas unidades disponibles!
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                        <p>Solo quedan {product.stock} unidades en stock. ¡Aprovecha antes de que se agoten!</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* @AI_CONTEXT Conditional Rendering - Stock Management UI
                THREE STATES:
                1. product.stock === 0: Show AlertTriangle warning (red), disable all actions
                2. user.id === product.vendedor?.id: Show self-purchase warning (yellow), disable actions
                3. product.stock > 0 && not owner: Show quantity selector + action buttons
                
                @SECURITY Ownership Validation:
                Prevents users from buying their own products (would create circular transactions)
                Checks: user && product.vendedor?.id === user.id
            */}
            {product.stock > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                {/* Verificar si el usuario es el vendedor del producto */}
                {user && product.vendedor?.id === user.id ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                      <p className="text-yellow-800 font-medium">
                        No puedes comprar tus propios productos
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">Cantidad:</span>
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="px-3 py-2 text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary disabled:text-gray-400 dark:disabled:text-gray-600"
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600 text-center min-w-[60px] text-text-primary dark:text-text-dark-primary">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-3 py-2 text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary disabled:text-gray-400 dark:disabled:text-gray-600"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        (máximo {product.stock})
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                      <button
                        onClick={handleBuyNow}
                        disabled={addingToCart}
                        className="w-full bg-primary text-white py-4 px-6 rounded-md font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Comprar ahora"
                      >
                        {addingToCart ? 'Comprando...' : 'Comprar ahora'}
                      </button>
                      
                      <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="w-full border border-primary text-primary dark:text-primary-light py-4 px-6 rounded-md font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        aria-label="Agregar al carrito"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
                        {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Beneficios */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-text-secondary dark:text-text-dark-secondary">
                  <Truck className="w-4 h-4 mr-2 text-green-600" />
                  Envío gratis a todo el país
                </div>
                <div className="flex items-center text-sm text-text-secondary dark:text-text-dark-secondary">
                  <Shield className="w-4 h-4 mr-2 text-blue-600" />
                  Compra protegida
                </div>
                <div className="flex items-center text-sm text-text-secondary dark:text-text-dark-secondary">
                  <RefreshCw className="w-4 h-4 mr-2 text-orange-600" />
                  Devolución gratis
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción detallada */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-6">
            Descripción del producto
          </h2>
          
          <div className="bg-surface dark:bg-surface-dark rounded-lg p-6 shadow-sm">
            <div className={`text-text-secondary dark:text-text-dark-secondary leading-relaxed ${
              !showFullDescription ? 'line-clamp-6' : ''
            }`}>
              {product.descripcion || 'Descripción no disponible para este producto.'}
            </div>
            
            {product.descripcion && product.descripcion.length > 300 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-4 text-primary hover:text-primary-dark font-medium"
              >
                {showFullDescription ? 'Ver menos' : 'Ver descripción completa'}
              </button>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface dark:bg-surface-dark rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4">
              Información del producto
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-secondary dark:text-text-dark-secondary mb-2">Categorías:</dt>
                <dd className="flex flex-wrap gap-2">
                  {product.categorias && product.categorias.length > 0 ? (
                    product.categorias.map((categoria) => (
                      <span
                        key={categoria.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white"
                      >
                        {categoria.nombre}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">Sin categorías</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-text-secondary dark:text-text-dark-secondary">SKU:</dt>
                <dd className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                  {product.sku || product.id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-text-secondary dark:text-text-dark-secondary">Estado:</dt>
                <dd className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                  {product.estado || 'Nuevo'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-surface dark:bg-surface-dark rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4">
              Vendedor
            </h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {(() => {
                    const vendedorNombre = typeof product.vendedor === 'string' 
                      ? product.vendedor 
                      : product.vendedor?.nombre || 'ML';
                    return vendedorNombre[0]?.toUpperCase() || 'M';
                  })()}
                </span>
              </div>
              <div>
                <p className="font-medium text-text-primary dark:text-text-dark-primary">
                  {typeof product.vendedor === 'string'
                    ? product.vendedor
                    : product.vendedor?.nombre && product.vendedor?.apellido
                      ? `${product.vendedor.nombre} ${product.vendedor.apellido}`
                      : product.vendedor?.nombre || 'ML Marketplace'}
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-secondary fill-current"
                    />
                  ))}
                  <span className="ml-1 text-xs text-text-secondary dark:text-text-dark-secondary">
                    Vendedor confiable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ProductDetail;
