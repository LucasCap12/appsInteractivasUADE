// @TASK: Capa de abstracción para comunicación con API REST del backend (Spring Boot)
// @AI_CONTEXT: Service Layer Pattern - Centraliza lógica de HTTP, evita duplicación en componentes
// @AI_CONTEXT: Interceptor Pattern - apiRequest() inyecta JWT automáticamente en todos los requests
// @SECURITY: JWT token extraído de localStorage 'ml-user' y enviado en Authorization header
// Base URL para las peticiones - usa proxy de Vite configurado en vite.config.js
// Las peticiones a /api/* se redirigen automáticamente a http://localhost:8080/api/*
const API_BASE_URL = '/api';

// @TASK: getAuthToken - Extraer JWT del localStorage
// @OUTPUT: string | null - Token JWT o null si no existe usuario
// @AI_CONTEXT: localStorage key 'ml-user' guarda objeto {email, token, roles, id}
// @SECURITY: Manejo de errores en JSON.parse() evita crashes si data está corrupta
const getAuthToken = () => {
  const user = localStorage.getItem('ml-user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  }
  return null;
};

// @TASK: apiRequest - HTTP client con JWT interceptor y error handling centralizado
// @INPUT: endpoint (string) - Ruta relativa (ej: '/productos', '/auth/login')
// @INPUT: options (object) - Configuración fetch() (method, body, headers, skipAuth)
// @OUTPUT: Promise<object | null> - Parsed JSON response o null si 204 No Content
// @AI_CONTEXT: Interceptor Pattern - Automáticamente agrega Authorization header con JWT
// @AI_CONTEXT: Error Strategy - Parsea ErrorDTO del backend (timestamp, status, message, errors)
// @SECURITY: skipAuth=true omite JWT (usado en /auth/login y /auth/register endpoints públicos)
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // STEP 1: Agregar token JWT si existe y no se especifica skipAuth
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // STEP 2: Ejecutar request con fetch API
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    // STEP 3: Manejar respuesta 204 No Content (sin body)
    if (response.status === 204) {
      return null;
    }

    // STEP 4: Verificar si hay contenido JSON antes de parsear
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    const hasContent = contentType?.includes('application/json') && contentLength !== '0';

    // STEP 5: Error handling - Parsear ErrorDTO del backend
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        
        // Si hay errores de validación detallados (MethodArgumentNotValidException)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.message + ':\n' + errorData.errors.join('\n');
        } else {
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch (e) {
        // Si no hay JSON de error, usar mensaje genérico
      }
      throw new Error(errorMessage);
    }

    // STEP 6: Si la respuesta es exitosa pero no tiene contenido, retornar null
    if (!hasContent) {
      return null;
    }

    // STEP 7: Parsear JSON exitoso
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// @TASK: productService - CRUD completo para productos + búsquedas avanzadas
// @AI_CONTEXT: Facade Pattern - Simplifica interacción con endpoints REST del backend
// @AI_CONTEXT: Todos los métodos retornan Promises (usar async/await o .then()/.catch())
// @SECURITY: create/update/delete requieren JWT. getAll/getById son públicos
export const productService = {
  // Obtener todos los productos
  getAll: async (params = {}) => {
    let endpoint = '/productos';
    
    // Buscar por nombre
    if (params.busqueda) {
      endpoint = `/productos/buscar?termino=${encodeURIComponent(params.busqueda)}`;
    }
    // Filtrar por categoría
    else if (params.categoria) {
      endpoint = `/productos/categoria/${params.categoria}`;
    }
    
    return await apiRequest(endpoint);
  },

  // Obtener producto por ID
  getById: async (id) => {
    return await apiRequest(`/productos/${id}`);
  },

  // Obtener productos por categoría
  getByCategory: async (categoriaId) => {
    return await apiRequest(`/productos/categoria/${categoriaId}`);
  },

  // Obtener productos por usuario (vendedor)
  getByUser: async (usuarioId) => {
    return await apiRequest(`/productos/usuario/${usuarioId}`);
  },

  // Crear nuevo producto (requiere ADMIN)
  create: async (product) => {
    return await apiRequest('/productos', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  // Actualizar producto (requiere ADMIN)
  update: async (id, product) => {
    return await apiRequest(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  // Eliminar producto (requiere ADMIN)
  delete: async (id) => {
    return await apiRequest(`/productos/${id}`, {
      method: 'DELETE',
    });
  },

  // Actualizar stock de producto
  updateStock: async (id, cantidad) => {
    return await apiRequest(`/productos/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ cantidad }),
    });
  },

  // Búsqueda de productos
  search: async (query) => {
    return await apiRequest(`/productos/buscar?termino=${encodeURIComponent(query)}`);
  },

  // Obtener productos en oferta (con descuento)
  getOffers: async () => {
    return await apiRequest('/productos/ofertas');
  }
};

// Servicios para categorías
export const categoryService = {
  // Obtener todas las categorías
  getAll: async () => {
    return await apiRequest('/categorias');
  },

  // Obtener categorías activas (alias para getAll, ya que el backend filtra automáticamente)
  getActive: async () => {
    return await apiRequest('/categorias');
  },

  // Obtener categoría por ID
  getById: async (id) => {
    return await apiRequest(`/categorias/${id}`);
  }
};

// @TASK: authService - Autenticación (login/register)
// @AI_CONTEXT: skipAuth=true en ambos endpoints (no se puede enviar JWT al autenticarse)
// @OUTPUT: {email, token, roles, id} - Backend retorna DTO con JWT en campo 'token'
// @SECURITY: CRITICAL - Guardar respuesta en localStorage 'ml-user' después del login
export const authService = {
  // Login
  login: async (email, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true, // No enviar token en el login
    });
  },

  // Registro
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true, // No enviar token en el registro
    });
  }
};

// @TASK: userService - Gestión de perfil de usuario
// @AI_CONTEXT: getProfile() retorna datos del usuario autenticado (usa JWT subject claim)
// @SECURITY: Todos los endpoints requieren JWT válido
export const userService = {
  // Obtener mi perfil
  getProfile: async () => {
    return await apiRequest('/usuarios/perfil');
  },

  // Actualizar mi perfil
  updateProfile: async (userData) => {
    return await apiRequest('/usuarios/perfil', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Obtener todos los usuarios (requiere ADMIN)
  getAll: async () => {
    return await apiRequest('/usuarios');
  },

  // Obtener usuario por ID (requiere ADMIN)
  getById: async (id) => {
    return await apiRequest(`/usuarios/${id}`);
  }
};

// Servicios para órdenes
export const orderService = {
  // Obtener mis órdenes
  getMyOrders: async () => {
    return await apiRequest('/ordenes');
  },

  // Obtener orden por ID
  getById: async (id) => {
    return await apiRequest(`/ordenes/${id}`);
  },

  // Crear nueva orden
  create: async (orderData) => {
    // orderData debe tener: items, direccionEnvio, metodoPago
    return await apiRequest('/ordenes', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Actualizar estado de orden (requiere ADMIN)
  updateStatus: async (id, estado) => {
    return await apiRequest(`/ordenes/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  },

  // Obtener todas las órdenes (requiere ADMIN)
  getAll: async () => {
    return await apiRequest('/ordenes/todas');
  }
};

// Servicios para favoritos
export const favoritesService = {
  // Obtener mis favoritos
  getFavorites: async () => {
    return await apiRequest('/favoritos');
  },

  // Agregar producto a favoritos
  addFavorite: async (productId) => {
    return await apiRequest(`/favoritos/${productId}`, {
      method: 'POST',
    });
  },

  // Eliminar producto de favoritos
  removeFavorite: async (productId) => {
    return await apiRequest(`/favoritos/${productId}`, {
      method: 'DELETE',
    });
  },

  // Verificar si un producto es favorito
  checkFavorite: async (productId) => {
    return await apiRequest(`/favoritos/check/${productId}`);
  }
};

// @TASK: Funciones de utilidad para formateo y cálculos
// @AI_CONTEXT: Intl.NumberFormat/DateTimeFormat - API nativa del navegador (mejor que librerías externas)

// @TASK: formatPrice - Formatear precio a formato argentino
// @INPUT: price (number) - Precio en ARS
// @OUTPUT: string - Formato "$ 1.500" (sin decimales, separador de miles)
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// @TASK: formatDate - Formatear fecha a formato argentino
// @INPUT: dateString (string) - ISO 8601 string (ej: "2025-01-07T10:30:00")
// @OUTPUT: string - Formato "7 de enero de 2025, 10:30"
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

// @TASK: calculateDiscount - Calcular porcentaje de descuento
// @INPUT: originalPrice (number) - Precio original
// @INPUT: currentPrice (number) - Precio actual con descuento
// @OUTPUT: number - Porcentaje de descuento (0-100)
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
