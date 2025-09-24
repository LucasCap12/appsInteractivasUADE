const API_BASE_URL = 'http://localhost:3002';

// Función helper para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Servicios para productos
export const productService = {
  // Obtener todos los productos
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.categoria) {
      searchParams.append('categoriaId', params.categoria);
    }
    if (params.busqueda) {
      searchParams.append('q', params.busqueda);
    }
    if (params.limit) {
      searchParams.append('_limit', params.limit);
    }
    if (params.sort) {
      searchParams.append('_sort', params.sort);
      searchParams.append('_order', params.order || 'asc');
    }

    const query = searchParams.toString();
    const endpoint = `/productos${query ? `?${query}` : ''}`;
    
    return await apiRequest(endpoint);
  },

  // Obtener producto por ID
  getById: async (id) => {
    return await apiRequest(`/productos/${id}`);
  },

  // Crear nuevo producto
  create: async (product) => {
    return await apiRequest('/productos', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  // Actualizar producto
  update: async (id, product) => {
    return await apiRequest(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  // Eliminar producto
  delete: async (id) => {
    return await apiRequest(`/productos/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtener productos por usuario
  getByUser: async (userId) => {
    return await apiRequest(`/productos?vendedorId=${userId}`);
  },

  // Búsqueda de productos
  search: async (query, filters = {}) => {
    const searchParams = new URLSearchParams();
    
    if (query) {
      searchParams.append('q', query);
    }
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/productos${queryString ? `?${queryString}` : ''}`;
    
    return await apiRequest(endpoint);
  }
};

// Servicios para categorías
export const categoryService = {
  // Obtener todas las categorías
  getAll: async () => {
    return await apiRequest('/categorias');
  },

  // Obtener categoría por ID
  getById: async (id) => {
    return await apiRequest(`/categorias/${id}`);
  },

  // Obtener categorías activas
  getActive: async () => {
    return await apiRequest('/categorias?activa=true');
  }
};

// Servicios para usuarios
export const userService = {
  // Obtener todos los usuarios
  getAll: async () => {
    return await apiRequest('/usuarios');
  },

  // Obtener usuario por ID
  getById: async (id) => {
    return await apiRequest(`/usuarios/${id}`);
  },

  // Crear nuevo usuario
  create: async (user) => {
    return await apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  // Actualizar usuario
  update: async (id, user) => {
    return await apiRequest(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  // Verificar credenciales
  authenticate: async (email, password) => {
    const usuarios = await apiRequest('/usuarios');
    return usuarios.find(u => u.email === email && u.password === password);
  }
};

// Servicios para órdenes
export const orderService = {
  // Obtener todas las órdenes
  getAll: async () => {
    return await apiRequest('/ordenes');
  },

  // Obtener órdenes por usuario
  getByUser: async (userId) => {
    return await apiRequest(`/ordenes?usuarioId=${userId}`);
  },

  // Crear nueva orden
  create: async (order) => {
    return await apiRequest('/ordenes', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  // Obtener orden por ID
  getById: async (id) => {
    return await apiRequest(`/ordenes/${id}`);
  },

  // Actualizar orden
  update: async (id, order) => {
    return await apiRequest(`/ordenes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  }
};

// Funciones de utilidad
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
