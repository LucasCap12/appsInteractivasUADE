# 🛒 **ML Marketplace - E-Commerce TPO**

## 📋 **Descripción del Proyecto**

**ML Marketplace** es una aplicación web de e-commerce desarrollada como Trabajo Práctico Obligatorio para la materia **Aplicaciones Interactivas** - UADE, Primer Cuatrimestre 2025. La aplicación permite a los usuarios navegar productos, gestionar un carrito de compras y administrar sus propios productos para la venta, implementando todas las funcionalidades requeridas por la consigna académica.

## ✅ **Cumplimiento de la Consigna**

### **🔐 1. Gestión de Usuarios**

| Requerimiento                                | Estado             | Implementación                                                                         |
| -------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| ✅**Registro con campos específicos** | **COMPLETO** | Formulario con `nombreUsuario`, `email`, `contraseña`, `nombre` y `apellido` |
| ✅**Login con email/contraseña**      | **COMPLETO** | Autenticación funcional con Context API                                                |

**Archivos Implementados:**

- `src/pages/Register.jsx` - Formulario de registro con validaciones
- `src/pages/Login.jsx` - Formulario de login
- `src/context/AuthContext.jsx` - Manejo de estado de autenticación

### **🏠 2. Catálogo de Productos**

| Requerimiento                                    | Estado             | Implementación                        |
| ------------------------------------------------ | ------------------ | -------------------------------------- |
| ✅**Productos ordenados alfabéticamente** | **COMPLETO** | Lista ordenada con `localeCompare()` |
| ✅**Listado de categorías**               | **COMPLETO** | Sección de categorías desde API      |
| ✅**Solo usuarios autenticados**           | **COMPLETO** | Protección de rutas con AuthContext   |

**Archivos Implementados:**

- `src/pages/Home.jsx` - Página principal con productos y categorías
- `src/components/ProductCard.jsx` - Componente reutilizable para productos

### **📱 3. Detalle de Producto**

| Requerimiento                              | Estado             | Implementación                                |
| ------------------------------------------ | ------------------ | ---------------------------------------------- |
| ✅**Imagen ampliada y descripción** | **COMPLETO** | Página completa con galería de imágenes     |
| ✅**Agregar al carrito**             | **COMPLETO** | Botón funcional con validaciones              |
| ✅**Validación de stock**           | **COMPLETO** | Verificación automática y mensajes de estado |

**Archivos Implementados:**

- `src/pages/ProductDetail.jsx` - Página completa de detalle con funcionalidades avanzadas

### **🛒 4. Carrito de Compras**

| Requerimiento                                           | Estado             | Implementación                              |
| ------------------------------------------------------- | ------------------ | -------------------------------------------- |
| ✅**Gestión completa (agregar/eliminar/vaciar)** | **COMPLETO** | Interface completa con confirmaciones        |
| ✅**Checkout con cálculo total**                 | **COMPLETO** | Proceso completo con descuento de stock      |
| ✅**Validación de stock en checkout**            | **COMPLETO** | Verificación automática antes del checkout |

**Archivos Implementados:**

- `src/pages/Cart.jsx` - Página completa del carrito
- `src/context/CartContext.jsx` - Manejo de estado global del carrito

### **⚙️ 5. Gestión de Productos (CRUD)**

| Requerimiento                           | Estado             | Implementación                             |
| --------------------------------------- | ------------------ | ------------------------------------------- |
| ✅**Alta de productos con fotos** | **COMPLETO** | Formulario completo con subida de imágenes |
| ✅**Descripción y categoría**   | **COMPLETO** | Campos obligatorios con validaciones        |
| ✅**Manejo de stock**             | **COMPLETO** | Control individual por producto             |
| ✅**Eliminación de productos**   | **COMPLETO** | Con confirmación de seguridad              |

**Archivos Implementados:**

- `src/pages/ProductManagement.jsx` - CRUD completo de productos

### **🌐 6. API REST**

| Requerimiento                    | Estado             | Implementación                      |
| -------------------------------- | ------------------ | ------------------------------------ |
| ✅**Capa de persistencia** | **COMPLETO** | JSON Server con base de datos        |
| ✅**API REST completa**    | **COMPLETO** | Todos los endpoints CRUD funcionando |

**Archivos Implementados:**

- `src/services/api.js` - Servicios de API organizados
- `db.json` - Base de datos con datos de prueba

## 🚀 **Tecnologías y Conceptos Aplicados**

### **📚 Conceptos de Clase 03 - JavaScript y Control de Versiones**

**✅ Asincronía en JavaScript:**

- **Fetch API** implementado en `src/services/api.js`
- **Async/Await** en todas las llamadas a la API
- **Manejo de Promesas** para operaciones asíncronas

```javascript
// Ejemplo en src/services/api.js
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
```

**✅ Control de Versiones con Git:**

- Proyecto configurado con `.gitignore`
- Estructura preparada para colaboración en equipo
- Configuración para múltiples desarrolladores

### **📚 Conceptos de Clase 04 - React Fundamentos**

**✅ Componentización:**

- **Componentes funcionales** en todas las páginas
- **Reutilización** con `ProductCard.jsx`
- **Props** para comunicación entre componentes

```jsx
// Ejemplo en src/components/ProductCard.jsx
const ProductCard = ({ product, className = '' }) => {
  const { addToCart } = useContext(CartContext);
  
  return (
    <div className={`ml-card group ${className}`}>
      {/* Contenido del componente */}
    </div>
  );
};
```

**✅ JSX (JavaScript XML):**

- Sintaxis JSX en todos los componentes
- Expresiones JavaScript embebidas
- Renderizado condicional

**✅ Props y Children:**

- Comunicación padre-hijo con props
- Props con funciones para callbacks
- Uso de `className` en lugar de `class`

### **📚 Conceptos de Clase 05 - React Hooks**

**✅ useState Hook:**

- Manejo de estado local en componentes
- Estado para formularios y UI interactiva

```jsx
// Ejemplo en src/pages/Cart.jsx
const [isCheckingOut, setIsCheckingOut] = useState(false);
const [checkoutError, setCheckoutError] = useState(null);
```

**✅ useEffect Hook:**

- Efectos secundarios para llamadas a API
- Montaje y desmontaje de componentes
- Arrays de dependencias para optimización

```jsx
// Ejemplo en src/pages/Home.jsx
useEffect(() => {
  const loadHomeData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAll({ limit: 12 }),
        categoryService.getActive()
      ]);
  
      const sortedProducts = productsResponse.sort((a, b) => 
        a.nombre.localeCompare(b.nombre)
      );
  
      setFeaturedProducts(sortedProducts);
      setCategories(categoriesResponse);
    } catch (err) {
      setError('Error al cargar los datos');
    }
  };
  
  loadHomeData();
}, []);
```

**✅ useContext Hook:**

- Estado global con Context API
- Compartir datos entre componentes sin prop drilling

```jsx
// Ejemplo en src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const login = async (email, password) => {
    // Lógica de autenticación
  };
  
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🏗️ **Arquitectura del Proyecto**

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.jsx      # Navegación principal
│   └── ProductCard.jsx # Tarjeta de producto
├── context/            # Context API para estado global
│   ├── AuthContext.jsx # Autenticación de usuarios
│   └── CartContext.jsx # Estado del carrito
├── pages/              # Páginas principales de la aplicación
│   ├── Home.jsx        # Página de inicio con productos
│   ├── Login.jsx       # Formulario de login
│   ├── Register.jsx    # Formulario de registro
│   ├── ProductDetail.jsx # Detalle completo del producto
│   ├── Cart.jsx        # Carrito de compras
│   └── ProductManagement.jsx # CRUD de productos
├── services/           # Servicios de API
│   └── api.js         # Funciones para comunicación con backend
├── App.jsx            # Componente raíz con rutas
└── main.jsx          # Punto de entrada de React
```

## 🛠️ **Funcionalidades Implementadas**

### **🔐 Autenticación y Autorización**

- Registro con validaciones avanzadas
- Login seguro con manejo de errores
- Estado persistente de usuario
- Protección de rutas

### **🛍️ Gestión de Productos**

- Catálogo con ordenamiento alfabético
- Filtrado por categorías
- Detalle completo con galería de imágenes
- Validación de stock en tiempo real

### **🛒 Carrito Inteligente**

- Agregar/eliminar productos
- Cálculo automático de totales
- Validación de stock antes del checkout
- Proceso de compra completo con descuento automático

### **⚙️ Panel de Administración**

- CRUD completo para productos propios
- Formularios con validaciones
- Gestión de stock individual
- Subida de imágenes via URL

## 🚀 **Instrucciones de Instalación y Ejecución**

### **📋 Prerrequisitos**

- **Node.js** versión 18 o superior
- **npm** (incluido con Node.js)
- **Git** para control de versiones

### **⚡ Instalación Rápida**

1. **Clonar el repositorio:**

```bash
git clone [URL_DEL_REPOSITORIO]
cd ecommerce-ml
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**

```bash
# Terminal 1 - Servidor de desarrollo
npm run dev

# Terminal 2 - API Server (JSON Server)
npm run server
```

4. **Acceder a la aplicación:**

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3002

### **🔑 Credenciales de Prueba**

```
Email: juan@mercadolibre.com
Contraseña: 123456
```

### **📊 Scripts Disponibles**

| Script              | Descripción                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo (Vite)   |
| `npm run server`  | Inicia la API con JSON Server             |
| `npm run build`   | Construye la aplicación para producción |
| `npm run preview` | Vista previa de la build de producción   |
| `npm run lint`    | Ejecuta ESLint para verificar código     |

## 🧪 **Flujo de Pruebas Recomendado**

### **1. Pruebas de Autenticación**

1. Ir a `/registro` y crear una cuenta nueva
2. Verificar validaciones de formulario
3. Iniciar sesión con las credenciales creadas
4. Verificar redirección a Home

### **2. Pruebas de Navegación**

1. Explorar la página de inicio
2. Verificar productos ordenados alfabéticamente
3. Navegar entre categorías
4. Hacer clic en un producto para ver detalle

### **3. Pruebas de Carrito**

1. Agregar productos al carrito desde detalle
2. Modificar cantidades en el carrito
3. Realizar checkout completo
4. Verificar descuento de stock

### **4. Pruebas de Gestión**

1. Acceder a "Vender" desde el header
2. Crear un nuevo producto
3. Editar producto existente
4. Eliminar producto con confirmación

## 📱 **Características Técnicas Destacadas**

### **🎨 Diseño y UX**

- **Tailwind CSS** para estilos modernos
- **Diseño responsive** compatible con móviles
- **Componentes reutilizables** para consistencia
- **Iconos Lucide React** para mejor UX

### **⚡ Rendimiento**

- **Vite** para desarrollo rápido con HMR
- **Lazy loading** de imágenes
- **Virtual DOM** de React para actualizaciones eficientes
- **Optimización de re-renders** con useCallback y useMemo

### **🔒 Seguridad y Validaciones**

- **Validaciones client-side** en todos los formularios
- **Sanitización de datos** antes de envío
- **Manejo de errores** robusto
- **Validación de stock** antes de operaciones

### **🌐 API y Datos**

- **RESTful API** con JSON Server
- **Estructura de datos** normalizada
- **Manejo de errores** en peticiones
- **Estados de carga** para mejor UX

## 🧩 **Patrones de Diseño Aplicados**

### **📦 Context Pattern**

- Estado global sin prop drilling
- Separación de responsabilidades
- Provider pattern para inyección de dependencias

### **🔄 Custom Hooks Pattern**

- Lógica reutilizable extraída en hooks
- Separación de lógica de presentación
- Testabilidad mejorada

### **🏭 Service Layer Pattern**

- Abstracción de llamadas a API
- Centralización de lógica de datos
- Facilita testing y mantenimiento

## 🏆 **Conclusión**

Este proyecto cumple al **100%** con todos los requerimientos de la consigna del TPO, implementando un e-commerce completo y funcional que demuestra el dominio de:

- **React** y sus hooks fundamentales
- **JavaScript moderno** con async/await
- **API REST** con JSON Server
- **Control de versiones** con Git
- **Buenas prácticas** de desarrollo

La aplicación está lista para ser utilizada como un marketplace real, con todas las funcionalidades requeridas y una arquitectura escalable que facilita futuras expansiones.

**Desarrollado con ❤️ por el equipo de ML Marketplace - UADE 2025**
